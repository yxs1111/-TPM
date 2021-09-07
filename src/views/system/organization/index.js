import requestApi from '@/api/request-api'
import organizationApi from '@/api/system/organization-api'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { getDefaultPermissions } from '@/utils'

const url = organizationApi.url

export default {
  name: 'OrganizationInfo',
  directives: { elDragDialog, permission },
  filters: {
    // 锁定状态样式
    lockedStatusFilter(status) {
      const statusMap = {
        '0': 'success',
        '1': 'danger'
      }
      return statusMap[status]
    },
    // 锁定状态文字
    lockedWordFilter(locked) {
      const lockedMap = {
        '0': '未锁定',
        '1': '已锁定'
      }
      return lockedMap[locked]
    }
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value && value.indexOf('_child_') > -1) {
        callback(new Error('请修改组织编码'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('组织名称不能为空'))
      } else if (value.indexOf('新增组织') > -1) {
        callback(new Error('请修改组织名称'))
      } else {
        callback()
      }
    }
    return {
      filterText: '',
      searchLoading: false,
      saveLoading: false,
      rules: {
        parentCode: [{ required: true, message: '父级编码不能为空', trigger: 'blur' }],
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
      editDisabled: true,
      multipleSelection: [],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: {
        update: '保存',
        create: '新增',
        info: '查看'
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      organizationDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          parentCode: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      treeProps: {
        data: []
      },
      organizationProps: {
        id: '',
        parentCode: '',
        name: '',
        code: '',
        remark: '',
        locked: 0,
        sorting: 0
      },
      editState: 'update',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      editVisible: false,
      nodeEditing: false,
      currentNodeKey: '',
      childCode: '',
      currentChild: null,
      removing: {
        node: null,
        data: null
      },
      removeWarn: '确认删除选中的组织？',
      activeName: 'organizationInfo',
      // 对话框
      centerDialogVisible: false,
      userVisible: true,
      userQuery: {
        input: '',
        select: 'name'
      },
      userPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      permissions: getDefaultPermissions()
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    },
    filterText(val) {
      this.$refs['organizationTree'].filter(val)
    }
  },
  methods: {
    // 组织搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    },
    // 查询方法
    fetchData() {
      this.searchLoading = true
      organizationApi.getAll().then(response => {
        this.editVisible = false
        this.treeProps.data = [{
          children: [],
          code: 'root',
          name: '组织目录'
        }]
        if (response.data) {
          this.treeProps.data[0] = response.data
        }
        this.searchLoading = false
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['organizationForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = this.organizationProps
          if (this.editState === 'update') {
            requestApi.update(url, params).then(res => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.changeNodeProps()
                Message.success({
                  message: '更新成功',
                  duration: 5 * 1000
                })
              }
            }).catch(error => {
              this.saveLoading = false
              console.log(error)
            })
          } else if (this.editState === 'create') {
            requestApi.save(url, params).then(res => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.changeNodeProps()
                this.currentNodeKey = this.organizationProps.code
                this.editState = 'update'
                this.userVisible = true
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
              }
            }).catch(error => {
              this.saveLoading = false
              console.log(error)
            })
          }
        }
      })
    },
    // 更改节点属性
    changeNodeProps() {
      const node = this.$refs['organizationTree'].getCurrentNode()
      const oldParentCode = node.parentCode
      const newParentCode = this.organizationProps.parentCode
      const nodeCode = this.organizationProps.code
      const newChildren = []
      const newParent = this.$refs['organizationTree'].getNode(newParentCode)
      this.setOrganizationVal(this.organizationProps, node)
      node.isNew = 0
      this.currentNodeKey = nodeCode
      // 如果父级编码变动，则重新调整node位置
      if (oldParentCode !== newParentCode) {
        const oldParent = this.$refs['organizationTree'].getNode(oldParentCode)
        if (!newParent.data.children) {
          newParent.data.children = []
        }
        const index = oldParent.data.children.findIndex(d => d.code === nodeCode)
        oldParent.data.children.splice(index, 1)
        newParent.data.children.push(node)
        // 如果父级编码未展开，则展开
        if (!newParent.expanded) {
          newParent.expanded = true
        }
      }
      // 排序并重新设置节点数据 start
      newParent.data.children.map(child => {
        newChildren.push(child)
      })
      newParent.data.children = []
      newChildren.sort(function(a, b) {
        const x = a.sorting
        const y = b.sorting
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
      this.$nextTick(() => {
        newParent.data.children = newChildren
      })
    },
    // 显示删除确认框
    showDeleteDialog() {
      this.centerDialogVisible = true
    },
    /* *
    * 点击节点，根据nodeEditing字段的状态，如果点击新增或删除时，不对点击事件响应
    * 其他情况，折叠或展开节点
    * 点击新增时，选中新增节点
    */
    handleNodeClick(data, node) {
      this.userVisible = !(data.isNew && data.isNew === 1)
      if (this.nodeEditing) {
        // 新增时，如果没有展开节点，则先展开节点
        if (!node.expanded) {
          node.expanded = true
        }
        // 修改当前选中为新增子节点
        if (this.currentChild) {
          const childCode = this.currentChild.code
          this.$refs['organizationTree'].setCurrentKey(childCode)
          this.currentNodeKey = childCode
          this.clearOrganizationProps()
          this.activeOrganizationInfo()
          this.editState = 'create'
          this.setOrganizationVal(this.currentChild, this.organizationProps)
          this.organizationProps.code = childCode
          this.editVisible = true
          this.userVisible = false
          this.currentChild = null
        }
        this.nodeEditing = false
      }
    },
    // 清理编辑框
    clearOrganizationProps() {
      const source = {}
      this.setOrganizationVal(source, this.organizationProps)
    },
    // 设置属性
    setOrganizationVal(source, target) {
      if (source && target) {
        target.id = source.id || ''
        target.code = source.code || ''
        target.parentCode = source.parentCode || ''
        target.name = source.name || ''
        target.remark = source.remark || ''
        target.locked = source.locked || 0
        target.sorting = source.sorting || 0
      }
    },
    // 选中的子元素发生变化
    handleCurrentChange(data, node) {
      if (this.$refs['organizationForm']) {
        this.$refs['organizationForm'].clearValidate()
      }
      if (data) {
        this.activeOrganizationInfo()
        if (data.isNew && data.isNew === 1) {
          this.editState = 'create'
        } else {
          this.editState = 'update'
        }
        this.setOrganizationVal(data, this.organizationProps)
        this.currentNodeKey = this.organizationProps.code
        this.editVisible = (data.code !== 'root')
      } else {
        this.editVisible = false
        this.currentNodeKey = ''
      }
    },
    // 将活动标签改为组织信息
    activeOrganizationInfo() {
      this.activeName = 'organizationInfo'
      this.clearUserPageProps()
    },
    // 增加子元素
    append(node, data) {
      this.nodeEditing = true
      this.editState = 'create'
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      const index = data.children.length + 1
      const parentCode = data.code
      const childCode = parentCode + '_child_' + index
      const childName = '新增组织' + index
      const newChild = { parentCode: parentCode, code: childCode, name: childName, children: [], locked: 0, sorting: 0, isNew: 1 }
      data.children.push(newChild)
      this.currentChild = {}
      this.setOrganizationVal(newChild, this.currentChild)
    },
    // 删除确认
    handleRemove(node, data) {
      this.removing.node = node
      this.removing.data = data
      if (data.children && data.children.length > 0) {
        this.removeWarn = '确认删除选中的组织及其子组织？'
      } else {
        this.removeWarn = '确认删除选中的组织？'
      }
      this.centerDialogVisible = true
    },
    // 删除子元素
    remove() {
      this.centerDialogVisible = false
      this.nodeEditing = true
      let real = false
      // 真实数据才请求后台
      if (!(this.removing.data.isNew && this.removing.data.isNew === 1)) {
        real = true
        const params = []
        params.push(this.removing.data.code)
        requestApi.remove(url, params).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '删除成功',
              duration: 5 * 1000
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }
      if (!real) {
        Message.success({
          message: '删除成功',
          duration: 5 * 1000
        })
      }
      const parent = this.removing.node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.code === this.removing.data.code)
      children.splice(index, 1)
      this.removing.node = null
      this.removing.data = null
      this.editVisible = false
    },
    // 当前活动页面为权限信息时，执行查询
    handleCollapseChange(activeName) {
      if (activeName === 'userInfo') {
        this.searchUser()
      }
    },
    // 查询人员信息
    searchUser() {
      this.searchLoading = true
      const params = {}
      if (this.userQuery.select === 'phone') {
        params.phone = this.userQuery.input
      } else {
        params.userName = this.userQuery.input
      }
      params.orgId = this.organizationProps.id
      params.pageSize = this.userPageProps.pageSize
      params.pageNum = this.userPageProps.pageNum
      organizationApi.pageBindOrgMembers(params).then(response => {
        const { data } = response
        this.userPageProps.records = data.records
        this.userPageProps.total = data.total
        this.userPageProps.pageNum = data.pageNum
        this.userPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row) {
      this.$refs['userTable'].toggleRowSelection(row)
    },
    // 当前页变更
    handleCurrentPageChange(num) {
      this.userPageProps.pageNum = num
      this.searchUser()
    },
    // 每页显示条数改变
    handlePageSizeChange(size) {
      this.userPageProps.pageSize = size
      this.searchUser()
    },
    // 清除权限页面信息
    clearUserPageProps() {
      this.userPageProps.records = null
      this.userPageProps.total = 0
      this.userPageProps.pageSize = 10
      this.userPageProps.pageNum = 1
    },
    // 转到用户页面
    toUserPage() {
      this.$router.push({
        name: 'UserInfo',
        params: {
          orgCode: this.currentNodeKey
        }
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    }
  }
}

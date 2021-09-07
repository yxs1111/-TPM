import requestApi from '@/api/request-api'
import groupApi from '@/api/system/group-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = groupApi.url

export default {
  name: 'GroupInfo',
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
    return {
      searchLoading: false,
      saveLoading: false,
      editDisabled: true,
      multipleSelection: [],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: getTextMap(),
      rules: {
        name: [{ required: true, message: '用户组名称不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      groupDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      groupMemberDialog: {
        visible: false
      },
      groupRoleDialog: {
        visible: false
      },
      groupQuery: {
        name: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      groupPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      transferUserProps: {
        data: [],
        value: [],
        groupCode: ''
      },
      transferRoleProps: {
        data: [],
        value: [],
        groupCode: ''
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions()
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  methods: {
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.groupQuery.dataRange && this.groupQuery.dataRange !== '') {
        this.groupQuery.startDate = this.groupQuery.dataRange[0]
        this.groupQuery.endDate = this.groupQuery.dataRange[1]
      } else {
        this.groupQuery.startDate = ''
        this.groupQuery.endDate = ''
      }
      requestApi.getPage(url, {
        name: this.groupQuery.name, locked: this.groupQuery.locked,
        startDate: this.groupQuery.startDate, endDate: this.groupQuery.endDate,
        pageSize: this.groupPageProps.pageSize, pageNum: this.groupPageProps.pageNum
      }).then(response => {
        const { data } = response
        this.groupPageProps.records = data.records
        this.groupPageProps.total = data.total
        this.groupPageProps.pageNum = data.pageNum
        this.groupPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['groupDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.groupDialog.data)
          if (this.groupDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.groupDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
                this.fetchData()
              }
            })
          } else {
            requestApi.update(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                if (this.groupDialog.data.version) {
                  this.groupDialog.data.version++
                }
                const index = this.groupPageProps.records.findIndex(v => v.id === this.groupDialog.data.id)
                this.groupPageProps.records.splice(index, 1, this.groupDialog.data)
                this.groupDialog.visible = false
                Message.success({
                  message: '更新成功',
                  duration: 5 * 1000
                })
              }
            })
          }
        }
      })
    },
    // 显示删除确认框
    showDeleteDialog() {
      this.centerDialogVisible = true
    },
    // 删除方法
    handleDeleteRows() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.centerDialogVisible = false
        const codes = []
        this.multipleSelection.map(row => {
          codes.push(row.code)
        })
        requestApi.remove(url, codes).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '删除成功',
              duration: 5 * 1000
            })
            this.fetchData()
          }
        })
      }
    },
    // 单个删除
    handleDelete(row) {
      this.$refs['groupTable'].clearSelection()
      this.$refs['groupTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.groupPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.groupPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['groupForm'].resetFields()
      this.groupQuery.dataRange = ''
      this.groupPageProps.records = null
      this.groupPageProps.total = 0
      this.groupPageProps.pageSize = 10
      this.groupPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['groupTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['groupTable'].clearSelection()
      this.$refs['groupTable'].toggleRowSelection(row)
      this.getRowData(row)
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    },
    // 行样式
    tableRowClassName({ row }) {
      if (row.locked === 1) {
        return 'warning-row'
      } else if (row.locked === 3) {
        return 'success-row'
      }
      return ''
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetGroupDialog()
      this.groupDialog.visible = true
      this.groupDialog.data = Object.assign({}, row)
      this.groupDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetGroupDialog()
      this.groupDialog.visible = true
      this.groupDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetGroupDialog()
      this.groupDialog.data.gender = 0
      this.groupDialog.data.locked = 0
      this.groupDialog.visible = true
      this.groupDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.groupDialog.state = 'update'
    },
    // 重置信息页面
    resetGroupDialog() {
      this.$nextTick(() => {
        if (this.$refs['groupDataForm']) {
          this.$refs['groupDataForm'].clearValidate()
        }
      })
      this.groupDialog.data = {
        id: undefined,
        name: '',
        code: '',
        locked: 0,
        createBy: null,
        createDate: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 管理组成员
    editGroupMember() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.transferUserProps.groupCode = this.multipleSelection[0].code
        this.groupMemberDialog.visible = true
        groupApi.getUserPage({ pageSize: 100, pageNum: 1 }).then(res => {
          if (res.data) {
            this.transferUserProps.data = res.data.records
            groupApi.listBindGroupMembers({ groupCode: this.transferUserProps.groupCode })
              .then(member => {
                if (member.data) {
                  this.transferUserProps.value = member.data
                }
              })
          }
        }).catch(error => console.log(error))
      }
    },
    // 保存组成员
    saveMembers() {
      this.groupMemberDialog.visible = false
      groupApi.bindGroupMember({ groupCode: this.transferUserProps.groupCode, userIds: this.transferUserProps.value })
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '绑定成功',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    },
    // 管理组角色
    editGroupRole() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.transferRoleProps.groupCode = this.multipleSelection[0].code
        this.groupRoleDialog.visible = true
        groupApi.getRolePage({ pageSize: 100, pageNum: 1 }).then(res => {
          if (res.data) {
            debugger
            this.transferRoleProps.data = res.data.records
            groupApi.listBindRoles({ groupCode: this.transferRoleProps.groupCode })
              .then(role => {
                debugger
                if (role.data) {
                  this.transferRoleProps.value = role.data
                }
              })
          }
        }).catch(error => console.log(error))
      }
    },
    // 保存组成员
    saveRoles() {
      this.groupRoleDialog.visible = false
      groupApi.bindRole({ groupCode: this.transferRoleProps.groupCode, roleCodes: this.transferRoleProps.value })
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '绑定成功',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    }
  }
}

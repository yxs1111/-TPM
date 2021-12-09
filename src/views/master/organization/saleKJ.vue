<template>
  <div class="app-container">
    <div class="treeWrap">
      <!--搜索框-->
      <el-input v-model="filterText" placeholder="输入组织名称进行过滤" clearable />
      <!--组织树 属性：draggable，拖拽排序待后期完善-->
      <el-tree ref="organizationTree" class="filter-tree" :data="treeProps.data" :props="defaultProps" :current-node-key="currentNodeKey" :filter-node-method="filterNode" accordion
        node-key="code" highlight-current :expand-on-click-node="true" :default-expanded-keys="['root']" @node-click="handleNodeClick" @current-change="handleCurrentChange">
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <span class="info">
              {{ node.label }}
            </span>
            <span v-if="data.locked === 1" class="danger">
              （已锁定）
            </span>
            <span v-if="data.isNew && data.isNew === 1" class="danger">*</span>
          </span>
          <span v-if="currentNodeKey === data.code">
            <el-button v-if="!(data.isNew && data.isNew === 1)" type="text" size="mini" @click="() => append(node,data)">
              添加子组织
            </el-button>
            <el-button v-if="data.code !== 'root'" type="text" size="mini" class="danger" @click="() => handleRemove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <!--编辑窗口-->
    <div v-show="editVisible" class="tableWrap">
      <el-collapse v-model="activeName" accordion @change="handleCollapseChange">
        <el-collapse-item title="组织信息" name="organizationInfo">
          <el-form ref="organizationForm" size="small" :rules="rules" :model="organizationProps" label-width="150px" border>
            <el-form-item label="父级编码" prop="parentCode">
              <el-input v-model="organizationProps.parentCode" maxlength="50" placeholder="父级编码" show-word-limit />
            </el-form-item>
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="organizationProps.name" maxlength="100" :clearable="true" placeholder="组织名称" show-word-limit />
            </el-form-item>
            <el-form-item label="组织编码" prop="code">
              <el-input v-if="editState === 'create'" v-model="organizationProps.code" maxlength="50" :clearable="true" placeholder="组织编码" show-word-limit />
              <span v-else>{{ organizationProps.code }}</span>
            </el-form-item>
            <el-form-item label="排序" prop="sorting">
              <el-input-number v-model="organizationProps.sorting" :min="0" :max="999999" :clearable="true" />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="organizationProps.remark" type="textarea" maxlength="120" show-word-limit :clearable="true" placeholder="描述" />
            </el-form-item>
            <el-form-item label="锁定状态" prop="locked">
              <el-switch v-model="organizationProps.locked" active-text="已锁定" inactive-text="未锁定" :active-value="1" :inactive-value="0" active-color="#ff4949"
                inactive-color="#13ce66" />
            </el-form-item>
            <el-form-item>
              <el-button @click="editVisible=false"  >关闭</el-button>
              <el-button :type="editState === 'update' ? 'primary' : 'success'" @click="saveOrUpdate" >
                {{ textMap[editState] }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item v-show="userVisible" title="成员信息" name="userInfo">
          <!--查询条件-->
          <el-form ref="userForm" :inline="true" :model="userQuery" class="demo-form-inline">
            <el-form-item prop="input">
              <el-input v-model="userQuery.input" placeholder="请输入" maxlength="50" clearable @keyup.enter.native="searchUser">
                <el-select slot="prepend" v-model="userQuery.select" placeholder="请选择" style="width: 125px;">
                  <el-option label="用户名称" value="name" />
                  <el-option label="电话号码" value="phone" />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchUser">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toUserPage">编辑成员</el-button>
            </el-form-item>
          </el-form>
          <!--查询结果-->
          <el-table ref="userTable" :data="userPageProps.records" border fit stripe height="490" highlight-current-row size="mini" @row-click="handleCurrentRowClick">
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="用户名称" align="center">
              <template slot-scope="{row}">
                {{ row.userName }}
              </template>
            </el-table-column>
            <el-table-column label="电话号码" align="center">
              <template slot-scope="{row}">
                {{ row.phone }}
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination background small layout="total, sizes, prev, pager, next, jumper" :total="userPageProps.total" :page-size="userPageProps.pageSize"
            :current-page="userPageProps.pageNum" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--删除提示框-->
    <el-dialog v-el-drag-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center @dragDialog="handleDrag">
      <span>{{ removeWarn }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="remove">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
        0: 'success',
        1: 'danger',
      }
      return statusMap[status]
    },
    // 锁定状态文字
    lockedWordFilter(locked) {
      const lockedMap = {
        0: '未锁定',
        1: '已锁定',
      }
      return lockedMap[locked]
    },
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
      rules: {
        parentCode: [
          { required: true, message: '父级编码不能为空', trigger: 'blur' },
        ],
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
      },
      editDisabled: true,
      multipleSelection: [],
      stateMap: {
        1: '1',
        0: '0',
      },
      textMap: {
        update: '保存',
        create: '新增',
        info: '查看',
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' },
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
          createDate: null,
        },
        formLabelWidth: '120px',
      },
      treeProps: {
        data: [],
      },
      organizationProps: {
        id: '',
        parentCode: '',
        name: '',
        code: '',
        remark: '',
        locked: 0,
        sorting: 0,
      },
      editState: 'update',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      editVisible: false,
      nodeEditing: false,
      currentNodeKey: '',
      childCode: '',
      currentChild: null,
      removing: {
        node: null,
        data: null,
      },
      removeWarn: '确认删除选中的组织？',
      activeName: 'organizationInfo',
      // 对话框
      centerDialogVisible: false,
      userVisible: true,
      userQuery: {
        input: '',
        select: 'name',
      },
      userPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      permissions: getDefaultPermissions(),
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
    },
  },
  methods: {
    // 组织搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    },
    // 查询方法
    fetchData() {
      organizationApi.getAll().then((response) => {
        this.editVisible = false
        this.treeProps.data = [
          {
            children: [],
            code: 'root',
            name: '组织目录',
          },
        ]
        if (response.data) {
          this.treeProps.data[0] = response.data
        }
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['organizationForm'].validate((valid) => {
        if (valid) {
          const params = this.organizationProps
          if (this.editState === 'update') {
            requestApi
              .update(url, params)
              .then((res) => {
                if (res && res.code === 1000) {
                  this.changeNodeProps()
                  Message.success({
                    message: '更新成功',
                    duration: 5 * 1000,
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else if (this.editState === 'create') {
            requestApi
              .save(url, params)
              .then((res) => {
                if (res && res.code === 1000) {
                  this.changeNodeProps()
                  this.currentNodeKey = this.organizationProps.code
                  this.editState = 'update'
                  this.userVisible = true
                  Message.success({
                    message: '新增成功',
                    duration: 5 * 1000,
                  })
                }
              })
              .catch((error) => {
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
        const index = oldParent.data.children.findIndex(
          (d) => d.code === nodeCode
        )
        oldParent.data.children.splice(index, 1)
        newParent.data.children.push(node)
        // 如果父级编码未展开，则展开
        if (!newParent.expanded) {
          newParent.expanded = true
        }
      }
      // 排序并重新设置节点数据 start
      newParent.data.children.map((child) => {
        newChildren.push(child)
      })
      newParent.data.children = []
      newChildren.sort(function (a, b) {
        const x = a.sorting
        const y = b.sorting
        return x < y ? -1 : x > y ? 1 : 0
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
        this.editVisible = data.code !== 'root'
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
      const newChild = {
        parentCode: parentCode,
        code: childCode,
        name: childName,
        children: [],
        locked: 0,
        sorting: 0,
        isNew: 1,
      }
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
        requestApi
          .remove(url, params)
          .then((res) => {
            if (res && res.code === 1000) {
              Message.success({
                message: '删除成功',
                duration: 5 * 1000,
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
      if (!real) {
        Message.success({
          message: '删除成功',
          duration: 5 * 1000,
        })
      }
      const parent = this.removing.node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(
        (d) => d.code === this.removing.data.code
      )
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
      const params = {}
      if (this.userQuery.select === 'phone') {
        params.phone = this.userQuery.input
      } else {
        params.userName = this.userQuery.input
      }
      params.orgId = this.organizationProps.id
      params.pageSize = this.userPageProps.pageSize
      params.pageNum = this.userPageProps.pageNum
      organizationApi
        .pageBindOrgMembers(params)
        .then((response) => {
          const { data } = response
          this.userPageProps.records = data.records
          this.userPageProps.total = data.total
          this.userPageProps.pageNum = data.pageNum
          this.userPageProps.pageSize = data.pageSize
        })
        .catch((error) => {
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
          orgCode: this.currentNodeKey,
        },
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.treeWrap {
  float: left;
  width: 40%;
}
.tableWrap {
  float: right;
  width: 58%;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.danger {
  color: #f56c6c;
}
.info {
  font-size: 16px;
}
</style>

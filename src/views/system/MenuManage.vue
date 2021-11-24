<template>
  <div class="app-container">
    <div class="treeWrap">
      <!--查询条件-->
      <el-form ref="menuForm" :inline="true" :model="menuQuery" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="menuQuery.currentOsCode" filterable placeholder="所属系统" @change="fetchData">
            <el-option v-for="item in osSelectOption" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="fetchData">刷新</el-button>
        </el-form-item>
      </el-form>
      <!--搜索框-->
      <el-input v-model="filterText" placeholder="输入菜单名称进行过滤" clearable />
      <!--菜单树 属性：draggable，拖拽排序待后期完善-->
      <el-tree ref="menuTree" class="filter-tree" :data="treeProps.data" :props="defaultProps" :current-node-key="currentNodeKey" :filter-node-method="filterNode" accordion
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
            <el-button v-if="!(data.isNew && data.isNew === 1) && node.level < 4" type="text" size="mini" @click="() => append(node,data)">
              添加子菜单
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
        <el-collapse-item title="菜单信息" name="menuInfo">
          <el-form ref="menuInfoForm" size="small" :rules="rules" :model="menuInfoProps" label-width="150px" border>
            <el-form-item label="父级编码" prop="parentCode">
              <el-input v-if="editState === 'update'" v-model="menuInfoProps.parentCode" maxlength="50" placeholder="父级编码" show-word-limit />
              <span v-else>{{ menuInfoProps.parentCode }}</span>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuInfoProps.name" maxlength="100" :clearable="true" placeholder="菜单名称" show-word-limit />
            </el-form-item>
            <el-form-item label="菜单编码" prop="code">
              <el-input v-if="editState === 'create'" v-model="menuInfoProps.code" maxlength="50" :clearable="true" placeholder="菜单编码" show-word-limit />
              <span v-else>{{ menuInfoProps.code }}</span>
            </el-form-item>
            <el-form-item label="后台url" prop="url">
              <el-input v-model="menuInfoProps.url" maxlength="200" :clearable="true" placeholder="url" show-word-limit />
            </el-form-item>
            <el-form-item label="前台router" prop="router">
              <el-input v-model="menuInfoProps.router" maxlength="200" :clearable="true" placeholder="router" show-word-limit />
            </el-form-item>
            <el-form-item label="排序" prop="sorting">
              <el-input-number v-model="menuInfoProps.sorting" :min="0" :max="999999" :clearable="true" />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="menuInfoProps.remark" type="textarea" maxlength="120" show-word-limit :clearable="true" placeholder="描述" />
            </el-form-item>
            <el-form-item label="锁定状态" prop="locked">
              <el-switch v-model="menuInfoProps.locked" active-text="已锁定" inactive-text="未锁定" :active-value="1" :inactive-value="0" active-color="#ff4949"
                inactive-color="#13ce66" />
            </el-form-item>
            <el-form-item>
              <el-button @click="editVisible=false">关闭</el-button>
              <el-button v-permission="permissions['update']" :type="editState === 'update' ? 'primary' : 'success'" :loading="saveLoading" @click="saveOrUpdate">
                {{ textMap[editState] }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item v-show="perVisible" title="权限信息" name="permissionInfo">
          <!--查询条件-->
          <el-form ref="perForm" :inline="true" :model="perQuery" class="demo-form-inline">
            <el-form-item prop="input">
              <el-input v-model="perQuery.input" placeholder="请输入" maxlength="50" clearable @keyup.enter.native="searchPer">
                <el-select slot="prepend" v-model="perQuery.select" placeholder="请选择" style="width: 75px;">
                  <el-option label="名称" value="name" />
                  <el-option label="编码" value="code" />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="searchPer">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button v-permission="permissions['update']" type="primary" @click="toPermissionPage">编辑权限</el-button>
            </el-form-item>
          </el-form>
          <!--查询结果-->
          <el-table ref="perTable" v-loading="searchLoading" :data="perPageProps.records" element-loading-text="正在查询" border fit stripe height="490" highlight-current-row
            size="mini" @row-click="handleCurrentRowClick">
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="权限名称" align="center">
              <template slot-scope="{row}">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label="权限编码" align="center">
              <template slot-scope="{row}">
                {{ row.code }}
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination background small layout="total, sizes, prev, pager, next, jumper" :total="perPageProps.total" :page-size="perPageProps.pageSize"
            :current-page="perPageProps.pageNum" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
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
import menuApi from '@/api/system/menu-api'
import requestApi from '@/api/request-api'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { getDefaultPermissions } from '@/utils'

const url = menuApi.url
const sourceKey = process.env.VUE_APP_SOURCE_KEY

export default {
  name: 'MenuInfo',
  directives: { elDragDialog, permission },
  data() {
    const validateMenuCode = (rule, value, callback) => {
      if (value && value.indexOf('_child_') > -1) {
        callback(new Error('请修改菜单编码'))
      } else {
        callback()
      }
    }
    const validateMenuName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('菜单名称不能为空'))
      } else if (value.indexOf('新增菜单') > -1) {
        callback(new Error('请修改菜单名称'))
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
        code: [{ required: true, validator: validateMenuCode, trigger: 'blur' }],
        name: [{ required: true, validator: validateMenuName, trigger: 'blur' }]
      },
      treeProps: {
        data: [{
          children: [],
          code: 'root',
          name: '菜单目录'
        }]
      },
      textMap: {
        update: '更新',
        create: '新增'
      },
      editState: 'update',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuInfoProps: {
        parentCode: '',
        name: '',
        code: '',
        url: '',
        router: '',
        remark: '',
        locked: 0,
        sorting: 0
      },
      perQuery: {
        input: '',
        select: 'name'
      },
      perPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      permissionDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          osCode: '',
          osName: '',
          menuCode: '',
          menuName: '',
          url: '',
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      editVisible: false,
      nodeEditing: false,
      centerDialogVisible: false,
      perVisible: true,
      osSelectOption: [],
      menuQuery: {
        currentOsCode: sourceKey
      },
      currentNodeKey: '',
      childCode: '',
      currentChild: null,
      removing: {
        node: null,
        data: null
      },
      removeWarn: '确认删除选中的菜单项？',
      activeName: 'menuInfo',
      permissions: getDefaultPermissions()
    }
  },
  watch: {
    filterText(val) {
      this.$refs['menuTree'].filter(val)
    }
  },
  created() {
    this.fetchData()
    this.listAllOs()
  },
  methods: {
    // 菜单树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    },
    // 查询信息
    fetchData() {
      this.searchLoading = true
      const params = {}
      params.osCode = this.menuQuery.currentOsCode
      menuApi.getAll(params).then(response => {
        this.editVisible = false
        this.treeProps.data = [{
          children: [],
          code: 'root',
          name: '菜单目录'
        }]
        if (response.data.children) {
          this.treeProps.data[0].children = response.data.children
        }
        this.searchLoading = false
      }).catch((error) => {
        console.error(error)
        this.searchLoading = false
      })
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
      const childName = '新增菜单' + index
      const newChild = {
        parentCode: parentCode,
        code: childCode,
        name: childName,
        children: [],
        locked: 0,
        sorting: 0,
        isNew: 1
      }
      data.children.push(newChild)
      this.currentChild = {}
      this.setMenuVal(newChild, this.currentChild)
    },
    // 删除确认
    handleRemove(node, data) {
      this.removing.node = node
      this.removing.data = data
      if (data.children && data.children.length > 0) {
        this.removeWarn = '确认删除选中的菜单项及其子菜单？'
      } else {
        this.removeWarn = '确认删除选中的菜单项？'
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
        const data = {}
        const params = []
        params.push(this.removing.data.code)
        data.codes = params
        data.osCode = this.menuQuery.currentOsCode
        requestApi.request_delete(url + '/deleteWithOsCode', data).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '删除成功',
              duration: 5 * 1000
            })
          }
        }).catch((error) => {
          console.error(error)
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
    /* *
    * 点击节点，根据nodeEditing字段的状态，如果点击新增或删除时，不对点击事件响应
    * 其他情况，折叠或展开节点
    * 点击新增时，选中新增节点
    */
    handleNodeClick(data, node) {
      this.perVisible = !(data.isNew && data.isNew === 1) && !(data.children && data.children.length)
      if (this.nodeEditing) {
        // 新增时，如果没有展开节点，则先展开节点
        if (!node.expanded) {
          node.expanded = true
        }
        // 修改当前选中为新增子节点
        if (this.currentChild) {
          const childCode = this.currentChild.code
          this.$refs['menuTree'].setCurrentKey(childCode)
          this.currentNodeKey = childCode
          this.clearMenuInfoProps()
          this.activeMenuInfo()
          this.editState = 'create'
          this.setMenuVal(this.currentChild, this.menuInfoProps)
          this.menuInfoProps.code = childCode
          this.editVisible = true
          this.perVisible = false
          this.currentChild = null
        }
        this.nodeEditing = false
      }
    },
    // 保存结果
    saveOrUpdate() {
      this.$refs['menuInfoForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = this.menuInfoProps
          params.osCode = this.menuQuery.currentOsCode
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
              console.error(error)
            })
          } else if (this.editState === 'create') {
            requestApi.save(url, params).then(res => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.changeNodeProps()
                this.currentNodeKey = this.menuInfoProps.code
                this.editState = 'update'
                this.perVisible = true
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
              }
            }).catch(error => {
              this.saveLoading = false
              console.error(error)
            })
          }
        }
      })
    },
    // 更改节点属性
    changeNodeProps() {
      const node = this.$refs['menuTree'].getCurrentNode()
      const oldParentCode = node.parentCode
      const newParentCode = this.menuInfoProps.parentCode
      const nodeCode = this.menuInfoProps.code
      const newChildren = []
      const newParent = this.$refs['menuTree'].getNode(newParentCode)
      this.setMenuVal(this.menuInfoProps, node)
      node.isNew = 0
      this.currentNodeKey = nodeCode
      // 如果父级编码变动，则重新调整node位置
      if (oldParentCode !== newParentCode) {
        const oldParent = this.$refs['menuTree'].getNode(oldParentCode)
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
      // 排序并重新设置节点数据 end
      // this.nextTick(() => {
      //   this.$refs['menuTree'].setCurrentKey(nodeCode)
      // })
    },
    // 选中的子元素发生变化
    handleCurrentChange(data, node) {
      if (this.$refs['menuInfoForm']) {
        this.$refs['menuInfoForm'].clearValidate()
      }
      if (data) {
        this.activeMenuInfo()
        if (data.isNew && data.isNew === 1) {
          this.editState = 'create'
        } else {
          this.editState = 'update'
        }
        this.setMenuVal(data, this.menuInfoProps)
        this.currentNodeKey = this.menuInfoProps.code
        this.editVisible = (data.code !== 'root')
      } else {
        this.editVisible = false
        this.currentNodeKey = ''
      }
    },
    // 列出所有的系统信息
    async listAllOs() {
      menuApi.listAllOs().then(res => {
        this.osSelectOption = res.data
      }).catch(error => {
        this.osSelectOption = []
        console.error(error)
      })
    },
    // 节点右键
    // nodeRightClick(event, data, node, obj) {
    // },
    // 清理编辑框
    clearMenuInfoProps() {
      const source = {}
      this.setMenuVal(source, this.menuInfoProps)
    },
    // 设置属性
    setMenuVal(source, target) {
      if (source && target) {
        target.code = source.code ? source.code : ''
        target.parentCode = source.parentCode ? source.parentCode : ''
        target.name = source.name ? source.name : ''
        target.url = source.url ? source.url : ''
        target.router = source.router ? source.router : ''
        target.remark = source.remark ? source.remark : ''
        target.locked = source.locked ? source.locked : 0
        target.sorting = source.sorting ? source.sorting : 0
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 查询权限信息
    searchPer() {
      this.searchLoading = true
      const params = {}
      params.osCode = this.menuQuery.currentOsCode
      params.menuCode = this.currentNodeKey
      if (this.perQuery.select === 'code') {
        params.code = this.perQuery.input
      } else {
        params.name = this.perQuery.input
      }
      params.pageSize = this.perPageProps.pageSize
      params.pageNum = this.perPageProps.pageNum
      menuApi.getPermissionPage(({
        name: this.perQuery.name, osCode: this.menuQuery.currentOsCode,
        menuCode: this.currentNodeKey, code: this.perQuery.code,
        pageSize: this.perPageProps.pageSize, pageNum: this.perPageProps.pageNum
      })).then(response => {
        const { data } = response
        this.perPageProps.records = data.records
        this.perPageProps.total = data.total
        this.perPageProps.pageNum = data.pageNum
        this.perPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.error(error)
      })
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row) {
      this.$refs['perTable'].toggleRowSelection(row)
    },
    // 当前页变更
    handleCurrentPageChange(num) {
      this.perPageProps.pageNum = num
      this.searchPer()
    },
    // 每页显示条数改变
    handlePageSizeChange(size) {
      this.perPageProps.pageSize = size
      this.searchPer()
    },
    // 清除权限页面信息
    clearPerPageProps() {
      this.perPageProps.records = null
      this.perPageProps.total = 0
      this.perPageProps.pageSize = 10
      this.perPageProps.pageNum = 1
    },
    // 将活动标签改为菜单信息
    activeMenuInfo() {
      this.activeName = 'menuInfo'
      this.clearPerPageProps()
    },
    // 当前活动页面为权限信息时，执行查询
    handleCollapseChange(activeName) {
      if (activeName === 'permissionInfo') {
        this.searchPer()
      }
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetPermissionDialog()
      this.permissionDialog.visible = true
      this.permissionDialog.data = Object.assign({}, row)
      this.permissionDialog.state = 'info'
    },
    // 转到权限页面
    toPermissionPage() {
      this.$router.push({
        name: 'Permission',
        params: {
          osCode: this.menuQuery.currentOsCode,
          menuCode: this.currentNodeKey
        }
      })
    }
  }
}

</script>

<style scoped>
  .treeWrap{
    float: left;
    width: 40%;
  }
  .tableWrap {
    float: right;
    width: 55%;
  }
  .danger {
    color: #F56C6C
  }
  .info {
    font-size: 16px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>


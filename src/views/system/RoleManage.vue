<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="roleForm" :inline="true" :model="roleQuery" class="demo-form-inline">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleQuery.name" placeholder="角色名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select v-model="roleQuery.locked" clearable placeholder="锁定状态">
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker v-model="roleQuery.dataRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd" :default-time="['00:00:00','23:59:59']" @change="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="showDeleteDialog">
        删除
      </el-button>
      <el-button :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showPermission">
        权限绑定
      </el-button>
    </div>
    <!--查询结果-->
    <el-table ref="roleTable" v-loading="searchLoading" :data="rolePageProps.records" element-loading-text="正在查询" border fit stripe height="600" highlight-current-row
      @row-click="handleCurrentRowClick" @row-dblclick="handleCurrentRowDblClick" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="{row}">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_date" label="创建时间">
        <template slot-scope="{row}">
          <em class="el-icon-time" />
          <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="锁定状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.locked | lockedStatusFilter">{{ row.locked | lockedWordFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="430" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini">
             数据权限绑定
             <!-- (下边权限管理整合到这里) -->
          </el-button>
          <el-button type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button size="mini" type="default" @click="getRowData(row)">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="rolePageProps.total" :page-size="rolePageProps.pageSize"
      :current-page="rolePageProps.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[roleDialog.state]" :visible.sync="roleDialog.visible" @dragDialog="handleDrag">
      <el-form ref="roleDataForm" :rules="rules" :model="roleDialog.data" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <span v-if="roleDialog.state === 'info'">{{ roleDialog.data.name }}</span>
          <el-input v-else v-model="roleDialog.data.name" maxlength="50" :clearable="true" placeholder="角色名称" show-word-limit />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-if="roleDialog.state === 'create'" v-model="roleDialog.data.code" maxlength="36" :clearable="true" placeholder="角色编码" show-word-limit />
          <span v-else>{{ roleDialog.data.code }}</span>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="roleDialog.data.type" placeholder="请选择角色类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sorting">
          <el-input-number v-model="roleDialog.data.sorting" :min="0" :max="999999" :clearable="true" />
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <span v-if="roleDialog.state === 'info'">{{ roleDialog.data.locked | lockedWordFilter }}</span>
          <el-switch v-else v-model="roleDialog.data.locked" active-text="已锁定" inactive-text="未锁定" :active-value="1" :inactive-value="0" active-color="#ff4949"
            inactive-color="#13ce66" />
        </el-form-item>
        <el-form-item v-if="roleDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ roleDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="roleDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(roleDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="roleDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--关闭提示框-->
    <el-dialog v-el-drag-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center @dragDialog="handleDrag">
      <span v-if="multipleSelection && multipleSelection.length>0">确认删除选中的{{ multipleSelection.length }}项？</span>
      <span v-else>未选中任何内容。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button v-if="multipleSelection && multipleSelection.length>0" type="primary" @click="handleDeleteRows">确 定</el-button>
      </span>
    </el-dialog>
    <!--权限绑定框-->
    <el-dialog v-el-drag-dialog title="权限绑定" :visible.sync="rolePermissionDialog.visible" top="3vh" width="70%" @dragDialog="handleDrag">
      <el-row style="margin-left: 20px; padding-bottom: 0; padding-top: 0;">
        <el-col :span="10">
          <!--查询条件-->
          <el-form ref="menuForm" :inline="true" :model="menuQuery" class="demo-form-inline">
            <el-form-item style="margin-bottom: 5px;">
              <el-select v-model="menuQuery.currentOsCode" filterable placeholder="所属系统" @change="fetchMenuData">
                <el-option v-for="item in osSelectOption" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="fetchMenuData">刷新</el-button>
            </el-form-item>
          </el-form>
          <!--搜索框-->
          <el-input v-model="filterText" placeholder="输入菜单名称进行过滤" clearable maxlength="50" style="width: 90%" />
          <!--菜单树-->
          <el-tree ref="menuTree" class="filter-tree" :data="treeProps.data" :props="defaultProps" :current-node-key="currentNodeKey" :filter-node-method="filterNode" accordion
            node-key="code" highlight-current :expand-on-click-node="true" :default-expanded-keys="['root']" @current-change="handleCurrentNodeChange">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <span class="info">
                  {{ node.label }}
                </span>
                <span v-if="data.locked === 1" class="danger">
                  （已锁定）
                </span>
              </span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="13">
          <!--查询条件-->
          <el-form ref="perForm" :inline="true" :model="perQuery" :disabled="perSearch" class="demo-form-inline">
            <el-form-item style="margin-bottom: 5px;">
              <el-input v-model="filterTableText" placeholder="输入名称或编码过滤" clearable maxlength="50" />
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-checkbox v-model="showCheckedOnly">只看已绑定</el-checkbox>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button v-permission="permissions['get']" type="primary" :loading="searchLoading" @click="clickToSearchPer">搜索</el-button>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button v-permission="permissions['update']" type="primary" @click="bindPermission">绑定权限</el-button>
            </el-form-item>
          </el-form>
          <!--查询结果-->
          <el-table ref="perTable" v-loading="searchLoading" :data="filterPerPage()" element-loading-text="正在查询" border fit stripe height="490" highlight-current-row size="mini"
            :row-class-name="perTableRowClassName" @row-click="handleCurrentPerRowClick" @selection-change="handlePerSelectionChange">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column ref="perColumn" label="权限名称" align="center">
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
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="rolePermissionDialog.visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import requestApi from '@/api/request-api'
import roleApi from '@/api/system/role-api'
import {
  getFormatPickerOptions,
  getTextMap,
  parseTime,
  getDefaultPermissions,
} from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = roleApi.url
const sourceKey = process.env.VUE_APP_SOURCE_KEY

export default {
  name: 'RoleInfo',
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
    return {
      filterText: '',
      filterTableText: '',
      menuQuery: {
        currentOsCode: sourceKey,
      },
      treeProps: {
        data: [
          {
            children: [],
            code: 'root',
            name: '菜单目录',
          },
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      currentNodeKey: '',
      currentRoleCode: '',
      currentRoleTenantId: '',
      osSelectOption: [],
      searchLoading: false,
      saveLoading: false,
      editDisabled: true,
      editVisible: true,
      ignore: false,
      showCheckedOnly: false,
      perSearch: true,
      multipleSelection: [],
      multiplePerSelection: [],
      multiplePerStatistics: new Map(),
      bindingPermissions: null,
      stateMap: {
        1: '1',
        0: '0',
      },
      textMap: getTextMap(),
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' },
      ],
      roleDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          locked: 0,
          type: 100,
          sorting: 0,
          createBy: null,
          createDate: null,
        },
        formLabelWidth: '120px',
      },
      rolePermissionDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null,
        },
        formLabelWidth: '120px',
      },
      roleQuery: {
        name: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: '',
      },
      rolePageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      perQuery: {
        input: '',
        select: 'name',
      },
      perPageProps: {
        records: null,
        total: 0,
        pageSize: 100,
        pageNum: 1,
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions(),
      typeOptions: [
        { value: 0, label: '系统' },
        { value: 10, label: '租户' },
        { value: 100, label: '普通' },
      ],
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
      this.$refs['menuTree'].filter(val)
    },
    filterTableText() {
      this.$nextTick(() => {
        const tableData = this.perPageProps.records
        if (tableData && this.bindingPermissions) {
          tableData.map((row) => {
            this.$refs['perTable'].toggleRowSelection(
              row,
              this.bindingPermissions.includes(row.code)
            )
          })
        }
      })
    },
    perPageProps: {
      handler(newVal, oldVal) {
        this.defaultSelection()
      },
      deep: true,
    },
    showCheckedOnly() {
      this.defaultSelection()
    },
  },
  methods: {
    // 菜单树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    },
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.roleQuery.dataRange && this.roleQuery.dataRange !== '') {
        this.roleQuery.startDate = this.roleQuery.dataRange[0]
        this.roleQuery.endDate = this.roleQuery.dataRange[1]
      } else {
        this.roleQuery.startDate = ''
        this.roleQuery.endDate = ''
      }
      requestApi
        .getPage(url, {
          name: this.roleQuery.name,
          locked: this.roleQuery.locked,
          startDate: this.roleQuery.startDate,
          endDate: this.roleQuery.endDate,
          pageSize: this.rolePageProps.pageSize,
          pageNum: this.rolePageProps.pageNum,
        })
        .then((response) => {
          const { data } = response
          this.rolePageProps.records = data.records
          this.rolePageProps.total = data.total
          this.rolePageProps.pageNum = data.pageNum
          this.rolePageProps.pageSize = data.pageSize
          this.searchLoading = false
        })
        .catch((error) => {
          this.searchLoading = false
          console.error(error)
        })
    },
    // 查询菜单信息
    async fetchMenuData() {
      this.searchLoading = true
      const params = {}
      params.osCode = this.menuQuery.currentOsCode
      this.perPageProps.records = null
      this.perPageProps.total = 0
      this.perPageProps.pageNum = 1
      this.perPageProps.pageSize = 100
      roleApi.getAllMenu(params).then((response) => {
        this.searchLoading = false
        if (response.data.children) {
          this.treeProps.data = [
            {
              children: [],
              code: 'root',
              name: '菜单目录',
            },
          ]
          this.treeProps.data[0].children = response.data.children
        } else {
          this.treeProps.data = []
        }
      })
    },
    // 点击查询权限
    clickToSearchPer() {
      this.filterTableText = ''
      this.searchPer()
    },
    // 查询权限信息
    searchPer() {
      if (this.currentNodeKey && this.currentNodeKey !== 'root') {
        this.searchLoading = true
        this.showCheckedOnly = false
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
        roleApi
          .getPermissionPage(params)
          .then((response) => {
            const { data } = response
            this.perPageProps.records = data.records
            this.perPageProps.total = data.total
            this.perPageProps.pageNum = data.pageNum
            this.perPageProps.pageSize = data.pageSize
            this.searchLoading = false
          })
          .catch((error) => {
            this.searchLoading = false
            console.error(error)
          })
      }
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['roleDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.roleDialog.data)
          if (this.roleDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.roleDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000,
                })
                this.fetchData()
              }
            })
          } else {
            requestApi.update(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                if (this.roleDialog.data.version) {
                  this.roleDialog.data.version++
                }
                const index = this.rolePageProps.records.findIndex(
                  (v) => v.id === this.roleDialog.data.id
                )
                this.rolePageProps.records.splice(
                  index,
                  1,
                  this.roleDialog.data
                )
                this.roleDialog.visible = false
                Message.success({
                  message: '更新成功',
                  duration: 5 * 1000,
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
        this.multipleSelection.map((row) => {
          codes.push(row.code)
        })
        requestApi.remove(url, codes).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '删除成功',
              duration: 5 * 1000,
            })
            this.fetchData()
          }
        })
      }
    },
    // 单个删除
    handleDelete(row) {
      this.$refs['roleTable'].clearSelection()
      this.$refs['roleTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.rolePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.rolePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['roleForm'].resetFields()
      this.rolePageProps.records = null
      this.rolePageProps.total = 0
      this.rolePageProps.pageSize = 10
      this.rolePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['roleTable'].toggleRowSelection(row)
      }
    },
    // 单击行，切换选中状态
    handleCurrentPerRowClick(row) {
      this.$refs['perTable'].toggleRowSelection(row)
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['roleTable'].clearSelection()
      this.$refs['roleTable'].toggleRowSelection(row)
      this.getRowData(row)
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 行选中状态变更
    handlePerSelectionChange(val) {
      this.multiplePerSelection = val
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.locked === 1) {
        return 'warning-row'
      } else if (row.locked === 3) {
        return 'success-row'
      }
      return ''
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetRoleDialog()
      this.roleDialog.visible = true
      this.roleDialog.data = Object.assign({}, row)
      this.roleDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetRoleDialog()
      this.roleDialog.visible = true
      this.roleDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetRoleDialog()
      this.roleDialog.data.gender = 0
      this.roleDialog.data.locked = 0
      this.roleDialog.visible = true
      this.roleDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.roleDialog.state = 'update'
    },
    // 重置信息页面
    resetRoleDialog() {
      this.$nextTick(() => {
        if (this.$refs['roleDataForm']) {
          this.$refs['roleDataForm'].clearValidate()
        }
      })
      this.roleDialog.data = {
        id: undefined,
        name: '',
        code: '',
        locked: 0,
        type: 100,
        sorting: 0,
        createBy: null,
        createDate: null,
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 绑定权限
    showPermission() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.rolePermissionDialog.visible = true
        this.currentRoleCode = this.multipleSelection[0].code
        this.currentRoleTenantId = this.multipleSelection[0].tenantId
        this.perPageProps.records = null
        this.bindingPermissions = null
        this.showCheckedOnly = false
        this.filterTableText = ''
        if (
          !this.treeProps.data[0].children ||
          this.treeProps.data[0].children.length === 0
        ) {
          this.fetchMenuData()
        }
        if (this.osSelectOption.length === 0) {
          this.listAllOs()
        }
      }
    },
    // 绑定权限
    bindPermission() {
      const rolePermissionDTO = {}
      const permissions = this.multiplePerSelection.map((row) => row.code)
      rolePermissionDTO.roleCode = this.currentRoleCode
      rolePermissionDTO.tenantId = this.currentRoleTenantId
      rolePermissionDTO.osCode = this.menuQuery.currentOsCode
      rolePermissionDTO.menuCode = this.currentNodeKey
      rolePermissionDTO.permissionCodes = permissions
      roleApi.bindPermissions(rolePermissionDTO).then((res) => {
        if (res && res.code === 1000) {
          Message.success({
            message: '绑定成功',
            duration: 5 * 1000,
          })
        }
      })
    },
    // 获取系统信息
    async listAllOs() {
      roleApi
        .listAllOs()
        .then((res) => {
          this.osSelectOption = res.data
        })
        .catch((error) => {
          this.osSelectOption = []
          console.error(error)
        })
    },
    // 树节点切换
    handleCurrentNodeChange(data, node) {
      this.perSearch =
        (data.children && data.children.length > 0) || data.code === 'root'
      this.perPageProps.records = null
      this.bindingPermissions = null
      this.showCheckedOnly = false
      this.filterTableText = ''
      if (data) {
        this.currentNodeKey = data.code
      } else {
        this.currentNodeKey = ''
      }
    },
    // 过滤表格内容
    filterPerPage() {
      const tableData = this.perPageProps.records
      if (tableData) {
        return tableData.filter(
          (data) =>
            !this.filterTableText ||
            data.name
              .toLowerCase()
              .includes(this.filterTableText.toLowerCase()) ||
            data.code.toLowerCase().includes(this.filterTableText.toLowerCase())
        )
      }
    },
    // 默认选中
    defaultSelection() {
      const tableData = this.perPageProps.records
      if (tableData) {
        this.$nextTick(() => {
          const params = {}
          params.roleCode = this.currentRoleCode
          params.osCode = this.menuQuery.currentOsCode
          params.menuCode = this.currentNodeKey
          // 获取已绑定的权限
          roleApi
            .getPermissionCodes(params)
            .then((res) => {
              if (res.data) {
                this.bindingPermissions = res.data
                tableData.map((row) => {
                  this.$refs['perTable'].toggleRowSelection(
                    row,
                    this.bindingPermissions.includes(row.code)
                  )
                })
              }
            })
            .catch((error) => console.error(error))
        })
      }
    },
    // 权限列表行样式
    perTableRowClassName({ row, rowIndex }) {
      if (
        this.showCheckedOnly &&
        this.bindingPermissions &&
        !this.bindingPermissions.includes(row.code)
      ) {
        return 'hide-row'
      }
    },
  },
}
</script>

<style scoped>
.treeWrap {
  float: left;
  width: 40%;
}
.tableWrap {
  float: right;
  width: 55%;
}
.danger {
  color: #f56c6c;
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
.el-table .hide-row {
  display: none;
}
</style>


<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="demoForm" :inline="true" :model="demoQuery" :class="searchBtnShow?'demo-form-inline search-form':'demo-form-inline form-height search-form'" label-width="100px">
      <el-form-item label="输入框" prop="input">
        <el-input v-model="demoQuery.input" :clearable="true" placeholder="输入框" maxlength="100" />
      </el-form-item>
      <el-form-item label="下拉" prop="select">
        <el-select v-model="demoQuery.select" placeholder="下拉">
          <el-option
            v-for="item in demoQuery.selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="级联" prop="cascader">
        <el-cascader v-model="demoQuery.cascader" placeholder="级联" :options="demoQuery.cascaderOptions" @change="cascaderHandleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="级联多选" prop="cascaderCheckBox">
        <el-cascader v-model="demoQuery.cascaderCheckBox" placeholder="级联多选" :options="demoQuery.cascaderOptions" :props="demoQuery.cascaderProps" collapse-tags clearable></el-cascader>
      </el-form-item>
      <el-form-item label="日期选择器" prop="picker">
        <el-date-picker
          v-model="demoQuery.picker"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="demoQuery.dataRange"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd"
          :default-time="['00:00:00','23:59:59']"
          @change="search"
        />
      </el-form-item>
    </el-form>
    <div>
      <el-button class="show-search-btn" size="mini" @click="showSearchBtn">{{searchBtnShow?'收起更多':'展开更多'}}</el-button>
      <div class="search-btn">
        <el-button v-permission="permissions['get']" type="reset" size="small" @click="reset">重置</el-button>
        <el-button v-permission="permissions['get']" type="primary"  size="small" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </div>
      <div style="clear: both"></div>
    </div>
    <div id="buttonDiv" class="function-button" >
      <el-button v-permission="permissions['delete']" class="filter-item" size="small" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="showDeleteDialog">
        删除
      </el-button>
      <el-button v-permission="permissions['insert']" class="filter-item" size="small" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="demoTable"
      v-loading="searchLoading"
      :data="demoPageProps.record"
      element-loading-text="正在查询"
      border
      fit
      stripe
      height="600"
      highlight-current-row
      @row-click="handleCurrentRowClick"
      @row-dblclick="handleCurrentRowDblClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" label="主键" />
      <el-table-column align="center" prop="name" label="名称" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
      <el-table-column align="center" prop="updateBy" label="修改人" />
      <el-table-column align="center" prop="updateDate" label="修改时间" />
      <el-table-column align="center" prop="version" label="版本号" />
      <el-table-column align="center" prop="orgId" label="组织ID" />
      <el-table-column align="center" prop="tenantId" label="租户ID" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-permission="permissions['update']" type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-permission="permissions['delete']" size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-permission="permissions['get']" size="mini" type="default" @click="getRowData(row)">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="demoPageProps.total"
      :page-size="demoPageProps.pageSize"
      :current-page="demoPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[demoDialog.state]" :visible.sync="demoDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="demoDataForm"
        :rules="rules"
        :model="demoDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="name" label="名称">
          <span v-if="demoDialog.state === 'info'">{{ demoDialog.data.name }}</span>
          <el-input v-else v-model="demoDialog.data.name" maxlength="100" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="demoDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="demoDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      @dragDialog="handleDrag"
    >
      <span v-if="multipleSelection && multipleSelection.length>0">确认删除选中的{{ multipleSelection.length }}项？</span>
      <span v-else>未选中任何内容。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button v-if="multipleSelection && multipleSelection.length>0" type="primary" @click="handleDeleteRows">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import requestApi from '@/api/request-api'
  import demoApi from '@/api/demo/demo-api'
  import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
  import { Message } from 'element-ui'
  import elDragDialog from '@/directive/el-drag-dialog'
  import permission from '@/directive/permission'

  const url = demoApi.url

  export default {
    name: 'Demo',
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
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        },
        lockedStateOptions: [
          { key: 0, display_name: '未锁定' },
          { key: 1, display_name: '已锁定' }
        ],
        demoDialog: {
          state: '',
          visible: false,
          data: {
            id: undefined,
            name: null
          },
          formLabelWidth: '120px'
        },
        //查询框
        demoQuery: {
          input: '',
          select:'',
          selectOptions:[{
            value: '选项1',
            label: '选项1'
          },{
            value: '选项2',
            label: '选项2'
          },  {
            value: '选项3',
            label: '选项3',
            disabled: true
          }],
          cascader:[],
          cascaderOptions: [{
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'shejiyuanze',
              label: '设计原则'
            }, {
              value: 'daohang',
              label: '导航'
            }]
          }],
          cascaderProps:{ multiple: true},
          cascaderCheckBox:[],
          picker:'',
        },
        demoPageProps: {
          record: null,
          total: 0,
          pageSize: 10,
          pageNum: 1
        },
        searchBtnShow:true,//查询条件展示
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
      //查询条件展示
      showSearchBtn(){
        this.searchBtnShow = !this.searchBtnShow
      },
      // 查询方法
      fetchData() {

      },
      // 保存方法
      saveOrUpdate() {

      },
      // 显示删除确认框
      showDeleteDialog() {
        this.centerDialogVisible = true
      },
      // 删除方法
      handleDeleteRows() {

      },
      // 单个删除
      handleDelete(row) {

      },
      // 每页显示页面数变更
      handleSizeChange(size) {
        this.demoPageProps.pageSize = size
        this.fetchData()
      },
      // 当前页变更
      handleCurrentChange(num) {
        this.demoPageProps.pageNum = num
        this.fetchData()
      },
      // 点击查询按钮
      search() {
        this.handleCurrentChange(1)
      },
      // 重置方法
      reset() {
        this.$refs['demoForm'].resetFields()
        this.demoPageProps.record = null
        this.demoPageProps.total = 0
        this.demoPageProps.pageSize = 10
        this.demoPageProps.pageNum = 1
        this.fetchData()
      },
      // 单击行，切换选中状态
      handleCurrentRowClick(row, column) {
        if (column.label !== '操作') {
          this.$refs['demoTable'].toggleRowSelection(row)
        }
      },
      // 双击行，显示详情
      handleCurrentRowDblClick(row) {
        this.$refs['demoTable'].clearSelection()
        this.$refs['demoTable'].toggleRowSelection(row)
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
        this.resetDemoDialog()
        this.demoDialog.visible = true
        this.demoDialog.data = Object.assign({}, row)
        this.demoDialog.state = 'info'
      },
      // 编辑
      editRowData(row) {
        this.demoDialog.visible = true
        this.demoDialog.data = Object.assign({}, row)
        this.changeToEdit()
      },
      // 新增
      newRowData() {
        this.resetDemoDialog()
        this.demoDialog.data.locked = 0
        this.demoDialog.visible = true
        this.demoDialog.state = 'create'
      },
      // 详情页点击编辑
      changeToEdit() {
        this.demoDialog.state = 'update'
      },
      // 重置信息页面
      resetDemoDialog() {
        this.$nextTick(() => {
          if (this.$refs['demoDataForm']) {
            this.$refs['demoDataForm'].clearValidate()
          }
        })
        this.demoDialog.data = {
          id: undefined,
          name: null,
          createBy: null,
          createDate: null,
          updateBy: null,
          updateDate: null,
          deleteBy: null,
          deleteDate: null,
          deleteFlag: null,
          version: null,
          orgId: null,
          tenantId: null
        }
      },
      // v-el-drag-dialog onDrag callback function
      handleDrag() {
        if (this.$refs.select) {
          this.$refs.select.blur()
        }
      },
      cascaderHandleChange(){

      },
    }
  }
</script>
<style>

</style>

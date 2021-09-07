import requestApi from '@/api/request-api'
import userTenantApi from '@/api/system/user-tenant-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = userTenantApi.url

export default {
  name: 'AuthUserTenant',
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
      authUserTenantDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          userId: null,
          tenantId: null,
          tenantSchema: null,
          locked: null,
          createBy: null,
          createDate: null,
          updateBy: null,
          updateDate: null,
          deleteBy: null,
          deleteDate: null,
          deleteFlag: null,
          version: null
        },
        formLabelWidth: '120px'
      },
      authUserTenantQuery: {
        userId: null,
        tenantId: null,
        tenantSchema: null,
        locked: null,
        createBy: null,
        createDate: null,
        updateBy: null,
        updateDate: null,
        deleteBy: null,
        deleteDate: null,
        deleteFlag: null,
        version: null,
        dataRange: ''
      },
      authUserTenantPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
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
      if (this.authUserTenantQuery.dataRange && this.authUserTenantQuery.dataRange !== '') {
        this.authUserTenantQuery.startDate = this.authUserTenantQuery.dataRange[0]
        this.authUserTenantQuery.endDate = this.authUserTenantQuery.dataRange[1]
      } else {
        this.authUserTenantQuery.startDate = ''
        this.authUserTenantQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.authUserTenantQuery.startDate, endDate: this.authUserTenantQuery.endDate,
        pageSize: this.authUserTenantPageProps.pageSize, pageNum: this.authUserTenantPageProps.pageNum }).then(response => {
        const { data } = response
        this.authUserTenantPageProps.records = data.records
        this.authUserTenantPageProps.total = data.total
        this.authUserTenantPageProps.pageNum = data.pageNum
        this.authUserTenantPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['authUserTenantDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.authUserTenantDialog.data)
          if (this.authUserTenantDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.authUserTenantDialog.visible = false
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
                if (this.authUserTenantDialog.data.version) {
                  this.authUserTenantDialog.data.version++
                }
                const index = this.authUserTenantPageProps.records.findIndex(v => v.id === this.authUserTenantDialog.data.id)
                this.authUserTenantPageProps.records.splice(index, 1, this.authUserTenantDialog.data)
                this.authUserTenantDialog.visible = false
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
        const ids = []
        this.multipleSelection.map(row => {
          ids.push(row.id)
        })
        requestApi.remove(url, ids).then((res) => {
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
      this.$refs['authUserTenantTable'].clearSelection()
      this.$refs['authUserTenantTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.authUserTenantPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.authUserTenantPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['authUserTenantForm'].resetFields()
      this.authUserTenantQuery.dataRange = ''
      this.authUserTenantPageProps.records = null
      this.authUserTenantPageProps.total = 0
      this.authUserTenantPageProps.pageSize = 10
      this.authUserTenantPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['authUserTenantTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['authUserTenantTable'].clearSelection()
      this.$refs['authUserTenantTable'].toggleRowSelection(row)
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
      this.resetAuthUserTenantDialog()
      this.authUserTenantDialog.visible = true
      this.authUserTenantDialog.data = Object.assign({}, row)
      this.authUserTenantDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.authUserTenantDialog.visible = true
      this.authUserTenantDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetAuthUserTenantDialog()
      this.authUserTenantDialog.data.locked = 0
      this.authUserTenantDialog.visible = true
      this.authUserTenantDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.authUserTenantDialog.state = 'update'
    },
    // 重置信息页面
    resetAuthUserTenantDialog() {
      this.$nextTick(() => {
        if (this.$refs['authUserTenantDataForm']) {
          this.$refs['authUserTenantDataForm'].clearValidate()
        }
      })
      this.authUserTenantDialog.data = {
        id: undefined,
        userId: null,
        tenantId: null,
        tenantSchema: null,
        locked: null,
        createBy: null,
        createDate: null,
        updateBy: null,
        updateDate: null,
        deleteBy: null,
        deleteDate: null,
        deleteFlag: null,
        version: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    }
  }
}

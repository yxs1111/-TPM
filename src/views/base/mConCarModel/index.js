import requestApi from '@/api/request-api'
import mConCarModelApi from '@/api/base/m-con-car-model-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = mConCarModelApi.url

export default {
  name: 'MConCarModel',
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
      mConCarModelDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          modelCode: null,
          modelName: null,
          lineId: null,
          trainTypeId: null,
          remark: null,
          level: null,
          paModelName: null,
          paModelId: null
        },
        formLabelWidth: '120px'
      },
      mConCarModelQuery: {
        modelCode: null,
        modelName: null,
        lineId: null,
        trainTypeId: null,
        remark: null,
        level: null,
        paModelName: null,
        paModelId: null,
        dataRange: ''
      },
      mConCarModelPageProps: {
        record: null,
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
      if (this.mConCarModelQuery.dataRange && this.mConCarModelQuery.dataRange !== '') {
        this.mConCarModelQuery.startDate = this.mConCarModelQuery.dataRange[0]
        this.mConCarModelQuery.endDate = this.mConCarModelQuery.dataRange[1]
      } else {
        this.mConCarModelQuery.startDate = ''
        this.mConCarModelQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.mConCarModelQuery.startDate, endDate: this.mConCarModelQuery.endDate,
        pageSize: this.mConCarModelPageProps.pageSize, pageNum: this.mConCarModelPageProps.pageNum }).then(response => {
        const { data } = response
        this.mConCarModelPageProps.record = data.records
        this.mConCarModelPageProps.total = data.total
        this.mConCarModelPageProps.pageNum = data.pageNum
        this.mConCarModelPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['mConCarModelDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.mConCarModelDialog.data)
          if (this.mConCarModelDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.mConCarModelDialog.visible = false
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
                if (this.mConCarModelDialog.data.version) {
                  this.mConCarModelDialog.data.version++
                }
                const index = this.mConCarModelPageProps.record.findIndex(v => v.id === this.mConCarModelDialog.data.id)
                this.mConCarModelPageProps.record.splice(index, 1, this.mConCarModelDialog.data)
                this.mConCarModelDialog.visible = false
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
      this.$refs['mConCarModelTable'].clearSelection()
      this.$refs['mConCarModelTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.mConCarModelPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.mConCarModelPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['mConCarModelForm'].resetFields()
      this.mConCarModelQuery.dataRange = ''
      this.mConCarModelPageProps.record = null
      this.mConCarModelPageProps.total = 0
      this.mConCarModelPageProps.pageSize = 10
      this.mConCarModelPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['mConCarModelTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['mConCarModelTable'].clearSelection()
      this.$refs['mConCarModelTable'].toggleRowSelection(row)
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
      this.resetMConCarModelDialog()
      this.mConCarModelDialog.visible = true
      this.mConCarModelDialog.data = Object.assign({}, row)
      this.mConCarModelDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.mConCarModelDialog.visible = true
      this.mConCarModelDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetMConCarModelDialog()
      this.mConCarModelDialog.data.locked = 0
      this.mConCarModelDialog.visible = true
      this.mConCarModelDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.mConCarModelDialog.state = 'update'
    },
    // 重置信息页面
    resetMConCarModelDialog() {
      this.$nextTick(() => {
        if (this.$refs['mConCarModelDataForm']) {
          this.$refs['mConCarModelDataForm'].clearValidate()
        }
      })
      this.mConCarModelDialog.data = {
        id: undefined,
        modelCode: null,
        modelName: null,
        lineId: null,
        trainTypeId: null,
        remark: null,
        level: null,
        paModelName: null,
        paModelId: null
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

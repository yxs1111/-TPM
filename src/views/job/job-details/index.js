import requestApi from '@/api/request-api'
import qrtzJobDetailsApi from '@/api/job/qrtz-job-details-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = qrtzJobDetailsApi.url

export default {
  name: 'QrtzJobDetails',
  directives: { elDragDialog, permission },
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
      qrtzJobDetailsDialog: {
        state: '',
        visible: false,
        data: {
          description: null,
          jobClassName: null,
          isDurable: null,
          isNonconcurrent: null,
          isUpdateData: null,
          requestsRecovery: null,
          jobData: null,
        },
        formLabelWidth: '120px'
      },
      qrtzJobDetailsQuery: {
        description: null,
        jobClassName: null,
        isDurable: null,
        isNonconcurrent: null,
        isUpdateData: null,
        requestsRecovery: null,
        jobData: null,
        dataRange: ''
      },
      qrtzJobDetailsPageProps: {
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
      if (this.qrtzJobDetailsQuery.dataRange && this.qrtzJobDetailsQuery.dataRange !== '') {
        this.qrtzJobDetailsQuery.startDate = this.qrtzJobDetailsQuery.dataRange[0]
        this.qrtzJobDetailsQuery.endDate = this.qrtzJobDetailsQuery.dataRange[1]
      } else {
        this.qrtzJobDetailsQuery.startDate = ''
        this.qrtzJobDetailsQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.qrtzJobDetailsQuery.startDate, endDate: this.qrtzJobDetailsQuery.endDate,
        pageSize: this.qrtzJobDetailsPageProps.pageSize, pageNum: this.qrtzJobDetailsPageProps.pageNum }).then(response => {
        const { data } = response
        this.qrtzJobDetailsPageProps.records = data.records
        this.qrtzJobDetailsPageProps.total = data.total
        this.qrtzJobDetailsPageProps.pageNum = data.pageNum
        this.qrtzJobDetailsPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['qrtzJobDetailsDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.qrtzJobDetailsDialog.data)
          if (this.qrtzJobDetailsDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.qrtzJobDetailsDialog.visible = false
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
                if (this.qrtzJobDetailsDialog.data.version) {
                  this.qrtzJobDetailsDialog.data.version++
                }
                const index = this.qrtzJobDetailsPageProps.records.findIndex(v => v.id === this.qrtzJobDetailsDialog.data.id)
                this.qrtzJobDetailsPageProps.records.splice(index, 1, this.qrtzJobDetailsDialog.data)
                this.qrtzJobDetailsDialog.visible = false
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
      this.$refs['qrtzJobDetailsTable'].clearSelection()
      this.$refs['qrtzJobDetailsTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.qrtzJobDetailsPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.qrtzJobDetailsPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['qrtzJobDetailsForm'].resetFields()
      this.qrtzJobDetailsQuery.dataRange = ''
      this.qrtzJobDetailsPageProps.records = null
      this.qrtzJobDetailsPageProps.total = 0
      this.qrtzJobDetailsPageProps.pageSize = 10
      this.qrtzJobDetailsPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['qrtzJobDetailsTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['qrtzJobDetailsTable'].clearSelection()
      this.$refs['qrtzJobDetailsTable'].toggleRowSelection(row)
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
      this.resetQrtzJobDetailsDialog()
      this.qrtzJobDetailsDialog.visible = true
      this.qrtzJobDetailsDialog.data = Object.assign({}, row)
      this.qrtzJobDetailsDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.qrtzJobDetailsDialog.visible = true
      this.qrtzJobDetailsDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetQrtzJobDetailsDialog()
      this.qrtzJobDetailsDialog.data.locked = 0
      this.qrtzJobDetailsDialog.visible = true
      this.qrtzJobDetailsDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.qrtzJobDetailsDialog.state = 'update'
    },
    // 重置信息页面
    resetQrtzJobDetailsDialog() {
      this.$nextTick(() => {
        if (this.$refs['qrtzJobDetailsDataForm']) {
          this.$refs['qrtzJobDetailsDataForm'].clearValidate()
        }
      })
      this.qrtzJobDetailsDialog.data = {
        id: undefined,
        description: null,
        jobClassName: null,
        isDurable: null,
        isNonconcurrent: null,
        isUpdateData: null,
        requestsRecovery: null,
        jobData: null,
        deleteBy: null,
        deleteDate: null,
        locked: null
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

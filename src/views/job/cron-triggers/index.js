import requestApi from '@/api/request-api'
import qrtzCronTriggersApi from '@/api/job/qrtz-cron-triggers-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = qrtzCronTriggersApi.url

export default {
  name: 'QrtzCronTriggers',
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
      qrtzCronTriggersDialog: {
        state: '',
        visible: false,
        data: {
          cronExpression: null,
          timeZoneId: null
        },
        formLabelWidth: '120px'
      },
      qrtzCronTriggersQuery: {
        cronExpression: null,
        timeZoneId: null,
        dataRange: ''
      },
      qrtzCronTriggersPageProps: {
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
      if (this.qrtzCronTriggersQuery.dataRange && this.qrtzCronTriggersQuery.dataRange !== '') {
        this.qrtzCronTriggersQuery.startDate = this.qrtzCronTriggersQuery.dataRange[0]
        this.qrtzCronTriggersQuery.endDate = this.qrtzCronTriggersQuery.dataRange[1]
      } else {
        this.qrtzCronTriggersQuery.startDate = ''
        this.qrtzCronTriggersQuery.endDate = ''
      }
      requestApi.getPage(url, {
        startDate: this.qrtzCronTriggersQuery.startDate, endDate: this.qrtzCronTriggersQuery.endDate,
        pageSize: this.qrtzCronTriggersPageProps.pageSize, pageNum: this.qrtzCronTriggersPageProps.pageNum
      }).then(response => {
        const { data } = response
        this.qrtzCronTriggersPageProps.records = data.records
        this.qrtzCronTriggersPageProps.total = data.total
        this.qrtzCronTriggersPageProps.pageNum = data.pageNum
        this.qrtzCronTriggersPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.error(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['qrtzCronTriggersDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.qrtzCronTriggersDialog.data)
          if (this.qrtzCronTriggersDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.qrtzCronTriggersDialog.visible = false
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
                if (this.qrtzCronTriggersDialog.data.version) {
                  this.qrtzCronTriggersDialog.data.version++
                }
                const index = this.qrtzCronTriggersPageProps.records.findIndex(v => v.id === this.qrtzCronTriggersDialog.data.id)
                this.qrtzCronTriggersPageProps.records.splice(index, 1, this.qrtzCronTriggersDialog.data)
                this.qrtzCronTriggersDialog.visible = false
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
      this.$refs['qrtzCronTriggersTable'].clearSelection()
      this.$refs['qrtzCronTriggersTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.qrtzCronTriggersPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.qrtzCronTriggersPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['qrtzCronTriggersForm'].resetFields()
      this.qrtzCronTriggersQuery.dataRange = ''
      this.qrtzCronTriggersPageProps.records = null
      this.qrtzCronTriggersPageProps.total = 0
      this.qrtzCronTriggersPageProps.pageSize = 10
      this.qrtzCronTriggersPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['qrtzCronTriggersTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['qrtzCronTriggersTable'].clearSelection()
      this.$refs['qrtzCronTriggersTable'].toggleRowSelection(row)
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
    // 获取当前行详情
    getRowData(row) {
      this.resetQrtzCronTriggersDialog()
      this.qrtzCronTriggersDialog.visible = true
      this.qrtzCronTriggersDialog.data = Object.assign({}, row)
      this.qrtzCronTriggersDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.qrtzCronTriggersDialog.visible = true
      this.qrtzCronTriggersDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetQrtzCronTriggersDialog()
      this.qrtzCronTriggersDialog.data.locked = 0
      this.qrtzCronTriggersDialog.visible = true
      this.qrtzCronTriggersDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.qrtzCronTriggersDialog.state = 'update'
    },
    // 重置信息页面
    resetQrtzCronTriggersDialog() {
      this.$nextTick(() => {
        if (this.$refs['qrtzCronTriggersDataForm']) {
          this.$refs['qrtzCronTriggersDataForm'].clearValidate()
        }
      })
      this.qrtzCronTriggersDialog.data = {
        cronExpression: null,
        timeZoneId: null
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

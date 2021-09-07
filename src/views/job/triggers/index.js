import requestApi from '@/api/request-api'
import qrtzTriggersApi from '@/api/job/qrtz-triggers-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = qrtzTriggersApi.url

export default {
  name: 'QrtzTriggers',
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
      qrtzTriggersDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          jobName: null,
          jobGroup: null,
          description: null,
          nextFireTime: null,
          prevFireTime: null,
          priority: null,
          triggerState: null,
          triggerType: null,
          startTime: null,
          endTime: null,
          calendarName: null,
          misfireInstr: null,
          jobData: null,
          deleteBy: null,
          deleteDate: null,
          locked: null
        },
        formLabelWidth: '120px'
      },
      qrtzTriggersQuery: {
        jobName: null,
        jobGroup: null,
        description: null,
        nextFireTime: null,
        prevFireTime: null,
        priority: null,
        triggerState: null,
        triggerType: null,
        startTime: null,
        endTime: null,
        calendarName: null,
        misfireInstr: null,
        jobData: null,
        deleteBy: null,
        deleteDate: null,
        locked: null,
        dataRange: ''
      },
      qrtzTriggersPageProps: {
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
      if (this.qrtzTriggersQuery.dataRange && this.qrtzTriggersQuery.dataRange !== '') {
        this.qrtzTriggersQuery.startDate = this.qrtzTriggersQuery.dataRange[0]
        this.qrtzTriggersQuery.endDate = this.qrtzTriggersQuery.dataRange[1]
      } else {
        this.qrtzTriggersQuery.startDate = ''
        this.qrtzTriggersQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.qrtzTriggersQuery.startDate, endDate: this.qrtzTriggersQuery.endDate,
        pageSize: this.qrtzTriggersPageProps.pageSize, pageNum: this.qrtzTriggersPageProps.pageNum }).then(response => {
        const { data } = response
        this.qrtzTriggersPageProps.records = data.records
        this.qrtzTriggersPageProps.total = data.total
        this.qrtzTriggersPageProps.pageNum = data.pageNum
        this.qrtzTriggersPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.error(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['qrtzTriggersDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.qrtzTriggersDialog.data)
          if (this.qrtzTriggersDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.qrtzTriggersDialog.visible = false
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
                if (this.qrtzTriggersDialog.data.version) {
                  this.qrtzTriggersDialog.data.version++
                }
                const index = this.qrtzTriggersPageProps.records.findIndex(v => v.id === this.qrtzTriggersDialog.data.id)
                this.qrtzTriggersPageProps.records.splice(index, 1, this.qrtzTriggersDialog.data)
                this.qrtzTriggersDialog.visible = false
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
      this.$refs['qrtzTriggersTable'].clearSelection()
      this.$refs['qrtzTriggersTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.qrtzTriggersPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.qrtzTriggersPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['qrtzTriggersForm'].resetFields()
      this.qrtzTriggersQuery.dataRange = ''
      this.qrtzTriggersPageProps.records = null
      this.qrtzTriggersPageProps.total = 0
      this.qrtzTriggersPageProps.pageSize = 10
      this.qrtzTriggersPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['qrtzTriggersTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['qrtzTriggersTable'].clearSelection()
      this.$refs['qrtzTriggersTable'].toggleRowSelection(row)
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
      this.resetQrtzTriggersDialog()
      this.qrtzTriggersDialog.visible = true
      this.qrtzTriggersDialog.data = Object.assign({}, row)
      this.qrtzTriggersDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.qrtzTriggersDialog.visible = true
      this.qrtzTriggersDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetQrtzTriggersDialog()
      this.qrtzTriggersDialog.data.locked = 0
      this.qrtzTriggersDialog.visible = true
      this.qrtzTriggersDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.qrtzTriggersDialog.state = 'update'
    },
    // 重置信息页面
    resetQrtzTriggersDialog() {
      this.$nextTick(() => {
        if (this.$refs['qrtzTriggersDataForm']) {
          this.$refs['qrtzTriggersDataForm'].clearValidate()
        }
      })
      this.qrtzTriggersDialog.data = {
        id: undefined,
        jobName: null,
        jobGroup: null,
        description: null,
        nextFireTime: null,
        prevFireTime: null,
        priority: null,
        triggerState: null,
        triggerType: null,
        startTime: null,
        endTime: null,
        calendarName: null,
        misfireInstr: null,
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

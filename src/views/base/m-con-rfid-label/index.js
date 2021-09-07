import requestApi from '@/api/request-api'
import mConRfidLabelApi from '@/api/base/m-con-rfid-label-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { mapActions } from 'vuex'

const url = mConRfidLabelApi.url

export default {
  name: 'MConRfidLabel',
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
    },
    // 状态
    statusFilter(status) {
      const statusMap = {
        '1': '启用中',
        '2': '已作废',
        '3': '未启用'
      }
      return statusMap[status]
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
        name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '标签编码不能为空', trigger: 'blur' }],
        labelid: [{ required: true, message: '标签ID不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '标签状态不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '标签类型不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      rfidLabelType: [
        { key: '1', value: '类型1' },
        { key: '2', value: '类型2' }
      ],
      status: [
        { key: '1', value: '启用中' },
        { key: '2', value: '已作废' },
        { key: '3', value: '未启用' }
      ],
      mConRfidLabelDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          code: null,
          labelid: null,
          status: null,
          remark: null,
          type: null
        },
        formLabelWidth: '120px'
      },
      mConRfidLabelQuery: {
        name: null,
        code: null,
        labelid: null,
        status: null,
        remark: null,
        type: null,
        dataRange: ''
      },
      mConRfidLabelPageProps: {
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
      if (this.mConRfidLabelQuery.dataRange && this.mConRfidLabelQuery.dataRange !== '') {
        this.mConRfidLabelQuery.startDate = this.mConRfidLabelQuery.dataRange[0]
        this.mConRfidLabelQuery.endDate = this.mConRfidLabelQuery.dataRange[1]
      } else {
        this.mConRfidLabelQuery.startDate = ''
        this.mConRfidLabelQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.mConRfidLabelQuery.startDate, endDate: this.mConRfidLabelQuery.endDate,
        pageSize: this.mConRfidLabelPageProps.pageSize, pageNum: this.mConRfidLabelPageProps.pageNum }).then(response => {
        const { data } = response
        this.mConRfidLabelPageProps.record = data.records
        this.mConRfidLabelPageProps.total = data.total
        this.mConRfidLabelPageProps.pageNum = data.pageNum
        this.mConRfidLabelPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['mConRfidLabelDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.mConRfidLabelDialog.data)
          if (this.mConRfidLabelDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.mConRfidLabelDialog.visible = false
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
                if (this.mConRfidLabelDialog.data.version) {
                  this.mConRfidLabelDialog.data.version++
                }
                const index = this.mConRfidLabelPageProps.record.findIndex(v => v.id === this.mConRfidLabelDialog.data.id)
                this.mConRfidLabelPageProps.record.splice(index, 1, this.mConRfidLabelDialog.data)
                this.mConRfidLabelDialog.visible = false
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
      this.$refs['mConRfidLabelTable'].clearSelection()
      this.$refs['mConRfidLabelTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.mConRfidLabelPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.mConRfidLabelPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['mConRfidLabelForm'].resetFields()
      this.mConRfidLabelQuery.dataRange = ''
      this.mConRfidLabelPageProps.record = null
      this.mConRfidLabelPageProps.total = 0
      this.mConRfidLabelPageProps.pageSize = 10
      this.mConRfidLabelPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['mConRfidLabelTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['mConRfidLabelTable'].clearSelection()
      this.$refs['mConRfidLabelTable'].toggleRowSelection(row)
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
      this.resetMConRfidLabelDialog()
      this.mConRfidLabelDialog.visible = true
      this.mConRfidLabelDialog.data = Object.assign({}, row)
      this.mConRfidLabelDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.mConRfidLabelDialog.visible = true
      this.mConRfidLabelDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetMConRfidLabelDialog()
      this.mConRfidLabelDialog.data.locked = 0
      this.mConRfidLabelDialog.visible = true
      this.mConRfidLabelDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.mConRfidLabelDialog.state = 'update'
    },
    // 重置信息页面
    resetMConRfidLabelDialog() {
      this.$nextTick(() => {
        if (this.$refs['mConRfidLabelDataForm']) {
          this.$refs['mConRfidLabelDataForm'].clearValidate()
        }
      })
      this.mConRfidLabelDialog.data = {
        id: undefined,
        name: null,
        code: null,
        labelid: null,
        status: null,
        remark: null,
        type: null
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

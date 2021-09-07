import requestApi from '@/api/request-api'
import pConShiftApi from '@/api/base/p-con-shift-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = pConShiftApi.url

export default {
  name: 'PConShift',
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
    isFlagFilter(locked) {
      const isFlagMap = {
        '0': '有效',
        '1': '无效'
      }
      return isFlagMap[locked]
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
        shiftName: [{ required: true, message: '班次名称不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      pConShiftDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          shiftCode: null,
          shiftName: null,
          startTime: null,
          endTime: null,
          groupType: null,
          timeRange: ''
        },
        formLabelWidth: '120px'
      },
      pConShiftQuery: {
        shiftCode: null,
        shiftName: null,
        startTime: null,
        endTime: null,
        groupType: null,
        dataTimeRange: ''
      },
      pConShiftPageProps: {
        record: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions(),
      // 是否有效
      isFlagOptions: [{
        key: 0,
        text: '有效'
      }, {
        key: 1,
        text: '无效'
      }]
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
      console.log(this.pConShiftQuery.startTime)
      requestApi.getPage(url, { shiftCode: this.pConShiftQuery.shiftCode, shiftName: this.pConShiftQuery.shiftName,
        groupType: this.pConShiftQuery.groupType, isFlag: this.pConShiftQuery.isFlag,
        startTime: this.pConShiftQuery.startTime, endTime: this.pConShiftQuery.endTime,
        pageSize: this.pConShiftPageProps.pageSize, pageNum: this.pConShiftPageProps.pageNum }).then(response => {
        const { data } = response
        this.pConShiftPageProps.record = data.records
        this.pConShiftPageProps.total = data.total
        this.pConShiftPageProps.pageNum = data.pageNum
        this.pConShiftPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['pConShiftDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.pConShiftDialog.data)
          if (this.pConShiftDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.pConShiftDialog.visible = false
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
                if (this.pConShiftDialog.data.version) {
                  this.pConShiftDialog.data.version++
                }
                const index = this.pConShiftPageProps.record.findIndex(v => v.id === this.pConShiftDialog.data.id)
                this.pConShiftPageProps.record.splice(index, 1, this.pConShiftDialog.data)
                this.pConShiftDialog.visible = false
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
      this.$refs['pConShiftTable'].clearSelection()
      this.$refs['pConShiftTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pConShiftPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pConShiftPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['pConShiftForm'].resetFields()
      this.pConShiftQuery.dataTimeRange = ''
      this.pConShiftPageProps.record = null
      this.pConShiftPageProps.total = 0
      this.pConShiftPageProps.pageSize = 10
      this.pConShiftPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['pConShiftTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['pConShiftTable'].clearSelection()
      this.$refs['pConShiftTable'].toggleRowSelection(row)
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
      this.resetPConShiftDialog()
      this.pConShiftDialog.visible = true
      this.pConShiftDialog.data = Object.assign({}, row)
      this.pConShiftDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.pConShiftDialog.visible = true
      this.pConShiftDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetPConShiftDialog()
      this.pConShiftDialog.data.locked = 0
      this.pConShiftDialog.visible = true
      this.pConShiftDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.pConShiftDialog.state = 'update'
    },
    // 重置信息页面
    resetPConShiftDialog() {
      this.$nextTick(() => {
        if (this.$refs['pConShiftDataForm']) {
          this.$refs['pConShiftDataForm'].clearValidate()
        }
      })
      this.pConShiftDialog.data = {
        id: undefined,
        shiftCode: null,
        shiftName: null,
        startTime: null,
        endTime: null,
        groupType: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    isFlagFormat: function(row) {
      if (row.isFlag === 0) {
        return '有效'
      } else {
        return '无效'
      }
    }
  }
}

import requestApi from '@/api/request-api'
import pConTrainTypeApi from '@/api/meta/p-con-train-type-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = pConTrainTypeApi.url

export default {
  name: 'PConTrainType',
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
        trainTypeCode: [{ required: true, message: '车型编码不能为空', trigger: 'blur' }],
        trainTypeName: [{ required: true, message: '车型名称不能为空', trigger: 'blur' }]

      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      pConTrainTypeDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          trainTypeCode: null,
          trainTypeName: null,
          trainTypeDesc: null,
          remark: null,
          changeLen: null,
          trainNo: null,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      pConTrainTypeQuery: {
        trainTypeCode: null,
        trainTypeName: null
      },
      pConTrainTypePageProps: {
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
      if (this.pConTrainTypeQuery.dataRange && this.pConTrainTypeQuery.dataRange !== '') {
        this.pConTrainTypeQuery.startDate = this.pConTrainTypeQuery.dataRange[0]
        this.pConTrainTypeQuery.endDate = this.pConTrainTypeQuery.dataRange[1]
      } else {
        this.pConTrainTypeQuery.startDate = ''
        this.pConTrainTypeQuery.endDate = ''
      }
      console.log(this.pConTrainTypeQuery)
      requestApi.getPage(url, { trainTypeCode: this.pConTrainTypeQuery.trainTypeCode, trainTypeName: this.pConTrainTypeQuery.trainTypeName, startDate: this.pConTrainTypeQuery.startDate, endDate: this.pConTrainTypeQuery.endDate,
        pageSize: this.pConTrainTypePageProps.pageSize, pageNum: this.pConTrainTypePageProps.pageNum }).then(response => {
        const { data } = response
        this.pConTrainTypePageProps.records = data.records
        this.pConTrainTypePageProps.total = data.total
        this.pConTrainTypePageProps.pageNum = data.pageNum
        this.pConTrainTypePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['pConTrainTypeDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.pConTrainTypeDialog.data)
          if (this.pConTrainTypeDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.pConTrainTypeDialog.visible = false
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
                if (this.pConTrainTypeDialog.data.version) {
                  this.pConTrainTypeDialog.data.version++
                }
                const index = this.pConTrainTypePageProps.records.findIndex(v => v.id === this.pConTrainTypeDialog.data.id)
                this.pConTrainTypePageProps.records.splice(index, 1, this.pConTrainTypeDialog.data)
                this.pConTrainTypeDialog.visible = false
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
      this.$refs['pConTrainTypeTable'].clearSelection()
      this.$refs['pConTrainTypeTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pConTrainTypePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pConTrainTypePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['pConTrainTypeForm'].resetFields()
      this.pConTrainTypeQuery.dataRange = ''
      this.pConTrainTypePageProps.records = null
      this.pConTrainTypePageProps.total = 0
      this.pConTrainTypePageProps.pageSize = 10
      this.pConTrainTypePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['pConTrainTypeTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['pConTrainTypeTable'].clearSelection()
      this.$refs['pConTrainTypeTable'].toggleRowSelection(row)
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
      this.resetPConTrainTypeDialog()
      this.pConTrainTypeDialog.visible = true
      this.pConTrainTypeDialog.data = Object.assign({}, row)
      this.pConTrainTypeDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.pConTrainTypeDialog.visible = true
      this.pConTrainTypeDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetPConTrainTypeDialog()
      this.pConTrainTypeDialog.data.locked = 0
      this.pConTrainTypeDialog.visible = true
      this.pConTrainTypeDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.pConTrainTypeDialog.state = 'update'
    },
    // 重置信息页面
    resetPConTrainTypeDialog() {
      this.$nextTick(() => {
        if (this.$refs['pConTrainTypeDataForm']) {
          this.$refs['pConTrainTypeDataForm'].clearValidate()
        }
      })
      this.pConTrainTypeDialog.data = {
        id: undefined,
        trainTypeCode: null,
        trainTypeName: null,
        trainTypeDesc: null,
        remark: null,
        changeLen: null,
        trainNo: null,
        reserved1: null,
        reserved2: null,
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
    }
  }
}

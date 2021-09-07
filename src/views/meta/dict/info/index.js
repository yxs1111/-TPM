import requestApi from '@/api/request-api'
import dictInfoApi from '@/api/meta/dict-info-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = dictInfoApi.url

export default {
  name: 'DictInfo',
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
        name: [{ required: true, message: '字典信息名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典信息编码不能为空', trigger: 'blur' }],
        typeCode: [{ required: true, message: '请选择字典类型', trigger: 'change' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      dictInfoDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          typeCode: '',
          typeName: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      dictInfoQuery: {
        name: '',
        typeCode: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      dictTypeSelectOption: [],
      dictInfoPageProps: {
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
    this.listAllType()
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
      if (this.dictInfoQuery.dataRange && this.dictInfoQuery.dataRange !== '') {
        this.dictInfoQuery.startDate = this.dictInfoQuery.dataRange[0]
        this.dictInfoQuery.endDate = this.dictInfoQuery.dataRange[1]
      } else {
        this.dictInfoQuery.startDate = ''
        this.dictInfoQuery.endDate = ''
      }
      requestApi.getPage(url, {
        name: this.dictInfoQuery.name, locked: this.dictInfoQuery.locked, typeCode: this.dictInfoQuery.typeCode,
        startDate: this.dictInfoQuery.startDate, endDate: this.dictInfoQuery.endDate,
        pageSize: this.dictInfoPageProps.pageSize, pageNum: this.dictInfoPageProps.pageNum
      }).then(response => {
        const { data } = response
        this.dictInfoPageProps.records = data.records
        this.dictInfoPageProps.total = data.total
        this.dictInfoPageProps.pageNum = data.pageNum
        this.dictInfoPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['dictInfoDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.dictInfoDialog.data)
          if (this.dictInfoDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.dictInfoDialog.visible = false
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
                this.dictTypeSelectOption.map(item => {
                  if (item.code === this.dictInfoDialog.data.typeCode) {
                    this.dictInfoDialog.data.typeName = item.name
                  }
                })
                const index = this.dictInfoPageProps.records.findIndex(v => v.id === this.dictInfoDialog.data.id)
                this.dictInfoPageProps.records.splice(index, 1, this.dictInfoDialog.data)
                this.dictInfoDialog.visible = false
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
        const codes = []
        this.multipleSelection.map(row => {
          codes.push(row.code)
        })
        requestApi.remove(url, codes).then((res) => {
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
      this.$refs['dictInfoTable'].clearSelection()
      this.$refs['dictInfoTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.dictInfoPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.dictInfoPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['dictInfoForm'].resetFields()
      this.dictInfoQuery.dataRange = ''
      this.dictInfoPageProps.records = null
      this.dictInfoPageProps.total = 0
      this.dictInfoPageProps.pageSize = 10
      this.dictInfoPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['dictInfoTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['dictInfoTable'].clearSelection()
      this.$refs['dictInfoTable'].toggleRowSelection(row)
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
      this.resetDictInfoDialog()
      this.dictInfoDialog.visible = true
      this.dictInfoDialog.data = Object.assign({}, row)
      this.dictInfoDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetDictInfoDialog()
      this.dictInfoDialog.visible = true
      this.dictInfoDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetDictInfoDialog()
      this.dictInfoDialog.data.gender = 0
      this.dictInfoDialog.data.locked = 0
      this.dictInfoDialog.visible = true
      this.dictInfoDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.dictInfoDialog.state = 'update'
    },
    // 重置信息页面
    resetDictInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs['dictInfoDataForm']) {
          this.$refs['dictInfoDataForm'].clearValidate()
        }
      })
      this.dictInfoDialog.data = {
        id: undefined,
        name: '',
        typeCode: '',
        typeName: '',
        code: '',
        locked: 0,
        createBy: null,
        createDate: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 获取所有字典类型
    async listAllType() {
      dictInfoApi.listTypes().then(res => {
        this.dictTypeSelectOption = res.data
      }).catch(error => {
        this.dictTypeSelectOption = []
        console.log(error)
      })
    }
  }
}

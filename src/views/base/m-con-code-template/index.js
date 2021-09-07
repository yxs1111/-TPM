import requestApi from '@/api/request-api'
import mConCodeTemplateApi from '@/api/base/m-con-code-template-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { mapActions } from 'vuex'

const url = mConCodeTemplateApi.url

export default {
  name: 'MConCodeTemplate',
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
    status: [
      { key: '1', value: '启用中' },
      { key: '2', value: '已作废' },
      { key: '3', value: '未启用' }
    ],
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
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '模板类型不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '模板状态不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      codeTemplateType: [],
      // 规则状态
      status: [
        { key: '1', value: '启用中' },
        { key: '2', value: '已作废' },
        { key: '3', value: '未启用' }
      ],
      mConCodeTemplateDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          code: null,
          codeVal: null,
          type: null,
          attInfo: null,
          status: null
        },
        formLabelWidth: '120px'
      },
      mConCodeTemplateQuery: {
        name: null,
        code: null,
        codeVal: null,
        type: null,
        attInfo: null,
        status: null,
        dataRange: ''
      },
      mConCodeTemplatePageProps: {
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
    this.getDictInfoByType('codeTemplateType').then(({ codeTemplateType }) => {
      this.codeTemplateType = codeTemplateType
    })
    this.fetchData()
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  methods: {
    ...mapActions(['getDictInfoByType']),
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.mConCodeTemplateQuery.dataRange && this.mConCodeTemplateQuery.dataRange !== '') {
        this.mConCodeTemplateQuery.startDate = this.mConCodeTemplateQuery.dataRange[0]
        this.mConCodeTemplateQuery.endDate = this.mConCodeTemplateQuery.dataRange[1]
      } else {
        this.mConCodeTemplateQuery.startDate = ''
        this.mConCodeTemplateQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.mConCodeTemplateQuery.startDate, endDate: this.mConCodeTemplateQuery.endDate,
        pageSize: this.mConCodeTemplatePageProps.pageSize, pageNum: this.mConCodeTemplatePageProps.pageNum }).then(response => {
        const { data } = response
        this.mConCodeTemplatePageProps.record = data.records
        this.mConCodeTemplatePageProps.total = data.total
        this.mConCodeTemplatePageProps.pageNum = data.pageNum
        this.mConCodeTemplatePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['mConCodeTemplateDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.mConCodeTemplateDialog.data)
          if (this.mConCodeTemplateDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.mConCodeTemplateDialog.visible = false
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
                if (this.mConCodeTemplateDialog.data.version) {
                  this.mConCodeTemplateDialog.data.version++
                }
                const index = this.mConCodeTemplatePageProps.record.findIndex(v => v.id === this.mConCodeTemplateDialog.data.id)
                this.mConCodeTemplatePageProps.record.splice(index, 1, this.mConCodeTemplateDialog.data)
                this.mConCodeTemplateDialog.visible = false
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
      this.$refs['mConCodeTemplateTable'].clearSelection()
      this.$refs['mConCodeTemplateTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.mConCodeTemplatePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.mConCodeTemplatePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['mConCodeTemplateForm'].resetFields()
      this.mConCodeTemplateQuery.dataRange = ''
      this.mConCodeTemplatePageProps.record = null
      this.mConCodeTemplatePageProps.total = 0
      this.mConCodeTemplatePageProps.pageSize = 10
      this.mConCodeTemplatePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['mConCodeTemplateTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['mConCodeTemplateTable'].clearSelection()
      this.$refs['mConCodeTemplateTable'].toggleRowSelection(row)
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
      this.resetMConCodeTemplateDialog()
      this.mConCodeTemplateDialog.visible = true
      this.mConCodeTemplateDialog.data = Object.assign({}, row)
      this.mConCodeTemplateDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.mConCodeTemplateDialog.visible = true
      this.mConCodeTemplateDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetMConCodeTemplateDialog()
      this.mConCodeTemplateDialog.data.locked = 0
      this.mConCodeTemplateDialog.visible = true
      this.mConCodeTemplateDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.mConCodeTemplateDialog.state = 'update'
    },
    // 重置信息页面
    resetMConCodeTemplateDialog() {
      this.$nextTick(() => {
        if (this.$refs['mConCodeTemplateDataForm']) {
          this.$refs['mConCodeTemplateDataForm'].clearValidate()
        }
      })
      this.mConCodeTemplateDialog.data = {
        id: undefined,
        name: null,
        code: null,
        codeVal: null,
        type: null,
        attInfo: null,
        status: null
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

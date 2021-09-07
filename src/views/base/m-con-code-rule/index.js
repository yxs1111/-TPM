import requestApi from '@/api/request-api'
import mConCodeRuleApi from '@/api/base/m-con-code-rule-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { mapActions } from 'vuex'

const url = mConCodeRuleApi.url

export default {
  name: 'MConCodeRule',
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
    // 启动状态
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
      status: [
        { key: 1, value: '启用中' },
        { key: 2, value: '已作废' },
        { key: 3, value: '未启用' }
      ],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: getTextMap(),
      rules: {
        name: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '规则状态不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      codeRuleType: [],
      mConCodeRuleDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          code: null,
          codeVal: null,
          status: null,
          noOne: null,
          noTwo: null,
          noThree: null,
          noFour: null,
          noFive: null
        },
        formLabelWidth: '120px'
      },
      mConCodeRuleQuery: {
        name: null,
        code: null,
        codeVal: null,
        status: null,
        noOne: null,
        noTwo: null,
        noThree: null,
        noFour: null,
        noFive: null,
        dataRange: ''
      },
      mConCodeRulePageProps: {
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
    this.getDictInfoByType('codeRuleType').then(({ codeRuleType }) => {
      this.codeRuleType = codeRuleType
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
      if (this.mConCodeRuleQuery.dataRange && this.mConCodeRuleQuery.dataRange !== '') {
        this.mConCodeRuleQuery.startDate = this.mConCodeRuleQuery.dataRange[0]
        this.mConCodeRuleQuery.endDate = this.mConCodeRuleQuery.dataRange[1]
      } else {
        this.mConCodeRuleQuery.startDate = ''
        this.mConCodeRuleQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.mConCodeRuleQuery.startDate, endDate: this.mConCodeRuleQuery.endDate,
        pageSize: this.mConCodeRulePageProps.pageSize, pageNum: this.mConCodeRulePageProps.pageNum }).then(response => {
        const { data } = response
        this.mConCodeRulePageProps.record = data.records
        this.mConCodeRulePageProps.total = data.total
        this.mConCodeRulePageProps.pageNum = data.pageNum
        this.mConCodeRulePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['mConCodeRuleDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.mConCodeRuleDialog.data)
          if (this.mConCodeRuleDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.mConCodeRuleDialog.visible = false
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
                if (this.mConCodeRuleDialog.data.version) {
                  this.mConCodeRuleDialog.data.version++
                }
                const index = this.mConCodeRulePageProps.record.findIndex(v => v.id === this.mConCodeRuleDialog.data.id)
                this.mConCodeRulePageProps.record.splice(index, 1, this.mConCodeRuleDialog.data)
                this.mConCodeRuleDialog.visible = false
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
      this.$refs['mConCodeRuleTable'].clearSelection()
      this.$refs['mConCodeRuleTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.mConCodeRulePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.mConCodeRulePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['mConCodeRuleForm'].resetFields()
      this.mConCodeRuleQuery.dataRange = ''
      this.mConCodeRulePageProps.record = null
      this.mConCodeRulePageProps.total = 0
      this.mConCodeRulePageProps.pageSize = 10
      this.mConCodeRulePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['mConCodeRuleTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['mConCodeRuleTable'].clearSelection()
      this.$refs['mConCodeRuleTable'].toggleRowSelection(row)
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
      this.resetMConCodeRuleDialog()
      this.mConCodeRuleDialog.visible = true
      this.mConCodeRuleDialog.data = Object.assign({}, row)
      this.mConCodeRuleDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.mConCodeRuleDialog.visible = true
      this.mConCodeRuleDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetMConCodeRuleDialog()
      this.mConCodeRuleDialog.data.locked = 0
      this.mConCodeRuleDialog.visible = true
      this.mConCodeRuleDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.mConCodeRuleDialog.state = 'update'
    },
    // 重置信息页面
    resetMConCodeRuleDialog() {
      this.$nextTick(() => {
        if (this.$refs['mConCodeRuleDataForm']) {
          this.$refs['mConCodeRuleDataForm'].clearValidate()
        }
      })
      this.mConCodeRuleDialog.data = {
        id: undefined,
        name: null,
        code: null,
        codeVal: null,
        status: null,
        noOne: null,
        noTwo: null,
        noThree: null,
        noFour: null,
        noFive: null
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

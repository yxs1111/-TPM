import requestApi from '@/api/request-api'
import clientApi from '@/api/system/client-api'
import { getFormatPickerOptions, getTextMap, parseTime, getGrantTypeOptions, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = clientApi.url

export default {
  name: 'ClientInfo',
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
        clientId: [{ required: true, message: '客户端ID不能为空', trigger: 'blur' }],
        clientName: [{ required: true, message: '客户端名称不能为空', trigger: 'blur' }],
        clientSecret: [{ required: true, message: '客户端密码不能为空', trigger: 'blur' }],
        authorizedGrantTypesArr: [{ required: true, message: '请至少选择一种授权类型', trigger: 'change' }],
        accessTokenValidity: [{ required: true, message: 'token有效期不能为空', trigger: 'blur' }],
        refreshTokenValidity: [{ required: true, message: 'refresh_token有效期不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      clientDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          clientId: '',
          clientName: '',
          clientSecret: '',
          authorizedGrantTypes: '',
          authorizedGrantTypesArr: [],
          accessTokenValidity: 1800,
          refreshTokenValidity: 1800,
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      clientQuery: {
        clientId: '',
        clientName: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      clientPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 授权类型选择框
      grantTypeSelectOptions: getGrantTypeOptions(),
      // 对话框
      centerDialogVisible: false,
      // 权限信息
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
      if (this.clientQuery.dataRange && this.clientQuery.dataRange !== '') {
        this.clientQuery.startDate = this.clientQuery.dataRange[0]
        this.clientQuery.endDate = this.clientQuery.dataRange[1]
      } else {
        this.clientQuery.startDate = ''
        this.clientQuery.endDate = ''
      }
      requestApi.getPage(url, { clientId: this.clientQuery.clientId, clientName: this.clientQuery.clientName, locked: this.clientQuery.locked,
        startDate: this.clientQuery.startDate, endDate: this.clientQuery.endDate,
        pageSize: this.clientPageProps.pageSize, pageNum: this.clientPageProps.pageNum }).then(response => {
        const { data } = response
        this.clientPageProps.records = data.records
        this.clientPageProps.total = data.total
        this.clientPageProps.pageNum = data.pageNum
        this.clientPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['clientDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.clientDialog.data)
          params.authorizedGrantTypes = params.authorizedGrantTypesArr.join(',')
          if (this.clientDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.clientDialog.visible = false
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
                if (this.clientDialog.data.version) {
                  this.clientDialog.data.version++
                }
                const index = this.clientPageProps.records.findIndex(v => v.id === this.clientDialog.data.id)
                this.clientDialog.data.authorizedGrantTypes = this.clientDialog.data.authorizedGrantTypesArr.join(',')
                this.clientPageProps.records.splice(index, 1, this.clientDialog.data)
                this.clientDialog.visible = false
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
        const clientIds = []
        this.multipleSelection.map(row => {
          clientIds.push(row.clientId)
        })
        requestApi.remove(url, clientIds).then((res) => {
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
      this.$refs['clientTable'].clearSelection()
      this.$refs['clientTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.clientPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.clientPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['clientForm'].resetFields()
      this.clientQuery.dataRange = ''
      this.clientPageProps.records = null
      this.clientPageProps.total = 0
      this.clientPageProps.pageSize = 10
      this.clientPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['clientTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['clientTable'].clearSelection()
      this.$refs['clientTable'].toggleRowSelection(row)
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
      this.resetClientDialog()
      this.clientDialog.visible = true
      this.clientDialog.data = Object.assign({}, row)
      this.clientDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetClientDialog()
      this.clientDialog.visible = true
      this.clientDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetClientDialog()
      this.clientDialog.data.gender = 0
      this.clientDialog.data.locked = 0
      this.clientDialog.visible = true
      this.clientDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.clientDialog.state = 'update'
      this.$set(this.clientDialog.data, 'authorizedGrantTypesArr', this.clientDialog.data.authorizedGrantTypes.split(','))
    },
    // 重置信息页面
    resetClientDialog() {
      this.$nextTick(() => {
        if (this.$refs['clientDataForm']) {
          this.$refs['clientDataForm'].clearValidate()
        }
      })
      this.clientDialog.data = {
        id: undefined,
        clientId: '',
        clientName: '',
        clientSecret: '',
        authorizedGrantTypes: '',
        authorizedGrantTypesArr: [],
        accessTokenValidity: 1800,
        refreshTokenValidity: 1800,
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
    }
  }
}

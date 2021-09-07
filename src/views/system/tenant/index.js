import requestApi from '@/api/request-api'
import authTenantApi from '@/api/system/auth-tenant-api'
import { getPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import vPinyin from '@/utils/pinyin/vue-py'

const url = authTenantApi.url

export default {
  name: 'AuthTenant',
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
        '0': '正常',
        '1': '禁用'
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
        tenantId: [{ required: true, message: '租户编码不能为空', trigger: 'blur' }],
        manager: [{ required: true, message: '管理员账号不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '管理员手机号不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        expireAt: [{ required: true, message: '过期时间不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      authTenantDialog: {
        state: '',
        visible: false,
        data: {
          tenantId: '',
          tenantName: '',
          manager: '',
          id: undefined,
          phone: '',
          gender: 0,
          expireAt: null
        },
        formLabelWidth: '120px'
      },
      authTenantQuery: {
        tenantId: '',
        tenantName: '',
        manager: ''
      },
      authTenantPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      activeDialogVisible: false,
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
      if (this.authTenantQuery.dataRange && this.authTenantQuery.dataRange !== '') {
        this.authTenantQuery.startDate = this.authTenantQuery.dataRange[0]
        this.authTenantQuery.endDate = this.authTenantQuery.dataRange[1]
      } else {
        this.authTenantQuery.startDate = ''
        this.authTenantQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.authTenantQuery.startDate, endDate: this.authTenantQuery.endDate,
        pageSize: this.authTenantPageProps.pageSize, pageNum: this.authTenantPageProps.pageNum,
        tenantId: this.authTenantQuery.tenantId, tenantName: this.authTenantQuery.tenantName, manager: this.authTenantQuery.manager
      }).then(response => {
        const { data } = response
        this.authTenantPageProps.records = data.records
        this.authTenantPageProps.total = data.total
        this.authTenantPageProps.pageNum = data.pageNum
        this.authTenantPageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['authTenantDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.authTenantDialog.data)
          if (this.authTenantDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.authTenantDialog.visible = false
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
                if (this.authTenantDialog.data.version) {
                  this.authTenantDialog.data.version++
                }
                const index = this.authTenantPageProps.records.findIndex(v => v.id === this.authTenantDialog.data.id)
                this.authTenantPageProps.records.splice(index, 1, this.authTenantDialog.data)
                this.authTenantDialog.visible = false
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
    // 显示禁用确认框
    showDeleteDialog() {
      this.centerDialogVisible = true
    },
    // 禁用方法
    handleDeleteRows() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.centerDialogVisible = false
        const authTenants = []
        this.multipleSelection.map(row => {
          authTenants.push({ id: row.id, tenantId: row.tenantId, locked: '1' })
        })
        authTenantApi.setDisable(authTenants).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '禁用成功',
              duration: 5 * 1000
            })
            this.fetchData()
          }
        })
      }
    },
    // 单个禁用
    handleDelete(row) {
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.centerDialogVisible = true
    },
    // 显示启用确认框
    showActiveDialog() {
      this.activeDialogVisible = true
    },
    // 启用方法
    handleActiveRows() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.activeDialogVisible = false
        const authTenants = []
        this.multipleSelection.map(row => {
          authTenants.push({ id: row.id, tenantId: row.tenantId, locked: '0' })
        })
        authTenantApi.setDisable(authTenants).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '启用成功',
              duration: 5 * 1000
            })
            this.fetchData()
          }
        })
      }
    },
    // 单个启用
    handleActive(row) {
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.activeDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.authTenantPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.authTenantPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['authTenantForm'].resetFields()
      this.authTenantPageProps.records = null
      this.authTenantPageProps.total = 0
      this.authTenantPageProps.pageSize = 10
      this.authTenantPageProps.pageNum = 1
      this.authTenantQuery.manager = ''
      this.authTenantQuery.tenantId = ''
      this.authTenantQuery.tenantName = ''
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && column.label !== '管理员账号') {
        this.$refs['authTenantTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '管理员账号') {
        this.$refs['authTenantTable'].clearSelection()
        this.$refs['authTenantTable'].toggleRowSelection(row)
        this.getRowData(row)
      }
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
      this.resetAuthTenantDialog()
      this.authTenantDialog.data = Object.assign({}, row)
      this.authTenantDialog.state = 'info'
      this.authTenantDialog.visible = true
    },
    // 编辑
    editRowData(row) {
      this.resetAuthTenantDialog()
      this.authTenantDialog.visible = true
      this.authTenantDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetAuthTenantDialog()
      this.authTenantDialog.data.deletedFlag = 0
      this.authTenantDialog.data.createDate = new Date()
      this.authTenantDialog.data.gender = 0
      this.authTenantDialog.data.locked = 0
      this.authTenantDialog.data.expireAt = null
      this.authTenantDialog.visible = true
      this.authTenantDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.authTenantDialog.state = 'update'
    },
    // 重置信息页面
    resetAuthTenantDialog() {
      this.$nextTick(() => {
        if (this.$refs['authTenantDataForm']) {
          this.$refs['authTenantDataForm'].clearValidate()
        }
      })
      this.authTenantDialog.data = {
        tenantId: '',
        tenantName: '',
        manager: '',
        id: undefined,
        phone: '',
        gender: 0,
        expireAt: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 根据租户名设置账号
    setManager(value) {
      this.authTenantDialog.data.manager = vPinyin.chineseToPinYin(value)
    }
  }
}

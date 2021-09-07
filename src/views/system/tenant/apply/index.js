import requestApi from '@/api/request-api'
import authTenantApplyApi from '@/api/system/auth-tenant-apply-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = authTenantApplyApi.url

export default {
  name: 'AuthTenantApply',
  directives: { elDragDialog, permission },
  filters: {
    // 锁定状态文字
    approvedWordFilter(approved) {
      const approvedMap = {
        0: '审核中',
        1: '已通过',
        2: '未通过'
      }
      return approvedMap[approved]
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
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '简称不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '所属区域名称不能为空', trigger: 'blur' }],
        contactName: [{ required: true, message: '联系人名称不能为空', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '联系人手机号不能为空', trigger: 'blur' }],
        applyPhone: [{ required: true, message: '申请人手机号不能为空', trigger: 'blur' }]
      },
      approvedStateOptions: [
        { key: 0, display_name: '审核中' },
        { key: 1, display_name: '已通过' },
        { key: 2, display_name: '未通过' }
      ],
      authTenantApplyDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          nickName: null,
          areaId: null,
          areaName: null,
          contactName: null,
          contactPhone: null,
          contactEmail: null,
          applyPhone: null,
          approved: 0
        },
        formLabelWidth: '120px'
      },
      authTenantApplyQuery: {
        name: null,
        nickName: null,
        areaId: null,
        contactName: null,
        applyPhone: null,
        approved: null,
        dataRange: ''
      },
      authTenantApplyPageProps: {
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
      if (this.authTenantApplyQuery.dataRange && this.authTenantApplyQuery.dataRange !== '') {
        this.authTenantApplyQuery.startDate = this.authTenantApplyQuery.dataRange[0]
        this.authTenantApplyQuery.endDate = this.authTenantApplyQuery.dataRange[1]
      } else {
        this.authTenantApplyQuery.startDate = ''
        this.authTenantApplyQuery.endDate = ''
      }
      requestApi.getPage(url, {
        startDate: this.authTenantApplyQuery.startDate, endDate: this.authTenantApplyQuery.endDate,
        pageSize: this.authTenantApplyPageProps.pageSize, pageNum: this.authTenantApplyPageProps.pageNum
      }).then(response => {
        const { data } = response
        this.authTenantApplyPageProps.records = data.records
        this.authTenantApplyPageProps.total = data.total
        this.authTenantApplyPageProps.pageNum = data.pageNum
        this.authTenantApplyPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['authTenantApplyDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.authTenantApplyDialog.data)
          if (this.authTenantApplyDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.authTenantApplyDialog.visible = false
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
                if (this.authTenantApplyDialog.data.version) {
                  this.authTenantApplyDialog.data.version++
                }
                const index = this.authTenantApplyPageProps.records.findIndex(v => v.id === this.authTenantApplyDialog.data.id)
                this.authTenantApplyPageProps.records.splice(index, 1, this.authTenantApplyDialog.data)
                this.authTenantApplyDialog.visible = false
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
    // 审核方法
    approved() {
      const temp = this.authTenantApplyDialog.data.approved
      this.saveLoading = true
      this.authTenantApplyDialog.data.approved = 1
      const params = Object.assign({}, this.authTenantApplyDialog.data)
      requestApi.request_put(url + '/approved', params).then((res) => {
        this.saveLoading = false
        if (res && res.code === 1000) {
          if (this.authTenantApplyDialog.data.version) {
            this.authTenantApplyDialog.data.version++
          }
          const index = this.authTenantApplyPageProps.records.findIndex(v => v.id === this.authTenantApplyDialog.data.id)
          this.authTenantApplyPageProps.records.splice(index, 1, this.authTenantApplyDialog.data)
          this.authTenantApplyDialog.visible = false
          Message.success({
            message: '审核成功',
            duration: 5 * 1000
          })
        } else {
          this.authTenantApplyDialog.data.approved = temp
        }
      }).catch(() => {
        this.authTenantApplyDialog.data.approved = temp
        this.saveLoading = false
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
      this.$refs['authTenantApplyTable'].clearSelection()
      this.$refs['authTenantApplyTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.authTenantApplyPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.authTenantApplyPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['authTenantApplyForm'].resetFields()
      this.authTenantApplyQuery.dataRange = ''
      this.authTenantApplyPageProps.records = null
      this.authTenantApplyPageProps.total = 0
      this.authTenantApplyPageProps.pageSize = 10
      this.authTenantApplyPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['authTenantApplyTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['authTenantApplyTable'].clearSelection()
      this.$refs['authTenantApplyTable'].toggleRowSelection(row)
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
      this.resetAuthTenantApplyDialog()
      this.authTenantApplyDialog.visible = true
      this.authTenantApplyDialog.data = Object.assign({}, row)
      this.authTenantApplyDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.authTenantApplyDialog.visible = true
      this.authTenantApplyDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetAuthTenantApplyDialog()
      this.authTenantApplyDialog.data.locked = 0
      this.authTenantApplyDialog.visible = true
      this.authTenantApplyDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.authTenantApplyDialog.state = 'update'
    },
    // 重置信息页面
    resetAuthTenantApplyDialog() {
      this.$nextTick(() => {
        if (this.$refs['authTenantApplyDataForm']) {
          this.$refs['authTenantApplyDataForm'].clearValidate()
        }
      })
      this.authTenantApplyDialog.data = {
        id: undefined,
        name: null,
        nickName: null,
        areaId: null,
        areaName: null,
        contactName: null,
        contactPhone: null,
        contactEmail: null,
        applyPhone: null,
        approved: 0
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

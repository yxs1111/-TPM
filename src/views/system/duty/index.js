import requestApi from '@/api/request-api'
import dutyApi from '@/api/system/duty-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import organizationApi from '@/api/system/organization-api'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const url = dutyApi.url

export default {
  name: 'AuthDuty',
  components: { Treeselect },
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
        orgId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '组织名称不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      authDutyDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          orgId: null,
          orgName: null,
          createBy: null,
          createDate: null,
          locked: null
        },
        formLabelWidth: '120px'
      },
      authDutyQuery: {
        name: null,
        orgId: null,
        locked: null,
        dataRange: ''
      },
      authDutyPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions(),
      allOrg: []
    }
  },
  created() {
    this.fetchData()
    this.getAllOrg()
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
      if (this.authDutyQuery.dataRange && this.authDutyQuery.dataRange !== '') {
        this.authDutyQuery.startDate = this.authDutyQuery.dataRange[0]
        this.authDutyQuery.endDate = this.authDutyQuery.dataRange[1]
      } else {
        this.authDutyQuery.startDate = ''
        this.authDutyQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.authDutyQuery.startDate, endDate: this.authDutyQuery.endDate,
        name: this.authDutyQuery.name, orgId: this.authDutyQuery.orgId, locked: this.authDutyQuery.locked,
        pageSize: this.authDutyPageProps.pageSize, pageNum: this.authDutyPageProps.pageNum }).then(response => {
        const { data } = response
        this.authDutyPageProps.records = data.records
        this.authDutyPageProps.total = data.total
        this.authDutyPageProps.pageNum = data.pageNum
        this.authDutyPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['authDutyDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.authDutyDialog.data)
          if (this.authDutyDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.authDutyDialog.visible = false
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
                if (this.authDutyDialog.data.version) {
                  this.authDutyDialog.data.version++
                }
                const index = this.authDutyPageProps.records.findIndex(v => v.id === this.authDutyDialog.data.id)
                this.authDutyPageProps.records.splice(index, 1, this.authDutyDialog.data)
                this.authDutyDialog.visible = false
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
      this.$refs['authDutyTable'].clearSelection()
      this.$refs['authDutyTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.authDutyPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.authDutyPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['authDutyForm'].resetFields()
      this.authDutyQuery.dataRange = ''
      this.authDutyPageProps.records = null
      this.authDutyPageProps.total = 0
      this.authDutyPageProps.pageSize = 10
      this.authDutyPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['authDutyTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['authDutyTable'].clearSelection()
      this.$refs['authDutyTable'].toggleRowSelection(row)
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
    tableRowClassName({ row }) {
      if (row.locked === 1) {
        return 'warning-row'
      } else if (row.locked === 3) {
        return 'success-row'
      }
      return ''
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetAuthDutyDialog()
      this.authDutyDialog.visible = true
      this.authDutyDialog.data = Object.assign({}, row)
      this.authDutyDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.authDutyDialog.visible = true
      this.authDutyDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetAuthDutyDialog()
      this.authDutyDialog.data.locked = 0
      this.authDutyDialog.visible = true
      this.authDutyDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.authDutyDialog.state = 'update'
    },
    // 重置信息页面
    resetAuthDutyDialog() {
      this.$nextTick(() => {
        if (this.$refs['authDutyDataForm']) {
          this.$refs['authDutyDataForm'].clearValidate()
        }
      })
      this.authDutyDialog.data = {
        id: undefined,
        name: null,
        orgId: null,
        orgName: null,
        createBy: null,
        createDate: null,
        locked: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 获取所有组织
    getAllOrg() {
      organizationApi.getAll().then(response => {
        if (response.data.children) {
          this.allOrg = response.data.children
        }
      })
    },
    // 自定义树显示
    normalizer(node) {
      if (!node.children || node.children.length < 1) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 值发生变更
    onInputChange(node) {
      this.$nextTick(() => { this.$refs['authDutyDataForm'].validateField('orgId') })
    }
  }
}

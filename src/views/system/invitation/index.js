import requestApi from '@/api/request-api'
import invitationRecordApi from '@/api/system/invitation-record-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = invitationRecordApi.url

export default {
  name: 'InvitationRecord',
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
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      invitationRecordDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          userId: null,
          userPhone: null,
          tenantId: null,
          tenantSchema: null,
          tenantName: null,
          orgId: null,
          orgName: null,
          source: null,
          state: null,
          locked: null,
          createBy: null,
          createDate: null,
          version: null
        },
        formLabelWidth: '120px'
      },
      invitationRecordQuery: {
        userId: null,
        userPhone: null,
        tenantId: null,
        tenantSchema: null,
        tenantName: null,
        orgId: null,
        orgName: null,
        source: null,
        state: null,
        locked: null,
        dataRange: ''
      },
      invitationRecordPageProps: {
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
      if (this.invitationRecordQuery.dataRange && this.invitationRecordQuery.dataRange !== '') {
        this.invitationRecordQuery.startDate = this.invitationRecordQuery.dataRange[0]
        this.invitationRecordQuery.endDate = this.invitationRecordQuery.dataRange[1]
      } else {
        this.invitationRecordQuery.startDate = ''
        this.invitationRecordQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.invitationRecordQuery.startDate, endDate: this.invitationRecordQuery.endDate,
        pageSize: this.invitationRecordPageProps.pageSize, pageNum: this.invitationRecordPageProps.pageNum }).then(response => {
        const { data } = response
        this.invitationRecordPageProps.records = data.records
        this.invitationRecordPageProps.total = data.total
        this.invitationRecordPageProps.pageNum = data.pageNum
        this.invitationRecordPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['invitationRecordDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.invitationRecordDialog.data)
          if (this.invitationRecordDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.invitationRecordDialog.visible = false
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
                if (this.invitationRecordDialog.data.version) {
                  this.invitationRecordDialog.data.version++
                }
                const index = this.invitationRecordPageProps.records.findIndex(v => v.id === this.invitationRecordDialog.data.id)
                this.invitationRecordPageProps.records.splice(index, 1, this.invitationRecordDialog.data)
                this.invitationRecordDialog.visible = false
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
      this.$refs['invitationRecordTable'].clearSelection()
      this.$refs['invitationRecordTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.invitationRecordPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.invitationRecordPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['invitationRecordForm'].resetFields()
      this.invitationRecordQuery.dataRange = ''
      this.invitationRecordPageProps.records = null
      this.invitationRecordPageProps.total = 0
      this.invitationRecordPageProps.pageSize = 10
      this.invitationRecordPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['invitationRecordTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['invitationRecordTable'].clearSelection()
      this.$refs['invitationRecordTable'].toggleRowSelection(row)
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
      this.resetInvitationRecordDialog()
      this.invitationRecordDialog.visible = true
      this.invitationRecordDialog.data = Object.assign({}, row)
      this.invitationRecordDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.invitationRecordDialog.visible = true
      this.invitationRecordDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetInvitationRecordDialog()
      this.invitationRecordDialog.data.locked = 0
      this.invitationRecordDialog.visible = true
      this.invitationRecordDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.invitationRecordDialog.state = 'update'
    },
    // 重置信息页面
    resetInvitationRecordDialog() {
      this.$nextTick(() => {
        if (this.$refs['invitationRecordDataForm']) {
          this.$refs['invitationRecordDataForm'].clearValidate()
        }
      })
      this.invitationRecordDialog.data = {
        id: undefined,
        userId: null,
        userPhone: null,
        tenantId: null,
        tenantSchema: null,
        tenantName: null,
        orgId: null,
        orgName: null,
        source: null,
        state: null,
        locked: null,
        createBy: null,
        createDate: null,
        version: null
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

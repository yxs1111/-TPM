import requestApi from '@/api/request-api'
import demoApi from '@/api/demo/demo-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = demoApi.url

export default {
  name: 'Demo',
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
      demoDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null
        },
        formLabelWidth: '120px'
      },
      demoQuery: {
        name: null,
        dataRange: ''
      },
      demoPageProps: {
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
      if (this.demoQuery.dataRange && this.demoQuery.dataRange !== '') {
        this.demoQuery.startDate = this.demoQuery.dataRange[0]
        this.demoQuery.endDate = this.demoQuery.dataRange[1]
      } else {
        this.demoQuery.startDate = ''
        this.demoQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.demoQuery.startDate, endDate: this.demoQuery.endDate,
        pageSize: this.demoPageProps.pageSize, pageNum: this.demoPageProps.pageNum }).then(response => {
        const { data } = response
        this.demoPageProps.record = data.records
        this.demoPageProps.total = data.total
        this.demoPageProps.pageNum = data.pageNum
        this.demoPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['demoDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.demoDialog.data)
          if (this.demoDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.demoDialog.visible = false
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
                if (this.demoDialog.data.version) {
                  this.demoDialog.data.version++
                }
                const index = this.demoPageProps.record.findIndex(v => v.id === this.demoDialog.data.id)
                this.demoPageProps.record.splice(index, 1, this.demoDialog.data)
                this.demoDialog.visible = false
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
      this.$refs['demoTable'].clearSelection()
      this.$refs['demoTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.demoPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.demoPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['demoForm'].resetFields()
      this.demoQuery.dataRange = ''
      this.demoPageProps.record = null
      this.demoPageProps.total = 0
      this.demoPageProps.pageSize = 10
      this.demoPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['demoTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['demoTable'].clearSelection()
      this.$refs['demoTable'].toggleRowSelection(row)
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
      this.resetDemoDialog()
      this.demoDialog.visible = true
      this.demoDialog.data = Object.assign({}, row)
      this.demoDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.demoDialog.visible = true
      this.demoDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetDemoDialog()
      this.demoDialog.data.locked = 0
      this.demoDialog.visible = true
      this.demoDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.demoDialog.state = 'update'
    },
    // 重置信息页面
    resetDemoDialog() {
      this.$nextTick(() => {
        if (this.$refs['demoDataForm']) {
          this.$refs['demoDataForm'].clearValidate()
        }
      })
      this.demoDialog.data = {
        id: undefined,
        name: null,
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

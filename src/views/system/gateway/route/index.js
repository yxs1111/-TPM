import requestApi from '@/api/request-api'
import gatewayRouteApi from '@/api/system/gateway-route-api'
import { getPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = gatewayRouteApi.url

export default {
  name: 'GatewayRoute',
  directives: { elDragDialog, permission },
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
        routeId: [{ required: true, message: '路由ID不能为空', trigger: 'blur' }],
        uri: [{ required: true, message: 'URI不能为空', trigger: 'blur' }],
        predicates: [{ required: true, message: '判定器不能为空', trigger: 'blur' }],
        filters: [{ required: true, message: '过滤器不能为空', trigger: 'blur' }],
        routeOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      gatewayRouteDialog: {
        state: '',
        visible: false,
        data: {
          routeId: '',
          uri: '',
          predicates: '',
          filters: '',
          description: '',
          id: undefined
        },
        formLabelWidth: '120px'
      },
      gatewayRouteQuery: {
        uri: '',
        predicates: '',
        description: ''
      },
      gatewayRoutePageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getPickerOptions(),
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
      if (this.gatewayRouteQuery.dataRange && this.gatewayRouteQuery.dataRange !== '') {
        this.gatewayRouteQuery.startDate = this.gatewayRouteQuery.dataRange[0]
        this.gatewayRouteQuery.endDate = this.gatewayRouteQuery.dataRange[1]
      } else {
        this.gatewayRouteQuery.startDate = ''
        this.gatewayRouteQuery.endDate = ''
      }
      requestApi.getPage(url, {
        description: this.gatewayRouteQuery.description, uri: this.gatewayRouteQuery.uri, predicates: this.gatewayRouteQuery.predicates,
        startDate: this.gatewayRouteQuery.startDate, endDate: this.gatewayRouteQuery.endDate }).then(response => {
        const { data } = response
        this.gatewayRoutePageProps.records = data.records
        this.gatewayRoutePageProps.total = data.total
        this.gatewayRoutePageProps.pageNum = data.pageNum
        this.gatewayRoutePageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['gatewayRouteDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.gatewayRouteDialog.data)
          if (this.gatewayRouteDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.gatewayRouteDialog.visible = false
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
                if (this.gatewayRouteDialog.data.version) {
                  this.gatewayRouteDialog.data.version++
                }
                const index = this.gatewayRoutePageProps.records.findIndex(v => v.id === this.gatewayRouteDialog.data.id)
                this.gatewayRoutePageProps.records.splice(index, 1, this.gatewayRouteDialog.data)
                this.gatewayRouteDialog.visible = false
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
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.gatewayRoutePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.gatewayRoutePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['gatewayRouteForm'].resetFields()
      this.gatewayRoutePageProps.records = null
      this.gatewayRoutePageProps.total = 0
      this.gatewayRoutePageProps.pageSize = 10
      this.gatewayRoutePageProps.pageNum = 1
      this.gatewayRouteQuery.description = ''
      this.gatewayRouteQuery.uri = ''
      this.gatewayRouteQuery.predicates = ''
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['gatewayRouteTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['gatewayRouteTable'].clearSelection()
      this.$refs['gatewayRouteTable'].toggleRowSelection(row)
      this.getRowData(row)
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 格式化时间
    parseJson(time, cFormat) {
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
      this.resetGatewayRouteDialog()
      this.gatewayRouteDialog.visible = true
      this.gatewayRouteDialog.data = Object.assign({}, row)
      this.gatewayRouteDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetGatewayRouteDialog()
      this.gatewayRouteDialog.visible = true
      this.gatewayRouteDialog.data = row
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetGatewayRouteDialog()
      this.gatewayRouteDialog.data.routeOrder = 0
      this.gatewayRouteDialog.data.createBy = ''
      this.gatewayRouteDialog.data.deletedFlag = '0'
      this.gatewayRouteDialog.data.createDate = new Date()
      this.gatewayRouteDialog.data.version = 1
      this.gatewayRouteDialog.data.gender = 0
      this.gatewayRouteDialog.data.locked = 0
      this.gatewayRouteDialog.visible = true
      this.gatewayRouteDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.gatewayRouteDialog.state = 'update'
    },
    // 重置信息页面
    resetGatewayRouteDialog() {
      this.$nextTick(() => {
        if (this.$refs['gatewayRouteDataForm']) {
          this.$refs['gatewayRouteDataForm'].clearValidate()
        }
      })
      this.gatewayRouteDialog.data = {
        routeId: '',
        uri: 'lb://应用名',
        predicates: '[{"name":"Path","args":{"pattern":"/路径/**"}}]',
        filters: '[{"name":"StripPrefix","args":{"parts":"1"}}]',
        description: '某某服务',
        id: undefined
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

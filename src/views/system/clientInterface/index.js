import requestApi from '@/api/request-api'
import clientInterfaceApi from '@/api/system/client-interface-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = clientInterfaceApi.url

export default {
  name: 'AuthClientInterface',
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
    // 接口类型文字
    interfaceTypeWordFilter(type) {
      const interfaceTypeMap = {
        '0': '通用接口',
        '1': '授权接口'
      }
      return interfaceTypeMap[type]
    },
    // 资源名称文字
    resourceNameWordFilter(resourceId, resourceServerArray) {
      // console.log(resourceId, resourceServerArray)
      // eslint-disable-next-line no-return-assign,no-unused-vars
      const resource = resourceServerArray.filter(re => { return String(re.id) === String(resourceId) })[0]
      // console.log(resource)
      return resource ? (resource.clientName + '(' + resource.clientId + ')') : resourceId
    }
  },
  data() {
    return {
      searchLoading: false,
      saveLoading: false,
      editDisabled: true,
      multipleSelection: [],
      interfaceTypeMap: {
        '0': '通用接口',
        '1': '授权接口'
      },
      clientSelection: [],
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
      authClientInterfaceDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          resourceId: null,
          interfaceName: null,
          interfacePath: null,
          interfaceDesc: null,
          interfaceType: null
        },
        formLabelWidth: '120px'
      },
      authClientInterfaceQuery: {
        resourceId: null,
        interfaceName: null,
        interfacePath: null,
        interfaceDesc: null,
        interfaceType: null,
        dataRange: ''
      },
      authClientInterfacePageProps: {
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
    this.listAllClient()
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
      if (this.authClientInterfaceQuery.dataRange && this.authClientInterfaceQuery.dataRange !== '') {
        this.authClientInterfaceQuery.startDate = this.authClientInterfaceQuery.dataRange[0]
        this.authClientInterfaceQuery.endDate = this.authClientInterfaceQuery.dataRange[1]
      } else {
        this.authClientInterfaceQuery.startDate = ''
        this.authClientInterfaceQuery.endDate = ''
      }
      requestApi.getPage(url, {
        startDate: this.authClientInterfaceQuery.startDate,
        endDate: this.authClientInterfaceQuery.endDate,
        pageSize: this.authClientInterfacePageProps.pageSize,
        pageNum: this.authClientInterfacePageProps.pageNum,
        resourceId: this.authClientInterfaceQuery.resourceId,
        interfaceName: this.authClientInterfaceQuery.interfaceName,
        interfacePath: this.authClientInterfaceQuery.interfacePath,
        interfaceDesc: this.authClientInterfaceQuery.interfaceDesc,
        interfaceType: this.authClientInterfaceQuery.interfaceType
      }).then(response => {
        const { data } = response
        this.authClientInterfacePageProps.record = data.records
        this.authClientInterfacePageProps.total = data.total
        this.authClientInterfacePageProps.pageNum = data.pageNum
        this.authClientInterfacePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['authClientInterfaceDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.authClientInterfaceDialog.data)
          if (this.authClientInterfaceDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.authClientInterfaceDialog.visible = false
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
                if (this.authClientInterfaceDialog.data.version) {
                  this.authClientInterfaceDialog.data.version++
                }
                const index = this.authClientInterfacePageProps.record.findIndex(v => v.id === this.authClientInterfaceDialog.data.id)
                this.authClientInterfacePageProps.record.splice(index, 1, this.authClientInterfaceDialog.data)
                this.authClientInterfaceDialog.visible = false
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
      this.$refs['authClientInterfaceTable'].clearSelection()
      this.$refs['authClientInterfaceTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.authClientInterfacePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.authClientInterfacePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['authClientInterfaceForm'].resetFields()
      this.authClientInterfaceQuery.dataRange = ''
      this.authClientInterfacePageProps.record = null
      this.authClientInterfacePageProps.total = 0
      this.authClientInterfacePageProps.pageSize = 10
      this.authClientInterfacePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['authClientInterfaceTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['authClientInterfaceTable'].clearSelection()
      this.$refs['authClientInterfaceTable'].toggleRowSelection(row)
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
      this.resetAuthClientInterfaceDialog()
      this.authClientInterfaceDialog.visible = true
      const resource = this.clientSelection.filter(re => {
        return String(re.id) === String(row.resourceId)
      })[0]
      const interfaceTypeName = this.interfaceTypeMap[row.interfaceType]
      const resourceName = resource ? (resource.clientName + '(' + resource.clientId + ')') : row.resourceId
      this.authClientInterfaceDialog.data = Object.assign({}, row, {
        interfaceTypeName: interfaceTypeName,
        resourceName: resourceName
      })
      this.authClientInterfaceDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.authClientInterfaceDialog.visible = true
      const resource = this.clientSelection.filter(re => {
        return String(re.id) === String(row.resourceId)
      })[0]
      const interfaceTypeName = this.interfaceTypeMap[row.interfaceType]
      const resourceName = resource ? (resource.clientName + '(' + resource.clientId + ')') : row.resourceId
      this.authClientInterfaceDialog.data = Object.assign({}, row, {
        interfaceTypeName: interfaceTypeName,
        resourceName: resourceName,
        resourceId: String(row.resourceId),
        interfaceType: String(row.interfaceType)
      })
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetAuthClientInterfaceDialog()
      this.authClientInterfaceDialog.data.locked = 0
      this.authClientInterfaceDialog.visible = true
      this.authClientInterfaceDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.authClientInterfaceDialog.state = 'update'
    },
    // 重置信息页面
    resetAuthClientInterfaceDialog() {
      this.$nextTick(() => {
        if (this.$refs['authClientInterfaceDataForm']) {
          this.$refs['authClientInterfaceDataForm'].clearValidate()
        }
      })
      this.authClientInterfaceDialog.data = {
        id: undefined,
        resourceId: null,
        interfaceName: null,
        interfacePath: null,
        interfaceDesc: null,
        interfaceType: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 列出所有的客户端
    async listAllClient() {
      clientInterfaceApi.listAllClient().then(res => {
        if (res.data.length > 0) {
          this.clientSelection = res.data
        } else {
          this.clientSelection = []
        }
      }).catch(error => console.log(error))
    }
  }
}

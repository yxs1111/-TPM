import requestApi from '@/api/request-api'
import openInterfaceApi from '@/api/system/open-interface-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = openInterfaceApi.url

export default {
  name: 'OpenInterface',
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
      return resource ? (resource.description + '(' + resource.routeId + ')') : resourceId
    }
  },
  data() {
    return {
      searchLoading: false,
      saveLoading: false,
      editDisabled: true,
      multipleSelection: [],
      clientSelection: [],
      resourceServerSelection: [],
      stateMap: {
        1: '1',
        0: '0'
      },
      interfaceTypeMap: {
        '0': '通用接口',
        '1': '授权接口'
      },
      textMap: getTextMap(),
      rules: {
        resourceId: [{ required: true, message: '所属服务', trigger: 'blur' }],
        interfaceName: [{ required: true, message: '接口名', trigger: 'blur' }],
        interfacePath: [{ required: true, message: '接口地址', trigger: 'blur' }],
        interfaceDesc: [{ required: true, message: '接口说明', trigger: 'blur' }],
        interfaceType: [{ required: true, message: '接口类型', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      openInterfaceDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          resourceId: null,
          resourceName: null,
          interfaceName: null,
          interfaceTypeName: null,
          interfacePath: null,
          interfaceDesc: null,
          interfaceType: null
        },
        formLabelWidth: '120px'
      },
      openInterfaceQuery: {
        resourceId: null,
        interfaceName: null,
        interfacePath: null,
        interfaceDesc: null,
        interfaceType: null,
        dataRange: ''
      },
      openInterfacePageProps: {
        record: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions(),
      openInterfaceClientDialog: {
        visible: false
      },
      transferClientProps: {
        data: [],
        value: [],
        interfaceId: ''
      }
    }
  },
  created() {
    this.fetchData()
    this.listAllResourceServer()
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
      if (this.openInterfaceQuery.dataRange && this.openInterfaceQuery.dataRange !== '') {
        this.openInterfaceQuery.startDate = this.openInterfaceQuery.dataRange[0]
        this.openInterfaceQuery.endDate = this.openInterfaceQuery.dataRange[1]
      } else {
        this.openInterfaceQuery.startDate = ''
        this.openInterfaceQuery.endDate = ''
      }
      requestApi.getPage(url, {
        resourceId: this.openInterfaceQuery.resourceId,
        interfaceName: this.openInterfaceQuery.interfaceName,
        interfacePath: this.openInterfaceQuery.interfacePath,
        interfaceDesc: this.openInterfaceQuery.interfaceDesc,
        interfaceType: this.openInterfaceQuery.interfaceType,
        startDate: this.openInterfaceQuery.startDate, endDate: this.openInterfaceQuery.endDate,
        pageSize: this.openInterfacePageProps.pageSize, pageNum: this.openInterfacePageProps.pageNum
      }).then(response => {
        const { data } = response
        this.openInterfacePageProps.record = data.records
        this.openInterfacePageProps.total = data.total
        this.openInterfacePageProps.pageNum = data.pageNum
        this.openInterfacePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['openInterfaceDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.openInterfaceDialog.data)
          if (this.openInterfaceDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.openInterfaceDialog.visible = false
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
                if (this.openInterfaceDialog.data.version) {
                  this.openInterfaceDialog.data.version++
                }
                const index = this.openInterfacePageProps.record.findIndex(v => v.id === this.openInterfaceDialog.data.id)
                this.openInterfacePageProps.record.splice(index, 1, this.openInterfaceDialog.data)
                this.openInterfaceDialog.visible = false
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
      this.$refs['openInterfaceTable'].clearSelection()
      this.$refs['openInterfaceTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.openInterfacePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.openInterfacePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['openInterfaceForm'].resetFields()
      this.openInterfaceQuery.dataRange = ''
      this.openInterfacePageProps.record = null
      this.openInterfacePageProps.total = 0
      this.openInterfacePageProps.pageSize = 10
      this.openInterfacePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['openInterfaceTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['openInterfaceTable'].clearSelection()
      this.$refs['openInterfaceTable'].toggleRowSelection(row)
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
      this.resetOpenInterfaceDialog()
      this.openInterfaceDialog.visible = true
      const resource = this.resourceServerSelection.filter(re => {
        return String(re.id) === String(row.resourceId)
      })[0]
      const interfaceTypeName = this.interfaceTypeMap[row.interfaceType]
      const resourceName = resource ? (resource.description + '(' + resource.routeId + ')') : row.resourceId
      this.openInterfaceDialog.data = Object.assign({}, row, {
        interfaceTypeName: interfaceTypeName,
        resourceName: resourceName
      })
      this.openInterfaceDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.openInterfaceDialog.visible = true
      const resource = this.resourceServerSelection.filter(re => {
        return String(re.id) === String(row.resourceId)
      })[0]
      const interfaceTypeName = this.interfaceTypeMap[row.interfaceType]
      const resourceName = resource ? (resource.description + '(' + resource.routeId + ')') : row.resourceId
      this.openInterfaceDialog.data = Object.assign({}, row, {
        interfaceTypeName: interfaceTypeName,
        resourceName: resourceName,
        resourceId: String(row.resourceId),
        interfaceType: String(row.interfaceType)
      })
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetOpenInterfaceDialog()
      this.openInterfaceDialog.data.locked = 0
      this.openInterfaceDialog.visible = true
      this.openInterfaceDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.openInterfaceDialog.state = 'update'
    },
    // 重置信息页面
    resetOpenInterfaceDialog() {
      this.$nextTick(() => {
        if (this.$refs['openInterfaceDataForm']) {
          this.$refs['openInterfaceDataForm'].clearValidate()
        }
      })
      this.openInterfaceDialog.data = {
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
    // 列出所有的服务资源信息（路由）
    async listAllResourceServer() {
      openInterfaceApi.listResourceServer().then(res => {
        if (res.data.length > 0) {
          this.resourceServerSelection = res.data
        } else {
          this.resourceServerSelection = []
          this.openInterfaceQuery.resourceId = ''
        }
      }).catch(error => console.log(error))
    },
    // 列出所有的客户端
    async listAllClient() {
      openInterfaceApi.listAllClient().then(res => {
        if (res.data.length > 0) {
          this.clientSelection = res.data
        } else {
          this.clientSelection = []
        }
      }).catch(error => console.log(error))
    },
    editClientOpenInterface() {
      const that = this
      that.transferClientProps.value = []
      if (that.multipleSelection && that.multipleSelection.length === 1) {
        that.transferClientProps.interfaceId = that.multipleSelection[0].id
        that.openInterfaceClientDialog.visible = true
        openInterfaceApi.getClientPage({ pageSize: 100, pageNum: 1 }).then(res => {
          if (res.data) {
            that.transferClientProps.data = res.data.records
            openInterfaceApi.listBindClient({ interfaceId: that.transferClientProps.interfaceId })
              .then(client => {
                if (client.data) {
                  that.transferClientProps.value = client.data
                }
              })
          }
        }).catch(error => console.log(error))
      }
    },
    saveClientOpenInterface() {
      this.openInterfaceClientDialog.visible = false
      openInterfaceApi.bindClientOpenInterface({ interfaceId: this.transferClientProps.interfaceId, authClientIds: this.transferClientProps.value })
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '绑定成功',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    },
    thirdPartyStatus() {
      openInterfaceApi.thirdPartyStatus({})
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '查询组织信息',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    }
  }
}

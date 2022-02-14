import requestApi from '@/api/request-api'
import permissionApi from '@/api/system/permission-api'
import { getFormatPickerOptions, parseTime, getTextMap, getDefaultPermissions,getHeight } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = permissionApi.url
const sourceKey = process.env.VUE_APP_SOURCE_KEY

export default {
  name: 'Permission',
  directives: { elDragDialog, permission },
  data() {
    return {
      editDisabled: true,
      multipleSelection: [],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: getTextMap(),
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        osCode: [{ required: true, message: '请选择所属系统', trigger: 'change' }],
        menuCode: [{ required: true, message: '请选择所属菜单', trigger: 'change' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      permissionDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          osCode: sourceKey,
          osName: '',
          menuCode: '',
          menuName: '',
          url: '',
          bitDigit: 1,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      permissionQuery: {
        name: '',
        code: '',
        osCode: sourceKey,
        menuCode: '',
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      osSelectOption: [],
      menuSelectOption: [],
      permissionPageProps: {
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
      maxheight: window.innerHeight - 450,
    }
  },
  created() {
    const osCode = this.$route.params.osCode
    const menuCode = this.$route.params.menuCode
    if (osCode && menuCode) {
      this.permissionQuery.osCode = osCode
      this.permissionQuery.menuCode = menuCode
    }
    this.fetchData()
    this.listAllOs()
    this.listAllMenu(osCode)
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = window.innerHeight - 450
      })()
    }
  },
  methods: {
    // 查询方法
    fetchData() {
      if (this.permissionQuery.dataRange && this.permissionQuery.dataRange !== '') {
        this.permissionQuery.startDate = this.permissionQuery.dataRange[0]
        this.permissionQuery.endDate = this.permissionQuery.dataRange[1]
      } else {
        this.permissionQuery.startDate = ''
        this.permissionQuery.endDate = ''
      }
      requestApi.getPage(url, { name: this.permissionQuery.name, code: this.permissionQuery.code, osCode: this.permissionQuery.osCode,
        menuCode: this.permissionQuery.menuCode, startDate: this.permissionQuery.startDate, endDate: this.permissionQuery.endDate,
        pageSize: this.permissionPageProps.pageSize, pageNum: this.permissionPageProps.pageNum }).then(response => {
        const { data } = response
        this.permissionPageProps.records = data.records
        this.permissionPageProps.total = data.total
        this.permissionPageProps.pageNum = data.pageNum
        this.permissionPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['permissionDataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.permissionDialog.data)
          if (this.permissionDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              if (res && res.code === 1000) {
                this.permissionDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
                this.fetchData()
              }
            })
          } else {
            requestApi.update(url, params).then((res) => {
              if (res && res.code === 1000) {
                if (this.permissionDialog.data.version) {
                  this.permissionDialog.data.version++
                }
                const data = this.permissionDialog.data
                const index = this.permissionPageProps.records.findIndex(v => v.id === data.id)
                this.menuSelectOption.map((menu) => {
                  if (menu.code === data.menuCode) {
                    data.menuName = menu.name
                  }
                })
                this.permissionPageProps.records.splice(index, 1, data)
                this.permissionDialog.visible = false
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
        const codes = []
        this.multipleSelection.map(row => {
          codes.push(row.code)
        })
        requestApi.remove(url, codes).then((res) => {
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
      this.$refs['permissionTable'].clearSelection()
      this.$refs['permissionTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.permissionPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.permissionPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['permissionForm'].resetFields()
      this.permissionQuery.osCode = sourceKey
      this.permissionQuery.dataRange = ''
      this.permissionQuery.menuCode = ''
      this.permissionPageProps.records = null
      this.permissionPageProps.total = 0
      this.permissionPageProps.pageSize = 10
      this.permissionPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['permissionTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['permissionTable'].clearSelection()
      this.$refs['permissionTable'].toggleRowSelection(row)
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
      this.resetPermissionDialog()
      this.permissionDialog.visible = true
      this.permissionDialog.data = Object.assign({}, row)
      this.permissionDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetPermissionDialog()
      this.permissionDialog.visible = true
      this.permissionDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetPermissionDialog()
      this.permissionDialog.data.gender = 0
      this.permissionDialog.data.locked = 0
      this.permissionDialog.visible = true
      this.permissionDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.permissionDialog.state = 'update'
    },
    // 重置信息页面
    resetPermissionDialog() {
      this.$nextTick(() => {
        if (this.$refs['permissionDataForm']) {
          this.$refs['permissionDataForm'].clearValidate()
        }
      })
      this.permissionDialog.data = {
        id: undefined,
        name: '',
        code: '',
        osCode: sourceKey,
        osName: '',
        menuCode: '',
        menuName: '',
        url: '',
        bitDigit: null,
        createBy: null,
        createDate: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 列出所有的系统信息
    async listAllOs() {
      permissionApi.listAllOs().then(res => {
        this.osSelectOption = res.data
      }).catch(error => {
        this.osSelectOption = []
        console.log(error)
      })
    },
    // 系统选项变化时
    handleOsChange(osCode) {
      this.listAllMenu(osCode)
    },
    // 列出所有的菜单信息
    async listAllMenu(osCode) {
      const params = {}
      params.osCode = osCode || 'portal'
      permissionApi.listMenuByOsCode(params).then(res => {
        if (res.data.length > 0) {
          this.menuSelectOption = res.data
        } else {
          this.menuSelectOption = []
          this.permissionQuery.menuCode = ''
        }
      }).catch(error => console.log(error))
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  }
}

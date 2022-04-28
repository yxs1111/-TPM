import requestApi from '@/api/request-api'
import osApi from '@/api/system/os-api'
import roleApi from '@/api/system/role-api'
import {
  getFormatPickerOptions,
  getTextMap,
  parseTime,
  getDefaultPermissions
} from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

const url = osApi.url

export default {
  name: 'OsInfo',
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
        name: [{ required: true, message: '系统名称不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      osInfoDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          parentCode: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      osQuery: {
        name: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      osInfoPageProps: {
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
      roleVisible: false, //数据权限绑定弹窗
      RoleTreedata: [], //数据权限
      RoleTreeFilter: '', //数据权限过滤
      Role_KA: {
        children: 'children',
        label: 'label'
      },
      treeProps_Mine: {
        children: 'children',
        label: 'label'
      },
      Role_KAData: {}, //KA 权限数据
      RoleTreeData_Mine: [], //Mine-package tree data
      permissionType: '', //角色数据权限类型
      roleCode: '',
      roleName: '' //角色数据权限--角色名称
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
    //数据权限绑定--弹窗显示
    showRoleDialog(obj) {
      this.roleName = obj.name
      this.permissionType = obj.permissionType
      if (obj.permissionType == 'KA') {
        this.getKAList()
      } else if (obj.permissionType == 'Mine Package') {
        this.getMinePackage()
      } else if (obj.permissionType == 'Field sales') {
        this.getFieldSales()
      } else if (!obj.permissionType) {
        this.getKAList()
        this.getMinePackage()
        this.getFieldSales()
      }
      this.roleCode = obj.code
    },
    //数据权限绑定--确认
    confirmRoleDialog() {
      let list = this.$refs.RoleTree.getCheckedNodes()
      console.log(list)
      let dataList = []
      for (let m = 0; m < list.length; m++) {
        let obj = {
          dataFirCode: list[m].dataFircode,
          dataSecCode: list[m].dataSecCode,
          dataSecId: list[m].dataSecId,
          dataTerCode: list[m].dataTerCode,
          dataTerId: list[m].dataTerId,
        }
        dataList.push(obj)
      }
      roleApi
        .bindDataPermissions({ roleCode: this.roleCode, dataList })
        .then((res) => {
          console.log(res)
          this.$message.success('权限绑定成功')
          this.closeRoleDialog()
        })
    },
    //数据权限绑定--关闭
    closeRoleDialog() {
      this.roleVisible = false
      this.roleCode = ''
      this.RoleTreedata = []
      this.RoleTreeData_Mine = []
      this.permissionType = ''
    },
    //获取默认权限
    getDefaultRolePermissions(roleCode) {
      roleApi.getDefaultRolePermissions({ roleCode }).then((res) => {
        let list = res.data
        for (let i = 0; i < list.length; i++) {
          list[i].label=list[i].dataTerCode
          list[i].id=list[i].dataTerId
          list[i].mid=list[i].dataSecId+'-'+list[i].dataTerCode
          list[i].NodeKey=list[i].dataFirCode+'-'+list[i].dataSecCode+'-'+list[i].dataTerCode
        }
        //分成两个板块
        if (this.permissionType === 'Mine Package'||this.permissionType ===null) {
          this.$refs.RoleTree_Mine.setCheckedNodes([...list])
        } else if(this.permissionType != 'Mine Package') {
          this.$refs.RoleTree.setCheckedNodes([...list])
        }
        this.$forceUpdate()
      })
    },
    //获取KA 权限  NodeKey: "KA-EC-007"
    getKAList() {
      roleApi.getKAList().then((res) => {
        let list = res.data.channelList
        for (let i = 0; i < list.length; i++) {
          list[i]['label'] = list[i].channelCode
          if (list[i].customerList) {
            list[i]['children'] = list[i].customerList
            for (let j = 0; j < list[i].children.length; j++) {
              list[i].children[j]['dataFirCode'] = res.data.ka
              list[i].children[j]['label'] = list[i].children[j].customerCsName
              list[i].children[j]['dataTerId'] = list[i].children[j].id
              list[i].children[j]['dataTerCode'] =
                list[i].children[j].customerCode
              list[i].children[j]['dataSecId'] = list[i].id
              list[i].children[j]['dataSecCode'] = list[i].channelCode
              list[i].children[j]['NodeKey'] = list[i].children[j]['dataFirCode']+'-'+list[i].children[j]['dataSecCode']+'-'+list[i].children[j]['dataTerCode']
            }
          } else {
            list[i]['children'] = []
          }
        }
        var obj = {
          label: 'KA',
          children: [...list],
        }
        this.RoleTreedata.push(obj)
        this.roleVisible = true
        //获取已绑定权限
        this.getDefaultRolePermissions(this.roleCode)
      })
    },
    //获取Mine Package 权限  
    getMinePackage() {
      roleApi.getMinePackage().then((res) => {
        let list = res.data.mdCostTypeDTOList
        for (let i = 0; i < list.length; i++) {
          list[i]['label'] = list[i].costType
          if (list[i].channelList) {
            list[i]['children'] = list[i].channelList
            for (let j = 0; j < list[i].children.length; j++) {
              list[i].children[j]['label'] = list[i].children[j].channelCode
              list[i].children[j]['dataTerId'] = list[i].children[j].id
              list[i].children[j]['dataTerCode'] =
                list[i].children[j].channelCode
              list[i].children[j]['dataSecId'] = list[i].id
              list[i].children[j]['dataSecCode'] = list[i].costTypeNumber
              list[i].children[j]['dataFircode'] = 'MinePackage'
              list[i].children[j]['mid'] =
                list[i].id + '-' + list[i].children[j].channelCode
            }
          } else {
            list[i]['children'] = []
          }
        }
        var obj = {
          label: 'Mine Package',
          children: [...list],
        }
        this.RoleTreeData_Mine = []
        this.RoleTreeData_Mine.push(obj)
        //将tree 分成两个板块 ，minePackage层用  3-NKA作为辨别id（mid），其他正常
        // this.RoleTreedata.push(obj)
        this.roleVisible = true
        //获取已绑定权限
        this.getDefaultRolePermissions(this.roleCode)
      })
    },
    //获取Field sales 权限  NodeKey: "FieldSales-zone-4678"
    getFieldSales() {
      roleApi.getFieldSales().then((res) => {
        let list = res.data.children
        for (let i = 0; i < list.length; i++) {
          list[i]['label'] = list[i].name
          if (list[i].children) {
            for (let j = 0; j < list[i].children.length; j++) {
              list[i].children[j]['label'] = list[i].children[j].name
              list[i].children[j]['dataTerId'] = list[i].children[j].id
              list[i].children[j]['dataTerCode'] = list[i].children[j].code
              list[i].children[j]['dataSecId'] = list[i].id
              list[i].children[j]['dataSecCode'] = list[i].name
              list[i].children[j]['dataFircode'] = 'FieldSales'
              list[i].children[j]['NodeKey'] = 'FieldSales-'+list[i].children[j]['dataSecCode']+'-'+list[i].children[j]['dataTerCode']
            }
          } else {
            list[i]['children'] = []
          }
        }
        var obj = {
          label: 'Field sales',
          children: [...list],
        }
        this.RoleTreedata.push(obj)
        this.roleVisible = true
        //获取已绑定权限
        this.getDefaultRolePermissions(this.roleCode)
      })
    },
    //筛选
    RoleTreeFilterMethod(value, data, node) {
      return this.getHasKeyword(value, node)
    },
    //筛选的时候显示子数据
    getHasKeyword(value, node) {
      if (node.data instanceof Array) {
        node.data = node.data.length > 0 ? node.data[0] : {}
      }
      if (node.data.label && node.data.label.indexOf(value) !== -1) {
        return true
      } else {
        return node.parent && this.getHasKeyword(value, node.parent)
      }
    },
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.osQuery.dataRange && this.osQuery.dataRange !== '') {
        this.osQuery.startDate = this.osQuery.dataRange[0]
        this.osQuery.endDate = this.osQuery.dataRange[1]
      } else {
        this.osQuery.startDate = ''
        this.osQuery.endDate = ''
      }
      requestApi
        .getPage(url, {
          name: this.osQuery.name,
          locked: this.osQuery.locked,
          startDate: this.osQuery.startDate,
          endDate: this.osQuery.endDate,
          pageSize: this.osInfoPageProps.pageSize,
          pageNum: this.osInfoPageProps.pageNum
        })
        .then(response => {
          const { data } = response
          this.osInfoPageProps.records = data.records
          this.osInfoPageProps.total = data.total
          this.osInfoPageProps.pageNum = data.pageNum
          this.osInfoPageProps.pageSize = data.pageSize
          this.searchLoading = false
        })
        .catch(error => {
          this.searchLoading = false
          console.log(error)
        })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['osDataForm'].validate(valid => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.osInfoDialog.data)
          if (this.osInfoDialog.state === 'create') {
            requestApi.save(url, params).then(res => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.osInfoDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
                this.fetchData()
              }
            })
          } else {
            requestApi.update(url, params).then(res => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                if (this.osInfoDialog.data.version) {
                  this.osInfoDialog.data.version++
                }
                const index = this.osInfoPageProps.records.findIndex(
                  v => v.id === this.osInfoDialog.data.id
                )
                this.osInfoPageProps.records.splice(
                  index,
                  1,
                  this.osInfoDialog.data
                )
                this.osInfoDialog.visible = false
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
        requestApi.remove(url, codes).then(res => {
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
      this.$refs['osInfoTable'].clearSelection()
      this.$refs['osInfoTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.osInfoPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.osInfoPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['osInfoForm'].resetFields()
      this.osQuery.dataRange = ''
      this.osInfoPageProps.records = null
      this.osInfoPageProps.total = 0
      this.osInfoPageProps.pageSize = 10
      this.osInfoPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['osInfoTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['osInfoTable'].clearSelection()
      this.$refs['osInfoTable'].toggleRowSelection(row)
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
      this.resetOsInfoDialog()
      this.osInfoDialog.visible = true
      this.osInfoDialog.data = Object.assign({}, row)
      this.osInfoDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetOsInfoDialog()
      this.osInfoDialog.visible = true
      this.osInfoDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetOsInfoDialog()
      this.osInfoDialog.data.gender = 0
      this.osInfoDialog.data.locked = 0
      this.osInfoDialog.visible = true
      this.osInfoDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.osInfoDialog.state = 'update'
    },
    // 重置信息页面
    resetOsInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs['osDataForm']) {
          this.$refs['osDataForm'].clearValidate()
        }
      })
      this.osInfoDialog.data = {
        id: undefined,
        name: '',
        parentCode: '',
        code: '',
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

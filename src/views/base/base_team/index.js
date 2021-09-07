import requestApi from '@/api/request-api'
import baseTeamApi from '@/api/base/base-team-api'
import organizationApi from '@/api/system/organization-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { mapActions } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import groupApi from '@/api/system/group-api'

const url = baseTeamApi.url
const teamTypeMap = []
const orgMap = []

export default {
  name: 'BaseTeam',
  components: {
    Treeselect
  },
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
    // 班组类型
    teamTypeFilter(teamType) {
      return teamTypeMap[teamType]
    },
    // 所属组织
    orgFilter(orgId) {
      return orgMap[orgId]
    },
    // 是否有效
    isFlagFilter(isFlag) {
      const isFlagMap = {
        '0': '是',
        '1': '否'
      }
      return isFlagMap[isFlag]
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
        teamName: [{ required: true, message: '班组名称不能为空', trigger: 'blur' }],
        teamType: [{ required: true, message: '班组类型不能为空', trigger: 'blur' }],
        organizationId: [{ required: true, message: '关联组织不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      allOrg: [],
      isFlag: [
        { value: '0', label: '是' },
        { value: '1', label: '否' }
      ],
      baseTeamDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          teamCode: null,
          teamName: null,
          teamType: null,
          teamShiftId: null,
          organizationId: null,
          remark: null,
          isFlag: null
        },
        formLabelWidth: '120px'
      },
      baseTeamQuery: {
        id: null,
        teamCode: null,
        teamName: null,
        teamType: null,
        teamShiftId: null,
        organizationId: null,
        remark: null,
        isFlag: null,
        dataRange: ''
      },
      baseTeamPageProps: {
        record: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      teamMemberDialog: {
        visible: false
      },
      transferUserProps: {
        data: [],
        value: [],
        teamId: ''
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      permissions: getDefaultPermissions()
    }
  },
  created() {
    this.getDictInfoByType('teamType').then(({ teamType }) => {
      this.teamType = teamType
      for (let i = 0, len = teamType.length; i < len; i++) {
        const row = teamType[i]
        teamTypeMap[row.code] = row.name
      }
    })
    this.fetchData()
    this.getAllOrgToTree()
    this.getAllOrg()
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  methods: {
    ...mapActions(['getDictInfoByType']),
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.baseTeamQuery.dataRange && this.baseTeamQuery.dataRange !== '') {
        this.baseTeamQuery.startDate = this.baseTeamQuery.dataRange[0]
        this.baseTeamQuery.endDate = this.baseTeamQuery.dataRange[1]
      } else {
        this.baseTeamQuery.startDate = ''
        this.baseTeamQuery.endDate = ''
      }
      requestApi.getPage(url, { startDate: this.baseTeamQuery.startDate, endDate: this.baseTeamQuery.endDate,
        pageSize: this.baseTeamPageProps.pageSize, pageNum: this.baseTeamPageProps.pageNum }).then(response => {
        const { data } = response
        this.baseTeamPageProps.record = data.records
        this.baseTeamPageProps.total = data.total
        this.baseTeamPageProps.pageNum = data.pageNum
        this.baseTeamPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['baseTeamDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.baseTeamDialog.data)
          if (this.baseTeamDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.baseTeamDialog.visible = false
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
                if (this.baseTeamDialog.data.version) {
                  this.baseTeamDialog.data.version++
                }
                const index = this.baseTeamPageProps.record.findIndex(v => v.id === this.baseTeamDialog.data.id)
                this.baseTeamPageProps.record.splice(index, 1, this.baseTeamDialog.data)
                this.baseTeamDialog.visible = false
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
      this.$refs['baseTeamTable'].clearSelection()
      this.$refs['baseTeamTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.baseTeamPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.baseTeamPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['baseTeamForm'].resetFields()
      this.baseTeamQuery.dataRange = ''
      this.baseTeamPageProps.record = null
      this.baseTeamPageProps.total = 0
      this.baseTeamPageProps.pageSize = 10
      this.baseTeamPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['baseTeamTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['baseTeamTable'].clearSelection()
      this.$refs['baseTeamTable'].toggleRowSelection(row)
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
      this.resetBaseTeamDialog()
      this.baseTeamDialog.visible = true
      this.baseTeamDialog.data = Object.assign({}, row)
      this.baseTeamDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.baseTeamDialog.visible = true
      this.baseTeamDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetBaseTeamDialog()
      this.baseTeamDialog.data.locked = 0
      this.baseTeamDialog.visible = true
      this.baseTeamDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.baseTeamDialog.state = 'update'
    },
    // 重置信息页面
    resetBaseTeamDialog() {
      this.$nextTick(() => {
        if (this.$refs['baseTeamDataForm']) {
          this.$refs['baseTeamDataForm'].clearValidate()
        }
      })
      this.baseTeamDialog.data = {
        id: undefined,
        teamCode: null,
        teamName: null,
        teamType: null,
        teamShiftId: null,
        organizationId: null,
        remark: null,
        isFlag: null
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 获取所有组织(树形)
    getAllOrgToTree() {
      organizationApi.getAll().then(response => {
        if (response.data) {
          this.allOrg.push(response.data)
        }
      })
    },
    // 获取所有组织
    getAllOrg() {
      organizationApi.listAll().then(response => {
        if (response.data) {
          for (let i = 0, len = response.data.length; i < len; i++) {
            const row = response.data[i]
            orgMap[row.id] = row.name
          }
        }
      })
    },
    // 值发生变更
    onInputChange(node) {
      this.$nextTick(() => { this.$refs['userDataForm'].validateField('orgId') })
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
    // 管理班组成员
    editTeamUser() {
      this.transferUserProps.teamId = this.multipleSelection[0].id
      this.teamMemberDialog.visible = true
      groupApi.getUserPage({ pageSize: 100, pageNum: 1 }).then(res => {
        if (res.data) {
          this.transferUserProps.data = res.data.records
          baseTeamApi.listBindTeamUsers({ teamId: this.transferUserProps.teamId })
            .then(member => {
              if (member.data) {
                this.transferUserProps.value = member.data
              }
            })
        }
      }).catch(error => console.log(error))
    },
    // 保存组成员
    saveTeamUsers() {
      this.teamMemberDialog.visible = false
      baseTeamApi.bindTeamUsers({ teamId: this.transferUserProps.teamId, userIds: this.transferUserProps.value })
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '绑定成功',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    }
  }
}

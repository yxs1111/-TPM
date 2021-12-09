import requestApi from '@/api/request-api'
import userApi from '@/api/system/user-api'
import authTenantApi from '@/api/system/auth-tenant-api'
import organizationApi from '@/api/system/organization-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message, MessageBox } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { isMobile } from '@/utils/validate'
import GanttElastic from 'gantt-elastic'
import GanttHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'

function getDate(hours) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime()
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
}

var tasks = [

]
const options = {
  taskMapping: {
    progress: 'percent'
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: 'Your project title as html (link or whatever...)',
    html: false
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: false
    }
  },
  chart: {
    progress: {
      bar: false
    },
    expander: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: false
    },
    columns: [
      {
        id: 1,
        label: 'ID',
        value: 'id',
        width: 40
      },
      {
        id: 2,
        label: 'Name',
        value: 'label',
        width: 200,
        expander: true,
        html: true,
        events: {
          click({ data, column }) {
            alert('description clicked!\n' + data.label)
          }
        }
      },
      {
        id: 3,
        label: 'Start',
        value: task => dayjs(task.start).format('YYYY-MM-DD'),
        width: 78
      },
      {
        id: 4,
        label: 'Type',
        value: 'type',
        width: 68
      },
      {
        id: 5,
        label: '%',
        value: 'progress',
        width: 35,
        style: {
          'task-list-header-label': {
            'text-align': 'center',
            width: '100%'
          },
          'task-list-item-value-container': {
            'text-align': 'center',
            width: '100%'
          }
        }
      }
    ]
  },
  locale: {
    name: 'zh', // name String
    weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysShort: '日_一_二_三_四_五_六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    ordinal: n => `${n}`, // ordinal Function (number) => return number + output
    relativeTime: { // relative time format strings, keep %s %d as the same
      future: 'za %s', // e.g. in 2 hours, %s been replaced with 2hours
      past: '%s temu',
      s: 'kilka sekund',
      m: 'minutę',
      mm: '%d minut',
      h: 'godzinę',
      hh: '%d godzin', // e.g. 2 hours, %d been replaced with 2
      d: 'dzień',
      dd: '%d dni',
      M: 'miesiąc',
      MM: '%d miesięcy',
      y: 'rok',
      yy: '%d lat'
    }
  }
}

const url = userApi.url

export default {
  name: 'UserInfo',
  components: {
    Treeselect,
    GanttElastic,
    GanttHeader
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
    // 过期状态样式
    expireStatusFilter(expireAt) {
      const now = new Date()
      const expire = new Date(Date.parse(expireAt))
      const result = expire < now ? '1' : '0'
      const statusMap = {
        '0': 'success',
        '1': 'danger'
      }
      return statusMap[result]
    },
    // 过期状态文字
    expireWordFilter(expireAt) {
      const now = new Date()
      const expire = new Date(Date.parse(expireAt))
      const result = expire < now ? '1' : '0'
      const lockedMap = {
        '0': '未过期',
        '1': '已过期'
      }
      return lockedMap[result]
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value || !isMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      tasks,
      options: options,
      dynamicStyle: {},
      editDisabled: true,
      multipleSelection: [],
      textMap: getTextMap(),
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        loginName: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        orgId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      userInfoDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          loginName: '',
          phone: '',
          orgId: null,
          gender: 0,
          locked: 0,
          expireAt: null,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      userQuery: {
        name: '',
        locked: null,
        expireState: null,
        dataRange: '',
        startDate: '',
        endDate: '',
        tenantId: null
      },
      userPageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      joinOrgDialog: {
        visible: false
      },
      filterText: '',
      allOrg: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentNodeKey: '',
      currentNodeId: '',
      permissions: getDefaultPermissions(),
      userRoleDialog: {
        visible: false
      },
      transferRoleProps: {
        data: [],
        value: [],
        userId: ''
      },
      // 租户列表
      authTenantList: [],
      user_org_map: {}
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
      if (this.userQuery.dataRange && this.userQuery.dataRange !== '') {
        this.userQuery.startDate = this.userQuery.dataRange[0]
        this.userQuery.endDate = this.userQuery.dataRange[1]
      } else {
        this.userQuery.startDate = ''
        this.userQuery.endDate = ''
      }
      requestApi.getPage(url, { name: this.userQuery.name, locked: this.userQuery.locked,
        expireState: this.userQuery.expireState, startDate: this.userQuery.startDate, endDate: this.userQuery.endDate, tenantId: this.userQuery.tenantId,
        pageSize: this.userPageProps.pageSize, pageNum: this.userPageProps.pageNum }).then(response => {
        const { data } = response
        this.userPageProps.records = data.records
        this.userPageProps.total = data.total
        this.userPageProps.pageNum = data.pageNum
        this.userPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['userDataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.userInfoDialog.data)
          if (this.userInfoDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              if (res && res.code === 1000) {
                this.userInfoDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
                this.fetchData()
              }
            }).catch(() => {  })
          } else {
            requestApi.update(url, params).then((res) => {
              if (res && res.code === 1000) {
                this.$delete(this.user_org_map, this.userInfoDialog.data.id)
                if (this.userInfoDialog.data.version) {
                  this.userInfoDialog.data.version++
                }
                const index = this.userPageProps.records.findIndex(v => v.id === this.userInfoDialog.data.id)
                this.userPageProps.records.splice(index, 1, this.userInfoDialog.data)
                this.userInfoDialog.visible = false
                Message.success({
                  message: '更新成功',
                  duration: 5 * 1000
                })
              }
            }).catch(() => {  })
          }
        }
      })
    },
    // 显示删除确认框
    showDeleteDialog() {
      this.centerDialogVisible = true
    },
    // 批量删除
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
      this.$refs['userInfoTable'].clearSelection()
      this.$refs['userInfoTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.userPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.userPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['userInfoForm'].resetFields()
      this.userQuery.dataRange = ''
      this.userPageProps.records = null
      this.userPageProps.total = 0
      this.userPageProps.pageSize = 10
      this.userPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && column.label !== '用户名' && column.label !== '登录名') {
        this.$refs['userInfoTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '用户名' && column.label !== '登录名') {
        this.$refs['userInfoTable'].clearSelection()
        this.$refs['userInfoTable'].toggleRowSelection(row)
        this.getRowData(row)
      }
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
      this.resetUserInfoDialog()
      this.userInfoDialog.visible = true
      this.userInfoDialog.data = Object.assign({}, row)
      this.getOrgByUser(this.userInfoDialog.data.id)
      this.userInfoDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetUserInfoDialog()
      this.userInfoDialog.visible = true
      this.userInfoDialog.data = Object.assign({}, row)
      this.getOrgByUser(this.userInfoDialog.data.id)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetUserInfoDialog()
      this.userInfoDialog.data.gender = 0
      this.userInfoDialog.data.locked = 0
      this.userInfoDialog.visible = true
      this.userInfoDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.userInfoDialog.state = 'update'
    },
    // 重置信息页面
    resetUserInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs['userDataForm']) {
          this.$refs['userDataForm'].clearValidate()
        }
      })
      this.userInfoDialog.data = {
        id: undefined,
        name: '',
        loginName: '',
        code: '',
        phone: '',
        orgId: null,
        gender: 0,
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
    },
    // 获取所有组织
    getAllOrg() {
      organizationApi.getAll().then(response => {
        if (response.data) {
          this.allOrg.push(response.data)
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
      this.$nextTick(() => { this.$refs['userDataForm'].validateField('orgId') })
    },
    getOrgByUser(userId) {
      let orgId = this.user_org_map[userId]
      if (orgId) {
        this.userInfoDialog.data.orgId = orgId
      } else {
        userApi.getUserOrg({ userId: userId }).then(res => {
          if (res && res.code === 1000) {
            if (res.data && res.data.length > 0) {
              orgId = res.data[0]
              this.$set(this.userInfoDialog.data, 'orgId', orgId)
              this.$set(this.user_org_map, userId, orgId)
            }
          }
        })
      }
    },
    // 角色
    editUserRole() {
      if (this.multipleSelection && this.multipleSelection.length === 1) {
        this.transferRoleProps.userId = this.multipleSelection[0].id
        this.userRoleDialog.visible = true
        userApi.getRolePage({ pageSize: 100, pageNum: 1 }).then(res => {
          if (res.data) {
            this.transferRoleProps.data = res.data.records
            userApi.listBindRoles({ userId: this.transferRoleProps.userId })
              .then(role => {
                if (role.data) {
                  this.transferRoleProps.value = role.data
                }
              })
          }
        }).catch(error => console.log(error))
      }
    },
    // 保存用户角色
    saveRoles() {
      this.userRoleDialog.visible = false
      userApi.bindRole({ userId: this.transferRoleProps.userId, roleCodes: this.transferRoleProps.value })
        .then(res => {
          if (res && res.code === 1000) {
            Message.success({
              message: '绑定成功',
              duration: 5 * 1000
            })
          }
        }).catch(error => { console.log(error) })
    },
    getAllTenant() {
      authTenantApi.getAllTenant().then(res => {
        if (res && res.code === 1000) {
          this.authTenantList = res.data
        }
      }).catch(error => { console.log(error) })
    },
    // 重置密码
    resetPw(row) {
      this.$refs['userInfoTable'].clearSelection()
      this.$refs['userInfoTable'].toggleRowSelection(row)
      const id = row.id
      MessageBox.confirm('确定要重置密码?', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.request_post(userApi.url + '/resetPassword', { id: id }).then((res) => {
          if (res && res.code === 1000) {
            Message.success({
              message: '重置成功',
              duration: 5 * 1000
            })
          }
        })
      })
    },
    addTask() {
      this.tasks.push({
        id: this.lastId++,
        label:
          '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Yeaahh! you have added a task bro!</a>',
        user:
          '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Awesome!</a>',
        start: getDate(24 * 3),
        duration: 1 * 24 * 60 * 60 * 1000,
        percent: 50,
        type: 'project'
      })
    },
    tasksUpdate(tasks) {
      this.tasks = tasks
    },
    optionsUpdate(options) {
      this.options = options
    },
    styleUpdate(style) {
      this.dynamicStyle = style
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


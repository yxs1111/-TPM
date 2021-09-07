import requestApi from '@/api/request-api'
import pConTrackApi from '@/api/pConTrack/p-con-track-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
const url = pConTrackApi.url

export default {
  name: 'PConTrack',
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
      thirdRailFlagOptions:[{key: '0', value: '无'}, {key: '1', value: '有'}],
      parentFactoryOptions:[],
      isFlagOptions:[{value: '0', label: '是'}, {value: '1', label: '否'}],
      isDeconOptions:[{value: '1', text: '是'}, {value: '0', text: '否'}],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: getTextMap(),
      rules: {
        trackCode: [{ required: true, message: '股道编码不能为空', trigger: 'blur' }],
        trackName: [{ required: true, message: '股道名称不能为空', trigger: 'blur' }],
        thirdRailFlag: [{ required: true, message: '轨道带电不能为空', trigger: 'blur' }],
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      pConTrackDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          trackCode: null,
          trackName: null,
          trackType: null,
          deptId: null,
          columnPosition: null,
          isDecon: null,
          parentId: null,
          thirdRailFlag: null,
          sort: null,
          remark: null,
          reserved1: null,
          reserved2: null,
          dataCode: null,
          factoryId: null,
          isFlag: null,
          delFlag: null,
          parentFactory: null,
        },
        formLabelWidth: '120px'
      },
      pConTrackQuery: {
        trackCode: null,
        trackName: null,
        trackType: null,
        deptId: null,
        columnPosition: null,
        isDecon: null,
        parentId: null,
        thirdRailFlag: null,
        sort: null,
        remark: null,
        reserved1: null,
        reserved2: null,
        dataCode: null,
        factoryId: null,
        isFlag: null,
        delFlag: null,
        parentFactory: null,
        dataRange: ''
      },
      pConTrackPageProps: {
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
    this.fetchData();
  },
  watch: {
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  methods: {
    formatter(row, column) {
      if(row.thirdRailFlag === '1'){
        return '有';
      }else if(row.thirdRailFlag === '0'){
        return '无'
      }else{
        return ''
      }
    // :filters="[{ text: '否', value: '0' }, { text: '是', value: '1' }]"
    },
    formatter2(row, column){
      if(row.isDecon === '1'){
        return '是';
      }else if(row.isDecon === '0'){
        return '否'
      }else{
        return ''
      }
    },
    formatter3(row, column){
      if(row.isFlag === '1'){
        return '否';
      }else if(row.isFlag === '0'){
        return '是'
      }else{
        return ''
      }
    },
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.pConTrackQuery.dataRange && this.pConTrackQuery.dataRange !== '') {
        this.pConTrackQuery.startDate = this.pConTrackQuery.dataRange[0]
        this.pConTrackQuery.endDate = this.pConTrackQuery.dataRange[1]
      } else {
        this.pConTrackQuery.startDate = ''
        this.pConTrackQuery.endDate = ''
      }
      requestApi.getPage(url, {
        startDate: this.pConTrackQuery.startDate,
        endDate: this.pConTrackQuery.endDate,
        isFlag: this.pConTrackQuery.isFlag,
        thirdRailFlag: this.pConTrackQuery.thirdRailFlag,
        trackName: this.pConTrackQuery.trackName,
        pageSize: this.pConTrackPageProps.pageSize,
        pageNum: this.pConTrackPageProps.pageNum }).then(response => {
        const { data } = response
        this.pConTrackPageProps.record = data.records
        this.pConTrackPageProps.total = data.total
        this.pConTrackPageProps.pageNum = data.pageNum
        this.pConTrackPageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['pConTrackDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.pConTrackDialog.data)
          if (this.pConTrackDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.pConTrackDialog.visible = false
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
                if (this.pConTrackDialog.data.version) {
                  this.pConTrackDialog.data.version++
                }
                const index = this.pConTrackPageProps.record.findIndex(v => v.id === this.pConTrackDialog.data.id)
                this.pConTrackPageProps.record.splice(index, 1, this.pConTrackDialog.data)
                this.pConTrackDialog.visible = false
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
      this.$refs['pConTrackTable'].clearSelection()
      this.$refs['pConTrackTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pConTrackPageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pConTrackPageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['pConTrackForm'].resetFields()
      this.pConTrackQuery.dataRange = ''
      this.pConTrackPageProps.record = null
      this.pConTrackPageProps.total = 0
      this.pConTrackPageProps.pageSize = 10
      this.pConTrackPageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['pConTrackTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['pConTrackTable'].clearSelection()
      this.$refs['pConTrackTable'].toggleRowSelection(row)
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
      this.resetPConTrackDialog()
      this.pConTrackDialog.visible = true
      this.pConTrackDialog.data = Object.assign({}, row)
      this.pConTrackDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.pConTrackDialog.visible = true
      this.pConTrackDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetPConTrackDialog()
      this.pConTrackDialog.data.locked = 0
      this.pConTrackDialog.visible = true
      this.pConTrackDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.pConTrackDialog.state = 'update'
    },
    // 重置信息页面
    resetPConTrackDialog() {
      this.$nextTick(() => {
        if (this.$refs['pConTrackDataForm']) {
          this.$refs['pConTrackDataForm'].clearValidate()
        }
      })
      this.pConTrackDialog.data = {
        id: undefined,
        trackCode: null,
        trackName: null,
        trackType: null,
        deptId: null,
        columnPosition: null,
        isDecon: null,
        parentId: null,
        thirdRailFlag: null,
        sort: null,
        remark: null,
        reserved1: null,
        reserved2: null,
        dataCode: null,
        factoryId: null,
        isFlag: null,
        delFlag: null
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

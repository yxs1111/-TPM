import requestApi from '@/api/request-api'
import dictTypeApi from '@/api/meta/dict-type-api'
import { getFormatPickerOptions, getTextMap, parseTime, getDefaultPermissions } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

import dynamicForm from '@/components/DynamicForm'
const url = dictTypeApi.url

export default {
  name: 'DictType',
  directives: { elDragDialog, permission },
  components: { dynamicForm },
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
        name: [{ required: true, message: '字典类型名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '字典类型编码不能为空', trigger: 'blur' }]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      dictTypeDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      dynamicDictTypeDialog: {
        state: '',
        module: '字典类型',
        operation: '新增',
        visible: false,
        data: {
          id: undefined,
          name: '',
          code: '',
          locked: 0,
          createBy: null,
          createDate: null
        },
        formLabelWidth: '120px'
      },
      dictTypeQuery: {
        name: '',
        locked: null,
        dataRange: '',
        startDate: '',
        endDate: ''
      },
      dictTypePageProps: {
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
      if (this.dictTypeQuery.dataRange && this.dictTypeQuery.dataRange !== '') {
        this.dictTypeQuery.startDate = this.dictTypeQuery.dataRange[0]
        this.dictTypeQuery.endDate = this.dictTypeQuery.dataRange[1]
      } else {
        this.dictTypeQuery.startDate = ''
        this.dictTypeQuery.endDate = ''
      }
      requestApi.getPage(url, { name: this.dictTypeQuery.name, locked: this.dictTypeQuery.locked,
        startDate: this.dictTypeQuery.startDate, endDate: this.dictTypeQuery.endDate,
        pageSize: this.dictTypePageProps.pageSize, pageNum: this.dictTypePageProps.pageNum }).then(response => {
        const { data } = response
        this.dictTypePageProps.records = data.records
        this.dictTypePageProps.total = data.total
        this.dictTypePageProps.pageNum = data.pageNum
        this.dictTypePageProps.pageSize = data.pageSize
        this.searchLoading = false
      }).catch(error => {
        this.searchLoading = false
        console.error(error)
      })
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['dictTypeDataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.dictTypeDialog.data)
          if (this.dictTypeDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.dictTypeDialog.visible = false
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
                const index = this.dictTypePageProps.records.findIndex(v => v.id === this.dictTypeDialog.data.id)
                this.dictTypePageProps.records.splice(index, 1, this.dictTypeDialog.data)
                this.dictTypeDialog.visible = false
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
      this.$refs['dictTypeTable'].clearSelection()
      this.$refs['dictTypeTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.dictTypePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.dictTypePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['dictTypeForm'].resetFields()
      this.dictTypeQuery.dataRange = ''
      this.dictTypePageProps.records = null
      this.dictTypePageProps.total = 0
      this.dictTypePageProps.pageSize = 10
      this.dictTypePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['dictTypeTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['dictTypeTable'].clearSelection()
      this.$refs['dictTypeTable'].toggleRowSelection(row)
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
      this.resetDictTypeDialog()
      this.dictTypeDialog.visible = true
      this.dictTypeDialog.data = Object.assign({}, row)
      this.dictTypeDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.resetDictTypeDialog()
      this.dictTypeDialog.visible = true
      this.dictTypeDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetDictTypeDialog()
      this.dictTypeDialog.data.gender = 0
      this.dictTypeDialog.data.locked = 0
      this.dictTypeDialog.visible = true
      this.dictTypeDialog.state = 'create'
    },
    // 动态表单
    dynamicNewRowData() {
      this.dynamicDictTypeDialog.data.gender = 0
      this.dynamicDictTypeDialog.data.locked = 0
      this.dynamicDictTypeDialog.visible = true
      this.dynamicDictTypeDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.dictTypeDialog.state = 'update'
    },
    // 重置信息页面
    resetDictTypeDialog() {
      this.$nextTick(() => {
        if (this.$refs['dictTypeDataForm']) {
          this.$refs['dictTypeDataForm'].clearValidate()
        }
      })
      this.dictTypeDialog.data = {
        id: undefined,
        name: '',
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
    },
    /**
     * 动态表单添加字典类型
     */
    addDicType(formData) {
      requestApi.save(url, Object.assign({}, formData)).then((res) => {
        if (res && res.code === 1000) {
          this.dynamicDictTypeDialog.visible = false
          Message.success({
            message: '新增成功',
            duration: 5 * 1000
          })
          this.fetchData()
        }
      })
    }
  }
}

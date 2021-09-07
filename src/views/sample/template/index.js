import requestApi from '@/api/request-api'
import templateApi from '@/api/sample/template-api'
import { getFormatPickerOptions, getTextMap, parseTime } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/neat.css'
import axios from 'axios'

require('codemirror/mode/velocity/velocity')

const url = templateApi.url

export default {
  name: 'Template',
  components: { codemirror },
  directives: { elDragDialog },
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
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      templateDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          name: null,
          fileName: null,
          content: null,
          createBy: null,
          createDate: null,
          version: 0
        },
        formLabelWidth: '120px'
      },
      templateQuery: {
        name: null,
        dataRange: ''
      },
      templatePageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      cmOptions: {
        value: '',
        mode: 'text/velocity',
        theme: 'neat',
        lineNumbers: true,
        readOnly: false,
        highlightDifferences: true
      },
      isVelocityBarFixed: false,
      // tree
      activeName: 'java',
      treeData: [],
      velocityConfig: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  created() {
    this.fetchData()
    this.loadVelocityVar()
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
      if (this.templateQuery.dataRange && this.templateQuery.dataRange !== '') {
        this.templateQuery.startDate = this.templateQuery.dataRange[0]
        this.templateQuery.endDate = this.templateQuery.dataRange[1]
      } else {
        this.templateQuery.startDate = ''
        this.templateQuery.endDate = ''
      }
      requestApi.getPage(url, {
        startDate: this.templateQuery.startDate, endDate: this.templateQuery.endDate, name: this.templateQuery.name,
        pageSize: this.templatePageProps.pageSize, pageNum: this.templatePageProps.pageNum
      }).then(response => {
        const { data } = response
        this.templatePageProps.records = data.records
        this.templatePageProps.total = data.total
        this.templatePageProps.pageNum = data.pageNum
        this.templatePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['genTemplateDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.templateDialog.data)
          if (this.templateDialog.state === 'create') {
            requestApi.save(url, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.templateDialog.visible = false
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
                if (this.templateDialog.data.version) {
                  this.templateDialog.data.version++
                }
                const index = this.templatePageProps.records.findIndex(v => v.id === this.templateDialog.data.id)
                this.templatePageProps.records.splice(index, 1, this.templateDialog.data)
                this.templateDialog.visible = false
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
      this.$refs['genTemplateTable'].clearSelection()
      this.$refs['genTemplateTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.templatePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.templatePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['genTemplateForm'].resetFields()
      this.templateQuery.dataRange = ''
      this.templatePageProps.records = null
      this.templatePageProps.total = 0
      this.templatePageProps.pageSize = 10
      this.templatePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['genTemplateTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['genTemplateTable'].clearSelection()
      this.$refs['genTemplateTable'].toggleRowSelection(row)
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
      this.resetGenTemplateDialog()
      this.templateDialog.visible = true
      this.templateDialog.data = Object.assign({}, row)
      this.templateDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.templateDialog.visible = true
      this.templateDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetGenTemplateDialog()
      this.templateDialog.data.locked = 0
      this.templateDialog.visible = true
      this.templateDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.templateDialog.state = 'update'
    },
    // 重置信息页面
    resetGenTemplateDialog() {
      this.$nextTick(() => {
        if (this.$refs['genTemplateDataForm']) {
          this.$refs['genTemplateDataForm'].clearValidate()
        }
      })
      this.templateDialog.data = {
        id: undefined,
        name: null,
        fileName: null,
        content: '',
        createBy: null,
        createDate: null,
        version: 0
      }
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    loadVelocityVar() {
      this.getFile('velocity/java.json?q=' + new Date().getTime(), content => {
        this.velocityConfig.push({
          name: 'java',
          label: 'Java变量',
          data: content.data
        })
        this.treeData = content.data
      })
    },
    getFile: function(path, callback) {
      axios.get(path)
        .then(function(response) {
          callback.call(this, response.data)
        })
    },
    onExpressionClick(exp) {
      const mirror = this.$refs.editor.codemirror
      // 插入表达式
      mirror.replaceSelection(exp)
      // 重新获得光标
      mirror.focus()
    }
  }
}

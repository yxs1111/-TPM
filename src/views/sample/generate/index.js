import requestApi from '@/api/request-api'
import datasourceApi from '@/api/sample/datasource-api'
import { getFormatPickerOptions, getTextMap, parseTime } from '@/utils'
import { Message } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import ClipboardJS from 'clipboard'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import templateApi from '@/api/sample/template-api'
import 'codemirror/theme/neat.css'

require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
require('codemirror/mode/htmlembedded/htmlembedded')
require('codemirror/mode/htmlmixed/htmlmixed')
require('codemirror/mode/xml/xml')

const datasourceUrl = datasourceApi.url
const templateUrl = templateApi.url
const dbTypeMap = []

const mode_map = {
  'js': 'text/javascript',
  'java': 'text/x-java',
  'cs': 'text/x-csharp',
  'jsp': 'application/x-jsp',
  'html': 'text/html',
  'vue': 'application/x-ejs',
  'aspx': 'application/x-aspx',
  'xml': 'application/xml'
}
export default {
  name: 'Datasource',
  directives: { elDragDialog },
  filters: {
    // 数据库类型文字
    dbTypeWordFilter(type) {
      return dbTypeMap[type]
    }
  },
  data() {
    return {
      tableSearch: '',
      templateSearch: '',
      searchLoading: false,
      saveLoading: false,
      generateLoading: false,
      testLoading: false,
      tableLoading: false,
      templateLoading: false,
      editDisabled: true,
      multipleSelection: [],
      stateMap: {
        1: '1',
        0: '0'
      },
      textMap: getTextMap(),
      rules: {
        host: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      lockedStateOptions: [
        { key: 0, display_name: '未锁定' },
        { key: 1, display_name: '已锁定' }
      ],
      codeDialog: {
        visible: false
      },
      codeResultDialog: {
        visible: false
      },
      datasourceDialog: {
        state: '',
        visible: false,
        data: {
          id: undefined,
          dbType: null,
          driverClass: null,
          dbName: null,
          host: null,
          port: null,
          username: null,
          password: null,
          createBy: null,
          createDate: null,
          version: null
        },
        formLabelWidth: '120px'
      },
      datasourceQuery: {
        dbType: null,
        dbName: null,
        host: null,
        dataRange: ''
      },
      datasourcePageProps: {
        records: null,
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      // 日期控件快捷选项
      pickerOptions: getFormatPickerOptions(),
      // 对话框
      centerDialogVisible: false,
      templateListData: [],
      dbTypeConfig: [],
      tableListData: [],
      clientParam: {
        datasourceId: '',
        tableNames: [],
        templateIdList: [],
        packageName: 'cn.jbinfo.imt.base'
      },
      treeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'fileName'
      },
      content: '',
      fileInfo: {
        content: '',
        fileName: ''
      },
      cmOptions: {
        value: '',
        mode: 'text/x-java',
        theme: 'neat',
        readOnly: true
      }
    }
  },
  created() {
    this.fetchData()
    this.loadDbType()
    this.initCopy()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    multipleSelection(val) {
      this.editDisabled = !(val && val.length === 1)
    }
  },
  destroyed() {
    this.cleanCopy()
  },
  methods: {
    // 查询方法
    fetchData() {
      this.searchLoading = true
      if (this.datasourceQuery.dataRange && this.datasourceQuery.dataRange !== '') {
        this.datasourceQuery.startDate = this.datasourceQuery.dataRange[0]
        this.datasourceQuery.endDate = this.datasourceQuery.dataRange[1]
      } else {
        this.datasourceQuery.startDate = ''
        this.datasourceQuery.endDate = ''
      }
      requestApi.getPage(datasourceUrl, {
        startDate: this.datasourceQuery.startDate,
        endDate: this.datasourceQuery.endDate,
        dbName: this.datasourceQuery.dbName,
        host: this.datasourceQuery.host,
        pageSize: this.datasourcePageProps.pageSize,
        pageNum: this.datasourcePageProps.pageNum
      }).then(response => {
        const { data } = response
        this.datasourcePageProps.records = data.records
        this.datasourcePageProps.total = data.total
        this.datasourcePageProps.pageNum = data.pageNum
        this.datasourcePageProps.pageSize = data.pageSize
      }).catch(error => {
        console.log(error)
      })
      this.searchLoading = false
    },
    // 保存方法
    saveOrUpdate() {
      this.$refs['datasourceDataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const params = Object.assign({}, this.datasourceDialog.data)
          if (this.datasourceDialog.state === 'create') {
            requestApi.save(datasourceUrl, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                this.datasourceDialog.visible = false
                Message.success({
                  message: '新增成功',
                  duration: 5 * 1000
                })
                this.fetchData()
              }
            })
          } else {
            requestApi.update(datasourceUrl, params).then((res) => {
              this.saveLoading = false
              if (res && res.code === 1000) {
                if (this.datasourceDialog.data.version) {
                  this.datasourceDialog.data.version++
                }
                const index = this.datasourcePageProps.records.findIndex(v => v.id === this.datasourceDialog.data.id)
                this.datasourcePageProps.records.splice(index, 1, this.datasourceDialog.data)
                this.datasourceDialog.visible = false
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
        requestApi.remove(datasourceUrl, ids).then((res) => {
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
      this.$refs['datasourceTable'].clearSelection()
      this.$refs['datasourceTable'].toggleRowSelection(row)
      this.centerDialogVisible = true
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.datasourcePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.datasourcePageProps.pageNum = num
      this.fetchData()
    },
    // 点击查询按钮
    search() {
      this.handleCurrentChange(1)
    },
    // 重置方法
    reset() {
      this.$refs['datasourceForm'].resetFields()
      this.datasourceQuery.dataRange = ''
      this.datasourcePageProps.records = null
      this.datasourcePageProps.total = 0
      this.datasourcePageProps.pageSize = 10
      this.datasourcePageProps.pageNum = 1
      this.fetchData()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作') {
        this.$refs['datasourceTable'].toggleRowSelection(row)
      }
    },
    // 单击行，切换选中状态
    handleTableRowClick(row) {
      this.$refs['tableSearchTable'].toggleRowSelection(row)
    },
    // 单击行，切换选中状态
    handleTemplateRowClick(row) {
      this.$refs['templateSearchTable'].toggleRowSelection(row)
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row) {
      this.$refs['datasourceTable'].clearSelection()
      this.$refs['datasourceTable'].toggleRowSelection(row)
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
    tableRowClassName: function({ row }) {
      row.hidden = false
      if (this.tableSearch.length === 0) {
        return ''
      }
      if (!(row.tableName && row.tableName.indexOf(this.tableSearch) > -1)) {
        row.hidden = true
        return 'hidden-row'
      }
      return ''
    },
    templateRowClassName: function({ row }) {
      row.hidden = false
      if (this.templateSearch.length === 0) {
        return ''
      }
      if (!(row.name && row.name.indexOf(this.templateSearch) > -1)) {
        row.hidden = true
        return 'hidden-row'
      }
      return ''
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetDatasourceDialog()
      this.datasourceDialog.visible = true
      this.datasourceDialog.data = Object.assign({}, row)
      this.datasourceDialog.state = 'info'
    },
    // 编辑
    editRowData(row) {
      this.datasourceDialog.visible = true
      this.datasourceDialog.data = Object.assign({}, row)
      this.changeToEdit()
    },
    // 新增
    newRowData() {
      this.resetDatasourceDialog()
      this.datasourceDialog.data.locked = 0
      this.datasourceDialog.visible = true
      this.datasourceDialog.state = 'create'
    },
    // 详情页点击编辑
    changeToEdit() {
      this.datasourceDialog.state = 'update'
    },
    // 重置信息页面
    resetDatasourceDialog() {
      this.$nextTick(() => {
        if (this.$refs['datasourceDataForm']) {
          this.$refs['datasourceDataForm'].clearValidate()
        }
      })
      this.datasourceDialog.data = {
        id: undefined,
        dbType: 1,
        driverClass: null,
        dbName: null,
        host: null,
        port: null,
        username: null,
        password: null,
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
    loadTemplate() {
      this.templateLoading = true
      requestApi.request_get(templateUrl + '/list', {}).then(resp => {
        if (resp) {
          this.templateListData = resp.data
          this.templateLoading = false
        }
      }).catch(() => {
        this.templateLoading = false
      })
    },
    loadDbType() {
      requestApi.request_get(datasourceUrl + '/dbType', {}).then(resp => {
        if (resp) {
          const data = resp.data
          this.dbTypeConfig = data
          data.map((d) => {
            this.$set(dbTypeMap, d.dbType, d.label)
          })
        }
      })
    },
    onDatasourceTest() {
      this.$refs['datasourceDataForm'].validate((valid) => {
        if (valid) {
          this.testLoading = true
          requestApi.request_post(datasourceUrl + '/test', this.datasourceDialog.data).then((res) => {
            if (res && res.code === 1000) {
              Message.success({
                message: '连接成功',
                duration: 5 * 1000
              })
            }
            this.testLoading = false
          })
        }
      })
    },
    showCodeDialog(row) {
      this.tableSearch = ''
      this.templateSearch = ''
      this.tableLoading = true
      this.clientParam.datasourceId = row.id
      this.loadTemplate()
      requestApi.request_get(datasourceUrl + '/table/' + row.id, {}).then(resp => {
        if (resp) {
          this.tableListData = resp.data
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
      this.codeDialog.visible = true
    },
    onTableListSelect(selectedRows) {
      this.clientParam.tableNames = selectedRows
        .filter(row => row.hidden === undefined || row.hidden === false)
        .map(row => row.tableName)
    },
    onTemplateListSelect(selectedRows) {
      this.clientParam.templateIdList = selectedRows.map(row => row.id)
    },
    onGenerate() {
      if (this.clientParam.tableNames.length === 0) {
        Message.warning({
          message: '请选择表',
          duration: 5 * 1000
        })
      } else if (this.clientParam.templateIdList.length === 0) {
        Message.warning({
          message: '请选择模板',
          duration: 5 * 1000
        })
      } else {
        this.generateLoading = true
        this.clientParam.packageName = this.clientParam.packageName || 'cn.jbinfo.imt.base'
        requestApi.request_post('/gen/generate/code', this.clientParam).then(resp => {
          this.generateLoading = false
          const rows = resp.data
          this.treeData = this.buildTreeData(rows)
          this.content = ''
          this.fileInfo = {
            content: '',
            fileName: ''
          }
          this.codeResultDialog.visible = true
        }).catch(() => {
          this.generateLoading = false
        })
      }
    },
    // 树搜索
    filterNode(value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    buildTreeData(rows) {
      const treeData = []
      const codeMap = {}
      // 把列表数据转换到map中,key为模板名
      // value是个List
      for (let i = 0, len = rows.length; i < len; i++) {
        const row = rows[i]
        const folder = row.folder
        let list = codeMap[folder]
        if (!list) {
          list = []
          codeMap[folder] = list
        }
        list.push(row)
      }
      // 把这个map对象转成tree格式数据
      for (const folder in codeMap) {
        const codeFileArr = codeMap[folder]
        // 父节点
        const treeElement = {
          fileName: folder,
          children: this.buildChildren(codeFileArr)
        }

        treeData.push(treeElement)
      }
      return treeData
    },
    buildChildren(codeFileArr) {
      const children = []
      for (let i = 0, len = codeFileArr.length; i < len; i++) {
        const codeFile = codeFileArr[i]
        const child = {
          fileName: codeFile.fileName,
          content: codeFile.content
        }
        children.push(child)
      }
      return children
    },
    onTreeSelect(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      this.fileInfo = data
      this.changeMod(data.fileName)
    },
    changeMod(fileName) {
      const suffix = this.getSuffix(fileName)
      this.cmOptions.mode = mode_map[suffix] || 'text/javascript'
    },
    getSuffix(fileName) {
      const index = fileName.lastIndexOf('.')
      if (index === -1) {
        return 'js'
      }
      return fileName.substring(index + 1, fileName.length)
    },
    downloadAll() {
      const data = this.treeData
      const zip = new JSZip()
      data.forEach(row => {
        const children = row.children
        const isFolder = children.length > 0
        if (isFolder) {
          // 创建文件夹
          const folderZip = zip.folder(row.fileName)
          children.forEach(child => {
            // 文件放入文件夹中
            folderZip.file(child.fileName, child.content)
          })
        }
      })
      // 下载
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // see FileSaver.js
        saveAs(content, `code-${new Date().getTime()}.zip`)
      })
    },
    downloadText(filename, text) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    cleanCopy: function() {
      if (this.clipboard) {
        this.clipboard.destroy()
      }
    },
    initCopy: function() {
      const clipboard = new ClipboardJS('.copyBtn')
      clipboard.on('success', function() {
        Message.success({
          message: '复制成功',
          duration: 5 * 1000
        })
      })
      this.clipboard = clipboard
    }
  }
}

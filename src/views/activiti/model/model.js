import { mapState, mapActions, mapMutations } from 'vuex'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import BpmConfig from '@/components/activiti/template/BpmConfig'
import modelApi from '@/api/activiti/modelApi'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      modelDialog: {
        type: null,
        visible: false,
        data: {
          id: null,
          category: null,
          name: '',
          key: '',
          version: null,
          description: ''
        },
        confirm: {
          visible: false
        }
      },
      categoryArr: [{ label: 'test', value: '19' }],
      filterObj:{
        name:'',
        keyName:'',
        type:'',
      },
      flowDirection: [
        { text: '从左往右', value: 'horizontal' },
        { text: '从上往下', value: 'vertical' }
      ],
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      rules: {
        key: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          { type: 'number', min: 1, message: '最少为1', trigger: 'blur' }
        ]
      }
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    ...mapState('model', ['loading', 'tableLoading', 'modelSelected', 'modelData', 'queryParams', 'tableData'])
  },
  methods: {
    ...mapMutations('model', ['selectModel', 'unSelectModel']),
    ...mapActions('model', ['saveModel', 'updateModel', 'pageList', 'rowSelected', 'deleteModel', 'publishModelApi', 'reset']),
    search() {
      this.pageList()
    },
    // 每页记录数改变时会触发
    handleSizeChange(newSize) {
      this.queryParams.size = newSize
      this.pageList()
    },
    // 当前页码改变时会触发
    handleCurrentChange(newCurrent) {
      this.queryParams.start = newCurrent
      this.pageList()
    },
    // 设计模型
    designModel: function(row) {
      this.selectModel(row)
      this.$router.push({ path: '/modeler', query: row })
    },
    /**
     * 新增/编辑模型
     * @returns {Promise<void>}
     */
    saveOrUpdateModel: function() {
      this.$refs.modelDataForm.validate((valid) => {
        if (valid) {
          // 获取bpmn模板
          if (this.modelDialog.type === 'create') {
            // 新增
            const defaultBpmnData = new BpmConfig(this.modelDialog.data.key, this.modelDialog.data.name, this.modelDialog.description)
            this.modelDialog.data.sourceUrl = defaultBpmnData.sourceUrlTemplate
            this.saveModel(this.modelDialog.data).then(data => {
              if (data) {
                this.$confirm('是否开始设计模型?', '提示', {
                  confirmButtonText: '设 计'
                }).then(() => {
                  this.selectModel(data)
                  this.$router.push({ path: '/modeler', query: data })
                }).catch(() => {
                  this.pageList()
                })
              }
            })
          } else {
            // 编辑
            this.updateModel(this.modelDialog.data)
          }
          this.modelDialog.visible = false
        } else {
          return false
        }
      })
    },
    publishModel() {
      this.$confirm('确认要发布吗?', '发布模型', {
        confirmButtonText: '确定',
        callback: () => {
          this.publishModelApi(this)
        }
      }).then(r => {
        console.log('发布成功', r)
      })
    },
    /**
     * 关闭模型新增/编辑弹框
     */
    closeModelDialog() {
      this.resetModelInfoDialog()
      this.modelDialog.visible = false
      if (this.modelDialog.type !== 'info') {
        this.pageList()
      }
    },
    /**
     * 编辑模型弹窗
     * @param currentRow
     */
    editModel(currentRow) {
      this.modelDialog.data = currentRow
      if (currentRow.metaInfo) {
        this.modelDialog.data.description = JSON.parse(currentRow.metaInfo).description
        this.modelDialog.data.direction = JSON.parse(currentRow.metaInfo).direction
      }

      this.modelDialog.visible = true
      this.modelDialog.type = 'update'

      this.$nextTick(() => {
        this.$refs['modelDataForm'].clearValidate()
      })
    },
    /**
     * 打开模型弹窗
     */
    openModelDialog() {
      this.modelDialog.visible = true
      this.modelDialog.type = 'create'
      this.resetModelInfoDialog()
    },
    init() {
      // 获取分类数据
      modelApi.getCategoryOfModel({ tenantId: '0' }).then(res => {
        this.categoryArr = res.data
      })
      // 初始化列表页
      this.pageList()
    },
    onInput() {
      this.$forceUpdate()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['modelInfoTable']) {
        this.$refs['modelInfoTable'].toggleRowSelection(row)
        this.selectModel(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['modelInfoTable']) {
        this.$refs['modelInfoTable'].clearSelection()
        this.$refs['modelInfoTable'].toggleRowSelection(row)
        this.getRowData(row)
      }
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetModelInfoDialog()
      this.modelDialog.visible = true
      this.modelDialog.data = Object.assign({}, row)
      if (this.modelDialog.data.metaInfo) {
        this.modelDialog.data.description = JSON.parse(this.modelDialog.data.metaInfo).description
        this.modelDialog.data.direction = JSON.parse(this.modelDialog.data.metaInfo).direction
      }
      this.modelDialog.type = 'info'
    },
    resetModelInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs['modelDataForm']) {
          this.$refs['modelDataForm'].clearValidate()
        }
      })
      this.modelDialog.data = {
        id: null,
        category: null,
        name: '',
        key: '',
        version: null,
        description: ''
      }
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    directionChange() {
      this.$forceUpdate()
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    }
  }
}

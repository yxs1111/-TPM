import { mapState, mapActions, mapMutations } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { getDefaultPermissions, getTextMap } from '@/utils'
import flowDiagram from '@/components/FlowDiagram'
export default {
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      modelSelected: null,
      flowDiagram: {
        visible: false,
        processDefinitionId: null
      },
      filterObj:{
        name:'',
        keyName:'',
        type:'',
      },
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      processInfoDialog: {
        type: null,
        visible: false,
        data: {}
      }
    }
  },
  created() {
    this.pageList()
  },
  filters: {
    // 是否包含流程图显示文字
    hasGraphicalTextFilter(status) {
      return status ? '有' : '无'
    },
    // 是否包含流程图样式
    hasGraphicalStyleFilter(status) {
      return status ? 'success' : 'danger'
    },
    processStatsStyleFilter(suspend) {
      return suspend ? 'danger' : 'success'
    },
    processStatsTextFilter(suspend) {
      return suspend ? '暂停' : '启用'
    }
  },
  components: {
    flowDiagram
  },
  directives: { elDragDialog, permission },
  methods: {
    ...mapActions('process', ['activateProcess', 'suspendProcess', 'reset', 'pageList', 'rowSelected', 'search', 'startProcess']),
    ...mapMutations('process', ['selectProcess', 'unSelectProcess']),
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
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['processTable']) {
        this.$refs['processTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['processTable']) {
        this.$refs['processTable'].clearSelection()
        this.$refs['processTable'].toggleRowSelection(row)
      }
    },
    getRowData(row) {
      this.resetProcessInfoDialog()
      this.processInfoDialog.visible = true
      this.processInfoDialog.data = Object.assign({}, row)
      this.processInfoDialog.type = 'info'
    },
    resetProcessInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs.processDataForm) {
          this.$refs.processDataForm.clearValidate()
        }
      })
      this.processInfoDialog.data = {}
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * 显示流程图
     * @param row
     */
    showFlowDiagram(row) {
      if (row.graphicalNotationDefined) {
        this.flowDiagram.processDefinitionId = row.id
        this.flowDiagram.visible = true
      }
    }
  },
  computed: {
    ...mapState('process', ['queryParams', 'loading', 'tableData', 'processSelected'])
  }
}

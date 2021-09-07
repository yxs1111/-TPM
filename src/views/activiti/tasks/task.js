import { mapState, mapActions, mapMutations } from 'vuex'
import auth from '@/utils/auth'
import { getDefaultPermissions, getTextMap, parseTime } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

export default {
  data() {
    return {
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      modelSelected: null
    }
  },
  created() {
    this.setLoginUser(auth.getLoginName())
    this.pageList()
  },
  directives: { elDragDialog, permission },
  filters: {
    taskStatsStyleFilter(suspended) {
      return suspended ? 'danger' : 'success'
    },
    taskStatsTextFilter(suspended) {
      return suspended ? '暂停' : '启用'
    }
  },
  methods: {
    ...mapActions('task', ['reset', 'pageList', 'complete']),
    ...mapMutations('task', ['unSelectTask', 'setLoginUser', 'selectTask']),
    operateProcess: function(currentRow) {
      this.$router.push({ path: 'taskDetail', query: currentRow })
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
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['taskTable']) {
        this.$refs['taskTable'].toggleRowSelection(row)
        this.selectTask(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['taskTable']) {
        this.$refs['taskTable'].clearSelection()
        this.$refs['taskTable'].toggleRowSelection(row)
        this.getRowData(row)
      }
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取当前行详情
    getRowData(row) {
      console.log(row)
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    }
  },
  computed: {
    ...mapState('task', ['queryParams', 'tableData', 'searchLoading'])
  }
}

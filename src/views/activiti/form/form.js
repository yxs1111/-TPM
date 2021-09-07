import formApi from '@/api/activiti/formApi'
import { saveDrawingList } from '@/utils/db'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { getDefaultPermissions, getTextMap } from '@/utils'
export default {
  data() {
    return {
      queryParams: {
        name: '',
        businessName: '',
        key: '',
        category: '',
        start: 0,
        size: 10,
        total: null,
        tenantId: 0
      },
      tableData: [],
      textMap: getTextMap(),
      permissions: getDefaultPermissions(),
      searchLoading: false
    }
  },
  mounted() {
    this.pageList()
  },
  directives: { elDragDialog, permission },
  methods: {
    /**
     * 打开表单设计
     * @param row
     */
    designForm: function(row) {
      if (row.metaInfo) {
        const fields = JSON.parse(row.metaInfo).fields
        if (Array.isArray(fields) && fields.length > 0) {
          // 缓存
          saveDrawingList(fields)
        }
      }
      this.$router.push({ path: '/formDesign', query: row })
    },
    pageList: function() {
      this.searchLoading = true
      formApi.pageList(this.queryParams).then(res => {
        this.searchLoading = false
        if (res.code === 1000) {
          this.tableData = res.data.records
          this.queryParams.total = res.data.total
        }
      })
    },
    reset: function() {
      this.queryParams = {
        name: '',
        key: '',
        category: '',
        start: 0,
        size: 10,
        total: null,
        tenantId: 0
      }
      this.pageList()
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['formTable']) {
        this.$refs['formTable'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['formTable']) {
        this.$refs['formTable'].clearSelection()
        this.$refs['formTable'].toggleRowSelection(row)
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
    }
  }
}

import detainCarApi from '@/api/activiti/detainCarApi'
import { Message } from 'element-ui'
import { getDefaultPermissions, getTextMap } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import DynamicForm from '@/components/DynamicForm'
import ApproveFlow from '@/components/ApproveFlow'
import FlowDiagram from '@/components/FlowDiagram'
const statusMap = {
  1: '草稿',
  2: '待审批',
  3: '待解除',
  4: '已接触'
}
export default {
  data() {
    return {
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      showApproveFlag: false,
      queryParams: {
        num: '',
        applyDept: '',
        applyUser: '',
        carNum: '',
        start: 0,
        size: 10,
        total: null,
        tenantId: 0
      },
      detainCarData: [],
      updateVisible: false,
      detainCarDialog: {
        loading: false,
        visible: false,
        data: {
          tableData: [{}]
        }
      },
      approveDialog: {
        visible: false,
        businessId: null,
        activate: false,
        data: {
          tableData: [
          ]
        }
      },
      detainCarDetailDialog: {
        visible: false
      },
      categoryArr: [],
      searchLoading: false,
      flowDiagram: {
        visible: false,
        activate: false,
        businessId: null
      }
    }
  },
  filters: {
    renderStatus(status) {
      return statusMap[status]
    }
  },
  created() {
    this.search()
  },
  components: {
    DynamicForm, ApproveFlow, FlowDiagram
  },
  directives: { elDragDialog, permission },
  methods: {
    search: function() {
      this.searchLoading = true
      detainCarApi.pageList({
        pageSize: this.queryParams.size,
        pageNum: this.queryParams.start,
        num: this.queryParams.num,
        applyDept: this.queryParams.applyDept,
        applyUser: this.queryParams.applyUser,
        carNum: this.queryParams.carNum
      }).then(res => {
        this.searchLoading = false
        if (res.code === 1000) {
          this.detainCarData = res.data.records
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
      this.search()
    },
    saveDetainCar: async function() {
      this.detainCarDialog.loading = true
      const param = Object.assign({ processDefinitionId: 'jbinfodetainCar:1:17504' }, this.detainCarDialog.data, this.detainCarDialog.data.tableData[0])
      // 创建扣车申请
      const detainCarRes = await detainCarApi.saveAndStartProcess(Object.assign({}, param))
      this.detainCarDialog.loading = false
      this.detainCarDialog.visible = false
      if (detainCarRes && detainCarRes.code === 1000) {
        Message.success({
          message: '新增成功',
          duration: 5000
        })
        this.search()
      }
    },
    /**
     * 审批扣车申请
     */
    approveDetainCar() {
      const selectedData = this.getOneSelectedData()

      if (selectedData) {
        this.approveDialog.data = { tableData: [] }
        Object.assign(this.approveDialog.data, selectedData)
        this.approveDialog.data.tableData.push(Object.assign({}, selectedData))

        this.approveDialog.activate = true
        this.approveDialog.visible = true
        this.approveDialog.businessId = selectedData.id
      }
    },
    resetBusinessTableForm: function() {
      this.$nextTick(() => {
        this.$refs['detainCarTable'].clearValidate()
      })
      this.detainCarDialog.data = {
        id: null,
        alias: null,
        name: null,
        comment: null,
        source: null,
        categoryId: null,
        fieldList: [{}]
      }
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['detainCarTable']) {
        this.$refs['detainCarTable'].toggleRowSelection(row)
      }
      // TODO 根据businessId调用接口判断是否显示"审核"按钮。
      if (row.status !== 4) {
        this.showApproveFlag = true
      } else {
        this.showApproveFlag = false
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['detainCarTable']) {
        this.$refs['detainCarTable'].clearSelection()
        this.$refs['detainCarTable'].toggleRowSelection(row)
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
    /**
     * 打开流程图
     */
    openFlowDiagram() {
      const selectedData = this.getOneSelectedData()
      if (selectedData) {
        this.flowDiagram.businessId = selectedData.id
        this.flowDiagram.visible = true
      }
    },
    /**
     * 获取一条选择的数据
     * @returns {*}
     */
    getOneSelectedData() {
      const selectedDatas = this.$refs['detainCarTable'].selection
      if (selectedDatas.length > 1) {
        this.$message.error('只能操作一条数据')
        return
      }
      if (selectedDatas.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }
      return Object.assign({}, selectedDatas[0])
    },
    deleteDetailCarApply() {
      const selectedDatas = this.$refs['detainCarTable'].selection
      if (selectedDatas.length === 0) {
        this.$message.error('请选择需要删除的数据')
        return
      }
      const ids = []
      this.multipleSelection.map(row => {
        ids.push(row.id)
      })
      detainCarApi.deleteDetainCar(ids).then(res => {
        if (res.code === 1000) {
          this.search()
        }
      })
    },
    /**
     * 扣车申请完结
     */
    completeDetailCarApply() {
      console.log('扣车审批完结')
      const selected = this.getOneSelectedData()
      selected.status = 4
      detainCarApi.update(selected).then(() => {
        this.search()
      })
    },
    passDetailCarApply(task) {
      console.log('aaa', task)
    }
  }
}

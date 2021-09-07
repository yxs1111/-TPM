import tableApi from '@/api/activiti/tableApi'
import modelApi from '@/api/activiti/modelApi'
import { Message } from 'element-ui'
import { getDefaultPermissions, getTextMap } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'

export default {
  data() {
    return {
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      queryParams: {
        name: '',
        key: '',
        category: '',
        start: 0,
        size: 10,
        total: null,
        tenantId: 0
      },
      tableData: [],
      updateVisible: false,
      tableDialog: {
        data: {
          id: null,
          alias: null,
          name: null,
          comment: null,
          source: null,
          categoryId: null,
          fieldList: [{}]
        },
        type: null,
        visible: false,
        verify: {
          alias: [
            { required: true, message: '别名不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '表名不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ]
        }
      },
      categoryArr: [],
      searchLoading: false
    }
  },
  created() {
    this.search()
  },
  directives: { elDragDialog, permission },
  mounted() {
    // 获取分类数据
    modelApi.getCategoryOfModel({ tenantId: '0' }).then(res => {
      if (res.code === 1000) {
        this.categoryArr = res.data
      }
    })
  },
  computed: {
  },
  methods: {
    search: function() {
      tableApi.pageList(this.queryParams).then(res => {
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
      this.search()
    },
    updateTable: async function(row) {
      // 1、获取表字段信息
      const res = await tableApi.getTableField(row)
      if (res.code === 1000) {
        // TODO 2、设置tableDialog
        this.tableDialog.data.fieldList = res.data
        this.tableDialog.data = row
        this.tableDialog.type = 'update'
        this.tableDialog.visible = true
      }
    },
    addBusinessTableForm: function() {
      this.tableDialog.type = 'create'
      this.tableDialog.visible = true

      this.resetBusinessTableForm()
    },
    resetBusinessTableForm: function() {
      this.$nextTick(() => {
        this.$refs['tableForm'].clearValidate()
      })
      this.tableDialog.data = {
        id: null,
        alias: null,
        name: null,
        comment: null,
        source: null,
        categoryId: null,
        fieldList: [{}]
      }
    },
    saveOrUpdateTable: function() {
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          if (this.tableDialog.type === 'create') {
            // 新增
            tableApi.saveTableAndField(this.tableDialog.data).then(res => {
              if (res.code === 1000) {
                Message.success({
                  type: 'success',
                  message: '新增成功'
                })
                this.tableDialog.visible = false
                this.search()
              }
            })
          } else {
            // 编辑
            tableApi.updateTable(this.tableDialog.data).then(res => {
              if (res.code === 1000) {
                Message.success({
                  type: 'success',
                  message: '编辑成功'
                })
                this.search()
              }
            })
          }
        }
      })
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== '操作' && this.$refs['tableForm']) {
        this.$refs['tableForm'].toggleRowSelection(row)
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== '操作' && this.$refs['tableForm']) {
        this.$refs['tableForm'].clearSelection()
        this.$refs['tableForm'].toggleRowSelection(row)
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

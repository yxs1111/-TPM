<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">费用类型</span>
          <el-input v-model="filterObj.costType" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">MinePackage</span>
          <el-input v-model="filterObj.minePackage" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">费用科目</span>
          <el-input v-model="filterObj.costItem" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG"  @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <!-- <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
    </div> -->
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" style="width: 100%">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column align="center" prop="costTypeNumber" label="费用类型编码"> </el-table-column>
      <el-table-column align="center" prop="costType" label="费用类型"> </el-table-column>
      <el-table-column align="center" prop="minePackageNumber" label="MinePackage编码"> </el-table-column>
      <el-table-column align="center" prop="minePackage" label="MinePackage"> </el-table-column>
      <el-table-column align="center" prop="costItemTypeNumber" label="费用科目编码"> </el-table-column>
      <el-table-column align="center" prop="costItem" label="费用科目"> </el-table-column>
      <el-table-column align="center" prop="glAccount" label="GL Account"> </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap,getHeight,downloadFile} from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'RoleCostSubjectControl',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        costType: '',
        minePackage: '',
        costItem: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
      checkArr: [], //批量删除,存放选中
      costlevel: '1',
      costTypeList: [],
      MinePackageList: [],
      maxheight: getHeight(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getTableData()
  },
  watch: {},
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      API.getPageMdCostType({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        costType: this.filterObj.costType,
        minePackage: this.filterObj.minePackage,
        costItem: this.filterObj.costItem,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    Reset() {
      this.filterObj = {
        costType: '',
        minePackage: '',
        costItem: '',
      }
      this.getTableData()
    },
    //多个删除
    mutidel() {
      if (this.checkArr.length === 0) return this.$message.error('请选择数据')
      else {
        const costItemIdLList = []
        this.checkArr.forEach((item) => {
          costItemIdLList.push(item.costItemId)
        })
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.deleteMdCostType(costItemIdLList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum=1
      this.getTableData()
    },
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('costType', this.filterObj.costType)
      formData.append('minePackage', this.filterObj.minePackage)
      formData.append('costItem', this.filterObj.costItem)
      API.exportCostType(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '费用类型 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    handleSelectionChange(val) {
      this.checkArr = val
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pageSize = size
      this.getTableData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pageNum = num
      this.getTableData()
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  },
}
</script>

<style lang="scss" scoped></style>

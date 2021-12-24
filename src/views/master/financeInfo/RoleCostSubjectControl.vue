<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">费用类型名称</span>
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
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <!-- <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div> -->
    <el-table :data="tableData" max-height="600" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column align="center" prop="costTypeNumber" label="费用类型编码"> </el-table-column>
      <el-table-column align="center" prop="costType" label="费用类型"> </el-table-column>
      <el-table-column align="center" prop="minePackageNumber" label="minePackageNumber"> </el-table-column>
      <el-table-column align="center" prop="minePackage" label="minePackage"> </el-table-column>
      <el-table-column align="center" prop="costItemTypeNumber" label="费用科目编码"> </el-table-column>
      <el-table-column align="center" prop="costItem" label="费用科目名称"> </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'RoleCostSubjectControl',

  data() {
    return {
      total: 1,
      pageSize: 10,
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
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
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
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.getTableData()
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

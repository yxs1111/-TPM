<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-date-picker v-model="filterObj.custom" type="month" placeholder="请选择">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>

      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG">查询</el-button>
        <div class="TpmButtonBG">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>

      <div class="TpmButtonBG">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="150" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="MinePackage" />
      <el-table-column width="250" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="220" align="center" prop="productName" label="SKU" />
      <el-table-column width="240" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column width="220" align="center" prop="planSales" label="V1计划销量（CTN）" />
      <el-table-column width="220" align="center" prop="planPriceAve" label="V1计划均价（RMB/Tin）" />
      <el-table-column width="220" align="center" prop="planCost" label="V1计划费用（RMB）" />
      <el-table-column width="220" align="center" prop="forecastSales" label="V2预测销量（CTN）" />
      <el-table-column width="220" align="center" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）" />
      <el-table-column width="220" align="center" prop="adjustedCost" label="V2调整后费用（RMB）" />
      <el-table-column width="160" align="center" prop="avePriceDifference" label="均价差值（%）" />
      <el-table-column width="160" align="center" prop="salesDifference" label="销量差值（%）" />
      <el-table-column width="120" align="center" prop="costDifference" label="费用差值" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
            <div slot="content" v-html="getTip(row)">
            </div>
            <div class="statusWrap">
              <img src="@/assets/images/success.png" alt="" v-if="row.judgmentType=='Pass'">
              <img src="@/assets/images/warning.png" alt="" v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1">
              <img src="@/assets/images/selectError.png" alt="" v-if="row.judgmentType=='Error'">
              <span class="judgmentText">{{row.judgmentType}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
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
  name: 'V2AllApproval',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        sku: '',
        month: '',
      },
      tableLoading: '',
      categoryArr: [{ label: '选项一', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    //this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData = []
      API.getPageMdBrand({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    search() {
      console.log('hh')
      // this.getTableData()
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

<style lang="scss" scoped>
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .priceLevel {
      width: 88px;
      height: 34px;
      line-height: 34px;
      border-radius: 17px;
      background: #f2e9ea;
      color: #e87071 !important;
      text-align: center;
    }
    .priceCenter {
      background: #ebfbf8;
      color: #38d7b7 !important;
    }
    .priceLow {
      background: #e1edf4;
      color: #4192d3 !important;
    }
    .TotalNum {
      font-weight: bold;
      color: #ff8912;
    }
  }
}
</style>

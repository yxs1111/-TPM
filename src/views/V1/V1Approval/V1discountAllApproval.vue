<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <!-- <el-date-picker v-model="filterObj.custom" type="month" placeholder="请选择" /> -->
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item" :value="item" />
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
          <el-select v-model="filterObj.productCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in skuArr" :key="item.productCode+index" :label="item.productEsName" :value="item.productCode" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="getTableData">查询</el-button>
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
    <el-table :data="tableData"  border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" prop="number" label="CPID" fixed> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="活动月"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="费用类型"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="费用类型"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="客户系统名称"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="品牌"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="SKU"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="价格档位（RMB/Tin）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="priceLevel" :class="scope.$index%3===0?'':scope.$index%3===1?'priceCenter':'priceLow'">{{scope.row.number}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="total" label="价格档位销量总计（CTN）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="TotalNum">{{scope.row.total.toFixed(1)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="经销商"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="区域"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="系统拆分销量（CTN）"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="调整后销量（CTN）"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="销量差值（%）"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="机制类型"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="机制名称"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="活动开始时间"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="活动结束时间"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="系统判定"> </el-table-column>
      <el-table-column width="120" align="center" prop="name" label="申请人备注"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="Package Owner审批意见"> </el-table-column>
      <el-table-column width="220" align="center" prop="name" label="Finance审批意见"> </el-table-column>
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
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V1discountAllApproval',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        sku: '',
        month: '',
      },
      categoryArr: [],
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
      channelArr: [],
      skuArr: [],
      customerArr: [],
      distributorArr: [],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.getChannel()
    this.getSKU()
    this.getDistributorList()
    this.getTableData()
  },
  computed: {},
  methods: {
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then(res => {
        if (res.code === 1000) {
          this.channelArr = res.data
        }
      }).catch()
    },
    getSKU() {
      selectAPI.querySkuSelect().then(res => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      }).catch()
    },
    // 客户
    getCustomerList() {
      this.filterObj.customerCode = ''
      selectAPI.queryCustomerList({
        channelCode: this.filterObj.channelCode
      }).then(res => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      }).catch()
    },
    // 经销商
    getDistributorList() {
      selectAPI.queryDistributorList().then(res => {
        if (res.code === 1000) {
          this.distributorArr = res.data
        }
      }).catch()
    },
    //获取表格数据
    getTableData() {
      this.tableData = []
      // this.tableLoading = true
      // this.tableData = []
      // API.getPageMdBrand({
      //   pageNum: this.pageNum, //当前页
      //   pageSize: this.pageSize, //每页条数
      // })
      //   .then((response) => {
      //     this.tableLoading = false
      //     this.tableData = response.data.records
      //     this.pageNum = response.data.pageNum
      //     this.pageSize = response.data.pageSize
      //     this.total = response.data.total
      //   })
      //   .catch((error) => {})
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

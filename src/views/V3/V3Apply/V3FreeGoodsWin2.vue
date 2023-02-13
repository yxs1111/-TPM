<!--
 * @Description: V3FreeGoodsWin2
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2023-02-11 16:17:44
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCsName" :label="item.channelCsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptions" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed>
        <template v-slot:header>
          <div>CPID<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cpId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月">
        <template v-slot:header>
          <div>活动月<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.yearAndMonth }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型">
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package">
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目">
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelName" label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称">
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="supplierName" label="品牌">
        <template v-slot:header>
          <div>品牌<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.brandName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="supplierName" label="SKU">
        <template v-slot:header>
          <div>SKU<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="onePlanCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle">KA+Brand</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.onePlanCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="adjustedTwoEstimateUnitCost" label="V2预估单位费用(RMB/Tin)">
        <template v-slot:header>
          <div>V2预估单位费用(RMB/Tin)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedTwoEstimateUnitCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="adjustedTwoEstimateNum" label="V2预估用量(Tin)">
        <template v-slot:header>
          <div>V2预估用量(Tin)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedTwoEstimateNum) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="adjustedTwoEstimateCost" label="V2预估费用(RMB)">
        <template v-slot:header>
          <div>V2预估费用(RMB)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedTwoEstimateCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="actualThreeEstimateUnitCost" label="V3实际单位费用(RMB/Tin)">
        <template v-slot:header>
          <div>V3实际单位费用(RMB/Tin)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.actualThreeEstimateUnitCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="actualThreeEstimateNum" label="V3实际用量(Tin)">
        <template v-slot:header>
          <div>V3实际用量(Tin)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.actualThreeEstimateNum) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="actualThreeEstimateCost" label="V3实际费用">
        <template v-slot:header>
          <div>V3实际费用<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.actualThreeEstimateCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costDept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costDept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costWriteoffMethod" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costWriteoffMethod }}
          </div>
        </template>
      </el-table-column>
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
import {
  getDefaultPermissions,
  getHeightHaveTab,
  messageObj,
  downloadFile,
  messageMap,
  formatThousandNum,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V2/FreeGoods'
export default {
  name: 'V3FreeGoodsWin2',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        customerName: '',
        productName: '',
        month: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      skuOptions: [],
      maxheight: getHeightHaveTab(),
      mainId: '',
      usernameLocal: '',
      messageMap: messageMap(),
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    this.getAllMonth()
    this.getQuerySkuSelect()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getV3Page({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          productName: this.filterObj.productName,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          // channelArr 只取channelCode为NKA、EC、RKA的数据
          this.channelArr = this.channelArr.filter(
            (item) => item.channelCode === 'NKA' || item.channelCode === 'EC'
          )
        }
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    getQuerySkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuOptions = res.data
      })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
      return formatThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.downV3Excel({
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          productName: this.filterObj.productName,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_Free Goods-Win2_${this.filterObj.channelCode}_V3_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
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
.tooltip {
  border-radius: 10px;
}
.Tip {
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  margin: 3px 0;
}
.tip {
  color: #eb4f48;
  font-size: 14px;
  margin-bottom: 10px;
}
.tipStar {
  font-size: 12px;
  color: #eb4f48;
}
</style>

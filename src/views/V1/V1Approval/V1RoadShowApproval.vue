<!--
 * @Description: V1RoadShowApproval
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-06-27 17:12:37
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
            <el-option v-for="(item) in ['NKA', 'EC']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli" v-if='this.filterObj.channelCode !== "EC"'>
          <span class="SelectliTitle">大区:</span>
          <el-select v-model="filterObj.zoneCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in largeAreaDialogList" :key="index" :label="item.name" :value="item.nameAbridge" />
          </el-select>
        </div>
        <div class="Selectli" v-if='this.filterObj.channelCode !== "EC"'>
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.nameAbridge" />
          </el-select>
        </div>
        <div class="Selectli" v-if='this.filterObj.channelCode !== "EC"'>
          <span class="SelectliTitle">活动类型:</span>
          <el-select v-model="filterObj.item" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in regionArr" :key="index" :label="item.supplierName" :value="item.item" />
          </el-select>
        </div>
        <div class="Selectli" v-if='this.filterObj.channelCode !== "EC"'>
          <span class="SelectliTitle">Sub_item:</span>
          <el-select v-model="filterObj.subItem" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['场地费', '执行费', 'POSM费用']" :key="index" :label="item.item" :value="item" />
          </el-select>
        </div>
        <!-- <div class="Selectli">
          <span class="SelectliTitle">活动类型:</span>
          <el-select v-model="filterObj.activityType" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in activityList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div> -->
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table v-if='this.filterObj.channelCode == "NKA" || this.filterObj.channelCode == ""' :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
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
      <el-table-column width="120" align="center" prop="channelCode" label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelCode }}
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
      <el-table-column width="220" align="center" prop="zoneName" label="大区">
        <template v-slot:header>
          <div>大区<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.zoneName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="regionName" label="区域">
        <template v-slot:header>
          <div>区域<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.regionName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="activityType" label="活动类型">
        <template v-slot:header>
          <div>活动类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.activityType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="subItem" label="Sub_item">
        <template v-slot:header>
          <div>Sub_item<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.subItem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planPrice" label="V1计划单价(RMB/场)">
        <template v-slot:header>
          <div>
            V1计划单价(RMB/场)
            <br>
            <span class="subTitle">KA+Region+业务细项+Sub_item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.planPrice) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planVol" label="V1计划场次(场)">
        <template v-slot:header>
          <div>
            V1计划场次(场)
            <br>
            <span class="subTitle">KA+Region+业务细项+Sub_item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.planVol) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br>
            <span class="subTitle">KA+Region+业务细项+Sub_item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.planCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="dept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.dept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="cancelCost" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cancelCost }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-if='this.filterObj.channelCode == "EC"' :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
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
      <el-table-column width="120" align="center" prop="channelCode" label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelCode }}
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
      <el-table-column width="220" align="center" prop="brandName" label="品牌">
        <template v-slot:header>
          <div>品牌<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.brandName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="activityType" label="业务细项">
        <template v-slot:header>
          <div>业务细项<br><span class="subTitle">KA+Brand+Item</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.activityType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br>
            <span class="subTitle">KA+Brand+Item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.planCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="dept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.dept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="cancelCost" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cancelCost }}
          </div>
        </template>
      </el-table-column>
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
import {
  getDefaultPermissions,
  getHeightHaveTab,
  messageObj,
  downloadFile,
  formatThousandNum
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V1/RoadShow'
export default {
  name: 'V1RoadShow',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        customerCode: '',
        month: '',
        supplierCode: '',
        regionCode: '',
        zoneCode: '',
        activityType: '',
        item: '',
        subItem: '',
        subCode: ''
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      RegionList: [],
      regionArr: [],
      largeAreaDialogList: [],
      supplierList: [],
      activityList: [],
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerCode = ''
      this.getCustomerList()
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getChannel()
    this.getAllMonth()
    this.getSupplierList()
    this.getRegionList()
    this.getBrandList()
    this.getAreaList()
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
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          supplierCode: this.filterObj.supplierCode,
          zoneCode: this.filterObj.zoneCode,
          regionCode: this.filterObj.regionCode,
          activityType: this.filterObj.item,
          subItem: this.filterObj.subItem
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
          this.getCustomerList()
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
    // 获取大区数据
    getAreaList() {
      selectAPI.getLargeAreaList({ parentCode: '' }).then((res) => {
        if (res.code === 1000) {
          this.largeAreaDialogList = res.data
        }
      })
    },
    // 活动类型
    getBrandList() {
      selectAPI.getECMItemList({ minePackage: 'Roadshow' }).then((res) => {
        if (res.code === 1000) {
          this.regionArr = res.data
        }
      })
    },
    getRegionList() {
      selectAPI.getRegionList({}).then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getSupplierList() {
      selectAPI.getSupplierList().then((res) => {
        if (res.code === 1000) {
          this.supplierList = res.data
        }
      })
    },
    // 千分位分隔符+两位小数
    FormatNum(num) {
      return formatThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.downExcel({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          menu: 'export', //导出常量 固定传这个
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_RoadShow_${this.filterObj.channelCode}_V1_审批.xlsx`
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

<style lang="scss">
.el-table {
  .el-table__fixed {
    height:auto !important;
    bottom:17px !important;
  }
}
.el-table__fixed-body-wrapper {
  bottom: 5px !important;
}
</style>

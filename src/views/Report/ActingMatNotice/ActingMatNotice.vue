<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyyMM">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelName" filterable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <!-- <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="item,index in skuList" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div> -->
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <!-- <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div> -->
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="../../../assets/images/downloadIcon.png" alt="">
          <span class="text">下载报表</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" ref="multipleTable" border max-height="600" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange" style="width: 100%">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column width="450" fixed="left" align="center" prop="cpId" label="通知函代垫编号" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="实际发生月" />
      <el-table-column width="250" align="center" prop="deptCode" label="部门代码" />
      <el-table-column width="150" align="center" prop="distributorMdmCode" label="经销商编码" />
      <el-table-column width="280" align="center" prop="distributorName" label="经销商名称" />
      <el-table-column width="150" align="center" prop="zoneName" label="大区" />
      <el-table-column width="150" align="center" prop="regionName" label="区域" />
      <el-table-column width="150" align="center" prop="cityName" label="城市" />
      <el-table-column width="150" align="center" prop="channelName" label="渠道" />
      <el-table-column width="150" align="center" prop="customerGroupName" label="客户组" />
      <el-table-column width="150" align="center" prop="customerName" label="客户名称" />
      <el-table-column width="150" align="center" prop="mechanismType" label="活动类型" />
      <el-table-column width="150" align="center" prop="mechanismName" label="活动机制" />
      <el-table-column width="250" align="center" prop="productName" label="活动SKU" />
      <el-table-column width="150" align="center" prop="brandName" label="产品线" />
      <el-table-column width="150" align="center" prop="priceGearAmount" label="促销价格" />
      <el-table-column width="280" align="center" prop="adjustedVol" label="预计活动销量（箱）" />
      <el-table-column width="150" align="center" prop="adjustedAmount" label="申请额度（元）" />
      <el-table-column width="150" align="center" prop="activityDateStart" label="活动开始日期" />
      <el-table-column width="150" align="center" prop="activityDateEnd" label="活动结束日期" />
      <el-table-column width="280" align="center" prop="costItemName" label="费用项目" />
      <el-table-column width="150" align="center" prop="glAccount" label="GL Account" />
      <el-table-column width="280" align="center" prop="wbsCode" label="WBS CODE" />
      <el-table-column width="280" align="center" prop="ioCode" label="IO Code" />
      <el-table-column width="150" align="center" prop="remark" label="备注" />
    </el-table>
    <el-table :data="ALLtableData" id="outTable" ref="multipleTable" border max-height="600" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange" style="width: 100%; display: none;">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column width="450" align="center" prop="cpId" label="通知函代垫编号" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="实际发生月" />
      <el-table-column width="250" align="center" prop="deptCode" label="部门代码" />
      <el-table-column width="150" align="center" prop="distributorMdmCode" label="经销商编码" />
      <el-table-column width="280" align="center" prop="distributorName" label="经销商名称" />
      <el-table-column width="150" align="center" prop="zoneName" label="大区" />
      <el-table-column width="150" align="center" prop="regionName" label="区域" />
      <el-table-column width="150" align="center" prop="cityName" label="城市" />
      <el-table-column width="150" align="center" prop="channelName" label="渠道" />
      <el-table-column width="150" align="center" prop="customerGroupName" label="客户组" />
      <el-table-column width="150" align="center" prop="customerName" label="客户名称" />
      <el-table-column width="150" align="center" prop="mechanismType" label="活动类型" />
      <el-table-column width="150" align="center" prop="mechanismName" label="活动机制" />
      <el-table-column width="250" align="center" prop="productName" label="活动SKU" />
      <el-table-column width="150" align="center" prop="brandName" label="产品线" />
      <el-table-column width="150" align="center" prop="priceGearAmount" label="促销价格" />
      <el-table-column width="280" align="center" prop="adjustedVol" label="预计活动销量（箱）" />
      <el-table-column width="150" align="center" prop="adjustedAmount" label="申请额度（元）" />
      <el-table-column width="150" align="center" prop="activityDateStart" label="活动开始日期" />
      <el-table-column width="150" align="center" prop="activityDateEnd" label="活动结束日期" />
      <el-table-column width="280" align="center" prop="costItemName" label="费用项目" />
      <el-table-column width="150" align="center" prop="glAccount" label="GL Account" />
      <el-table-column width="280" align="center" prop="wbsCode" label="WBS CODE" />
      <el-table-column width="280" align="center" prop="ioCode" label="IO Code" />
      <el-table-column width="150" align="center" prop="remark" label="备注" />
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
import { getDefaultPermissions, FormateThousandNum } from '@/utils'
import API from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'ActingMatNotice',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '202109',
        channelName: '',
        customerName: '',
        distributorName: '',
        regionName: '',
        brandName: '',
        productName: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ChannelList: [],
      checkArr: [], //批量删除,存放选中
      ALLtableData: [], //批量删除,存放选中
    }
  },
  computed: {},
  mounted() {
    this.getChannelList()
  },
  watch: {},
  methods: {
    // 获取表格数据
    getTableData() {
      if (this.filterObj.yearAndMonth == null) {
        this.$message.info('请选择年月')
        this.tableData = []
      } else {
        API.getAdvanceNoticeReport({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.yearAndMonth,
          channelName: this.filterObj.channelName,
          // customerName: this.filterObj.customerName,
          // distributorName: this.filterObj.distributorName,
          // regionName: this.filterObj.regionName,
          // brandName: this.filterObj.brandName,
          // productName: this.filterObj.productName,
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
    },
    exportExcel() {
      API.getAdvanceNoticeReport({
        pageNum: this.pageNum, // 当前页
        pageSize: this.total, // 每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        channelName: this.filterObj.channelName,
      }).then((response) => {
        this.ALLtableData = response.data.records
        this.$message.success('请稍等，正在准备下载')
        setTimeout(function () {
          let wb = XLSX.utils.table_to_book(document.querySelector('#outTable'))
          let wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array',
          })
          try {
            FileSaver.saveAs(
              new Blob([wbout], { type: 'application/octet-stream' }),
              '代垫通知报表.xlsx'
            )
          } catch (e) {
            if (typeof console !== 'undefined') console.log(e, wbout)
          }
          return wbout
        }, 5000)
      })
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        this.ChannelList = res.data
        this.filterObj.channelName = this.ChannelList[0].channelCode
        this.getTableData()
      })
    },
    search() {
      this.pageNum = 1
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

<style lang="scss" scoped>
.app-container {
  .checkBoxWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .checkBox {
      display: flex;
      align-items: center;
    }
    .checkBoxTitle {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #4d4d4d;
      margin-right: 20px;
    }
    .my-search {
      margin-left: 30px;
    }
  }
  .tableContentWrap {
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
  }
  .TopBar {
    display: flex;
    align-items: center;
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
  }
  .filstColumn {
    text-align: center;
  }
  .NumWrap {
    text-align: right;
  }
}
.message {
  color: #eb4f48;
  text-align: center;
  margin: 10px 0;
  white-space: normal;
}
.warningWrap {
  width: 100%;
  height: 100px;
  overflow-y: scroll;
}
</style>

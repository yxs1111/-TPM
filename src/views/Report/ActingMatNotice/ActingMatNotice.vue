<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli" style="margin-left: 23px;">
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
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">产品线:</span>
          <el-select v-model="filterObj.brandName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动SKU:</span>
          <el-select v-model="filterObj.productName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptions" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
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
    <el-table :data="tableData" ref="multipleTable" border :max-height="maxheight" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
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
      <el-table-column v-slot={row} width="150" align="center" prop="activityDateStart" label="活动开始日期">
        {{ row.activityDateStart ? row.activityDateStart.substring(0, 10) : '' }}
      </el-table-column>
      <el-table-column v-slot={row} width="150" align="center" prop="activityDateEnd" label="活动结束日期">
        {{ row.activityDateEnd ? row.activityDateEnd.substring(0, 10) : '' }}
      </el-table-column>
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
import {
  getDefaultPermissions,
  FormateThousandNum,
  getHeight,
  getCurrentMonth,
} from '@/utils'
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
        yearAndMonth: '',
        channelName: '',
        customerName: '',
        customerIndex: '',
        customerMdmCode: '',
        distributorName: '',
        regionName: '',
        brandName: '',
        productName: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ChannelList: [],
      skuOptions: [],
      customerArr: [],
      distributorArr: [],
      RegionList: [],
      BrandList: [],
      checkArr: [], //批量删除,存放选中
      ALLtableData: [], //批量删除,存放选中
      maxheight: getHeight(),
    }
  },
  computed: {},
  mounted() {
    const yearAndMonth = getCurrentMonth()
    this.filterObj.yearAndMonth = yearAndMonth[0]
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getChannelList()
    this.getQuerySkuSelect()
    this.getDistributorList()
    this.getCustomerList()
    this.getRegionList()
    this.getBrandList()
  },
  watch: {
    'filterObj.channelName'() {
      this.filterObj.customerName = ''
      this.filterObj.customerIndex = ''
      this.filterObj.distributorName = ''
      this.filterObj.regionName = ''
      this.getCustomerList()
    },
    'filterObj.customerName'() {
      const customerObj= this.customerArr.find(item=>{
        return item.customerCsName==this.filterObj.customerName
      })
      this.filterObj.customerMdmCode=customerObj.customerMdmCode
      this.filterObj.distributorName = ''
      this.getDistributorList()
    },
    'filterObj.distributorName'() {
      this.filterObj.regionName = ''
      this.getRegionList()
    },
  },
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
          customerName: this.filterObj.customerName,
          distributorName: this.filterObj.distributorName,
          regionName: this.filterObj.regionName,
          brandName: this.filterObj.brandName,
          productName: this.filterObj.productName,
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        this.ChannelList = res.data
        this.filterObj.channelName = this.ChannelList[0].channelCode
        this.getTableData()
      })
    },
    // 经销商
    getDistributorList() {
      selectAPI
        .queryDistributorList({
          customerMdmCode: this.filterObj.customerMdmCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
        .catch()
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelName,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    getQuerySkuSelect() {
      selectAPI
        .querySkuSelect()
        .then((res) => {
          this.skuOptions = res.data
        })
        .catch()
    },
    getRegionList() {
      selectAPI
        .getRegionList({
          distributorName: this.filterObj.distributorName,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.RegionList = res.data
          }
        })
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //下载报表
    exportExcel() {
      API.exportNoticeReport({
        yearAndMonth: this.filterObj.yearAndMonth,
        channelName: this.filterObj.channelName,
        customerName: this.filterObj.customerName,
        distributorName: this.filterObj.distributorName,
        regionName: this.filterObj.regionName,
        brandName: this.filterObj.brandName,
        productName: this.filterObj.productName,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        this.downloadFile(res, '代垫通知报表-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    //下载文件
    downloadFile(res, fileName) {
      let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      if (!fileName) {
        fileName = res.headers['content-disposition'].split('filename=').pop()
      }
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      }
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

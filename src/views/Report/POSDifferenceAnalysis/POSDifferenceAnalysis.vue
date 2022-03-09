<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">CPID:</span>
          <el-input v-model="filterObj.cpId" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyyMM">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine package:</span>
          <el-select v-model="filterObj.MinePackage" placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.id" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelName" filterable clearable placeholder="请选择">
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
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.brandName" clearable  filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData"  :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="400" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="280" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="200" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="180" align="center" prop="productName" label="SKU" />
      <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="220" align="center" prop="regionName" label="区域" />
      <el-table-column v-slot="{row}" width="220" align="right" prop="planSales" label="V1计划销量（CTN）">
        {{ FormateNum((row.planSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planPriceAve" label="V1计划均价（RMB/Tin）">
        {{ FormateNum((row.planPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planCost" label="V1计划费用（RMB）">
        {{ FormateNum((row.planCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="forecastSales" label="V2预测销量（CTN）">
        {{ FormateNum((row.forecastSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）">
        {{ FormateNum((row.adjustedPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
        {{ FormateNum((row.adjustedCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualSales" label="V3实际销量（CTN）">
        {{ FormateNum((row.actualSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualSalesTin" label="V3实际销量(TIN)">
        {{ FormateNum((row.actualSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationPriceAve" label="V3谈判前均价（RMB/Tin）">
        {{ FormateNum((row.beforeNegotiationPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationCost" label="V3谈判前费用（RMB）">
        {{ FormateNum((row.beforeNegotiationCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationPriceAve" label="V3谈判后均价（RMB/Tin）">
        {{ FormateNum((row.afterNegotiationPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationCost" label="V3谈判后费用（RMB）">
        {{ FormateNum((row.afterNegotiationCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column width="160" align="right" prop="avePriceDifference" label="均价差值（%）">
        <template slot-scope="scope">{{ (scope.row.avePriceDifference*1).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column width="160" align="right" prop="salesDifference" label="销量差值（%）">
        <template slot-scope="scope">{{ (scope.row.salesDifference*1).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column v-slot="{row}" width="120" align="right" prop="costDifference" label="费用差值">
        {{ FormateNum((row.costDifference*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column width="240" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <div v-if="row.judgmentType!== null" class="statusWrap">
            <img v-if="row.judgmentType === 'Pass'" src="../../../assets/images/success.png" alt="">
            <img v-if="row.judgmentType.indexOf('Exception') > -1" src="../../../assets/images/warning.png" alt="">
            {{ row.judgmentType }}
          </div>
          <div v-else>{{ row.judgmentType }}</div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
      <el-table-column width="220" align="center" prop="realChannelName" label="MDM最新渠道" />
      <el-table-column width="220" align="center" prop="realRegionName" label="MDM最新区域" />
    </el-table>
    <el-table :data="AllTableData" id="outTable" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%; display: none;">
      <el-table-column align="center" width="400" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="280" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="200" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="180" align="center" prop="productName" label="SKU" />
      <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="220" align="center" prop="regionName" label="区域" />
      <el-table-column v-slot="{row}" width="220" align="right" prop="planSales" label="V1计划销量（CTN）">
        {{ FormateNum((row.planSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planPriceAve" label="V1计划均价（RMB/Tin）">
        {{ FormateNum((row.planPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planCost" label="V1计划费用（RMB）">
        {{ FormateNum((row.planCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="forecastSales" label="V2预测销量（CTN）">
        {{ FormateNum((row.forecastSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）">
        {{ FormateNum((row.adjustedPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
        {{ FormateNum((row.adjustedCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualSales" label="V3实际销量（CTN）">
        {{ FormateNum((row.actualSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualSalesTin" label="V3实际销量(TIN)">
        {{ FormateNum((row.actualSales*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationPriceAve" label="V3谈判前均价（RMB/Tin）">
        {{ FormateNum((row.beforeNegotiationPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationCost" label="V3谈判前费用（RMB）">
        {{ FormateNum((row.beforeNegotiationCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationPriceAve" label="V3谈判后均价（RMB/Tin）">
        {{ FormateNum((row.afterNegotiationPriceAve*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationCost" label="V3谈判后费用（RMB）">
        {{ FormateNum((row.afterNegotiationCost*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column width="160" align="right" prop="avePriceDifference" label="均价差值（%）">
        <template slot-scope="scope">{{ (scope.row.avePriceDifference*1).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column width="160" align="right" prop="salesDifference" label="销量差值（%）">
        <template slot-scope="scope">{{ (scope.row.salesDifference*1).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column v-slot="{row}" width="120" align="right" prop="costDifference" label="费用差值">
        {{ FormateNum((row.costDifference*1).toFixed(2)) }}
      </el-table-column>
      <el-table-column width="240" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <div v-if="row.judgmentType!== null" class="statusWrap">
            <img v-if="row.judgmentType === 'Pass'" src="../../../assets/images/success.png" alt="">
            <img v-if="row.judgmentType.indexOf('Exception') > -1" src="../../../assets/images/warning.png" alt="">
            {{ row.judgmentType }}
          </div>
          <div v-else>{{ row.judgmentType }}</div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
      <el-table-column width="220" align="center" prop="realChannelName" label="MDM最新渠道" />
      <el-table-column width="220" align="center" prop="realRegionName" label="MDM最新区域" />
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
  messageObj,
  s2ab
} from '@/utils'
import API from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXStyle from 'xlsx-style'
export default {
  name: 'POSDifferenceAnalysis',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        cpId: '',
        channelName: '',
        customerName: '',
        customerIndex: '',
        customerMdmCode: '',
        distributorName: '',
        regionName: '',
        brandName: '',
        productName: '',
        minePackageName: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      AllTableData: [],
      ChannelList: [],
      MinePackageList: [],
      skuOptions: [],
      customerArr: [],
      distributorArr: [],
      RegionList: [],
      BrandList: [],
      checkArr: [], //批量删除,存放选中
      maxheight: getHeight(),
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
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
    this.getMinePackage()
    this.getTableData()
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
      const customerObj = this.customerArr.find((item) => {
        return item.customerCsName == this.filterObj.customerName
      })
      this.filterObj.customerMdmCode = customerObj.customerMdmCode
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
      this.tableData = []
      API.getMonthlyAnalysis({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          cpId: this.filterObj.cpId === ''
              ? null
              : this.filterObj.cpId,
          channelName:
            this.filterObj.channelName === ''
              ? null
              : this.filterObj.channelName,
          customerName:
            this.filterObj.customerName === ''
              ? null
              : this.filterObj.customerName,
          distributorName:
            this.filterObj.distributorName === ''
              ? null
              : this.filterObj.distributorName,
          brandName:
            this.filterObj.brandName === '' ? null : this.filterObj.brandName,
          minePackageName:
            this.filterObj.minePackageName === ''
              ? null
              : this.filterObj.minePackageName,
          yearAndMonth: this.filterObj.yearAndMonth,
          regionName:
            this.filterObj.regionName === '' ? null : this.filterObj.regionName,
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          this.getAllTableData()
        })
    },
    getAllTableData() {
      this.AllTableData=[]
      API.getMonthlyAnalysisExport({
        cpId: this.filterObj.cpId === ''
              ? null
              : this.filterObj.cpId,
          channelName:
            this.filterObj.channelName === ''
              ? null
              : this.filterObj.channelName,
          customerName:
            this.filterObj.customerName === ''
              ? null
              : this.filterObj.customerName,
          distributorName:
            this.filterObj.distributorName === ''
              ? null
              : this.filterObj.distributorName,
          brandName:
            this.filterObj.brandName === '' ? null : this.filterObj.brandName,
          minePackageName:
            this.filterObj.minePackageName === ''
              ? null
              : this.filterObj.minePackageName,
          yearAndMonth: this.filterObj.yearAndMonth,
          regionName:
            this.filterObj.regionName === '' ? null : this.filterObj.regionName,
        }).then((response) => {
          this.AllTableData = response.data
        })
    },

    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        this.ChannelList = res.data
      })
    },
    getMinePackage() {
      selectAPI
        .queryMinePackageSelect({
          parentId: this.filterObj.CostType,
        })
        .then((res) => {
          this.MinePackageList = res.data
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
    // 下载报表
    exportExcel() {
      const fix = document.querySelector('#outTable .el-table__fixed')
      // 创建一个workbook对象
      let wb = XLSX.utils.book_new()
      let ws
      // debugger
      if (fix) {
        //生成 V1 worksheet对象
        ws = XLSX.utils.table_to_sheet(
          document.querySelector('#outTable .el-table__fixed')
        )
      }
      // debugger
      let borderAll = {
        color: { auto: 1 },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
      ws['!cols'] = this.getColumWidth()
      console.log(ws);
      Object.keys(ws).forEach((key) => {
        //这里遍历单元格给单元格对象设置属性,s为控制样式的属性
        if (key.indexOf('!') < 0) {
          ws[key].s = {
            alignment: {
              //对齐方式
              horizontal: 'center', //水平居中
              vertical: 'center', //竖直居中
              wrapText: true, //自动换行
            },
          }
        }
        if (
          key.replace(/[^0-9]/gi, '') === '1' 
        ) {
          ws[key].s = {
            border: borderAll,
            fill: {
              //背景色
              fgColor: { rgb: '4192D3' },
            },
            font: {
              color: { rgb: 'FFFFFFFF' },
            },
            alignment: {
              //对齐方式
              horizontal: 'center', //水平居中
              vertical: 'center', //竖直居中
              wrapText: true, //自动换行
            },
          }
        }
      })
      // this.addRangeBorder(ws['!merges'], ws)
      //把worksheet对象添加进workbook对象，第三个参数是excel中sheet的名字
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      const wbout = XLSXStyle.write(wb, {
        type: 'binary',
        bookType: 'xlsx',
      })
      try {
        FileSaver.saveAs(
          new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
          '月结POS差异分析报表.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    //获取数组宽度列表
    getColumWidth() {
      let ColumWidthList = [{
          wpx: 250,
        }]
      for (let index = 1; index < 50; index++) {

        ColumWidthList.push({
          wpx: 150,
        })
      }
      return ColumWidthList
    },
    //数字向列名转换
    createCellPos(n) {
      var ordA = 'A'.charCodeAt(0) //字母转unicode
      var ordZ = 'Z'.charCodeAt(0)
      var len = ordZ - ordA + 1 // 计算字母长度
      var s = ''
      while (n >= 0) {
        //将输入数字转换成字母
        s = String.fromCharCode((n % len) + ordA) + s
        //每次进行完需要重新floor向下取整，-1是因为 A的unicode是0
        n = Math.floor(n / len) - 1
      }
      return s
    },
    //需要传入列的总数 count default 26
    initColum() {
      //所有列：(客户+1)*4+1
      let columCount=40
      let AllColum=[]
      for (let index = 0; index < columCount; index++) {
        AllColum.push(this.createCellPos(index))
      }
      return AllColum
    },
    addRangeBorder(range, ws) {
      //得到所有列名
      let cols=this.initColum() 
      range.forEach((item) => {
        //添加单元格border样式
        let style = {
          s: {
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            },
          },
        }
        // 处理合并行
        for (let i = item.s.c; i <= item.e.c; i++) {
          ws[`${cols[i]}${Number(item.e.r) + 1}`] =
            ws[`${cols[i]}${Number(item.e.r) + 1}`] || style
          // 处理合并列
          for (let k = item.s.r + 2; k <= item.e.r + 1; k++) {
            ws[cols[i] + k] = ws[cols[k] + item.e.r] || style
          }
        }
      })
      return ws
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
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
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

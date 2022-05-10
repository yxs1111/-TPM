<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <!-- <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" disabled type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM" />
        </div> -->
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
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
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.dim_product" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptions" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" max-height="600" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="150" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="MinePackage" />
      <el-table-column width="250" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="250" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="220" align="center" prop="productName" label="SKU" />
      <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column width="220" v-slot={row} align="right" prop="planSales" label="V1计划销量（CTN）">
        {{FormateNum(row.planSales)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="planPriceAve" label="V1计划均价（RMB/Tin）">
        {{FormateNum(row.planPriceAve)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="planCost" label="V1计划费用（RMB）">
        {{FormateNum(row.planCost)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="forecastSales" label="V2预测销量（CTN）">
        {{FormateNum(row.forecastSales)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）">
        {{FormateNum(row.adjustedPriceAve)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
        {{FormateNum(row.adjustedCost)}}
      </el-table-column>
      <el-table-column width="160"  align="right" prop="avePriceDifference" label="均价差值（%）">
      
      </el-table-column>
      <el-table-column width="160"  align="right" prop="salesDifference" label="销量差值（%）">
     
      </el-table-column>
      <el-table-column width="120" v-slot={row} align="right" prop="costDifference" label="费用差值">
        {{FormateNum(row.costDifference)}}
      </el-table-column>
      <el-table-column width="180" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
            <div slot="content" v-html="getTip(row)" />
            <div class="statusWrap">
              <img v-if="row.judgmentType=='Pass'" src="@/assets/images/success.png" alt="">
              <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1" src="@/assets/images/warning.png" alt="">
              <img v-if="row.judgmentType=='Error'" src="@/assets/images/selectError.png" alt="">
              <span class="judgmentText">{{ row.judgmentType }}</span>
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
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  messageMap,
  FormateThousandNum,
} from '@/utils'
import API from '@/api/V2/V2'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V2discountDiscount',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '202101',
        channelCode: '',
        customerCode: '',
        distributorCode: '',
        regionCode: '',
        dim_product: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      skuOptions: [],
      channelOptions: [],
      customerArr: [],
      distributorArr: [],
      // 导入
      importVisible: false, // 导入弹窗
      ImportData: [],
      RegionList: [],
      uploadFileName: '',
      event: '',
      uploadFile: '',
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      isSelf: 0, //是否是当前审批人
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      isCheck: false, //检测数据按钮显示或隐藏
      mainId: '',
      usernameLocal: '',
      messageMap: messageMap(),
    }
  },
  computed: {},
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerCode = ''
      this.getCustomerList()
    },
    'filterObj.customerCode'() {
      this.filterObj.distributorCode = ''
      this.getDistributorList()
    },
    'filterObj.distributorCode'() {
      this.filterObj.regionCode = ''
      this.getRegionList()
    },
  },
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getQueryChannelSelect()

    // this.getTableData()
    this.getQuerySkuSelect()
    this.getDistributorList()
    this.getCustomerList()
    this.getRegionList()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      // this.tableData = []
      // API.getPage({
      //   pageNum: this.pageNum, // 当前页
      //   pageSize: this.pageSize, // 每页条数
      //   yearAndMonth: this.filterObj.yearAndMonth,
      //   channelCode: this.filterObj.channelCode,
      //   customerCode: this.filterObj.customerCode,
      //   distributorCode: this.filterObj.distributorCode,
      //   regionCode: this.filterObj.regionCode,
      //   productName: this.filterObj.dim_product,
      // }).then((response) => {
      //   if (response.code == 1000) {
      //     this.tableData = response.data.records
      //     if (this.tableData.length) {
      //       this.isSubmit = this.tableData[0].isSubmit
      //       this.mainId = this.tableData[0].mainId
      //       this.infoByMainId()
      //     } else {
      //       this.isSubmit = 1
      //     }

      //     this.pageNum = response.data.pageNum
      //     this.pageSize = response.data.pageSize
      //     this.total = response.data.total
      //   }
      // })
    },
    getTip(row) {
      return `<div class="Tip">${row.judgmentContent}</div>`
    },
    // 通过与审批按钮控制
    infoByMainId() {
      selectAPI
        .infoByMainId({
          mainId: this.mainId,
        })
        .then((res) => {
          if (res.code === 1000) {
            if (
              res.data.version === 'V2' &&
              res.data.assignee === this.usernameLocal
            ) {
              //本人可以提交
              this.isSelf = true
            } else {
              //其他人禁用
              this.isSelf = false
            }
          }
        })
    },
    // 查询列表 --获取活动年月
    getMonth() {
      selectAPI.getMonth({ version: 'V2' }).then((res) => {
        this.filterObj.yearAndMonth = res.data
        // this.getTableData()
      })
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.channelOptions = res.data
          if (!this.$route.query.channelCode) {
            this.filterObj.channelCode = this.channelOptions[0].channelCode
          } else {
            this.filterObj.channelCode = this.$route.query.channelCode
          }
          this.getMonth()
        }
      })
    },
    // 经销商
    getDistributorList() {
      selectAPI
        .queryDistributorList({
          customerCsName: this.filterObj.customerCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
        .catch()
    },
    getRegionList() {
      selectAPI
        .getRegionList({
          distributorName: this.filterObj.distributorCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.RegionList = res.data
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
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出数据
    exportExcel() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.exportExcel({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          distributorCode: this.filterObj.distributorCode,
          regionCode: this.filterObj.regionCode,
          dimProduct: this.filterObj.dim_product,
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V2-' + timestamp + '.xlsx') // 自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    // 下载文件
    downloadFile(res, fileName) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
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
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
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
  .importDialog {
    height: 600px;
  }
}
</style>
<style>
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
</style>


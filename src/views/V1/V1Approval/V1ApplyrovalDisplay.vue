<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
        <div class="SelectBar">
            <div class="Selectli">
                <span class="SelectliTitle">活动月:</span>
                <el-select v-model="filterObj.yearAndMonth" filterable clearable placeholder="请选择">
                    <el-option v-for="(item, index) in monthList" :key="index" :label="item.activityMonth" :value="item.activityMonth" />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">渠道:</span>
                <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
                    <el-option v-for="(item, index) in channelArr" :key="index" :label="item.channelEsName" :value="item.channelCode" />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">客户:</span>
                <!-- <el-date-picker v-model="filterObj.custom" type="month" placeholder="请选择" /> -->
                <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">经销商:</span>
                <el-select v-model="filterObj.distributorCode" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, index) in distributorArr" :key="index" :label="item.distributorName" :value="item.distributorCode"  />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">大区:</span>
                <el-select v-model="filterObj.zoneCode" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, index) in largeAreaDialogList" :key="index" :label="item.name" :value="item.code"  />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">区域:</span>
                <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.code" />
                </el-select>
            </div>
            <div class="Selectli">
                <span class="SelectliTitle">Display item:</span>
                <el-select v-model="filterObj.displayItem" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, index) in skuArr" :key="item.productCode+index" :label="item.productEsName" :value="item.productCode" />
                </el-select>
            </div>
            <div class="OpertionBar">
                <el-button type="primary" class="TpmButtonBG" @click="getTableData()">查询</el-button>
                <div class="TpmButtonBG" @click="exportExcelInfo(filterObj)">
                    <img src="../../../assets/images/export.png" alt="">
                    <span class="text">导出</span>
                </div>
            </div>
        </div>
    </div>
    <!-- 列表 -->
    <el-table :data="tableData" border stripe
                :max-height="maxheight"
                :header-cell-style="HeadTable"
                :row-class-name="tableRowClassName" 
                style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="400" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="zoneName" label="大区" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column width="280" align="center" prop="displayItem" label="Display Item">
        <template v-slot:header>
          <div>
            Display Item
            <br>
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="planCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br>
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="dept" label="费用归属部门" />
      <el-table-column width="120" align="center" prop="cancelCost" label="费用核销方式" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" 
                    :page-sizes="[5, 10, 50, 100]" 
                    :page-size="pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="total"
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  FormateThousandNum,
  getHeightHaveTab,
} from '@/utils'
import API from '@/api/V1/v1.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V1discountDiscount',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        customerCode: '',
        channelCode: '',
        distributorCode: '',
        displayItem: '',
        regionCode:'',
        zoneCode:'',
      },
      monthList: [],
      RegionList: [],
      categoryArr: [],
      tableData: [],
      mainIdLocal: null,
      channelArr: [],
      skuArr: [],
      customerArr: [],
      distributorArr: [],
      largeAreaDialogList:[],
      submitBtn: 1,
      localDate: '',
      btnStatus: true,
      usernameLocal: '',
      isCalculation: false,
      maxheight: getHeightHaveTab(),
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
    this.getAreaList()
    this.getChannel()
    this.getAllMonth()
    this.getSKU()
    this.getRegionList()
    this.getDistributorList()
  },
  methods: {
    // 获取display item 数据
    DisolayItem(){
     
    },
    // 获取大区数据
    getAreaList(){
      selectAPI.getLargeAreaList({parentCode: ''}).then((res) => {
        if (res.code === 1000) {
          this.largeAreaDialogList = res.data
        }
      })
    },
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    // 获取渠道
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          this.getCustomerList()
        }
      })
    },
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getSKU() {
      selectAPI.querySkuSelect().then((res) => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      })
    },
    // 客户
    getCustomerList() {
      this.filterObj.customerCode = ''
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
    },
    // 导出excel
    exportExcelInfo({yearAndMonth,channelCode}) {
      API.excdisplayData({
        yearAndMonth,channelCode
      }).then((response) => {
        const fileName = `${this.localDate}_Price_${this.filterObj.channelCode}_V1_查询.xlsx`
        //   res.data:请求到的二进制数据
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        }) // 1.创建一个blob
        const link = document.createElement('a') // 2.创建一个a链接
        link.download = fileName // 3.设置名称
        link.style.display = 'none' // 4.默认不显示
        link.href = URL.createObjectURL(blob) // 5.设置a链接href
        document.body.appendChild(link) // 6.将a链接dom插入当前html中
        link.click() // 7.点击事件
        URL.revokeObjectURL(link.href) // 8.释放url对象
        document.body.removeChild(link) // 9.移除a链接dom
      })
    },
    // 获取表格数据
    getTableData() {
      API.displayList({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        ...this.filterObj
      }).then((response) => {
          if (response.data.records.length > 0) {
            this.tableData = response.data.records
            this.mainIdLocal = response.data.records[0].mainId
            this.submitBtn = response.data.records[0].isSubmit
            this.isCalculation = response.data.records[0].isCalculation
            this.infoByMainId()
          } else {
            this.tableData = []
            this.mainIdLocal = null
          }
          this.total = response.data.total
        })
    },
    // 通过与审批按钮控制
    infoByMainId() {
      API.infoByMainId({
        mainId: this.mainIdLocal,
      })
        .then((res) => {
          if (res.code === 1000) {
            if (
              res.data.version === 'V1' &&
              res.data.assignee.indexOf(this.usernameLocal) != -1 &&
              this.submitBtn === 0 
            ) {
              this.btnStatus = true
            } else {
              this.btnStatus = false
            }
          } else {
            this.btnStatus = false
          }
        })
        .catch()
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

<style>
.el-icon-my-file {
  background: url('~@/assets/images/selFile.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-file:before {
  content: '\e611';
  font-size: 16px;
}
</style>

<style>
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 0 !important;
    border-bottom: 0 !important;
}
.el-icon-my-down {
  background: url('~@/assets/images/downModel.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-down:before {
  content: '\e611';
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
.el-icon-arrow-left:before{
    content:'上一页';
}
.el-icon-arrow-right:before {
    content: "下一页";
}
.OpertionBar{
    flex: 1;
    padding-right: 15px;
    justify-content: flex-end;
}
::v-deep.my-el-dialog .upload-demo {
  display: flex;
  margin-top: 0px;
}
::v-deep.el-table td {
  padding: 6px 0;
}
::v-deep.el-upload-list__item:first-child {
  margin-top: 0px;
}
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .priceLevel {
      width: 60px;
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

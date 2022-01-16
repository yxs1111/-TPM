<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <!-- <el-date-picker v-model="filterObj.month" multiple  type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker> -->
          <SelectMonth :default-month="filterObj.yearAndMonthList" @multipleMonth="getMultipleMonth" :Disabled="false"/>
          <!-- <el-date-picker v-model="filterObj.month" disabled type="monthrange" format="yyyy-MM" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" /> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.channelCode" multiple placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <el-select v-model="filterObj.customerCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU：</span>
          <el-select v-model="filterObj.productName" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="item,index in skuList" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>

      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item,index in dynamicColumn" :key="index" :label="item.value">{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-button type="primary" class="TpmButtonBG my-search" @click="search">查询</el-button>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Date</span>
      </div>
      <div class="TpmButtonBG">
        <img src="../../../assets/images/downloadIcon.png" alt="">
        <span class="text">下载报表</span>
      </div>
    </div>
    <div class="tableContentWrap">
      <el-table :key="tableKey" :data="tableData" v-if="tableData.length" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName" :cell-style="columnStyle"
        height="550" style="width: 100%">
        <el-table-column width="150" fixed>
          <template slot="header">
            <div class="filstColumn">RMB/tin</div>
          </template>
          <template slot-scope="scope">
            <div class="filstColumn">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="item,key in tableData[0].month" :key="key" align="center" prop="name">
          <template v-slot:header>
            {{ key }}
          </template>
          <template>
            <el-table-column v-for="(CustomerItem,CustomerKey) in item" :key="CustomerKey" align="center" width="250">
              <template v-slot:header>
                {{ CustomerItem.customerName1 }}
              </template>
              <template>
                <el-table-column v-for="(titleItem,index) in tableColumnList" :key="index" align="center" width="250">
                  <template v-slot:header>
                    {{ titleItem.title }}
                  </template>
                  <template>
                    <div class="NumWrap">
                      {{ CustomerItem[titleItem.value] }}{{titleItem.value=='priceExecutionRate1'?'%':titleItem.value=='priceExecutionRate2'?'%':''}}
                    </div>
                  </template>
                </el-table-column>
              </template>

            </el-table-column>
          </template>

        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  getCurrentMonth,
  ReportBgColorMap,
} from '@/utils'
import API from '@/api/report/report.js'
import SelectMonth from '@/components/SelectMonth/SelectMonth.vue'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'AbnormalAnalysisHistoryByChannel',
  components: { SelectMonth },
  directives: { elDragDialog, permission },
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonthList: getCurrentMonth(),
        customerCode: '',
        channelCode: '',
        productName: '',
      },
      permissions: getDefaultPermissions(),
      // 表格列
      tableOption: [
        { label: 'V1' },
        { label: 'V2' },
        { label: 'V3谈判前' },
        { label: 'V3谈判后' },
        { label: '价格执行率1# V3谈判前  VS  V1' },
        { label: '价格执行率1# V3谈判后  VS  V1' },
      ],
      tableData: [],
      channelOptions: [],
      customerArr: [],
      skuList: [],
      checkList: [], // 已选中的列
      tableColumnList: [], // 动态列
      dynamicColumn: [
        { title: 'V1', value: 'v1Avg' },
        { title: 'V2', value: 'v2Avg' },
        { title: 'V3谈判前', value: 'v3AfterAvg' },
        { title: 'V3谈判后', value: 'v3BeforeAvg' },
        {
          title: '价格执行率1# V3谈判前  VS  V1',
          value: 'priceExecutionRate1',
        },
        {
          title: '价格执行率2# V3谈判后  VS  V1',
          value: 'priceExecutionRate2',
        },
      ], // 展示列选项框
      ReportBgColorMap: ReportBgColorMap(), // 动态列背景色
      tableKey: 0, // el-table key
    }
  },
  computed: {},
  watch: {
    // 动态列渲染
    checkList(checkedList) {
      this.tableColumnList = this.dynamicColumn.filter(
        (item) => checkedList.indexOf(item.value) != -1
      )
      this.tableKey++
    },
  },
  mounted() {
    this.checkList = [
      'v1Avg',
      'v2Avg',
      'v3AfterAvg',
      'v3BeforeAvg',
      'priceExecutionRate1',
      'priceExecutionRate2',
    ]
    this.getQueryChannelSelect()
    this.getCustomerList()
    
    
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getTotalReportList({
        yearAndMonthList: this.filterObj.yearAndMonthList,
        customerNameList: this.filterObj.customerCode,
        channelNameList: this.filterObj.channelCode,
        productNameList: this.filterObj.productName,
        // yearAndMonthList: ['202201'],
        // customerNameList: ['孩子王', '沃尔玛'],
        // channelNameList: ['NKA'],
        // productNameList: ['Friso F0 900g'],
        //productNameList: [],
      }).then((response) => {
        let AllObj = response.data
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
        //按SKU,customer拆分
        let allList = []
        for (const key in AllObj) {
          if (AllObj.hasOwnProperty.call(AllObj, key)) {
            //2021 09 year
            const yearObj = AllObj[key]
            let year = key
            for (const customerKey in yearObj) {
              if (yearObj.hasOwnProperty.call(yearObj, customerKey)) {
                const list = yearObj[customerKey]
                let customerName1 = customerKey
                for (let index = 0; index < list.length; index++) {
                  let obj = Object.assign(list[index], { year, customerName1 })
                  allList.push(obj)
                }
              }
            }
          }
        }
        let AllData = {}
        // 按SKU 重新分组
        for (let m = 0; m < allList.length; m++) {
          //根据productEsName 进行分组
          if (!AllData[allList[m].productEsName]) {
            var arr = []
            arr.push(allList[m])
            AllData[allList[m].productEsName] = arr
          } else {
            AllData[allList[m].productEsName].push(allList[m])
          }
        }
        let AllDataList = []
        // 按年月重新分组
        for (const productItem in AllData) {
          if (Object.hasOwnProperty.call(AllData, productItem)) {
            const list = AllData[productItem]
            let yearData = {}
            for (let m = 0; m < list.length; m++) {
              if (!yearData[list[m].year]) {
                var arr = []
                arr.push(list[m])
                yearData[list[m].year] = arr
              } else {
                yearData[list[m].year].push(list[m])
              }
            }
            AllData[productItem] = yearData
            let obj = Object.assign({ name: productItem }, { month: yearData })
            AllDataList.push(obj)
          }
        }
        AllDataList.sort(function (a, b) {
          return b.name.indexOf('Total') - a.name.indexOf('Total')
        })
        this.tableData = AllDataList
      })
    },
    // 获取渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptions = res.data
        this.filterObj.channelCode = [this.channelOptions[0].channelEsName]
        console.log(this.filterObj);
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
            this.filterObj.customerCode = [this.customerArr[0].customerCsName]
            this.getSkuSelect()
          }
        })
    },
    // 获取SKU
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
        this.filterObj.productName = [this.skuList[0].productEsName]
        this.getTableData()
      })
    },
    // 获取子组件传递的多个月份值
    getMultipleMonth(data) {
      this.filterObj.yearAndMonthList = data
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'TotalRow'
      }
    },
    // 表格头样式
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
        return 'headerStyle'
      }
    },
    // 列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 &&
        rowIndex !== 0 &&
        row.name.indexOf('Total') == -1
      ) {
        return 'background:#4192d3;color: #fff'
      }
      if (row.name.indexOf('Total') !== -1) {
        return 'background-color: #f3f7f8 !important;color: #666!important;'
      }
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
</style>
<style>
.headerStyle {
  background-color: #4192d3 !important;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
}
.TotalRow {
  background-color: #f3f7f8 !important;
  color: #666;
  font-size: 14px;
}
</style>


<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <!-- <el-date-picker v-model="filterObj.month" multiple  type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker> -->
          <SelectMonth v-on:multipleMonth="getMultipleMonth" :defaultMonth='filterObj.yearAndMonthList' />
          <!-- <el-date-picker v-model="filterObj.month" disabled type="monthrange" format="yyyy-MM" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" /> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.channelCode" placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelCode" />
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
          <el-select v-model="filterObj.productCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="item,index in skuList" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>

      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.value" v-for="item,index in dynamicColumn" :key="index">{{item.title}}</el-checkbox>
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
      <el-table :data="tableData" :key="tableKey" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName" :cell-style="columnStyle" height="550"
        style="width: 100%">
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
        <!-- <el-table-column align="center" prop="name" label="202010">
          <el-table-column align="center" width="150" prop="name" label="Total">
            <el-table-column v-for="(item, index) in tableOption" width="250" :key="index" :label="item.label" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.tableOption[index].value}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" width="150" prop="name" label="孩子王">
            <el-table-column v-for="(item, index) in tableOption" width="250" :key="index" :label="item.label" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.tableOption[index].value}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column> -->
        <el-table-column align="center" prop="name" v-for="item,key in tableData[0].month" :key="key">
          <template v-slot:header>
            {{ key }}
          </template>
          <template>
            <el-table-column align="center" width="250" v-for="(cvalue,ckey) in item" :key="ckey">
              <template v-slot:header>
                {{ ckey }}
              </template>
              <template>
                <el-table-column align="center" width="250" v-for="(titleItem,index) in tableColumnList" :key="index">
                  <template v-slot:header>
                    {{ titleItem.title }}
                  </template>
                  <template>
                    <div>
                      {{cvalue[titleItem.value]}}
                    </div>
                  </template>
                </el-table-column>
              </template>

            </el-table-column>
          </template>

        </el-table-column>
      </el-table>
    </div>

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
  ReportCheckList,
  dynamicColumn,
  getCurrentMonth,
  ReportBgColorMap,
} from '@/utils'
import API from '@/api/report/report.js'
import SelectMonth from '@/components/SelectMonth/SelectMonth.vue'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'AbnormalAnalysisHistoryByChannel',
  components: { SelectMonth },
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonthList: getCurrentMonth(),
        customerCode: '',
        channelCode: '',
        productCode: '',
        type: '',
        month: '',
        category: '',
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      //表格列
      tableOption: [
        { label: 'V1' },
        { label: 'V2' },
        { label: 'V3谈判前' },
        { label: 'V3谈判后' },
        { label: '价格执行率1# V3谈判前  VS  V1' },
        { label: '价格执行率1# V3谈判后  VS  V1' },
      ],
      tableData: [
        {
          version: 'V1',
          name: 'EC',
          month: {
            202102: {
              total: {
                V1: 'V1',
                V2: 'V2',
                V3BeforeNegotiations: 'V3BeforeNegotiations',
                V3AfterNegotiations: 'V3AfterNegotiations',
                V3BeforeNegotiationsVsV1: 'V3BeforeNegotiationsVsV1',
                V3AfterNegotiationsVsV1: 'V3AfterNegotiationsVsV1',
              },
              孩子王: {
                V1: 'V1',
                V2: 'V2',
                V3BeforeNegotiations: 'V3BeforeNegotiations',
                V3AfterNegotiations: 'V3AfterNegotiations',
                V3BeforeNegotiationsVsV1: 'V3BeforeNegotiationsVsV1',
                V3AfterNegotiationsVsV1: 'V3AfterNegotiationsVsV1',
              },
            },
            202103: {
              total: {
                V1: 'V1',
                V2: 'V2',
                V3BeforeNegotiations: 'V3BeforeNegotiations',
                V3AfterNegotiations: 'V3AfterNegotiations',
                V3BeforeNegotiationsVsV1: 'V3BeforeNegotiationsVsV1',
                V3AfterNegotiationsVsV1: 'V3AfterNegotiationsVsV1',
              },
              孩子王: {
                V1: 'V1',
                V2: 'V2',
                V3BeforeNegotiations: 'V3BeforeNegotiations',
                V3AfterNegotiations: 'V3AfterNegotiations',
                V3BeforeNegotiationsVsV1: 'V3BeforeNegotiationsVsV1',
                V3AfterNegotiationsVsV1: 'V3AfterNegotiationsVsV1',
              },
            },
          },
        },
      ],
      channelOptions: [],
      customerArr: [],
      skuList: [],
      checkList: [], //已选中的列
      tableColumnList: [], //动态列
      dynamicColumn: [
        { title: 'V1', value: 'V1' },
        { title: 'V2', value: 'V2' },
        { title: 'V3谈判前', value: 'V3BeforeNegotiations' },
        { title: 'V3谈判后', value: 'V3AfterNegotiations' },
        {
          title: '价格执行率1# V3谈判前  VS  V1',
          value: 'V3BeforeNegotiationsVsV1',
        },
        {
          title: '价格执行率1# V3谈判后  VS  V1',
          value: 'V3AfterNegotiationsVsV1',
        },
      ], //展示列选项框
      ReportBgColorMap: ReportBgColorMap(), //动态列背景色
      tableKey: 0, //el-table key
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.checkList = [
      'V1',
      'V2',
      'V3BeforeNegotiations',
      'V3AfterNegotiations',
      'V3BeforeNegotiationsVsV1',
      'V3AfterNegotiationsVsV1',
    ]
    this.getQueryChannelSelect()
    this.getCustomerList()
    this.getSkuSelect()
    //  this.getTableData()
  },
  watch: {
    //动态列渲染
    checkList(checkedList) {
      this.tableColumnList = this.dynamicColumn.filter(
        (item) => checkedList.indexOf(item.value) != -1
      )
      this.tableKey++
    },
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getTotalReportList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonthList: this.filterObj.yearAndMonthList,
        customerNameList: this.filterObj.customerCode,
        channelNameList: this.filterObj.channelCode,
        productNameList: this.filterObj.productCode,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 获取渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptions = res.data
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
    //获取SKU
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
      })
    },
    //获取子组件传递的多个月份值
    getMultipleMonth(data) {
      this.filterObj.yearAndMonthList = data
    },
    search() {
      this.pageNum = 1
      this.getTableData()
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
      if (rowIndex == 0) {
        return 'TotalRow'
      }
    },
    //表格头样式
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
        return 'headerStyle'
      }
    },
    //列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex !== 0) {
        return 'background:#4192d3;color: #fff'
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




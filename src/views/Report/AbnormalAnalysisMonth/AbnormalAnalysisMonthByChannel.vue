<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">异常类别：</span>
          <el-select v-model="filterObj.exception" placeholder="请选择">
            <el-option v-for="(item, index) in ['数量','费用']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <SelectMonth v-on:multipleMonth="getMultipleMonth" :defaultMonth='filterObj.month'  />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine package:</span>
          <el-select v-model="filterObj.MinePackage" placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in ['Price Promotion','New User']" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.brandCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
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

      <el-button type="primary" class="TpmButtonBG my-search">查询</el-button>
      <div class="TpmButtonBG">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Date</span>
      </div>
    </div>
    <div class="colorWrap">
      <div class="TpmButtonBGWrap">
        <div class="TpmButtonBG">
          <img src="../../../assets/images/downloadIcon.png" alt="">
          <span class="text">下载报表</span>
        </div>
      </div>
      <div class="colorBar">
        <div class="colorli">
          <div class="color" />
          <span>V1</span>
        </div>
        <div class="colorli">
          <div class="color v2color" />
          <span>V2</span>
        </div>
        <div class="colorli">
          <div class="color v3color" />
          <span>V3</span>
        </div>
      </div>
    </div>
    <div class="tableContentWrap">
      <el-table :data="tableData" :key="tableKey" ref="multipleTable" :header-cell-class-name="headerStyle" :cell-style="columnStyle" style="width: 100%">
        <el-table-column align="center" width="150" fixed="left" prop="name" label="数据维度" />
        <el-table-column align="center" prop="name" v-for="item,key in tableData[0].month" :key="key">
          <template v-slot:header>
            {{ key }}
          </template>
          <template>
            <el-table-column align="center" width="250" v-for="(titleItem,index) in tableColumnList" :key="index">
              <template v-slot:header>
                {{ titleItem.title }}
              </template>
              <template>
                <div>
                  {{item[titleItem.value]}}
                </div>
              </template>
            </el-table-column>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div> -->
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
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import SelectMonth from '@/components/SelectMonth/SelectMonth.vue'
export default {
  name: 'AbnormalAnalysisMonthByChannel',
  directives: { elDragDialog, permission },
  components: { SelectMonth },
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        exception: '',
        month: getCurrentMonth(),
        MinePackage: '',
        regionCode: '',
        brandCode: '',
        productCode: '',
      },
      BrandList: [],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          version: 'V1',
          name: 'EC',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
        {
          version: 'V1',
          name: 'NKA',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
        {
          version: 'V2',
          name: 'EC',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
        {
          version: 'V2',
          name: 'NKA',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
        {
          version: 'V3',
          name: 'EC',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
        {
          version: 'V3',
          name: 'NKA',
          month: {
            202102: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
            202103: {
              PassNum: 'PassNum',
              Exception1Num: 'Exception1Num',
              Exception2Num: 'Exception2Num',
              Exception3Num: 'Exception3Num',
              PassRange: 'PassRange',
              Exception1Range: 'Exception1Range',
              Exception2Range: 'Exception2Range',
              Exception3Range: 'Exception3Range',
            },
          },
        },
      ],
      skuList: [],
      RegionList: [],
      checkList: [], //已选中的列
      tableColumnList: [], //动态列
      dynamicColumn: dynamicColumn(), //展示列选项框
      ReportBgColorMap: ReportBgColorMap(), //动态列背景色
      tableKey: 0, //el-table key
    }
  },
  computed: {},
  mounted() {
    this.checkList=ReportCheckList()
    // this.getTableData()
    this.getSkuSelect()
    this.getRegionList()
    this.getBrandList()
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
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageMdBrand({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
      })
    },
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
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
    //获取子组件传递的多个月份值
    getMultipleMonth(data) {
      this.filterObj.month = data
    },
    search() {
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
    columnStyle({ row, column, rowIndex, columnIndex }) {
      return this.ReportBgColorMap[row.version]
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return 'headerStyle'
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
      white-space: nowrap;
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
  .colorWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .colorBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .colorli {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #4d4d4d;
        display: flex;
        margin-right: 30px;
        align-items: center;
        .color {
          width: 19px;
          height: 9px;
          margin-right: 5px;
          background-color: #fae2e3;
          border: solid 1px #e87071;
        }
        .v2color {
          background-color: #d7f7f1;
          border: solid 1px #38d7b7;
        }
        .v3color {
          background-color: #ffeecc;
          border: solid 1px #ffaa00;
        }
      }
    }
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
.rowStyle1 {
  background-color: #fdf0f1 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
.rowStyle2 {
  background-color: #ebfbf8 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
.rowStyle3 {
  background-color: #fff6e5 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
</style>

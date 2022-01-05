<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">异常类别：</span>
          <el-select v-model="filterObj.exception" placeholder="请选择">
            <el-option v-for="(item, index) in ExceptionList" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker v-model="filterObj.month" type="monthrange" format='yyyy-MM' value-format='yyyy-MM' range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
          </el-date-picker>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.brandCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item" :value="item" />
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
          <el-checkbox label="PassNum">Pass数量</el-checkbox>
          <el-checkbox label="Exception1Num">Exception1数量</el-checkbox>
          <el-checkbox label="Exception2Num">Exception2数量</el-checkbox>
          <el-checkbox label="Exception3Num">Exception3数量 </el-checkbox>
          <el-checkbox label="PassRange">Pass占比</el-checkbox>
          <el-checkbox label="Exception1Range">Exception1占比</el-checkbox>
          <el-checkbox label="Exception2Range">Exception2占比</el-checkbox>
          <el-checkbox label="Exception3Range">Exception3占比 </el-checkbox>
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
      <el-table :data="tableData" ref="multipleTable" border :header-cell-class-name="headerStyle" height="550" :cell-style="columnStyle" style="width: 100%">
        <el-table-column align="center" width="150" fixed="left" prop="name" label="数据维度" />
        <el-table-column align="center" prop="name" label="202010">
          <el-table-column align="center" width="250" v-for="(item) in tableColumnList" :key="item.sortCode">
            <template v-slot:header>
              {{ item.title }}
            </template>
            <template slot-scope="{row}">
              <div>
                {{row[item.value]}}
              </div>
            </template>
          </el-table-column>
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
import { getDefaultPermissions, dynamicColumn, ReportBgColorMap } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'AbnormalAnalysisMonthByChannel',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        exception: '',
        month: '',
        channelCode: '',
        distributorCode: '',
        regionCode: '',
        brandCode: '',
        productCode: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [
        {
          version: 'V1',
          name: 'V1',
          PassNum: 'PassNum',
          Exception1Num: 'Exception1Num',
          Exception2Num: 'Exception2Num',
          Exception3Num: 'Exception3Num',
          PassRange: 'PassRange',
          Exception1Range: 'Exception1Range',
          Exception2Range: 'Exception2Range',
          Exception3Range: 'Exception3Range',
        },
        {
          version: 'V2',
          name: 'V2',
          PassNum: 'PassNum',
          Exception1Num: 'Exception1Num',
          Exception2Num: 'Exception2Num',
          Exception3Num: 'Exception3Num',
          PassRange: 'PassRange',
          Exception1Range: 'Exception1Range',
          Exception2Range: 'Exception2Range',
          Exception3Range: 'Exception3Range',
        },
        {
          version: 'V3',
          name: 'V3',
          PassNum: 'PassNum',
          Exception1Num: 'Exception1Num',
          Exception2Num: 'Exception2Num',
          Exception3Num: 'Exception3Num',
          PassRange: 'PassRange',
          Exception1Range: 'Exception1Range',
          Exception2Range: 'Exception2Range',
          Exception3Range: 'Exception3Range',
        },
      ],
      channelOptions: [],
      skuList: [],
      BrandList: [],
      distributorArr: [],
      RegionList: [],
      checkList: [],
      ExceptionList: [],
      tableColumnList: [], //动态列
      dynamicColumn: dynamicColumn(), //动态列表头
      ReportBgColorMap: ReportBgColorMap(), //动态列表头
    }
  },
  computed: {},
  mounted() {
    this.checkList = [
      'PassNum',
      'Exception1Num',
      'Exception2Num',
      'Exception3Num',
      'PassRange',
      'Exception1Range',
      'Exception2Range',
      'Exception3Range',
    ]
    // this.getTableData()
    this.getQueryChannelSelect()
    this.getDistributorList()
    this.getSkuSelect()
    this.getRegionList()
    this.getBrandList()
  },
  watch: {
    //动态列渲染
    checkList() {
      this.tableColumnList = []
      let list = []
      this.checkList.forEach((item, index) => {
        let obj = {
          title: '',
          value: '',
          sortCode: '',
        }
        obj.title = this.dynamicColumn[item].title
        obj.sortCode = this.dynamicColumn[item].sortCode
        obj.value = item
        list.push(obj)
      })
      list.sort(function (a, b) {
        return a.sortCode - b.sortCode
      })
      this.tableColumnList = list
      //解决每次动态列渲染fixed 错位问题
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
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
    // 获取渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptions = res.data
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
    },
    //获取SKU
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
      })
    },
    //获取Region
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
    //获取 品牌
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
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
</style>

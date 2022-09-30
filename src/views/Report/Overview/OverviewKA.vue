<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同期间:</span>
          <el-date-picker v-model="filterObj.contractDate" type="daterange" value-format="yyyyMMdd" format="yyyyMMdd" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同状态:</span>
          <el-select v-model="filterObj.productName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in contractStatus" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" ref="multipleTable" border :max-height="maxheight" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column width="450" align="center" prop="cpId" label="合同编码" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="客户名称" />
      <el-table-column width="150" align="center" prop="deptCode" label="含税IMK" />
      <el-table-column width="150" align="center" prop="deptName" label="合同期间" />
      <el-table-column width="150" align="center" prop="distributorMdmCode" label="系统生效时间" />
      <el-table-column width="280" align="center" prop="distributorName" label="合同状态" />
      <el-table-column width="150" align="center" prop="zoneName" label="固定值/点数" />
      <el-table-column width="150" align="center" prop="regionName" label="Contract item" />
      <el-table-column width="150" align="center" prop="cityName" label="条件类型" />
      <el-table-column width="150" align="center" prop="channelName" label="费比（%）" />
      <el-table-column width="150" align="center" prop="customerGroupName" label="含税金额（RMB）" />
      <el-table-column width="280" align="center" prop="customerName" label="描述" />
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
  formatThousandNum,
  getHeight,
  getCurrentMonth,
} from '@/utils'
import API from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'OverviewKA',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        customerName: '',
        contractDate: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      customerArr: [],
      contractStatus: ['失效','生效'],
      maxheight: getHeight(),
    }
  },
  computed: {},
  mounted() {
    // const yearAndMonth = getCurrentMonth()
    // this.filterObj.yearAndMonth = yearAndMonth[0]
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getCustomerList()
  },
  watch: {},
  methods: {
    // 获取表格数据
    getTableData() {},
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

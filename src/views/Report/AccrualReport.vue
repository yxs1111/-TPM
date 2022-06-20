<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyyMM">
          </el-date-picker>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" ref="multipleTable" border :max-height="maxheight" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="450" align="center" prop="cpId" label="CPID" />
      <el-table-column width="180" align="center" prop="cpId" label="Legal Entity" />
      <el-table-column width="180" align="center" prop="cpId" label="Expense Type" />
      <el-table-column width="180" align="center" prop="cpId" label="Month(YYYY-MM)" />
      <el-table-column width="180" align="center" prop="cpId" label="GL Account" />
      <el-table-column width="180" align="center" prop="cpId" label="WBS" />
      <el-table-column width="180" align="center" prop="cpId" label="Cost Center" />
      <el-table-column width="180" align="center" prop="cpId" label="Profit Center" />
      <el-table-column width="180" align="center" prop="cpId" label="IO" />
      <el-table-column width="180" align="center" prop="cpId" label="Item Description" />
      <el-table-column width="260" align="center" prop="cpId" label="Amount in CNY (exc. VAT)" />
      <el-table-column width="180" align="center" prop="cpId" label="Vendor Name" />
      <el-table-column width="280" align="center" prop="cpId" label="Event Start Date (mm/dd/yyyy)" />
      <el-table-column width="220" align="center" prop="cpId" label="Purchase Order Number" />
      <el-table-column width="320" align="center" prop="cpId" label="Expected Reversal Date (mm/dd/yyyy)" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  getHeight,
  getCurrentMonth,
} from '@/utils'
import API from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'AccrualReport',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
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
      maxheight: getHeight(),
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
  },
  watch: {},
  methods: {
    // 获取表格数据
    getTableData() {
      if (this.filterObj.yearAndMonth == null) {
        this.$message.info('请选择年月')
        this.tableData = []
      } else {
        API.getSubstituteConfirmReport({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.yearAndMonth,
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //下载报表
    exportData() {
      API.exportSubstituteConfirmReport({
        yearAndMonth: this.filterObj.yearAndMonth,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        this.downloadFile(res, 'Accrual报表-' + timestamp + '.xlsx') //自定义Excel文件名
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

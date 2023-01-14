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
          <el-select v-model="filterObj.channelName" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item, index) in ['NKA']" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">业务细项:</span>
          <el-select v-model="filterObj.mamaItem" clearable filterable placeholder="请选择">
            <el-option label="线上大型" value="线上大型" />
            <el-option label="线上中型" value="线上中型" />
            <el-option label="线上小型" value="线上小型" />
            <el-option label="线下大型" value="线下大型" />
            <el-option label="线下中型" value="线下中型" />
            <el-option label="线下小型" value="线下小型" />
          </el-select>
        </div>
        <div class="OpertionBar">
          <el-button type="primary" class="TpmButtonBG" @click="getTableData()">查询</el-button>
          <div class="TpmButtonBG" @click="exportExcelInfo()">
            <img src="../../../assets/images/export.png" alt="" />
            <span class="text">导出</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :data="tableData" border stripe :max-height="maxheight" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="mamaItem" label="业务细项" />
      <el-table-column width="280" align="center" prop="onePlanCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br />
            <span class="subTitle">KA+业务细项</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.onePlanCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="costDept" label="费用归属部门" />
      <el-table-column width="120" align="center" prop="costWriteoffMethod" label="费用核销方式" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { formatThousandNum, getHeightHaveTab1, getDefaultPermissions } from '@/utils'
import API from '@/api/V1/MMC.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V1MMC',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        customerCode: '',
        channelName: '',
        mamaItem: '',
      },
      monthList: [],
      categoryArr: [],
      tableData: [],
      mainIdLocal: null,
      channelArr: [],
      customerArr: [],
      localDate: '',
      usernameLocal: '',
      isCalculation: false,
      maxheight: getHeightHaveTab1(),
      permissions: getDefaultPermissions(),
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab1()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    this.getAllMonth()
  },
  methods: {
    // 格式化--千位分隔符、两位小数
    formatNum(num) {
      return formatThousandNum(num)
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
        }
      })
    },
    // 客户
    getCustomerList() {
      if (this.filterObj.channelName) {
        selectAPI
          .queryCustomerList({
            channelCode: this.filterObj.channelName,
          })
          .then((res) => {
            if (res.code === 1000) {
              this.customerArr = res.data
            }
          })
      }
    },
    // 导出excel
    exportExcelInfo() {
      if (!this.filterObj.yearAndMonth || !this.filterObj.channelName) {
        return this.$message({
          message: '必选选择年月和渠道！',
          type: 'warning',
        })
      }
      API.excdisplayData({ ...this.filterObj }).then((response) => {
        const fileName = `${this.filterObj.yearAndMonth}_MMC_V1_查询.xlsx`
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
    // 获取表格数据
    getTableData() {
      if (!this.filterObj.yearAndMonth || !this.filterObj.channelName) {
        return this.$message({
          message: '必选选择年月和渠道！',
          type: 'warning',
        })
      }
      API.displayList({
        pageNum: this.pageNum,
        pageSize: this.pageSize, // 每页条数
        ...this.filterObj,
      }).then((response) => {
        if (response.data.records.length > 0) {
          this.tableData = response.data.records
          this.mainIdLocal = response.data.records[0].mainId
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
.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
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
.SelectliTitle {
  width: 70px !important;
}

.el-icon-arrow-left:before {
  content: '上一页';
}
.el-icon-arrow-right:before {
  content: '下一页';
}
.OpertionBar {
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

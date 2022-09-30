<!--
 * @Description: V1POSM定制
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-09-30 13:36:38
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.yearAndMonth" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelName" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="item in channelArr" :key="item.channelCsName" :label="item.channelCsName" :value="item.channelCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select v-model="filterObj.customerName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="520" prop="cpId" label="CPID" fixed>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月">
      </el-table-column>
      <el-table-column width="120" align="center" prop="costType" label="费用类型">
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackage" label="Mine Package">
      </el-table-column>
      <el-table-column width="240" align="center" prop="costItem" label="费用科目">
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelName" label="渠道">
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称">
      </el-table-column>
      <el-table-column width="220" align="center" prop="brandName" label="品牌">
      </el-table-column>
      <el-table-column width="220" align="right" prop="voneCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br />
            <span class="subTitle">KA+Brand</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.voneCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costAscriptionDept" label="费用归属部门">
      </el-table-column>
      <el-table-column width="220" align="center" prop="costWriteoffMethod" label="费用核销方式">
      </el-table-column>
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
  getHeightHaveTab,
  messageObj,
  downloadFile,
  formatThousandNum,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V1/POSM-custom'
export default {
  name: 'V1POSMCustomize',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelName: '',
        customerName: '',
        yearAndMonth: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  watch: {
    'filterObj.channelName'() {
      this.filterObj.customerName = ''
      this.getCustomerList()
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getChannel()
    this.getAllMonth()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (
        this.filterObj.channelName == '' ||
        this.filterObj.yearAndMonth == ''
      ) {
        if (this.filterObj.yearAndMonth == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelName == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          ...this.filterObj,
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
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
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelName: this.filterObj.channelName,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
      return formatThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportExcel({
          ...this.filterObj,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.yearAndMonth}_POSM-定制_${this.filterObj.channelName}_V1_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
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
  },
}
</script>

<style lang="scss" scoped></style>

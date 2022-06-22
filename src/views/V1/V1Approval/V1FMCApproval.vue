<!--
 * @Description: V1 审批 FMC
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-06-22 09:20:11
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in ['NKA']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商:</span>
          <el-select v-model="filterObj.supplierName" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in supplierList" :key="index" :label="item.supplierName" :value="item.supplierName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="520" prop="cpId" label="CPID" fixed >
        <template v-slot:header>
          <div>CPID<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cpId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" >
        <template v-slot:header>
          <div>活动月<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.yearAndMonth }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="costType" label="费用类型" >
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackage" label="Mine Package" >
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackage }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costAccount" label="费用科目" >
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costAccount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelCode" label="渠道" >
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerSystemName" label="客户系统名称" >
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerSystemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="supplierName" label="供应商" >
        <template v-slot:header>
          <div>供应商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.supplierName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="regionName" label="区域" >
        <template v-slot:header>
          <div>区域<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.regionName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="zoneName" label="大区" >
        <template v-slot:header>
          <div>大区<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.zoneName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="v1PlanPrice" label="V1计划单价(RMB/人)">
        <template v-slot:header>
          <div>
            V1计划单价(RMB/人)
            <br>
            <span class="subTitle">KA+供应商+Region</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.v1PlanPrice) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="v1PlanPeopleNum" label="V1计划人数(人)">
        <template v-slot:header>
          <div>
            V1计划人数(人)
            <br>
            <span class="subTitle">KA+供应商+Region</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.v1PlanPeopleNum }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="v1PlanCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br>
            <span class="subTitle">KA+供应商+Region</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ FormatNum(scope.row.v1PlanCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costAscriptionDept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costAscriptionDept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costWriteoffMethod" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costWriteoffMethod }}
          </div>
        </template>
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
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V1/FMC'
export default {
  name: 'V1FMCApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        supplierName: '',
        regionName: '',
        customerCode: '',
        month: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      supplierList: [],
      RegionList: [],
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerCode = ''
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

    this.getRegionList()
    this.getSupplierList()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          customerSystemName: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          yearAndMonth: this.filterObj.month,
          supplierName: this.filterObj.supplierName,
          regionName: this.filterObj.regionName,
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
    // 获取下拉框
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
          channelCode: this.filterObj.channelCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    getSupplierList() {
      selectAPI.getSupplierList().then((res) => {
        if (res.code === 1000) {
          this.supplierList = res.data
        }
      })
    },
    getRegionList() {
      selectAPI.getRegionList({}).then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    //千分位分隔符+两位小数
    FormatNum(num) {
      const money = num * 1
      return money.toLocaleString('zh', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportV1({
          customerSystemName: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          yearAndMonth: this.filterObj.month,
          supplierName: this.filterObj.supplierName,
          regionName: this.filterObj.regionName,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_FMC_${this.filterObj.channelCode}_V1_查询.xlsx`
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

<style lang="scss" scoped>
</style>

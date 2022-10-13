<!--
 * @Description: 
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-06-27 17:11:57
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
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Contract Item:</span>
          <el-select v-model="filterObj.contractItemCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in ContractItemList" :key="index" :label="item.contractItem" :value="item.contractItemCode" />
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
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed >
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
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" >
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" >
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目" >
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemName }}
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
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" >
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="contractItemName" label="Contract Item" >
        <template v-slot:header>
          <div>Contract Item<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.contractItemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V1计划合同点数(%)(kA+Contract Item)">
        <template v-slot:header>
          <div>
            V1计划合同点数(%)
            <br>
            <span class="subTitle">kA+Contract Item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ getPlanCost(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column  width="240" align="right" prop="planSalesAmount" label="V1计划销售额GSV(RMB)">
        <template v-slot:header>
          <div>
            V1计划销售额GSV(RMB)
            <br>
            <span class="subTitle">kA</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ getPlanCost(scope.row.planSalesAmount) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column  width="220" align="right" prop="planCost" label="V1计划合同费用(RMB)">
        <template v-slot:header>
          <div>
            V1计划合同费用(RMB)
            <br>
            <span class="subTitle">kA+Contract Item</span>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ getPlanCost(scope.row.planCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costBelongDept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costBelongDept }}
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
  formatThousandNum
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V1/contract'
export default {
  name: 'V1HIHRebate',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        contractItemCode: '',
        customerCode: '',
        month: '',
      },
      categoryArr: [],
      permissions: getDefaultPermissions(),
      channelArr: [],
      skuArr: [],
      monthList: [],
      ContractItemList: [],
      customerArr: [],
      tableData: [],
      BrandList: [],
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  watch: {
    'filterObj.channelCode'() {
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
    this.getBrandList()
    this.getContractItemList()
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
        API.getPagekA({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          customerCode: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          contractItemCode: this.filterObj.contractItemCode,
          yearAndMonth: this.filterObj.month,
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
    // 获取ContractItem
    getContractItemList() {
      selectAPI.getContractItemList().then((res) => {
        if (res.code === 1000) {
          this.ContractItemList=res.data
        }
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
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    
    //千分位分隔符+两位小数
    getPlanCost(num) {
       return formatThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportKA({
          customerName: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          contractItemCode: this.filterObj.contractItemCode,
          yearAndMonth: this.filterObj.month,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_HIH Rebate_${this.filterObj.channelCode}_V1_查询.xlsx`
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

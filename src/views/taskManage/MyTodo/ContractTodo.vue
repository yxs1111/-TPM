<!--
 * @Description: 合同待办
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-05-12 08:47:49
-->
<template>
  <div class="MainContent" @keyup.enter="pageList">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package:</span>
          <el-select v-model="filterObj.minePackageCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.label" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item) in customerArr" :key="item.customerMdmCode" :label="item.customerCsName" :value="item.customerMdmCode" />
          </el-select>
        </div>

      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>

    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="processType" label="待办项"> </el-table-column>
      <el-table-column align="center" prop="customerName" label="客户名称"> </el-table-column>
      <el-table-column align="center" width="180" prop="name" label="当前节点"> </el-table-column>
      <el-table-column v-slot={row} align="center" width="280" prop="assignee" label="办理人">
        <span v-html="setSplitAssignee(row.assignee)"></span>
      </el-table-column>
      <el-table-column v-slot={row} align="center" width="240" prop="createTime" label="提交时间">
        {{row.createTime?row.createTime.substring(0,10):""}}
      </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" fixed='right' label="查看">
        <template slot-scope="{row}">
          <div class="seeActivity" @click="openFlowDiagram(row)">
            查看流程
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" label="操作" fixed='right'>
        <template slot-scope="{row}">
          <div class="operation" @click="operateProcess(row.minePackageCode,row.name)">
            <svg-icon icon-class="submit_l" class="submit_icon" />
            办理
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!--  流程图  -->
    <div v-if="flowDiagram.visible">
      <flow-diagram svg-type="instance" :business-id="flowDiagram.businessId" :process-id="flowDiagram.processId" :visible.sync="flowDiagram.visible" title="流程图" width="90%" />
    </div>
  </div>
</template>

<script>
import API from '@/api/taskManage/taskManage.js'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getHeightHaveTab,
  setSplitAssignee,
  downloadFile
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import ApproveFlow from '@/components/ApproveFlow'
import FlowDiagram from '@/components/FlowDiagram'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        minePackageCode: '',
        customerMdmCode: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      customerArr: [],
      MinePackageList: [
        {
          label: '客户合同',
          code: 'CUSTOMER-CONTRACT',
        },
        {
          label: '经销商分摊协议',
          code: 'DISTRIBUTOR-CONTRACT',
        },
      ],
      versionList: ['Final'],
      flowDiagram: {
        visible: false,
        activate: false,
        businessId: null,
        processId: null,
      },
      versionNameList: {
        V0: 'V0 - Pre city plan 预拆分',
        V1: 'V1 - City plan 详细拆分',
        V2: 'V2 - Accrual 预提调整',
        V3: 'V3 - Actual 实际入账',
        NUV2: 'NUV2 - Accrual 预提调整',
        NUV3: 'NUV3 - Actual 实际入账',
      },
      maxheight: getHeightHaveTab(),
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getTableData()
    this.getCustomerList()
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getContractList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        customerMdmCode: this.filterObj.customerMdmCode,
        minePackageCode: this.filterObj.minePackageCode,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getCustomerList() {
      selectAPI.queryCustomerList().then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    setSplitAssignee(value) {
      return setSplitAssignee(value)
    },
    operateProcess(version, name) {
      if(version=='DISTRIBUTOR-CONTRACT') {
        if(name.indexOf('审批') != -1) {
          this.$router.push('/contractManagement/ContractEntry/dealerContractApproval')
        } else {
          this.$router.push('/contractManagement/ContractEntry/dealerContractEntry')
        }
      } else if(version=='CUSTOMER-CONTRACT') {
        if(name.indexOf('审批') != -1) {
          this.$router.push('/contractManagement/ContractEntry/CustomerContractApproval')
        } else {
          this.$router.push('/contractManagement/ContractEntry/CustomerContractEntry')
        }
      }
    },
    //查看流程
    openFlowDiagram(row) {
      this.flowDiagram.businessId = row.businessKey
      this.flowDiagram.processId = row.procInstId
      this.flowDiagram.visible = true
    },
    // 导出数据
    exportExcel() {
      API.contractExport({
        customerMdmCode: this.filterObj.customerMdmCode,
        minePackageCode: this.filterObj.minePackageCode,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Contract 待办 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
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

<style lang="scss" scoped>
.seeActivity {
  height: 32px;
  background: #dcefe7;
  border-radius: 6px;
  font-size: 16px;
  color: #59be87;
  line-height: 32px;
  cursor: pointer;
}
.operation {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4192d3;
  font-size: 16px;
  cursor: pointer;
  .submit_icon {
    font-size: 26px;
  }
}
</style>

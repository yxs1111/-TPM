<!--TodoList
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-11 10:20:41
-->
<template>
  <div class="MainContentNew">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">审批流类型:</span>
          <el-select v-model="filterObj.item" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in contractType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同ID:</span>
          <el-input v-model="filterObj.contractCode" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item) in customerArr" :key="item.customerCode" :label="item.customerCsName" :value="item.customerMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item.distributorName" :value="item.distributorMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">流程状态:</span>
          <el-select v-model="filterObj.processStatus" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in processStatusList" :key="index" :label="item" :value="index+1" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" max-height="600" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="item" label="合同类型" width="150" > </el-table-column>
      <el-table-column align="center" prop="contractCode" label="合同ID" width="320" > </el-table-column>
      <el-table-column align="center" prop="customerName" label="客户名称"  width="150"> </el-table-column>
      <el-table-column align="center" prop="distributorName" label="经销商名称"  width="280"> </el-table-column>
      <el-table-column align="center" v-slot={row} width="100" prop="processStatus" label="流程状态">
        {{row.processStatus===2?'已完成':'进行中'}}
      </el-table-column>
      <el-table-column v-slot={row} width="300" align="center" prop="originator" label="发起人"> 
        <span v-html="setSplitAssignee(row.originator)"></span>
      </el-table-column>
      <el-table-column align="center" prop="originatorDate" label="发起时间" width="250">
        <template slot-scope="scope">
          {{ scope.row.originatorDate===null ? '': scope.row.originatorDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="assignee" label="办理人" width="160" :show-overflow-tooltip="false">
          <template slot-scope="scope">
            <el-tooltip>
              <!-- // {{}}会将数据解释为普通文本，而非 HTML 代码。 -->
              <div v-html="setSplitAssignee(scope.row.assignee)" slot="content"></div>
              <div class="ellipsis">{{scope.row.assignee}}</div>
            </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="查看" fixed="right">
        <template slot-scope="{row}">
          <div class="seeActivity" @click="openFlowDiagram(row)">
            查看流程
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
import { getDefaultPermissions, getTextMap, parseTime } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import ApproveFlow from '@/components/ApproveFlow'
import FlowDiagram from '@/components/FlowDiagram'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'ContractTrackingFlow',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        contractCode: '',
        item: '',
        customerMdmCode: '',
        distributorMdmCode: '',
        processStatus: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      distributorArr: [],
      customerArr: [],
      processStatusList: ['进行中', '已完成'],
      versionList: ['Final'],
      flowDiagram: {
        visible: false,
        activate: false,
        businessId: null,
        processId: null,
      }, 
      contractType:[{
        value: '客户合同',
        label: '客户合同',
      }, {
        value: '经销商分摊协议',
        label: '经销商分摊协议',
      }, {
        value: '客户合同系统生效时间调整',
        label: '客户合同-变更',
      }, {
        value: '经销商合同系统生效时间调整',
        label: '经销商分摊协议-变更',
      }],
    }
  },
  mounted() {
    this.getTableData()
    this.getDistributorList()
    this.getCustomerList()
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  watch: {
    'filterObj.customerMdmCode'() {
      this.filterObj.distributorMdmCode = ''
      this.getDistributorList()
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData=[]
      API.getContractTrackingFlow({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        item: this.filterObj.item,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        processStatus: this.filterObj.processStatus,
        contractCode: this.filterObj.contractCode,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.current
          this.pageSize = response.data.size
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    // 获取下拉框 渠道
    getDistributorList() {
      selectAPI
        .queryDistributorList({
          customerMdmCode: this.filterObj.customerMdmCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
    },
    getCustomerList() {
      selectAPI.queryCustomerList({}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    getMinePackageSelect() {
      selectAPI
        .queryMinePackageSelect({
          parentId: this.filterObj.CostType,
        })
        .then((res) => {
          if (res.code == 1000) {
            this.minePackageList = res.data
          }
        })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //查看流程
    openFlowDiagram(row) {
      this.flowDiagram.businessId = row.id
      this.flowDiagram.processId = row.processId
      this.flowDiagram.visible = true
    },
    // 导出数据
    exportExcel() {},
    setSplitAssignee(value) {
      if (!value) {
        return null
      } else {
        let list = value.split(',')
        let formatString = ''
        for (let index = 0; index < list.length; index++) {
          formatString += `${list[index]}<br>`
        }
        return formatString
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
  cursor: pointer;
  .submit_icon {
    font-size: 20px;
  }
}
.MainContentNew {
  /* height: 90%; */
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
}
</style>

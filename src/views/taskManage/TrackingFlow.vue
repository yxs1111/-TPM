<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-11 10:20:41
-->
<template>
  <div class="MainContent" @keyup.enter="pageList">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
         <div class="Selectli">
          <span class="SelectliTitle">Cost Type:</span>
          <el-select v-model="filterObj.CostType" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in CostTypeList" :key="index" :label="item.costType" :value="item.costTypeNumber" />
          </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">Mine package:</span>
          <el-select v-model="filterObj.MinePackageName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptons" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">流程状态:</span>
          <el-select v-model="filterObj.processStatus" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in processStatusList" :key="index" :label="item" :value="index+1" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" max-height="600" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="yearAndMonth" label="年月"> </el-table-column>
      <el-table-column align="center" prop="minePackageName" label="Mine Package" width="250"> </el-table-column>
      <el-table-column align="center" prop="channelName" label="渠道"> </el-table-column>
      <el-table-column align="center" v-slot={row} width="100" prop="processStatus" label="流程状态"> 
        {{row.processStatus===2?'已完成':'进行中'}}
      </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="发起人"> </el-table-column>
      <el-table-column align="center" prop="createDate" label="发起时间" width="250">
        <template slot-scope="scope">
          {{ scope.row.createDate===null ? '': scope.row.createDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column v-slot={row} width="280" align="center" prop="assignee" label="办理人"> 
        <!-- {{setSplitAssignee(row.assignee)}} -->
        <span v-html="setSplitAssignee(row.assignee)"></span>
      </el-table-column>
      <el-table-column width="150" align="center"  label="查看" fixed="right">
        <template slot-scope="{row}">
          <div class="seeActivity" @click="openFlowDiagram(row)">
            查看流程
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
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
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        CostType: '',
        MinePackageName: '',
        channelCode: '',
        processStatus: '',
        state: '',
        category: '',
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      CostTypeList: [],
      channelOptons: [],
      minePackageList: [],
      processStatusList: ["进行中",'已完成'],
      versionList: ['Final'],
      flowDiagram: {
        visible: false,
        activate: false,
        businessId: null,
        processId: null,
      },
    }
  },
  mounted() {
    this.getTableData()
    this.getQueryChannelSelect()
    this.getCostTypeList()
    this.getMinePackageSelect()
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  watch:{
    'filterObj.CostType'() {
      this.filterObj.MinePackageName = ''
      this.getMinePackageSelect()
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      API.getInvestCpVList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonth:this.filterObj.yearAndMonth,
        minePackageName:this.filterObj.MinePackageName,
        channelCode:this.filterObj.channelCode,
        processStatus:this.filterObj.processStatus,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    getCostTypeList() {
      selectAPI
        .getCostTypeList({
          costLevel: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.CostTypeList = res.data
          }
        })
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.channelOptons = res.data
        }
      })
    },
    getMinePackageSelect() {
      selectAPI.queryMinePackageSelect({
        parentId: this.filterObj.CostType,
      }).then((res) => {
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
      let list=value.split(',')
      let formatString=''
      for (let index = 0; index <list.length; index++) {
        formatString+=`${list[index]}<br>`
        
      }
      return formatString
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
</style>

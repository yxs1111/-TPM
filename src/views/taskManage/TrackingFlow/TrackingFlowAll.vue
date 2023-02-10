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
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Type:</span>
          <el-select v-model="filterObj.CostTypeIndex" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in CostTypeList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package:</span>
            <el-select v-model="filterObj.MinePackageIndex" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Item:</span>
          <el-select v-model="filterObj.costItem" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in CostItemList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptons" :key="index" :label="item.channelCsName" :value="item.channelCode" />
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
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="yearAndMonth" label="年月"> </el-table-column>
      <el-table-column align="center" width="240" prop="costTypeName" label="Cost Type"> </el-table-column>
      <el-table-column align="center" width="240" prop="minePackageName" label="Mine Package"> </el-table-column>
      <el-table-column align="center" width="240" prop="costItemName" label="Cost Item"> </el-table-column>
      <el-table-column align="center" min-width="150" prop="channelName" label="渠道"> </el-table-column>
      <el-table-column align="center" v-slot={row} width="100" prop="processStatus" label="流程状态">
        {{row.processStatus===2?'已完成':'进行中'}}
      </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="发起人"> </el-table-column>
      <el-table-column align="center" prop="createDate" label="发起时间" width="250">
        <template slot-scope="scope">
          {{ scope.row.createDate===null ? '': scope.row.createDate.replace('T', ' ') }}
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
  name:"TrackingFlowAll",
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        CostTypeIndex: '',
        CostType: '',
        CostTypeName: '',
        costItem:'',
        MinePackageName: '',
        MinePackageIndex: '',
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
      CostItemList: [],
      processStatusList: ['进行中', '已完成'],
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
    this.getCostItemList()
    this.getMinePackageSelect()
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  watch: {
    'filterObj.CostTypeIndex'(value) {
      if(value!=='') {
        this.filterObj.CostType=this.CostTypeList[this.filterObj.CostTypeIndex].costTypeNumber
        this.filterObj.CostTypeName=this.CostTypeList[this.filterObj.CostTypeIndex].costType
        this.getMinePackageSelect(this.filterObj.CostTypeName)
      } else {
        this.filterObj.CostTypeName = ''
        this.filterObj.MinePackageIndex = ''
        this.filterObj.MinePackageName = ''
        this.minePackageList = ''
        this.filterObj.CostType=''
        this.getMinePackageSelect()
      }
      this.filterObj.CostTypeName = ''
    },
    'filterObj.MinePackageIndex'(value) {
      if(value!=='') {
        this.filterObj.MinePackageName=this.minePackageList[this.filterObj.MinePackageIndex].costType
        this.filterObj.MinePackage=this.minePackageList[this.filterObj.MinePackageIndex].costTypeNumber
      } else {
        this.filterObj.MinePackage = ''
        this.filterObj.MinePackageName = ''
      }
      this.filterObj.costItem = ''
      this.getCostItemList(this.filterObj.MinePackage)
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      API.getInvestCpVList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        minePackageName: this.filterObj.MinePackageName,
        channelCode: this.filterObj.channelCode,
        processStatus: this.filterObj.processStatus,
        costTypeName: this.filterObj.CostTypeName,
        costItemName: this.filterObj.costItem,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    // 获取下拉框
    getCostItemList(MinePackageCode) {
      selectAPI.getCostItemList({ minePackage: MinePackageCode }).then((res) => {
        if (res.code === 1000) {
          this.CostItemList = res.data
        }
      })
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
    getMinePackageSelect() {
      selectAPI
        .queryMinePackageSelect({
          parentId: this.filterObj.CostType,
        })
        .then((res) => {
          if (res.code == 1000) {
            this.minePackageList = res.data
            // this.getCostItemList(this.filterObj.MinePackageCode)
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

<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2021-12-11 13:41:33
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
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">版本名称:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in versionList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">类型:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in versionList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <svg-icon icon-class="task" />
        <span class="text">任务转办</span>
      </div>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="version" label="版本号"> </el-table-column>
      <el-table-column align="center" prop="versionName" label="版本名称"> </el-table-column>
      <el-table-column align="center" prop="minePackageName" label="Mine Package"> </el-table-column>
      <el-table-column align="center" prop="name" label="名称"> </el-table-column>
      <el-table-column align="center" prop="activityName" label="当前节点"> </el-table-column>
      <el-table-column align="center" prop="channelEsName" label="提交人"> </el-table-column>
      <el-table-column align="center" prop="createTime" label="提交时间"> </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="备注"> </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" label="查看">
        <template slot-scope="{row}">
          <div class="seeActivity" @click="openFlowDiagram(row)">
            查看流程
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" label="操作" fixed='right'>
        <template slot-scope="{row}">
          <div class="operation">
            <svg-icon icon-class="submit_l" class="submit_icon" @click="operateProcess(row)" />
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
      <flow-diagram svg-type="instance"  :business-id="flowDiagram.businessId" :process-id="flowDiagram.processId" :visible.sync="flowDiagram.visible" title="流程图" width="90%" />
    </div>
  </div>
</template>

<script>
import API from '@/api/taskManage/MyTodo.js'
import { getDefaultPermissions, getTextMap, parseTime } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import ApproveFlow from '@/components/ApproveFlow'
import FlowDiagram from '@/components/FlowDiagram'
export default {
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        state: '',
        category: '',
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
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
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    search() {
      this.getTableData()
    },
    operateProcess: function (currentRow) {
      this.$router.push({ path: '/taskDetail', query: currentRow })
    },
    //查看流程
    openFlowDiagram(row) {
      this.flowDiagram.businessId = row.businessKey
      this.flowDiagram.processId = row.processId
      this.flowDiagram.visible = true
    },
    // 导出数据
    exportExcel() {},
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

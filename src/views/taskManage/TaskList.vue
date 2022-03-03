<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-03-03 11:37:10
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
          <el-select v-model="filterObj.version" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in versionNameList" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道</span>
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">类型:</span>
          <el-select v-model="filterObj.MinePackage" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.costTypeNumber"  />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <!-- <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <svg-icon icon-class="task" />
        <span class="text">任务转办</span>
      </div>
    </div> -->
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <!-- <el-table-column align="center" type="selection" /> -->
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="yearAndMonth" label="年月"> </el-table-column>
      <el-table-column align="center" prop="version" label="版本号"> </el-table-column>
      <el-table-column width="240" v-slot={row} align="center" prop="versionName" label="版本名称">
        {{versionNameList[row.version]}}
      </el-table-column>
      <el-table-column align="center"  prop="channelName" label="渠道"> </el-table-column>
      <el-table-column align="center" width="200" prop="minePackageName" label="Mine Package"> </el-table-column>
      <el-table-column align="center" width="180" prop="name" label="审批节点"> </el-table-column>
      <el-table-column align="center" width="280" prop="assignee" label="办理人"> </el-table-column>
      <el-table-column v-slot={row} align="center" width="150"  label="办理时间">
        {{row.dueDate?row.dueDate.substring(0,10):""}}
      </el-table-column>
      <el-table-column  width="150" align="center"  label="查看">
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
      <flow-diagram svg-type="instance"  :business-id="flowDiagram.businessId" :process-id="flowDiagram.processId" :visible.sync="flowDiagram.visible" title="流程图" width="90%" />
    </div>
  </div>
</template>

<script>
import API from '@/api/taskManage/taskManage.js'
import { getDefaultPermissions, getTextMap, parseTime,getHeight } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import ApproveFlow from '@/components/ApproveFlow'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import FlowDiagram from '@/components/FlowDiagram'
export default {
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        version: '',
        channelCode: '',
        MinePackage: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ChannelList: [],
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
      maxheight: getHeight(),
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getTableData()
    this.getMinePackage()
    this.getChannelList()
  },
  components: {
    FlowDiagram,
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getMyHandleList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        version: this.filterObj.version,
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.MinePackage,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.ChannelList = res.data
        }
      })
    },
    getMinePackage() {
      selectAPI.queryMinePackageSelect().then((res) => {
        this.MinePackageList=res.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    operateProcess(version,name,channelCode) {
      // this.$router.push({path:'/V3/V3Apply/V3discountNU',query:{channelCode:'EC'}})
      // sessionStorage.setItem('currentIndex',2)
      // return
      if(version=="V0") {
        console.log(version,name);
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V0/V0Apply',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V0/V0Approval',params:{channelCode}})
        }
      }
      if(version=="V1") {
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V1/V1Apply',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V1/V1Approval',params:{channelCode}})
        }
      }
      if(version=="NUV1") {
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V1/V1Apply/V1discountNU',params:{channelCode}})
          sessionStorage.setItem('currentIndex',2)
        } 
      }
      if(version=="V2") {
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V2/V2Apply',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V2/V2Approval',params:{channelCode}})
        }
      }
      if(version=="NUV2") {
        sessionStorage.setItem('currentIndex',2)
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V2/V2Apply/V2discountNU',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V2/V2Approval/V2NUApproval',params:{channelCode}})
        }
      }
      if(version=="V3") {
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V3/V3Apply',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V3/V3Approval',params:{channelCode}})
        }
      }
      if(version=="NUV3") {
        sessionStorage.setItem('currentIndex',2)
        if(name.indexOf('调整')!=-1){
          this.$router.push({path:'/V3/V3Apply/V3discountNU',params:{channelCode}})
        } else if(name.indexOf('审批')!=-1) {
          this.$router.push({path:'/V3/V3Approval/V3discountNUApproval',params:{channelCode}})
        }
      }
      //this.$router.push({ path: '/process', query: currentRow })
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

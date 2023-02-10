<!--
 * @Description:
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2023-02-10 14:41:55
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
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
          <el-select v-model="filterObj.MinePackage" clearable filterable placeholder="请选择" @change="getCostItemList">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.costTypeNumber" />
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
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">版本号:</span>
          <el-select v-model="filterObj.version" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['V0','V1','V2','V3']" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="yearAndMonth" label="年月"> </el-table-column>
      <el-table-column align="center" width="240" prop="costTypeName" label="Cost Type"> </el-table-column>
      <el-table-column align="center" width="240" prop="minePackageName" label="Mine Package"> </el-table-column>
      <el-table-column align="center" width="240" prop="costItemName" label="Cost Item"> </el-table-column>
      <el-table-column align="center" min-width="150" prop="channelName" label="渠道"> </el-table-column>
      <el-table-column align="center" min-width="150" prop="version" label="版本号"> </el-table-column>
      <el-table-column align="center" width="180" prop="activityName" label="当前节点"> </el-table-column>
      <el-table-column align="left" prop="assignee" label="办理人" width="160" :show-overflow-tooltip="false">
          <template slot-scope="scope">
            <el-tooltip>
              <!-- // {{}}会将数据解释为普通文本，而非 HTML 代码。 -->
              <div v-html="setSplitAssignee(scope.row.assignee)" slot="content"></div>
              <div class="ellipsis">{{scope.row.assignee}}</div>
            </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column v-slot={row} align="center" width="240" prop="createTime" label="提交时间">
        {{row.createTime?row.createTime.substring(0,19).replaceAll("T",' '):""}}
      </el-table-column>
      <!-- <el-table-column width="150" align="center" prop="remark" label="备注"> </el-table-column> -->
      <el-table-column width="150" align="center" prop="createDate" fixed='right' label="查看">
        <template slot-scope="{row}">
          <div class="seeActivity" @click="openFlowDiagram(row)">
            查看流程
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" label="操作" fixed='right'>
        <template slot-scope="{row}">
          <div class="operation" @click="operateProcess(row.version,row.activityName,row.channelCode,row.minePackageName,row)">
            <svg-icon icon-class="submit_l" class="submit_icon" />
            办理
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
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getHeightHaveTab,
  setSplitAssignee,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import ApproveFlow from '@/components/ApproveFlow'
import FlowDiagram from '@/components/FlowDiagram'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name:'MyTodoAll',
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
        version: '',
        channelCode: '',
        state: '',
        MinePackage: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ChannelList: [],
      CostTypeList: [],
      CostItemList: [],
      MinePackageList: [],
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
        FMCV2: 'FMCV2 - Accrual 预提调整',
        FMCV3: 'FMCV3 - Actual 实际入账',
      },
      versionList: [
        {
          version: 'V0',
          name: 'V0 - Pre city plan 预拆分',
        },
        {
          version: 'V1',
          name: 'V1 - City plan 详细拆分',
        },
        {
          version: 'V2',
          name: 'V2 - Accrual 预提调整',
        },
        {
          version: 'V3',
          name: 'V3 - Actual 实际入账',
        },
        {
          version: 'NUV2',
          name: 'V2 - Accrual 预提调整',
        },
        {
          version: 'NUV3',
          name: 'V3 - Actual 实际入账',
        },
        {
          version: 'FMC-V2',
          name: 'V2 - Accrual 预提调整',
        },
        {
          version: 'FMC-V3',
          name: 'V3 - Actual 实际入账',
        },
      ],
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
    this.getChannelList()
    this.getCostTypeList()
    this.getMinePackage()
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
        this.getMinePackage(this.filterObj.CostTypeName)
      } else {
        this.filterObj.CostTypeName = ''
        this.filterObj.CostType=''
        this.MinePackageList = ''
        this.getMinePackage()
      }
      this.filterObj.MinePackage = ''
      this.filterObj.costItem = ''
    },
  },
  methods: {
    //获取菜单明
    getVersion(version) {
      if(version) {
       let index= this.versionList.findIndex(item=>item.version==version)
       if (index!=-1) {
        return this.versionList[index].name
       }else {
        return null
       }
      }
    },
    //获取表格数据
    getTableData() {
      API.getList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        costTypeName: this.filterObj.CostTypeName,
        costItemName: this.filterObj.costItem,
        version: this.filterObj.version,
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.MinePackage=='P'?'KA Contract':this.filterObj.MinePackage,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 获取下拉框
    getCostItemList() {
      this.filterObj.costItem = ''
      selectAPI.getCostItemList({
        minePackage: this.filterObj.MinePackage
      }).then((res) => {
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
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.ChannelList = res.data
        }
      })
    },
    getMinePackage() {
      selectAPI.queryMinePackageSelect({
        parentId: this.filterObj.CostType,
      }).then((res) => {
        this.MinePackageList = res.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    operateProcess(version, name, channelCode,minePackage,row) {
      let minePackageName=minePackage
      if(minePackageName=='KA Contract') {
        if (row.costItemName=='HIH rebate') {
          minePackageName='HIH Rebate'
        } else if(row.costItemName=='KA rebate') {
          minePackageName='KA Rebate'
        }
      }
      if(minePackageName=='POSM') {
        if (row.costItemName=='In Store POSM - Standard') {
          minePackageName='POSM - Standard'
        } else if(row.costItemName=='In Store POSM - Customized') {
          minePackageName='POSM - Customized'
        }
      }
      if(minePackageName=='Price Promotion') {
        if (row.costItemName=='Free Goods - Tin') {
          minePackageName='Free Goods-Tin'
        } else {
          minePackageName='Price Promotion'
        }
      }
      if(minePackageName=='New User') {
        if(row.costItemName=='Free Goods - Win 2') {
          minePackageName='Free Goods-Win2'
        } else {
          minePackageName='New User'
        }
      }
      if(minePackageName=='Roadshow and Live Stream') {
        minePackageName='Roadshow'
      }
      if(minePackageName=='Discount_Others') {
        minePackageName='Listing fee'
      }
      if (version.indexOf('V0')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V0/V0Apply', params: { channelCode } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V0/V0Approva', params: { channelCode } })
        }
      }
      if (version.indexOf('V1')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Apply', query: { channelCode ,minePackageName} })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Approval', query: { channelCode,minePackageName } })
        }
      }
      if (version.indexOf('V2')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Apply', query: { channelCode,minePackageName } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Approval', query: { channelCode ,minePackageName} })
        }
      }
      if (version.indexOf('V3')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Apply', query: { channelCode ,minePackageName} })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Approval', query: { channelCode ,minePackageName} })
        }
      }
    },
    //查看流程
    openFlowDiagram(row) {
      this.flowDiagram.businessId = row.businessKey
      this.flowDiagram.processId = row.processId
      this.flowDiagram.visible = true
    },
    setSplitAssignee(value) {
      return setSplitAssignee(value)
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

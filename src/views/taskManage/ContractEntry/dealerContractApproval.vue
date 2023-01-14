<!--
 * @Description: 经销商合同审批 Tab
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2023-01-11 21:29:50
-->
<template>
  <div class="tabViewsWrap">
    <div class="tabViews" ref="tab">
      <router-link v-for="(item, index) in routerList" :key="index" :to="item.path" tag="div" class="tabli" :class="index === currentIndex ? 'currentTabli' : ''" @click.native="changeTab(index)">
        <img v-if="index != currentIndex" :src="item.img.light" alt="" />
        <img v-if="index == currentIndex" :src="item.img.dark" alt="" />
        <span class="tabTitle">{{ item.name }}</span>
      </router-link>
    </div>
<<<<<<< HEAD
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">通过</el-button>
      <el-button type="primary" class="TpmButtonBG" @click="reject" v-permission="permissions['rejected']">驳回</el-button>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />

      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="180" label="操作">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-permission="permissions['update']" v-show="!scope.row.isEditor" @click="editorRow(scope.$index,scope.row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractCode" fixed align="center" width="320" label="经销商分摊协议ID">
      </el-table-column>
      <el-table-column prop="customerChannelCode" fixed align="center" width="120" label="渠道">
      </el-table-column>
      <el-table-column prop="customerName" fixed align="center" width="180" label="客户名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerRegionName" fixed align="center" width="120" label="大区">
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="160" label="客户目标销售额">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.customerContractSaleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="distributorName" align="center" width="280" label="经销商名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.distributorName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="distributorSaleAmount" align="center" width="160" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.saleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="200" label="合同期间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.contractBeginDate.replaceAll('-','/') + ' - ' + scope.row.contractEndDate.replaceAll('-','/') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="160" label="系统生效时间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot={row} align="center" prop="contractStateName" width="240" label="合同状态">
         {{row.contractStateName=='待审批'&&row.activityName&&row.activityName.indexOf('审批')!=-1?row.contractStateName+'-'+row.activityName:row.contractStateName}}
      </el-table-column>
      <el-table-column v-slot="{row}" prop="isSupplement" align="center" width="100" label="是否补录">
        {{row.isSupplement?'是':'否'}}
      </el-table-column>
      <el-table-column v-slot={row} width="120" align="center" label="合同条款">
        <div class="seeActivity" @click="showTermDetailDialog(row)">
          条款明细
        </div>
      </el-table-column>
      <el-table-column prop="remark" align="center" width="220" label="申请人备注">
      </el-table-column>
      <el-table-column prop="poApprovalComments" align="center" width="220" label="Package Owner意见">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor&&scope.row.name.indexOf('Package Owner') != -1">
            <el-input v-model="scope.row.poApprovalComments"  type="textarea" autosize   clearable class="my-el-input my-textArea" placeholder="请输入">
            </el-input>
          </div>
          <div v-else>
            {{ scope.row.poApprovalComments }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="finance" align="center" width="220" label="Finance 意见">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor&&scope.row.name.indexOf('Finance') != -1">
            <el-input v-model="scope.row.finApprovalComments"  type="textarea" autosize   clearable class="my-el-input my-textArea" placeholder="请输入">
            </el-input>
          </div>
          <div v-else>
            {{ scope.row.finApprovalComments }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
=======
    <div style="margin-top: -5px">
      <router-view />
>>>>>>> dev
    </div>
  </div>
</template>

<script>
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  directives: { elDragDialog, permission },
  name: 'CustomerContractEntry',
  data() {
    return {
      routerList: [
        {
          name: '明细审批',
          path: '/contractManagement/dealer/dealerContractApproval/dealerContractTermApproval',
          img: {
            dark: require('@/assets/images/tab/Term.png'),
            light: require('@/assets/images/tab/Term_l.png'),
          },
        },
        {
          name: '变更审批',
          path: '/contractManagement/dealer/dealerContractApproval/dealerContractChangeApproval',
          img: {
            dark: require('@/assets/images/tab/Change.png'),
            light: require('@/assets/images/tab/Change_l.png'),
          },
        },
      ],
      currentIndex: 0,
      startX: 0,
      endX: 0,
      isCanMove: 0,
      setInterval: null,
    }
  },
  computed: {},
  mounted() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
      this.$router.push(this.routerList[this.currentIndex].path)
    } else {
      this.currentIndex = 0
    }
  },
  activated() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
      this.$router.push(this.routerList[this.currentIndex].path)
    } else {
      this.currentIndex = 0
    }
  },
  methods: {
    // tabview 切换
    changeTab(index) {
      this.currentIndex = index
      sessionStorage.removeItem('filterObj')
      sessionStorage.setItem('currentIndex', index)
    },
  },
}
</script>

<style lang="scss" scoped>
.tabViews {
  width: 100%;
  height: 38px;
  display: flex;
  margin-left: 25px;
  overflow-x: scroll;
  overflow-y: hidden;
  .tabli {
    display: flex;
    align-items: center;
    padding: 0 52px;
    height: 38px;
    background: #4192d3;
    border-radius: 6px 6px 0px 0px;
    margin-right: 20px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    img {
      width: 17px;
      height: 17px;
      margin-right: 10px;
    }
    .tabTitle {
      white-space: nowrap;
      // width: 50px;
      // padding: 30px 0;
    }
  }
  .currentTabli {
    background-color: #fff;
    color: #666;
    font-weight: 600;
  }
}
</style>
<style lang="scss">
//   .tabViews ::-webkit-scrollbar {
//   width: 6px !important;
//   height: 6px!important;
// }
// /* //滚动条的滑块 */
// .tabViews ::-webkit-scrollbar-thumb {
//   background-color: #a1a3a9!important;
//   border-radius: 3px!important;
// }
.tabViews::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
  -webkit-appearance: none;
}
.tabViews::-webkit-scrollbar:vertical {
  width: 11px;
}
.tabViews::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

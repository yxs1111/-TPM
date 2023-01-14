<!--
<<<<<<< HEAD
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-07-26 08:45:29
=======
 * @Description: 客户合同审批 Tab
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-12-17 17:58:04
>>>>>>> dev
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
    <div style="margin-top: -5px">
      <router-view />
    </div>
<<<<<<< HEAD
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="220" label="操作">
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
      <el-table-column prop="contractCode" fixed align="center" width="220" label="合同ID"></el-table-column>
      <el-table-column prop="channelCode" fixed align="center" width="120" label="渠道">
      </el-table-column>
      <el-table-column prop="customerName" fixed align="center" width="220" label="客户名称">
      </el-table-column>
      <el-table-column prop="regionName"  align="center" width="140" label="大区">
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="220" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.saleAmount ? scope.row.saleAmount : 0)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.contractBeginDate?scope.row.contractBeginDate.replaceAll('-','/'):'' }} - {{scope.row.contractEndDate?scope.row.contractEndDate.replaceAll('-','/'):''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="220" label="系统生效时间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot={row} align="center" prop="contractStateName" width="240" label="合同状态">
        {{row.contractStateName=='待审批'&&row.activityName&&row.activityName.indexOf('审批')!=-1?row.contractStateName+'-'+row.activityName:row.contractStateName}}
      </el-table-column>
      <el-table-column width="120" align="center" label="合同条款">
        <template slot-scope="scope">
          <div class="seeActivity" @click="showTermsDetail(scope.$index)">
            条款明细
          </div>
        </template>
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
      <el-table-column prop="finApprovalComments" align="center" width="220" label="Finance 意见">
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
    </div>
    <!-- 条款明细 -->
    <el-dialog width="90%"  ref="termDialog"  class="termDialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
      <div class="dialogContent">
        <div class="termInfo">
          <span class="termItem">客户名称:{{termInfo.customerName}}</span>
          <span class="termItem" v-if="termInfo.channelCode==='RKA'">大区:{{termInfo.regionName}}</span>
          <span class="termItem">目标销售额(RMB):{{FormateNum(termInfo.saleAmount)}}</span>
          <span class="termItem">合同期间:{{termInfo.contractBeginDate?termInfo.contractBeginDate.replaceAll('-','/'):''}}-{{termInfo.contractEndDate?termInfo.contractEndDate.replaceAll('-','/'):''}}</span>
          <span class="termItem">系统生效时间:{{termInfo.effectiveBeginDate}}-{{termInfo.effectiveEndDate}}</span>
          <span class="termItem">合同状态:{{contractList[termInfo.contractState]}}</span>
        </div>
        <div class="termTableWrap">
          <el-table :data="termTotalData"  max-height="350" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  {{ contractItemVariableList[scope.row.contractItem].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="conditions" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
            </el-table-column>
          </el-table>
          <el-table :data="termVariableData" :show-header="false" ref="termVariableTable" max-height="250" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  {{ contractItemVariableList[scope.row.contractItem].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="conditions" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-slot={row} prop="remark" align="left" label="描述">
              <div class="detailText">
                {{row.remark}}
              </div>
            </el-table-column>
          </el-table>
          <el-table :data="termVariableTotalData" :show-header="false"  style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  {{ contractItemVariableList[scope.row.contractItem].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="conditions" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
            </el-table-column>
          </el-table>  
          <el-table :data="termFixData" ref="termFixTable" :show-header="false" max-height="350" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  {{contractItemFixList[scope.row.contractItem].name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="conditions" align="center" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.costRatio)}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column v-slot={row} prop="remark" align="left" label="描述">
              <div class="detailText">
                {{row.remark}}
              </div>
            </el-table-column>
          </el-table>
          <el-table :data="termFixTotalData"  :show-header="false" max-height="250" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  {{contractItemFixList[scope.row.contractItem].name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="conditions" align="center" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.costRatio)}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column v-slot={row} prop="remark" align="left" label="描述">
              <div class="detailText">
                {{row.remark}}
              </div>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTermsDetail()">确 定</el-button>
        <el-button @click="closeTermsDetail">取 消</el-button>
      </span> -->
    </el-dialog>
=======
>>>>>>> dev
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
          path: '/contractManagement/ContractEntry/CustomerContractApproval/CustomerContractTermApproval',
          img: {
            dark: require('@/assets/images/tab/Term.png'),
            light: require('@/assets/images/tab/Term_l.png'),
          },
        },
        {
          name: '变更审批',
          path: '/contractManagement/ContractEntry/CustomerContractApproval/CustomerContractChangeApproval',
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
  methods: {
    // tabview 切换
    changeTab(index) {
      this.currentIndex = index
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

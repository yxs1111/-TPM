<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-28 11:44:27
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,key in customerArr" :key="key" :label="key" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商名称:</span>
          <el-select v-model="filterObj.distributorMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in distributorArr" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同期间:</span>
          <el-date-picker v-model="filterObj.contractDate" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">系统生效时间:</span>
          <el-date-picker v-model="filterObj.systemDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同状态:</span>
          <el-select v-model="filterObj.state" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in contractList" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="showAddDialog">新增</el-button>
      <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div>
      <el-button type="primary" class="TpmButtonBG" @click="submit">提交</el-button>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="220" label="操作">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_delete" @click="deleteRow(scope.row)">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isEditor" @click="editorRow(scope.$index)">
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
      <el-table-column prop="customerName" align="center" width="220" label="客户名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="targetSale" align="center" width="220" label="目标销售额">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.targetSale)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="distributorName" align="center" width="220" label="经销商名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.distributorName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额(¥)">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.saleAmount" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{FormateNum(scope.row.saleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.contractBeginDate + ' - ' + scope.row.contractEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="220" label="系统生效时间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.systemDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractStatus" align="center" width="240" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div>
              {{ scope.row.contractStatus == 0 ? '草稿' : '提交' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="合同条款">
        <div class="seeActivity" @click="showTermDetailDialog">
          条款明细
        </div>
      </el-table-column>
      <el-table-column prop="applyRemark" align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.applyRemark" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.applyRemark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="packageOwner" align="center" width="220" label="Package Owner意见" />
      <el-table-column prop="finance" align="center" width="220" label="Finance 意见"></el-table-column>
      <el-table-column prop="createBy" align="center" width="220" label="创建人"></el-table-column>
      <el-table-column prop="createDate" align="center" width="220" label="创建时间"></el-table-column>
      <el-table-column prop="updateBy" align="center" width="220" label="修改人"></el-table-column>
      <el-table-column prop="updateDate" align="center" width="220" label="修改时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 新增 -->
    <el-dialog width="95%" v-elDragDialog class="my-el-dialog" title="新增" :visible="isAddDialogVisible" @close="closeAddDialog">
      <div class="dialogContent">
        <div class="termInfo">
          <div class="selectCustomer">
            <span class="selectBar">客户合同</span>
            <el-select v-model="addDialog.name" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="(item) in customerArr" :key="item.customerMdmCode" :label="item.customerCsName" :value="item.customerCsName" />
            </el-select>
          </div>
          <el-button type="primary" class="TpmButtonBG">查询</el-button>
        </div>
        <div class="termTableWrap">
          <div class="TableWrap_dealer">
            <el-table :data="addDialogCustomer" max-height="220" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
              <el-table-column prop="customerName" align="center" width="320" label="客户名称">
              </el-table-column>
              <el-table-column prop="targetSale" align="center" width="280" label="目标销售额">
              </el-table-column>
              <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.contractDate[0]+' - '+scope.row.contractDate[1]}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="systemDate" align="center" width="280" label="系统生效时间">
                <template slot-scope="scope">
                  <div v-show="!scope.row.isEditor && scope.row.systemDate.length">
                    {{ scope.row.systemDate[0] + ' - ' + scope.row.systemDate[1] }}
                    <!-- {{scope.row.contractDate}} -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractStatus" align="center" label="合同状态">
                <template slot-scope="scope">
                  <div class="contractStatusWrap">
                    <div>
                      {{ scope.row.contractStatus == 0 ? '失效' : '生效中' }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="space">
          </div>
          <div class="TableWrap_dealer">
            <el-table :data="addDialogDealerList" ref="dealerTable" max-height="280" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
              <el-table-column prop="distributorName" align="center" width="320" label="经销商名称">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-select v-model="scope.row.distributorName" class="my-el-input" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in distributorArr" :key="index" :label="item.distributorName" :value="item.distributorName" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{scope.row.distributorName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="targetSale" align="center" width="280" label="目标销售额(¥)">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-input v-model="scope.row.targetSale" clearable class="my-el-input" placeholder="请输入">
                    </el-input>
                  </div>
                  <div v-else>
                    {{FormateNum(scope.row.targetSale)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-date-picker v-model="scope.row.contractDate" type="daterange" value-format="yyyyMMdd" format="yyyyMMdd" range-separator="至" start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    {{scope.row.contractDate}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="systemDate" align="center" width="280" label="系统生效时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-date-picker v-model="scope.row.systemDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
                      end-placeholder="结束月份">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    {{scope.row.systemDate}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="isEditor" align="center" label="是否补录">
              </el-table-column>
            </el-table>
            <div class="addNewRowWrap">
              <div class="addNewRow" @click="addNewDistributor">
                <i class="el-icon-plus"></i>
                <span class="addNewRowText">新增一行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAdd()">确 定</el-button>
        <el-button @click="closeAddDialog">取 消</el-button>
      </span>
    </el-dialog>
    <!--条款明细 -->
    <el-dialog width="95%" v-elDragDialog class="my-el-dialog" title="条款明细" :visible="isTermDetailVisible" @close="closeTermDetailDialog">
      <div class="dialogContent">
        <div class="dealersWrap">
          <div class="dealerItem">
            <div class="topInfo">
              <span>客户名称：高鑫零售</span>
              <span class="tax">目标销售额(含税，￥):{{FormateNum(100000)}}</span>
            </div>
            <el-table :data="termCustomerData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
              <el-table-column align="center" width="140">
                <template v-slot:header></template>
                <template slot-scope="{ row }">
                  <div>
                    {{ row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractItem" align="center" width="150" label="Contract item">
                <template slot-scope="{row}">
                  <div v-if="row.contractItem!==''">
                    {{row.isVariable?contractItemVariableList[row.contractItem].name:contractItemFixList[row.contractItem].name}}
                  </div>
                </template>

              </el-table-column>
              <el-table-column prop="conditionType" align="center" width="150" label="条件类型">
              </el-table-column>
              <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
              </el-table-column>
              <el-table-column v-slot={row} prop="cost" align="center" width="150" label="含税金额（￥）">
                {{FormateNum(row.cost)}}
              </el-table-column>
              <el-table-column prop="detail" align="center" width="150" label="描述"></el-table-column>
            </el-table>
          </div>
          <div class="dealersTableWrap">
            <div class="dealerItem" v-for="item,index in termDistData" :key="index">
              <div class="topInfo">
                <span>经销商名称：{{item.distName}}</span>
                <span class="tax">目标销售额(含税，￥):{{item.targetSale}}</span>
              </div>
              <el-table :data="item.data" border :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
                <el-table-column align="center" width="140">
                  <template v-slot:header></template>
                  <template slot-scope="{ row }">
                    <div>
                      {{ row.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="contractItem" align="center" width="150" label="Contract item">
                </el-table-column>
                <el-table-column prop="conditionType" align="center" width="150" label="条件类型">
                </el-table-column>
                <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
                </el-table-column>
                <el-table-column prop="cost" align="center" width="150" label="含税金额（￥）">
                </el-table-column>
                <el-table-column prop="detail" align="center" width="150" label="描述">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="staging()">暂 存</el-button>
        <el-button type="primary" @click="confirmTermDetail()">确 定</el-button>
        <el-button @click="closeTermDetailDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/dealer'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  contractList,
  FormateThousandNum,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'dealerContractEntry',
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        customerMdmCode: '',
        distributorMdmCode: '',
        contractDate: [],
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        state: '',
      },
      maxheight: getContractEntry(),
      tableData: [
        { 
          customerName: '孩子王',
          targetSale: 100,
          distributorName: '杭州华商贸易有限公司',
          saleAmount: 500000,
          contractDate: ['2022-01-10', '2022-05-21'],
          systemDate: ['202201', '202212'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
        },
      ],
      customerArr: [],
      distributorArr: [],
      contractList: [],
      checkArr: [], //选中的数据
      tableKey: 0,
      addDialog: {
        id: '',
        name: '',
      },
      addDialogCustomer: [
        {
          customerName: '孩子王',
          targetSale: 100,
          contractDate: ['20220110', '20220521'],
          systemDate: ['202201', '202212'],
          contractStatus: 0,
          systemStatus: 0,
        },
      ],
      addDialogDealerList: [
        {
          distributorName: '上海映华食品有限公司',
          targetSale: 100,
          contractDate: ['20220110', '20220521'],
          systemDate: ['202201', '202212'],
          contractStatus: 0,
          systemStatus: 0,
          isEditor: 0, //是否补录
        },
        {
          distributorName: '上海映华食品有限公司',
          targetSale: 100,
          contractDate: ['20220110', '20220521'],
          systemDate: ['202201', '202212'],
          contractStatus: 0,
          systemStatus: 0,
          isEditor: 1, //是否补录
        },
      ],
      isAddDialogVisible: false,
      isTermDetailVisible: false, //条款明细弹窗
      contractItemVariableList: [
        { name: '有条件月返', code: 'Conditional' },
        { name: '无条件月返', code: 'Unconditional' },
      ],
      contractItemFixList: [
        { name: '路演', code: 'Conditional' },
        { name: '陈列费', code: 'Conditional' },
        { name: '数据费', code: 'Conditional' },
      ],
      termCustomerData: [
        {
          name: 'Total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          taxRate: '',
          detail: '',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Variable',
          contractItem: 0,
          conditionType: 'conditional',
          pointCount: 3,
          cost: 21,
          taxRate: '6%',
          detail: '描述',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Variable total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          taxRate: '',
          detail: '',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Fix',
          contractItem: 0,
          conditionType: 'conditional',
          pointCount: 3,
          cost: 21,
          isHaveTax: 1,
          taxRate: '6%',
          detail: '描述',
          isVariable: 0, //total 、Fix 区分
        },
        {
          name: 'Fix total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          isHaveTax: '',
          taxRate: '',
          detail: '',
          isVariable: 0, //total 、Fix 区分
        },
      ],
      termDistData: [
        {
          distName: '成都华隆',
          targetSale: 500000,
          data: [
            {
              name: 'Total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              taxRate: '6%',
              detail: '描述',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Fix',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              isHaveTax: 1,
              taxRate: '6%',
              detail: '描述',
              isVariable: 0, //total 、Fix 区分
            },
            {
              name: 'Fix total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              isHaveTax: '',
              taxRate: '',
              detail: '',
              isVariable: 0, //total 、Fix 区分
            },
          ],
        },
        {
          distName: '成都华隆',
          targetSale: 500000,
          data: [
            {
              name: 'Total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              taxRate: '6%',
              detail: '描述',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Fix',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              isHaveTax: 1,
              taxRate: '6%',
              detail: '描述',
              isVariable: 0, //total 、Fix 区分
            },
            {
              name: 'Fix total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              isHaveTax: '',
              taxRate: '',
              detail: '',
              isVariable: 0, //total 、Fix 区分
            },
          ],
        },
        {
          distName: '成都华隆',
          targetSale: 200000,
          data: [
            {
              name: 'Total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              taxRate: '6%',
              detail: '描述',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Variable total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
            {
              name: 'Fix',
              contractItem: 0,
              conditionType: 'conditional',
              pointCount: 3,
              cost: 21,
              isHaveTax: 1,
              taxRate: '6%',
              detail: '描述',
              isVariable: 0, //total 、Fix 区分
            },
            {
              name: 'Fix total',
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              isHaveTax: '',
              taxRate: '',
              detail: '',
              isVariable: 0, //total 、Fix 区分
            },
          ],
        },
      ],
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getContractEntry()
      })()
    }
    this.getTableData()
    this.getCustomerList()
    this.getDistributorList()
  },
  directives: { elDragDialog, permission },
  watch: {
    'filterObj.contractDate'(value) {
      if (value) {
        this.filterObj.contractBeginDate = value[0]
        this.filterObj.contractEndDate = value[1]
      } else {
        this.filterObj.contractBeginDate = ''
        this.filterObj.contractEndDate = ''
      }
    },
    'filterObj.systemDate'(value) {
      if (value) {
        this.filterObj.effectiveBeginDate = value[0]
        this.filterObj.effectiveEndDate = value[1]
      } else {
        this.filterObj.effectiveBeginDate = ''
        this.filterObj.effectiveEndDate = ''
      }
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      API.getPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((response) => {
        // this.tableData = response.data.records
        // this.pageNum = response.data.pageNum
        // this.pageSize = response.data.pageSize
        // this.total = response.data.total
      })
    },
    // 客户
    getCustomerList() {
      API.getCustomerContract({}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    getDistributorList() {
      selectAPI.getDistributorService({}).then((res) => {
        if (res.code === 1000) {
          this.distributorArr = res.data
        }
      })
    },
    //编辑行数据
    editorRow(index) {
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => (item.isEditor = 0))
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      // this.tableData.forEach((item) => (item.isEditor = 0))
      this.tableData[index].isEditor = 0
    },
    //删除该行数据
    deleteRow() {},
    //录入提交
    submit() {},
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //新增数据 --弹窗展示
    showAddDialog() {
      this.isAddDialogVisible = true
    },
    // 新增经销商
    addNewDistributor() {
      //如何判断是否为补录
      this.addDialogDealerList.push({
        distributorName: '',
        targetSale: 0,
        contractDate: ['20220110', '20220521'],
        systemDate: ['202201', '202212'],
        contractStatus: 0,
        systemStatus: 0,
        isEditor: 1, //是否补录
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.dealerTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.dealerTable.bodyWrapper.scrollTop = scrollHeight
      })
    },
    //新增数据--关闭弹窗
    closeAddDialog() {
      this.isAddDialogVisible = false
    },
    //确认新增
    confirmAdd() {
      this.isAddDialogVisible = false
    },

    //打开条款明细弹窗
    showTermDetailDialog() {
      this.$router.push(
        '/taskManage/ContractEntry/dealerContractEntry/dealerTermDetail'
      )
      // this.isTermDetailVisible = true
    },
    //关闭条款明细弹窗
    closeTermDetailDialog() {
      this.isTermDetailVisible = false
    },
    //条款明细 确认
    confirmTermDetail() {
      this.closeTermDetailDialog()
    },
    //条款明细暂存
    staging() {
      this.closeTermDetailDialog()
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
    handleSelectionChange(val) {
      this.checkArr = val
    },
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    //弹窗表格样式
    tableRowClassNameDialog({ row, rowIndex }) {
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
        return 'first-row'
      }
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
  font-weight: 600;
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
.svgIcon {
  width: 20px;
  height: 20px;
}
.contractStatusWrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.timeOutWrap {
  margin-left: 10px;
  cursor: pointer;
}
//自定义el-input
.my-el-input {
  width: 180px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 180px !important;
  }
  .el-input--suffix {
    width: 180px !important;
  }
}
.PopoverContent {
  .PopoverContentTop {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
    font-weight: 600;
    justify-content: space-between;
  }
  .PopoverContentOption {
    .PopoverContentOptionItem {
      display: flex;
      align-items: center;
      margin: 10px 0;
      .PopoverContentOptionItemText {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }
    }
  }
  .PopoverContentFoot {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .TpmButtonBG {
      min-width: 66px;
      width: 66px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #4192d3;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 10px;
      cursor: pointer;
      background-color: #4192d3 !important;
      color: #fff;
    }
    .cancelButton {
      width: 66px;
      background-color: #fff !important;
      color: #4192d3;
      border: 1px solid #4192d3;
      text-align: center;
    }
  }
}
.dialogContent {
  .termInfo {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    margin-bottom: 10px;
    .termItem {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
    }
    .selectBar {
      margin-right: 10px;
    }
    .selectCustomer {
      margin-right: 10px;
    }
  }
  .termTableWrap {
    width: 100%;
    // border: 1px solid #e7e7e7;
    .addNewRowWrap {
      width: 100%;
      height: 50px;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
      .addNewRow {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #f4f9ff;
        color: #666;
        cursor: pointer;
        .addNewRowText {
          margin-left: 10px;
          color: #333;
        }
      }
    }
    .space {
      width: 100%;
      height: 20px;
    }
    .TableWrap_dealer {
      width: 100%;
      border: 1px solid #e7e7e7;
    }
  }
  .dealersWrap {
    width: 100%;
    display: flex;
    .dealersTableWrap {
      display: flex;
      overflow-x: scroll;
    }
  }
  .dealerItem {
    // display: flex;
    .topInfo {
      font-size: 16px;
      color: #4192d3;
      font-weight: 600;
      .tax {
        margin-left: 20px;
      }
    }
  }
  // /*滚动条的宽度*/
  // ::-webkit-scrollbar {
  //   width: 16px;
  //   height: 16px;
  // }
  // /* //滚动条的滑块 */
  // ::-webkit-scrollbar-thumb {
  //   background: #b9b9b9;
  //   border-radius: 8px;
  // }
}
.line {
  height: 80%;
  width: 4px;
  background-color: #4192d3;
}
</style>
<style lang="less">
.contract_firstRow {
  background-color: #4192d3 !important;
  color: #fff;
  font-size: 14px;
}
.hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.hover-row .filstColumn {
  color: #666;
}
.MainContent .select_date {
  width: 240px !important;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
</style>
<!--
 * @Description: 条款明细组件
 * @Date: 2022-12-08 10:16:37
 * @LastEditTime: 2023-01-11 20:46:48
-->

<template>
  <el-dialog width="98%" ref="termDialog" class="termDialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
    <div class="dialogContent">
      <div class="termTableWrap">
        <el-table :data="termData" ref="termDialog" style="width: 100%" :span-method="mergeColumnMethod" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
          <el-table-column align="center" width="760" fixed="left">
            <template v-slot:header>
              <div class="topInfoWrap">
                <span class="topInfo"> 客户名称: {{ termInfo.customerName }}</span>
                <span class="topInfo" v-if="termInfo.channelCode === 'RKA'"> 大区: {{ termInfo.regionName }}</span>
                <br />
                <span class="topTarget"> 目标销售额(含税,¥): {{ FormateNum(termInfo.saleAmount) }} </span>
                <span class="topTarget"> 目标销售额(未税,¥): {{ FormateNum(termInfo.saleAmountNoTax) }} </span>
              </div>
            </template>
            <template>
              <el-table-column align="center" width="760" fixed="left">
                <template v-slot:header> </template>
                <template>
                  <el-table-column align="center" fixed="left" width="140">
                    <template v-slot:header> </template>
                    <template slot-scope="scope">
                      <div v-show="scope.row.isTotal != 2">
                        {{ scope.row.type }}
                      </div>
                      <div v-show="scope.row.isTotal == 2">
                        <div class="addNewRowWrap">
                          <div class="addNewRow" @click="addNewRowToVariable(scope.$index)">
                            <i class="el-icon-plus"></i>
                            <span class="addNewRowText">新增一行</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="contractItem" fixed="left" align="center" label="contract item" width="160">
                    <template slot-scope="scope">
                      <div v-if="!scope.row.isTotal">
                        <div v-if="scope.row.isNewData">
                          <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择" @change="changeContractItem(scope.row.isVariable ? 0 : 1, scope.row, scope.row.contractItem)">
                            <el-option v-for="(item, index) in scope.row.isVariable ? contractItemVariableList : contractItemFixList" :key="index" :label="item.name" :value="index" />
                          </el-select>
                        </div>
                        <div v-if="!scope.row.isNewData">
                          {{ scope.row.isVariable?contractItemVariableList[scope.row.contractItem].name:contractItemFixList[scope.row.contractItem].name }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="left" width="160" label="条件类型">
                    <template slot-scope="scope">
                      <div v-if="!scope.row.isTotal">
                        <div v-if="contractItemVariableList[scope.row.contractItem].conditionalIsTwo === 2 && scope.row.isNewData">
                          <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                            <el-option v-for="(item, index) in ['conditional', 'unconditional']" :key="index" :label="item" :value="item" />
                          </el-select>
                        </div>
                        <div v-else>{{ scope.row.conditions }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="costRatio" fixed="left" align="center" label="含税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal != 2">
                        <div v-if="scope.row.isNewData && scope.row.isVariable && !scope.row.isTotal" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.costRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index, scope.row)"> </el-input>
                          <span>%</span>
                        </div>
                        <div v-else>{{ FormateNum(scope.row.costRatio) }}%</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="left" label="含税费用(RMB)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isNewData && !scope.row.isVariable && !scope.row.isTotal" style="display: flex;align-items: center;">
                        <el-input v-model="scope.row.taxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index, scope.row)"> </el-input>
                      </div>
                      <div v-else>
                        {{ FormateNum(scope.row.taxCost) }}
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column align="center" width="1600">
            <template v-slot:header> </template>
            <template>
              <!-- 菲仕兰承担 -->
              <el-table-column align="center" width="300">
                <template v-slot:header>
                  菲仕兰承担
                </template>
                <template>
                  <el-table-column prop="frieslandCostRatio" align="center" label="含税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal != 2">
                        <div v-if="scope.row.isNewData && scope.row.isVariable && !scope.row.isTotal" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.frieslandCostRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeFrieslandCostRate(scope.$index, scope.row)"> </el-input>
                          <span>%</span>
                        </div>
                        <div v-else>{{ FormateNum(scope.row.frieslandCostRatio) }} %</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="含税金额(¥)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal != 2">
                        <div v-if="scope.row.isNewData && !scope.row.isVariable && !scope.row.isTotal" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.frieslandTaxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeFrieslandCost(scope.$index, scope.row)"> </el-input>
                        </div>
                        <div v-else>
                          {{ FormateNum(scope.row.frieslandTaxCost) }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
              <!-- 经销商承担 -->
              <el-table-column align="center" width="300">
                <template v-slot:header>
                  经销商承担
                </template>
                <template>
                  <el-table-column prop="distCostRatio" align="center" label="含税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal != 2">{{ FormateNum(scope.row.distCostRatio) }}%</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="含税金额(RMB)" width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal != 2">
                        {{ FormateNum(scope.row.distTaxCost) }}
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
              <!-- 菲仕兰承担 -->
              <el-table-column align="center" width="600">
                <template v-slot:header>
                  菲仕兰承担
                </template>
                <template>
                  <el-table-column prop="frieslandCustomerTaxPoint" align="center" width="150" label="客户扣款税点">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal == 0">
                        <el-select v-if="scope.row.isNewData" @clear="clearFrieslandCustomerTaxPoint( scope.$index,scope.row, scope.row.type)" v-model="scope.row.frieslandCustomerTaxPoint" @change="changeCustomerTaxPoint( scope.$index,scope.row, scope.row.type)"  class="my-el-select_dialog" filterable clearable placeholder="请选择">
                          <el-option v-for="(item, index) in CustomerDeductionsAndPayType" :key="index" :label="item.CustomerDeduction + '%'" :value="index" />
                        </el-select>
                        <div v-if="!scope.row.isNewData && scope.row.frieslandCustomerTaxPoint !== null&& scope.row.frieslandCustomerTaxPoint !== ''">{{ CustomerDeductionsAndPayType[scope.row.frieslandCustomerTaxPoint].CustomerDeduction }}%</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-slot="{ row }" prop="frieslandPayType" align="center" width="150" label="支付方式">
                    <div v-if="row.isTotal == 0&&row.frieslandCustomerTaxPoint!==''">
                      <div v-if="row.isNewData">
                        <el-select v-model="row.frieslandPayType" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                          <el-option v-for="(item, index) in CustomerDeductionsAndPayType[row.frieslandCustomerTaxPoint].payTypeList" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                      </div>
                      <div v-if="!row.isNewData">
                        {{ getPayTypeName(row.frieslandPayType) }}
                        <!-- {{CustomerDeductionsAndPayType[row.frieslandCustomerTaxPoint]["payTypeList"][row.frieslandPayType]["label"]}} -->
                      </div>
                    </div>
                  </el-table-column>
                  <el-table-column prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-show="scope.row.isTotal != 2">{{ FormateNum(scope.row.frieslandCostRatioNoTax) }}%</div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="未税费用(¥)" width="150">
                    <template slot-scope="scope">
                      <div v-show="scope.row.isTotal != 2">
                        {{ FormateNum(scope.row.frieslandTaxCostNoTax) }}
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
              <!-- 描述 -->
              <el-table-column align="center" width="400">
                <template v-slot:header> </template>
                <template>
                  <el-table-column prop="remark" align="left" label="描述" width="400">
                    <template slot-scope="scope">
                      <div v-show="scope.row.isNewData" class="TermDetail">
                        <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述"> </el-input>
                        <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(scope.$index)" />
                      </div>
                      <div v-show="!scope.row.isNewData" class="detailText">
                        {{ scope.row.remark }}
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmTermsDetail()">确 定</el-button>
      <el-button @click="closeTermsDetail">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from '@/api/ContractEntry/customer'
import { formatThousandNum, CustomerDeductionsAndPayType } from '@/utils'
import { add, sub, mul, div, BigToFixed } from '@/utils/Big.js'
export default {
  name: 'TermDetailDialog',

  data() {
    return {
      contractItemVariableList: [],
      contractItemFixList: [],
      isTermsDetailVisible: false, //条款明细弹窗
      termInfo: {}, //条款明细信息
      termTotalData: [],
      termVariableTotalData: [],
      termFixTotalData: [],
      termVariableData: [],
      termFixData: [],
      termData: [], //所有明细数据（Total+variable+variable Total+Fixed +Fixed Total）
      //VariableData+FixData
      TotalData: {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      },
      VariableTotalData: {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      },
      FixTotalData: {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      },
      CustomerDeductionsAndPayType: CustomerDeductionsAndPayType,
      isEditor: false, //是否编辑
      customerId: '', //客户id
    }
  },
  props: {},
  computed: {},
  mounted() {
    this.getContractItemList()
  },

  methods: {
    // 获取ContractItem
    getContractItemList() {
      API.getContractItemList().then(res => {
        if (res.code === 1000) {
          this.contractItemFixList = []
          this.contractItemVariableList = []
          let list = res.data
          //区分variable 和 fixed
          list.forEach(item => {
            if (item.conditionType && item.variablePoint) {
              item.name = item.contractItem
              item.code = item.contractItemCode
              item.conditionType = item.conditionType
              if (item.conditionType.indexOf(',') != -1) {
                item.conditionalIsTwo = 2
              } else {
                item.conditionalIsTwo = 1
              }
              if (item.variablePoint.indexOf('variable') != -1) {
                item.isVariableOrFix = 0
              }
              if (item.variablePoint.indexOf('fix') != -1) {
                item.isVariableOrFix = 1
              }
              if (item.variablePoint.indexOf('fix') != -1 && item.variablePoint.indexOf('variable') != -1) {
                item.isVariableOrFix = 2
              }
            }
          })
          list.forEach(item => {
            if (item.isVariableOrFix === 0) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType
              })
            }
            if (item.isVariableOrFix === 1) {
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType
              })
            }
            if (item.isVariableOrFix === 2) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType
              })
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType
              })
            }
          })
        }
      })
    },
    // 重置数据
    resetData() {
      // 多个变量进行赋值
      this.TotalData={
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      }
      this.VariableTotalData={
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      }
      this.FixTotalData={
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      }
    },
    //获取客户合同明细数据
    getContractTermData(isEditor, id) {
      this.customerId=id
      this.isEditor = isEditor
      this.resetData()
      API.findOneSaveDetail({
        id: id,
        isMain: 1,
        isDetail: 1
      }).then(res => {
        if (res.code === 1000) {
          this.termVariableData = []
          this.termFixData = []
          // let data = res.data
          this.termInfo = res.data
          //目标销售额（未税）
          this.termInfo.saleAmountNoTax = BigToFixed(div(this.termInfo.saleAmount, 1.13))
          let variableListOrigin = this.termInfo.variable
          let variableList = []
          //获取total +variable total
          variableListOrigin.forEach(item => {
            let obj = {
              id: item.id,
              type: item.type,
              contractItem: this.getContractItemByCode(0, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              frieslandCostRatio: item.fcCostRatio, //菲仕兰承担含税费比
              frieslandTaxCost: item.fcTaxCost, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: item.fcExclTaxCostRatio, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: item.fcExclTaxCost, //菲仕兰承担未税金额
              distCostRatio: item.distributorCostRatio, //经销商承担含税费比
              distTaxCost: item.distributorTaxCost, //经销商承担含税金额
              frieslandCustomerTaxPoint: this.getCustomerTaxPoint(item.deductionTaxRate), //菲仕兰承担--客户扣款税点
              frieslandPayType: Number(item.payType), //菲仕兰承担--支付方式
              remark: item.remark,
              isNewData: isEditor, //是否未新添数据
              isVariable: 1, //是否variable 行
              isTotal: 0 //是否total 行
            }
            variableList.push(obj)
            // this.TotalData.totalCost += item.taxCost
            // this.TotalData.totalPoint += item.costRatio
            this.VariableTotalData.totalCost += item.taxCost
            this.VariableTotalData.totalPoint += item.costRatio
            this.VariableTotalData.frieslandCostRatio += item.fcCostRatio
            this.VariableTotalData.frieslandTaxCost += item.fcTaxCost
            this.VariableTotalData.frieslandCostRatioNoTax += item.fcExclTaxCostRatio
            this.VariableTotalData.frieslandTaxCostNoTax += item.fcExclTaxCost
            this.VariableTotalData.distCostRatio += item.distributorCostRatio
            this.VariableTotalData.distTaxCost += item.distributorTaxCost
          })
          let fixedListOrigin = this.termInfo.fixed
          let fixList = []
          //获取total +fixed total
          fixedListOrigin.forEach(item => {
            let obj = {
              id: item.id,
              type: item.type,
              contractItem: this.getContractItemByCode(1, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              frieslandCostRatio: item.fcCostRatio, //菲仕兰承担含税费比
              frieslandTaxCost: item.fcTaxCost, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: item.fcExclTaxCostRatio, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: item.fcExclTaxCost, //菲仕兰承担未税金额
              distCostRatio: item.distributorCostRatio, //经销商承担含税费比
              distTaxCost: item.distributorTaxCost, //经销商承担含税金额
              frieslandCustomerTaxPoint: this.getCustomerTaxPoint(item.deductionTaxRate), //菲仕兰承担--客户扣款税点
              frieslandPayType: Number(item.payType), //菲仕兰承担--支付方式
              remark: item.remark,
              isNewData: isEditor, //是否未新添数据
              isVariable: 0, //是否variable 行
              isTotal: 0 //是否total 行
            }
            fixList.push(obj)
            // this.TotalData.totalCost += item.taxCost
            // this.TotalData.totalPoint += item.costRatio
            this.FixTotalData.totalCost += item.taxCost
            this.FixTotalData.totalPoint += item.costRatio
            this.FixTotalData.frieslandCostRatio += item.fcCostRatio
            this.FixTotalData.frieslandTaxCost += item.fcTaxCost
            this.FixTotalData.frieslandCostRatioNoTax += item.fcExclTaxCostRatio
            this.FixTotalData.frieslandTaxCostNoTax += item.fcExclTaxCost
            this.FixTotalData.distCostRatio += item.distributorCostRatio
            this.FixTotalData.distTaxCost += item.distributorTaxCost
          })
          //设置Total 数据
          this.TotalData.totalCost = add(this.VariableTotalData.totalCost, this.FixTotalData.totalCost)
          this.TotalData.totalPoint = add(this.VariableTotalData.totalPoint, this.FixTotalData.totalPoint)
          this.TotalData.frieslandCostRatio = add(this.VariableTotalData.frieslandCostRatio, this.FixTotalData.frieslandCostRatio)
          this.TotalData.frieslandTaxCost = add(this.VariableTotalData.frieslandTaxCost, this.FixTotalData.frieslandTaxCost)
          this.TotalData.frieslandCostRatioNoTax = add(this.VariableTotalData.frieslandCostRatioNoTax, this.FixTotalData.frieslandCostRatioNoTax)
          this.TotalData.frieslandTaxCostNoTax = add(this.VariableTotalData.frieslandTaxCostNoTax, this.FixTotalData.frieslandTaxCostNoTax)
          this.TotalData.distCostRatio = add(this.VariableTotalData.distCostRatio, this.FixTotalData.distCostRatio)
          this.TotalData.distTaxCost = add(this.VariableTotalData.distTaxCost, this.FixTotalData.distTaxCost)
          this.termTotalData.push({
            type: 'Total',
            contractItem: '',
            conditionType: '',
            costRatio: this.TotalData.totalPoint,
            taxCost: this.TotalData.totalCost,
            ...this.TotalData,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1 //是否total 行
          })
          //variable  -- 设置variable
          this.termVariableData = [...this.termVariableData, ...variableList]
          //variable  -- 设置variable total
          this.termVariableTotalData.push({
            type: 'Variable total',
            contractItem: '',
            conditionType: '',
            costRatio: this.VariableTotalData.totalPoint,
            taxCost: this.VariableTotalData.totalCost,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1,
            ...this.VariableTotalData
          })
          //Fixed  -- Fixed
          this.termFixData = [...this.termFixData, ...fixList]
          //Fixed  -- Fixed total
          this.termFixTotalData.push({
            type: 'Fixed total',
            contractItem: '',
            conditionType: '',
            costRatio: this.FixTotalData.totalPoint,
            taxCost: this.FixTotalData.totalCost,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1,
            ...this.FixTotalData
          })
          this.isTermsDetailVisible = true
          //新增一行
          let insertRow = {
            type: '新增一行',
            contractItem: '',
            conditionType: '',
            costRatio: '',
            taxCost: '',
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 2 //是否total 行    2：新增一行
          }
          if (isEditor) {
            //有新增按钮
            this.termData = [...this.termTotalData, ...this.termVariableData, insertRow, ...this.termVariableTotalData, ...this.termFixData, insertRow, ...this.termFixTotalData]
          } else {
            //无新增按钮
            this.termData = [...this.termTotalData, ...this.termVariableData, ...this.termVariableTotalData, ...this.termFixData, ...this.termFixTotalData]
          }

          console.log(this.termData)
        }
      })
    },
    //根据客户扣款税点 查index
    getCustomerTaxPoint(rate) {
      let num = this.CustomerDeductionsAndPayType.findIndex(item => item.CustomerDeduction == rate)
      if (num != -1) {
        return num
      } else {
        return ''
      }
    },
    getPayTypeName(value) {
      let getPayTypeName = ''
      this.CustomerDeductionsAndPayType.forEach(item => {
        item.payTypeList.forEach(payItem => {
          if (payItem.value == value) {
            getPayTypeName = payItem.label
          }
        })
      })
      return getPayTypeName
    },
    //根据1/2/3 查名字
    getPaymentMethodText(rate, MethodValue) {
      let index = this.CustomerDeductionsAndPayType.findIndex(item => item.CustomerDeduction == rate)
      let num = this.CustomerDeductionsAndPayType[index].payTypeList.findIndex(item => item.value == MethodValue)
      if (num != -1) {
        return this.CustomerDeductionsAndPayType[index].payTypeList[num].label
      }
    },
    //更改ContractItem --》改变条件类型
    changeContractItem(flag, row, value) {
      if (!flag) {
        if (this.contractItemVariableList[value].conditionalIsTwo === 2) {
          row.conditions = ''
        } else {
          row.conditions = this.contractItemVariableList[value].conditionType
        }
      } else {
        if (this.contractItemFixList[value].conditionalIsTwo === 2) {
          row.conditions = ''
        } else {
          row.conditions = this.contractItemFixList[value].conditionType
        }
      }
    },
    //通过code 获取ContractItem索引展示
    getContractItemByCode(flag, code) {
      if (!flag) {
        if (!code) {
          return 0
        }
        let index = this.contractItemVariableList.findIndex(item => item.code == code)
        //variable
        return index != -1 ? index : 0
      } else {
        if (!code) {
          return 0
        }
        let index = this.contractItemFixList.findIndex(item => item.code == code)
        //fix
        return index != -1 ? index : 0
      }
    },
    //条款明细保存
    confirmTermsDetail() {
      let isCheck = 1 //费比校验
      let Repeat = 0 //contract Item  是否重复
      let payTypeIsEmpty = 0 //付款方式是否为空
      if (!this.isEditor) {
        //已经通过不能进行编辑，仅能查看
        this.closeTermsDetail()
        return
      }
      let obj = {
        ccId: this.customerId,
        variable: [],
        fixed: []
      }
      this.termVariableData = this.termData.filter(item => {
        return item.type == 'Variable'
      })
      this.termFixData = this.termData.filter(item => {
        return item.type == 'Fixed'
      })
      this.termVariableData.forEach(item => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 支付方式 ）不能重复
          let RepeatList = this.termVariableData.filter(vItem => {
            return vItem.contractItem == item.contractItem && vItem.conditions == item.conditions && vItem.frieslandPayType == item.frieslandPayType
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          if(item.frieslandPayType==''||item.frieslandPayType==null){
            payTypeIsEmpty = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem: this.contractItemVariableList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
            fcCostRatio: item.frieslandCostRatio, //菲仕兰 - 费比（%）
            fcTaxCost: item.frieslandTaxCost, //菲仕兰 - 含税费用(¥）
            distributorCostRatio: item.distCostRatio, //经销商 - 费比（%）
            distributorTaxCost: item.distTaxCost, //经销商 - 含税费用(¥）
            deductionTaxRate: CustomerDeductionsAndPayType[item.frieslandCustomerTaxPoint].CustomerDeduction, //客户扣款税点
            payType: item.frieslandPayType, //支付方式：1 PO  2 红票 3 票扣
            fcExclTaxCostRatio: item.frieslandCostRatioNoTax, //菲仕兰-未税费比（%）
            fcExclTaxCost: item.frieslandTaxCostNoTax //菲仕兰-未税含税费用(¥）
          }
          obj.variable.push(detailObj)
        }
      })
      this.termFixData.forEach(item => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 ）不能重复
          let RepeatList = this.termFixData.filter(vItem => {
            return vItem.contractItem == item.contractItem && vItem.conditions == item.conditions && vItem.frieslandPayType == item.frieslandPayType
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          if(item.frieslandPayType==''||item.frieslandPayType==null){
            payTypeIsEmpty = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem: this.contractItemFixList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
            fcCostRatio: item.frieslandCostRatio, //菲仕兰 - 费比（%）
            fcTaxCost: item.frieslandTaxCost, //菲仕兰 - 含税费用(¥）
            distributorCostRatio: item.distCostRatio, //经销商 - 费比（%）
            distributorTaxCost: item.distTaxCost, //经销商 - 含税费用(¥）
            deductionTaxRate: CustomerDeductionsAndPayType[item.frieslandCustomerTaxPoint].CustomerDeduction, //客户扣款税点
            payType: item.frieslandPayType, //支付方式：1 PO  2 红票 3 票扣
            fcExclTaxCostRatio: item.frieslandCostRatioNoTax, //菲仕兰-未税费比（%）
            fcExclTaxCost: item.frieslandTaxCostNoTax //菲仕兰-未税含税费用(¥）
          }
          obj.fixed.push(detailObj)
        }
      })
      if (this.TotalData.totalPoint > 100) {
        this.$message.info('Total 费比应该小于100%')
        return
      }
      if (this.TotalData.totalCost > this.termInfo.saleAmount) {
        this.$message.info('Total 含税费用应该小于目标销售额')
        return
      }
      if (!isCheck) {
        this.$message.info('费比不能为空,请填写费比')
        return
      }
      if (Repeat) {
        this.$message.info('数据重复：Contract Item+条件类型+支付方式')
        return
      }
      if(payTypeIsEmpty) {
        this.$message.info('支付方式不能为空')
        return
      }
      console.log(obj)
      API.saveDetail(obj).then(res => {
        if (res.code === 1000) {
          this.closeTermsDetail()
          this.$parent.getTableData()
          this.$message.success('客户明细保存成功')
        }
      })
    },
    //条款明细关闭
    closeTermsDetail() {
      this.termTotalData = []
      this.termVariableTotalData = []
      this.termFixTotalData = []
      this.termVariableData = []
      this.termFixData = []
      this.FixTotalData.totalPoint = 0
      this.FixTotalData.totalCost = 0
      this.VariableTotalData.totalPoint = 0
      this.VariableTotalData.totalCost = 0
      this.TotalData.totalPoint = 0
      this.TotalData.totalCost = 0
      this.isTermsDetailVisible = false
      this.$parent.getTableData()
      // this.isEditor=0 //编辑弹窗
    },
    //新增条款--variable
    addNewRowToVariable(index) {
      //获取variable Total 、Fixed Total 索引
      let VariableTotalIndex = this.termData.findIndex(item => item.type == 'Variable total')
      let FixedTotalIndex = this.termData.findIndex(item => item.type == 'Fixed total')
      if (index == VariableTotalIndex - 1) {
        //新添元素更改位置
        let insertObj = {
          type: 'Variable',
          contractItem: 0,
          conditions: '',
          costRatio: 0,
          taxCost: 0,
          frieslandCostRatio: 0, //菲仕兰承担含税费比
          frieslandTaxCost: 0, //菲仕兰承担含税金额
          frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
          frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
          distCostRatio: 0, //经销商承担含税费比
          distTaxCost: 0, //经销商承担含税金额
          frieslandCustomerTaxPoint: 0, //菲仕兰承担--客户扣款税点
          frieslandPayType: '', //菲仕兰承担--支付方式
          remark: '',
          isVariable: 1,
          isTotal: 0,
          isNewData: 1 //是否未新添数据
        }
        this.termData.splice(index, 0, insertObj)
        //滚动条随着新增滚动到底部
        let scrollHeight = this.$refs.termDialog.bodyWrapper.scrollHeight
        this.$nextTick(function() {
          this.$refs.termDialog.bodyWrapper.scrollTop = scrollHeight
        })
      }
      if (index == FixedTotalIndex - 1) {
        //新添元素更改位置
        let insertObj = {
          type: 'Fixed',
          contractItem: 0,
          conditions: this.contractItemFixList[0].conditionalIsTwo == 2 ? '' : this.contractItemFixList[0].conditionType,
          costRatio: 0,
          taxCost: 0,
          frieslandCostRatio: 0, //菲仕兰承担含税费比
          frieslandTaxCost: 0, //菲仕兰承担含税金额
          frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
          frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
          distCostRatio: 0, //经销商承担含税费比
          distTaxCost: 0, //经销商承担含税金额
          frieslandCustomerTaxPoint: 0, //菲仕兰承担--客户扣款税点
          frieslandPayType: '', //菲仕兰承担--支付方式
          remark: '',
          isVariable: 0,
          isTotal: 0,
          isNewData: 1 //是否未新添数据
        }
        this.termData.splice(index, 0, insertObj)
        //滚动条随着新增滚动到底部
        let scrollHeight = this.$refs.termDialog.bodyWrapper.scrollHeight
        this.$nextTick(function() {
          this.$refs.termDialog.bodyWrapper.scrollTop = scrollHeight
        })
      }

      //scrollTop
    },
    //删除条款明细
    deleteTerm(index) {
      this.termData.splice(index, 1)
      this.getNewTotalData()
    },
    //费比更改
    changeCostRate(index, row) {
      this.termData[index].taxCost = BigToFixed(mul(this.termInfo.saleAmount, div(row.costRatio, 100)))
      //菲仕兰承担更改
      this.termData[index].frieslandCostRatio = row.costRatio
      this.changeFrieslandCostRate(index,row)
      this.getNewTotalData()
    },
    //含税费用更改
    changeCost(index, row) {
      this.termData[index].costRatio = BigToFixed(mul(div(row.taxCost, this.termInfo.saleAmount), 100))
      this.termData[index].frieslandTaxCost=row.taxCost
      this.changeFrieslandCost(index,row)
      this.getNewTotalData()
    },
    //菲仕兰承担含税费比更改
    changeFrieslandCostRate(index, row) {
      this.termData[index].frieslandTaxCost = BigToFixed(mul(this.termInfo.saleAmount, div(row.frieslandCostRatio, 100)))
      this.termData[index].distCostRatio = BigToFixed(sub(row.costRatio, row.frieslandCostRatio))
      this.termData[index].distTaxCost = BigToFixed(mul(this.termInfo.saleAmount, div(this.termData[index].distCostRatio, 100)))
      this.changeCustomerTaxPoint(index,row,row.type)
      this.getNewTotalData()
    },
    clearFrieslandCustomerTaxPoint(index, row) {
      this.termData[index].frieslandCostRatioNoTax=0
      this.termData[index].frieslandTaxCostNoTax=0
      this.termData[index].frieslandPayType = ''
    },
    //菲仕兰承担含税金额更改
    changeFrieslandCost(index, row) {
      this.termData[index].frieslandCostRatio = BigToFixed(mul(div(row.frieslandTaxCost, this.termInfo.saleAmount), 100))
      this.termData[index].distTaxCost = BigToFixed(sub(row.taxCost, row.frieslandTaxCost))
      this.termData[index].distCostRatio = BigToFixed(mul(div(this.termData[index].distTaxCost, this.termInfo.saleAmount), 100))
      this.changeCustomerTaxPoint(index,row,row.type)
      this.getNewTotalData()
    },
    //更改客户扣款税点--》未税费比、未税费用
    changeCustomerTaxPoint(index, row, type) {
      let CustomerDeduction = CustomerDeductionsAndPayType[row.frieslandCustomerTaxPoint].CustomerDeduction
      let CustomerDeductionNum = div(CustomerDeduction, 100)
      if (type.includes('Variable')) {
        this.termData[index].frieslandCostRatioNoTax = BigToFixed(mul(row.frieslandCostRatio, div(1.13, add(1, CustomerDeductionNum))))
        this.termData[index].frieslandTaxCostNoTax = BigToFixed(mul(div(this.termData[index].frieslandCostRatioNoTax, 100), this.termInfo.saleAmountNoTax))
      }
      if (type.includes('Fixed')) {
        this.termData[index].frieslandTaxCostNoTax = BigToFixed(div(row.frieslandTaxCost, add(1, CustomerDeductionNum)))
        this.termData[index].frieslandCostRatioNoTax = BigToFixed(mul(div(this.termData[index].frieslandTaxCostNoTax, this.termInfo.saleAmountNoTax), 100))
      }
      this.termData[index].frieslandPayType = ''
      this.getNewTotalData()
    },
    // 获取total 数据
    getTotalData() {
      this.TotalData.totalCost = this.termVariableData[0].taxCost
      this.TotalData.totalPoint = this.termVariableData[0].costRatio
    },
    getNewTotalData() {
      //获取variable Total 、Fixed Total 索引
      let VariableTotalIndex = this.termData.findIndex(item => item.type == 'Variable total')
      let FixedTotalIndex = this.termData.findIndex(item => item.type == 'Fixed total')
      //重置variable total
      this.VariableTotalData = {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      }
      //重置fixed total
      this.FixTotalData = {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0 //经销商承担含税金额
      }
      //获取VariableData Total
      this.termData.forEach(item => {
        if (item.type == 'Variable') {
          this.VariableTotalData.totalPoint = add(this.VariableTotalData.totalPoint, item.costRatio)
          this.VariableTotalData.totalCost = add(this.VariableTotalData.totalCost, item.taxCost)
          this.VariableTotalData.frieslandCostRatio = add(this.VariableTotalData.frieslandCostRatio, item.frieslandCostRatio)
          this.VariableTotalData.frieslandTaxCost = add(this.VariableTotalData.frieslandTaxCost, item.frieslandTaxCost)
          this.VariableTotalData.frieslandCostRatioNoTax = add(this.VariableTotalData.frieslandCostRatioNoTax, item.frieslandCostRatioNoTax)
          this.VariableTotalData.frieslandTaxCostNoTax = add(this.VariableTotalData.frieslandTaxCostNoTax, item.frieslandTaxCostNoTax)
          this.VariableTotalData.distCostRatio = add(this.VariableTotalData.distCostRatio, item.distCostRatio)
          this.VariableTotalData.distTaxCost = add(this.VariableTotalData.distTaxCost, item.distTaxCost)
        }
        if (item.type == 'Fixed') {
          this.FixTotalData.totalPoint = add(this.FixTotalData.totalPoint, item.costRatio)
          this.FixTotalData.totalCost = add(this.FixTotalData.totalCost, item.taxCost)
          this.FixTotalData.frieslandCostRatio = add(this.FixTotalData.frieslandCostRatio, item.frieslandCostRatio)
          this.FixTotalData.frieslandTaxCost = add(this.FixTotalData.frieslandTaxCost, item.frieslandTaxCost)
          this.FixTotalData.frieslandCostRatioNoTax = add(this.FixTotalData.frieslandCostRatioNoTax, item.frieslandCostRatioNoTax)
          this.FixTotalData.frieslandTaxCostNoTax = add(this.FixTotalData.frieslandTaxCostNoTax, item.frieslandTaxCostNoTax)
          this.FixTotalData.distCostRatio = add(this.FixTotalData.distCostRatio, item.distCostRatio)
          this.FixTotalData.distTaxCost = add(this.FixTotalData.distTaxCost, item.distTaxCost)
        }
      })
      //设置 variable total 到table
      if (VariableTotalIndex != -1) {
        ;(this.termData[VariableTotalIndex].costRatio = this.VariableTotalData.totalPoint), (this.termData[VariableTotalIndex].taxCost = this.VariableTotalData.totalCost), Object.assign(this.termData[VariableTotalIndex], this.VariableTotalData)
      }
      //设置 fixed total 到table
      if (FixedTotalIndex != -1) {
        ;(this.termData[FixedTotalIndex].costRatio = this.FixTotalData.totalPoint), (this.termData[FixedTotalIndex].taxCost = this.FixTotalData.totalCost), Object.assign(this.termData[FixedTotalIndex], this.FixTotalData)
      }
      //获取所有VariableData Total+FixData Total
      this.TotalData.totalCost = add(this.VariableTotalData.totalCost, this.FixTotalData.totalCost)
      this.TotalData.totalPoint = add(this.VariableTotalData.totalPoint, this.FixTotalData.totalPoint)
      this.TotalData.frieslandCostRatio = add(this.VariableTotalData.frieslandCostRatio, this.FixTotalData.frieslandCostRatio)
      this.TotalData.frieslandTaxCost = add(this.VariableTotalData.frieslandTaxCost, this.FixTotalData.frieslandTaxCost)
      this.TotalData.frieslandCostRatioNoTax = add(this.VariableTotalData.frieslandCostRatioNoTax, this.FixTotalData.frieslandCostRatioNoTax)
      this.TotalData.frieslandTaxCostNoTax = add(this.VariableTotalData.frieslandTaxCostNoTax, this.FixTotalData.frieslandTaxCostNoTax)
      this.TotalData.distCostRatio = add(this.VariableTotalData.distCostRatio, this.FixTotalData.distCostRatio)
      this.TotalData.distTaxCost = add(this.VariableTotalData.distTaxCost, this.FixTotalData.distTaxCost)
      this.setAllTotalData()
    },
    setAllTotalData() {
      this.termData[0].costRatio = this.TotalData.totalPoint
      this.termData[0].taxCost = this.TotalData.totalCost
      Object.assign(this.termData[0], this.TotalData)
    },
    //弹窗表格样式
    tableRowClassNameDialog({ row, rowIndex }) {
      if (row.type.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.type.indexOf('total') != -1) {
        return 'first-row'
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
      return formatThousandNum(num)
    },
    pickerOptionsSystemDate(row) {
      return pickerOptionsSystemDate(row)
    },
    // 合并列
    mergeColumnMethod({ row, column, rowIndex, columnIndex }) {
      if (row.type == '新增一行') {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detailText {
  text-align: left;
}
.seeActivity {
  height: 32px;
  background: #d7e8f2;
  border-radius: 6px;
  font-size: 16px;
  color: #4192d3;
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
.my-el-input_dialog {
  width: 150px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 150px !important;
  }
  .el-input--suffix {
    width: 150px !important;
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
    margin-bottom: 10px;
    .termItem {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
    }
  }
  .termTableWrap {
    width: 100%;
    border: 1px solid #e7e7e7;
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
  }
}
.my-el-inputNumber {
  width: 120px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 120px;
  }
  .el-input--suffix {
    width: 120px !important;
  }
}
.my-el-detail {
  width: 280px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 280px;
  }
  .el-input--suffix {
    width: 280px !important;
  }
}
.TermDetail {
  display: flex;
  align-items: center;
  justify-content: center;
  .my-el-detail {
    width: 400px !important;
    margin: 0 auto;
  }
}
.tooltip {
  border-radius: 10px;
}
.Tip {
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  margin: 3px 0;
}
.tip {
  color: #4192d3;
  font-size: 14px;
  margin-bottom: 10px;
}
.tipStar {
  font-size: 12px;
  color: #4192d3;
}
.topInfoWrap {
  letter-spacing: 2px;
  .topTarget {
    margin-left: 20px;
  }
}
</style>
<style lang="less">
.termDialog {
  .el-dialog {
    margin-top: 1vh !important;
    top: 50%;
    transform: translateY(-50%);
    .el-dialog__body {
      padding: 20px 20px !important;
    }
  }
  .el-dialog__header {
    height: 50px;
    padding: 0 0 0 20px;
    background-color: #4192d3;
  }
  .el-dialog__title {
    font-size: 16px;
    font-family: Source Han Sans CN Light;
    font-weight: bold;
    color: #fff;
    line-height: 50px;
  }
  .el-dialog__headerbtn {
    top: 16px;
    .el-dialog__close {
      color: #fff;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    .el-button--default {
      width: 122px;
      height: 37px;
      background: #ffffff;
      border: 1px solid #4192d3;
      border-radius: 5px;
      color: #4192d3;
    }
    .el-button--primary {
      width: 120px;
      height: 37px;
      background: #4192d3;
      border-radius: 5px;
      border: 1px solid #4192d3;
      background-color: #4192d3;
    }
    .el-button + .el-button {
      margin-left: 15px;
    }
  }
  .el-downloadFileBar {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button--primary {
      width: 122px;
      height: 41px;
      line-height: 41px;
      border-radius: 8px;
      margin-bottom: 0;
      padding: 0;
    }
    .el-button--primary.is-plain:active {
      background: #fff;
      border-color: #4192d3;
      color: #4192d3;
    }
    .el-button--primary.is-plain {
      width: 122px;
      background: #fff;
      border-color: #4192d3;
      color: #4192d3;
    }
  }
  .tableWrap {
    width: 100%;
    max-height: 400px;
    margin-top: 20px;
    font-size: 14px;
    font-family: Source Han Sans CN Light;
    font-weight: 400;
    color: #333333;
  }
}
.termDialog .el-dialog__body {
  padding: 10px 20px;
}
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
.termTableWrap .hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.termTableWrap .hover-row .filstColumn {
  color: #666;
}

.my-el-select_dialog {
  width: 120px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 120px;
  }
  .el-input--suffix {
    width: 120px !important;
  }
}
.MainContent .select_date {
  width: 240px !important;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
.termTableWrap {
  width: 100%;
  border: 1px solid #e7e7e7;
  .el-table {
    td {
      padding: 4px 0 !important;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: center;
    }
    th {
      padding: 4px 0 !important;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: center;
    }
  }
}
</style>

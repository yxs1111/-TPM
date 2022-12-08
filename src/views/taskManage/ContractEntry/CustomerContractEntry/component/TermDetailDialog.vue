<!--
 * @Description: 条款明细组件
 * @Date: 2022-12-08 10:16:37
 * @LastEditTime: 2022-12-08 10:25:51
-->

<template>
  <el-dialog width="98%" ref="termDialog" class="termDialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
    <div class="dialogContent">
      <div class="termTableWrap">
        <el-table :data="termData" style="width: 100%" :span-method="mergeColumnMethod" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
          <el-table-column align="center" width="760" fixed="left">
            <template v-slot:header>
              <div class="topInfoWrap">
                <span class="topInfo"> 客户名称: {{termInfo.customerName}}</span>
                <span class="topInfo" v-if="termInfo.channelCode==='RKA'"> 大区: {{termInfo.regionName}}</span>
                <br />
                <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(termInfo.saleAmount)}} </span>
                <span class="topTarget"> 目标销售额(未税,¥): {{FormateNum(termInfo.saleAmountNoTax)}} </span>
              </div>
            </template>
            <template>
              <el-table-column align="center" width="760" fixed="left">
                <template v-slot:header>
                </template>
                <template>
                  <el-table-column align="center" fixed="left" width="140">
                    <template v-slot:header> </template>
                    <template slot-scope="scope">
                      <div v-show="(scope.row.isTotal!=2)">
                        {{ scope.row.type }}
                      </div>
                      <div v-show="(scope.row.isTotal==2)">
                        <div class="addNewRowWrap">
                          <div class="addNewRow" @click="addNewRowToVariable">
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
                          <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                            @change="changeContractItem(0,scope.row,scope.row.contractItem)">
                            <el-option v-for="(item, index) in contractItemVariableList" :key="index" :label="item.name" :value="index" />
                          </el-select>
                        </div>
                        <div v-if="!scope.row.isNewData">
                          {{contractItemVariableList[scope.row.contractItem].name}}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="left" width="160" label="条件类型">
                    <template slot-scope="scope">
                      <div v-if="!scope.row.isTotal">
                        <div v-if="contractItemVariableList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                          <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                            <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                          </el-select>
                        </div>
                        <div v-else>{{scope.row.conditions}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="costRatio" fixed="left" align="center" label="含税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-if="(scope.row.isTotal!=2)">
                        <div v-if="(scope.row.isNewData&&scope.row.isVariable&&!scope.row.isTotal)" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.costRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入"
                            @blur="changeCostRate(scope.$index,scope.row)">
                          </el-input>
                          <span>%</span>
                        </div>
                        <div v-else>
                          {{ FormateNum(scope.row.costRatio) }}%
                        </div>
                      </div>

                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="left" label="含税费用(RMB)" width="150">
                    <template slot-scope="scope">
                      <div v-if="(scope.row.isNewData&&!scope.row.isVariable&&!scope.row.isTotal)" style="display: flex;align-items: center;">
                        <el-input v-model="scope.row.taxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index,scope.row)">
                        </el-input>
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
            <template v-slot:header>

            </template>
            <template>
              <!-- 菲仕兰承担 -->
              <el-table-column align="center" width="300">
                <template v-slot:header>
                  菲仕兰承担
                </template>
                <template>
                  <el-table-column prop="frieslandCostRatio" align="center" label="含税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-if="(scope.row.isTotal!=2)">
                        <div v-if="(scope.row.isNewData&&scope.row.isVariable&&!scope.row.isTotal)" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.frieslandCostRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入"
                            @blur="changeFrieslandCostRate(scope.$index,scope.row)">
                          </el-input>
                          <span>%</span>
                        </div>
                        <div v-else>
                          {{ FormateNum(scope.row.frieslandCostRatio) }} %
                        </div>
                      </div>

                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="含税金额(¥)" width="150">
                    <template slot-scope="scope">
                      <div v-if="(scope.row.isTotal!=2)">
                        <div v-if="(scope.row.isNewData&&!scope.row.isVariable&&!scope.row.isTotal)" style="display: flex;align-items: center;">
                          <el-input v-model="scope.row.frieslandTaxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入"
                            @blur="changeFrieslandCost(scope.$index,scope.row)">
                          </el-input>
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
                      <div v-if="(scope.row.isTotal!=2)">
                        {{ FormateNum(scope.row.distCostRatio) }}%
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="含税金额(RMB)" width="150">
                    <template slot-scope="scope">
                      <div v-if="(scope.row.isTotal!=2)">
                        {{FormateNum(scope.row.distTaxCost)}}
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
                  <el-table-column prop="frieslandCustomerTaxPoint" align="center" width="150" label="客户扣缴税点">
                    <template slot-scope="scope">
                      <div v-if="scope.row.isTotal!=2">
                        <el-select v-if="scope.row.isNewData" v-model="scope.row.frieslandCustomerTaxPoint"
                          @change="changeCustomerTaxPoint(scope.row,scope.$index,scope.row.frieslandCustomerTaxPoint,scope.row.type)" class="my-el-select_dialog" filterable
                          clearable placeholder="请选择">
                          <el-option v-for="(item, index) in CustomerDeductionsAndPayType" :key="index" :label="item.CustomerDeduction+'%'" :value="index" />
                        </el-select>
                        <div v-if="(!scope.row.isNewData&&scope.row.frieslandCustomerTaxPoint!=null)">
                          {{CustomerDeductionsAndPayType[scope.row.frieslandCustomerTaxPoint].CustomerDeduction}}%
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-slot={row} prop="frieslandPayType" align="center" width="150" label="支付方式">
                    <div v-if="(row.isTotal!=2&&row.frieslandCustomerTaxPoint!=null)">
                      <el-select v-model="row.frieslandPayType" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in CustomerDeductionsAndPayType[row.frieslandCustomerTaxPoint].payTypeList" :key="index" :label="item.label"
                          :value="item.value" />
                      </el-select>
                    </div>
                  </el-table-column>
                  <el-table-column prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                    <template slot-scope="scope">
                      <div v-show="(scope.row.isTotal!=2)">
                        {{ FormateNum(scope.row.frieslandCostRatioNoTax) }}%
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="未税费用(¥)" width="150">
                    <template slot-scope="scope">
                      <div v-show="(scope.row.isTotal!=2)">
                        {{FormateNum(scope.row.frieslandTaxCostNoTax)}}
                      </div>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
              <!-- 描述 -->
              <el-table-column align="center" width="400">
                <template v-slot:header>
                </template>
                <template>
                  <el-table-column prop="remark" align="left" label="描述" width="400">
                    <template slot-scope="scope">
                      <div v-show="scope.row.isNewData" class="TermDetail">
                        <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                        </el-input>
                        <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(0,scope.$index)">
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
import termData from '../customerTermDetail'
import { add, sub, mul, div } from '@/utils/Big.js'
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
        distTaxCost: 0, //经销商承担含税金额
      },
      VariableTotalData: {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0, //经销商承担含税金额
      },
      FixTotalData: {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0, //经销商承担含税金额
      },
      CustomerDeductionsAndPayType: CustomerDeductionsAndPayType,
    }
  },

  mounted() {},

  methods: {
    //获取客户合同明细数据
    getContractTermData(index) {
      // API.findOneSaveDetail({
      //   id: this.customerId,
      //   isMain: 1,
      //   isDetail: 1,
      // }).then((res) => {
      // if (res.code === 1000) {
      this.termVariableData = []
      this.termFixData = []
      // let data = res.data
      this.termInfo = termData.data
      //目标销售额（未税）
      this.termInfo.saleAmountNoTax=63931760
      let variableListOrigin = this.termInfo.variable
      let variableList = []
      //获取total +variable total
      // let isEditor = this.isEditor && index == this.editorIndex
      let isEditor = 1
      variableListOrigin.forEach((item) => {
        let obj = {
          id: item.id,
          type: item.type,
          contractItem: this.getContractItemByCode(0, item.conditionsItem),
          conditionType: item.conditions,
          conditions: item.conditions,
          costRatio: item.costRatio,
          taxCost: item.taxCost,
          frieslandCostRatio: 0, //菲仕兰承担含税费比
          frieslandTaxCost: 0, //菲仕兰承担含税金额
          frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
          frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
          distCostRatio: 0, //经销商承担含税费比
          distTaxCost: 0, //经销商承担含税金额
          frieslandCustomerTaxPoint: null, //菲仕兰承担--客户扣款税点
          frieslandPayType: null, //菲仕兰承担--支付方式
          remark: item.remark,
          isNewData: isEditor, //是否未新添数据
          isVariable: 1, //是否variable 行
          isTotal: 0, //是否total 行
        }
        variableList.push(obj)
        // this.TotalData.totalCost += item.taxCost
        // this.TotalData.totalPoint += item.costRatio
        this.VariableTotalData.totalCost += item.taxCost
        this.VariableTotalData.totalPoint += item.costRatio
        this.VariableTotalData.frieslandCostRatio += 0
        this.VariableTotalData.frieslandTaxCost += 0
        this.VariableTotalData.frieslandCostRatioNoTax += 0
        this.VariableTotalData.frieslandTaxCostNoTax += 0
        this.VariableTotalData.distCostRatio += 0
        this.VariableTotalData.distTaxCost += 0
      })
      let fixedListOrigin = this.termInfo.fixed
      let fixList = []
      //获取total +fixed total
      fixedListOrigin.forEach((item) => {
        let obj = {
          id: item.id,
          type: item.type,
          contractItem: this.getContractItemByCode(1, item.conditionsItem),
          conditionType: item.conditions,
          conditions: item.conditions,
          costRatio: item.costRatio,
          taxCost: item.taxCost,
          frieslandCostRatio: 0, //菲仕兰承担含税费比
          frieslandTaxCost: 0, //菲仕兰承担含税金额
          frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
          frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
          distCostRatio: 0, //经销商承担含税费比
          distTaxCost: 0, //经销商承担含税金额
          frieslandCustomerTaxPoint: null, //菲仕兰承担--客户扣款税点
          frieslandPayType: null, //菲仕兰承担--支付方式
          remark: item.remark,
          isNewData: isEditor, //是否未新添数据
          isFixed: 1, //是否variable 行
          isTotal: 0, //是否total 行
        }
        fixList.push(obj)
        // this.TotalData.totalCost += item.taxCost
        // this.TotalData.totalPoint += item.costRatio
        this.FixTotalData.totalCost += item.taxCost
        this.FixTotalData.totalPoint += item.costRatio
        this.FixTotalData.frieslandCostRatio += 0
        this.FixTotalData.frieslandTaxCost += 0
        this.FixTotalData.frieslandCostRatioNoTax += 0
        this.FixTotalData.frieslandTaxCostNoTax += 0
        this.FixTotalData.distCostRatio += 0
        this.FixTotalData.distTaxCost += 0
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
        isTotal: 1, //是否total 行
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
        ...this.VariableTotalData,
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
        ...this.FixTotalData,
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
        isTotal: 2, //是否total 行    2：新增一行
      }
      //所有data汇总
      this.termData = [...this.termTotalData, ...this.termVariableData, insertRow, ...this.termVariableTotalData, ...this.termFixData, insertRow, ...this.termFixTotalData]
      console.log(this.termData)
      // }
      // })
    },
    // 获取ContractItem
    getContractItemList() {
      API.getContractItemList().then((res) => {
        if (res.code === 1000) {
          this.contractItemFixList = []
          this.contractItemVariableList = []
          let list = res.data
          //区分variable 和 fixed
          list.forEach((item) => {
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
          list.forEach((item) => {
            if (item.isVariableOrFix === 0) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
            if (item.isVariableOrFix === 1) {
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
            if (item.isVariableOrFix === 2) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
          })
        }
      })
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
        let index = this.contractItemVariableList.findIndex((item) => item.code == code)
        //variable
        return index != -1 ? index : 0
      } else {
        if (!code) {
          return 0
        }
        let index = this.contractItemFixList.findIndex((item) => item.code == code)
        //fix
        return index != -1 ? index : 0
      }
    },
    //条款明细保存
    confirmTermsDetail() {
      let isCheck = 1 //费比校验
      let Repeat = 0 //contract Item  是否重复
      if (!this.isEditor) {
        //已经通过不能进行编辑，仅能查看
        this.closeTermsDetail()
        return
      }
      let obj = {
        ccId: this.customerId,
        variable: [],
        fixed: [],
      }
      this.termVariableData.forEach((item) => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 ）不能重复
          let RepeatList = this.termVariableData.filter((vItem) => {
            return vItem.contractItem == item.contractItem && vItem.conditions == item.conditions
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem: this.contractItemVariableList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
          }
          obj.variable.push(detailObj)
        }
      })
      this.termFixData.forEach((item) => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 ）不能重复
          let RepeatList = this.termFixData.filter((vItem) => {
            return vItem.contractItem == item.contractItem && vItem.conditions == item.conditions
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem: this.contractItemFixList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
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
        this.$message.info('contract Item加条件类型不能重复')
        return
      }
      console.log(obj)
      API.saveDetail(obj).then((res) => {
        if (res.code === 1000) {
          this.closeTermsDetail()
          this.getTableData()
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
      this.customerId = 0
      this.isTermsDetailVisible = false
      // this.isEditor=0 //编辑弹窗
    },
    //新增条款--variable
    addNewRowToVariable() {
      //新添元素更改位置
      this.termVariableData.push({
        type: 'Variable',
        contractItem: 0,
        conditions: '',
        costRatio: 0,
        taxCost: 0,
        remark: '',
        isNewData: 1, //是否未新添数据
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.termVariableTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.termVariableTable.bodyWrapper.scrollTop = scrollHeight
      })
      //scrollTop
    },
    //新增条款--fix
    addNewRowToFix() {
      this.termFixData.push({
        type: 'Fixed',
        contractItem: 0,
        conditions: this.contractItemFixList[0].conditionalIsTwo == 2 ? '' : this.contractItemFixList[0].conditionType,
        costRatio: 0,
        taxCost: 0,
        remark: '',
        isNewData: 1, //是否未新添数据
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.termFixTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.termFixTable.bodyWrapper.scrollTop = scrollHeight
      })
    },
    deleteTerm(flag, index) {
      //variable 明细删除
      if (flag == 0) {
        this.termVariableData.splice(index, 1)
      } else {
        //fixed 明细删除
        this.termFixData.splice(index, 1)
      }
      this.getNewTotalData()
    },
    //费比更改
    changeCostRate(index, row) {
      // this.termData[index].taxCost = this.termInfo.saleAmount * (Number(row.costRatio) / 100)
      this.termData[index].taxCost = mul(this.termInfo.saleAmount, div(row.costRatio, 100))
      this.getNewTotalData()
    },
    //含税费用更改
    changeCost(index, row) {
      // {{ (termInfo.saleAmount/scope.row.taxCost) }}%
      // this.termData[index].costRatio = (Number(row.taxCost) / this.termInfo.saleAmount) * 100
      this.termData[index].costRatio = mul(div(row.taxCost, this.termInfo.saleAmount), 100)
      this.getNewTotalData()
    },
    //菲仕兰承担含税费比更改
    changeFrieslandCostRate(index, row) {
      this.termData[index].frieslandTaxCost = mul(this.termInfo.saleAmount, div(row.frieslandCostRatio, 100))
      this.termData[index].distCostRatio=sub(row.costRatio,row.frieslandCostRatio)
      this.termData[index].distTaxCost=mul(this.termInfo.saleAmount,div(this.termData[index].distCostRatio,100))
      this.getNewTotalData()
    },
    //菲仕兰承担含税金额更改
    changeFrieslandCost(index, row) {
      this.termData[index].frieslandCostRatio = mul(div(row.frieslandTaxCost, this.termInfo.saleAmount), 100)
      this.termData[index].distTaxCost=sub(row.taxCost,row.frieslandTaxCost)
      this.termData[index].distCostRatio=mul(div(this.termData[index].distTaxCost,this.termInfo.saleAmount,),100)
      this.getNewTotalData()
    },
    //更改客户扣款税点--》未税费比、未税费用
    changeCustomerTaxPoint(row, index, taxPointIndex, type) {
      let CustomerDeduction=CustomerDeductionsAndPayType[row.frieslandCustomerTaxPoint].CustomerDeduction
      let CustomerDeductionNum = div(CustomerDeduction, 100)
      if (type.includes('Variable')) {
        this.termData[index].frieslandCostRatioNoTax = mul(row.frieslandCostRatio, div(1.13, add(1, CustomerDeductionNum)))
        this.termData[index].frieslandTaxCostNoTax = mul(div(this.termData[index].frieslandCostRatioNoTax, 100), this.termInfo.saleAmountNoTax)
      }
      if (type.includes('Fixed')) {
        this.termData[index].frieslandTaxCostNoTax = div(row.frieslandTaxCost, add(1, CustomerDeductionNum))
        this.termData[index].frieslandCostRatioNoTax = mul(div(this.termData[index].frieslandTaxCostNoTax,this.termInfo.saleAmountNoTax), 100)
      }
      this.getNewTotalData()
    },
    // 获取total 数据
    getTotalData() {
      this.TotalData.totalCost = this.termVariableData[0].taxCost
      this.TotalData.totalPoint = this.termVariableData[0].costRatio
    },
    getNewTotalData() {
      //获取variable Total 、Fixed Total 索引
      let VariableTotalIndex = this.termData.findIndex((item) => item.type == 'Variable total')
      let FixedTotalIndex = this.termData.findIndex((item) => item.type == 'Fixed total')
      //重置variable total
      this.VariableTotalData = {
        totalPoint: 0,
        totalCost: 0,
        frieslandCostRatio: 0, //菲仕兰承担含税费比
        frieslandTaxCost: 0, //菲仕兰承担含税金额
        frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
        frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
        distCostRatio: 0, //经销商承担含税费比
        distTaxCost: 0, //经销商承担含税金额
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
        distTaxCost: 0, //经销商承担含税金额
      }
      //获取VariableData Total
      this.termVariableData.forEach((item) => {
        this.VariableTotalData.totalPoint = add(this.VariableTotalData.totalPoint, item.costRatio)
        this.VariableTotalData.totalCost = add(this.VariableTotalData.totalCost, item.taxCost)
        this.VariableTotalData.frieslandCostRatio = add(this.VariableTotalData.frieslandCostRatio, item.frieslandCostRatio)
        this.VariableTotalData.frieslandTaxCost = add(this.VariableTotalData.frieslandTaxCost, item.frieslandTaxCost)
        this.VariableTotalData.frieslandCostRatioNoTax = add(this.VariableTotalData.frieslandCostRatioNoTax, item.frieslandCostRatioNoTax)
        this.VariableTotalData.frieslandTaxCostNoTax = add(this.VariableTotalData.frieslandTaxCostNoTax, item.frieslandTaxCostNoTax)
        this.VariableTotalData.distCostRatio = add(this.VariableTotalData.distCostRatio, item.distCostRatio)
        this.VariableTotalData.distTaxCost = add(this.VariableTotalData.distTaxCost, item.distTaxCost)
      })
      //获取FixData Total
      this.termFixData.forEach((item) => {
        this.FixTotalData.totalPoint = add(this.FixTotalData.totalPoint, item.costRatio)
        this.FixTotalData.totalCost = add(this.FixTotalData.totalCost, item.taxCost)
        this.FixTotalData.frieslandCostRatio = add(this.FixTotalData.frieslandCostRatio, item.frieslandCostRatio)
        this.FixTotalData.frieslandTaxCost = add(this.FixTotalData.frieslandTaxCost, item.frieslandTaxCost)
        this.FixTotalData.frieslandCostRatioNoTax = add(this.FixTotalData.frieslandCostRatioNoTax, item.frieslandCostRatioNoTax)
        this.FixTotalData.frieslandTaxCostNoTax = add(this.FixTotalData.frieslandTaxCostNoTax, item.frieslandTaxCostNoTax)
        this.FixTotalData.distCostRatio = add(this.FixTotalData.distCostRatio, item.distCostRatio)
        this.FixTotalData.distTaxCost = add(this.FixTotalData.distTaxCost, item.distTaxCost)
      })
      //设置 variable total 到table
      if (VariableTotalIndex != -1) {
        Object.assign(this.termData[VariableTotalIndex], this.VariableTotalData)
      }
      //设置 fixed total 到table
      if (FixedTotalIndex != -1) {
        Object.assign(this.termData[FixedTotalIndex], this.FixTotalData)
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
      Object.assign(this.termData[0], this.TotalData)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
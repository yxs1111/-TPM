<!--
 * @Description:
 * @Date: 2022-04-12 08:50:29
 * @LastEditTime: 2022-12-08 20:18:46
-->
<template>
  <div class="ContentDetail">
    <div class="TpmButtonBGWrap">
      <div v-if="isOtherEditor&&isEditor" class="TpmButtonBG" @click="staging">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">暂存</span>
      </div>
      <div v-if="isOtherEditor&&isEditor" class="TpmButtonBG" @click="submit(0)">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
      <div class="TpmButtonBG cancelButton" @click="cancelSubmit">
        <span class="text">取消</span>
      </div>
    </div>
    <el-table :data="AllTableData" v-if="isShow" key="tabKey" :max-height="maxheight" :min-height="800" border :header-cell-style="HeadTable" :cell-style="columnStyle"
      :row-class-name="tableRowClassName" style="width: 100%">
      <!-- 客户 -->
      <el-table-column align="center" width="720" fixed="left">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 客户名称: {{AllTableData[0].customerInfo.customerName}}</span>
            <span class="topInfo" v-if="customerContract.channelCode==='RKA'"> 大区: {{customerContract.regionName}}</span>
            <br>
            <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(AllTableData[0].customerInfo.targetSale)}} </span>
            <span class="topTarget"> 目标销售额(未税,¥): {{FormateNum(AllTableData[0].customerInfo.targetSale)}} </span>
          </div>
        </template>
        <template>
          <el-table-column width="720" fixed="left">
            <template v-slot:header>
            </template>
            <template>
              <el-table-column align="center" width="120">
                <template v-slot:header></template>
                <template slot-scope="{ row }">
                  <div>
                    {{ row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="contractItem" align="center" width="150" label="Contract item">
                {{row.customerInfo.contractItem}}
              </el-table-column>
              <el-table-column v-slot={row} prop="conditionType" align="center" width="150" label="条件类型">
                {{row.customerInfo.conditionType}}
              </el-table-column>
              <el-table-column v-slot={row} prop="pointCount" align="center" width="150" label="含税费比（%）">
                {{FormateNum(row.customerInfo.pointCount)}}%
              </el-table-column>
              <el-table-column v-slot={row} prop="taxPrice" align="center" width="150" label="含税费用（¥）">
                {{FormateNum(row.customerInfo.taxPrice)}}
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <!-- 客户合同承担信息 -->
      <el-table-column width="1200">
        <template v-slot:header></template>
        <template>
          <el-table-column width="200">
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <div>
                <el-table-column width="100">
                  <template v-slot:header>
                    含税费比%
                  </template>
                  <template>
                    <div>

                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="100">
                  <template v-slot:header>
                    含税金额¥
                  </template>
                  <template>
                    <div>

                    </div>
                  </template>
                </el-table-column>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="200">
            <template v-slot:header>
              经销商承担
            </template>
            <template>
              <div>
                <el-table-column width="100">
                  <template v-slot:header>
                    含税费比%
                  </template>
                  <template>
                    <div>

                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="100">
                  <template v-slot:header>
                    含税金额¥
                  </template>
                  <template>
                    <div>

                    </div>
                  </template>
                </el-table-column>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="600">
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column prop="frieslandCustomerTaxPoint" align="center" width="150" label="客户扣缴税点">
                <template>
                  客户扣缴税点
                </template>
              </el-table-column>
              <el-table-column prop="frieslandPayType" align="center" width="150" label="支付方式">
                支付方式
              </el-table-column>
              <el-table-column prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                未税费比
              </el-table-column>
              <el-table-column align="center" label="未税费用(¥)" width="150">
                未税费用
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column v-slot={row} :show-overflow-tooltip="true" prop="detail" align="center" width="200" label="描述">
            {{row.customerInfo.detail}}
          </el-table-column>
        </template>
      </el-table-column>
      <!-- 经销商 -->
      <el-table-column align="center" v-for="(dealerItem,dealerIndex) in AllTableData[0].dealerList" :key="dealerIndex">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 经销商名称: {{AllTableData[0].dealerList[dealerIndex].dealerName}}({{AllTableData[0].dealerList[dealerIndex].contractStateName}})</span>
            <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(AllTableData[0].dealerList[dealerIndex].targetSale)}} </span>
          </div>
        </template>
        <template>
          <el-table-column width="5">
            <template v-slot:header></template>
            <template>
              <div>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
            </template>
            <template>
              <el-table-column v-slot={row} prop="contractItem" align="center" width="150" label="Contract item">
                {{row.dealerList[dealerIndex].contractItem}}
              </el-table-column>
              <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
                <template slot-scope="scope">
                  <div v-if="scope.row.dealerList[dealerIndex].isEditor&&scope.row.isVariable&&!scope.row.isTotal">
                    <el-input type="number" v-model="scope.row.dealerList[dealerIndex].pointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changePointCount(scope.row,scope.$index,dealerIndex)">
                    </el-input>%
                  </div>
                  <div v-else>{{FormateNum(scope.row.dealerList[dealerIndex].pointCount)}}%</div>
                </template>
              </el-table-column>
              <el-table-column prop="taxPrice" align="center" width="180" label="含税金额（¥）">
                <template slot-scope="scope">
                  <div v-if="scope.row.dealerList[dealerIndex].isEditor&&!scope.row.isTotal&&!scope.row.isVariable">
                    <el-input type="number" v-model="scope.row.dealerList[dealerIndex].taxPrice" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changeTaxPrice(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                  <div v-else>
                    {{FormateNum(scope.row.dealerList[dealerIndex].taxPrice)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="detail" :show-overflow-tooltip="true" align="center" width="180" label="描述">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isTotal&&scope.row.dealerList[dealerIndex].isEditor">
                    <el-input v-model="scope.row.dealerList[dealerIndex].detail" type="textarea" autosize clearable class="my-el-detail my-textArea" placeholder="请输入">
                    </el-input>
                  </div>
                  <span v-else>
                    {{scope.row.dealerList[dealerIndex].detail}}
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column prop="frieslandPointCount" align="center" width="150" label="费比（%）">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor&&scope.row.isVariable">
                      <el-input type="number" v-model="scope.row.dealerList[dealerIndex].frieslandPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeFrieslandPointCount(scope.row,scope.$index,dealerIndex)">
                      </el-input>%
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].frieslandPointCount)}}%
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="frieslandTaxPrice" align="center" width="160" label="含税金额（¥）">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor&&!scope.row.isVariable">
                      <el-input type="number" v-model="scope.row.dealerList[dealerIndex].frieslandTaxPrice" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeFrieslandTaxPrice(scope.row,scope.$index,dealerIndex)">
                      </el-input>
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].frieslandTaxPrice)}}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              经销商承担
            </template>
            <template>
              <el-table-column prop="dealerPointCount" align="center" width="150" label="费比（%）">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor&&scope.row.isVariable">
                      <el-input type="number" v-model="scope.row.dealerList[dealerIndex].dealerPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeDealerPointCount(scope.row,scope.$index,dealerIndex)">
                      </el-input>%
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].dealerPointCount)}}%
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="dealerTaxPrice" align="center" width="160" label="含税金额（¥）">
                <template slot-scope="scope">
                  <div>
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor&&!scope.row.isVariable">
                      <el-input type="number" v-model="scope.row.dealerList[dealerIndex].dealerTaxPrice" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeDealerTaxPrice(scope.row,scope.$index,dealerIndex)">
                      </el-input>
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].dealerTaxPrice)}}
                    </div>
                  </div>
                </template>
                <!-- <div v-if="!row.isTotal">
                  {{FormateNum(row.dealerList[dealerIndex].dealerTaxPrice)}}
                </div> -->
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>菲仕兰承担
            </template>
            <template>
              <el-table-column prop="customerTaxPoint" align="center" width="150" label="客户扣缴税点">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isTotal">
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor">
                      <el-select v-model="scope.row.dealerList[dealerIndex].customerTaxPoint" @change="changeCustomerTaxPoint(scope.row,dealerIndex)" class="my-el-select_dialog"
                        filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in CustomerDeductionsAndPayType" :key="index" :label="item.CustomerDeduction+'%'" :value="index" />
                      </el-select>
                    </div>
                    <div v-if="!scope.row.dealerList[dealerIndex].isEditor&&scope.row.dealerList[dealerIndex].customerTaxPoint!==''">
                      {{CustomerDeductionsAndPayType[scope.row.dealerList[dealerIndex].customerTaxPoint].CustomerDeduction}}%
                      <!-- {{TaxDeductionsPoint[Number(scope.row.dealerList[dealerIndex].customerTaxPoint)]}} -->
                    </div>

                  </div>
                </template>

              </el-table-column>
              <el-table-column v-slot={row} prop="customerTaxPoint" align="center" width="120" label="支付方式">
                <!-- {{row.dealerList[dealerIndex].customerTaxPoint}} -->
                <div v-if="!row.isTotal&&row.dealerList[dealerIndex].customerTaxPoint!==''">
                  <div v-if="row.dealerList[dealerIndex].isEditor">
                    <el-select v-model="row.dealerList[dealerIndex].payType" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in CustomerDeductionsAndPayType[row.dealerList[dealerIndex].customerTaxPoint].payTypeList" :key="index" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{getPaymentMethodText(row.dealerList[dealerIndex].customerTaxPoint,row.dealerList[dealerIndex].payType)}}
                  </div>

                </div>
              </el-table-column>
              <el-table-column prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                未税费比
              </el-table-column>
              <el-table-column align="center" label="未税费用(¥)" width="150">
                未税费用
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/dealer'
import { contractView, formatThousandNum, CustomerDeductionsAndPayType } from '@/utils'
import dealerTermData from './dealerTermData.js'
import { add, sub, mul, div } from '@/utils/Big.js'
export default {
  name: 'dealerTermDetail',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      maxheight: contractView(),
      AllTableData: [],
      TaxDeductionsPoint: ['6', '13'],
      payTypeList: ['PO', '红票', '票扣'],
      ccId: null,
      tabKey: 0,
      isShow: false,
      contractItemVariableList: [],
      contractItemFixList: [],
      CustomerDeductionsAndPayType: CustomerDeductionsAndPayType,
      isMakeUp: 0, //是否补录
      isOtherEditor: 0, //是否有可编辑
      isEditor: 0,
      customerContract: '', //客户合同
      contractList: ['草稿', '被拒绝', '待审批', '通过', '过期', '终止'],
    }
  },

  mounted() {
    if (this.$route.query.ccId) {
      this.ccId = this.$route.query.ccId
      sessionStorage.setItem('ccId', this.$route.query.ccId)
    } else {
      this.ccId = sessionStorage.getItem('ccId')
    }
    if (sessionStorage.getItem('isEditor')) {
      let editorIndex = Number(sessionStorage.getItem('EditorIndex'))
      let editorStrList = sessionStorage.getItem('isEditor').split('-')
      if (editorIndex == Number(editorStrList[1])) {
        this.isEditor = Number(editorStrList[0])
      }
      // this.isEditor=Number(sessionStorage.getItem("isEditor"))
    }
    this.getContractItemList()
  },

  methods: {
    //获取条款明细信息
    getTermInfo() {
      // API.findOne({
      //   id: this.ccId,
      //   isCustomerContract: 1, //是否查询客户合同（1是0否）
      //   isCustomerContractDetail: 1, //是否查询客户合同条款（1是0否）
      //   isDistributorContractDetail: 1, //是否查询经销商合同详情（1是0否）
      // }).then((res) => {
      let res = dealerTermData
      let { variable: customerVariableList, fixed: customerFixList } = res.data.customerContract
      let customerContract = res.data.customerContract
      this.customerContract = res.data.customerContract
      //copy  属性--》单个的客户variable
      customerVariableList.forEach((item) => {
        item.customerName = customerContract.customerName
        item.customerMdmCode = customerContract.customerMdmCode
        item.saleAmount = customerContract.saleAmount
        item.frieslandCostRatio = 0 //菲仕兰承担含税费比
        item.frieslandTaxCost = 0 //菲仕兰承担含税金额
        item.frieslandCostRatioNoTax = 0 //菲仕兰承担未税费比
        item.frieslandTaxCostNoTax = 0 //菲仕兰承担未税金额
        item.distCostRatio = 0 //经销商承担含税费比
        item.distTaxCost = 0 //经销商承担含税金额
        item.frieslandCustomerTaxPoint = null //菲仕兰承担--客户扣款税点
        item.frieslandPayType = null //菲仕兰承担--支付方式
      })
      customerFixList.forEach((item) => {
        item.customerName = customerContract.customerName
        item.customerMdmCode = customerContract.customerMdmCode
        item.saleAmount = customerContract.saleAmount
        item.frieslandCostRatio = 0 //菲仕兰承担含税费比
        item.frieslandTaxCost = 0 //菲仕兰承担含税金额
        item.frieslandCostRatioNoTax = 0 //菲仕兰承担未税费比
        item.frieslandTaxCostNoTax = 0 //菲仕兰承担未税金额
        item.distCostRatio = 0 //经销商承担含税费比
        item.distTaxCost = 0 //经销商承担含税金额
        item.frieslandCustomerTaxPoint = null //菲仕兰承担--客户扣款税点
        item.frieslandPayType = null //菲仕兰承担--支付方式
      })
      //排序 匹配variable 行
      customerVariableList.sort((item, nItem) => {
        return item.id - nItem.id
      })
      //排序 匹配variable 行
      customerFixList.sort((item, nItem) => {
        return item.id - nItem.id
      })
      let distributorList = res.data.distributorContract
      //经销商添加对应数量的variable /fixed
      distributorList.forEach((item) => {
        if (item.fixed.length == 0 && item.variable.length == 0) {
          item.isEmpty = 1
          for (let index = 0; index < customerVariableList.length; index++) {
            let obj = {
              dcId: item.id,
              dealerName: item.distributorName,
              distributorMdmCode: item.distributorMdmCode,
              targetSale: item.saleAmount,
              contractState: item.contractState,
              isSupplement: '',
              ccDetailId: '',
              costRatio: '',
              taxCost: '',
              remark: '',
              fcCostRatio: '',
              fcTaxCost: '',
              distributorCostRatio: '',
              distributorTaxCost: '',
              deductionTaxRate: '',
              payType: '',
              frieslandCostRatioNoTax:'', //菲仕兰承担未税费比
              frieslandTaxCostNoTax:'', //菲仕兰承担未税金额
            }
            item.variable.push(obj)
          }
          for (let index = 0; index < customerFixList.length; index++) {
            let obj = {
              dcId: item.id,
              dealerName: item.distributorName,
              distributorMdmCode: item.distributorMdmCode,
              targetSale: item.saleAmount,
              contractState: item.contractState,
              isSupplement: '',
              ccDetailId: '',
              costRatio: '',
              taxCost: '',
              remark: '',
              fcCostRatio: '',
              fcTaxCost: '',
              distributorCostRatio: '',
              distributorTaxCost: '',
              deductionTaxRate: '',
              payType: '',
              frieslandCostRatioNoTax:'', //菲仕兰承担未税费比
              frieslandTaxCostNoTax:'', //菲仕兰承担未税金额
            }
            item.fixed.push(obj)
          }
        } else {
          item.isEmpty = 0
          item.sortCode = this.contractList.findIndex((statusItem) => statusItem == item.contractStateName)
          item.variable.forEach((variableItem) => {
            variableItem.dcId = item.id
            variableItem.dealerName = item.distributorName
            variableItem.distributorMdmCode = item.distributorMdmCode
            variableItem.targetSale = item.saleAmount
            variableItem.contractState = item.contractState //合同状态
            //TODO从数据中获取 菲仕兰承担未税费比 菲仕兰承担未税金额————》回显
            variableItem.frieslandCostRatioNoTax = 0 //菲仕兰承担未税费比
            variableItem.frieslandTaxCostNoTax = 0 //菲仕兰承担未税金额
          })
          item.fixed.forEach((fixedItem) => {
            fixedItem.dcId = item.id
            fixedItem.dealerName = item.distributorName
            fixedItem.distributorMdmCode = item.distributorMdmCode
            fixedItem.targetSale = item.saleAmount
            fixedItem.contractState = item.contractState ////合同状态
            //TODO从数据中获取 菲仕兰承担未税费比 菲仕兰承担未税金额————》回显
            fixedItem.frieslandCostRatioNoTax = 0 //菲仕兰承担未税费比
            fixedItem.frieslandTaxCostNoTax = 0 //菲仕兰承担未税金额
          })
        }
      })
      //补录不进行校验：客户合同下有“通过”或者“过期”
      let index = distributorList.findIndex((item) => {
        return item.contractState == '3' || item.contractState == '5'
      })
      // 是否有可编辑的，若没有则只显示关闭按钮
      let isOtherEditor = distributorList.findIndex((item) => {
        return item.contractState == '0' || item.contractState == '2'
      })
      //没有通过则是正常，若有之前通过的经销商则为补录
      this.isMakeUp = index == -1 ? 0 : 1
      this.isOtherEditor = isOtherEditor == -1 ? 0 : 1
      let AllTotalTableData = []
      let VariableTotalTableData = []
      let VariableTableData = []
      let FixedTotalTableData = []
      let FixedTableData = []
      console.log(distributorList)
      //经销商条款明细展示排序 ：草稿→被拒绝→待审批→通过→过期→终止
      distributorList.sort((item1, item2) => item1.sortCode - item2.sortCode)
      //添加variable-->获得表格variable部分数据（维度：行，行中数据保留客户和经销商）
      for (let index = 0; index < customerVariableList.length; index++) {
        const customerVariableObj = customerVariableList[index]
        let variableObj = {
          name: 'Variable',
          isTotal: 0,
          isVariable: 1, //total 、Fix 区分
          ccDetailId: customerVariableObj.id, //客户合同条款明细-id
          customerInfo: {
            customerName: customerVariableObj.customerName, //客户名称
            targetSale: customerVariableObj.saleAmount, //客户目标销售额
            contractItem: this.getContractItemByCode(customerVariableObj.conditionsItem, 0),
            conditionType: customerVariableObj.conditions,
            pointCount: customerVariableObj.costRatio,
            taxPrice: customerVariableObj.taxCost,
            frieslandCostRatio: customerVariableObj.frieslandCostRatio, //菲仕兰承担含税费比
            frieslandTaxCost: customerVariableObj.frieslandTaxCost, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: customerVariableObj.frieslandCostRatioNoTax, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: customerVariableObj.frieslandTaxCostNoTax, //菲仕兰承担未税金额
            distCostRatio: customerVariableObj.distCostRatio, //经销商承担含税费比
            distTaxCost: customerVariableObj.distTaxCost, //经销商承担含税金额
            frieslandCustomerTaxPoint: customerVariableObj.frieslandCustomerTaxPoint, //菲仕兰承担--客户扣款税点
            frieslandPayType: customerVariableObj.frieslandPayType, //菲仕兰承担--支付方式
            detail: customerVariableObj.remark,
          },
          dealerList: [],
        }
        //初始化variable 汇总行
        let variableTotalObj = {
          name: 'Variable total',
          isTotal: 1,
          customerInfo: {
            conditionType: '',
            contractItem: '',
            customerName: customerVariableObj.customerName, //客户名称,
            detail: '',
            isVariable: 1,
            pointCount: 0,
            targetSale: customerVariableObj.saleAmount, //客户目标销售额,
            taxPrice: 0,
            frieslandCostRatio: 0, //菲仕兰承担含税费比
            frieslandTaxCost: 0, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            distCostRatio: 0, //经销商承担含税费比
            distTaxCost: 0, //经销商承担含税金额
          },
          dealerList: [],
        }
        let variableAndFixObj = {
          name: 'Total',
          isTotal: 1,
          isVariable: 1,
          customerInfo: {
            conditionType: '',
            contractItem: '',
            customerName: customerVariableObj.customerName, //客户名称,,
            detail: '',
            isVariable: 1,
            pointCount: 0,
            targetSale: customerVariableObj.saleAmount, //客户目标销售额,,
            taxPrice: 0,
            frieslandCostRatio: 0, //菲仕兰承担含税费比
            frieslandTaxCost: 0, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            distCostRatio: 0, //经销商承担含税费比
            distTaxCost: 0, //经销商承担含税金额
          },
          dealerList: [],
        }
        //取经销商对应的variable
        distributorList.forEach((item) => {
          let distVariableObj = item.variable[index]
          //根据明细id来进行匹配
          if (!item.isEmpty) {
            //不是第一次进入
            //对每一个经销商 variable 和 客户 variable  比对
            item.variable.forEach((variableItem) => {
              // debugger
              if (variableItem.ccDetailId == customerVariableList[index].id) {
                variableObj.dealerList.push({
                  dcId: variableItem.dcId, //经销商合同id
                  dealerName: variableItem.dealerName,
                  targetSale: variableItem.targetSale,
                  contractItem: variableObj.customerInfo.contractItem,
                  conditionType: variableObj.customerInfo.conditionType,
                  pointCount: variableItem.costRatio,
                  taxPrice: variableItem.taxCost,
                  detail: variableItem.remark,
                  frieslandPointCount: variableItem.fcCostRatio, //菲仕兰承担费比
                  frieslandTaxPrice: variableItem.fcTaxCost, //菲仕兰承担--含税金额
                  dealerPointCount: variableItem.distributorCostRatio, //经销商承担费比
                  dealerTaxPrice: variableItem.distributorTaxCost, //经销商承担--含税金额
                  customerTaxPoint: this.getCustomerTaxPoint(variableItem.deductionTaxRate), //客户扣款税点
                  payType: variableItem.payType === '' || variableItem.payType === null ? null : Number(variableItem.payType), //支付方式
                  frieslandCostRatioNoTax: variableItem.frieslandCostRatioNoTax, //菲仕兰承担未税费比
                  frieslandTaxCostNoTax: variableItem.frieslandTaxCostNoTax, //菲仕兰承担未税金额
                  isEditor: (variableItem.contractState == '0' || variableItem.contractState == '2') && this.isEditor ? 1 : 0,
                  contractStateName: item.contractStateName,
                  // (variableItem.contractState == '1' ||
                  // variableItem.contractState == '3' ||
                  // variableItem.contractState == '4')&&!this.isEditor
                  //   ? 0
                  //   : 1,
                })
              }
            })
          } else {
            variableObj.dealerList.push({
              dcId: distVariableObj.dcId, //经销商合同id
              dealerName: distVariableObj.dealerName,
              targetSale: distVariableObj.targetSale,
              contractItem: variableObj.customerInfo.contractItem,
              conditionType: variableObj.customerInfo.conditionType,
              pointCount: distVariableObj.costRatio,
              taxPrice: distVariableObj.taxCost,
              detail: distVariableObj.remark,
              frieslandPointCount: distVariableObj.fcCostRatio, //菲仕兰承担费比
              frieslandTaxPrice: distVariableObj.fcTaxCost, //菲仕兰承担--含税金额
              dealerPointCount: distVariableObj.distributorCostRatio, //经销商承担费比
              dealerTaxPrice: distVariableObj.distributorTaxCost, //经销商承担--含税金额
              customerTaxPoint: this.getCustomerTaxPoint(distVariableObj.deductionTaxRate), //客户扣款税点
              payType: distVariableObj.payType == '' || distVariableObj.payType == null ? null : Number(distVariableObj.payType), //支付方式
              frieslandCostRatioNoTax: distVariableObj.frieslandCostRatioNoTax, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: distVariableObj.frieslandTaxCostNoTax, //菲仕兰承担未税金额
              isEditor: (distVariableObj.contractState == '0' || distVariableObj.contractState == '2') && this.isEditor ? 1 : 0,
              contractStateName: item.contractStateName,
              // (distVariableObj.contractState == '1' ||
              // distVariableObj.contractState == '3' ||
              // distVariableObj.contractState == '4')&&!this.isEditor
              //   ? 0
              //   : 1,
            })
          }
          //设置 variable 汇总行
          variableTotalObj.dealerList.push({
            dealerName: distVariableObj.dealerName,
            targetSale: distVariableObj.targetSale,
            contractItem: '',
            conditionType: '',
            pointCount: 0,
            taxPrice: 0,
            detail: '',
            frieslandPointCount: '',
            frieslandTaxPrice: '',
            dealerPointCount: '',
            dealerTaxPrice: '',
            customerTaxPoint: '',
            payType: '',
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            contractStateName: item.contractStateName,
          })
          variableAndFixObj.dealerList.push({
            dealerName: distVariableObj.dealerName,
            targetSale: distVariableObj.targetSale,
            contractItem: '',
            conditionType: '',
            pointCount: 0,
            taxPrice: 0,
            detail: '',
            frieslandPointCount: '',
            frieslandTaxPrice: '',
            dealerPointCount: '',
            dealerTaxPrice: '',
            customerTaxPoint: '',
            payType: '',
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            contractStateName: item.contractStateName,
          })
        })
        //variable+fix Total
        if (AllTotalTableData.length === 0) {
          AllTotalTableData.push(variableAndFixObj)
        }
        //初始化variable 汇总行--添加经销商
        if (VariableTotalTableData.length === 0) {
          VariableTotalTableData.push(variableTotalObj)
        }
        VariableTableData.push(variableObj)
      }
      console.log(VariableTotalTableData)
      console.log(AllTotalTableData)
      console.log(customerFixList)
      //添加 fixed -->获得表格中fix 部分数据
      for (let index = 0; index < customerFixList.length; index++) {
        const customerFixObj = customerFixList[index]
        let FixedObj = {
          name: 'Fixed',
          isTotal: 0,
          isVariable: 0, //Variable 、Fix 区分
          ccDetailId: customerFixObj.id, //客户合同条款明细-id
          customerInfo: {
            customerName: customerFixObj.customerName, //客户名称
            targetSale: customerFixObj.saleAmount, //客户目标销售额
            contractItem: this.getContractItemByCode(customerFixObj.conditionsItem, 1),
            conditionType: customerFixObj.conditions,
            pointCount: customerFixObj.costRatio,
            taxPrice: customerFixObj.taxCost,
            frieslandCostRatio: customerFixObj.frieslandCostRatio, //菲仕兰承担含税费比
            frieslandTaxCost: customerFixObj.frieslandTaxCost, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: customerFixObj.frieslandCostRatioNoTax, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: customerFixObj.frieslandTaxCostNoTax, //菲仕兰承担未税金额
            distCostRatio: customerFixObj.distCostRatio, //经销商承担含税费比
            distTaxCost: customerFixObj.distTaxCost, //经销商承担含税金额
            frieslandCustomerTaxPoint: customerFixObj.frieslandCustomerTaxPoint, //菲仕兰承担--客户扣款税点
            frieslandPayType: customerFixObj.frieslandPayType, //菲仕兰承担--支付方式
            detail: customerFixObj.remark,
          },
          dealerList: [],
        }
        let FixedTotalObj = {
          name: 'Fixed total',
          isTotal: 1,
          isVariable: 0, //Variable 、Fix 区分
          customerInfo: {
            conditionType: '',
            contractItem: '',
            customerName: '',
            detail: '',
            isVariable: 1,
            pointCount: 0,
            targetSale: 0,
            taxPrice: 0,
            frieslandCostRatio: 0, //菲仕兰承担含税费比
            frieslandTaxCost: 0, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            distCostRatio: 0, //经销商承担含税费比
            distTaxCost: 0, //经销商承担含税金额
          },
          dealerList: [],
        }
        let variableAndFixObj = {
          name: 'Total',
          isTotal: 1,
          isVariable: 1,
          customerInfo: {
            conditionType: '',
            contractItem: '',
            customerName: customerFixObj.customerName, //客户名称,,
            detail: '',
            isVariable: 1,
            pointCount: 0,
            targetSale: customerFixObj.saleAmount, //客户目标销售额,,
            taxPrice: 0,
            frieslandCostRatio: 0, //菲仕兰承担含税费比
            frieslandTaxCost: 0, //菲仕兰承担含税金额
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            distCostRatio: 0, //经销商承担含税费比
            distTaxCost: 0, //经销商承担含税金额
          },
          dealerList: [],
        }
        //取经销商对应的variable
        distributorList.forEach((item) => {
          let distFixObj = item.fixed[index]
          //根据明细id来进行匹配
          if (!item.isEmpty) {
            //不是第一次进入
            //对每一个经销商 fixed 和 客户 fixed  比对
            item.fixed.forEach((fixedItem) => {
              if (fixedItem.ccDetailId == customerFixList[index].id) {
                FixedObj.dealerList.push({
                  dcId: fixedItem.dcId, //经销商合同id
                  dealerName: fixedItem.dealerName,
                  targetSale: fixedItem.targetSale,
                  contractItem: FixedObj.customerInfo.contractItem,
                  conditionType: FixedObj.customerInfo.conditionType,
                  pointCount: fixedItem.costRatio,
                  taxPrice: fixedItem.taxCost,
                  detail: fixedItem.remark,
                  frieslandPointCount: fixedItem.fcCostRatio, //菲仕兰承担费比
                  frieslandTaxPrice: fixedItem.fcTaxCost, //菲仕兰承担--含税金额
                  dealerPointCount: fixedItem.distributorCostRatio, //经销商承担费比
                  dealerTaxPrice: fixedItem.distributorTaxCost, //经销商承担--含税金额
                  customerTaxPoint: this.getCustomerTaxPoint(fixedItem.deductionTaxRate), //客户扣款税点
                  payType: fixedItem.payType == '' || fixedItem.payType == null ? null : Number(fixedItem.payType), //支付方式
                  frieslandCostRatioNoTax: fixedItem.frieslandCostRatioNoTax, //菲仕兰承担未税费比
                  frieslandTaxCostNoTax: fixedItem.frieslandTaxCostNoTax, //菲仕兰承担未税金额
                  isEditor: (fixedItem.contractState == '0' || fixedItem.contractState == '2') && this.isEditor ? 1 : 0,
                  contractStateName: item.contractStateName,
                  // (fixedItem.contractState == '1' ||
                  // fixedItem.contractState == '3' ||
                  // fixedItem.contractState == '4')&&!this.isEditor
                  //   ? 0
                  //   : 1,
                })
              }
            })
          } else {
            FixedObj.dealerList.push({
              dcId: distFixObj.dcId, //经销商合同id
              dealerName: distFixObj.dealerName,
              targetSale: distFixObj.targetSale,
              contractItem: FixedObj.customerInfo.contractItem,
              conditionType: FixedObj.customerInfo.conditionType,
              pointCount: distFixObj.costRatio,
              taxPrice: distFixObj.taxCost,
              detail: distFixObj.remark,
              frieslandPointCount: distFixObj.fcCostRatio, //菲仕兰承担费比
              frieslandTaxPrice: distFixObj.fcTaxCost, //菲仕兰承担--含税金额
              dealerPointCount: distFixObj.distributorCostRatio, //经销商承担费比
              dealerTaxPrice: distFixObj.distributorTaxCost, //经销商承担--含税金额
              customerTaxPoint: this.getCustomerTaxPoint(distFixObj.deductionTaxRate), //客户扣款税点
              payType: distFixObj.payType == '' || distFixObj.payType == null ? null : Number(distFixObj.payType), //支付方式
              frieslandCostRatioNoTax: distFixObj.frieslandCostRatioNoTax, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: distFixObj.frieslandTaxCostNoTax, //菲仕兰承担未税金额
              isEditor: (distFixObj.contractState == '0' || distFixObj.contractState == '2') && this.isEditor ? 1 : 0,
              contractStateName: item.contractStateName,
              // (distFixObj.contractState == '1' ||
              // distFixObj.contractState == '3' ||
              // distFixObj.contractState == '4')&&!this.isEditor
              //   ? 0
              //   : 1,
            })
          }
          FixedTotalObj.dealerList.push({
            dealerName: distFixObj.dealerName,
            targetSale: distFixObj.targetSale,
            contractItem: '',
            conditionType: '',
            pointCount: 0,
            taxPrice: 0,
            detail: '',
            frieslandPointCount: '',
            frieslandTaxPrice: '',
            dealerPointCount: '',
            dealerTaxPrice: '',
            customerTaxPoint: '',
            payType: '',
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            contractStateName: item.contractStateName,
          })
          variableAndFixObj.dealerList.push({
            dealerName: distFixObj.dealerName,
            targetSale: distFixObj.targetSale,
            contractItem: '',
            conditionType: '',
            pointCount: 0,
            taxPrice: 0,
            detail: '',
            frieslandPointCount: '',
            frieslandTaxPrice: '',
            dealerPointCount: '',
            dealerTaxPrice: '',
            customerTaxPoint: '',
            payType: '',
            frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
            frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
            contractStateName: item.contractStateName,
          })
        })
        //variable+fix Total
        if (AllTotalTableData.length === 0) {
          AllTotalTableData.push(variableAndFixObj)
        }
        //初始化variable 汇总行--添加经销商
        if (FixedTotalTableData.length === 0) {
          FixedTotalTableData.push(FixedTotalObj)
        }
        FixedTableData.push(FixedObj)
      }
      //计算variable 汇总行数据--客户维度
      VariableTableData.forEach((item) => {
        VariableTotalTableData[0].customerInfo.pointCount = add(VariableTotalTableData[0].customerInfo.pointCount,item.customerInfo.pointCount)
        VariableTotalTableData[0].customerInfo.taxPrice = add(VariableTotalTableData[0].customerInfo.taxPrice,item.customerInfo.taxPrice)
        VariableTotalTableData[0].customerInfo.frieslandCostRatio = add(VariableTotalTableData[0].customerInfo.frieslandCostRatio,item.customerInfo.frieslandCostRatio)
        VariableTotalTableData[0].customerInfo.frieslandTaxCost = add(VariableTotalTableData[0].customerInfo.frieslandTaxCost,item.customerInfo.frieslandTaxCost)
        VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax = add(VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax,item.customerInfo.frieslandCostRatioNoTax)
        VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax = add(VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax,item.customerInfo.frieslandTaxCostNoTax)
        VariableTotalTableData[0].customerInfo.distCostRatio = add(VariableTotalTableData[0].customerInfo.distCostRatio,item.customerInfo.distCostRatio)
        VariableTotalTableData[0].customerInfo.distTaxCost = add(VariableTotalTableData[0].customerInfo.distTaxCost,item.customerInfo.distTaxCost)
      })
      console.log(VariableTableData)
      //计算Fixed 汇总行数据--客户维度
      FixedTableData.forEach((item) => {
        FixedTotalTableData[0].customerInfo.pointCount = add(FixedTotalTableData[0].customerInfo.pointCount,item.customerInfo.pointCount)
        FixedTotalTableData[0].customerInfo.taxPrice = add(FixedTotalTableData[0].customerInfo.taxPrice,item.customerInfo.taxPrice)
        FixedTotalTableData[0].customerInfo.frieslandCostRatio = add(FixedTotalTableData[0].customerInfo.frieslandCostRatio,item.customerInfo.frieslandCostRatio)
        FixedTotalTableData[0].customerInfo.frieslandTaxCost = add(FixedTotalTableData[0].customerInfo.frieslandTaxCost,item.customerInfo.frieslandTaxCost)
        FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax = add(FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax,item.customerInfo.frieslandCostRatioNoTax)
        FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax = add(FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax,item.customerInfo.frieslandTaxCostNoTax)
        FixedTotalTableData[0].customerInfo.distCostRatio = add(FixedTotalTableData[0].customerInfo.distCostRatio,item.customerInfo.distCostRatio)
        FixedTotalTableData[0].customerInfo.distTaxCost = add(FixedTotalTableData[0].customerInfo.distTaxCost,item.customerInfo.distTaxCost)
      })
      console.log(AllTotalTableData)
      //variable + fix 汇总行
      if (VariableTotalTableData.length || FixedTotalTableData.length) {
        if (VariableTotalTableData.length) {
          AllTotalTableData[0].customerInfo.pointCount = add(AllTotalTableData[0].customerInfo.pointCount,VariableTotalTableData[0].customerInfo.pointCount)
          AllTotalTableData[0].customerInfo.taxPrice = add(AllTotalTableData[0].customerInfo.taxPrice,VariableTotalTableData[0].customerInfo.taxPrice)
          AllTotalTableData[0].customerInfo.frieslandCostRatio = add(AllTotalTableData[0].customerInfo.frieslandCostRatio,VariableTotalTableData[0].customerInfo.frieslandCostRatio)
          AllTotalTableData[0].customerInfo.frieslandTaxCost = add(AllTotalTableData[0].customerInfo.frieslandTaxCost,VariableTotalTableData[0].customerInfo.frieslandTaxCost)
          AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax = add(AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax,VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax)
          AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax = add(AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax,VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax)
          AllTotalTableData[0].customerInfo.distCostRatio = add(AllTotalTableData[0].customerInfo.distCostRatio,VariableTotalTableData[0].customerInfo.distCostRatio)
          AllTotalTableData[0].customerInfo.distTaxCost = add(AllTotalTableData[0].customerInfo.distTaxCost,VariableTotalTableData[0].customerInfo.distTaxCost)
        } else {
          AllTotalTableData[0].customerInfo.pointCount += 0
          AllTotalTableData[0].customerInfo.taxPrice += 0
          AllTotalTableData[0].customerInfo.frieslandCostRatio += 0
          AllTotalTableData[0].customerInfo.frieslandTaxCost += 0
          AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax += 0
          AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax += 0
          AllTotalTableData[0].customerInfo.distCostRatio += 0
          AllTotalTableData[0].customerInfo.distTaxCost += 0
        }
        if (FixedTotalTableData.length) {
          AllTotalTableData[0].customerInfo.pointCount = add(AllTotalTableData[0].customerInfo.pointCount,FixedTotalTableData[0].customerInfo.pointCount)
          AllTotalTableData[0].customerInfo.taxPrice = add(AllTotalTableData[0].customerInfo.taxPrice,FixedTotalTableData[0].customerInfo.taxPrice)
          AllTotalTableData[0].customerInfo.frieslandCostRatio = add(AllTotalTableData[0].customerInfo.frieslandCostRatio,FixedTotalTableData[0].customerInfo.frieslandCostRatio)
          AllTotalTableData[0].customerInfo.frieslandTaxCost = add(AllTotalTableData[0].customerInfo.frieslandTaxCost,FixedTotalTableData[0].customerInfo.frieslandTaxCost)
          AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax = add(AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax,FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax)
          AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax = add(AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax,FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax)
          AllTotalTableData[0].customerInfo.distCostRatio = add(AllTotalTableData[0].customerInfo.distCostRatio,FixedTotalTableData[0].customerInfo.distCostRatio)
          AllTotalTableData[0].customerInfo.distTaxCost = add(AllTotalTableData[0].customerInfo.distTaxCost,FixedTotalTableData[0].customerInfo.distTaxCost)
        } else {
          AllTotalTableData[0].customerInfo.pointCount += 0
          AllTotalTableData[0].customerInfo.taxPrice += 0
          AllTotalTableData[0].customerInfo.frieslandCostRatio += 0
          AllTotalTableData[0].customerInfo.frieslandTaxCost += 0
          AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax += 0
          AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax += 0
          AllTotalTableData[0].customerInfo.distCostRatio += 0
          AllTotalTableData[0].customerInfo.distTaxCost += 0
        }
      }
      this.AllTableData = [...AllTotalTableData, ...VariableTableData, ...VariableTotalTableData, ...FixedTableData, ...FixedTotalTableData]
      //计算汇总行数据--经销商维度
      this.setVariableTotal()
      this.isShow = true
      this.tabKey++
      // })
    },
    // 获取ContractItem 列表
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
          this.getTermInfo()
        }
      })
    },
    //通过code 来查ContractItem
    getContractItemByCode(code, flag) {
      if (flag == 0) {
        let index = this.contractItemVariableList.findIndex((item) => item.code === code)
        if (index != -1) {
          return this.contractItemVariableList[index].name
        }
      } else {
        let index = this.contractItemFixList.findIndex((item) => item.code === code)
        if (index != -1) {
          return this.contractItemFixList[index].name
        }
      }
    },
    //根据客户扣缴税点 查index
    getCustomerTaxPoint(rate) {
      let num = this.CustomerDeductionsAndPayType.findIndex((item) => item.CustomerDeduction == rate)
      if (num != -1) {
        return num
      } else {
        return ''
      }
    },
    //根据1/2/3 查名字
    getPaymentMethodText(index, MethodValue) {
      let num = this.CustomerDeductionsAndPayType[index].payTypeList.findIndex((item) => item.value == MethodValue)
      if (num != -1) {
        return this.CustomerDeductionsAndPayType[index].payTypeList[num].label
      }
    },
    //更改客户扣缴税点--》支付方式 置空
    changeCustomerTaxPoint(row, dealerIndex) {
      row.dealerList[dealerIndex].payType = null
      this.$forceUpdate()
    },
    // 暂存
    staging() {
      //暂存
      this.submit(1)
    },
    //保存||提交
    submit(flag) {
      //暂存
      if (!flag) {
        let isTaxPriceEmpty = false
        let isPointCountEmpty = false
        let exceptionList = []
        let errorList = []
        let pointCountEmpty = [] //经销商费比为空
        let taxPriceEmpty = [] //经销商费比为空
        let payTypeRequire = []
        let taxPriceErrorList = [] //经销商含税金额 汇总 校验（应等于该经销商目标销售额）
        //补录跳过验证--若之前经销商已经通过&&当前状态是草稿的 说明是补录
        this.AllTableData.forEach((item, index) => {
          //对 Variable 异常处理 各经销商费比大于客户费比
          if (!item.isTotal && item.isVariable) {
            let customerPointCount = item.customerInfo.pointCount
            let dealerList = item.dealerList
            dealerList.forEach((dealerItem, dealerIndex) => {
              if (dealerItem.pointCount > customerPointCount) {
                exceptionList.push({
                  rowIndex: index,
                  dealerIndex,
                  ...dealerItem,
                })
              }
              // debugger
              if (dealerItem.pointCount === '' || dealerItem.pointCount === null) {
                console.log('费比为空')
                isPointCountEmpty = true
                pointCountEmpty.push({
                  rowIndex: index,
                  dealerIndex,
                  ...dealerItem,
                })
              }
              if (Number(dealerItem.frieslandPointCount) != 0) {
                if (dealerItem.customerTaxPoint === '' || dealerItem.payType == '' || dealerItem.payType == null) {
                  console.log('客户扣款税点为空')
                  payTypeRequire.push({
                    rowIndex: index,
                    dealerIndex,
                    ...dealerItem,
                  })
                }
              }
            })
          }
          //error 错误  经销商含税总金额若不等于客户含税金额 报error
          if (!item.isTotal && !item.isVariable) {
            let customerTaxPrice = item.customerInfo.taxPrice
            let dealerList = item.dealerList
            dealerList.forEach((dealerItem, dealerIndex) => {
              if (dealerItem.taxPrice === '' || dealerItem.taxPrice === null) {
                console.log('含税金额为空')
                isTaxPriceEmpty = true
                taxPriceEmpty.push({
                  rowIndex: index,
                  dealerIndex,
                  ...dealerItem,
                })
              }
              if (Number(dealerItem.frieslandPointCount) != 0) {
                if (dealerItem.customerTaxPoint === '' || dealerItem.payType == '' || dealerItem.payType == null) {
                  console.log('客户扣款税点为空')
                  payTypeRequire.push({
                    rowIndex: index,
                    dealerIndex,
                    ...dealerItem,
                  })
                }
              }
            })
            // error 对草稿、待审批、被拒绝的进行校验
            let dealerTaxPrice = dealerList.reduce((total, current) => {
              if (current.contractStateName == '草稿' || current.contractStateName == '待审批' || current.contractStateName == '被拒绝') {
                return total + Number(current.taxPrice)
              } else {
                return total + 0
              }
            }, 0)
            if (dealerTaxPrice != customerTaxPrice) {
              errorList.push({
                rowIndex: index,
              })
            }
          }
          //error 经销商含税金额汇总校验（应等于该经销商目标销售额）
          if (index == 0 && item.name == 'Total') {
            item.dealerList.forEach((dealerItem, dealerIndex) => {
              if (dealerItem.taxPrice > dealerItem.targetSale) {
                taxPriceErrorList.push({
                  dealerIndex,
                  ...dealerItem,
                })
              }
            })
          }
        })
        console.log(exceptionList)
        console.log(errorList)
        console.log(pointCountEmpty)
        if (isPointCountEmpty) {
          pointCountEmpty.forEach((item) => {
            setTimeout(() => {
              this.$notify.warning({
                title: '警告',
                message: `第${item.rowIndex + 1}行${this.AllTableData[item.rowIndex].customerInfo.contractItem} ${item.dealerName} 费比不能为空,请进行填写`,
                duration: 5000,
              })
            }, 50)
          })
          // this.$message.info('经销商费比不能为空,请进行填写')
          return
        }
        if (isTaxPriceEmpty) {
          taxPriceEmpty.forEach((item) => {
            setTimeout(() => {
              this.$notify.warning({
                title: '警告',
                message: `第${item.rowIndex + 1}行${this.AllTableData[item.rowIndex].customerInfo.contractItem} ${item.dealerName} 含税金额不能为空,请进行填写`,
                duration: 5000,
              })
            }, 50)
          })
          // this.$message.info('经销商含税金额不能为空,请进行填写')
          return
        }
        if (payTypeRequire.length) {
          payTypeRequire.forEach((item) => {
            setTimeout(() => {
              this.$notify.warning({
                title: '警告',
                message: `第${item.rowIndex + 1}行${this.AllTableData[item.rowIndex].customerInfo.contractItem} ${item.dealerName} 菲仕兰承担费比不为零时，扣款税点和支付方式不能为空`,
                duration: 5000,
              })
            }, 50)
          })
          // this.$message.info('经销商含税金额不能为空,请进行填写')
          return
        }
        //若经销商含税金额不等于经销商目标销售额 报error
        if (taxPriceErrorList.length) {
          taxPriceErrorList.forEach((item) => {
            setTimeout(() => {
              this.$notify.warning({
                title: '警告',
                message: `${item.dealerName}经销商费比total不能超过100%`,
                duration: 5000,
              })
            }, 50)
          })
          return
        }
        console.log(pointCountEmpty)
        console.log(taxPriceEmpty)
        //补录跳过校验
        if (!this.isMakeUp) {
          if (errorList.length) {
            errorList.forEach((item) => {
              setTimeout(() => {
                this.$notify.error({
                  title: '错误',
                  message: `第${item.rowIndex + 1}行${this.AllTableData[item.rowIndex].customerInfo.contractItem}  经销商含税金额total 不等于客户含税金额`,
                  duration: 5000,
                })
              }, 50)
            })
            return
          }
        }
        if (exceptionList.length) {
          exceptionList.forEach((item) => {
            setTimeout(() => {
              this.$message({
                showClose: true,
                message: `${item.dealerName} ${item.contractItem} 经销商费比不等于客户合同费比`,
                type: 'warning',
              })
            }, 50)
          })
        }
      }
      let Obj = {
        ccId: this.ccId,
        isTempStorage: flag, //0 否(参与校验)/1是(不参与校验)
        details: {},
      }
      this.AllTableData.forEach((row) => {
        if (!row.isTotal) {
          row.dealerList.forEach((distItem) => {
            //没有该经销商，添加该经销商对应的条款明细
            if (this.isMakeUp) {
              //补录只提补录
              if (distItem.isEditor) {
                if (!Obj.details[distItem.dcId]) {
                  Obj.details[distItem.dcId] = []
                  Obj.details[distItem.dcId].push({
                    dcId: distItem.dcId,
                    ccDetailId: row.ccDetailId,
                    costRatio: distItem.pointCount,
                    taxCost: distItem.taxPrice,
                    remark: distItem.detail,
                    fcCostRatio: distItem.frieslandPointCount,
                    fcTaxCost: distItem.frieslandTaxPrice,
                    distributorCostRatio: distItem.dealerPointCount,
                    distributorTaxCost: distItem.dealerTaxPrice,
                    deductionTaxRate: distItem.customerTaxPoint !== '' ? this.CustomerDeductionsAndPayType[distItem.customerTaxPoint].CustomerDeduction : '',
                    payType: distItem.payType,
                  })
                } else {
                  Obj.details[distItem.dcId].push({
                    dcId: distItem.dcId,
                    ccDetailId: row.ccDetailId,
                    costRatio: distItem.pointCount,
                    taxCost: distItem.taxPrice,
                    remark: distItem.detail,
                    fcCostRatio: distItem.frieslandPointCount,
                    fcTaxCost: distItem.frieslandTaxPrice,
                    distributorCostRatio: distItem.dealerPointCount,
                    distributorTaxCost: distItem.dealerTaxPrice,
                    deductionTaxRate: distItem.customerTaxPoint !== '' ? this.CustomerDeductionsAndPayType[distItem.customerTaxPoint].CustomerDeduction : '',
                    payType: distItem.payType,
                  })
                }
              }
            } else {
              //非补录状态全部提交
              if (!Obj.details[distItem.dcId]) {
                Obj.details[distItem.dcId] = []
                Obj.details[distItem.dcId].push({
                  dcId: distItem.dcId,
                  ccDetailId: row.ccDetailId,
                  costRatio: distItem.pointCount,
                  taxCost: distItem.taxPrice,
                  remark: distItem.detail,
                  fcCostRatio: distItem.frieslandPointCount,
                  fcTaxCost: distItem.frieslandTaxPrice,
                  distributorCostRatio: distItem.dealerPointCount,
                  distributorTaxCost: distItem.dealerTaxPrice,
                  deductionTaxRate: distItem.customerTaxPoint !== '' ? this.CustomerDeductionsAndPayType[distItem.customerTaxPoint].CustomerDeduction : '',
                  payType: distItem.payType,
                })
              } else {
                Obj.details[distItem.dcId].push({
                  dcId: distItem.dcId,
                  ccDetailId: row.ccDetailId,
                  costRatio: distItem.pointCount,
                  taxCost: distItem.taxPrice,
                  remark: distItem.detail,
                  fcCostRatio: distItem.frieslandPointCount,
                  fcTaxCost: distItem.frieslandTaxPrice,
                  distributorCostRatio: distItem.dealerPointCount,
                  distributorTaxCost: distItem.dealerTaxPrice,
                  deductionTaxRate: distItem.customerTaxPoint !== '' ? this.CustomerDeductionsAndPayType[distItem.customerTaxPoint].CustomerDeduction : '',
                  payType: distItem.payType,
                })
              }
            }
          })
        }
      })
      console.log(Obj)
      API.saveContractDetail(Obj).then((res) => {
        if (res.code === 1000) {
          if (flag) {
            this.$message.success('暂存成功')
            this.cancelSubmit()
          } else {
            this.$message.success('保存成功')
            this.cancelSubmit()
          }
        } else {
          this.$message.info(`${res.message}`)
        }
      })
    },
    cancelSubmit() {
      this.$router.go(-1)
      sessionStorage.removeItem('isEditor')
    },
    //更改费比 --》 含税金额
    changePointCount(Obj, index, dealerIndex) {
      let { pointCount, targetSale } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].taxPrice = (pointCount * targetSale) / 100
      this.setVariableTotal()
      this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = pointCount
      this.changeFrieslandPointCount(Obj, index, dealerIndex)
      // this.AllTableData[index].dealerList[dealerIndex].dealerPointCount=0
    },
    // 更改含税金额 --》 费比
    changeTaxPrice(Obj, index, dealerIndex) {
      let { taxPrice, targetSale } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].pointCount = (100 * taxPrice) / targetSale
      this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice = taxPrice
      this.changeFrieslandTaxPrice(Obj, index, dealerIndex)
      // this.AllTableData[index].dealerList[dealerIndex].dealerTaxPrice=0
      // this.setVariableTotal()
    },
    //设置Variable、Fixed   Total
    setVariableTotal() {
      let AllVariableDealer = {}
      let AllFixedDealer = {}

      this.AllTableData[0].dealerList.forEach((item) => {
        item.taxPrice = 0
        item.pointCount = 0
        item.frieslandPointCount = 0
        item.frieslandTaxPrice = 0
        item.dealerPointCount = 0
        item.dealerTaxPrice = 0
      })
      //对行进行遍历
      for (let index = 0; index < this.AllTableData.length; index++) {
        if (!this.AllTableData[index].isTotal && this.AllTableData[index].isVariable) {
          const dealerList = this.AllTableData[index].dealerList
          //对variable经销商进行遍历
          for (let dealerIndex = 0; dealerIndex < dealerList.length; dealerIndex++) {
            const { pointCount, taxPrice, dcId, dealerName, frieslandPointCount, frieslandTaxPrice, dealerTaxPrice, dealerPointCount } = dealerList[dealerIndex]
            if (!AllVariableDealer[dcId]) {
              AllVariableDealer[dcId] = [
                {
                  pointCount,
                  taxPrice,
                  dcId,
                  dealerIndex,
                  frieslandPointCount,
                  frieslandTaxPrice,
                  dealerTaxPrice,
                  dealerPointCount,
                },
              ]
            } else {
              AllVariableDealer[dcId].push({
                pointCount,
                taxPrice,
                dcId,
                dealerIndex,
                frieslandPointCount,
                frieslandTaxPrice,
                dealerTaxPrice,
                dealerPointCount,
              })
            }
          }
        }

        if (!this.AllTableData[index].isTotal && !this.AllTableData[index].isVariable) {
          const dealerList = this.AllTableData[index].dealerList
          //对Fixed 经销商进行遍历
          for (let dealerIndex = 0; dealerIndex < dealerList.length; dealerIndex++) {
            const { pointCount, taxPrice, dcId, dealerName, frieslandPointCount, frieslandTaxPrice, dealerTaxPrice, dealerPointCount } = dealerList[dealerIndex]
            if (!AllFixedDealer[dcId]) {
              AllFixedDealer[dcId] = [
                {
                  pointCount,
                  taxPrice,
                  dcId,
                  dealerIndex,
                  frieslandPointCount,
                  frieslandTaxPrice,
                  dealerTaxPrice,
                  dealerPointCount,
                },
              ]
            } else {
              AllFixedDealer[dcId].push({
                pointCount,
                taxPrice,
                dcId,
                dealerIndex,
                frieslandPointCount,
                frieslandTaxPrice,
                dealerTaxPrice,
                dealerPointCount,
              })
            }
          }
        }
      }
      // 获取 Variable 索引
      let VariableIndex = this.AllTableData.findIndex((item) => item.name == 'Variable total')
      // 获取 Variable 索引
      let FixedIndex = this.AllTableData.findIndex((item) => item.name == 'Fixed total')
      // console.log(AllVariableDealer);
      // console.log(AllFixedDealer);
      //遍历variable 经销商
      // debugger
      for (const key in AllVariableDealer) {
        if (Object.hasOwnProperty.call(AllVariableDealer, key)) {
          const dealerList = AllVariableDealer[key]
          let variableTotalPointCount = 0
          let variableTotalTaxPrice = 0
          let variableTotalFrieslandTaxPrice = 0 //菲仕兰承担含税金额
          let variableTotalFrieslandPointCount = 0 //菲仕兰承担费比
          let variableTotalDealerTaxPrice = 0 //经销商承担含税金额
          let variableTotalDealerPointCount = 0 //经销商承担费比
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            variableTotalPointCount += Number(dealerItem.pointCount)
            variableTotalTaxPrice += Number(dealerItem.taxPrice)
            variableTotalFrieslandTaxPrice += Number(dealerItem.frieslandTaxPrice)
            variableTotalFrieslandPointCount += Number(dealerItem.frieslandPointCount)
            variableTotalDealerTaxPrice += Number(dealerItem.dealerTaxPrice)
            variableTotalDealerPointCount += Number(dealerItem.dealerPointCount)
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[VariableIndex].dealerList[index].pointCount = variableTotalPointCount
          this.AllTableData[VariableIndex].dealerList[index].taxPrice = variableTotalTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].frieslandTaxPrice = variableTotalFrieslandTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].frieslandPointCount = variableTotalFrieslandPointCount
          this.AllTableData[VariableIndex].dealerList[index].dealerTaxPrice = variableTotalDealerTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].dealerPointCount = variableTotalDealerPointCount
          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice += variableTotalTaxPrice
          this.AllTableData[0].dealerList[index].pointCount += variableTotalPointCount
          this.AllTableData[0].dealerList[index].frieslandTaxPrice += variableTotalFrieslandTaxPrice
          this.AllTableData[0].dealerList[index].frieslandPointCount += variableTotalFrieslandPointCount
          this.AllTableData[0].dealerList[index].dealerTaxPrice += variableTotalDealerTaxPrice
          this.AllTableData[0].dealerList[index].dealerPointCount += variableTotalDealerPointCount
        }
      }
      //遍历Fixed 经销商
      for (const key in AllFixedDealer) {
        if (Object.hasOwnProperty.call(AllFixedDealer, key)) {
          const dealerList = AllFixedDealer[key]
          let FixedTotalPointCount = 0
          let FixedTotalTaxPrice = 0
          let FixedTotalFrieslandTaxPrice = 0 //菲仕兰承担含税金额
          let FixedTotalFrieslandPointCount = 0 //菲仕兰承担费比
          let FixedTotalDealerTaxPrice = 0 //经销商承担含税金额
          let FixedTotalDealerPointCount = 0 //经销商承担费比
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            FixedTotalPointCount += Number(dealerItem.pointCount)
            FixedTotalTaxPrice += Number(dealerItem.taxPrice)
            FixedTotalFrieslandTaxPrice += Number(dealerItem.frieslandTaxPrice)
            FixedTotalFrieslandPointCount += Number(dealerItem.frieslandPointCount)
            FixedTotalDealerTaxPrice += Number(dealerItem.dealerTaxPrice)
            FixedTotalDealerPointCount += Number(dealerItem.dealerPointCount)
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[FixedIndex].dealerList[index].pointCount = FixedTotalPointCount
          this.AllTableData[FixedIndex].dealerList[index].taxPrice = FixedTotalTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].frieslandTaxPrice = FixedTotalFrieslandTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].frieslandPointCount = FixedTotalFrieslandPointCount
          this.AllTableData[FixedIndex].dealerList[index].dealerTaxPrice = FixedTotalDealerTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].dealerPointCount = FixedTotalDealerPointCount
          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice += FixedTotalTaxPrice
          this.AllTableData[0].dealerList[index].pointCount += FixedTotalPointCount
          this.AllTableData[0].dealerList[index].frieslandTaxPrice += FixedTotalFrieslandTaxPrice
          this.AllTableData[0].dealerList[index].frieslandPointCount += FixedTotalFrieslandPointCount
          this.AllTableData[0].dealerList[index].dealerTaxPrice += FixedTotalDealerTaxPrice
          this.AllTableData[0].dealerList[index].dealerPointCount += FixedTotalDealerPointCount
        }
      }
    },
    //更改菲仕兰承担费比--》菲仕兰承担含税金额
    changeFrieslandPointCount(Obj, index, dealerIndex) {
      // debugger
      let { frieslandPointCount, targetSale, pointCount } = Obj.dealerList[dealerIndex]
      if (0 <= frieslandPointCount && frieslandPointCount <= pointCount) {
        this.AllTableData[index].dealerList[dealerIndex].dealerPointCount = Number(Number(pointCount) - Number(frieslandPointCount)).toFixed(2)
        // Number(pointCount).toFixed(2) - Number(frieslandPointCount).toFixed(2)
        this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice = (Number(frieslandPointCount) * targetSale) / 100
        this.changeDealerPointCount(Obj, index, dealerIndex)
      } else {
        this.$message.info(`第${index}行 ${this.AllTableData[index].name} ${this.AllTableData[index].dealerList[dealerIndex].dealerName}  菲仕兰承担费比+经销商承担费比应该等于客户费比`)
        this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = pointCount
        this.changeDealerPointCount(Obj, index, dealerIndex)

        // this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice = 0
        // this.AllTableData[index].dealerList[dealerIndex].dealerPointCount = 0
      }
    },
    //更改菲仕兰承担含税金额==》 菲仕兰承担费比
    changeFrieslandTaxPrice(Obj, index, dealerIndex) {
      let { frieslandTaxPrice, targetSale, taxPrice } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = (Number(frieslandTaxPrice) / targetSale) * 100
      this.AllTableData[index].dealerList[dealerIndex].dealerTaxPrice = Number(taxPrice) - Number(frieslandTaxPrice)
      this.changeDealerTaxPrice(Obj, index, dealerIndex)
      this.setVariableTotal()
    },
    //更改经销商承担费比--》经销商承担含税金额
    changeDealerPointCount(Obj, index, dealerIndex) {
      let { dealerPointCount, targetSale, pointCount } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].dealerTaxPrice = (dealerPointCount * targetSale) / 100
      this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = Number(Number(pointCount) - Number(dealerPointCount)).toFixed(2)
      // Number(pointCount) - Number(dealerPointCount)
      this.setVariableTotal()
    },
    //更改经销商含税金额--》经销商承担承担费比
    changeDealerTaxPrice(Obj, index, dealerIndex) {
      let { dealerTaxPrice, targetSale, taxPrice } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].dealerPointCount = (Number(dealerTaxPrice) / targetSale) * 100
      this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice = Number(taxPrice) - Number(dealerTaxPrice)
      this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = (Number(this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice) / targetSale) * 100
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
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return formatThousandNum(num)
    },
    //弹窗表格样式
    tableRowClassName({ row, rowIndex, columnIndex }) {
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
        return 'first-row'
      }
    },
    // 列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      // if (row.name.indexOf('Total') !== -1) {
      //   return 'background-color: #4192d3 !important;color: #fff!important;'
      // }
      // if (row.name.indexOf('total') !== -1 && (columnIndex - 6) % 11 != 0) {
      //   return 'background-color: #E3F3FF;color: #666!important;'
      // }
      // if ((columnIndex - 6) % 11 == 0) {
      //   return 'background-color: #4192d3 !important;'
      // }
    },
    HeadTable({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background-color: #E3F3FF !important;color: #333!important;font-family: Source Han Sans CN;font-size: 16px;'
      }
      return ' background: #4192d3;color: #fff;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  },
}
</script>

<style lang="scss" scoped>
.ContentDetail {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
  .topInfoWrap {
    letter-spacing: 2px;
    .topTarget {
      margin-left: 20px;
    }
  }
}
.contract_firstRow {
  background-color: #4192d3 !important;
  color: #fff;
  font-size: 14px;
}
.headerStyle {
  background-color: #4192d3 !important;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
}
.TotalRow {
  background-color: #f3f7f8 !important;
  color: #666;
  font-size: 14px;
}
.hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.hover-row .filstColumn {
  color: #666;
}
.my-el-inputNumber {
  width: 100px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 100px;
  }
  .el-input--suffix {
    width: 100px !important;
  }
}
.ContentDetail .my-el-detail {
  width: 150px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 150px;
  }
  .el-input--suffix {
    width: 150px !important;
  }
}
</style>
<style lang="less">
.my-el-select_dialog {
  width: 80px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 80px;
  }
  .el-input--suffix {
    width: 80px !important;
  }
}
.my-textArea {
  textarea {
    resize: none !important;
  }
}
.dividingLine {
  width: 100%;
  height: 100%;
  background-color: #4192d3;
}
</style>

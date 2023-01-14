<!--
 * @Description:
 * @Date: 2022-04-12 08:50:29
<<<<<<< HEAD
 * @LastEditTime: 2022-10-13 17:14:51
=======
 * @LastEditTime: 2023-01-11 10:04:11
>>>>>>> dev
-->
<template>
  <div class="ContentDetail">
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG cancelButton" @click="cancelSubmit">
        <span class="text">取消</span>
      </div>
      <div class="TpmPrompt">请注意：亮蓝色的数据，表明经销商分摊协议点数≠客户合同点数</div>
    </div>
    <el-table :data="AllTableData" v-if="isShow" key="tabKey" :max-height="maxheight" :min-height="800" border :header-cell-style="HeadTable" :cell-style="columnStyle"
      :row-class-name="tableRowClassName" style="width: 100%">
      <!-- 客户 -->
      <el-table-column align="left" width="720" fixed="left">
        <template v-slot:header>
          <div class="topInfoWrap customerInfo">
            <span class="topInfo"> 客户名称: {{AllTableData[0].customerInfo.customerName}}</span>
            <span class="topInfo" v-if="customerContract.channelCode==='RKA'"> 大区: {{customerContract.regionName}}</span>
            <br>
            <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(AllTableData[0].customerInfo.targetSale)}} </span>
            <span class="topTarget"> 目标销售额(未税,¥): {{FormateNum(AllTableData[0].customerInfo.targetSaleNoTax)}} </span>
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
      <el-table-column width="1400">
        <template v-slot:header></template>
        <template>
          <el-table-column width="300">
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column width="150" align="center">
                <template v-slot:header>
                  含税费比%
                </template>
                <template slot-scope="scope">
                  <span>
                    {{FormateNum(scope.row.customerInfo.frieslandCostRatio)}}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="150" align="center">
                <template v-slot:header>
                  含税金额¥
                </template>
                <template slot-scope="scope">
                  <span>
                    {{FormateNum(scope.row.customerInfo.frieslandTaxCost)}}
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column width="300">
            <template v-slot:header>
              经销商承担
            </template>
            <template>
              <el-table-column width="150" align="center">
                <template v-slot:header>
                  含税费比%
                </template>
                <template slot-scope="scope">
                  <span>
                    {{FormateNum(scope.row.customerInfo.distCostRatio)}}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="150" align="center">
                <template v-slot:header>
                  含税金额¥
                </template>
                <template slot-scope="scope">
                  <span>
                    {{FormateNum(scope.row.customerInfo.distTaxCost)}}
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column align="center" width="600">
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column v-slot="{row}" prop="customerTaxPoint" align="center" width="150" label="客户扣款税点">
                <template>
                  <span v-if="!row.isTotal&&row.customerInfo.customerTaxPoint!==''">
                    {{CustomerDeductionsAndPayType[Number(row.customerInfo.customerTaxPoint)].CustomerDeduction}}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-slot="{row}" prop="payType" align="center" width="150" label="支付方式">
                <template>
                  <span v-if="!row.isTotal&&row.customerInfo.payType!==''&&row.customerInfo.customerTaxPoint!==''">
                    {{getPayTypeName(row.customerInfo.payType)}}
                    <!-- {{CustomerDeductionsAndPayType[Number(row.customerInfo.customerTaxPoint)].payTypeList[Number(row.customerInfo.payType)].label}} -->
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                <template>
                  <span>
                    {{FormateNum(row.customerInfo.frieslandCostRatioNoTax)}}%
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} align="center" label="未税费用(¥)" width="150">
                <span>
                  {{FormateNum(row.customerInfo.frieslandTaxCostNoTax)}}
                </span>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column v-slot={row} :show-overflow-tooltip="true" prop="detail" align="center" width="200" label="描述">
            {{row.customerInfo.detail}}
          </el-table-column>
        </template>
      </el-table-column>
      <!-- 经销商 -->
      <el-table-column align="left" v-for="(dealerItem,dealerIndex) in AllTableData[0].dealerList" :key="dealerIndex">
        <template v-slot:header>
          <div class="topInfoWrap distInfo">
            <span class="topInfo"> 经销商名称: {{AllTableData[0].dealerList[dealerIndex].dealerName}}({{AllTableData[0].dealerList[dealerIndex].contractStateName}})</span>
            <br/>
            <span class="topTarget"> 目标销售额(含税,RMB): {{FormateNum(AllTableData[0].dealerList[dealerIndex].targetSale)}} </span>
            <span class="topTarget"> 目标销售额(未税,¥): {{FormateNum(AllTableData[0].dealerList[dealerIndex].targetSaleNoTax)}} </span>
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
              <el-table-column prop="pointCount" align="center" width="150" label="含税费比（%）">
                <template slot-scope="scope">
                  {{FormateNum(scope.row.dealerList[dealerIndex].pointCount)}}%
                </template>
              </el-table-column>
              <el-table-column prop="taxPrice" align="center" width="180" label="含税金额（¥）">
                <template slot-scope="scope">
                    {{FormateNum(scope.row.dealerList[dealerIndex].taxPrice)}}
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column prop="frieslandPointCount" align="center" width="150" label="含税费比（%）">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.dealerList[dealerIndex].frieslandPointCount)}}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="frieslandTaxPrice" align="center" width="160" label="含税金额（¥）">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.dealerList[dealerIndex].frieslandTaxPrice)}}
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
              <el-table-column prop="dealerPointCount" align="center" width="150" label="含税费比（%）">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.dealerList[dealerIndex].dealerPointCount)}}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="dealerTaxPrice" align="center" width="150" label="含税金额（¥）">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.dealerList[dealerIndex].dealerTaxPrice)}}
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>菲仕兰承担
            </template>
            <template>
              <el-table-column v-slot={row} prop="customerTaxPoint" align="center" width="150" label="客户扣款税点">
                <div v-if="!row.isTotal&&row.dealerList[dealerIndex].customerTaxPoint!==''">
                  {{CustomerDeductionsAndPayType[Number(row.dealerList[dealerIndex].customerTaxPoint)].CustomerDeduction}}%
                </div>
              </el-table-column>
              <el-table-column v-slot={row} prop="payType" align="center" width="120" label="支付方式">
                <div v-if="!row.isTotal&&row.dealerList[dealerIndex].payType!==''&&row.dealerList[dealerIndex].customerTaxPoint!==''">
                  {{getPayTypeName(row.dealerList[dealerIndex].payType)}}
                  <!-- {{getDealerPayType(row.dealerList[dealerIndex].customerTaxPoint,row.dealerList[dealerIndex].payType)}} -->
                  <!-- {{CustomerDeductionsAndPayType[Number(row.dealerList[dealerIndex].customerTaxPoint)].payTypeList[Number(row.dealerList[dealerIndex].payType)].label}} -->
                </div>
              </el-table-column>
              <el-table-column v-slot={row} prop="frieslandCostRatioNoTax" align="center" label="未税费比(%)" width="150">
                {{FormateNum(row.dealerList[dealerIndex].frieslandCostRatioNoTax)}} %
              </el-table-column>
              <el-table-column v-slot={row} align="center" prop="frieslandTaxCostNoTax" label="未税费用(¥)" width="150">
                {{FormateNum(row.dealerList[dealerIndex].frieslandTaxCostNoTax)}}
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column prop="detail" :show-overflow-tooltip="true" align="center" width="220" label="描述">
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
    </el-table>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/dealer'
import {
  contractView,
  formatThousandNum,
  CustomerDeductionsAndPayType,
} from '@/utils'
import { add, sub, mul, div, BigToFixed, BigToFixedTwo } from '@/utils/Big.js'
export default {
  name: 'dealerTermView',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      maxheight: contractView(),
      AllTableData: [],
      ccId: null,
      tabKey: 0,
      isShow: false,
      contractItemVariableList: [],
      contractItemFixList: [],
      CustomerDeductionsAndPayType: CustomerDeductionsAndPayType,
      isEmpty: null,
      customerContract:'',//客户合同
      contractList:['草稿', '待审批', '被拒绝', '通过', '过期', '终止']
    }
  },

  mounted() {
    if (this.$route.query.ccId) {
      this.ccId = this.$route.query.ccId
      sessionStorage.setItem('ccId', this.$route.query.ccId)
    } else {
      this.ccId = sessionStorage.getItem('ccId')
    }
    this.getContractItemList()
  },
  activated() {
    if (this.$route.query.ccId) {
      this.ccId = this.$route.query.ccId
      sessionStorage.setItem('ccId', this.$route.query.ccId)
    } else {
      this.ccId = sessionStorage.getItem('ccId')
    }
    this.getContractItemList()
  },
  methods: {
    //获取条款明细信息
    getTermInfo() {
      API.findOne({
        id: this.ccId,
        isCustomerContract: 1, //是否查询客户合同（1是0否）
        isCustomerContractDetail: 1, //是否查询客户合同条款（1是0否）
        isDistributorContractDetail: 1, //是否查询经销商合同详情（1是0否）
      }).then((res) => {
        let { variable: customerVariableList, fixed: customerFixList } =
          res.data.customerContract
        let customerContract = res.data.customerContract
        this.customerContract = res.data.customerContract
        //copy  属性--》单个的客户variable
        customerVariableList.forEach((item) => {
          item.customerName = customerContract.customerName
          item.customerMdmCode = customerContract.customerMdmCode
          item.saleAmount = customerContract.saleAmount
          item.frieslandCostRatio = item.fcCostRatio //菲仕兰承担含税费比
          item.frieslandTaxCost = item.fcTaxCost //菲仕兰承担含税金额
          item.frieslandCostRatioNoTax = item.fcExclTaxCostRatio //菲仕兰承担未税费比
          item.frieslandTaxCostNoTax = item.fcExclTaxCost //菲仕兰承担未税金额
          item.distCostRatio = item.distributorCostRatio //经销商承担含税费比
          item.distTaxCost = item.distributorTaxCost //经销商承担含税金额
          item.payType = this.getPaymentMethodText(item.deductionTaxRate, item.payType) //客户支付方式
          item.customerTaxPoint = this.getCustomerTaxPoint(item.deductionTaxRate) //客户--客户扣款税点
        })
        customerFixList.forEach((item) => {
          item.customerName = customerContract.customerName
          item.customerMdmCode = customerContract.customerMdmCode
          item.saleAmount = customerContract.saleAmount
          item.frieslandCostRatio = item.fcCostRatio //菲仕兰承担含税费比
          item.frieslandTaxCost = item.fcTaxCost //菲仕兰承担含税金额
          item.frieslandCostRatioNoTax = item.fcExclTaxCostRatio //菲仕兰承担未税费比
          item.frieslandTaxCostNoTax = item.fcExclTaxCost //菲仕兰承担未税金额
          item.distCostRatio = item.distributorCostRatio //经销商承担含税费比
          item.distTaxCost = item.distributorTaxCost //经销商承担含税金额
          item.payType = this.getPaymentMethodText(item.deductionTaxRate, item.payType) //客户支付方式
          item.customerTaxPoint = this.getCustomerTaxPoint(item.deductionTaxRate) //客户--客户扣款税点
        })
        //排除 经销商合同 是草稿的 合同
        let distributorList = res.data.distributorContract.filter(
          (item) => item.contractState != '0'
        )
        //经销商添加对应数量的variable /fixed
        distributorList.forEach((item) => {
          if (item.fixed.length == 0 && item.variable.length == 0) {
          } else {
            item.isEmpty = 0
            item.sortCode=this.contractList.findIndex(statusItem=>statusItem==item.contractStateName)
            item.variable.forEach((variableItem) => {
              variableItem.dcId = item.id
              variableItem.dealerName = item.distributorName
              variableItem.distributorMdmCode = item.distributorMdmCode
              variableItem.targetSale = item.saleAmount
              variableItem.targetSaleNoTax = BigToFixed(div(item.saleAmount, 1.13))
              variableItem.contractState = item.contractState //合同状态
              variableItem.frieslandCostRatioNoTax = variableItem.fcExclTaxCostRatio //菲仕兰承担未税费比
              variableItem.frieslandTaxCostNoTax = variableItem.fcExclTaxCost //菲仕兰承担未税金额
              variableItem.payType = variableItem.payType //客户支付方式
              variableItem.customerTaxPoint = this.getCustomerTaxPoint(variableItem.deductionTaxRate) //客户--客户扣款税点
            })
            item.fixed.forEach((fixedItem) => {
              fixedItem.dcId = item.id
              fixedItem.dealerName = item.distributorName
              fixedItem.distributorMdmCode = item.distributorMdmCode
              fixedItem.targetSale = item.saleAmount
              fixedItem.targetSaleNoTax = BigToFixed(div(item.saleAmount, 1.13))
              fixedItem.contractState = item.contractState ////合同状态
              fixedItem.frieslandCostRatioNoTax = fixedItem.fcExclTaxCostRatio //菲仕兰承担未税费比
              fixedItem.frieslandTaxCostNoTax = fixedItem.fcExclTaxCost //菲仕兰承担未税金额
              fixedItem.payType = fixedItem.payType //客户支付方式
              fixedItem.customerTaxPoint = this.getCustomerTaxPoint(fixedItem.deductionTaxRate) //客户--客户扣款税点
            })
          }
        })
        let AllTotalTableData = []
        let VariableTotalTableData = []
        let VariableTableData = []
        let FixedTotalTableData = []
        let FixedTableData = []
        console.log(distributorList);
        //经销商条款明细展示排序 ：草稿→被拒绝→待审批→通过→过期→终止
        distributorList.sort((item1,item2)=>item1.sortCode-item2.sortCode)
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
              targetSaleNoTax: BigToFixed(div(customerVariableObj.saleAmount, 1.13)), //客户目标销售额（未税）
              contractItem: this.getContractItemByCode(
                customerVariableObj.conditionsItem,
                0
              ),
              conditionType: customerVariableObj.conditions,
              pointCount: customerVariableObj.costRatio,
              taxPrice: customerVariableObj.taxCost,
              frieslandCostRatio: customerVariableObj.frieslandCostRatio, //菲仕兰承担含税费比
              frieslandTaxCost: customerVariableObj.frieslandTaxCost, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: customerVariableObj.frieslandCostRatioNoTax, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: customerVariableObj.frieslandTaxCostNoTax, //菲仕兰承担未税金额
              distCostRatio: customerVariableObj.distCostRatio, //经销商承担含税费比
              distTaxCost: customerVariableObj.distTaxCost, //经销商承担含税金额
              customerTaxPoint: customerVariableObj.customerTaxPoint, //菲仕兰承担--客户扣款税点
              payType: customerVariableObj.payType, //菲仕兰承担--支付方式
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
              targetSaleNoTax: BigToFixed(div(customerVariableObj.saleAmount, 1.13)), //客户目标销售额（未税）
              taxPrice: 0,
              frieslandCostRatio: 0, //菲仕兰承担含税费比
              frieslandTaxCost: 0, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
              distCostRatio: 0, //经销商承担含税费比
              distTaxCost: 0, //经销商承担含税金额
              customerTaxPoint: '', //菲仕兰承担--客户扣款税点
              payType: '', //菲仕兰承担--支付方式
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
              targetSale: customerVariableObj.saleAmount, //客户目标销售额,, BigToFixed(customerVariableObj.saleAmount, 2)
              targetSaleNoTax: BigToFixed(div(customerVariableObj.saleAmount, 1.13)), //客户目标销售额（未税）
              taxPrice: 0,
              frieslandCostRatio: 0, //菲仕兰承担含税费比
              frieslandTaxCost: 0, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
              distCostRatio: 0, //经销商承担含税费比
              distTaxCost: 0, //经销商承担含税金额
              customerTaxPoint: '', //菲仕兰承担--客户扣款税点
              payType: '', //菲仕兰承担--支付方式
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
                if (variableItem.ccDetailId == customerVariableList[index].id) {
                  variableObj.dealerList.push({
                    dcId: variableItem.dcId, //经销商合同id
                    dealerName: variableItem.dealerName,
                    targetSale: variableItem.targetSale,
                    targetSaleNoTax: variableItem.targetSaleNoTax,
                    contractItem: variableObj.customerInfo.contractItem,
                    conditionType: variableObj.customerInfo.conditionType,
                    pointCount: variableItem.costRatio,
                    taxPrice: variableItem.taxCost,
                    detail: variableItem.remark,
                    frieslandPointCount: variableItem.fcCostRatio, //菲仕兰承担费比
                    frieslandTaxPrice: variableItem.fcTaxCost, //菲仕兰承担--含税金额
                    dealerPointCount: variableItem.distributorCostRatio, //经销商承担费比
                    dealerTaxPrice: variableItem.distributorTaxCost, //经销商承担--含税金额
                    //经销商的客户扣款税点 == 客户的 客户扣款税点
                    customerTaxPoint: variableItem.customerTaxPoint, //客户扣款税点
                    //经销商的支付方式 == 客户的支付方式
                    payType: variableItem.payType, //支付方式
                    frieslandCostRatioNoTax: variableItem.frieslandCostRatioNoTax, //菲仕兰承担未税费比
                    frieslandTaxCostNoTax: variableItem.frieslandTaxCostNoTax, //菲仕兰承担未税金额
                    isEditor: 0,
                    isException:variableItem.costRatio!=variableObj.customerInfo.pointCount?1:0,
                    isFrieslandException:variableItem.fcCostRatio!=variableObj.customerInfo.frieslandCostRatio?1:0, //菲仕兰承担 含税费比 是否等于客户 含税费比
                    //经销商承担 含税费比 是否等于客户 含税费比
                    isDistException:variableItem.distributorCostRatio!=variableObj.customerInfo.distCostRatio?1:0,
                    contractStateName: item.contractStateName,
                  })
                }
              })
            } else {
              variableObj.dealerList.push({
                dcId: distVariableObj.dcId, //经销商合同id
                dealerName: distVariableObj.dealerName,
                targetSale: distVariableObj.targetSale,
                targetSaleNoTax: distVariableObj.targetSaleNoTax,
                contractItem: variableObj.customerInfo.contractItem,
                conditionType: variableObj.customerInfo.conditionType,
                pointCount: distVariableObj.costRatio,
                taxPrice: distVariableObj.taxCost,
                detail: distVariableObj.remark,
                frieslandPointCount: distVariableObj.fcCostRatio, //菲仕兰承担费比
                frieslandTaxPrice: distVariableObj.fcTaxCost, //菲仕兰承担--含税金额
                dealerPointCount: distVariableObj.distributorCostRatio, //经销商承担费比
                dealerTaxPrice: distVariableObj.distributorTaxCost, //经销商承担--含税金额
                //经销商的客户扣款税点 == 客户的 客户扣款税点
                customerTaxPoint: variableObj.customerInfo.customerTaxPoint, //客户扣款税点
                //经销商的支付方式 == 客户的支付方式
                payType: variableObj.customerInfo.payType, //支付方式
                frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
                frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
                isEditor: 0,
                contractStateName: item.contractStateName,
              })
            }
            //设置 variable 汇总行
            variableTotalObj.dealerList.push({
              dealerName: distVariableObj.dealerName,
              targetSale: distVariableObj.targetSale,
              targetSaleNoTax: distVariableObj.targetSaleNoTax,
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
              targetSaleNoTax: distVariableObj.targetSaleNoTax,
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
              targetSaleNoTax: BigToFixed(div(customerFixObj.saleAmount, 1.13)), //客户目标销售额-未税
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
              customerTaxPoint: customerFixObj.customerTaxPoint, //菲仕兰承担--客户扣款税点
              payType: customerFixObj.payType, //菲仕兰承担--支付方式
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
              customerTaxPoint: 0, //菲仕兰承担--客户扣款税点
              payType: '', //菲仕兰承担--支付方式
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
              targetSaleNoTax: BigToFixed(div(customerFixObj.saleAmount, 1.13)), //客户目标销售额-未税
              taxPrice: 0,
              frieslandCostRatio: 0, //菲仕兰承担含税费比
              frieslandTaxCost: 0, //菲仕兰承担含税金额
              frieslandCostRatioNoTax: 0, //菲仕兰承担未税费比
              frieslandTaxCostNoTax: 0, //菲仕兰承担未税金额
              distCostRatio: 0, //经销商承担含税费比
              distTaxCost: 0, //经销商承担含税金额
              customerTaxPoint: 0, //菲仕兰承担--客户扣款税点
              payType: '', //菲仕兰承担--支付方式
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
                    targetSaleNoTax: fixedItem.targetSaleNoTax,
                    contractItem: FixedObj.customerInfo.contractItem,
                    conditionType: FixedObj.customerInfo.conditionType,
                    pointCount: fixedItem.costRatio,
                    taxPrice: fixedItem.taxCost,
                    detail: fixedItem.remark,
                    frieslandPointCount: fixedItem.fcCostRatio, //菲仕兰承担费比
                    frieslandTaxPrice: fixedItem.fcTaxCost, //菲仕兰承担--含税金额
                    dealerPointCount: fixedItem.distributorCostRatio, //经销商承担费比
                    dealerTaxPrice: fixedItem.distributorTaxCost, //经销商承担--含税金额
                    customerTaxPoint: fixedItem.customerTaxPoint, //客户扣款税点
                    payType: fixedItem.payType, //支付方式
                    frieslandCostRatioNoTax: fixedItem.frieslandCostRatioNoTax, //菲仕兰承担未税费比
                    frieslandTaxCostNoTax: fixedItem.frieslandTaxCostNoTax, //菲仕兰承担未税金额
                    isEditor: 0,
                    contractStateName: item.contractStateName,
                  })
                }
              })
            } 
            FixedTotalObj.dealerList.push({
              dealerName: distFixObj.dealerName,
              targetSale: distFixObj.targetSale,
              targetSaleNoTax: BigToFixed(div(distFixObj.targetSaleNoTax, 1.13)),
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
              targetSaleNoTax: BigToFixed(div(distFixObj.targetSaleNoTax, 1.13)),
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
          VariableTotalTableData[0].customerInfo.pointCount = BigToFixed(add(VariableTotalTableData[0].customerInfo.pointCount, item.customerInfo.pointCount))
          VariableTotalTableData[0].customerInfo.taxPrice = BigToFixed(add(VariableTotalTableData[0].customerInfo.taxPrice, item.customerInfo.taxPrice))
          VariableTotalTableData[0].customerInfo.frieslandCostRatio = BigToFixed(add(VariableTotalTableData[0].customerInfo.frieslandCostRatio, item.customerInfo.frieslandCostRatio))
          VariableTotalTableData[0].customerInfo.frieslandTaxCost = BigToFixed(add(VariableTotalTableData[0].customerInfo.frieslandTaxCost, item.customerInfo.frieslandTaxCost))
          VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax = BigToFixed(add(VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax, item.customerInfo.frieslandCostRatioNoTax))
          VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax = BigToFixed(add(VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax, item.customerInfo.frieslandTaxCostNoTax))
          VariableTotalTableData[0].customerInfo.distCostRatio = BigToFixed(add(VariableTotalTableData[0].customerInfo.distCostRatio, item.customerInfo.distCostRatio))
          VariableTotalTableData[0].customerInfo.distTaxCost = BigToFixed(add(VariableTotalTableData[0].customerInfo.distTaxCost, item.customerInfo.distTaxCost))
        })
        console.log(VariableTableData)
        //计算Fixed 汇总行数据--客户维度
        FixedTableData.forEach((item) => {
          FixedTotalTableData[0].customerInfo.pointCount = BigToFixed(add(FixedTotalTableData[0].customerInfo.pointCount, item.customerInfo.pointCount))
          FixedTotalTableData[0].customerInfo.taxPrice = BigToFixed(add(FixedTotalTableData[0].customerInfo.taxPrice, item.customerInfo.taxPrice))
          FixedTotalTableData[0].customerInfo.frieslandCostRatio = BigToFixed(add(FixedTotalTableData[0].customerInfo.frieslandCostRatio, item.customerInfo.frieslandCostRatio))
          FixedTotalTableData[0].customerInfo.frieslandTaxCost = BigToFixed(add(FixedTotalTableData[0].customerInfo.frieslandTaxCost, item.customerInfo.frieslandTaxCost))
          FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax = BigToFixed(add(FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax, item.customerInfo.frieslandCostRatioNoTax))
          FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax = BigToFixed(add(FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax, item.customerInfo.frieslandTaxCostNoTax))
          FixedTotalTableData[0].customerInfo.distCostRatio = BigToFixed(add(FixedTotalTableData[0].customerInfo.distCostRatio, item.customerInfo.distCostRatio))
          FixedTotalTableData[0].customerInfo.distTaxCost = BigToFixed(add(FixedTotalTableData[0].customerInfo.distTaxCost, item.customerInfo.distTaxCost))
        })
        console.log(AllTotalTableData)
        //variable + fix 汇总行
        if (VariableTotalTableData.length || FixedTotalTableData.length) {
          if (VariableTotalTableData.length) {
            AllTotalTableData[0].customerInfo.pointCount = BigToFixed(add(AllTotalTableData[0].customerInfo.pointCount, VariableTotalTableData[0].customerInfo.pointCount))
            AllTotalTableData[0].customerInfo.taxPrice = BigToFixed(add(AllTotalTableData[0].customerInfo.taxPrice, VariableTotalTableData[0].customerInfo.taxPrice))
            AllTotalTableData[0].customerInfo.frieslandCostRatio = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandCostRatio, VariableTotalTableData[0].customerInfo.frieslandCostRatio))
            AllTotalTableData[0].customerInfo.frieslandTaxCost = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandTaxCost, VariableTotalTableData[0].customerInfo.frieslandTaxCost))
            AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax, VariableTotalTableData[0].customerInfo.frieslandCostRatioNoTax))
            AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax, VariableTotalTableData[0].customerInfo.frieslandTaxCostNoTax))
            AllTotalTableData[0].customerInfo.distCostRatio = BigToFixed(add(AllTotalTableData[0].customerInfo.distCostRatio, VariableTotalTableData[0].customerInfo.distCostRatio))
            AllTotalTableData[0].customerInfo.distTaxCost = BigToFixed(add(AllTotalTableData[0].customerInfo.distTaxCost, VariableTotalTableData[0].customerInfo.distTaxCost))
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
            AllTotalTableData[0].customerInfo.pointCount = BigToFixed(add(AllTotalTableData[0].customerInfo.pointCount, FixedTotalTableData[0].customerInfo.pointCount))
            AllTotalTableData[0].customerInfo.taxPrice = BigToFixed(add(AllTotalTableData[0].customerInfo.taxPrice, FixedTotalTableData[0].customerInfo.taxPrice))
            AllTotalTableData[0].customerInfo.frieslandCostRatio = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandCostRatio, FixedTotalTableData[0].customerInfo.frieslandCostRatio))
            AllTotalTableData[0].customerInfo.frieslandTaxCost = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandTaxCost, FixedTotalTableData[0].customerInfo.frieslandTaxCost))
            AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandCostRatioNoTax, FixedTotalTableData[0].customerInfo.frieslandCostRatioNoTax))
            AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax = BigToFixed(add(AllTotalTableData[0].customerInfo.frieslandTaxCostNoTax, FixedTotalTableData[0].customerInfo.frieslandTaxCostNoTax))
            AllTotalTableData[0].customerInfo.distCostRatio = BigToFixed(add(AllTotalTableData[0].customerInfo.distCostRatio, FixedTotalTableData[0].customerInfo.distCostRatio))
            AllTotalTableData[0].customerInfo.distTaxCost = BigToFixed(add(AllTotalTableData[0].customerInfo.distTaxCost, FixedTotalTableData[0].customerInfo.distTaxCost))
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
      })
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
              if (
                item.variablePoint.indexOf('fix') != -1 &&
                item.variablePoint.indexOf('variable') != -1
              ) {
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
        this.getTermInfo()
      })
    },
    //通过code 来查ContractItem
    getContractItemByCode(code, flag) {
      if (flag == 0) {
        let index = this.contractItemVariableList.findIndex(
          (item) => item.code === code
        )
        if (index != -1) {
          return this.contractItemVariableList[index].name
        }
      } else {
        let index = this.contractItemFixList.findIndex(
          (item) => item.code === code
        )
        if (index != -1) {
          return this.contractItemFixList[index].name
        }
      }
    },
    //根据客户扣缴税点 查index
    getCustomerTaxPoint(rate) {
      let num = this.CustomerDeductionsAndPayType.findIndex(
        (item) => item.CustomerDeduction == rate
      )
      if (num != -1) {
        return num
      } else {
        return ''
      }
    },
    //根据1/2/3 查名字
    getPaymentMethodText(rate, MethodValue) {
      let index = this.CustomerDeductionsAndPayType.findIndex((item) => item.CustomerDeduction == rate)
      if(index!=-1) {
        let num = this.CustomerDeductionsAndPayType[index].payTypeList.findIndex((item) => item.value == Number(MethodValue))
        if (num != -1) {
          return this.CustomerDeductionsAndPayType[index].payTypeList[num].value
        }
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
    getDealerPayType(CustomerDeductionIndex, payTypeValue) {
      if(CustomerDeductionIndex==''||payTypeValue=='') return ''
      let findIndex=CustomerDeductionsAndPayType[Number(CustomerDeductionIndex)].payTypeList.findIndex(item=>item.value==Number(payTypeValue))
      if(findIndex!=-1) {
        return CustomerDeductionsAndPayType[Number(CustomerDeductionIndex)].payTypeList[findIndex].label
      } else {
        return ''
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
    submit() {
      this.cancelSubmit()
    },
    cancelSubmit() {
      this.$router.push({
        path: '/contractManagement/dealer/dealerContractApproval/dealerContractTermApproval',
      })
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
        // 未税
        item.frieslandCostRatioNoTax = 0
        item.frieslandTaxCostNoTax = 0
      })
      //对行进行遍历
      for (let index = 0; index < this.AllTableData.length; index++) {
        if (!this.AllTableData[index].isTotal && this.AllTableData[index].isVariable) {
          const dealerList = this.AllTableData[index].dealerList
          //对variable经销商进行遍历
          for (let dealerIndex = 0; dealerIndex < dealerList.length; dealerIndex++) {
            const { pointCount, taxPrice, dcId, dealerName, frieslandPointCount, frieslandTaxPrice, dealerTaxPrice, dealerPointCount, frieslandCostRatioNoTax, frieslandTaxCostNoTax } = dealerList[dealerIndex]
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
                  frieslandCostRatioNoTax, //未税
                  frieslandTaxCostNoTax, //未税
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
                frieslandCostRatioNoTax, //未税
                frieslandTaxCostNoTax, //未税
              })
            }
          }
        }

        if (!this.AllTableData[index].isTotal && !this.AllTableData[index].isVariable) {
          const dealerList = this.AllTableData[index].dealerList
          //对Fixed 经销商进行遍历
          for (let dealerIndex = 0; dealerIndex < dealerList.length; dealerIndex++) {
            const { pointCount, taxPrice, dcId, dealerName, frieslandPointCount, frieslandTaxPrice, dealerTaxPrice, dealerPointCount, frieslandCostRatioNoTax, frieslandTaxCostNoTax } = dealerList[dealerIndex]
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
                  frieslandCostRatioNoTax, //未税
                  frieslandTaxCostNoTax, //未税
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
                frieslandCostRatioNoTax, //未税
                frieslandTaxCostNoTax, //未税
              })
            }
          }
        }
      }
      // 获取 Variable 索引
      let VariableIndex = this.AllTableData.findIndex((item) => item.name == 'Variable total')
      // 获取 Variable 索引
      let FixedIndex = this.AllTableData.findIndex((item) => item.name == 'Fixed total')
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
          let variableTotalFrieslandCostRatioNoTax = 0 //菲仕兰承担未税费比
          let variableTotalFrieslandTaxCostNoTax = 0 //菲仕兰承担未税含税金额
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            variableTotalPointCount = BigToFixedTwo(add(variableTotalPointCount, dealerItem.pointCount))
            variableTotalTaxPrice = BigToFixedTwo(add(variableTotalTaxPrice, dealerItem.taxPrice))
            variableTotalFrieslandTaxPrice = BigToFixedTwo(add(variableTotalFrieslandTaxPrice, dealerItem.frieslandTaxPrice))
            variableTotalFrieslandPointCount = BigToFixedTwo(add(variableTotalFrieslandPointCount, dealerItem.frieslandPointCount))
            variableTotalDealerTaxPrice = BigToFixedTwo(add(variableTotalDealerTaxPrice, dealerItem.dealerTaxPrice))
            variableTotalDealerPointCount = BigToFixedTwo(add(variableTotalDealerPointCount, dealerItem.dealerPointCount))
            variableTotalFrieslandCostRatioNoTax = BigToFixedTwo(add(variableTotalFrieslandCostRatioNoTax, dealerItem.frieslandCostRatioNoTax))
            variableTotalFrieslandTaxCostNoTax = BigToFixedTwo(add(variableTotalFrieslandTaxCostNoTax, dealerItem.frieslandTaxCostNoTax))
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[VariableIndex].dealerList[index].pointCount = variableTotalPointCount
          this.AllTableData[VariableIndex].dealerList[index].taxPrice = variableTotalTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].frieslandTaxPrice = variableTotalFrieslandTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].frieslandPointCount = variableTotalFrieslandPointCount
          this.AllTableData[VariableIndex].dealerList[index].dealerTaxPrice = variableTotalDealerTaxPrice
          this.AllTableData[VariableIndex].dealerList[index].dealerPointCount = variableTotalDealerPointCount
          this.AllTableData[VariableIndex].dealerList[index].frieslandCostRatioNoTax = variableTotalFrieslandCostRatioNoTax
          this.AllTableData[VariableIndex].dealerList[index].frieslandTaxCostNoTax = variableTotalFrieslandTaxCostNoTax
          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].taxPrice, variableTotalTaxPrice))
          this.AllTableData[0].dealerList[index].pointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].pointCount, variableTotalPointCount))
          this.AllTableData[0].dealerList[index].frieslandTaxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandTaxPrice, variableTotalFrieslandTaxPrice))
          this.AllTableData[0].dealerList[index].frieslandPointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandPointCount, variableTotalFrieslandPointCount))
          this.AllTableData[0].dealerList[index].dealerTaxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].dealerTaxPrice, variableTotalDealerTaxPrice))
          this.AllTableData[0].dealerList[index].dealerPointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].dealerPointCount, variableTotalDealerPointCount))
          this.AllTableData[0].dealerList[index].frieslandCostRatioNoTax = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandCostRatioNoTax, variableTotalFrieslandCostRatioNoTax))
          this.AllTableData[0].dealerList[index].frieslandTaxCostNoTax = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandTaxCostNoTax, variableTotalFrieslandTaxCostNoTax))
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
          let FixedTotalFrieslandCostRatioNoTax = 0 //菲仕兰承担费比不含税
          let FixedTotalFrieslandTaxCostNoTax = 0 //菲仕兰承担含税金额不含税
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            FixedTotalPointCount = BigToFixedTwo(add(FixedTotalPointCount, dealerItem.pointCount))
            FixedTotalTaxPrice = BigToFixedTwo(add(FixedTotalTaxPrice, dealerItem.taxPrice))
            FixedTotalFrieslandTaxPrice = BigToFixedTwo(add(FixedTotalFrieslandTaxPrice, dealerItem.frieslandTaxPrice))
            FixedTotalFrieslandPointCount = BigToFixedTwo(add(FixedTotalFrieslandPointCount, dealerItem.frieslandPointCount))
            FixedTotalDealerTaxPrice = BigToFixedTwo(add(FixedTotalDealerTaxPrice, dealerItem.dealerTaxPrice))
            FixedTotalDealerPointCount = BigToFixedTwo(add(FixedTotalDealerPointCount, dealerItem.dealerPointCount))
            FixedTotalFrieslandCostRatioNoTax = BigToFixedTwo(add(FixedTotalFrieslandCostRatioNoTax, dealerItem.frieslandCostRatioNoTax))
            FixedTotalFrieslandTaxCostNoTax = BigToFixedTwo(add(FixedTotalFrieslandTaxCostNoTax, dealerItem.frieslandTaxCostNoTax))
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[FixedIndex].dealerList[index].pointCount = FixedTotalPointCount
          this.AllTableData[FixedIndex].dealerList[index].taxPrice = FixedTotalTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].frieslandTaxPrice = FixedTotalFrieslandTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].frieslandPointCount = FixedTotalFrieslandPointCount
          this.AllTableData[FixedIndex].dealerList[index].dealerTaxPrice = FixedTotalDealerTaxPrice
          this.AllTableData[FixedIndex].dealerList[index].dealerPointCount = FixedTotalDealerPointCount
          this.AllTableData[FixedIndex].dealerList[index].frieslandCostRatioNoTax = FixedTotalFrieslandCostRatioNoTax
          this.AllTableData[FixedIndex].dealerList[index].frieslandTaxCostNoTax = FixedTotalFrieslandTaxCostNoTax
          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].taxPrice, FixedTotalTaxPrice))
          this.AllTableData[0].dealerList[index].pointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].pointCount, FixedTotalPointCount))
          this.AllTableData[0].dealerList[index].frieslandTaxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandTaxPrice, FixedTotalFrieslandTaxPrice))
          this.AllTableData[0].dealerList[index].frieslandPointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandPointCount, FixedTotalFrieslandPointCount))
          this.AllTableData[0].dealerList[index].dealerTaxPrice = BigToFixed(add(this.AllTableData[0].dealerList[index].dealerTaxPrice, FixedTotalDealerTaxPrice))
          this.AllTableData[0].dealerList[index].dealerPointCount = BigToFixed(add(this.AllTableData[0].dealerList[index].dealerPointCount, FixedTotalDealerPointCount))
          this.AllTableData[0].dealerList[index].frieslandCostRatioNoTax = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandCostRatioNoTax, FixedTotalFrieslandCostRatioNoTax))
          this.AllTableData[0].dealerList[index].frieslandTaxCostNoTax = BigToFixed(add(this.AllTableData[0].dealerList[index].frieslandTaxCostNoTax, FixedTotalFrieslandTaxCostNoTax))
        }
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
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return formatThousandNum(num)
    },
    //弹窗表格样式
    tableRowClassName({ row, rowIndex }) {
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
        return 'first-row'
      }
    },
    // 列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (row.name.indexOf('Total') !== -1) {
        return 'background-color: #4192d3 !important;color: #fff!important;'
      }
      if (columnIndex>=14&&(columnIndex - 14) % 13 == 0) {
        return 'background-color: #4192d3 !important;'
      }
      if(row.name.indexOf('Variable') !== -1&&columnIndex>14&&(columnIndex - 14) % 13 == 2) {
        let distributorIndex=Math.floor((columnIndex-14)/13)
        if(this.AllTableData[rowIndex].dealerList[distributorIndex].isException) {
          return 'color: #5588ff !important;font-weight:600'
        }
      }
      //菲仕兰承担 Exception 
      if(row.name.indexOf('Variable') !== -1&&columnIndex>14&&(columnIndex - 14) % 13 == 4) {
        let distributorIndex=Math.floor((columnIndex-14)/13)
        if(this.AllTableData[rowIndex].dealerList[distributorIndex].isFrieslandException) {
          return 'color: #5588ff !important;font-weight:600'
        }
      }
      //经销商承担 Exception 
      if(row.name.indexOf('Variable') !== -1&&columnIndex>14&&(columnIndex - 14) % 13 == 6) {
        let distributorIndex=Math.floor((columnIndex-14)/13)
        if(this.AllTableData[rowIndex].dealerList[distributorIndex].isDistException) {
          return 'color: #5588ff !important;font-weight:600'
        }
      }
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
  .customerInfo .topInfo {
    margin-left: 20px;
  }
  .distInfo .topInfo {
    margin-left: 20px;
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
.TpmPrompt{
  color: #4192d3;
  font-size: 15px;
  margin-top: 8px;
}
</style>

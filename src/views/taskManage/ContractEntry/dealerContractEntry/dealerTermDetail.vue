<!--
 * @Description: 
 * @Date: 2022-04-12 08:50:29
 * @LastEditTime: 2022-04-24 16:01:56
-->
<template>
  <div class="ContentDetail">
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="staging">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">暂存</span>
      </div>
      <div class="TpmButtonBG" @click="submit(0)">
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
      <el-table-column align="center" width="760" fixed="left">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 客户名称: {{AllTableData[0].customerInfo.customerName}}</span>
            <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(AllTableData[0].customerInfo.targetSale)}} </span>
          </div>
        </template>
        <template>
          <el-table-column width="760">
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
              <el-table-column v-slot={row} prop="conditionType" align="center" width="140" label="条件类型">
                {{row.customerInfo.conditionType}}
              </el-table-column>
              <el-table-column v-slot={row} prop="pointCount" align="center" width="100" label="费比（%）">
                {{row.customerInfo.pointCount}}%
              </el-table-column>
              <el-table-column v-slot={row} prop="taxPrice" align="center" width="150" label="含税金额（￥）">
                {{FormateNum(row.customerInfo.taxPrice)}}
              </el-table-column>
              <el-table-column v-slot={row} prop="detail" align="center" width="100" label="描述">
                {{row.customerInfo.detail}}
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <!-- 经销商 -->
      <el-table-column align="center" v-for="(dealerItem,dealerIndex) in AllTableData[0].dealerList" :key="dealerIndex">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 经销商名称: {{AllTableData[0].dealerList[dealerIndex].dealerName}}</span>
            <span class="topTarget"> 目标销售额(含税,¥): {{FormateNum(AllTableData[0].dealerList[dealerIndex].targetSale)}} </span>
          </div>
        </template>
        <template>
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
                    <el-input v-model="scope.row.dealerList[dealerIndex].pointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changePointCount(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                  <div v-else>{{scope.row.dealerList[dealerIndex].pointCount}}%</div>
                </template>
              </el-table-column>
              <el-table-column prop="taxPrice" align="center" width="150" label="含税金额（￥）">
                <template slot-scope="scope">
                  <div v-if="scope.row.dealerList[dealerIndex].isEditor&&!scope.row.isTotal&&!scope.row.isVariable">
                    <el-input v-model="scope.row.dealerList[dealerIndex].taxPrice" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changeTaxPrice(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                  <div v-else>
                    {{FormateNum(scope.row.dealerList[dealerIndex].taxPrice)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="detail" align="center" width="180" label="描述">
                <template slot-scope="scope">
                  <div>
                    <div v-if="!scope.row.isTotal&&scope.row.dealerList[dealerIndex].isEditor">
                      <el-input v-model="scope.row.dealerList[dealerIndex].detail" clearable class="my-el-detail" placeholder="请输入">
                      </el-input>
                    </div>
                    <div v-else>
                      {{scope.row.dealerList[dealerIndex].detail}}
                    </div>
                  </div>
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
                  <div v-if="!scope.row.isTotal">
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor">
                      <el-input v-model="scope.row.dealerList[dealerIndex].frieslandPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeFrieslandPointCount(scope.row,scope.$index,dealerIndex)">
                      </el-input>
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].frieslandPointCount)}}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="frieslandTaxPrice" align="center" width="150" label="含税金额（￥）">
                <div v-if="!row.isTotal">
                  {{FormateNum(row.dealerList[dealerIndex].frieslandTaxPrice)}}
                </div>
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
                  <div v-if="!scope.row.isTotal">
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor">
                      <el-input v-model="scope.row.dealerList[dealerIndex].dealerPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                        @blur="changeDealerPointCount(scope.row,scope.$index,dealerIndex)">
                      </el-input>
                    </div>
                    <div v-else>
                      {{FormateNum(scope.row.dealerList[dealerIndex].dealerPointCount)}}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="dealerTaxPrice" align="center" width="150" label="含税金额（￥）">
                <div v-if="!row.isTotal">
                  {{FormateNum(row.dealerList[dealerIndex].dealerTaxPrice)}}
                </div>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
            </template>
            <template>
              <el-table-column prop="customerTaxPoint" align="center" width="150" label="客户扣缴税点">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isTotal">
                    <div v-if="scope.row.dealerList[dealerIndex].isEditor">
                      <el-select v-model="scope.row.dealerList[dealerIndex].customerTaxPoint" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in TaxDeductionsPoint" :key="index" :label="item" :value="index" />
                      </el-select>
                      %
                    </div>
                    <div v-else>
                      {{scope.row.dealerList[dealerIndex].customerTaxPoint}}%
                      <!-- {{TaxDeductionsPoint[Number(scope.row.dealerList[dealerIndex].customerTaxPoint)]}} -->
                    </div>

                  </div>
                </template>

              </el-table-column>
              <el-table-column v-slot={row} prop="customerTaxPoint" align="center" width="120" label="支付方式">
                <!-- {{row.dealerList[dealerIndex].customerTaxPoint}} -->
                <div v-if="!row.isTotal">
                  <div v-if="row.dealerList[dealerIndex].isEditor">
                    <el-select v-model="row.dealerList[dealerIndex].payType" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in payTypeList" :key="index" :label="item" :value="index+1" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{payTypeList[row.dealerList[dealerIndex].payType]}}
                  </div>

                </div>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div> -->
  </div>
</template>

<script>
import API from '@/api/ContractEntry/dealer'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  FormateThousandNum,
  setSplitAssignee,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'dealerTermDetail',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      maxheight: getContractEntry(),
      AllTableData: [
        {
          name: 'Total',
          isVariable: 1, //total 、Fix 区分
          isTotal: 1, //是否是汇总行
          customerInfo: {
            customerName: '高鑫零售', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: '',
            conditionType: '',
            pointCount: 3,
            taxPrice: 21,
            detail: '',
            isVariable: 1, //total 、Fix 区分
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 10,
              taxPrice: 1000,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 10,
              taxPrice: 1000,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
          ],
        },
        {
          name: 'Variable',
          isTotal: 0,
          isVariable: 1, //total 、Fix 区分
          customerInfo: {
            customerName: '高鑫零售', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: 'contractItem',
            conditionType: 'conditionType',
            pointCount: 3,
            taxPrice: 21,
            detail: 'detail',
            isVariable: 1, //total 、Fix 区分
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 300,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 1,
              taxPrice: 100,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
          ],
        },
        {
          name: 'Variable',
          isTotal: 0,
          isVariable: 1, //total 、Fix 区分
          customerInfo: {
            customerName: '高鑫零售', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: 'contractItem',
            conditionType: 'conditionType',
            pointCount: 3,
            taxPrice: 21,
            detail: 'detail',
            isVariable: 1, //total 、Fix 区分
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 300,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 2,
              taxPrice: 200,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
          ],
        },
        {
          name: 'Variable total',
          isTotal: 1,
          customerInfo: {
            customerName: '', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: '',
            conditionType: '',
            pointCount: 3,
            taxPrice: 21,
            detail: '',
            isVariable: 1, //total 、Fix 区分
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 21,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 21,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
              isVariable: 1, //total 、Fix 区分
            },
          ],
        },
        {
          name: 'Fixed',
          isTotal: 0,
          isVariable: 0, //total 、Fix 区分
          customerInfo: {
            customerName: '高鑫零售', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: 'contractItem',
            conditionType: 'conditionType',
            pointCount: 3,
            taxPrice: 21,
            detail: 'detail',
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 1,
              taxPrice: 100,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 300,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
            },
          ],
        },
        {
          name: 'Fixed',
          isTotal: 0,
          isVariable: 0, //total 、Fix 区分
          customerInfo: {
            customerName: '高鑫零售', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: 'contractItem',
            conditionType: 'conditionType',
            pointCount: 3,
            taxPrice: 21,
            detail: 'detail',
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 300,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 1,
              taxPrice: 100,
              detail: 'detail',
              frieslandPointCount: 0, //菲仕兰承担费比
              frieslandTaxPrice: 0, //菲仕兰承担--含税金额
              dealerPointCount: 0, //经销商承担费比
              dealerTaxPrice: 0, //经销商承担--含税金额
              customerTaxPoint: 13, //客户扣款税点
            },
          ],
        },
        {
          name: 'Fixed total',
          isTotal: 1,
          isVariable: 0, //total 、Fix 区分
          customerInfo: {
            customerName: '', //客户名称
            targetSale: 10000, //客户目标销售额
            contractItem: '',
            conditionType: '',
            pointCount: 3,
            taxPrice: 21,
            detail: '',
          },
          dealerList: [
            {
              dealerName: '成都华隆',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 21,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
            },
            {
              dealerName: '成都华隆2',
              targetSale: 10000,
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 21,
              detail: '',
              frieslandPointCount: '', //菲仕兰承担费比
              frieslandTaxPrice: '', //菲仕兰承担--含税金额
              dealerPointCount: '', //经销商承担费比
              dealerTaxPrice: '', //经销商承担--含税金额
              customerTaxPoint: '', //客户扣款税点
            },
          ],
        },
      ],
      TaxDeductionsPoint: ['6', '13'],
      payTypeList: ['PO', '红票', '票扣'],
      ccId: null,
      tabKey: 0,
      isShow: false,
    }
  },

  mounted() {
    if (this.$route.query.ccId) {
      this.ccId = this.$route.query.ccId
      sessionStorage.setItem('ccId', this.$route.query.ccId)
    } else {
      this.ccId = sessionStorage.getItem('ccId')
    }
    this.getTermInfo()
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
        //copy  属性--》单个的客户variable
        customerVariableList.forEach((item) => {
          item.customerName = customerContract.customerName
          item.customerMdmCode = customerContract.customerMdmCode
          item.saleAmount = customerContract.saleAmount
        })
        let distributorList = res.data.distributorContract
        //经销商添加对应数量的variable /fixed
        distributorList.forEach((item) => {
          if (item.fixed.length == 0) {
            for (let index = 0; index < customerVariableList.length; index++) {
              let obj = {
                dcId: item.id,
                dealerName: item.distributorName,
                distributorMdmCode: item.distributorMdmCode,
                targetSale: item.saleAmount,
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
              }
              item.variable.push(obj)
            }
            for (let index = 0; index < customerFixList.length; index++) {
              let obj = {
                dcId: item.id,
                dealerName: item.distributorName,
                distributorMdmCode: item.distributorMdmCode,
                targetSale: item.saleAmount,
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
              }
              item.fixed.push(obj)
            }
          } else {
            item.variable.forEach((variableItem) => {
              variableItem.dcId = item.id
              variableItem.dealerName = item.distributorName
              variableItem.distributorMdmCode = item.distributorMdmCode
              variableItem.targetSale = item.saleAmount
            })
            item.fixed.forEach((fixedItem) => {
              fixedItem.dcId = item.id
              fixedItem.dealerName = item.distributorName
              fixedItem.distributorMdmCode = item.distributorMdmCode
              fixedItem.targetSale = item.saleAmount
            })
          }
        })
        console.log(distributorList)
        let AllTotalTableData = []
        let VariableTotalTableData = []
        let VariableTableData = []
        let FixedTotalTableData = []
        let FixedTableData = []
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
              contractItem: customerVariableObj.conditionsItem,
              conditionType: customerVariableObj.conditions,
              pointCount: customerVariableObj.costRatio,
              taxPrice: customerVariableObj.taxCost,
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
            },
            dealerList: [],
          }
          //取经销商对应的variable
          distributorList.forEach((item) => {
            let distVariableObj = item.variable[index]
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
              payType: Number(distVariableObj.payType), //支付方式
              isEditor:
                distVariableObj.contractState == '3' ||
                distVariableObj.contractState == '4'
                  ? 0
                  : 1,
            })
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
              contractItem: customerFixObj.conditionsItem,
              conditionType: customerFixObj.conditions,
              pointCount: customerFixObj.costRatio,
              taxPrice: customerFixObj.taxCost,
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
            },
            dealerList: [],
          }
          //取经销商对应的variable
          distributorList.forEach((item) => {
            let distFixObj = item.fixed[index]
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
              payType: Number(distFixObj.payType), //支付方式
              isEditor:
                distFixObj.contractState == '3' ||
                distFixObj.contractState == '4'
                  ? 0
                  : 1,
            })
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
            })
          })
          //初始化variable 汇总行--添加经销商
          if (FixedTotalTableData.length === 0) {
            FixedTotalTableData.push(FixedTotalObj)
          }
          FixedTableData.push(FixedObj)
        }
        //计算variable 汇总行数据--客户维度
        VariableTableData.forEach((item) => {
          VariableTotalTableData[0].customerInfo.pointCount += Number(
            item.customerInfo.pointCount
          )
          VariableTotalTableData[0].customerInfo.taxPrice += Number(
            item.customerInfo.taxPrice
          )
        })
        //计算Fixed 汇总行数据--客户维度
        FixedTableData.forEach((item) => {
          FixedTotalTableData[0].customerInfo.pointCount += Number(
            item.customerInfo.pointCount
          )
          FixedTotalTableData[0].customerInfo.taxPrice += Number(
            item.customerInfo.taxPrice
          )
        })
        //variable + fix 汇总行
        AllTotalTableData[0].customerInfo.pointCount =
          VariableTotalTableData[0].customerInfo.pointCount +
          FixedTotalTableData[0].customerInfo.pointCount
        AllTotalTableData[0].customerInfo.taxPrice =
          VariableTotalTableData[0].customerInfo.taxPrice +
          FixedTotalTableData[0].customerInfo.taxPrice
        this.AllTableData = [
          ...AllTotalTableData,
          ...VariableTableData,
          ...VariableTotalTableData,
          ...FixedTableData,
          ...FixedTotalTableData,
        ]
        //计算汇总行数据--经销商维度
        this.setVariableTotal()
        this.isShow = true
        this.tabKey++
      })
    },
    //根据客户扣缴税点 查index
    getCustomerTaxPoint(rate) {
      console.log(this.TaxDeductionsPoint.findIndex(item=> item==rate));
      return this.TaxDeductionsPoint.findIndex(item=> item==rate)
    },
    // 暂存
    staging() {
      //暂存
      this.submit(1)
    },
    //保存||提交
    submit(flag) {
      let exceptionList = []
      let errorList = []
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
          })
        }
        //error 错误  经销商含税总金额大于客户含税金额 报error
        if (!item.isTotal && !item.isVariable) {
          let customerTaxPrice = item.customerInfo.taxPrice
          let dealerList = item.dealerList
          let dealerTaxPrice = dealerList.reduce((total, current) => {
            return total + Number(current.taxPrice)
          }, 0)
          if (dealerTaxPrice > customerTaxPrice) {
            errorList.push({
              rowIndex: index,
            })
          }
        }
      })
      let Obj = {
        ccId: this.ccId,
        isTempStorage: flag, //0 否(参与校验)/1是(不参与校验)
        details: {},
      }
      this.AllTableData.forEach((row) => {
        if (!row.isTotal) {
          row.dealerList.forEach((distItem) => {
            //没有该经销商，添加该经销商对应的条款明细
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
                deductionTaxRate:
                  this.TaxDeductionsPoint[distItem.customerTaxPoint],
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
                deductionTaxRate:
                  this.TaxDeductionsPoint[distItem.customerTaxPoint],
                payType: distItem.payType,
              })
            }
          })
        }
      })
      console.log(Obj)
      API.saveContractDetail(Obj).then((res) => {
        if (res.code === 1000) {
          if(flag) {
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
    },
    //更改费比 --》 含税金额
    changePointCount(Obj, index, dealerIndex) {
      let { pointCount, targetSale } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].taxPrice =
        (pointCount * targetSale) / 100
      this.setVariableTotal()
    },
    // 更改含税金额 --》 费比
    changeTaxPrice(Obj, index, dealerIndex) {
      let { taxPrice, targetSale } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].pointCount =
        (100 * taxPrice) / targetSale
      this.setVariableTotal()
    },
    //设置Variable、Fixed   Total
    setVariableTotal() {
      let AllVariableDealer = {}
      let AllFixedDealer = {}

      this.AllTableData[0].dealerList.forEach((item) => {
        item.taxPrice = 0
        item.pointCount = 0
      })
      //对行进行遍历
      for (let index = 0; index < this.AllTableData.length; index++) {
        if (
          !this.AllTableData[index].isTotal &&
          this.AllTableData[index].isVariable
        ) {
          const dealerList = this.AllTableData[index].dealerList
          //对variable经销商进行遍历
          for (
            let dealerIndex = 0;
            dealerIndex < dealerList.length;
            dealerIndex++
          ) {
            const { pointCount, taxPrice, dealerName } = dealerList[dealerIndex]
            if (!AllVariableDealer[dealerName]) {
              AllVariableDealer[dealerName] = [
                { pointCount, taxPrice, dealerIndex },
              ]
            } else {
              AllVariableDealer[dealerName].push({
                pointCount,
                taxPrice,
                dealerIndex,
              })
            }
          }
        }

        if (
          !this.AllTableData[index].isTotal &&
          !this.AllTableData[index].isVariable
        ) {
          const dealerList = this.AllTableData[index].dealerList
          //对Fixed 经销商进行遍历
          for (
            let dealerIndex = 0;
            dealerIndex < dealerList.length;
            dealerIndex++
          ) {
            const { pointCount, taxPrice, dealerName } = dealerList[dealerIndex]
            if (!AllFixedDealer[dealerName]) {
              AllFixedDealer[dealerName] = [
                { pointCount, taxPrice, dealerIndex },
              ]
            } else {
              AllFixedDealer[dealerName].push({
                pointCount,
                taxPrice,
                dealerIndex,
              })
            }
          }
        }
      }
      // 获取 Variable 索引
      let VariableIndex = this.AllTableData.findIndex(
        (item) => item.name == 'Variable total'
      )
      // 获取 Variable 索引
      let FixedIndex = this.AllTableData.findIndex(
        (item) => item.name == 'Fixed total'
      )
      //遍历variable 经销商
      for (const key in AllVariableDealer) {
        if (Object.hasOwnProperty.call(AllVariableDealer, key)) {
          const dealerList = AllVariableDealer[key]
          let variableTotalPointCount = 0
          let variableTotalTaxPrice = 0
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            variableTotalPointCount += Number(dealerItem.pointCount)
            variableTotalTaxPrice += Number(dealerItem.taxPrice)
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[VariableIndex].dealerList[index].pointCount =
            variableTotalPointCount
          this.AllTableData[VariableIndex].dealerList[index].taxPrice =
            variableTotalTaxPrice
          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice +=
            variableTotalTaxPrice
          this.AllTableData[0].dealerList[index].pointCount +=
            variableTotalPointCount
        }
      }
      //遍历Fixed 经销商
      for (const key in AllFixedDealer) {
        if (Object.hasOwnProperty.call(AllFixedDealer, key)) {
          const dealerList = AllFixedDealer[key]
          let FixedTotalPointCount = 0
          let FixedTotalTaxPrice = 0
          let index = 0
          //记录每个经销商的合 并取得经销商的索引
          dealerList.forEach((dealerItem) => {
            FixedTotalPointCount += Number(dealerItem.pointCount)
            FixedTotalTaxPrice += Number(dealerItem.taxPrice)
            index = dealerItem.dealerIndex
          })
          //将当前的经销商的和赋值给当前经销商的VariableTotal
          this.AllTableData[FixedIndex].dealerList[index].pointCount =
            FixedTotalPointCount
          this.AllTableData[FixedIndex].dealerList[index].taxPrice =
            FixedTotalTaxPrice

          //汇总variable Total行--》Total
          this.AllTableData[0].dealerList[index].taxPrice += FixedTotalTaxPrice
          this.AllTableData[0].dealerList[index].pointCount +=
            FixedTotalPointCount
        }
      }
    },
    //更改菲仕兰承担费比--》菲仕兰承担含税金额
    changeFrieslandPointCount(Obj, index, dealerIndex) {
      // debugger
      let { frieslandPointCount, targetSale, pointCount } =
        Obj.dealerList[dealerIndex]
      frieslandPointCount = Number(frieslandPointCount)
      if (0 <= frieslandPointCount && frieslandPointCount <= pointCount) {
        if (frieslandPointCount == pointCount) {
          this.AllTableData[index].dealerList[dealerIndex].dealerTaxPrice = 0
        } else {
          this.AllTableData[index].dealerList[dealerIndex].dealerPointCount =
            pointCount - frieslandPointCount
          this.changeDealerPointCount(Obj, index, dealerIndex)
        }
        this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice =
          (frieslandPointCount * targetSale) / 100
      } else {
        this.$message.info(
          `第${index}行 ${this.AllTableData[index].name} ${this.AllTableData[index].dealerList[dealerIndex].dealerName}  菲仕兰承担费比+经销商承担费比应该等于客户费比`
        )
        this.AllTableData[index].dealerList[dealerIndex].frieslandPointCount = 0
        this.AllTableData[index].dealerList[dealerIndex].frieslandTaxPrice = 0
        this.AllTableData[index].dealerList[dealerIndex].dealerPointCount = 0
      }
    },
    //更改经销商承担费比--》经销商承担含税金额
    changeDealerPointCount(Obj, index, dealerIndex) {
      let { dealerPointCount, targetSale } = Obj.dealerList[dealerIndex]
      this.AllTableData[index].dealerList[dealerIndex].dealerTaxPrice =
        (dealerPointCount * targetSale) / 100
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
      return FormateThousandNum(num)
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
      if (row.name.indexOf('total') !== -1) {
        return 'background-color: #E3F3FF !important;color: #666!important;'
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
</style>
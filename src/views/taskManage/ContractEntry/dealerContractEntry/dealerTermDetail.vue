<!--
 * @Description: 
 * @Date: 2022-04-12 08:50:29
 * @LastEditTime: 2022-04-14 14:13:54
-->
<template>
  <div class="ContentDetail">
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="staging">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">暂存</span>
      </div>
      <div class="TpmButtonBG" @click="submit">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
      <div class="TpmButtonBG cancelButton" @click="cancelSubmit">
        <span class="text">取消</span>
      </div>
    </div>
    <el-table :data="AllTableData" :max-height="maxheight" :min-height="800" border :header-cell-style="HeadTable" :cell-style="columnStyle" :row-class-name="tableRowClassName"
      style="width: 100%">
      <!-- 客户 -->
      <el-table-column align="center" width="760" fixed="left">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 客户名称: {{AllTableData[0].customerInfo.customerName}}</span>
            <span class="topTarget"> 目标销售额(含税,¥): {{AllTableData[0].customerInfo.targetSale}} </span>
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
            <span class="topTarget"> 目标销售额(含税,¥): {{AllTableData[0].dealerList[dealerIndex].targetSale}} </span>
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
                  <div v-if="!scope.row.isTotal&&scope.row.isVariable">
                    <el-input v-model="scope.row.dealerList[dealerIndex].pointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changePointCount(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                  <div v-else>
                    {{scope.row.dealerList[dealerIndex].pointCount}}%
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="taxPrice" align="center" width="150" label="含税金额（￥）">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isTotal&&!scope.row.isVariable">
                    <el-input v-model="scope.row.dealerList[dealerIndex].taxPrice" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changeTaxPrice(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                  <div v-else>
                    {{FormateNum(scope.row.dealerList[dealerIndex].taxPrice)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="detail" align="center" width="150" label="描述">
                {{row.dealerList[dealerIndex].detail}}
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
                    <el-input v-model="scope.row.dealerList[dealerIndex].frieslandPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changeFrieslandPointCount(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>

                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="frieslandTaxPrice" align="center" width="150" label="含税金额（￥）">
                {{row.dealerList[dealerIndex].frieslandTaxPrice}}
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
                    <el-input v-model="scope.row.dealerList[dealerIndex].dealerPointCount" clearable class="my-el-inputNumber" placeholder="请输入"
                      @blur="changeDealerPointCount(scope.row,scope.$index,dealerIndex)">
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-slot={row} prop="dealerTaxPrice" align="center" width="150" label="含税金额（￥）">
                {{row.dealerList[dealerIndex].dealerTaxPrice}}
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
                    <el-select v-model="scope.row.dealerList[dealerIndex].customerTaxPoint" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in TaxDeductionsPoint" :key="index" :label="item" :value="index" />
                    </el-select>
                  </div>
                </template>

              </el-table-column>
              <el-table-column v-slot={row} prop="customerTaxPoint" align="center" width="120" label="支付方式">
                {{row.dealerList[dealerIndex].customerTaxPoint}}
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import API from '@/api/taskManage/taskManage.js'
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
      TaxDeductionsPoint: ['6%', '13%'],
    }
  },

  mounted() {},

  methods: {
    // 暂存
    staging() {},
    submit() {
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
                ...dealerItem
              })
            }
          })
        }
        if (!item.isTotal && !item.isVariable) {
          let customerTaxPrice = item.customerInfo.taxPrice
          let dealerList = item.dealerList
          let dealerTaxPrice= dealerList.reduce((total,current)=>{
           return total+Number(current.taxPrice)
          })
          console.log(dealerTaxPrice);
          // dealerList.forEach((dealerItem, dealerIndex) => {
          //   if (dealerItem.pointCount > customerPointCount) {
          //     errorList.push({
          //       rowIndex: index,
          //       dealerIndex,
          //       ...dealerItem
          //     })
          //   }
          // })
        }
      })
      // console.log(exceptionList);
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
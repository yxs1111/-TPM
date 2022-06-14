<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-06-14 15:54:11
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in customerArr" :key="index" :label="item.customer_cs_name" :value="item.customer_mdm_code" />
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
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap" style="align-items: center;">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="addNewRow" v-permission="permissions['insert']">新增一行</el-button>
      <!-- <div class="TpmButtonBG" @click="save">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div> -->
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">提交</el-button>
      <div class="tip" v-if="!(!isSubmit&&isSelf&&isGainLe)">
          <span class="tipStar">*</span>
          注意事项：如果合同期间存在跨年情况，请分两份录入
      </div>
      <!-- <div class="TpmButtonBG cancelButton" @click="cancelAddNewRow">
        <span class="text">取消</span>
      </div> -->
    </div>
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
            <div class="haveText_delete" @click="deleteRow(scope.row, scope.$index)" v-permission="permissions['delete']">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-permission="permissions['update']" v-show="!scope.row.isEditor&&!scope.row.isNewData" @click="editorRow(scope.$index,scope.row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor &&!scope.row.isNewData" @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerMdmCode" fixed align="center" width="220" label="客户名称">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.customerMdmCode" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in customerArr" :key="index" :label="item.customer_cs_name" :value="item.customer_mdm_code" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.saleAmount" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{FormateNum(scope.row.saleAmount ? scope.row.saleAmount : 0)}}
            <!-- {{ scope.row.saleAmount ? scope.row.saleAmount : 0 }} -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间(不允许跨年)">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" :picker-options="pickerOptions" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.contractBeginDate.replaceAll('-','/') + ' - ' + scope.row.contractEndDate.replaceAll('-','/') }}
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
      <el-table-column align="center" width="160" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div>
              {{ contractList[scope.row.contractState] }}
            </div>
            <div class="timeOutWrap">
              <el-popover :ref="'popover-' + scope.row.id" placement="right" width="300" trigger="click">
                <div class="PopoverContent">
                  <div class="PopoverContentTop">
                    <span>合同终止</span>
                  </div>
                  <div class="PopoverContentOption">
                    <div class="PopoverContentOptionItem">
                      <span class="PopoverContentOptionItemText">更改时间</span>
                      <el-date-picker v-model="scope.row.expireDate" value-format="yyyyMM" format="yyyyMM" type="month" placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="PopoverContentFoot">
                    <div class="TpmButtonBG" @click="popoverSubmit(scope.$index,scope.row)">保存</div>
                    <div class="TpmButtonBG cancelButton" @click="popoverCancel(scope.row.id)">取消</div>
                  </div>
                </div>
                <svg-icon :icon-class="scope.row.earlyExpireDate!=null?'timeout':'timeout_dark'" slot="reference" class="svgIcon" />
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="合同条款">
        <template slot-scope="scope">
          <div class="seeActivity" @click="showTermsDetail(scope.$index)">
            条款明细
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.remark" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.remark }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="poApprovalComments" align="center" width="220" label="Package Owner意见" />
      <el-table-column prop="finApprovalComments" align="center" width="220" label="Finance 意见"></el-table-column>
      <el-table-column prop="createBy" align="center" width="240" label="创建人"></el-table-column>
      <el-table-column prop="createDate" align="center" width="220" label="创建时间"></el-table-column>
      <el-table-column prop="updateBy" align="center" width="240" label="修改人"></el-table-column>
      <el-table-column prop="updateDate" align="center" width="220" label="修改时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="90%" ref="termDialog" v-elDragDialog class="my-el-dialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
      <div class="dialogContent">
        <div class="termInfo">
          <span class="termItem">客户名称:{{termInfo.customerName}}</span>
          <span class="termItem">目标销售额(RMB):{{FormateNum(termInfo.saleAmount)}}</span>
          <span
            class="termItem">合同期间:{{termInfo.contractBeginDate?termInfo.contractBeginDate.replaceAll('-','/'):''}}-{{termInfo.contractEndDate?termInfo.contractEndDate.replaceAll('-','/'):''}}</span>
          <span class="termItem">系统生效时间:{{termInfo.effectiveBeginDate}}-{{termInfo.effectiveEndDate}}</span>
          <span class="termItem">合同状态:{{contractList[termInfo.contractState]}}</span>
        </div>
        <div class="termTableWrap">
          <el-table :data="termVariableData" ref="termVariableTable" max-height="250" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
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
            <el-table-column align="center" width="160" label="条件类型">
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
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" style="display: flex;align-items: center;">
                  <el-input v-model="scope.row.costRatio" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index,scope.row)">
                  </el-input>
                  <span>%</span>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ termInfo.saleNumber*(scope.row.costRatio/100) }} -->
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(0,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap" v-if="isEditor">
            <div class="addNewRow" @click="addNewRowToVariable">
              <i class="el-icon-plus"></i>
              <span class="addNewRowText">新增一行</span>
            </div>
          </div>
          <el-table :data="termFixData" ref="termFixTable" :show-header="false" max-height="250" style="width: 100%" :header-cell-style="HeadTable"
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
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(1,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemFixList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemFixList[Number(scope.row.contractItem)].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemFixList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ (termInfo.saleNumber/scope.row.cost) }}% -->
                  {{FormateNum(scope.row.costRatio)}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model="scope.row.taxCost" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index,scope.row)">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(1,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap" v-if="isEditor">
            <div class="addNewRow" @click="addNewRowToFix">
              <i class="el-icon-plus"></i>
              <span class="addNewRowText">新增一行</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTermsDetail()">确 定</el-button>
        <el-button @click="closeTermsDetail">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/customer'
import {
  getDefaultPermissions,
  getContractEntry,
  FormateThousandNum,
  contractList,
  contractItemVariableList,
  contractItemFixList,
  downloadFile,
  getCurrentYearRange,
  pickerOptions,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'UnStraightGiving',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        customerMdmCode: '',
        contractDate: [],
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        state: '',
      },
      maxheight: getContractEntry(),
      checkArr: [], //选中的数据
      tableData: [],
      customerArr: [],
      contractList: contractList,
      contractItemVariableList: contractItemVariableList,
      contractItemFixList: contractItemFixList,
      isAddCount: 0,
      tableKey: 0,
      customerId: 0,
      isTermsDetailVisible: false, //条款明细弹窗
      termInfo: {}, //条款明细信息
      termVariableData: [],
      termFixData: [],
      //VariableData+FixData
      TotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      VariableTotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      FixTotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      isEditor: 0,
      isShowPopover: false,
      selectDate:'', 
      pickerOptions: {
        onPick: (obj) => {
          this.selectDate=obj.minDate
          //若存在最大值，将已选中的值置空（下次可选另一年（且保证同年））
          if(obj.maxDate) {
            this.selectDate=''
          }
        },
        // 限制年月
        disabledDate: (time) => {
          const date=new Date(this.selectDate)
          const year = date.getFullYear()
          //未选择初始日期时，不做限制
          if (this.selectDate=='') {
            return false
          }
          return (
            //日期限制（同一年）
            time.getFullYear() == year ? false : true
          )
        },
      },
      permissions: getDefaultPermissions(),
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
    this.getContractItemList()
  },
  computed: {},
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
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        customerType: 3,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.isEditor = 0
          item.isNewData = 0
          // item.earlyExpireDate =item.earlyExpireDate!=''
          item.expireDate = item.earlyExpireDate //定时任务--终止日期字段
          item.contractDate = [item.contractBeginDate, item.contractEndDate]
          item.systemDate = [item.effectiveBeginDate, item.effectiveEndDate]
        })
        this.tableData = [...list]
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
        this.tempObj.tempInfo = null
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .getCustomerListByType({
          type: 3,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
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
          })
          console.log(list)
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
    //新增一行数据
    addNewRow() {
      this.tableData.unshift({
        customerName: '',
        saleAmount: '',
        Tax: '',
        NoTax: '',
        contractDate: getCurrentYearRange(),
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        contractStatus: 0,
        systemStatus: '',
        remark: '',
        packageOwner: '',
        finance: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
        isEditor: 1, //是否 处于编辑状态
        isNewData: 1, //是否 是新增的数据
        isTimeout: '',
        contractTimeoutStatus: '',
        contractTimeoutTime: '',
      })
      this.isAddCount++
      // this.tableKey++
    },
    cancelAddNewRow() {
      if (this.isAddCount <= 0) {
        this.$message.info('当前没有新增的行')
      } else {
        this.tableData.shift()
        this.isAddCount--
      }
    },
    //新增保存
    save() {
      let addList = this.tableData.filter((item) => item.isNewData == 1)
      let list = []
      addList.forEach((item) => {
        let obj = {
          customerMdmCode: '', //客户编号
          saleAmount: '', //目标销售额
          contractBeginDate: '', //合同区间-开始
          contractEndDate: '', //合同区间-结束
          effectiveBeginDate: '', //系统生效-开始时间
          effectiveEndDate: '', //系统生效-结束时间
          remark: '', //备注
        }
        obj.customerMdmCode = item.customerMdmCode
        obj.saleAmount = item.saleAmount
        obj.contractBeginDate = item.contractDate[0]
        obj.contractEndDate = item.contractDate[1]
        obj.effectiveBeginDate = item.systemDate[0]
        obj.effectiveEndDate = item.systemDate[1]
        obj.remark = item.remark
        list.push(obj)
      })
      API.addCustomerContract(list).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
        }
      })
    },
    saveSingle(row) {
      let obj = {
        customerMdmCode: '', //客户编号
        saleAmount: '', //目标销售额
        contractBeginDate: '', //合同区间-开始
        contractEndDate: '', //合同区间-结束
        effectiveBeginDate: '', //系统生效-开始时间
        effectiveEndDate: '', //系统生效-结束时间
        remark: '', //备注
      }
      obj.customerMdmCode = row.customerMdmCode
      obj.saleAmount = row.saleAmount
      obj.contractBeginDate = row.contractDate[0]
      obj.contractEndDate = row.contractDate[1]
      obj.effectiveBeginDate = row.systemDate[0]
      obj.effectiveEndDate = row.systemDate[1]
      obj.remark = row.remark
      API.addCustomerContract([obj]).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
        }
      })
    },
    //录入提交
    async submit() {
      if (this.checkArr.length === 0) return this.$message.info('请选择数据')
      else {
        this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            let IdList = []
            let isSubmit = 1
            for (let index = 0; index < this.checkArr.length; index++) {
              const item = this.checkArr[index]
              IdList.push(item.id)
              await API.findOneSaveDetail({
                id: item.id,
                isMain: 1,
                isDetail: 1,
              }).then((res) => {
                if (
                  res.data.fixed.length === 0 &&
                  res.data.variable.length === 0
                ) {
                  isSubmit = 0
                }
              })
            }
            //提交合同明细
            this.submitHandler(IdList, isSubmit)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //提交合同明细
    submitHandler(IdList, isSubmit) {
      if (isSubmit) {
        API.submitCustomerContract(IdList).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            this.$message.success('提交成功')
          }
        })
      } else {
        this.$message.info('合同条款明细不能为空')
      }
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    async exportData() {
     await API.exportCustomerContractInfo({
        customerType: 3,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '间供客户合同录入 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('客户合同录入导出成功!')
      })
      await API.exportCustomerContractDetail({
        customerType: 3,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '间供客户合同录入明细 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('客户合同录入明细导出成功!')
      })
    },
    //编辑行数据
    editorRow(index, { isNewData }) {
      if (
        this.tableData[index].contractState == '3' ||
        this.tableData[index].contractState == '4'
      ) {
        this.$message.info('合同状态已经通过，不能进行编辑操作')
        return
      }
      if (this.tempObj.tempInfo && !isNewData) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      //不存新增的数据，新增没有取消编辑
      if (!isNewData) {
        //存编辑之前的数据
        this.tempObj.rowIndex = index
        this.tempObj.tempInfo = { ...this.tableData[index] }
      }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => {
        if (!item.isNewData) {
          item.isEditor = 0
        }
      })
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      // this.tableData.forEach((item) => (item.isEditor = 0))
      if (this.tableData[index].isNewData) {
        //新增的不能取消编辑，只有删除
      } else {
        this.tableData[index].isEditor = 0
        this.tableData[index] = this.tempObj.tempInfo
      }
    },
    //删除该行数据
    deleteRow(row, index) {
      //删除新增的
      if (row.isNewData) {
        this.$confirm('确定要删除新增的数据吗？此操作不可逆', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.tableData.splice(index, 1)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        //删除数据库中的数据
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            console.log([this.tableData[index].id])
            API.deleteCustomerContract([this.tableData[index].id]).then(
              (res) => {
                if (res.code === 1000) {
                  this.getTableData()
                  if (res.data) {
                    this.$message.success('删除成功')
                  } else {
                    this.$message.info(`${res.message}`)
                  }
                }
              }
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //保存 该行
    saveRow(row, index) {
      if (row.saleAmount > 9999999999) {
        this.$message.info('超出最大数值')
      } else {
        if (row.isNewData) {
          //新增数据保存
          this.saveSingle(row)
        } else if (row.isEditor) {
          //修改操作
          API.updateCustomerContract({
            id: row.id,
            customerMdmCode: row.customerMdmCode,
            saleAmount: row.saleAmount,
            contractBeginDate: row.contractDate[0],
            contractEndDate: row.contractDate[1],
            effectiveBeginDate: row.systemDate[0],
            effectiveEndDate: row.systemDate[1],
            remark: row.remark,
          }).then((res) => {
            if (res.code === 1000) {
              this.getTableData()
              if (res.data) {
                this.$message.success('修改成功')
              } else {
                this.$message.info(`${res.message}`)
              }
            }
          })
        }
      }
    },
    //定时任务确定--终止合同
    popoverSubmit(index, row) {
      API.termination({
        id: row.id,
        date: row.expireDate,
      }).then((res) => {
        if (res.code === 1000) {
          this.$message.success('终止成功')
          this.popoverCancel(row.id)
          this.getTableData()
        }
      })
    },
    //定时任务取消
    popoverCancel(id) {
      this.$refs[`popover-` + id].doClose()
      this.tableKey++
    },
    //条款明细--弹窗展示
    showTermsDetail(index) {
      this.customerId = this.tableData[index].id
      let isEditor =
        this.tableData[index].contractState == '3' ||
        this.tableData[index].contractState == '4'
          ? 0
          : 1
      this.isEditor = isEditor
      if (this.tableData[index].isNewData) {
        this.$message.info('该数据为新增数据,请选择其它数据')
      } else {
        //草稿、被拒绝可以编辑，其他仅查看
        this.$refs.termDialog.$el.firstChild.style.height = '100%'
        API.findOneSaveDetail({
          id: this.customerId,
          isMain: 1,
          isDetail: 1,
        }).then((res) => {
          if (res.code === 1000) {
            this.termVariableData = []
            this.termFixData = []
            let data = res.data
            this.termInfo = { ...data }
            let variableListOrigin = this.termInfo.variable
            let variableList = []
            //获取total +variable total
            variableListOrigin.forEach((item) => {
              let obj = {
                type: item.type,
                contractItem: this.getContractItemByCode(
                  0,
                  item.conditionsItem
                ),
                conditionType: item.conditions,
                conditions: item.conditions,
                costRatio: item.costRatio,
                taxCost: item.taxCost,
                remark: item.remark,
                isNewData: isEditor, //是否未新添数据
                isTotal: 0, //是否total 行
              }
              variableList.push(obj)
              this.TotalData.totalCost += item.taxCost
              this.TotalData.totalPoint += item.costRatio
              this.VariableTotalData.totalCost += item.taxCost
              this.VariableTotalData.totalPoint += item.costRatio
            })
            let fixedListOrigin = this.termInfo.fixed
            let fixList = []
            //获取total +fixed total
            fixedListOrigin.forEach((item) => {
              let obj = {
                type: item.type,
                contractItem: this.getContractItemByCode(
                  1,
                  item.conditionsItem
                ),
                conditionType: item.conditions,
                conditions: item.conditions,
                costRatio: item.costRatio,
                taxCost: item.taxCost,
                remark: item.remark,
                isNewData: isEditor, //是否未新添数据
                isTotal: 0, //是否total 行
              }
              fixList.push(obj)
              this.TotalData.totalCost += item.taxCost
              this.TotalData.totalPoint += item.costRatio
              this.FixTotalData.totalCost += item.taxCost
              this.FixTotalData.totalPoint += item.costRatio
            })
            //variable  -- 设置Total
            this.termVariableData.unshift({
              type: 'Total',
              contractItem: '',
              conditionType: '',
              costRatio: this.TotalData.totalPoint,
              taxCost: this.TotalData.totalCost,
              remark: '',
              isNewData: 0, //是否未新添数据
              isTotal: 1, //是否total 行
            })
            //variable  -- 设置variable
            this.termVariableData = [...this.termVariableData, ...variableList]
            //variable  -- 设置variable total
            this.termVariableData.push({
              type: 'Variable total',
              contractItem: '',
              conditionType: '',
              costRatio: this.VariableTotalData.totalPoint,
              taxCost: this.VariableTotalData.totalCost,
              remark: '',
              isNewData: 0, //是否未新添数据
              isTotal: 1,
            })
            //Fixed  -- Fixed
            this.termFixData = [...this.termFixData, ...fixList]
            //Fixed  -- Fixed total
            this.termFixData.push({
              type: 'Fixed total',
              contractItem: '',
              conditionType: '',
              costRatio: this.FixTotalData.totalPoint,
              taxCost: this.FixTotalData.totalCost,
              remark: '',
              isNewData: 0, //是否未新添数据
              isTotal: 1,
            })
            this.isTermsDetailVisible = true
          }
        })
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
        let index = this.contractItemVariableList.findIndex(
          (item) => item.code == code
        )
        //variable
        return index != -1 ? index : 0
      } else {
        if (!code) {
          return 0
        }
        let index = this.contractItemFixList.findIndex(
          (item) => item.code == code
        )
        //fix
        return index != -1 ? index : 0
      }
    },
    //条款明细保存
    confirmTermsDetail() {
      let isCheck = 1 //费比校验
      let Repeat=0 //contract Item  是否重复
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
          let RepeatList= this.termVariableData.filter(vItem=>{
           return vItem.contractItem==item.contractItem&&vItem.conditions==item.conditions
          })
          if(RepeatList.length>1) {
            Repeat=1
          }
          let detailObj = {
            type: item.type, //明细类型 variable和fixed
            conditionsItem:
              this.contractItemVariableList[item.contractItem].code,
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
          let RepeatList= this.termFixData.filter(vItem=>{
           return vItem.contractItem==item.contractItem&&vItem.conditions==item.conditions
          })
          if(RepeatList.length>1) {
            Repeat=1
          }
          let detailObj = {
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
    },
    //新增条款--variable
    addNewRowToVariable() {
      //新添元素更改位置
      this.termVariableData.splice(-1, 0, {
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
      this.termFixData.splice(-1, 0, {
        type: 'Fixed',
        contractItem: 0,
        conditions:
          this.contractItemFixList[0].conditionalIsTwo == 2
            ? ''
            : this.contractItemFixList[0].conditionType,
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
    },
    //费比更改
    changeCostRate(index, row) {
      this.termVariableData[index].taxCost =
        this.termInfo.saleAmount * (Number(row.costRatio) / 100)
      this.getNewTotalData()
    },
    //含税费用更改
    changeCost(index, row) {
      // {{ (termInfo.saleAmount/scope.row.taxCost) }}%
      this.termFixData[index].costRatio =
        (Number(row.taxCost) / this.termInfo.saleAmount) * 100
      this.getNewTotalData()
    },
    // 获取total 数据
    getTotalData() {
      this.TotalData.totalCost = this.termVariableData[0].taxCost
      this.TotalData.totalPoint = this.termVariableData[0].costRatio
    },
    getNewTotalData() {
      this.VariableTotalData.totalPoint = 0
      this.VariableTotalData.totalCost = 0
      //汇总行索引
      let variableTotalIndex = this.termVariableData.length - 1
      //获取VariableData Total
      this.termVariableData.forEach((item, index) => {
        if (index > 0 && index < variableTotalIndex) {
          let { costRatio, taxCost } = item
          item.costRatio = Number(item.costRatio)
          this.VariableTotalData.totalPoint += Number(costRatio)
          this.VariableTotalData.totalCost += Number(taxCost)
        }
      })
      this.termVariableData[variableTotalIndex].costRatio =
        this.VariableTotalData.totalPoint
      this.termVariableData[variableTotalIndex].taxCost =
        this.VariableTotalData.totalCost
      this.FixTotalData.totalPoint = 0
      this.FixTotalData.totalCost = 0
      //汇总行索引
      let FixTotalIndex = this.termFixData.length - 1
      //获取FixData Total
      this.termFixData.forEach((item, index) => {
        if (index < FixTotalIndex) {
          let { costRatio, taxCost } = item
          item.taxCost = Number(item.taxCost)
          this.FixTotalData.totalPoint += Number(costRatio)
          this.FixTotalData.totalCost += Number(taxCost)
        }
      })
      this.termFixData[FixTotalIndex].costRatio = this.FixTotalData.totalPoint
      this.termFixData[FixTotalIndex].taxCost = this.FixTotalData.totalCost
      //获取所有VariableData Total+FixData Total
      this.TotalData.totalCost =
        this.VariableTotalData.totalCost + this.FixTotalData.totalCost
      this.TotalData.totalPoint =
        this.VariableTotalData.totalPoint + this.FixTotalData.totalPoint
      this.setAllTotalData()
    },
    setAllTotalData() {
      this.termVariableData[0].taxCost = this.TotalData.totalCost
      this.termVariableData[0].costRatio = this.TotalData.totalPoint
    },
    //处于草稿状态可提交
    checkSelectable(row) {
      return row.contractState === '0' || row.contractState === '2'
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
      return FormateThousandNum(num)
    },
  },
}
</script>

<style lang="scss" scoped>
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

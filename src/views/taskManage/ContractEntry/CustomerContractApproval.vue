<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-06-14 16:44:53
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in customerArr" :key="index" :label="item.customerName" :value="item.customerMdmCode" />
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
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">通过</el-button>
      <el-button type="primary" class="TpmButtonBG" @click="reject" v-permission="permissions['rejected']">驳回</el-button>
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
      <el-table-column prop="customerName" fixed align="center" width="220" label="客户名称">
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="220" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.customerContractSaleAmount ? scope.row.customerContractSaleAmount : 0)}}
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
            <el-input v-model="scope.row.poApprovalComments" clearable class="my-el-input" placeholder="请输入">
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
            <el-input v-model="scope.row.finApprovalComments" clearable class="my-el-input" placeholder="请输入">
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
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 条款明细 -->
    <el-dialog width="90%"  ref="termDialog" v-elDragDialog class="my-el-dialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
      <div class="dialogContent">
        <div class="termInfo">
          <span class="termItem">客户名称:{{termInfo.customerName}}</span>
          <span class="termItem">目标销售额(RMB):{{FormateNum(termInfo.saleAmount)}}</span>
          <span class="termItem">合同期间:{{termInfo.contractBeginDate?termInfo.contractBeginDate.replaceAll('-','/'):''}}-{{termInfo.contractEndDate?termInfo.contractEndDate.replaceAll('-','/'):''}}</span>
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
                  {{ contractItemVariableList[scope.row.contractItem].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="conditions" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costRatio }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div>
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
            </el-table-column>
          </el-table>
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
                  {{contractItemFixList[scope.row.contractItem].name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="conditions" align="center" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  {{scope.row.costRatio}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div>{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTermsDetail()">确 定</el-button>
        <el-button @click="closeTermsDetail">取 消</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/customerApproval'
import {
  getDefaultPermissions,
  getContractEntry,
  FormateThousandNum,
  contractList,
  contractItemVariableList,
  contractItemFixList,
  downloadFile,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'CustomerContractApproval',
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
      API.getApproveList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        minePackageCode: 'CUSTOMER-CONTRACT',
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.isEditor = 0
          item.packageOwner = ''
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
      selectAPI.getCustomerContract({}).then((res) => {
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
    //审批提交
    submit() {
      this.$confirm('此操作将审批通过, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.handleFunction(1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    //驳回操作
    reject() {
      this.$confirm('此操作将驳回审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.handleFunction(0)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    handleFunction(flag) {
      if (this.checkArr.length === 0) return this.$message.info('请选择数据')
      else {
        let obj = {
          opinion: flag ? 'agree' : 'reject',
          approveDetail: {},
        }
        //判断当前数据 所属角色审批
        this.checkArr.forEach((item) => {
          if (item.name.indexOf('Package Owner') != -1) {
            obj.approveDetail[item.businessKey] = item.poApprovalComments
          } else if (item.name.indexOf('Finance') != -1) {
            obj.approveDetail[item.businessKey] = item.finApprovalComments
          }
        })
        API.approveCustomerContract(obj).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            if(flag) {
              this.$message.success('审批成功！')
            } else {
              this.$message.success('驳回成功！')
            }
          }
        })
      }
    },
    exportData() {
      API.exportApprove({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        minePackageCode: 'CUSTOMER-CONTRACT',
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '客户合同审批 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //编辑行数据
    editorRow(index, row) {
      if (row.contractState == '3' || row.contractState == '4') {
        this.$message.info('该经销商已经通过，不能进行编辑')
        return
      }
      if (this.tempObj.tempInfo) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      //存编辑之前的数据
      this.tempObj.rowIndex = index
      this.tempObj.tempInfo = { ...this.tableData[index] }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => {
        item.isEditor = 0
      })
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      this.tableData[index].isEditor = 0
      this.tableData[index] = this.tempObj.tempInfo
    },
    //保存 该行
    saveRow(row) {
      let obj = {}
      if (row.name.indexOf('Package Owner') != -1) {
        obj[row.businessKey] = row.poApprovalComments
      } else if (row.name.indexOf('Finance') != -1) {
        obj[row.businessKey] = row.finApprovalComments
      }
      API.saveApproveComments(obj).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
          if (res.data) {
            this.$message.success('修改成功')
          } else {
            this.$message.info(`${res.message}`)
          }
        }
      })
    },
    //条款明细--弹窗展示
    showTermsDetail(index) {
      this.customerId = this.tableData[index].ccId
      // 设置屏幕高度90%
      this.$refs.termDialog.$el.firstChild.style.height = '100%'
      //草稿、被拒绝可以编辑，其他仅查看
      API.findOneSaveDetail({
        id: this.customerId,
        isMain: 1,
        isDetail: 1,
      }).then((res) => {
        if (res.code === 1000) {
          this.isTermsDetailVisible = true
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
              contractItem: this.getContractItemByCode(0, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              remark: item.remark,
              isNewData: 1, //是否未新添数据
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
              contractItem: this.getContractItemByCode(1, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              remark: item.remark,
              isNewData: 1, //是否未新添数据
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
        }
      })
    },
    //通过code 获取ContractItem索引展示
    getContractItemByCode(flag, code) {
      if (!flag) {
        if (!code) {
          return 0
        }
        let index=this.contractItemVariableList.findIndex(
          (item) => item.code == code
        )
        //variable
        return index!=-1?index:0
      } else {
        if (!code) {
          return 0
        }
        let index=this.contractItemFixList.findIndex((item) => item.code == code)
        //fix
        return index!=-1?index:0
      }
    },
    //条款明细保存
    confirmTermsDetail() {
      this.closeTermsDetail()
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
    //处于草稿状态可提交
    checkSelectable(row) {
      // return row.contractState === '0'
      return 1
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
  background: #D7E8F2;
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
    margin-bottom: 20px;
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

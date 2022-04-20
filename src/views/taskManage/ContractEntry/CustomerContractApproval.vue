<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-20 17:22:28
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
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG">通过</el-button>
      <el-button type="primary" class="TpmButtonBG">驳回</el-button>
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
            <div class="haveText_delete" @click="deleteRow(scope.row, scope.$index)">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isNewData&&scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isEditor&&!scope.row.isNewData" @click="editorRow(scope.$index,scope.row)">
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
      <el-table-column prop="customerName" align="center" width="220" label="客户名称">
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.saleAmount ? scope.row.saleAmount : 0)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.contractBeginDate + ' - ' + scope.row.contractEndDate }}
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
      <el-table-column width="220" align="center" label="合同条款">
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
    <!-- 导入 -->
    <el-dialog width="90%" v-elDragDialog class="my-el-dialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
      <div class="dialogContent">
        <div class="termInfo">
          <span class="termItem">客户名称:{{termInfo.customerName}}</span>
          <span class="termItem">目标销售额:{{FormateNum(termInfo.saleAmount)}}</span>
          <span class="termItem">合同期间:{{termInfo.contractBeginDate}}-{{termInfo.contractEndDate}}</span>
          <span class="termItem">系统生效时间:{{termInfo.effectiveBeginDate}}-{{termInfo.effectiveEndDate}}</span>
          <span class="termItem">合同状态:{{contractList[termInfo.contractState]}}</span>
        </div>
        <div class="termTableWrap">
          <el-table :data="termVariableData" ref="termVariableTable" max-height="150" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
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
                <div v-show="scope.row.isTotal">
                  {{ scope.row.conditionsItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="conditions" width="160" label="条件类型">
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isTotal">
                  {{ scope.row.costRatio }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div>
                  {{scope.row.taxCost}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="描述">
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap">
          </div>
          <el-table :data="termFixData" ref="termFixTable" :show-header="false" max-height="100" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="conditionsItem" align="center" label="contract item" width="160">
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
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'StraightGiving',
  data() {
    return {
      total: 1,
      pageSize: 10,
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
        customerType: 1,
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
          item.expireDate = '' //定时任务--终止日期字段
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
          type: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    //录入提交
    submit() {
      if (this.checkArr.length === 0) return this.$message.info('请选择数据')
      else {
        let IdList = []
        this.checkArr.forEach((item) => {
          IdList.push(item.id)
        })
        API.submitCustomerContract(IdList).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            this.$message.success('提交成功')
          }
        })
      }
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //编辑行数据
    editorRow(index, { isNewData }) {
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
    },
    //定时任务确定--终止合同
    popoverSubmit(index, row) {
      API.termination({
        id: row.id,
        contractEndDate: row.expireDate,
      }).then((res) => {
        if (res.code === 1000) {
          this.$message.success('终止成功')
          this.popoverCancel(index)
          this.getTableData()
        }
      })
    },
    //定时任务取消
    popoverCancel(index) {
      // console.log(this.$refs[`popover-` + index]);
      this.$refs[`popover-` + index].doClose()
    },
    //条款明细--弹窗展示
    showTermsDetail(index) {
      this.customerId = this.tableData[index].id
      if (this.tableData[index].isNewData) {
        this.$message.info('该数据为新增数据,请选择其它数据')
      } else {
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
                contractItem: this.getContractItemByCode(
                  0,
                  item.conditionsItem
                ),
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
                contractItem: this.getContractItemByCode(
                  1,
                  item.conditionsItem
                ),
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
      }
    },
    //通过code 获取ContractItem索引展示
    getContractItemByCode(flag, code) {
      if (!flag) {
        if (!code) {
          return 0
        }
        //variable
        return this.contractItemVariableList.findIndex(
          (item) => item.code == code
        )
      } else {
        if (!code) {
          return 0
        }
        //fix
        return this.contractItemFixList.findIndex((item) => item.code == code)
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
      return row.contractState === '0'
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
.MainContent .select_date {
  width: 240px !important;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
</style>

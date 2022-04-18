<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-18 16:50:41
-->
<template>
  <div class="MainContent">
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="addNewRow">新增一行</el-button>
      <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div>
      <el-button type="primary"  class="TpmButtonBG" @click="submit">提交</el-button>
      <!-- <div class="TpmButtonBG cancelButton" @click="cancelAddNewRow">
        <span class="text">取消</span>
      </div> -->
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" />
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
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.customerName" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item in customerArr" :key="item.customerMdmCode" :label="item.customerCsName" :value="item.customerCsName" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额">
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
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor && scope.row.contractDate.length">
            {{ scope.row.contractDate[0] + ' - ' + scope.row.contractDate[1] }}
            <!-- {{scope.row.contractDate}} -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="220" label="系统生效时间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.systemDate" type="monthrange" value-format="yyyy-MM-dd" format="yyyy-MM" range-separator="至" start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor && scope.row.systemDate.length">
            {{ scope.row.systemDate[0].substring(0,7) + ' - ' + scope.row.systemDate[1].substring(0,7) }}
            <!-- {{scope.row.contractDate}} -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractStatus" align="center" width="240" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <!-- <div v-show="scope.row.isEditor">
              <el-select v-model="scope.row.contractStatus" class="my-el-input" filterable clearable placeholder="请选择">
                <el-option v-for="(item,index) in ['草稿','提交']" :key="index" :label="item" :value="index" />
              </el-select>
            </div> -->
            <div>
              {{ scope.row.contractStatus == 0 ? '草稿' : '提交' }}
            </div>
            <!-- <div class="timeOutWrap">
              <el-popover :ref="'popover-' + scope.$index" placement="right" width="300" trigger="click">
                <div class="PopoverContent">
                  <div class="PopoverContentTop">
                    <span>定时更改状态</span>
                    <el-switch v-model="scope.row.contractTimeoutStatus" :active-value="1" :inactive-value="0">
                    </el-switch>
                  </div>
                  <div class="PopoverContentOption">
                    <div class="PopoverContentOptionItem">
                      <span class="PopoverContentOptionItemText">合同状态</span>
                      <el-select v-model="scope.row.contractTimeoutStatus" class="my-el-input" filterable clearable placeholder="请选择">
                        <el-option v-for="(item,index) in ['生效中','未生效','中止','作废']" :key="index" :label="item" :value="index" />
                      </el-select>
                    </div>
                    <div class="PopoverContentOptionItem">
                      <span class="PopoverContentOptionItemText">更改时间</span>
                      <el-date-picker v-model="scope.row.contractTimeoutTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="PopoverContentFoot">
                    <div class="TpmButtonBG" @click="popoverSubmit(scope.$index,scope.row)">保存</div>
                    <div class="TpmButtonBG cancelButton" @click="popoverCancel(scope.$index)">取消</div>
                  </div>
                </div>
                <svg-icon :icon-class="scope.row.contractTimeoutStatus==1?'timeout':'timeout_dark'" slot="reference" class="svgIcon" />
              </el-popover>
            </div> -->
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
      <el-table-column prop="applyRemark" align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor && scope.row.isNewData">
            <el-input v-model="scope.row.applyRemark" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor || !scope.row.isNewData">
            {{ scope.row.applyRemark }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="packageOwner" align="center" width="220" label="Package Owner意见" />
      <el-table-column prop="finance" align="center" width="220" label="Finance 意见"></el-table-column>
      <el-table-column prop="createUserName" align="center" width="220" label="创建人"></el-table-column>
      <el-table-column prop="createDate" align="center" width="220" label="创建时间"></el-table-column>
      <el-table-column prop="updateUserName" align="center" width="220" label="修改人"></el-table-column>
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
          <span class="termItem">名称:孩子王</span>
          <span class="termItem">未税IMK:100W</span>
          <span class="termItem">含税费用:50000</span>
          <span class="termItem">未税费用:50000</span>
          <span class="termItem">合同期限:2022.03.18至2022.04.18</span>
          <span class="termItem">合同状态:生效中</span>
          <span class="termItem">系统状态:草稿</span>
        </div>
        <div class="termTableWrap">
          <el-table :data="termVariableData" ref="termVariableTable" max-height="220" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                    <el-option v-for="(item, index) in contractItemVariableList" :key="index" :label="item.name" :value="index" />
                  </el-select>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.contractItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column  align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="scope.row.name.indexOf('Total')==-1&&scope.row.name.indexOf('total')==-1">
                  <!-- {{ contractItemVariableList[scope.row.contractItem].name }} -->
                  {{scope.row.contractItem!=''?contractItemVariableList[scope.row.contractItem].code:contractItemVariableList[0].code}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pointCount" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model.number="scope.row.pointCount" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index,scope.row)">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.pointCount }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column  align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ termInfo.saleNumber*(scope.row.pointCount/100) }} -->
                  {{scope.row.cost}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="isHaveTax" align="center" width="100" label="是否含税">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-select v-model="scope.row.isHaveTax" class="my-el-inputNumber" filterable clearable placeholder="请选择">
                    <el-option v-for="(item, index) in ['否', '是']" :key="index" :label="item" :value="index" />
                  </el-select>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.isHaveTax ? '是' : '否' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isWithholding" align="center" width="180" label="是否预提">
            </el-table-column>
            <el-table-column prop="taxRate" align="center" label="税率">
            </el-table-column> -->
            <el-table-column prop="detail" align="center"  label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model.number="scope.row.detail" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.detail }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap">
            <div class="addNewRow" @click="addNewRowToVariable">
              <i class="el-icon-plus"></i>
              <span class="addNewRowText">新增一行</span>
            </div>
          </div>
          <el-table :data="termFixData" ref="termFixTable" :show-header="false" max-height="160" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                    <el-option v-for="(item, index) in contractItemFixList" :key="index" :label="item.name" :value="index" />
                  </el-select>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.contractItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column  align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="scope.row.name.indexOf('Total')==-1&&scope.row.name.indexOf('total')==-1">
                  <!-- {{ contractItemVariableList[scope.row.contractItem].name }} -->
                  {{scope.row.contractItem!=''?contractItemFixList[scope.row.contractItem].code:contractItemFixList[0].code}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pointCount" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ (termInfo.saleNumber/scope.row.cost) }}% -->
                  {{scope.row.pointCount}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column  align="center" label="含税费用(¥)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model.number="scope.row.cost" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index,scope.row)">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">{{ scope.row.cost }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="isHaveTax" align="center" width="100" label="是否含税">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-select v-model="scope.row.isHaveTax" class="my-el-inputNumber" filterable clearable placeholder="请选择">
                    <el-option v-for="(item, index) in ['否', '是']" :key="index" :label="item" :value="index" />
                  </el-select>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.isHaveTax ? '是' : '否' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isWithholding" align="center" width="180" label="是否预提">
            </el-table-column>
            <el-table-column prop="taxRate" align="center" label="税率">
            </el-table-column> -->
            <el-table-column prop="detail" align="center"  label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model.number="scope.row.detail" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ scope.row.detail }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap">
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
      maxheight: getContractEntry(),
      checkArr: [], //选中的数据
      tableData: [
        {
          customerName: '孩子王',
          saleAmount: 100,
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['20220101', '20221201'],
          systemDate: ['2022-01-01', '2022-03-08'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createUserName: '创建人',
          createDate: '202201',
          updateUserName: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 1,
          contractTimeoutTime: '',
          isNewData: 0,
        },
        {
          customerName: '孩子王',
          saleAmount: 100,
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['20220101', '20221201'],
          systemDate: ['2022-01-01', '2022-01-08'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createUserName: '创建人',
          createDate: '202201',
          updateUserName: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 1,
          contractTimeoutTime: '',
          isNewData: 0,
        },
      ],
      customerArr: [],
      contractItemVariableList: [{name:'有条件月返',code:'Conditional'},{name:'无条件月返',code:'Unconditional'}],
      contractItemFixList: [{name:'路演',code:'Conditional'},{name:'陈列费',code:'Conditional'},{name:'数据费',code:'Conditional'}],
      isAddCount: 0,
      tableKey: 0,
      isTermsDetailVisible: false, //条款明细弹窗
      termInfo:{
        saleNumber:100
      },//条款明细信息
      termVariableData: [
        {
          name: 'Total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          isHaveTax: '',
          isWithholding: '',
          taxRate: '',
          detail: '',
          isNewData: 0, //是否未新添数据
        },
        {
          name: 'Variable',
          contractItem: 0,
          conditionType: 'conditional',
          pointCount: 3,
          cost: 21,
          isHaveTax: 1,
          isWithholding: 1,
          taxRate: '6%',
          detail: '描述',
          isNewData: 1, //是否未新添数据
        },
        {
          name: 'Variable total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          isHaveTax: '',
          isWithholding: '',
          taxRate: '',
          detail: '',
          isNewData: 0, //是否未新添数据
        },
      ],
      termFixData: [
        {
          name: 'Fix',
          contractItem: 0,
          conditionType: 'conditional',
          pointCount: 3,
          cost: 21,
          isHaveTax: 1,
          isWithholding: 1,
          taxRate: '6%',
          detail: '描述',
          isNewData: 1, //是否未新添数据
        },
        {
          name: 'Fix total',
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          cost: 21,
          isHaveTax: '',
          isWithholding: '',
          taxRate: '',
          detail: '',
          isNewData: 0, //是否未新添数据
        },
      ],
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
  watch: {
    // termVariableData: {
    //   handler: function () {
    //     //获取Variable和fix
    //     this.getNewTotalData()
    //   },
    //   deep: true,
    // },
    // termFixData: {
    //   handler: function () {
    //     this.getNewTotalData()
    //   },
    //   deep: true,
    // },
    // FixTotalData: {
    //   handler: function () {
    //     //设置两个total 的值，通过中间变量的形式
    //     this.setAllTotalData()
    //   },
    //   deep: true,
    // },
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
      }).then((response) => {
        // this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 客户
    getCustomerList() {
      selectAPI.getCustomerListByType({type:'1'}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
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
        contractDate: ['20220101', '20221201'],
        systemDate: ['202201', '202212'],
        contractStatus: 0,
        systemStatus: '',
        applyRemark: '',
        packageOwner: '',
        finance: '',
        createUserName: '',
        createDate: '',
        updateUserName: '',
        updateDate: '',
        isEditor: 0, //是否 处于编辑状态
        isNewData: 1, //是否 处于编辑状态
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
    //录入提交
    submit() {

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
          .then(() => {})
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //定时任务确定
    popoverSubmit(index, row) {
      this.tableData[index].contractTimeoutTime = '2022-03-31'
      let { id } = row
      this.popoverCancel(index)
    },
    //定时任务取消
    popoverCancel(index) {
      // console.log(this.$refs[`popover-` + index]);
      this.$refs[`popover-` + index].doClose()
    },
    //条款明细--弹窗展示
    showTermsDetail(index) {
      this.isTermsDetailVisible = true
    },
    //条款明细保存
    confirmTermsDetail() {
      this.closeTermsDetail()
    },
    //条款明细关闭
    closeTermsDetail() {
      this.isTermsDetailVisible = false
    },
    //新增条款--variable
    addNewRowToVariable() {
      //新添元素更改位置
      this.termVariableData.splice(-1,0,{
        name: 'Variable',
        contractItem: 0,
        conditionType: 'conditional',
        pointCount: 0,
        cost: 0,
        isHaveTax: 1,
        isWithholding: 1,
        taxRate: '6%',
        detail: '',
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
      this.termFixData.splice(-1,0,{
        name: 'Fix',
        contractItem: 0,
        conditionType: 'conditional',
        pointCount: 0,
        cost: 0,
        isHaveTax: 1,
        isWithholding: 1,
        taxRate: '6%',
        detail: '',
        isNewData: 1, //是否未新添数据
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.termFixTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.termFixTable.bodyWrapper.scrollTop = scrollHeight
      })
    },
    //费比更改
    changeCostRate(index,row) {
      this.termVariableData[index].cost=this.termInfo.saleNumber*(row.pointCount/100)
      this.getNewTotalData()
    },
    //含税费用更改
    changeCost(index,row) {
      // {{ (termInfo.saleNumber/scope.row.cost) }}%
      this.termFixData[index].pointCount=(row.cost/this.termInfo.saleNumber)*100
      this.getNewTotalData()
    },
    // 获取total 数据
    getTotalData() {
      this.TotalData.totalCost = this.termVariableData[0].cost
      this.TotalData.totalPoint = this.termVariableData[0].pointCount
    },
    getNewTotalData() {
      this.VariableTotalData.totalPoint = 0
      this.VariableTotalData.totalCost = 0
      //汇总行索引
      let variableTotalIndex=this.termVariableData.length-1
      //获取VariableData Total
      this.termVariableData.forEach((item, index) => {
        if (index > 0&&index<variableTotalIndex) {
          let { pointCount, cost } = item
          this.VariableTotalData.totalPoint += pointCount
          this.VariableTotalData.totalCost += cost
        }
      })
      this.termVariableData[variableTotalIndex].pointCount = this.VariableTotalData.totalPoint
      this.termVariableData[variableTotalIndex].cost = this.VariableTotalData.totalCost
      this.FixTotalData.totalPoint = 0
      this.FixTotalData.totalCost = 0
      //汇总行索引
      let FixTotalIndex=this.termFixData.length-1
      //获取FixData Total
      this.termFixData.forEach((item, index) => {
        if (index<FixTotalIndex) {
          let { pointCount, cost } = item
          this.FixTotalData.totalPoint += pointCount
          this.FixTotalData.totalCost += cost
        }
      })
      this.termFixData[FixTotalIndex].pointCount = this.FixTotalData.totalPoint
      this.termFixData[FixTotalIndex].cost = this.FixTotalData.totalCost
      //获取所有VariableData Total+FixData Total
      this.TotalData.totalCost =
        this.VariableTotalData.totalCost + this.FixTotalData.totalCost
      this.TotalData.totalPoint =
        this.VariableTotalData.totalPoint + this.FixTotalData.totalPoint
      this.setAllTotalData()
    },
    setAllTotalData() {
      this.termVariableData[0].cost = this.TotalData.totalCost
      this.termVariableData[0].pointCount = this.TotalData.totalPoint
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
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
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
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
</style>

<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-08-25 14:27:36
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerAllArr" :key="index" :label="item.customerCsName" :value="item.customerMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商名称:</span>
          <el-select v-model="filterObj.distributorMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in distributorArr" :key="index" :label="item.distributorName" :value="item.distributorMdmCode" />
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
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="showAddDialog" v-permission="permissions['insert']">新增</el-button>
      <!-- <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div> -->
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">提交</el-button>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="280" label="操作">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_delete" v-permission="permissions['delete']" @click="deleteRow(scope.row)">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-permission="permissions['update']" @click="copyRow(scope.row, scope.$index)">
              <svg-icon icon-class="copy" class="svgIcon" />
              <span>复制</span>
            </div>
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
      <el-table-column prop="contractCode" fixed align="center" width="320" label="经销商分摊协议ID">
      </el-table-column>
      <el-table-column prop="customerChannelCode" fixed align="center" width="120" label="渠道">
      </el-table-column>
      <el-table-column prop="customerName" fixed align="center" width="160" label="客户名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerRegionName" fixed align="center" width="120" label="大区">
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="180" label="客户目标销售额(RMB)">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.customerContractSaleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="distributorName" align="center" width="280" label="经销商名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.distributorName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="协议目标销售额(RMB)">
        <template slot-scope="scope">
          <!-- <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.saleAmount" type="number" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div> -->
          <div>
            {{FormateNum(scope.row.saleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" :disabled="scope.row.isRefused==1?true:false" :picker-options="pickerOptions" class="select_date" type="daterange"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @blur="changeContractDate(scope.row)">
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
            <el-date-picker v-model="scope.row.systemDate" :picker-options="pickerOptionsSystemDate(scope.row)" type="monthrange" value-format="yyyyMM" format="yyyyMM"
              range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" @blur="changeSystemTime(scope.row)">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot="{row}" prop="isSupplement" align="center" width="100" label="是否补录">
        {{row.isSupplement?'是':'否'}}
      </el-table-column>
      <el-table-column prop="contractStatus" align="center" width="160" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div>
              {{ contractList[scope.row.contractState] }}
            </div>
            <div class="timeOutWrap">
              <el-popover :ref="'popover-' + scope.row.id" placement="right" width="300" trigger="click">
                <div class="PopoverContent">
                  <div class="PopoverContentTop">
                    <span>调整系统生效时间</span>
                  </div>
                  <div class="PopoverContentOption">
                    <div class="PopoverContentOptionItem">
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
        <template v-slot="scope">
          <div class="seeActivity" @click="showTermDetailDialog(scope.row,scope.$index)">
            条款明细
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.remark" type="textarea" autosize clearable class="my-el-input my-textArea" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.remark}}
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
    <!-- 新增 -->
    <el-dialog width="95%" ref="termDialog" class="my-el-dialog" title="新增" :visible="isAddDialogVisible" @close="closeAddDialog">
      <div class="dialogContent">
        <div class="termInfo">
          <div class="selectCustomer">
            <span class="selectBar">客户合同</span>
            <el-select v-model="addDialog.index" class="my-el-selectCustomer" filterable @change="getDetail" clearable placeholder="请选择">
              <el-option v-for="item,index in customerArr" :key="item.id" :label="item.label" :value="index" />
            </el-select>
          </div>
          <el-button type="primary" class="TpmButtonBG" @click="getDetail">查询</el-button>
        </div>
        <div class="termTableWrap">
          <div class="TableWrap_dealer">
            <el-table :data="addDialogCustomer" max-height="220" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
              <el-table-column prop="customerName" align="center" width="320" label="客户名称">
              </el-table-column>
              <el-table-column prop="saleAmount" align="center" width="280" label="客户目标销售额(RMB)">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.saleAmount)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.contractBeginDate.replaceAll('-','/')+' - '+scope.row.contractEndDate.replaceAll('-','/')}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="systemDate" align="center" width="280" label="系统生效时间">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractStatus" align="center" label="合同状态">
                <template slot-scope="scope">
                  <div class="contractStatusWrap">
                    {{ contractList[scope.row.contractState] }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="space">
          </div>
          <div class="TableWrap_dealer">
            <el-table :data="addDialogDealerList" ref="dealerTable" max-height="400" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
              <el-table-column prop="distributorName" align="center" width="320" label="经销商名称">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-select v-model="scope.row.distributorMdmCode" class="my-el-input" filterable clearable placeholder="请选择">
                      <el-option v-for="item,index in distributorArrDialog" :key="index" :label="item.distributorName" :value="item.distributorMdmCode" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{scope.row.distributorName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="targetSale" align="center" width="280" label="协议目标销售额(RMB)">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-input v-model="scope.row.targetSale" type="number" clearable class="my-el-input" placeholder="请输入">
                    </el-input>
                  </div>
                  <div v-else>
                    {{FormateNum(scope.row.targetSale)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-date-picker v-model="scope.row.contractDate" type="daterange" class="select_date" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    {{scope.row.contractDate[0].replaceAll('-','/')+'-'+scope.row.contractDate[1].replaceAll('-','/')}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="systemDate" align="center" width="280" label="系统生效时间">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-date-picker v-model="scope.row.systemDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
                      end-placeholder="结束月份">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    {{scope.row.systemDate[0]+'-'+scope.row.systemDate[1]}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractState" align="center" label="操作">
                <template slot-scope="scope">
                  <div class="contractStatusWrap">
                    <img src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteItem(scope.$index)">
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="addNewRowWrap">
              <div class="addNewRow" @click="addNewDistributor">
                <i class="el-icon-plus"></i>
                <span class="addNewRowText">新增一行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAdd()">确 定</el-button>
        <el-button @click="closeAddDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/dealer'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  contractList,
  FormateThousandNum,
  downloadFile,
  pickerOptions,
  pickerOptionsSystemDate,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'dealerContractEntry',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        customerMdmCode: '',
        distributorMdmCode: '',
        contractDate: [],
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        state: '',
      },
      maxheight: getContractEntry(),
      maxheightTerm: '',
      tableData: [],
      editMaxTargetSale: 0, //修改可填最大值
      editIsCollection: 0, //编辑--判断是否补录 --是否跳过验证
      customerArr: [],
      customerAllArr: [],
      distributorArr: [],
      distributorArrDialog: [],
      contractList: contractList,
      checkArr: [], //选中的数据
      tableKey: 0,
      addDialog: {
        id: '',
        name: '',
        index: '',
        customerMdmCode: '',
        maxTargetSale: '',
        nowTargetSale: '', //现阶段所有经销商目标销售额之和
        isCollection: '', //是否补录
      },
      addDialogCustomer: [],
      addDialogDealerList: [],
      isAddDialogVisible: false,
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      selectDate: '',
      pickerOptions: {
        onPick: (obj) => {
          this.selectDate = obj.minDate
          //若存在最大值，将已选中的值置空（下次可选另一年（且保证同年））
          if (obj.maxDate) {
            this.selectDate = ''
          }
        },
        // 限制年月
        disabledDate: (time) => {
          const date = new Date(this.selectDate)
          const year = date.getFullYear()
          //未选择初始日期时，不做限制
          if (this.selectDate == '') {
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
        this.maxheight = window.innerHeight - 420
        // this.maxheightTerm = window.innerHeight - 320
      })()
    }
    // this.getTableData()
    this.getCustomerList()
    this.getCustomerListAll()
    this.getDistributorList()
  },
  directives: { elDragDialog, permission },
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
    'filterObj.customerMdmCode'(value) {
      this.filterObj.distributorMdmCode = ''
      this.getDistributorList()
    },
    'addDialog.id'(value) {
      if (value == '') {
        //客户合同置空，下方数据置空
        this.addDialogCustomer = []
        this.addDialogDealerList = []
      }
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      API.getPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          if (item.contractState === '2') {
            item.isRefused = 1
          } else {
            item.isRefused = 0
          }
          item.isEditor = 0
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
      API.getCustomerContract({}).then((res) => {
        if (res.code === 1000) {
          let list = res.data
          list.forEach((item) => {
            item.contractDate =
              item.contractBeginDate.replaceAll('-', '/') +
              ' - ' +
              item.contractEndDate.replaceAll('-', '/')
            if (item.channelCode == 'RKA' && item.regionName) {
              item.label = `${item.customerName}-${item.regionName}(${item.contractDate})`
            } else {
              item.label = `${item.customerName}(${item.contractDate})`
            }
          })
          this.customerArr = list
        }
      })
    },
    getDistributorList() {
      selectAPI
        .queryDistributorList({
          customerMdmCode: this.filterObj.customerMdmCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
    },
    getCustomerListAll() {
      selectAPI.queryCustomerList({}).then((res) => {
        if (res.code === 1000) {
          this.customerAllArr = res.data
        }
      })
    },
    //编辑行数据
    editorRow(index, row) {
      //编辑状态：草稿、被拒绝
      if (row.contractState !== '0' && row.contractState !== '2') {
        if (row.contractState == 1) {
          this.$message.info('审批中的合同不允许编辑')
        } else if (row.contractState == 3) {
          this.$message.info(
            '该合同不能被编辑，仅能通过“调整”按钮修改系统生效时间结束时间'
          )
        } else if (row.contractState == 4 || row.contractState == 5) {
          this.$message.info('该合同不允许编辑')
        }
        sessionStorage.setItem('isEditor', `0-${index}`)
        return
      }
      if (this.tempObj.tempInfo) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      this.tempObj.rowIndex = index
      this.tempObj.tempInfo = { ...this.tableData[index] }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => (item.isEditor = 0))
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
      sessionStorage.setItem('isEditor', `1-${index}`)
    },
    CancelEditorRow(index) {
      // this.tableData.forEach((item) => (item.isEditor = 0))
      this.tableData[index].isEditor = 0
      this.tableData[index] = this.tempObj.tempInfo
      sessionStorage.setItem('isEditor', `0-${index}`)
    },
    compareDate(date) {
      let currentDate = new Date()
      let month =
        currentDate.getMonth() < 10
          ? '0' + (currentDate.getMonth() + 1)
          : currentDate.getMonth() + 1
      let year = currentDate.getFullYear()
      let currentMonth = year + month
      return Number(currentMonth) < Number(date)
    },
    //删除该行数据
    deleteRow(row) {
      if (row.isEditor == 2) {
        this.$confirm('确定要删除复制的数据吗？此操作不可逆', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.tableData.splice(0, 1)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        //判断当前月份是否处于系统生效开始时间，若处于则可以删除,若不处于系统生效开始时间随便删，不收状态影响
        let isDeleteFlag = row.entryDate==null?1:0
        //允许删除：草稿、被拒绝、通过（未汇算） 不允许删除：待审批、通过（已汇算）、终止、过期
        if (
          row.contractState === '1' ||
          (row.contractState == '3' && !isDeleteFlag) ||
          row.contractState === '4' ||
          row.contractState === '5'
        ) {
          if (row.contractState === '1') {
            this.$message.info('审批中的合同不能删除，请联系审批人驳回后删除')
          } else if (
            (row.contractState == '3' && !isDeleteFlag) ||
            row.contractState === '4' ||
            row.contractState === '5'
          ) {
            this.$message.info('该合同不允许删除')
          }
          return
        }
        //删除数据库中的数据
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.delete([row.id]).then((res) => {
              if (res.code === 1000) {
                this.getTableData()
                if (res.data) {
                  this.$message.success('删除成功')
                } else {
                  this.$message.info(`${res.message}`)
                }
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //经销商提交
    submit() {
      if (this.checkArr.length == 0) {
        this.$message.info('请先选择数据')
        return
      }
      let IdList = []
      this.checkArr.forEach((item) => {
        IdList.push(item.id)
      })
      this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          API.submit(IdList).then((res) => {
            if (res.code === 1000) {
              this.getTableData()
              this.$message.success('提交成功')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    //保存 该行
    saveRow(row, index) {
      API.findOne({
        id: row.ccId,
        isCustomerContract: 1, //是否查询客户合同（1是0否）
        isCustomerContractDetail: 0, //是否查询客户合同条款（1是0否）
        isDistributorContractDetail: 0, //是否查询经销商合同详情（1是0否）
      }).then((res) => {
        let distList = res.data.distributorContract
        //除去该经销商 其他经销商的目标销售额之和
        let otherDist = 0
        distList.forEach((item) => {
          if (
            item.id != row.id &&
            item.contractState != '3' &&
            item.contractState != '4' &&
            item.contractState != '5'
          ) {
            otherDist += item.saleAmount
          }
        })
        //计算目前可填值 （经销商目标销售额之和等于客户目标销售额）
        this.editMaxTargetSale =
          Number(row.customerContractSaleAmount) - otherDist
        let flag = distList.findIndex((item) => {
          return item.contractState == '3' || item.contractState == '4'
        })
        //是否补录，补录状态判断(该客户合同下已经有经销商通过则证明是补录)
        this.editIsCollection = flag === -1 ? 0 : 1
        if (row.saleAmount > 9999999999) {
          this.$message.info('超出最大数值')
          return
        }
        if (this.editIsCollection) {
          //是补录-- 跳过验证
          console.log('noLimit')
          this.updateRowFunction(row)
        } else {
          //不是补录，数值验证
          if (row.saleAmount != this.editMaxTargetSale) {
            this.$message.info(`经销商目标销售额之和应等于客户目标销售额`)
          } else {
            this.updateRowFunction(row)
          }
        }
      })
    },
    copyRow(row, index) {
      this.tableData.unshift({
        id: row.id,
        createBy: row.createBy,
        createDate: row.createDate,
        customerChannelCode: row.customerChannelCode,
        updateBy: row.updateBy,
        updateDate: row.updateDate,
        deleteFlag: row.deleteFlag,
        ccId: row.ccId,
        distributorMdmCode: row.distributorMdmCode,
        distributorName: row.distributorName,
        saleAmount: row.saleAmount,
        contractBeginDate: row.contractBeginDate,
        contractEndDate: row.contractEndDate,
        effectiveBeginDate: row.effectiveBeginDate,
        effectiveEndDate: row.effectiveEndDate,
        contractState: 0,
        remark: row.remark,
        poApprovalComments: row.poApprovalComments,
        finApprovalComments: row.finApprovalComments,
        isSupplement: row.isSupplement,
        earlyExpireDate: row.earlyExpireDate,
        entryDate: row.entryDate,
        customerName: row.customerName,
        customerRegionCode: row.customerRegionCode,
        customerRegionName: row.customerRegionName,
        customerContractSaleAmount: row.customerContractSaleAmount,
        contractStateName: '草稿',
        variable: row.variable,
        fixed: row.fixed,
        customerMdmCode: row.customerMdmCode,
        isEditor: 2,
        expireDate: row.expireDate,
        contractDate: row.contractDate,
        systemDate: row.systemDate,
      })
    },
    //更改合同日期--匹配对应的客户合同
    changeContractDate(row) {
      
    },
    //更改系统生效时间
    changeSystemTime(row) {
      if (row.isEditor == 2) {
        let {
          contractDate,
          systemDate
        } = row
        let contractBeginDate=contractDate[0]
        let contractEndDate=contractDate[1]
        let effectiveBeginDate=systemDate[0]
        let effectiveEndDate=systemDate[1]
        //在合同区间里的经销商
        let index= this.customerArr.findIndex((item) => {
          return (
            item.customerName == row.customerName &&
            item.regionCode == row.customerRegionCode &&
            this.betweenDate(
              item.contractBeginDate,
              item.contractEndDate,
              contractBeginDate
            ) &&
            this.betweenDate(
              item.contractBeginDate,
              item.contractEndDate,
              contractEndDate
            ) &&
            this.betweenDate(
              item.effectiveBeginDate.slice(0, 4) +
                '-' +
                item.effectiveBeginDate.slice(4) +
                '-01',
              item.effectiveEndDate.slice(0, 4) +
                '-' +
                item.effectiveEndDate.slice(4) +
                '-01',
              effectiveBeginDate.slice(0, 4) +
                '-' +
                effectiveBeginDate.slice(4) +
                '-01',
            ) &&
            this.betweenDate(
              item.effectiveBeginDate.slice(0, 4) +
                '-' +
                item.effectiveBeginDate.slice(4) +
                '-01',
              item.effectiveEndDate.slice(0, 4) +
                '-' +
                item.effectiveEndDate.slice(4) +
                '-01',
              effectiveEndDate.slice(0, 4) +
                '-' +
                effectiveEndDate.slice(4) +
                '-01',
            )
          ) 
        })
        console.log(index);
        if (index == -1) {
          this.$message.warning('此协议匹配不到客户合同，请先录入客户合同')
        } else {
          row.ccId = this.customerArr[index].id
          // API.findOne({
          //   id: row.ccId,
          //   isCustomerContract: 1, //是否查询客户合同（1是0否）
          //   isCustomerContractDetail: 0, //是否查询客户合同条款（1是0否）
          //   isDistributorContractDetail: 0, //是否查询经销商合同详情（1是0否）
          // }).then((res) => {
          //   if (res.code === 1000) {
              
          //   }
          // })
        }
      }
    },
    //判断经销商的合同区间和系统生效时间是否在客户的合同区间和系统生效时间
    /**
     * 日期区间比较，是否在区间里
     */
    betweenDate(start, end, compare) {
      console.log(start,end,compare);
      let beginDate = new Date(start).getTime()
      let endDate = new Date(end).getTime()
      let compareDate = new Date(compare).getTime()
      return beginDate <= compareDate && compareDate <= endDate
    },
    //编辑一行 API
    updateRowFunction(row) {
      if (row.isEditor == 2) {
        API.addCopy([
          {
            id: row.id,
            ccId: row.ccId,
            distributorMdmCode: row.distributorMdmCode,
            saleAmount: row.saleAmount,
            contractBeginDate: row.contractDate[0],
            contractEndDate: row.contractDate[1],
            effectiveBeginDate: row.systemDate[0],
            effectiveEndDate: row.systemDate[1],
            remark: row.remark,
          },
        ]).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            if (res.data) {
              this.$message.success('复制成功')
            } else {
              this.$message.info(`${res.message}`)
            }
          }
        })
      } else {
        API.update({
          id: row.id,
          ccId: row.ccId,
          distributorMdmCode: row.distributorMdmCode,
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
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //定时任务确定--终止合同
    popoverSubmit(index, row) {
      let newStr =
        row.expireDate.substring(0, 4) + '-' + row.expireDate.substring(4)
      let expireDate = new Date(newStr)
      let contractDate = new Date(
        row.contractDate[1].substring(0, 4) +
          '-' +
          row.contractDate[1].substring(5, 7)
      )
      if (
        expireDate.getTime() < contractDate.getTime() &&
        row.contractStateName == '通过'
      ) {
        this.$message.info('系统生效时间结束时间不能早于合同期间结束时间')
        return
      } else if (
        row.contractStateName == '过期' ||
        row.contractStateName == '终止'
      ) {
        this.$message.info(
          '只有状态为“通过”的经销商分摊协议，允许调整生效时间，其他都不允许，请知悉，谢谢！'
        )
        return
      }
      API.termination({
        id: row.id,
        date: row.expireDate,
      }).then((res) => {
        if (res.code === 1000) {
          this.$message.success('调整成功')
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
    //导出数据
    async exportData() {
      await API.exportDistributorContractInfo({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商分摊协议录入 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('经销商分摊协议导出成功!')
      })
      await API.exportDistributorContractDetail({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商分摊协议录入明细 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('经销商分摊协议明细导出成功!')
      })
    },
    //新增数据 --弹窗展示
    showAddDialog() {
      this.isAddDialogVisible = true
      this.$refs.termDialog.$el.firstChild.style.height = '90%'
    },
    //新增经销商 -- 获取客户数据
    getDetail() {
      API.findOne({
        id: this.customerArr[this.addDialog.index].id,
        isCustomerContract: 1, //是否查询客户合同（1是0否）
        isCustomerContractDetail: 0, //是否查询客户合同条款（1是0否）
        isDistributorContractDetail: 0, //是否查询经销商合同详情（1是0否）
      }).then((res) => {
        if (res.code === 1000) {
          this.addDialogCustomer = []
          this.addDialogDealerList = []
          let {
            customerContract: customerContractOrigin,
            distributorContract: distList,
          } = res.data
          let obj = {
            customerName: customerContractOrigin.customerName,
            saleAmount: customerContractOrigin.saleAmount,
            contractBeginDate: customerContractOrigin.contractBeginDate, //合同生效开始时间
            contractEndDate: customerContractOrigin.contractEndDate, //合同生效结束时间
            effectiveBeginDate: customerContractOrigin.effectiveBeginDate, //系统生效开始时间
            effectiveEndDate: customerContractOrigin.effectiveEndDate, //系统生效结束时间
            contractState: customerContractOrigin.contractState,
          }
          this.addDialogCustomer.push(obj)
          this.getDistributorListByCustomer()
          //查该现阶段客户下所有经销商的和，新增经销商之和应等于客户目标销售额
          this.addDialog.nowTargetSale = 0
          distList.forEach((item) => {
            if (
              item.contractState != '3' &&
              item.contractState != '4' &&
              item.contractState != '5'
            ) {
              this.addDialog.nowTargetSale += item.saleAmount
            }
          })
          let flag = distList.findIndex((item) => {
            return item.contractState == '3'
          })
          //是否补录，补录状态判断
          this.addDialog.isCollection = flag === -1 ? 0 : 1
        }
      })
    },
    getDistributorListByCustomer() {
      selectAPI
        .queryDistributorList({
          customerMdmCode:
            this.customerArr[this.addDialog.index].customerMdmCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArrDialog = res.data
          }
        })
    },
    // 新增经销商
    addNewDistributor() {
      if (this.addDialog.index === '') {
        this.$message.info('请先选择客户合同')
        return
      }
      //如何判断是否为补录
      this.addDialogDealerList.push({
        distributorMdmCode: '',
        distributorName: '',
        targetSale: '',
        contractDate: [],
        systemDate: [],
        contractState: '',
        contractStateName: '',
        isEditor: 1, //是否能编辑
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.dealerTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.dealerTable.bodyWrapper.scrollTop = scrollHeight
      })
    },
    //新增数据--关闭弹窗
    closeAddDialog() {
      this.isAddDialogVisible = false
      this.addDialogCustomer = []
      this.addDialogDealerList = []
      this.addDialog = {
        id: '',
        name: '',
        index: '',
        customerMdmCode: '',
      }
    },
    //新增经销商 -- 删除
    deleteItem(index) {
      this.addDialogDealerList.splice(index, 1)
    },
    //确认新增
    confirmAdd() {
      if (!this.addDialogDealerList.length) {
        this.$message.info('请先添加数据')
        return
      }
      let list = []
      let targetSaleLimit = 0
      this.addDialogDealerList.forEach((item) => {
        let obj = {
          ccId: this.customerArr[this.addDialog.index].id,
          distributorMdmCode: item.distributorMdmCode,
          saleAmount: item.targetSale,
          contractBeginDate: item.contractDate[0],
          contractEndDate: item.contractDate[1],
          effectiveBeginDate: item.systemDate[0],
          effectiveEndDate: item.systemDate[1],
        }
        targetSaleLimit += Number(item.targetSale)
        list.push(obj)
      })
      //补录验证，不补录不验证（经销商之和可以大于客户合同目标销售额）
      if (this.addDialog.isCollection) {
        API.add(list).then((res) => {
          if (res.code === 1000) {
            this.isAddDialogVisible = false
            this.getTableData()
          }
        })
      } else {
        if (
          (
            Number(targetSaleLimit) + Number(this.addDialog.nowTargetSale)
          ).toFixed(2) != this.addDialogCustomer[0].saleAmount
        ) {
          this.$message.info(`经销商目标销售额之和应等于客户目标销售额`)
          return
        } else {
          API.add(list).then((res) => {
            if (res.code === 1000) {
              this.isAddDialogVisible = false
              this.$message.success('新增成功')
              this.getTableData()
            }
          })
        }
      }
    },
    //打开条款明细弹窗
    showTermDetailDialog({ ccId }, index) {
      // sessionStorage.setItem('ccId',row.ccId)
      this.$router.push({
        name: 'dealerTermDetail',
        query: {
          ccId,
        },
      })
      sessionStorage.setItem('EditorIndex', index)
      // this.$router.push(
      //   '/taskManage/ContractEntry/dealerContractEntry/dealerTermDetail',
      // )
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
    //弹窗表格样式
    tableRowClassNameDialog({ row, rowIndex }) {
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
        return 'first-row'
      }
    },
    pickerOptionsSystemDate(row) {
      return pickerOptionsSystemDate(row)
    },
  },
}
</script>

<style lang="scss" scoped>
.MainContent {
  height: 100% !important;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
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
    margin-top: 15px;
    margin-bottom: 10px;
    .termItem {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
    }
    .selectBar {
      margin-right: 10px;
    }
    .selectCustomer {
      margin-right: 10px;
    }
  }
  .termTableWrap {
    width: 100%;
    // border: 1px solid #e7e7e7;
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
    .space {
      width: 100%;
      height: 20px;
    }
    .TableWrap_dealer {
      width: 100%;
      border: 1px solid #e7e7e7;
    }
  }
  .dealersWrap {
    width: 100%;
    display: flex;
    .dealersTableWrap {
      display: flex;
      overflow-x: scroll;
    }
  }
  .dealerItem {
    // display: flex;
    .topInfo {
      font-size: 16px;
      color: #4192d3;
      font-weight: 600;
      .tax {
        margin-left: 20px;
      }
    }
  }
  // /*滚动条的宽度*/
  // ::-webkit-scrollbar {
  //   width: 16px;
  //   height: 16px;
  // }
  // /* //滚动条的滑块 */
  // ::-webkit-scrollbar-thumb {
  //   background: #b9b9b9;
  //   border-radius: 8px;
  // }
}
.line {
  height: 80%;
  width: 4px;
  background-color: #4192d3;
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
.MainContent .select_date {
  width: 240px !important;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
.my-el-dialog .dialogContent .selectCustomer .my-el-selectCustomer {
  width: 300px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 300px !important;
  }
  .el-input--suffix {
    width: 300px !important;
  }
}
</style>
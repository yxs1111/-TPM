<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-04-22 10:17:43
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item in customerArr" :key="item.id" :label="item.customerName" :value="item.customerMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商名称:</span>
          <el-select v-model="filterObj.distributorMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in distributorArr" :key="index" :label="item" :value="item" />
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
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="showAddDialog">新增</el-button>
      <!-- <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div> -->
      <el-button type="primary" class="TpmButtonBG" @click="submit">提交</el-button>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="220" label="操作">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_delete" @click="deleteRow(scope.row)">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isEditor" @click="editorRow(scope.$index,scope.row)">
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
          <div>
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="220" label="客户目标销售额">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.customerContractSaleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="distributorName" align="center" width="220" label="经销商名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.distributorName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额(¥)">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.saleAmount" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{FormateNum(scope.row.saleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.contractBeginDate + ' - ' + scope.row.contractEndDate }}
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
      <el-table-column prop="contractStatus" align="center" width="240" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div>
              {{ contractList[scope.row.contractState] }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot={row} width="220" align="center" label="合同条款">
        <div class="seeActivity" @click="showTermDetailDialog(row)">
          条款明细
        </div>
      </el-table-column>
      <el-table-column prop="remark" align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.remark" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.remark}}
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
    <!-- 新增 -->
    <el-dialog width="95%" v-elDragDialog class="my-el-dialog" title="新增" :visible="isAddDialogVisible" @close="closeAddDialog">
      <div class="dialogContent">
        <div class="termInfo">
          <div class="selectCustomer">
            <span class="selectBar">客户合同</span>
            <el-select v-model="addDialog.index" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in customerArr" :key="item.id" :label="item.customerName" :value="index" />
            </el-select>
          </div>
          <el-button type="primary" class="TpmButtonBG" @click="getDetail">查询</el-button>
        </div>
        <div class="termTableWrap">
          <div class="TableWrap_dealer">
            <el-table :data="addDialogCustomer" max-height="220" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
              <el-table-column prop="customerName" align="center" width="320" label="客户名称">
              </el-table-column>
              <el-table-column prop="saleAmount" align="center" width="280" label="目标销售额">
                <template slot-scope="scope">
                  <div>
                    {{FormateNum(scope.row.saleAmount)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.contractBeginDate+' - '+scope.row.contractEndDate}}
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
            <el-table :data="addDialogDealerList" ref="dealerTable" max-height="220" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
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
              <el-table-column prop="targetSale" align="center" width="280" label="目标销售额(¥)">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEditor">
                    <el-input v-model="scope.row.targetSale" clearable class="my-el-input" placeholder="请输入">
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
                    <el-date-picker v-model="scope.row.contractDate" type="daterange" class="select_date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
                      start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                  <div v-else>
                    {{scope.row.contractDate[0]+'-'+scope.row.contractDate[1]}}
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
              <el-table-column prop="contractState" align="center" label="合同状态">
                <template slot-scope="scope">
                  <div class="contractStatusWrap">
                    {{ scope.row.contractStateName }}
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
  downloadFile
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'dealerContractEntry',
  data() {
    return {
      total: 1,
      pageSize: 10,
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
      tableData: [],
      editMaxTargetSale: 0, //修改可填最大值
      editIsCollection: 0, //编辑--判断是否补录 --是否跳过验证
      customerArr: [],
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
        isCollection: '', //是否补录
      },
      addDialogCustomer: [],
      addDialogDealerList: [
        // {
        //   distributorName: '上海映华食品有限公司',
        //   targetSale: 100,
        //   contractDate: ['20220110', '20220521'],
        //   systemDate: ['202201', '202212'],
        //   contractStatus: 0,
        //   systemStatus: 0,
        //   isEditor: 1, //是否补录
        // },
      ],
      isAddDialogVisible: false,
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
          item.isEditor = 0
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
      API.getCustomerContract({}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    getDistributorList() {
      selectAPI.getDistributorService({}).then((res) => {
        if (res.code === 1000) {
          this.distributorArr = res.data
        }
      })
    },
    //编辑行数据
    editorRow(index,row) {
      if(row.contractState == '3' || row.contractState == '4') {
        this.$message.info('该经销商已经通过，不能进行编辑')
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
    },
    CancelEditorRow(index) {
      // this.tableData.forEach((item) => (item.isEditor = 0))
      this.tableData[index].isEditor = 0
      this.tableData[index] = this.tempObj.tempInfo
    },
    //删除该行数据
    deleteRow(row) {
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
    },
    //录入提交
    submit() {},
    //保存 该行
    saveRow(row, index) {
      
      API.findOne({
        id: row.ccId,
        isCustomerContract: 1, //是否查询客户合同（1是0否）
        isCustomerContractDetail: 0, //是否查询客户合同条款（1是0否）
        isDistributorContractDetail: 0, //是否查询经销商合同详情（1是0否）
      }).then((res) => {
        let distList = res.data.distributorContract
        this.editMaxTargetSale =
          Number(row.customerContractSaleAmount) - this.getMaxTargetSale(distList)
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
          if (row.saleAmount > this.editMaxTargetSale) {
            this.$message.info(
              `经销商目标销售额之和应不大于${this.editMaxTargetSale}`
            )
          } else {
            console.log('save')
            this.updateRowFunction(row)
          }
        }
      })
    },
    //编辑一行 API
    updateRowFunction(row) {
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
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.export({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商合同录入 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    //新增数据 --弹窗展示
    showAddDialog() {
      this.isAddDialogVisible = true
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
          this.addDialog.maxTargetSale =
            this.addDialogCustomer[0].saleAmount -
            this.getMaxTargetSale(distList)
          console.log(this.addDialog.maxTargetSale)
          let flag = distList.findIndex((item) => {
            return item.contractState == '3' || item.contractState == '4'
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
    //获取能填写的最大 目标销售额
    getMaxTargetSale(distList) {
      let distTotalTargetSale = 0
      distList.forEach((item) => {
        distTotalTargetSale += item.saleAmount
      })
      return distTotalTargetSale
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
        if (targetSaleLimit > this.addDialog.maxTargetSale) {
          this.$message.info(
            `经销商目标销售额之和应不大于${this.addDialog.maxTargetSale}`
          )
          return
        } else {
          API.add(list).then((res) => {
            if (res.code === 1000) {
              this.isAddDialogVisible = false
              this.getTableData()
            }
          })
        }
      }
    },
    //打开条款明细弹窗
    showTermDetailDialog({ccId}) {
      // sessionStorage.setItem('ccId',row.ccId)
      this.$router.push({
        name:'dealerTermDetail',
        query:{
          ccId
        }
      })
      // this.$router.push(
      //   '/taskManage/ContractEntry/dealerContractEntry/dealerTermDetail',
      // )
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
</style>
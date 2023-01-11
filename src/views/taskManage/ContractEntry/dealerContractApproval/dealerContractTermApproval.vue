<!--
 * @Description:
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2023-01-11 21:49:39
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCsName" :label="item.channelCsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerMdmCode" />
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
            <el-option v-for="item,index in contractList" :key="index" :label="item" :value="index+1" />
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
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">通过</el-button>
      <el-button type="primary" class="TpmButtonBG" @click="reject" v-permission="permissions['rejected']">驳回</el-button>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />

      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="180" label="操作">
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
      <el-table-column prop="contractCode" fixed align="center" width="320" label="经销商分摊协议ID">
      </el-table-column>
      <el-table-column prop="customerChannelCode" fixed align="center" width="120" label="渠道">
      </el-table-column>
      <el-table-column prop="customerName" fixed align="center" width="180" label="客户名称">
        <template slot-scope="scope">
          <div>
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerRegionName" fixed align="center" width="120" label="大区">
      </el-table-column>
      <el-table-column prop="customerContractSaleAmount" align="center" width="160" label="客户目标销售额">
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
      <el-table-column prop="distributorSaleAmount" align="center" width="160" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div>
            {{FormateNum(scope.row.saleAmount)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="200" label="合同期间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.contractBeginDate.replaceAll('-','/') + ' - ' + scope.row.contractEndDate.replaceAll('-','/') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="160" label="系统生效时间">
        <template slot-scope="scope">
          <div>
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot={row} align="center" prop="contractStateName" width="240" label="合同状态">
         {{row.contractStateName=='待审批'&&row.activityName&&row.activityName.indexOf('审批')!=-1?row.contractStateName+'-'+row.activityName:row.contractStateName}}
      </el-table-column>
      <el-table-column v-slot="{row}" prop="isSupplement" align="center" width="100" label="是否补录">
        {{row.isSupplement?'是':'否'}}
      </el-table-column>
      <el-table-column v-slot={row} width="120" align="center" label="合同条款">
        <div class="seeActivity" @click="showTermDetailDialog(row)">
          条款明细
        </div>
      </el-table-column>
      <el-table-column prop="remark" align="center" width="220" label="申请人备注">
      </el-table-column>
      <el-table-column prop="poApprovalComments" align="center" width="220" label="渠道PPM意见">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor&&scope.row.name.includes('渠道PPM')">
            <el-input v-model="scope.row.poApprovalComments"  type="textarea" autosize   clearable class="my-el-input my-textArea" placeholder="请输入">
            </el-input>
          </div>
          <div v-else>
            {{ scope.row.poApprovalComments }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="finance" align="center" width="220" label="HQ PPM意见">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor&&scope.row.name.includes('HQ PPM')">
            <el-input v-model="scope.row.finApprovalComments"  type="textarea" autosize   clearable class="my-el-input my-textArea" placeholder="请输入">
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
  </div>
</template>

<script>
import API from '@/api/ContractEntry/customerApproval'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  contractList,
  formatThousandNum,
  downloadFile,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'dealerContractTermApproval',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        contractDate: [],
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        customerMdmCode: '',
        distributorMdmCode: '',
        state: '',
      },
      maxheight: getContractEntry(),
      tableData: [],
      customerArr: [],
      distributorArr: [],
      contractList: ['待审批', '被拒绝', '通过', '终止', '过期','延期审批中'],
      checkArr: [], //选中的数据
      tableKey: 0,
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      ccId: null,
      permissions: getDefaultPermissions(),
      mainIdList:[],
      usernameLocal: "",
      channelArr: [],
      isFirstLoading: true, //是否是第一次进入
    }
  },
  mounted() {
    //从sessionStorage中获取存储的 筛选项 数据
    if (sessionStorage.getItem('filterObj')) {
      this.filterObj = JSON.parse(sessionStorage.getItem('filterObj'))
      this.getTableData()
    }
    window.onresize = () => {
      return (() => {
        this.maxheight = window.innerHeight - 420
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
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
    'filterObj.customerMdmCode'(value) {
      this.filterObj.distributorMdmCode = ''
      this.getDistributorList()
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.mainIdList=[]
      API.getApprovePageDealer({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerChannelCode: this.filterObj.channelCode,
        customerMdmCode: this.filterObj.customerMdmCode,
        distributorMdmCode: this.filterObj.distributorMdmCode,
        contractState: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.isEditor = 0
          item.isCanSubmit = 0
          item.name=''
          item.contractDate = [item.contractBeginDate, item.contractEndDate]
          item.systemDate = [item.effectiveBeginDate, item.effectiveEndDate]
          this.mainIdList.push(item.mainId)
        })
        this.tableData = [...list]
        this.isFirstLoading=false
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
        this.ccId = this.tableData[0].ccId
        this.tempObj.tempInfo = null
        if(list.length) {
          this.infoByMainId()
        }
      })
    },
    infoByMainId() {
      selectAPI
        .contractInfoByMainId(
          this.mainIdList,
        )
        .then((res) => {
          let activityList=res.data
          if (res.code === 1000) {
            this.tableData.forEach(item=>{
              activityList.forEach(mItem=>{
                if(mItem.id==item.mainId) {
                  item.name=mItem.activityName
                  let isFlag=mItem.assignee.indexOf(this.usernameLocal) != -1?1:0
                  item.isCanSubmit=isFlag
                }
              })
            })
          }
        })
    },
    // 获取渠道下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
        }
      })
    },
    // 客户
    getCustomerList() {
      if(!this.isFirstLoading) {
        this.filterObj.customerMdmCode = ''
      }
      API.getCustomerContractByChannel({channelCode:this.filterObj.channelCode}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
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
    //经销商审批通过
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
    //经销商审批通过
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
      let obj = {
        opinion: flag ? 'agree' : 'reject',
        approveDetail: {},
      }
      //判断当前数据 所属角色审批
      this.checkArr.forEach((item) => {
        if (item.name.includes('渠道PPM')) {
          obj.approveDetail[item.id] = item.poApprovalComments
        } else if (item.name.includes('HQ PPM')) {
          obj.approveDetail[item.id] = item.finApprovalComments
        } else {
          obj.approveDetail[item.id]=''
        }
      })
      console.log(obj)
      API.approveDistContract(obj).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
          if (flag) {
            this.$message.success('审批成功！')
          } else {
            this.$message.success('驳回成功！')
          } 
        }
      })
    },
    //编辑行数据
    editorRow(index, row) {
      if (row.contractState !== '1' || !row.isCanSubmit) {
        this.$message.info('该经销商不能进行编辑')
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
    //保存 该行
    saveRow(row) {
      let obj = {}
      if (row.name.includes('渠道PPM')) {
        obj[row.id] = row.poApprovalComments
      } else if (row.name.includes('HQ PPM')) {
        obj[row.id] = row.finApprovalComments
      }
      API.saveDistApproveComments(obj).then((res) => {
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
    async exportData() {
     await API.exportApproveDistributorContractDetail({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
        customerChannelCode: this.filterObj.channelCode,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商分摊协议审批明细-by KA-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
     await API.exportApproveDistributorContractInfo({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
        customerChannelCode: this.filterObj.channelCode,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商分摊协议审批明细 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
     await API.exportDistApprovePage({
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
        customerChannelCode: this.filterObj.channelCode,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商分摊协议审批-list-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    //打开条款明细弹窗
    showTermDetailDialog({ ccId }) {
      // 保存筛选项到sessionStorage
      sessionStorage.setItem('filterObj', JSON.stringify(this.filterObj))
      // sessionStorage.setItem('ccId',row.ccId)
      this.$router.push({
        name: 'dealerTermView',
        query: {
          ccId,
        },
      })
    },
    checkSelectable(row) {
      return row.contractState === '1'&&row.isCanSubmit === 1
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
      return formatThousandNum(num)
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
</style>

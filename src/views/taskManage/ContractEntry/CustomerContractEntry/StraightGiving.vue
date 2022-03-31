<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-03-31 17:23:46
-->
<template>
  <div class="MainContent" @keyup.enter="pageList">
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="addNewRow">新增一行</el-button>
      <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div>
      <div class="TpmButtonBG cancelButton" @click="cancelAddNewRow">
        <span class="text">取消</span>
      </div>
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      style="width: 100%">
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
      <el-table-column prop="customerName" align="center" width="220" label="名称">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.customerName" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="(item) in customerArr" :key="item.customerMdmCode" :label="item.customerCsName" :value="item.customerCsName" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.customerName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxIMK" align="center" width="220" label="未税IMK">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.noTaxIMK" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.noTaxIMK}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Tax" align="center" width="220" label="含税费用">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.Tax" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.Tax}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="NoTax" align="center" width="220" label="未税费用">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.NoTax" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.NoTax}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="220" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            <!-- {{scope.row.contractDate[0]+' 至 '+scope.row.contractDate[1]}} -->
            {{scope.row.contractDate}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractStatus" align="center" width="240" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div v-show="scope.row.isEditor">
              <el-select v-model="scope.row.contractStatus" class="my-el-input" filterable clearable placeholder="请选择">
                <el-option v-for="(item,index) in ['生效中','未生效','中止','作废']" :key="index" :label="item" :value="index" />
              </el-select>
            </div>
            <div v-show="!scope.row.isEditor">
              {{scope.row.contractStatus==0?'生效中':'未生效'}}
            </div>
            <div class="timeOutWrap">
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
                <!-- <svg-icon icon-class="timeout_dark" v- slot="reference" class="svgIcon" /> -->
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemStatus" align="center" width="220" label="系统状态">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.systemStatus" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="(item,index) in ['草稿','通过','提交','中止','作废']" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{scope.row.systemStatus==0?'草稿':'通过'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" label="合同条款">
        <div class="seeActivity">
          条款明细
        </div>
      </el-table-column>
      <el-table-column prop="applyRemark" align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.applyRemark" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.applyRemark}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="packageOwner" align="center" width="220" label="Package Owner意见">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.packageOwner" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.packageOwner}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="finance" align="center" width="220" label="Finance 意见">
         <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.finance" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.finance}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" align="center" width="220" label="创建人">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.createBy" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.createBy}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" align="center" width="220" label="创建时间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.createDate" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.createDate}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" align="center" width="220" label="修改人">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.updateBy" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.updateBy}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" align="center" width="220" label="修改时间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor&&scope.row.isNewData">
            <el-input v-model="scope.row.updateDate" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor||!scope.row.isNewData">
            {{scope.row.updateDate}}
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
import API from '@/api/taskManage/taskManage.js'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  setSplitAssignee,
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
      tableData: [
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 1,
          contractTimeoutTime: '',
          isNewData:0

        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
        {
          customerName: '孩子王',
          noTaxIMK: '100W',
          Tax: 500000,
          NoTax: 500000,
          contractDate: ['202201', '202205'],
          contractStatus: 0,
          systemStatus: 0,
          applyRemark: '意见',
          packageOwner: '意见',
          finance: '意见',
          createBy: '创建人',
          createDate: '202201',
          updateBy: '更新人',
          updateDate: '202201',
          isEditor: 0,
          isTimeout: 0,
          contractTimeoutStatus: 0,
          contractTimeoutTime: '',
          isNewData:0
        },
      ],
      customerArr: [],
      isAddCount: 0,
      tableKey: 0,
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getContractEntry()
      })()
    }
    this.getCustomerList()
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      API.getList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        version: this.filterObj.version,
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.MinePackage,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    // 客户
    getCustomerList() {
      selectAPI.queryCustomerList().then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    //新增一行数据
    addNewRow() {
      this.tableData.unshift({
        customerName: '',
        noTaxIMK: '',
        Tax: '',
        NoTax: '',
        contractDate: '',
        contractStatus: '',
        systemStatus: '',
        applyRemark: '',
        packageOwner: '',
        finance: '',
        createBy: '',
        createDate: '',
        updateBy: '',
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
    deleteRow() {},
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
</style>
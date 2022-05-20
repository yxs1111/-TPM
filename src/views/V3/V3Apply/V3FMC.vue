<!--
 * @Description: V3FMC
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-05-20 16:30:23
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商:</span>
          <el-select v-model="filterObj.supplierCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap" style="align-items: center;">
      <div class="TpmButtonBG" :class="!isSubmit&&isSelf&&isGainLe?'':'noClick'" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" :class="!isSubmit&&isSelf&&isGainLe?'':'noClick'" @click="approve()">
        <svg-icon icon-class="passApprove"  style="font-size: 24px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="220" align="center" prop="brandName" label="供应商" />
      <el-table-column width="220" align="center" prop="brandName" label="大区" />
      <el-table-column width="220" align="center" prop="brandName" label="区域" />
      <el-table-column width="220" align="right" prop="planRatio" label="V1计划单价(RMB/人)">
        <template v-slot:header>
          <div>V1计划单价(RMB/人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V1计划人数(人)">
        <template v-slot:header>
          <div>V1计划人数(人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V2预估单价(RMB/人)">
        <template v-slot:header>
          <div>V2预估单价(RMB/人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V2预估人数(人)">
        <template v-slot:header>
          <div>V2预估人数(人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V2预估费用(RMB)">
        <template v-slot:header>
          <div>V2预估费用(RMB)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际单价-默认(RMB/人)">
        <template v-slot:header>
          <div>V3实际单价-默认(RMB/人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际人数-默认(人)">
        <template v-slot:header>
          <div>V3实际人数-默认(人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际费用-默认(RMB)">
        <template v-slot:header>
          <div>V3实际费用-默认(RMB)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际单价-调整后(RMB/人)">
        <template v-slot:header>
          <div>V3实际单价-调整后(RMB/人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际人数-调整后(人)">
        <template v-slot:header>
          <div>V3实际人数-调整后(人)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planRatio" label="V3实际费用-调整后(RMB)">
        <template v-slot:header>
          <div>V3实际费用-调整后(RMB)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planRatio) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costBelongDept" label="费用归属部门"></el-table-column>
      <el-table-column width="220" align="center" prop="costBelongDept" label="费用核销方式"></el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="单价差值(%)">
        <template v-slot:header>
          <div>单价差值(%)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.ratioDifference) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="人数差值(%)">
        <template v-slot:header>
          <div>人数差值(%)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.ratioDifference) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="费用差值(RMB)">
        <template v-slot:header>
          <div>费用差值(RMB)<br><span class="subTitle">KA+供应商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.costDifference) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
            <div slot="content" v-html="getTip(row)" />
            <div class="statusWrap">
              <img v-if="row.judgmentType=='Pass'" src="@/assets/images/success.png" alt="">
              <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1" src="@/assets/images/warning.png" alt="">
              <img v-if="row.judgmentType=='Error'" src="@/assets/images/selectError.png" alt="">
              <span class="judgmentText">{{ row.judgmentType }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="judgmentContent" label="系统判定内容">
      </el-table-column>
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImportDialog">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downloadTemplate">下载模板</el-button>
            <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
          </div>
          <el-button v-if="saveBtn" type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile" @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png" alt="">
              <span class="text">选择文件</span>
            </div>
            <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
            <div v-if="uploadFileName!=''" class="fileName">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
              <span>{{ uploadFileName }}</span>
            </div>
          </div>
          <div class="seeData" style="width: auto;">
            <div class="exportError" @click="exportErrorList">
              <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon">
              <span>导出错误信息</span>
            </div>
          </div>
        </div>
        <div class="tableWrap">
          <el-table border height="400" :data="ImportData" style="width: 100%" :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN'
            }" :row-class-name="tableRowClassName" stripe>
            <el-table-column prop="date" fixed align="center" label="是否通过" width="200">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                  <div slot="content" v-html="getTip(row)" />
                  <div class="statusWrap">
                    <img v-if="row.judgmentType=='success'" src="@/assets/images/success.png" alt="">
                    <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('exception') > -1" src="@/assets/images/warning.png" alt="">
                    <img v-if="row.judgmentType=='error'" src="@/assets/images/selectError.png" alt="">
                    <span class="judgmentText">{{ row.judgmentType }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
            <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed />
            <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
            <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
            <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" />
            <el-table-column width="180" align="center" prop="costItemName" label="费用科目" />
            <el-table-column width="120" align="center" prop="channelCode" label="渠道" />
            <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
            <el-table-column width="220" align="center" prop="brandName" label="Contract Item" />
            <el-table-column width="220" align="right" prop="planRatio" label="V1计划合同点数(%)(kA+Contract Item)">
              <template v-slot:header>
                <div>V1计划合同点数(%)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.planRatio) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planNewUserNum" label="V1计划销售额IMK(RMB)">
              <template v-slot:header>
                <div>V1计划销售额IMK(RMB)<br><span class="subTitle">kA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.planSalesAmount) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="V1计划合同费用(RMB)">
              <template v-slot:header>
                <div>V1计划合同费用(RMB)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.planCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="V2预估合同点数-默认(%)">
              <template v-slot:header>
                <div>V2预估合同点数-默认(%)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.forecastRatio) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="240" align="right" prop="planCost" label="V2预估销售额IMK-默认(RMB)">
              <template v-slot:header>
                <div>V2预估销售额IMK-默认(RMB)<br><span class="subTitle">kA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.forecastSalesAmount) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="V2预估合同费用-默认(RMB)">
              <template v-slot:header>
                <div>V2预估合同费用-默认(RMB)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.forecastCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="V2预估合同点数-调整后(%)">
              <template v-slot:header>
                <div>V2预估合同点数-调整后(%)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedRatio) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="planCost" label="V2预估销售额IMK-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估销售额IMK-调整后(RMB)<br><span class="subTitle">kA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedSalesAmount) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="240" align="right" prop="planCost" label="V2预估合同费用-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估合同费用-调整后(RMB)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="costBelongDept" label="费用归属部门">
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="点数差值(%)">
              <template v-slot:header>
                <div>点数差值(%)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.ratioDifference) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="planCost" label="费用差值(%)">
              <template v-slot:header>
                <div>费用差值(%)<br><span class="subTitle">kA+Contract Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.costDifference) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
            <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
            <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  getHeightHaveTab,
  messageObj,
  downloadFile,
  messageMap,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V2/contract'
export default {
  name: 'V3FMC',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        supplierCode: '',
        regionCode: '',
        customerCode: '',
        month: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      RegionList:[],
      ContractItemList: [],
      maxheight: getHeightHaveTab(),
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      isSelf: 0, //是否是当前审批人
      isGainLe: 0, //是否已经从LE接过数据
      mainId: '',
      usernameLocal: '',
      messageMap: messageMap(),
      // 导入
      importVisible: false, // 导入弹窗
      ImportData: [],
      uploadFileName: '',
      event: '',
      uploadFile: '',
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      isCheck: false, //检测数据按钮显示或隐藏
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    this.getAllMonth()
    this.getContractItemList()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getPageHIH({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          customerCode: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          contractItemCode: this.filterObj.contractItemCode,
          yearAndMonth: this.filterObj.month,
        }).then((response) => {
          this.tableData = response.data.records
          this.isSubmit = this.tableData[0].isSubmit
          this.isGainLe = this.tableData[0].isGainLe
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          this.mainId = this.tableData[0].mainId
          this.infoByMainId()
        })
      }
    },
    // 通过与审批按钮控制
    infoByMainId() {
      selectAPI
        .infoByMainId({
          mainId: this.mainId,
        })
        .then((res) => {
          if (res.code === 1000) {
            if (
              res.data.version === 'V2' &&
              res.data.assignee.indexOf(this.usernameLocal) != -1
            ) {
              //本人可以提交
              this.isSelf = true
            } else {
              //其他人禁用
              this.isSelf = false
            }
          }
        })
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    // 获取ContractItem
    getContractItemList() {
      selectAPI.getContractItemList().then((res) => {
        if (res.code === 1000) {
          this.ContractItemList = res.data
        }
      })
    },
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          this.getCustomerList()
        }
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    getRegionList() {
      selectAPI
        .getRegionList({
          distributorName: this.filterObj.distributorCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.RegionList = res.data
          }
        })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
      const money = num * 1
      return money.toLocaleString('zh', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportHIHApplyExcel({
          customerCode: this.filterObj.customerCode,
          channelCode: this.filterObj.channelCode,
          contractItemCode: this.filterObj.contractItemCode,
          yearAndMonth: this.filterObj.month,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_HIH Rebate_${this.filterObj.channelCode}_V2_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
    },
    importData() {
      this.saveBtn = false
      if (this.filterObj.channelCode == '') {
        this.$message.info('请先选择渠道！')
      } else {
        this.importVisible = true
      }
    },

    // 选择导入文件
    parsingExcelBtn() {
      this.saveBtn = false
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.isCheck = false
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      this.event=event
      
    },
    // 关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn = false
      this.isCheck = false
    },
    // 校验数据
    checkImport() {
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.month)
      formData.append('channelCode', this.filterObj.channelCode)
      formData.append('isSubmit', 0)
      formData.append('costItemCode', 'HIH rebate')
      API.formatCheck(formData).then((response) => {
        //清除input的value ,上传一样的
        this.event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data)) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            debugger
            this.ImportData = response.data
            let isError=this.ImportData.findIndex(item=>{
              item.judgmentType=='error'
            })
            this.saveBtn = isError==-1?1:0
            console.log(this.saveBtn);
          }
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    // 确认导入
    confirmImport() {
      API.importSave({
        yearAndMonth:this.filterObj.month,
        channelCode:this.filterObj.channelCode,
        costItemCode:'HIH rebate',
        isSubmit: 0,
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success(this.messageMap.saveSuccess)
          this.getTableData()
          this.closeImportDialog()
        } else {
          this.$message.info(this.messageMap.saveError)
        }
      })
    },
    // 导出异常信息
    exportErrorList() {
      if (this.ImportData.length) {
        API.downCheckData({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          contractItemCode: this.filterObj.contractItemCode,
          costItemCode: 'HIH rebate',
          isSubmit: 0,
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          downloadFile(res, 'V2_HIH Rebate异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
          this.$message.success(this.messageMap.exportErrorSuccess)
        })
      } else {
        this.$message.info('异常数据为空!')
      }
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.downApplyExcelTemplate({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          contractItemCode: this.filterObj.contractItemCode,
          costItemCode:'HIH rebate',
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_HIH Rebate_${this.filterObj.channelCode}_V2申请.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    approve() {
      if (this.tableData.length) {
        const judgmentType = this.tableData[0].judgmentType
        if (judgmentType != null) {
          this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const mainId = this.tableData[0].mainId
              API.approve({
                mainId: mainId, // 主表id
                opinion: 'agree', // 审批标识(agree：审批通过，reject：审批驳回)
                isSubmit:0,//申请0,审批1
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('提交成功')
                  this.getTableData()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
        } else {
          this.$message.info('数据未校验，请先进行导入验证')
        }
      } else {
        this.$message.warning('数据不能为空')
      }
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
    getTip(row) {
      return `<div class="Tip">${row.judgmentContent}</div>`
    },
  },
}
</script>

<style lang="scss" scoped>
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
  color: #eb4f48;
  font-size: 14px;
  margin-bottom: 10px;
}
.tipStar {
  font-size: 12px;
  color: #eb4f48;
}
</style>

<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-07-29 14:16:56
-->
<template>
  <div class="V0ApplyList">
    <div class="SelectBarWrap" @keyup.enter="search">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.SKU" filterable clearable placeholder="请选择">
            <el-option v-for="item in skuOptons" :key="item.productEsName" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
      <div class="OpertionBar">
        <!-- <el-button type="primary" @click="getCPTData" v-permission="permissions['getCPT']">获取CPT数据</el-button> -->
        <div class="TpmButtonBG" @click="getCPTData" v-permission="permissions['getCPT']">
          <img src="@/assets/images/huoqu.png" alt="" />
          <span class="text">获取CPT数据</span>
        </div>
        <!-- 提交 有数据  正常 暗 -->
        <!-- 没有提交 有数据  正常点击 -->
        <!-- 没有提交 无数据  正常 暗 -->
        <div class="TpmButtonBG" :class="!isSubmit&&isSelf?'':'noClick'" @click="importData">
          <img src="@/assets/images/import.png" alt="" />
          <span class="text">导入</span>
        </div>
        <div class="TpmButtonBG" :class="!isSubmit&&isSelf?'':'noClick'" @click="approve">
          <svg-icon icon-class="passLocal" style="font-size: 22px;" />
          <span class="text">提交</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" label="序号" width="80" fixed>
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed >
      </el-table-column>
      <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月" fixed></el-table-column>
      <el-table-column align="center" width="180" prop="costTypeName" label="费用类型"></el-table-column>
      <el-table-column align="center" width="180" prop="minePackageName" label="Mine Package"></el-table-column>
      <el-table-column align="center" width="220" prop="costItemName" label="费用科目"></el-table-column>
      <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
      <el-table-column align="center" width="180" prop="dimCustomer" label="客户系统名称"></el-table-column>
      <el-table-column align="center" width="120" prop="brandName" label="品牌"></el-table-column>
      <el-table-column align="center" width="220" prop="dimProduct" label="SKU"></el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)">
        {{FormateNum(row.cptAveragePrice)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="cptVol" label="CPT总计销量">
        {{FormateNum(row.cptVol)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="cptCostOne" label="CPT总计费用1(RMB)">
        {{FormateNum(row.cptCostOne)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="cptCostTwo" label="CPT总计费用2(RMB)">
        {{FormateNum(row.cptCostTwo)}}
      </el-table-column>
      <el-table-column align="center" width="100" prop="gearActivityLevel" label="活动级别">
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="gearPrice" label="价格档位(RMB/Tin)">
        {{FormateNum(row.gearPrice)}}
      </el-table-column>
      <el-table-column align="right" width="250" prop="gearVolMix" label="档位销量占比-默认(%)">
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="gearActualNum" label="档位销量-默认(ctn)">
        {{FormateNum(row.gearActualNum)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="gearCost" label="档位费用-默认(RMB)">
        {{FormateNum(row.gearCost)}}
      </el-table-column>
      <el-table-column align="right" width="250" prop="adjustedVolMix" label="档位销量占比-调整后(%)">
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedVol" label="档位销量-调整后(ctn)">
        {{FormateNum(row.adjustedVol)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedAveragePriceOne" label="均价1-调整后(RMB)">
        {{FormateNum(row.adjustedAveragePriceOne)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedAveragePriceTwo" label="均价2-调整后(RMB)">
        {{FormateNum(row.adjustedAveragePriceTwo)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostOne" label="费用1-调整后(RMB)">
        {{FormateNum(row.adjustedCostOne)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostTwo" label="费用2-调整后(RMB)">
        {{FormateNum(row.adjustedCostTwo)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostThree" label="费用3-调整后(RMB)">
        {{FormateNum(row.adjustedCostThree)}}
      </el-table-column>
      <el-table-column align="center" width="250" prop="dept" label="费用归属部门">
      </el-table-column>
      <el-table-column align="right" width="250" prop="differenceAveragePrice" label="均价差值(%)">
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="differenceCostOne" label="费用差值1 (RMB)">
        {{FormateNum(row.differenceCostOne)}}
      </el-table-column>
      <el-table-column align="right" v-slot={row} width="250" prop="differenceCostTwo" label="费用差值2 (RMB)">
        {{FormateNum(row.differenceCostTwo)}}
      </el-table-column>
      <el-table-column align="center" width="160" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
            <div slot="content" v-html="getTip(row)">
            </div>
            <div class="statusWrap">
              <img src="@/assets/images/success.png" alt="" v-if="row.judgmentType=='Pass'">
              <img src="@/assets/images/warning.png" alt="" v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1">
              <img src="@/assets/images/selectError.png" alt="" v-if="row.judgmentType=='Error'">
              <span class="judgmentText">{{row.judgmentType}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="850" prop="judgmentContent" label="系统判定内容"></el-table-column>
      <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
      <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
      <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 50, 100, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" title="获取CPT数据" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="Mine package">
            <el-select v-model="ruleForm.Minepackage" placeholder="请选择" class="my-el-select">
              <el-option v-for="item,index in ['Price Promotion','New User','KA Contract','ListingFee']" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Scenario" prop="dimScenario">
            <el-select v-model="ruleForm.dimScenario" placeholder="请选择" class="my-el-select">
              <el-option v-for="item,index in yearAndMonthList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Version" prop="dimVersion">
            <el-select v-model="ruleForm.dimVersion" placeholder="请选择" class="my-el-select">
              <el-option v-for="item,index in VersionList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道" prop="channelCode">
            <el-select v-model="ruleForm.channelCode" disabled placeholder="请选择" class="my-el-select">
              <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog width="66%" class="my-el-dialog " title="导入" :visible="importVisible" @close="closeImportDialog">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downloadTemplate">下载模板</el-button>
            <el-button v-if="isCheck" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
          </div>
          <el-button v-if="saveBtn" type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
          <el-button  type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile" @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png" alt="" />
              <span class="text">选择文件</span>
            </div>
            <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)">
            <div class="fileName" v-if="uploadFileName!=''">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
              <span>{{uploadFileName}}</span>
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
            <el-table-column fixed align="center" label="是否通过" width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
                <img v-else-if="scope.row.judgmentType.indexOf('Exception') > -1" :src="excepImg" style="width:25px;height:25px;">
                <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width:25px;height:25px;">
              </template>
            </el-table-column>
            <el-table-column width="400" align="center" prop="judgmentContent" fixed label="验证信息" />
            <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed >
            </el-table-column>
            <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
            <el-table-column align="center" width="120" prop="costTypeName" label="费用类型"></el-table-column>
            <el-table-column align="center" width="160" prop="minePackageName" label="Mine Package"></el-table-column>
            <el-table-column align="center" width="220" prop="costItemName" label="费用科目"></el-table-column>
            <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
            <el-table-column align="center" width="120" prop="dimCustomer" label="客户系统名称"></el-table-column>
            <el-table-column align="center" width="120" prop="brandName" label="品牌"></el-table-column>
            <el-table-column align="center" width="120" prop="dimProduct" label="SKU"></el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)">
              {{FormateNum(row.cptAveragePrice)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="cptVol" label="CPT总计销量">
              {{FormateNum(row.cptVol)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="cptCostOne" label="CPT总计费用1(RMB)">
              {{FormateNum(row.cptCostOne)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="cptCostTwo" label="CPT总计费用2(RMB)">
              {{FormateNum(row.cptCostTwo)}}
            </el-table-column>
            <el-table-column align="center" width="100" prop="gearActivityLevel" label="活动级别">
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="gearPrice" label="价格档位(RMB/Tin)">
              {{FormateNum(row.gearPrice)}}
            </el-table-column>
            <el-table-column align="right" width="250" prop="gearVolMix" label="档位销量占比-默认(%)">
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="gearActualNum" label="档位销量-默认(ctn)">
              {{FormateNum(row.gearActualNum)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="gearCost" label="档位费用-默认(RMB)">
              {{FormateNum(row.gearCost)}}
            </el-table-column>
            <el-table-column align="right" width="250" prop="adjustedVolMix" label="档位销量占比-调整后(%)">
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedVol" label="档位销量-调整后(ctn)">
              {{FormateNum(row.adjustedVol)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedAveragePriceOne" label="均价1-调整后(RMB)">
              {{FormateNum(row.adjustedAveragePriceOne)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedAveragePriceTwo" label="均价2-调整后(RMB)">
              {{FormateNum(row.adjustedAveragePriceTwo)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostOne" label="费用1-调整后(RMB)">
              {{FormateNum(row.adjustedCostOne)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostTwo" label="费用2-调整后(RMB)">
              {{FormateNum(row.adjustedCostTwo)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="adjustedCostThree" label="费用3-调整后(RMB)">
              {{FormateNum(row.adjustedCostThree)}}
            </el-table-column>
            <el-table-column align="center" width="250" prop="dept" label="费用归属部门">
            </el-table-column>
            <el-table-column align="right" width="250" prop="differenceAveragePrice" label="均价差值(%)">
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="differenceCostOne" label="费用差值1 (RMB)">
              {{FormateNum(row.differenceCostOne)}}
            </el-table-column>
            <el-table-column align="right" v-slot={row} width="250" prop="differenceCostTwo" label="费用差值2 (RMB)">
              {{FormateNum(row.differenceCostTwo)}}
            </el-table-column>
            <el-table-column align="center" width="160" prop="judgmentType" label="系统判定">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                  <div slot="content" v-html="getTip(row)">
                  </div>
                  <div class="statusWrap">
                    <img src="@/assets/images/success.png" alt="" v-if="row.judgmentType=='Pass'">
                    <img src="@/assets/images/warning.png" alt="" v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1">
                    <img src="@/assets/images/selectError.png" alt="" v-if="row.judgmentType=='Error'">
                    <span class="judgmentText">{{row.judgmentType}}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" width="800" prop="judgmentContent" label="系统判定内容"></el-table-column>
            <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
            <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
            <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
          </el-table>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {
  getDefaultPermissions,
  yearAndMonthList,
  VersionList,
  messageMap,
  FormateThousandNum,
  messageObj,
  getHeightSingle,
} from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import API from '@/api/V0/V0.js'
import V0New from '@/api/V0/V0New.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      permissions: getDefaultPermissions(),
      filterObj: {
        month: '',
        SKU: '',
        channelCode: '',
      },
      monthList: [],
      skuOptons: [],
      ContentData: [],
      tableData: [],
      ruleForm: {
        yearAndMonth: '',
        channelCode: '',
        dimScenario: '',
        dimVersion: '',
        Minepackage: '',
      },
      rules: {
        channelCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        dimScenario: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        dimVersion: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        Minepackage: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      //导入
      importVisible: false, //导入弹窗
      ImportData: [],
      uploadFileName: '',
      uploadFile: '',
      event: '',
      isSubmit: 1,
      isSelf: 0, //是否是当前审批人
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      isCheck: false, //检测数据按钮显示或隐藏
      // yearAndMonthList: yearAndMonthList(),
      yearAndMonthList: [
        '2022 3+9',
        '2022 2+10',
        '2022 0+12',
        '2021 11+1',
        '2021 10+2',
        '2021 9+3',
        '2021 8+4',
      ],
      VersionList: VersionList(),
      ChannelList: [],
      backgroundList: [
        'background:#EFFCF9',
        'background:#FEF5F6',
        'background:#F0F6FC',
      ], //价格档位背景色
      isNoData: true,
      usernameLocal: '',
      mainId: '',
      messageMap: messageMap(),
      maxheight: getHeightSingle(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannelList()
    this.getAllMonth()
    // this.getList()
    this.getQuerySkuSelect()
  },
  watch: {
    'filterObj.channelCode'() {
      this.ruleForm.channelCode = this.filterObj.channelCode
    },
  },
  computed: {},
  methods: {
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    getScenarioList() {
      API.getScenarioList({
        channelName: this.filterObj.channelCode,
      }).then((res) => {
        this.yearAndMonthList = res.data
      })
    },
    getList() {
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        this.tableData = []
        this.isNoData = true
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        V0New.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
        }).then((response) => {
          if (response.code === 1000) {
            this.tableData = response.data.records
            this.pageNum = response.data.pageNum
            this.isSubmit=this.tableData[0].isSubmit
            this.pageSize = response.data.pageSize
            this.total = response.data.total
            this.mainId = this.tableData[0].mainId
            this.infoByMainId()
          }
        })
      }
    },
    getQuerySkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuOptons = res.data
      })
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.ChannelList = res.data
        }
      })
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
              res.data.version === 'V0' &&
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
        .catch()
    },
    getTip(row) {
      return `<div class="Tip">${row.judgmentContent}</div>`
    },
    //档位列
    columnList(list) {
      let columnList = list[0].customGearList
      return columnList
    },
    search() {
      this.getList()
    },
    getCPTData() {
      if (this.filterObj.month == '') {
        this.$message.info(messageObj.requireMonth)
        return
      }
      if (this.filterObj.channelCode == '') {
        this.$message.info(messageObj.requireChannel)
        return
      }
      this.getScenarioList()
      this.dialogVisible = true
      this.ruleForm.channelCode = this.filterObj.channelCode
      this.ruleForm.dimVersion = ''
    },
    //导入数据弹窗显示
    importData() {
      if (this.filterObj.channelCode == '') {
        this.$message.info('请先选择渠道！')
      } else {
        this.importVisible = true
      }
    },
    //关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn = false
      this.isCheck = false
    },
    //选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.isCheck = false
      this.saveBtn = false
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.month)
      formData.append('channelCode', this.filterObj.channelCode)
      V0New.importExcel(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          this.$message.success(this.messageMap.importSuccess)
          this.ImportData = response.data
          this.isCheck =
            response.data[0].judgmentType === 'Error' ? false : true
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    //校验数据
    checkImport() {
      V0New.exceptionCheck({
        yearAndMonth: this.filterObj.month,
        channelCode: this.filterObj.channelCode,
      }).then((response) => {
        if (response.code == 1000) {
          this.$message.success(this.messageMap.checkSuccess)
          this.ImportData = response.data
          this.saveBtn =
            response.data[0].judgmentType === 'Error' ? false : true
        } else {
          this.$message.info(this.messageMap.checkError)
        }
      })
    },
    //确认导入文件
    confirmImport() {
      V0New.exceptionSave({
        mainId: this.mainId,
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success(this.messageMap.saveSuccess)
          this.closeImportDialog()
          this.getList()
        } else {
          this.$message.info(this.messageMap.saveError)
        }
      })
    },
    //导出异常信息
    exportErrorList() {
      if (this.ImportData.length) {
        V0New.exceptionDownExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
        }).then((res) => {
          let timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V0异常信息 -' + timestamp + '.xlsx') //自定义Excel文件名
          this.$message.success(this.messageMap.exportErrorSuccess)
        })
      } else {
        this.$message.info('异常数据为空!')
      }
    },
    //导出数据
    exportData() {
      if (this.tableData.length) {
        //导出数据筛选
        V0New.exportExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
        }).then((res) => {
          this.downloadFile(
            res,
            `${this.filterObj.month}_Price_${this.filterObj.channelCode}_V0_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.warning('数据不能为空')
      }
    },
    //下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        //导出数据筛选
        V0New.exportTemplateExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
        }).then((res) => {
          this.downloadFile(
            res,
            `${this.filterObj.month}_Price_${this.filterObj.channelCode}_V0申请.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.warning('数据不能为空')
      }
    },
    //下载文件
    downloadFile(res, fileName) {
      let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      if (!fileName) {
        fileName = res.headers['content-disposition'].split('filename=').pop()
      }
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      }
    },
    //确认获取CPT 数据
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url
          // var url =
          //   this.ruleForm.Minepackage == 'Price Promotion'? API.getCPTData: this.ruleForm.Minepackage == 'New User'?API.getNuData: this.ruleForm.Minepackage == 'Contract'? API.getContractData:API.getListingFee
          switch (this.ruleForm.Minepackage) {
            case 'Price Promotion':
              url = V0New.getCPTData
              break
            case 'New User':
              url = API.getNuData
              break
            case 'KA Contract':
              url = API.getContractData
              break
            case 'ListingFee':
              url = API.getListingFee
              break
          }
          console.log(url)
          url({
            yearAndMonth: this.filterObj.month,
            channelCode: this.ruleForm.channelCode,
            dimScenario: this.ruleForm.dimScenario,
            dimVersion: this.ruleForm.dimVersion,
          }).then((response) => {
            if (response.code == 1000) {
              this.$message.success('成功获取数据!')
              this.getList()
              this.resetForm(formName)
            }
          })
        } else {
          this.$message.warning('提交失败,请填写必填项')
          return false
        }
      })
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    // 弹窗关闭
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        yearAndMonth: '',
        channelCode: '',
        dimScenario: '',
        dimVersion: '',
        Minepackage: '',
      }
    },
    //V0 提交审批
    approve() {
      if (this.tableData.length) {
        let judgmentType = this.tableData[0].judgmentType
        if (judgmentType != null) {
          this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              V0New.approve({
                mainId: this.mainId, //主表id
                opinion: 'agree', //审批标识(agree：审批通过，reject：审批驳回)
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('提交成功')
                  this.getList()
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
    // 行样式
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
    columnStyle({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0 && rowIndex != 0) {
      //   return 'background:#4192d3!important'
      // }
      // let num = (4 + Number(row.priceGearNum) - columnIndex) % 3
      // if (
      //   4 <= columnIndex &&
      //   columnIndex < 4 + Number(row.priceGearNum) &&
      //   rowIndex != 0
      // ) {
      //   return this.backgroundList[num]
      // }
    },
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pageNum = num
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.V0ApplyList {
  height: 100%;
  .importDialog {
    height: 600px;
  }
}
.V0Content {
  height: calc(100% - 0px);
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
}
</style>
<style>
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
</style>

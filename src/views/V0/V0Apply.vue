<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2023-01-08 15:25:38
-->
<template>
  <div class="V0Content">
    <div class="Maincontent">
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
              <el-option v-for="(item, index) in ChannelList" :key="index" :label="item.channelCsName" :value="item.channelCode" />
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
          <div class="TpmButtonBG" :class="!isSubmit && !isNoData && isSelf ? '' : 'noClick'" @click="importData">
            <img src="@/assets/images/import.png" alt="" />
            <span class="text">导入</span>
          </div>

          <div class="TpmButtonBG" :class="!isSubmit && !isNoData && isSelf ? '' : 'noClick'" @click="approve">
            <svg-icon icon-class="passLocal" style="font-size: 22px" />
            <span class="text">提交</span>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="ContentWrap">
        <div class="contentli" v-for="(tableData, key) in ContentData" :key="key">
          <div class="contentTop">
            <div class="SKUTitle">
              {{ key }}
            </div>
          </div>
          <div class="contentInfoWrap">
            <el-table :data="tableData" class="customTable" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" :cell-style="columnStyle" style="width: 100%">
              <el-table-column width="150" fixed>
                <template slot="header">
                  <div></div>
                </template>
                <template slot-scope="scope">
                  <div :class="scope.$index == 0 ? 'filstColumn_total' : 'filstColumn'">
                    <span>{{ scope.row.dimCustomer }} </span>
                    <!-- {{scope.$index}} -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
              <el-table-column v-slot="{ row }" align="right" width="150" prop="cptVolBox" label="CPT VOL(CTN)">
                {{ FormateNum(row.cptVolBox) }}
              </el-table-column>
              <el-table-column align="right" width="250" v-for="(citem, cindex) in Number(tableData[0].priceGearNum)" :key="cindex">
                <template slot="header"> {{ tableData[0].customGearList[cindex].gear }}RMB/Tin 档位销量(CTN) </template>
                <template slot-scope="{ row }">
                  <div>
                    {{ FormateNum(row.customGearList[cindex].actualNum) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cityPlanAveragePrice" label="City Plan预拆分均价(RMB/Tin)">
                {{ FormateNum(row.cityPlanAveragePrice) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cityPlanPromotionExpenses" label="City Plan预拆分费用(RMB)">
                {{ FormateNum(row.cityPlanPromotionExpenses) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)">
                {{ FormateNum(row.cptAveragePrice) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="cptPromotionExpenses" label="CPT费用(RMB)">
                {{ FormateNum(row.cptPromotionExpenses) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="averagePriceRange" label="均价差值(%)">
                {{ (row.averagePriceRange * 1).toFixed(2) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="promotionExpensesGapValue" label="费用差值(RMB)">
                {{ FormateNum(row.promotionExpensesGapValue) }}
              </el-table-column>
              <el-table-column align="center" width="160" prop="judgmentType" label="系统判定">
                <template slot-scope="{ row }">
                  <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                    <div slot="content" v-html="getTip(row)"></div>
                    <div class="statusWrap">
                      <img src="@/assets/images/success.png" alt="" v-if="row.judgmentType == 'Pass'" />
                      <img src="@/assets/images/warning.png" alt="" v-if="row.judgmentType != null && row.judgmentType.indexOf('Exception') > -1" />
                      <img src="@/assets/images/selectError.png" alt="" v-if="row.judgmentType == 'Error'" />
                      <span class="judgmentText">{{ row.judgmentType }}</span>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="null_content" v-show="isNoData">
        <img src="@/assets/images/null_content.jpg" alt="" />
        <div class="null_content_tit">暂无数据</div>
      </div>
      <el-dialog class="my-el-dialog" title="获取CPT数据" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
        <div class="el-dialogContent">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
            <el-form-item label="Mine package">
              <el-select v-model="ruleForm.Minepackage" placeholder="请选择" class="my-el-select">
                <el-option v-for="(item, index) in minePackageList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="Scenario" prop="dimScenario">
              <el-select v-model="ruleForm.dimScenario" placeholder="请选择" class="my-el-select">
                <el-option v-for="(item, index) in yearAndMonthList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="Version" prop="dimVersion">
              <el-select v-model="ruleForm.dimVersion" placeholder="请选择" class="my-el-select">
                <el-option v-for="(item, index) in VersionList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channelCode">
              <el-select v-model="ruleForm.channelCode" disabled placeholder="请选择" class="my-el-select">
                <el-option v-for="(item, index) in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
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
      <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImportDialog">
        <div class="importDialog">
          <div class="el-downloadFileBar">
            <div>
              <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downloadTemplate">下载模板</el-button>
              <el-button v-if="isCheck" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
            </div>
            <el-button v-if="saveBtn" type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
          </div>
          <div class="fileInfo">
            <div class="fileInfo">
              <div class="fileTitle">文件</div>
              <div class="my-search selectFile" @click="parsingExcelBtn">
                <img src="@/assets/images/selectFile.png" alt="" />
                <span class="text">选择文件</span>
              </div>
              <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)" />
              <div class="fileName" v-if="uploadFileName != ''">
                <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
                <span>{{ uploadFileName }}</span>
              </div>
            </div>
            <div class="seeData" style="width: auto">
              <div class="exportError" @click="exportErrorList">
                <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon" />
                <span>导出错误信息</span>
              </div>
            </div>
          </div>
          <div class="tableWrap">
            <el-table
              border
              height="400"
              :data="ImportData"
              style="width: 100%"
              :header-cell-style="{
                background: '#fff',
                color: '#333',
                fontSize: '16px',
                textAlign: 'center',
                fontWeight: 400,
                fontFamily: 'Source Han Sans CN',
              }"
              :row-class-name="tableRowClassName"
              stripe
            >
              <el-table-column fixed align="center" label="是否通过" width="100">
                <template slot-scope="scope">
                  <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg" />
                  <img v-else-if="scope.row.judgmentType.indexOf('Exception') > -1" :src="excepImg" style="width: 25px; height: 25px" />
                  <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width: 25px; height: 25px" />
                </template>
              </el-table-column>
              <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
              <el-table-column align="center" width="260" prop="dimProduct" label="SKU"></el-table-column>
              <el-table-column align="center" width="160" prop="dimCustomer" label="客户名称"></el-table-column>
              <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
              <el-table-column v-slot="{ row }" align="right" width="150" prop="cptVolBox" label="CPT VOL(CTN)">
                {{ FormateNum(row.cptVolBox) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cityPlanAveragePrice" label="City Plan预拆分均价(RMB/Tin)">
                {{ FormateNum(row.cityPlanAveragePrice) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cityPlanPromotionExpenses" label="City Plan预拆分费用(RMB)">
                {{ FormateNum(row.cityPlanPromotionExpenses) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)">
                {{ FormateNum(row.cptAveragePrice) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="cptPromotionExpenses" label="CPT费用(RMB)">
                {{ FormateNum(row.cptPromotionExpenses) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="averagePriceRange" label="均价差值(%)">
                {{ (row.averagePriceRange * 1).toFixed(2) }}
              </el-table-column>
              <el-table-column align="right" v-slot="{ row }" width="160" prop="promotionExpensesGapValue" label="费用差值(RMB)">
                {{ FormateNum(row.promotionExpensesGapValue) }}
              </el-table-column>
              <el-table-column align="center" width="160" prop="judgmentType" label="系统判定">
                <template slot-scope="{ row }">
                  <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                    <div slot="content" v-html="getTip(row)"></div>
                    <div class="statusWrap">
                      <img src="@/assets/images/success.png" alt="" v-if="row.judgmentType == 'Pass'" />
                      <img src="@/assets/images/warning.png" alt="" v-if="row.judgmentType != null && row.judgmentType.indexOf('Exception') > -1" />
                      <img src="@/assets/images/selectError.png" alt="" v-if="row.judgmentType == 'Error'" />
                      <span class="judgmentText">{{ row.judgmentType }}</span>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDefaultPermissions, yearAndMonthList, VersionList, messageMap, formatThousandNum, messageObj } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import API from '@/api/V0/V0.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  data() {
    return {
      permissions: getDefaultPermissions(),
      filterObj: {
        month: '',
        SKU: '',
        channelCode: '',
        channelName: '',
      },
      monthList: [],
      skuOptons: [],
      ContentData: [],
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
      yearAndMonthList: ['2022 3+9', '2022 2+10', '2022 0+12', '2021 11+1', '2021 10+2', '2021 9+3', '2021 8+4'],
      VersionList: VersionList(),
      ChannelList: [],
      backgroundList: ['background:#EFFCF9', 'background:#FEF5F6', 'background:#F0F6FC'], //价格档位背景色
      isNoData: true,
      usernameLocal: '',
      mainId: '',
      messageMap: messageMap(),
      minePackageList: ['Price Promotion', 'New User', 'KA Contract', 'ListingFee', 'ECM', 'DM', 'POSM', 'Transport Costs', 'Premium', 'Free Goods', 'Mama class', 'FMC', 'RoadShow'],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannelList()
    this.getAllMonth()
    // this.getList()
    this.getQuerySkuSelect()
  },
  watch: {
    'filterObj.channelCode'() {
      this.ruleForm.channelCode = this.filterObj.channelCode
      //根据channelCode 取channelCsName
      this.ChannelList.forEach((item) => {
        if (item.channelCode == this.filterObj.channelCode) {
          this.filterObj.channelName = item.channelCsName
        }
      })
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
        channelCode: this.filterObj.channelCode,
      }).then((res) => {
        this.yearAndMonthList = res.data
      })
    },
    getList() {
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        this.ContentData = []
        this.isNoData = true
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getList({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
          channelName: this.filterObj.channelCode,
        }).then((response) => {
          if (response.code === 1000) {
            this.ContentData = response.data
            if (Object.keys(this.ContentData).length == 0) {
              this.isNoData = true
              this.isSubmit = 0
            } else {
              this.isNoData = false
              for (const key in this.ContentData) {
                let list = this.ContentData[key]
                this.isSubmit = this.ContentData[key][0].isSubmit
                this.mainId = this.ContentData[key][0].mainId
                for (let i = 0; i < list.length; i++) {
                  list[i].customGearList = JSON.parse(list[i].customGear)
                  //价格档位降序排序
                  list[i].customGearList.sort(function (a, b) {
                    return b.gear - a.gear
                  })
                }
              }
              //审批人匹配
              this.infoByMainId()
            }
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
          // if (!this.$route.query.channelCode) {
          //   this.filterObj.channelCode = this.ChannelList[0].channelCode
          // } else {
          //   this.filterObj.channelCode = this.$route.query.channelCode
          // }
          // this.getMonth()
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
            if (res.data.version === 'V0' && res.data.assignee.indexOf(this.usernameLocal) != -1) {
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
      API.conventionImport(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          this.$message.success(this.messageMap.importSuccess)
          this.ImportData = response.data
          this.isCheck = response.data[0].judgmentType === 'Error' ? false : true
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    //校验数据
    checkImport() {
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      API.exceptionImport(formData).then((response) => {
        if (response.code == 1000) {
          this.$message.success(this.messageMap.checkSuccess)
          this.ImportData = response.data
          this.saveBtn = response.data[0].judgmentType === 'Error' ? false : true
        } else {
          this.$message.info(this.messageMap.checkError)
        }
      })
    },
    //确认导入文件
    confirmImport() {
      let arr = Object.keys(this.ContentData)
      API.exceptionSave({
        mainId: this.ContentData[arr[0]][0].mainId,
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
        API.exceptionDownExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
          channelName: this.filterObj.channelCode,
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
      if (Object.keys(this.ContentData).length) {
        //导出数据筛选
        API.exportExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
          channelName: this.filterObj.channelCode,
        }).then((res) => {
          this.downloadFile(res, `${this.filterObj.month}_Price_${this.filterObj.channelCode}_V0_查询.xlsx`) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.warning('数据不能为空')
      }
    },
    //下载模板
    downloadTemplate() {
      if (Object.keys(this.ContentData).length) {
        //导出数据筛选
        API.exportTemplateExcel({
          yearAndMonth: this.filterObj.month,
          dimProduct: this.filterObj.SKU,
          channelCode: this.filterObj.channelCode,
          channelName: this.filterObj.channelCode,
        }).then((res) => {
          this.downloadFile(res, `${this.filterObj.month}_Price_${this.filterObj.channelCode}_V0申请.xlsx`) //自定义Excel文件名
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
              url = API.getCPTData
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
            case 'POSM':
              url = API.getPOSMData
              break
            case 'Premium':
              url = API.getPremium
              break
            case 'ECM':
              url = API.getECMcreate
              break
            case 'DM':
              url = API.getDMcreate
              break
            case 'Transport Costs':
              url = API.getTransportCreate
              break
            case 'Free Goods':
              url = API.getFreeGoods
              break
            case 'FMC':
              url = API.getFMC
              break
            case 'RoadShow':
              url = API.getRoadShow
              break
            case 'Mama class':
              url = API.getMMCData
              break
          }
          let obj = {
            yearAndMonth: this.filterObj.month,
            channelCode: this.ruleForm.channelCode,
            channelName: this.filterObj.channelName,
            dimScenario: this.ruleForm.dimScenario,
            dimVersion: this.ruleForm.dimVersion,
          }
          if (this.ruleForm.Minepackage === 'POSM' || this.ruleForm.Minepackage === 'Transport') {
            obj = {
              yearAndMonth: this.filterObj.month,
              channelName: this.ruleForm.channelCode,
              channelCode: this.ruleForm.channelCode,
              dimScenario: this.ruleForm.dimScenario,
              dimVersion: this.ruleForm.dimVersion,
            }
          }
          // console.log(url)
          url(obj).then((response) => {
            if (response.code == 1000) {
              this.$message.success('成功获取数据!')
              if (this.ruleForm.Minepackage == 'Price Promotion'||this.ruleForm.Minepackage == 'New User') {
                this.getList()
              }
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
      var arr = Object.keys(this.ContentData)
      if (arr.length) {
        let judgmentType = this.ContentData[arr[0]][1].judgmentType
        if (judgmentType != null) {
          this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let mainId = this.ContentData[arr[0]][0].mainId
              API.approve({
                mainId: mainId, //主表id
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'first-row'
      }
    },
    HeadTable() {
      return ' background: #4192D3;color: #fff;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex != 0) {
        return 'background:#4192d3!important'
      }
      let num = (4 + Number(row.priceGearNum) - columnIndex) % 3
      if (4 <= columnIndex && columnIndex < 4 + Number(row.priceGearNum) && rowIndex != 0) {
        return this.backgroundList[num]
      }
    },
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return formatThousandNum(num)
    },
  },
}
</script>

<style lang="scss" scoped>
.Maincontent {
  height: 100%;
  position: relative;
  .TopBar {
    display: flex;
    align-items: center;
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
  }
  .ContentWrap {
    width: 100%;
    height: 90%;
    // min-height: 50vh;
    .contentli {
      // height: 480px;
      padding: 20px;
      border-radius: 20px;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #f2f3f5;
      box-shadow: 3px 3px 14px 0px rgba(228, 228, 228, 0.6);
      margin-bottom: 20px;
      .contentTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .SKUTitle {
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 600;
          color: #111111;
        }
        .GuidePriceBar {
          display: flex;
          align-items: center;
          color: #4192d3;
          font-weight: 500;
          font-size: 16px;
          .guide {
            width: 20px;
            height: 20px;
          }
          .GuidePriceWrap {
            .guideText {
              margin: 0 5px;
            }
            .GuidePrice {
              font-size: 20px;
              margin-left: 5px;
            }
          }
        }
      }
      .contentInfoWrap {
        display: flex;
        margin-top: 10px;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        .filstColumn {
          text-align: center;
          color: #fff;
        }
        .filstColumn_total {
          text-align: center;
          color: #001111;
        }
      }
    }
  }
  .hide {
    display: none;
  }
  .importDialog {
    height: 600px;
  }
  .Final {
    width: 242px;
  }
}
.ContentWrap {
  width: 100%;
  // height: calc(100% - 50px);
  overflow-y: auto;
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

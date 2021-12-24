<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2021-12-24 10:09:42
-->
<template>
  <div class="app-container">
    <div class="Maincontent">
      <div class="SelectBarWrap" @keyup.enter="search">
        <div class="SelectBar">
          <div class="Selectli">
            <span class="SelectliTitle">SKU</span>
            <el-select v-model="filterObj.SKU" filterable clearable placeholder="请选择">
              <el-option v-for="item in skuOptons" :key="item.productEsName" :label="item.productEsName" :value="item.productEsName" />
            </el-select>
          </div>
          <div class="Selectli">
            <span class="SelectliTitle">月份</span>
            <el-date-picker disabled v-model="filterObj.month" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
            </el-date-picker>
          </div>
          <div class="Selectli">
            <span class="SelectliTitle">渠道</span>
            <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
            </el-select>
          </div>
          <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
          <div class="TpmButtonBG" @click="exportData">
            <img src="@/assets/images/export.png" alt="" />
            <span class="text">导出</span>
          </div>
        </div>
        <div class="OpertionBar">
          <div class="TpmButtonBG" :class="!isSubmit?'':'noClick'" @click="getCPTData">
            <img src="@/assets/images/huoqu.png" alt="" />
            <span class="text">获取CPT数据</span>
          </div>
          <!-- 提交 有数据  正常 暗 -->

          <!-- 没有提交 有数据  正常点击 -->
          <!-- 没有提交 无数据  正常 暗 -->
          <div class="TpmButtonBG" :class="!isSubmit&&!isNoData&&isSelf?'':'noClick'" @click="importData">
            <img src="@/assets/images/import.png" alt="" />
            <span class="text">导入</span>
          </div>

          <div class="TpmButtonBG" :class="!isSubmit&&!isNoData&&isSelf?'':'noClick'" @click="approve">
            <svg-icon icon-class="passLocal" style="font-size: 22px;" />
            <span class="text">提交</span>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="ContentWrap">
        <div class="contentli" v-for="(tableData,key,index) in ContentData" :key="index">
          <div class="contentTop">
            <div class="SKUTitle">
              {{key}}
            </div>
          </div>
          <div class="contentInfoWrap">
            <el-table :data="tableData" class="customTable" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" :cell-style="columnStyle" style="width: 100%">
              <el-table-column width="150" fixed>
                <template slot="header">
                  <div></div>
                </template>
                <template slot-scope="scope">
                  <div :class="scope.$index==0?'filstColumn_total':'filstColumn'">
                    <span>{{ scope.row.dimCustomer }} </span>
                    <!-- {{scope.$index}} -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
              <el-table-column align="right" width="150" prop="cptVolBox" label="CPT VOL(CTN)"></el-table-column>
              <el-table-column align="right" width="250" v-for="(citem,cindex) in Number(tableData[0].priceGearNum)" :key="cindex">
                <template slot="header">
                  {{ tableData[0].customGearList[cindex].gear }}RMB/Tin 档位销量(CTN)
                </template>
                <template slot-scope="{row}">
                  <div>
                    {{(row.customGearList[cindex].actualNum*1).toFixed(2)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="right" v-slot={row} width="250" prop="cityPlanAveragePrice" label="City Plan预拆分均价(RMB/Tin)">
                {{(row.cityPlanAveragePrice*1).toFixed(2)}}
              </el-table-column>
              <el-table-column align="right" v-slot={row} width="250" prop="cityPlanPromotionExpenses" label="City Plan预拆分费用(RMB)">
                {{(row.cityPlanPromotionExpenses*1).toFixed(2)}}
              </el-table-column>
              <el-table-column align="right" v-slot={row} width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)">
                {{(row.cptAveragePrice*1).toFixed(2)}}
              </el-table-column>
              <el-table-column align="right" v-slot={row} width="160" prop="cptPromotionExpenses" label="CPT费用(RMB)">
                {{(row.cptPromotionExpenses*1).toFixed(2)}}
              </el-table-column>
              <el-table-column align="right" v-slot={row} width="160" prop="averagePriceRangeValue" label="均价差值(%)">
                {{(row.averagePriceRange*1).toFixed(2)}}%
              </el-table-column>
              <el-table-column align="right" width="160" prop="promotionExpensesGapValue" label="费用差值(RMB)">
               
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
              <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="null_content" v-if="isNoData">
        <img src="@/assets/images/null_content.jpg" alt="">
        <div class="null_content_tit">暂无数据</div>
      </div>
      <el-dialog class="my-el-dialog" title="获取CPT数据" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
        <div class="el-dialogContent">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
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
              <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="exportData">下载模板</el-button>
              <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
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
              <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
              <el-table-column align="center" width="260" prop="dimProduct" label="SKU"></el-table-column>
              <el-table-column align="center" width="160" prop="dimCustomer" label="客户名称"></el-table-column>
              <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
              <el-table-column align="right" width="120" prop="cptVolBox" label="CPT VOL(箱)"></el-table-column>
              <el-table-column align="right" width="250" prop="cityPlanAveragePrice" label="City Plan预拆分均价(RMB/Tin)"></el-table-column>
              <el-table-column align="right" width="250" prop="cityPlanPromotionExpenses" label="City Plan预拆分费用(RMB)"></el-table-column>
              <el-table-column align="right" width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)"></el-table-column>
              <el-table-column align="right" width="160" prop="cptPromotionExpenses" label="CPT费用(RMB)"></el-table-column>
              <el-table-column align="right" v-slot={row} width="160" prop="averagePriceRangeValue" label="均价差值(%)">
                {{(row.averagePriceRange*1).toFixed(2)}}%
              </el-table-column>
              <el-table-column align="right"  width="160" prop="promotionExpensesGapValue" label="费用差值(RMB)"></el-table-column>
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
import { getDefaultPermissions, yearAndMonthList, VersionList } from '@/utils'
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
      },
      skuOptons: [],
      ContentData: [],
      ruleForm: {
        yearAndMonth: '',
        channelCode: '',
        dimScenario: '',
        dimVersion: '',
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
      yearAndMonthList: yearAndMonthList(),
      VersionList: VersionList(),
      ChannelList: [],
      backgroundList: [
        'background:#EFFCF9',
        'background:#FEF5F6',
        'background:#F0F6FC',
      ], //价格档位背景色
      isNoData: false,
      usernameLocal: '',
      mainId: '',
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannelList()
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
    getMonth() {
      API.getMonth({ version: 'V0' }).then((res) => {
        this.filterObj.month = res.data
        this.getList()
      })
    },
    getList() {
      //encodeURIComponent
      API.getList({
        yearAndMonth: this.filterObj.month,
        dimProduct: this.filterObj.SKU,
        channelCode: this.filterObj.channelCode,
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
          if(!this.$route.query.channelCode) {
            this.filterObj.channelCode=this.ChannelList[0].channelCode
          }else {
            this.filterObj.channelCode=this.$route.query.channelCode
          }
          this.getMonth()
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
              res.data.assignee === this.usernameLocal
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
      this.dialogVisible = true
      this.ruleForm.channelCode = this.filterObj.channelCode
      // API.isExist({
      //   yearAndMonth: this.filterObj.month,
      //   channelCode: this.filterObj.channelCode,
      // }).then((res) => {
      //   if (res.data) {
      //     this.$confirm('此操作将覆盖CPT数据, 是否继续?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'info',
      //     })
      //       .then(() => {
      //         this.dialogVisible = true
      //         this.ruleForm.channelCode = this.filterObj.channelCode
      //       })
      //       .catch(() => {
      //         this.$message({
      //           type: 'info',
      //           message: '已取消',
      //         })
      //       })
      //   } else {
      //     this.dialogVisible = true
      //     this.ruleForm.channelCode = this.filterObj.channelCode
      //   }
      // })
    },
    //导入数据弹窗显示
    importData() {
      this.importVisible = true
    },
    //关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn=false
    },
    //选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      this.event = event
    },
    //校验数据
    checkImport() {
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importExcel(formData).then((response) => {
        if (response.code == 1000) {
          this.ImportData = response.data
          this.saveBtn =
            response.data[0].judgmentType === 'Error' ? false : true
          //清除input的value ,上传一样的
          this.event.srcElement.value = '' // 置空
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
          this.$message.success('保存成功!')
          this.closeImportDialog()
          this.getList()
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
        }).then((res) => {
          let timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V0异常信息 -' + timestamp + '.xlsx') //自定义Excel文件名
          this.$message.success('导出成功!')
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
        }).then((res) => {
          let timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V0 -' + timestamp + '.xlsx') //自定义Excel文件名
          this.$message.success('导出成功!')
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
          API.getCPTData({
            yearAndMonth: this.filterObj.month,
            channelCode: this.ruleForm.channelCode,
            dimScenario: this.ruleForm.dimScenario,
            dimVersion: this.ruleForm.dimVersion,
          })
            .then((response) => {
              if (response.code == 1000) {
                this.$message.success('获取成功!')
                this.getList()
                this.resetForm(formName)
              }
            })
            .catch(() => {})
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
      if (
        4 <= columnIndex &&
        columnIndex < 4 + Number(row.priceGearNum) &&
        rowIndex != 0
      ) {
        return this.backgroundList[num]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.Maincontent {
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

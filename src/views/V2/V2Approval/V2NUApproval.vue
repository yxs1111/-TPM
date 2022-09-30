<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
            <span class="SelectliTitle">活动月:</span>
            <el-select v-model="filterObj.yearAndMonth" filterable clearable placeholder="请选择">
              <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
            </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌:</span>
          <el-select v-model="filterObj.brandCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
     
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" :class="!isSubmit?'':'noClick'" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" :class="!isSubmit?'':'noClick'" @click="approve(1)">
        <svg-icon icon-class="passApprove" style="font-size: 24px;" />
        <span class="text">通过</span>
      </div>
      <div class="TpmButtonBG" :class="!isSubmit?'':'noClick'" @click="approve(0)">
        <svg-icon icon-class="rejectApprove" style="font-size: 24px;" />
        <span class="text">驳回</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="150" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="MinePackage" />
      <el-table-column width="250" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="250" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="220" v-slot={row} align="right" prop="planVol" label="V1计划总销量（CTN）">
        {{FormateNum(row.planVol)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="planNewUserNum" label="目标新客数量">
        {{FormateNum(row.planNewUserNum)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="planCost" label="V1计划费用（RMB）">
        {{FormateNum(row.planCost)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="adjustedVol" label="V2预测总销量（CTN）">
        {{FormateNum(row.adjustedVol)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="adjustedNewUserNum" label="目标新客数量">
        {{FormateNum(row.adjustedNewUserNum)}}
      </el-table-column>
      <el-table-column width="220" v-slot={row} align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
        {{FormateNum(row.adjustedCost)}}
      </el-table-column>
      <el-table-column width="160" align="right" prop="averageDifference" label="均价差值（%）">
      </el-table-column>
      <el-table-column width="160" align="right" prop="achievementRate" label="达成率 (%)" />
      <el-table-column width="150" v-slot={row} align="right" prop="costDifferenceValue" label="费用差值(RMB)">
        {{FormateNum(row.costDifferenceValue)}}
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
      <el-table-column width="840" align="left" prop="judgmentContent" label="系统判定内容" />
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
            <!-- <el-button v-if="uploadFileName != ''"  type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button> -->
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
            <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">

            <div v-if="uploadFileName != ''" class="fileName">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
              <span>{{ uploadFileName }}</span>
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
            <el-table-column prop="date" fixed align="center" label="是否通过" width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
                <img v-else-if="scope.row.judgmentType.indexOf('Exception') > -1" :src="excepImg" style="width:25px;height:25px;">
                <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width:25px;height:25px;">
              </template>
            </el-table-column>
            <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
            <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
            <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
            <el-table-column width="150" align="center" prop="costTypeName" label="费用类型" />
            <el-table-column width="180" align="center" prop="minePackageName" label="MinePackage" />
            <el-table-column width="150" align="center" prop="costItemName" label="费用科目" />
            <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
            <el-table-column width="120" align="center" prop="brandName" label="品牌" />
            <el-table-column width="220" v-slot={row} align="right" prop="planVol" label="V1计划总销量（CTN）">
              {{FormateNum(row.planVol)}}
            </el-table-column>
            <el-table-column width="220" v-slot={row} align="right" prop="planNewUserNum" label="目标新客数量">
              {{FormateNum(row.planNewUserNum)}}
            </el-table-column>
            <el-table-column width="220" v-slot={row} align="right" prop="planCost" label="V1计划费用（RMB）">
              {{FormateNum(row.planCost)}}
            </el-table-column>
            <el-table-column width="220" v-slot={row} align="right" prop="adjustedVol" label="V2预测总销量（CTN）">
              {{FormateNum(row.adjustedVol)}}
            </el-table-column>
            <el-table-column width="220" v-slot={row} align="right" prop="adjustedNewUserNum" label="目标新客数量">
              {{FormateNum(row.adjustedNewUserNum)}}
            </el-table-column>
            <el-table-column width="220" v-slot={row} align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
              {{FormateNum(row.adjustedCost)}}
            </el-table-column>
            <el-table-column width="160" align="right" prop="averageDifference" label="均价差值（%）">
            </el-table-column>
            <el-table-column width="160" align="right" prop="achievementRate" label="达成率 (%)" />
            <el-table-column width="150" v-slot={row} align="right" prop="costDifferenceValue" label="费用差值(RMB)">
              {{FormateNum(row.costDifferenceValue)}}
            </el-table-column>
            <el-table-column width="120" align="center" prop="judgmentType" label="系统判定">
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
  parseTime,
  getTextMap,
  messageMap,
  formatThousandNum,
  getHeightHaveTab,
  messageObj
} from '@/utils'
import API from '@/api/V2/V2'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V2DiscountApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        channelCode: '',
        customerCode: '',
        brandCode: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      monthList: [],
      channelOptions: [],
      customerArr: [],
      dialogVisible: false,
      // 导入
      importVisible: false, // 导入弹窗
      ImportData: [],
      BrandList: [],
      uploadFileName: '',
      uploadFile: '',
      event: '',
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      usernameLocal: '',
      mainId: '',
      messageMap: messageMap(),
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getQueryChannelSelect()
    this.getCustomerList()
    this.getBrandList()
    this.getAllMonth()
  },
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerCode = ''
      this.getCustomerList()
    },
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.channelCode == ''||this.filterObj.yearAndMonth == '') {
        if (this.filterObj.yearAndMonth == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        } 
      } else {
        API.getPageNU({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.yearAndMonth,
          channelCode: this.filterObj.channelCode,
          customerName: this.filterObj.customerCode,
          brandName: this.filterObj.brandCode,
        }).then((response) => {
          this.tableData = response.data.records
          this.mainId = this.tableData[0].mainId
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          //获取提交权限
          this.infoByMainId()
        })
      }
    },
    // 通过与审批按钮控制
    infoByMainId() {
      console.log(this.mainId)
      selectAPI
        .infoByMainId({
          mainId: this.mainId,
        })
        .then((res) => {
          if (res.code === 1000) {
            if (
              res.data.version === 'NUV2' &&
              res.data.assignee.indexOf(this.usernameLocal) != -1
            ) {
              //本人可以提交
              this.isSubmit = false
            } else {
              //其他人禁用
              this.isSubmit = true
            }
          }
        })
        .catch()
    },
    getTip(row) {
      return `<div class="Tip">${row.judgmentContent}</div>`
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList=res.data
      })
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI
        .queryChannelSelect()
        .then((res) => {
          this.channelOptions = res.data
        })
        .catch()
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    // 经销商
    getDistributorList() {
      selectAPI
        .queryDistributorList()
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
        .catch()
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
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    importData() {
      if (this.filterObj.channelCode == '') {
        this.$message.info('请先选择渠道！')
      } else {
        this.importVisible = true
      }
    },

    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.saveBtn = false
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      let formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.yearAndMonth)
      formData.append('channelCode', this.filterObj.channelCode)
      API.importNUExcel(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data)||response.data.length===0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.ImportData = response.data
            this.saveBtn = this.ImportData.length ? true : false
            this.$message.success('导入成功！')
          }
        }
      })
    },
    // 关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn = false
    },
    // 校验数据
    // checkImport() {
    //   let formData = new FormData()
    //   formData.append('file', this.uploadFile)
    //   API.importNUExcel(formData).then((response) => {
    //     if (response.code == 1000) {
    //       this.ImportData = response.data
    //       this.saveBtn =
    //         response.data[0].judgmentType === 'Error' ? false : true
    //       //清除input的value ,上传一样的
    //       this.event.srcElement.value = '' // 置空
    //     }
    //   })
    // },
    // 导入--保存
    confirmImport() {
      this.closeImportDialog()
      this.getTableData()
    },
    // 导出数据
    exportExcel() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.exportNUExcel({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelCode: this.filterObj.channelCode,
          customerName: this.filterObj.customerCode,
          brandName: this.filterObj.brandCode,
        }).then((res) => {
          this.downloadFile(res, `${this.filterObj.yearAndMonth}_NU_${this.filterObj.channelCode}_V2_查询.xlsx`) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.exportNUTemplateExcel({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelCode: this.filterObj.channelCode,
          customerName: this.filterObj.customerCode,
          brandName: this.filterObj.brandCode,
        }).then((res) => {
          this.downloadFile(res, `${this.filterObj.yearAndMonth}_NU_${this.filterObj.channelCode}_V2审批.xlsx`) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    // 下载文件
    downloadFile(res, fileName) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
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
    // V0 提交审批
    approve(value) {
      if (this.tableData.length) {
        const mainId = this.tableData[0].mainId
        if (value) {
          this.$confirm('此操作将审批通过, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              API.approveNU({
                mainId: mainId, // 主表id
                opinion: 'agree', // 审批标识(agree：审批通过，reject：审批驳回)
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message({
                    type: 'success',
                    message: '审批成功!',
                  })
                  this.getTableData()
                } else {
                  this.$message({
                    type: 'info',
                    message: '审批失败!',
                  })
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
          this.$confirm('此操作将驳回审批, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              API.approveNU({
                mainId: mainId, // 主表id
                opinion: 'reject', // 审批标识(agree：审批通过，reject：审批驳回)
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('驳回审批成功!')
                  this.getTableData()
                } else {
                  this.$message.info('驳回审批失败!')
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
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
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return formatThousandNum(num)
    },
  },
}
</script>

<style lang="scss" scoped>
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .priceLevel {
      width: 88px;
      height: 34px;
      line-height: 34px;
      border-radius: 17px;
      background: #f2e9ea;
      color: #e87071 !important;
      text-align: center;
    }
    .priceCenter {
      background: #ebfbf8;
      color: #38d7b7 !important;
    }
    .priceLow {
      background: #e1edf4;
      color: #4192d3 !important;
    }
    .TotalNum {
      font-weight: bold;
      color: #ff8912;
    }
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


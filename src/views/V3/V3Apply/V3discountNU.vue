<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌:</span>
          <el-select v-model="filterObj.brandName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="getTableData">查询</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="importData">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="submitApply">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" max-height="600" style="width: 100%">
      <el-table-column align="center" width="400" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <!-- <el-table-column width="180" align="center" prop="productName" label="SKU" /> -->
      <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="220" align="center" prop="regionName" label="区域" />
      <el-table-column v-slot="{row}" width="220" align="right" prop="planSales" label="V1计划总销量（CTN）">
        {{ (row.planSales*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planNewUserNum" label="目标新客数量">
        {{ (row.planSales*1).toFixed(2) }}
      </el-table-column>
      <!-- <el-table-column v-slot="{row}" width="220" align="right" prop="planSales" label="V1计划销量（CTN）">
        {{ (row.planSales*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planPriceAve" label="V1计划均价（RMB/Tin）">
        {{ row.planPriceAve===undefined?'':(row.planPriceAve*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column v-slot="{row}" width="220" align="right" prop="planCost" label="V1计划费用（RMB）">
        {{ (row.planCost*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="forecastSales" label="V2预测总销量(CTN)">
        {{ (row.forecastSales*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedNewUserNum" label="目标新客数量">
        {{ (row.forecastSales*1).toFixed(2) }}
      </el-table-column>
      <!-- <el-table-column v-slot="{row}" width="220" align="right" prop="forecastSales" label="V2预测销量（CTN）">
        {{ (row.forecastSales*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）">
        {{ row.adjustedPriceAve===undefined?'':(row.adjustedPriceAve*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
        {{ (row.adjustedCost*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualSales" label="V3实际销量（CTN）">
        {{ (row.actualSales*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="actualNewUserNum" label="实际新客数量">
        {{ (row.actualSales*1).toFixed(2) }}
      </el-table-column>
      <!-- <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationPriceAve" label="V3谈判前均价（RMB/Tin）">
        {{ (row.beforeNegotiationPriceAve*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationCost" label="V3谈判前费用（RMB）">
        {{ (row.beforeNegotiationCost*1).toFixed(2) }}
      </el-table-column>
      <!-- <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationPriceAve" label="V3谈判后均价（RMB/Tin）">
        {{ (row.afterNegotiationPriceAve*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="afterNegotiationCost" label="V3谈判后费用（RMB）">
        {{ (row.afterNegotiationCost*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="right" prop="avePriceDifference" label="均价差值（%）" />
        <!-- {{ row.avePriceDifference + '%' }}
      </el-table-column> -->
      <!-- <el-table-column v-slot="{row}" width="160" align="right" prop="salesDifference" label="销量差值（%）">
        {{ row.salesDifference + '%' }}
      </el-table-column> -->
      <el-table-column width="160" align="right" prop="achievementRate" label="达成率（%）" />
        <!-- {{ row.salesDifference + '%' }}
      </el-table-column> -->
      <el-table-column width="150" align="right" prop="costDifference" label="费用差值(RMB)" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
      <el-table-column width="120" align="center" prop="judgmentContent" label="系统判定内容" />
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 导入 -->
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeimportDialog">
      <div class="el-downloadFileBar" style="display:flex;">
        <div>
          <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downLoadElxModel">
            下载模板
          </el-button>
          <el-button v-if="firstIsPass" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="exceptionCheck()">检测数据
          </el-button>
        </div>
        <div>
          <el-button v-if="saveBtn" type="primary" class="my-export" @click="saveImportInfo">保存
          </el-button>
        </div>
      </div>

      <div class="fileInfo" style="justify-content: space-between;">
        <div style="display: flex;">
          <div class="fileTitle" style="width:35px;line-height:40px;">文件</div>
          <el-button size="mini" class="my-search selectFile" icon="el-icon-my-file" @click="parsingExcelBtn">选择文件</el-button>
          <input ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
          <div v-if="uploadFileName!=''" class="fileName">
            <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
            <span>{{ uploadFileName }}</span>
          </div>
        </div>
        <div class="seeData" style="width: auto;">
          <div class="exportError" @click="downLoadException">
            <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon">
            <span>导出错误信息</span>
          </div>
        </div>
        <!-- <el-button v-if="uploadFileName!=''" style="line-height: 27px;color: #4192d3;border: 1px solid #4192d3;font-size:12px;padding:0 3px;margin-left:3px;" @click="confirmImport()">确定上传</el-button> -->
      </div>

      <div class="tableWrap">
        <el-table
          border
          height="400"
          :data="dialogDataF"
          style="width: 100%"
          :header-cell-style="{
            background: '#fff',
            color: '#333',
            fontSize: '16px',
            textAlign: 'center',
            fontWeight: 400,
            fontFamily: 'Source Han Sans CN'
          }"
          :row-class-name="tableRowClassName"
          stripe
        >
          <el-table-column fixed align="center" label="是否通过" width="100">
            <template slot-scope="scope">
              <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
              <img v-else-if="scope.row.judgmentType===null? false:(scope.row.judgmentType.indexOf('Exception') > -1)" :src="excepImg" style="width:25px;height:25px;">
              <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width:25px;height:25px;">
              <img v-else-if="scope.row.judgmentType===null" :src="passImg" style="width:25px;height:25px;">
              <img v-else :src="errorImg" style="width:25px;height:25px;">
            </template>
          </el-table-column>
          <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
          <el-table-column align="center" width="400" prop="cpId" label="CPID" />
          <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
          <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
          <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
          <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
          <el-table-column width="120" align="center" prop="channelName" label="渠道" />
          <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
          <el-table-column width="120" align="center" prop="brandName" label="品牌" />
          <!-- <el-table-column width="180" align="center" prop="productName" label="SKU" /> -->
          <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
          <el-table-column width="220" align="center" prop="regionName" label="区域" />
          <el-table-column v-slot="{row}" width="220" align="right" prop="planSales" label="V1计划总销量（CTN）">
            {{ (row.planSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="planNewUserNum" label="目标新客数量">
            {{ (row.planSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="planCost" label="V1计划费用（RMB）">
            {{ (row.planCost*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="forecastSales" label="V2预测总销量(CTN)">
            {{ (row.forecastSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedNewUserNum" label="目标新客数量">
            {{ (row.forecastSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedCost" label="V2调整后费用（RMB）">
            {{ (row.adjustedCost*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="actualSales" label="V3实际销量（CTN）">
            {{ (row.actualSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="actualNewUserNum" label="实际新客数量">
            {{ (row.actualSales*1).toFixed(2) }}
          </el-table-column>
          <el-table-column v-slot="{row}" width="220" align="right" prop="beforeNegotiationCost" label="V3谈判前费用（RMB）">
            {{ (row.beforeNegotiationCost*1).toFixed(2) }}
          </el-table-column>
          <el-table-column width="160" align="right" prop="avePriceDifference" label="均价差值（%）" />
            <!-- {{ row.avePriceDifference + '%' }}
          </el-table-column> -->
          <el-table-column width="160" align="right" prop="achievementRate" label="达成率（%）" />
            <!-- {{ row.salesDifference + '%' }}
          </el-table-column> -->
          <el-table-column width="150" align="right" prop="costDifference" label="费用差值(RMB)" />
          <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
          <el-table-column width="120" align="center" prop="judgmentContent" label="系统判定内容" />
          <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
          <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
          <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, messageMap } from '@/utils'
import API from '@/api/V3/v3.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V3discountNU',
  directives: { elDragDialog, permission },

  data() {
    return {
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      BrandList: [],
      btnStatus: true,
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        customerCode: '',
        brandName: ''
      },
      categoryArr: [],
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
      channelArr: [],
      customerArr: [],
      mainIdLocal: null,
      submitBtn: 1,
      importVisible: false, // 导入弹窗
      uploadFileName: '',
      uploadFile: '',
      saveBtn: false,
      dialogDataF: [],
      usernameLocal: '',
      localDate: '',
      firstIsPass: false
    }
  },
  computed: {},
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    // this.getTableData()
    this.getChannel()
    this.getBrandList()

    // this.getTableData()
    // this.getCustomerList()
    // this.getEffectiveDate()
  },
  methods: {
    // 导入文件检索后保存
    saveImportInfo() {
      API.saveImportInfoNU({
        mainId: this.mainIdLocal,
        isMakeUp: false
      }).then(res => {
        if (res.code === 1000) {
          this.$message.success('保存成功')
          this.closeimportDialog()
          // this.saveDialog = true
          this.getTableData()
        } else {
          this.$message.error('保存失败')
        }
      }).catch()
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    // 提交
    submitApply() {
      if (this.tableData[0].judgmentType === null) {
        this.$confirm('系统判定为null,不可提交?', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '好的!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.submitApplyNU({
            mainId: this.mainIdLocal
          }).then(res => {
            if (res.code === 1000) {
              this.getTableData()
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
            }
          }).catch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
      }
    },
    // 校验excel
    downLoadException() {
      API.exportV3NU({
        exportType: 'exportExceptionTemplate',
        mainId: this.mainIdLocal
      }).then(
        response => {
          const fileName = 'NU下载异常模板' + new Date().getTime() + '.xlsx'
          //   res.data:请求到的二进制数据
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel'
          }) // 1.创建一个blob
          const link = document.createElement('a') // 2.创建一个a链接
          link.download = fileName // 3.设置名称
          link.style.display = 'none' // 4.默认不显示
          link.href = URL.createObjectURL(blob) // 5.设置a链接href
          document.body.appendChild(link) // 6.将a链接dom插入当前html中
          link.click() // 7.点击事件
          URL.revokeObjectURL(link.href) // 8.释放url对象
          document.body.removeChild(link) // 9.移除a链接dom
        })
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.firstIsPass = false
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      this.formatCheck(this.uploadFile)
    },
    // 第一次检验数据
    formatCheck(file) {
      var formData = new FormData()
      formData.append('file', file)
      formData.append('mainId', this.mainIdLocal)
      formData.append('isApprove', false)
      API.formatCheckNU(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.event.srcElement.value = '' // 置空
            this.uploadFile = ''
            this.$message({
              type: 'success',
              message: messageMap().importSuccess
            })
            if (response.data != null) {
              this.dialogDataF = response.data
              this.firstIsPass = (response.data[0].judgmentType !== 'Error' && response.data[0].judgmentType !== '')
            } else {
              this.dialogDataF = []
            }
          } else {
            this.$message({
              type: 'error',
              message: messageMap().importError
            })
            this.uploadFile = ''
          }
          this.event.srcElement.value = ''
          this.uploadFile = ''
        })
        .catch(() => {
          this.event.srcElement.value = ''
          this.uploadFile = ''
          this.uploadFileName = ''
        })
    },
    // 第二次检测数据
    exceptionCheck() {
      API.exceptionCheckNU({
        mainId: this.mainIdLocal
      }).then(res => {
        if (res.code === 1000) {
          // this.uploadFileName = ''
          this.firstIsPass = false
          this.$message({
            type: 'success',
            message: messageMap().checkSuccess
          })
          if (res.data != null) {
            this.dialogDataF = res.data
            this.$forceUpdate()
            this.saveBtn = (res.data[0].judgmentType !== 'Error' && res.data[0].judgmentType !== '')
          } else {
            this.dialogDataF = []
          }
        } else {
          this.uploadFileName = ''
          this.dialogDataF = []
          this.$message({
            type: 'error',
            message: messageMap().checkError
          })
        }
      }).catch()
    },
    // 关闭导入
    closeimportDialog() {
      this.dialogDataF = []
      this.uploadFileName = ''
      this.importVisible = false
      this.supplementVisible = false
    },
    // 确认导入
    confirmImport() {
      this.dialogDataF = []
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('mainId', this.mainIdLocal)
      formData.append('isApprove', false)
      // 添加mainId
      API.importV3NU(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.event.srcElement.value = '' // 置空
            this.uploadFileName = ''
            this.uploadFile = ''
            this.$message({
              type: 'success',
              message: '检测文件上传成功'
            })
            if (response.data.length > 0) {
              // debugger
              this.dialogDataF = response.data
              this.$forceUpdate()
              this.saveBtn = (response.data[0].judgmentType !== 'Error' && response.data[0].judgmentType !== '')
            } else {
              this.dialogDataF = []
            }
          } else {
            this.$message({
              type: 'error',
              message: '检测文件上传失败，请重新上传。'
            })
          }
          this.event.srcElement.value = '' // 置空
        })
        .catch(() => {})
    },
    // 下载excel模板
    downLoadElxModel() {
      API.exportV3NU({
        exportType: 'exportTemplate',
        mainId: this.mainIdLocal,
        channelName: this.filterObj.channelCode
        // channelName: 'EC'
      }).then(
        response => {
          const fileName = 'V3-NU申请导入模板' + new Date().getTime() + '.xlsx'
          //   res.data:请求到的二进制数据
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel'
          }) // 1.创建一个blob
          const link = document.createElement('a') // 2.创建一个a链接
          link.download = fileName // 3.设置名称
          link.style.display = 'none' // 4.默认不显示
          link.href = URL.createObjectURL(blob) // 5.设置a链接href
          document.body.appendChild(link) // 6.将a链接dom插入当前html中
          link.click() // 7.点击事件
          URL.revokeObjectURL(link.href) // 8.释放url对象
          document.body.removeChild(link) // 9.移除a链接dom
        })
    },
    // 导入数据
    importData() {
      this.saveBtn = false
      this.importVisible = true
    },
    // 导出数据
    exportData() {
      // 导出数据筛选
      var data = {}
      data = {
        channelName: this.filterObj.channelCode === '' ? null : this.filterObj.channelCode,
        customerName: this.filterObj.customerCode === '' ? null : this.filterObj.customerCode,
        brandName: this.filterObj.brandName === '' ? null : this.filterObj.brandName,
        exportType: 'export',
        mainId: this.mainIdLocal
      }
      API.exportV3NU(data).then(res => {
        debugger
        res
        if (res === undefined) {
          this.$message.warning('NU-V3导出失败!')
        } else {
          this.downloadFile(res, 'V3-NU-申请Excel' + '.xlsx') // 自定义Excel文件名
          this.$message.success('NU-V3导出成功!')
        }
      }).catch()
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
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then(res => {
        if (res.code === 1000) {
          this.channelArr = res.data
          if (!this.$route.query.channelCode) {
            this.filterObj.channelCode = this.channelArr[0].channelCode
          } else {
            this.filterObj.channelCode = this.$route.query.channelCode
          }
          this.getCustomerList()
          this.getEffectiveDate()
        }
      }).catch()
    },
    // 获取年月
    getEffectiveDate() {
      selectAPI.getMonth({ version: 'V3' }).then((res) => {
        if (res.code === 1000) {
          this.localDate = res.data
          this.getTableData()
        } else {
          this.$message.warning('未查询到年月信息！')
        }
      })
    },
    // 客户
    getCustomerList() {
      this.filterObj.customerCode = ''
      selectAPI.queryCustomerList({
        channelCode: this.filterObj.channelCode
      }).then(res => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      }).catch()
    },
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageV3NU({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelName: this.filterObj.channelCode === '' ? null : this.filterObj.channelCode,
        // channelName: 'EC',
        customerName: this.filterObj.customerCode === '' ? null : this.filterObj.customerCode,
        // customerName: '京东网-POP',
        // yearAndMonth: this.localDate,
        yearAndMonth: this.localDate,
        brandName: this.filterObj.brandName === '' ? null : this.filterObj.brandName
        // brandName: 'Prestige'
      })
        .then((response) => {
          if (response.data.records.length > 0) {
            this.tableData = response.data.records
            this.mainIdLocal = response.data.records[0].mainId
            this.submitBtn = response.data.records[0].isSubmit
            this.infoByMainId()
          } else {
            this.mainIdLocal = null
            this.btnStatus = false
          }
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    // 通过与审批按钮控制
    infoByMainId() {
      API.infoByMainId({
        mainId: this.mainIdLocal
      }).then(res => {
        if (res.code === 1000) {
          if (res.data.version === 'NUV3' && res.data.assignee === this.usernameLocal && this.submitBtn === 0) {
            this.btnStatus = true
          } else {
            this.btnStatus = false
          }
        } else {
          this.btnStatus = false
        }
      }).catch()
    },
    search() {
      console.log('hh')
      // this.getTableData()
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

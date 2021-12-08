<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker disabled v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptons" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="item.distributorCode+index" :label="item.distributorName" :value="item.distributorCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptons" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" icon="el-icon-search" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG"  @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG"  @click="approve(1)">
        <svg-icon icon-class="passApprove" style="font-size: 24px;" />
        <span class="text">通过</span>
      </div>
      <div class="TpmButtonBG"  @click="approve(0)">
        <svg-icon icon-class="rejectApprove" style="font-size: 24px;" />
        <span class="text">驳回</span>
      </div>
    </div>
    <el-table  :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="150" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="MinePackage" />
      <el-table-column width="250" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="220" align="center" prop="productName" label="SKU" />
      <el-table-column width="240" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column width="220" align="center" prop="planSales" label="V1计划销量（CTN）" />
      <el-table-column width="220" align="center" prop="planPriceAve" label="V1计划均价（RMB/Tin）" />
      <el-table-column width="220" align="center" prop="planCost" label="V1计划费用（RMB）" />
      <el-table-column width="220" align="center" prop="forecastSales" label="V2预测销量（CTN）" />
      <el-table-column width="220" align="center" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）" />
      <el-table-column width="220" align="center" prop="adjustedCost" label="V2调整后费用（RMB）" />
      <el-table-column width="160" align="center" prop="avePriceDifference" label="均价差值（%）" />
      <el-table-column width="160" align="center" prop="salesDifference" label="销量差值（%）" />
      <el-table-column width="120" align="center" prop="costDifference" label="费用差值" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
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
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeimportDialog">
      <div class="el-downloadFileBar">
        <div>
          <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="exportExcel">下载模板</el-button>
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
          <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">

          <div v-if="uploadFileName != ''" class="fileName">
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
        <el-table border height="240" :data="ImportData" style="width: 100%" :header-cell-style="{
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
          <el-table-column width="220" align="center" prop="productName" label="SKU" />
          <el-table-column width="240" align="center" prop="distributorName" label="经销商" />
          <el-table-column width="120" align="center" prop="regionName" label="区域" />
          <el-table-column width="220" align="center" prop="planSales" label="V1计划销量（CTN）" />
          <el-table-column width="220" align="center" prop="planPriceAve" label="V1计划均价（RMB/Tin）" />
          <el-table-column width="220" align="center" prop="planCost" label="V1计划费用（RMB）" />
          <el-table-column width="220" align="center" prop="forecastSales" label="V2预测销量（CTN）" />
          <el-table-column width="220" align="center" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）" />
          <el-table-column width="220" align="center" prop="adjustedCost" label="V2调整后费用（RMB）" />
          <el-table-column width="160" align="center" prop="avePriceDifference" label="均价差值（%）" />
          <el-table-column width="160" align="center" prop="salesDifference" label="销量差值（%）" />
          <el-table-column width="120" align="center" prop="costDifference" label="费用差值" />
          <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
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
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/V2/V2'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V2DiscountApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '202101',
        channelCode: '',
        customerCode: '',
        distributorCode: '',
        regionCode: '',
        productCode: '',
      },
      categoryArr: [{ label: '选项一', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      skuOptons: [],
      channelOptons: [],
      customerArr: [],
      distributorArr: [],
      dialogVisible: false,
      // 导入
      importVisible: false, // 导入弹窗
      ImportData: [],
      uploadFileName: '',
      uploadFile: '',
      isSubmit: 0, // 提交状态  1：已提交，0：未提交
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
    }
  },
  computed: {},
  mounted() {
    // this.getMonth()
    this.getTableData()
    this.getQuerySkuSelect()
    this.getQueryChannelSelect()
    this.getDistributorList()
    this.getCustomerList()
  },
  watch: {
    'filterObj.channelCode'() {
      this.getCustomerList()
    }
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getPage({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        customerCode: this.filterObj.customerCode,
        distributorCode: this.filterObj.distributorCode,
        regionCode: this.filterObj.regionCode,
        productCode: this.filterObj.productCode,
      })
        .then((response) => {
          
          this.tableData = response.data.records
          if (this.tableData.length) {
              this.isSubmit = this.tableData[0].isSubmit
            } else {
              this.isSubmit = 0
            }
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    //查询列表 --获取活动年月
    getMonth() {
      selectAPI.getMonth({ version: 'V2' }).then((res) => {
        this.filterObj.yearAndMonth = res.data
        this.getTableData()
      })
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI
        .queryChannelSelect()
        .then((res) => {
          this.channelOptons = res.data
        })
        .catch()
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
    getQuerySkuSelect() {
      selectAPI
        .querySkuSelect()
        .then((res) => {
          this.skuOptons = res.data
        })
        .catch()
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    importData() {
      this.importVisible = true
    },

    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importExcel(formData).then((response) => {
        // 清除input的value ,上传一样的
        event.target.value = null
        this.$message.success('导入成功!请点击检测数据')
      })
    },
    // 关闭导入
    closeimportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    // 校验数据
    checkImport() {
      if (this.uploadFileName != '') {
        API.exceptionCheck().then((response) => {
          this.ImportData = response.data
          this.saveBtn = response.data[0].judgmentType !== 'Error'
        })
      } else {
        this.$message.error('请先选择文件再检测数据!')
      }
    },
    // 导入--保存
    confirmImport() {
      API.exceptionSave().then((res) => {
        this.$message.success('保存成功!')
        this.closeimportDialog()
        this.getTableData()
      })
    },
    // 导出异常信息
    exportErrorList() {
      API.exceptionDownExcel().then((res) => {
        const timestamp = Date.parse(new Date())
        this.downloadFile(res, 'V2异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    // 导出数据
    exportExcel() {
      // 导出数据筛选
      API.exportExcel({
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        customerCode: this.filterObj.customerCode,
        distributorCode: this.filterObj.distributorCode,
        regionCode: this.filterObj.regionCode,
        productCode: this.filterObj.productCode,
      }).then((res) => {
        const timestamp = Date.parse(new Date())
        this.downloadFile(res, 'V2-' + timestamp + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
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
              API.approve({
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
                    type: 'error',
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
              API.approve({
                mainId: mainId, // 主表id
                opinion: 'reject', // 审批标识(agree：审批通过，reject：审批驳回)
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('驳回审批成功!')
                  this.getTableData()
                } else {
                  this.$message.error('驳回审批失败!')
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
        this.$message.error('数据不能为空')
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
}
</style>

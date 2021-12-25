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
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
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
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="approve(1)">
        <svg-icon icon-class="passApprove" style="font-size: 24px;" />
        <span class="text">通过</span>
      </div>
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="approve(2)">
        <svg-icon icon-class="rejectApprove" style="font-size: 24px;" />
        <span class="text">驳回</span>
      </div>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%" max-height="500">
      <el-table-column align="center" width="400" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="280" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="180" align="center" prop="productName" label="SKU" />
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
      <el-table-column v-slot="{row}" width="160" align="right" prop="avePriceDifference" label="均价差值（%）">
        {{ row.avePriceDifference + '%' }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="160" align="right" prop="achievementRate" label="达成率（%）">
        {{ row.salesDifference + '%' }}
      </el-table-column>
      <el-table-column width="150" align="right" prop="costDifference" label="费用差值(RMB)" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
      <el-table-column width="120" align="center" prop="judgmentContent" label="系统判定内容" />
      <el-table-column width="120" align="center" prop="remark" label="申请人备注" />
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
          <!-- <el-button type="primary" plain class="my-export" icon="el-icon-odometer">
          <a href="/investCpVThreeDetail/exportException" download="exportTemplate.xlsx">检测数据</a>
        </el-button> -->
          <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="confirmImport()">检测数据
          </el-button>
        </div>
        <div>
          <el-button v-if="saveBtn" type="primary" class="my-export" icon="el-icon-odometer" @click="saveImportInfo">保存
          </el-button>
        </div>
      </div>

      <div class="fileInfo" style="justify-content: space-between;">
        <div style="display: flex;">
          <div class="fileTitle" style="width:35px;line-height:40px;">文件</div>
          <el-button size="mini" class="my-search selectFile" icon="el-icon-my-file" @click="parsingExcelBtn">选择文件</el-button>
          <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
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
          :data="dialogData"
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
          <el-table-column align="center" width="400" prop="cpId" label="CPID" />
          <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
          <el-table-column width="160" align="center" prop="costTypeName" label="费用类型" />
          <el-table-column width="180" align="center" prop="minePackageName" label="Mine Package" />
          <el-table-column width="160" align="center" prop="costItemName" label="费用科目" />
          <el-table-column width="120" align="center" prop="channelName" label="渠道" />
          <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
          <el-table-column width="120" align="center" prop="brandName" label="品牌" />
          <el-table-column width="180" align="center" prop="productName" label="SKU" />
          <el-table-column width="320" align="center" prop="distributorName" label="经销商" />
          <el-table-column width="220" align="center" prop="regionName" label="区域" />
          <el-table-column width="220" align="right" prop="planSales" label="V1计划销量（CTN）" />
          <el-table-column width="220" align="right" prop="planPriceAve" label="V1计划均价（RMB/Tin）" />
          <el-table-column width="220" align="right" prop="planCost" label="V1计划费用（RMB）" />
          <el-table-column width="220" align="right" prop="forecastSales" label="V2预测销量（CTN）" />
          <el-table-column width="220" align="right" prop="adjustedPriceAve" label="V2调整后均价（RMB/Tin）" />
          <el-table-column width="220" align="right" prop="adjustedCost" label="V2调整后费用（RMB）" />
          <el-table-column width="220" align="right" prop="actualSales" label="V3实际销量（CTN）" />
          <el-table-column width="220" align="right" prop="beforeNegotiationPriceAve" label="V3谈判前均价（RMB/Tin）" />
          <el-table-column width="220" align="right" prop="beforeNegotiationCost" label="V3谈判前费用（RMB）" />
          <el-table-column width="220" align="right" prop="afterNegotiationPriceAve" label="V3谈判后均价（RMB/Tin）" />
          <el-table-column width="220" align="right" prop="afterNegotiationCost" label="V3谈判后费用（RMB）" />
          <el-table-column width="160" align="right" prop="avePriceDifference" label="均价差值（%）" />
          <el-table-column width="160" align="right" prop="salesDifference" label="销量差值（%）" />
          <el-table-column width="120" align="right" prop="costDifference" label="费用差值" />
          <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
          <el-table-column width="120" align="center" prop="remark" label="申请人备注" />
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
import { getDefaultPermissions } from '@/utils'
import API from '@/api/V3/v3.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V3discountNUApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
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
      dialogData: [],
      btnStatus: true,
      usernameLocal: '',
      localDate: '',
      BrandList: []
    }
  },
  computed: {},
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    // this.getTableData()
    this.getChannel()
    this.getBrandList()
  },
  methods: {
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    // 通过与审批按钮控制
    infoByMainId() {
      API.infoByMainId({
        mainId: this.mainIdLocal
      }).then(res => {
        if (res.code === 1000) {
          if (res.data.version === 'NUV3' && res.data.assignee === this.usernameLocal) {
            this.btnStatus = true
          } else {
            this.btnStatus = false
          }
        }
      }).catch()
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
    getSKU() {
      selectAPI.querySkuSelect().then(res => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      }).catch()
    },
    getMP() {
      selectAPI.queryMinePackageSelect().then(res => {
        if (res.code === 1000) {
          this.channelArr = res.data
        }
      }).catch()
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
    // 经销商
    getDistributorList() {
      selectAPI.queryDistributorList().then(res => {
        if (res.code === 1000) {
          this.distributorArr = res.data
        }
      }).catch()
    },
    // 校验excel
    downLoadException() {
      API.exportV3NU({
        exportType: 'exportExceptionTemplate',
        mainId: this.mainIdLocal
      }).then(
        response => {
          const fileName = 'v3-NU校验' + new Date().getTime() + '.xlsx'
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
    // 导入文件检索后保存
    saveImportInfo() {
      API.saveImportInfoNU({
        mainId: this.mainIdLocal,
        isMakeUp: false
      }).then(res => {
        if (res.code === 1000) {
          this.closeimportDialog()
        }
        this.getTableData()
      }).catch()
    },
    // 下载excel模板
    downLoadElxModel() {
      API.exportV3NU({
        exportType: 'exportApproveTemplate',
        mainId: this.mainIdLocal,
        channelName: this.filterObj.channelCode
      }).then(
        response => {
          const fileName = 'V3-NU导入模板' + new Date().getTime() + '.xlsx'
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
    // 关闭导入
    closeimportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.dialogData = []
    },
    // 导入数据
    importData() {
      this.importVisible = true
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('mainId', this.mainIdLocal)
      formData.append('isApprove', true)
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
            if (response.data != null) {
              this.dialogData = response.data
              this.saveBtn = response.data[0].judgmentType !== 'Error'
            } else {
              this.dialogData = []
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
    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
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
      API.exportV3NU(data).then((res) => {
        if (res.code === 1000) {
          this.downloadFile(res, 'V3-NU-审批Excel' + '.xlsx') // 自定义Excel文件名
          this.$message.success('导出成功!')
        } else {
          this.$message.warning('导出失败!')
        }
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
    // 审批
    approve(val) {
      var statusLocal
      if (val === 1) {
        statusLocal = 'agree'
      } else if (val === 2) {
        statusLocal = 'reject'
      }
      this.$confirm(statusLocal === 'agree' ? '此操作将通过审批, 是否继续?' : '此操作将驳回审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.approveNU({
          mainId: this.mainIdLocal,
          state: statusLocal,
          opinion: ''
        }).then(res => {
          if (res.code === 1000) {
            this.getTableData()
            this.$message({
              type: 'success',
              message: '审批成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '审批失败!'
            })
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageV3NU({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelName: this.filterObj.channelCode === '' ? null : this.filterObj.channelCode,
        customerName: this.filterObj.customerCode === '' ? null : this.filterObj.customerCode,
        yearAndMonth: this.localDate,
        brandName: this.filterObj.brandName === '' ? null : this.filterObj.brandName
      })
        .then((response) => {
          if (response.data.records.length > 0) {
            if (response.data.records[0].isSubmit === 0) {
              this.tableData = response.data.records
            } else if (response.data.records[0].isSubmit === 1) {
              this.tableData = response.data.records
            } else {
              this.tableData = []
            }
            this.mainIdLocal = response.data.records[0].mainId
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

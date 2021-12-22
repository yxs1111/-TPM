<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <!-- <el-date-picker v-model="filterObj.custom" type="month" placeholder="请选择" /> -->
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in skuArr" :key="item.productCode+index" :label="item.productEsName" :value="item.productCode" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="getTableData">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcelInfo">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>

      </div>
      <!-- <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="getTableData">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcelInfo">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div> -->
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="importData">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" :class="btnStatus?'':'noClick'" @click="submitInfo">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="420" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="160" align="center" prop="productName" label="SKU" />
      <el-table-column width="160" align="center" prop="activityLevel" label="活动级别" />
      <el-table-column width="190" align="center" prop="priceGearAmount" label="价格档位（RMB/Tin）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="priceLevel" :class="scope.$index%3===0?'':scope.$index%3===1?'priceCenter':'priceLow'">{{ scope.row.priceGearAmount }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="totalPriceGearVol" label="价格档位销量总计（CTN）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="TotalNum">{{ scope.row.totalPriceGearVol }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="400" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column v-slot="{row}" width="220" align="right" prop="systemRecommendedVol" label="系统拆分销量（CTN）">
        {{ (row.systemRecommendedVol*1).toFixed(2) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="adjustedVol" label="调整后销量（CTN）">
        {{ (row.adjustedVol*1).toFixed(2) }}
      </el-table-column>
      <el-table-column width="220" align="right" prop="volDifference" label="销量差值（%）">
        <template slot-scope="scope">{{ scope.row.volDifference + '%' }}</template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="adjustedAmount" label="调整后费用（RMB）" />
      <el-table-column width="120" align="center" prop="mechanismType" label="机制类型" />
      <el-table-column width="120" align="center" prop="mechanismName" label="机制名称" />
      <el-table-column width="120" align="center" prop="activityTheme" label="活动主题窗口" />
      <el-table-column width="120" align="center" prop="activityDateStart" label="活动开始时间" />
      <el-table-column width="120" align="center" prop="activityDateEnd" label="活动结束时间" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定">
        <template slot-scope="{row}">
          <div v-if="row.judgmentType!== null" class="statusWrap">
            <img v-if="row.judgmentType === 'Pass'" src="../../../assets/images/success.png" alt="">
            <img v-if="row.judgmentType.indexOf('Exception') > -1" src="../../../assets/images/warning.png" alt="">
            {{ row.judgmentType }}
          </div>
          <div v-else>{{ row.judgmentType }}</div>
        </template>
      </el-table-column>
      <el-table-column width="400" align="center" prop="judgmentContent" label="审批判定内容" />
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
          <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downLoadElxModel">下载模板
          </el-button>
          <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="confirmImport()">检测数据
          </el-button>
        </div>
        <div>
          <el-button v-if="saveBtn" type="primary" plain class="my-export" @click="saveImportInfo">保存
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
          <div class="exportError" @click="exportErrorList">
            <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon">
            <span>导出错误信息</span>
          </div>
        </div>
      </div>

      <div class="tableWrap">
        <el-table
          border
          height="400"
          :data="checkedData"
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
          <el-table-column prop="date" fixed align="center" label="是否通过" width="100">
            <template slot-scope="scope">
              <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
              <img v-else-if="scope.row.judgmentType.indexOf('Exception') > -1" :src="excepImg" style="width:25px;height:25px;">
              <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width:25px;height:25px;">
            </template>
          </el-table-column>
          <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
          <el-table-column width="420" align="center" prop="cpId" label="CPID" />
          <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
          <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
          <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
          <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
          <el-table-column width="120" align="center" prop="channelName" label="渠道" />
          <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
          <el-table-column width="120" align="center" prop="brandName" label="品牌" />
          <el-table-column width="160" align="center" prop="productName" label="SKU" />
          <el-table-column width="190" align="center" prop="priceGearAmount" label="价格档位（RMB/Tin）">
            <template slot-scope="scope">
              <div class="priceLevelWrap">
                <div class="priceLevel" :class="scope.$index%3===0?'':scope.$index%3===1?'priceCenter':'priceLow'">{{ scope.row.priceGearAmount }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="220" align="center" prop="totalPriceGearVol" label="价格档位销量总计（CTN）">
            <template slot-scope="scope">
              <div class="priceLevelWrap">
                <div class="TotalNum">{{ scope.row.totalPriceGearVol }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="400" align="center" prop="distributorName" label="经销商" />
          <el-table-column width="120" align="center" prop="regionName" label="区域" />
          <el-table-column width="220" align="right" prop="systemRecommendedVol" label="系统拆分销量（CTN）" />
          <el-table-column width="220" align="right" prop="adjustedVol" label="调整后销量（CTN）" />
          <el-table-column width="220" align="right" prop="volDifference" label="销量差值（%）">
            <template slot-scope="scope">{{ scope.row.volDifference + '%' }}</template>
          </el-table-column>
          <el-table-column width="220" align="right" prop="adjustedAmount" label="调整后费用（RMB）" />
          <el-table-column width="120" align="center" prop="mechanismType" label="机制类型" />
          <el-table-column width="120" align="center" prop="mechanismName" label="机制名称" />
          <el-table-column width="120" align="center" prop="activityTheme" label="活动主题窗口" />
          <el-table-column width="120" align="center" prop="activityDateStart" label="活动开始时间" />
          <el-table-column width="120" align="center" prop="activityDateEnd" label="活动结束时间" />
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
import { getDefaultPermissions } from '@/utils'
import API from '@/api/V1/v1.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V1discountDiscount',
  directives: { elDragDialog, permission },

  data() {
    return {
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      fileList: [],
      file: undefined,
      pic: {},
      // 导入
      uploadFile: '',
      event: '',
      ImportData: [],
      uploadFileName: '',
      importVisible: false, // 导入弹窗
      filterImportData: { sku: '' }, // 筛选导入数据
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        customerCode: '',
        channelCode: '',
        distributorCode: '',
        productCode: '',
        regionName: ''
      },
      RegionList: [],
      categoryArr: [],
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
      mainIdLocal: null,
      checkedData: [],
      saveBtn: false,
      channelArr: [],
      skuArr: [],
      customerArr: [],
      distributorArr: [],
      submitBtn: 1,
      localDate: '',
      btnStatus: true,
      usernameLocal: ''
    }
  },
  computed: {},
  watch: {
    'filterObj.customerCode'() {
      this.filterObj.distributorCode = ''
      this.getDistributorList()
    },
    'filterObj.distributorCode'() {
      this.filterObj.regionName = ''
      this.getRegionList()
    }
  },
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    // this.getTableData()
    // this.getEffectiveDate()

    this.getSKU()
    this.getRegionList()
    // this.getCustomerList()
    this.getDistributorList()
  },
  methods: {
    // 获取年月
    getEffectiveDate() {
      API.getEffectiveDate({ version: 'V1' }).then((res) => {
        if (res.code === 1000) {
          this.localDate = res.data
          this.getTableData()
        } else {
          this.$message.warning('未查询到年月信息！')
        }
      })
    },
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          if(!this.$route.query.channelCode) {
            this.filterObj.channelCode = this.channelArr[0].channelEsName
          }else {
            this.filterObj.channelCode=this.$route.query.channelCode
          }
          this.getCustomerList(this.filterObj.channelCode)
          this.getEffectiveDate()
        }
      })
    },
    getRegionList() {
      selectAPI.getRegionList({
        distributorName: this.filterObj.distributorCode
      }).then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getSKU() {
      selectAPI.querySkuSelect().then((res) => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      })
    },
    // 客户
    getCustomerList() {
      this.filterObj.customerCode = ''
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelCode
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    // 经销商
    getDistributorList() {
      selectAPI.queryDistributorList({
        customerCsName: this.filterObj.customerCode
      }).then((res) => {
        if (res.code === 1000) {
          this.distributorArr = res.data
        }
      })
    },
    // 导入文件检索后保存
    saveImportInfo() {
      API.saveImportInfo({
        mainId: this.mainIdLocal
      }).then((res) => {
        if (res.code === 1000) {
          this.closeimportDialog()
          this.getTableData()
          this.$message.success('保存成功！')
        } else {
          this.$message.error('保存失败！')
        }
      })
    },
    // 导出错误信息
    exportErrorList() {
      API.exportErrorList({
        mainId: this.mainIdLocal,
        channelCode: 'NKA'
      }).then((response) => {
        const fileName = '错误信息' + new Date().getTime() + '.xlsx'
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
    // 导出excel
    exportExcelInfo() {
      API.exportExcel({
        mainId: this.mainIdLocal
      }).then((response) => {
        const fileName = '导出申请Excel' + new Date().getTime() + '.xlsx'
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
      this.importVisible = true
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('importType', 1)
      formData.append('mainId', this.mainIdLocal)
      API.importV1(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.event.srcElement.value = '' // 置空
            this.uploadFileName = ''
            this.uploadFile = ''
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            if (response.data != null) {
              this.checkedData = response.data
              this.saveBtn = response.data[0].judgmentType !== 'Error'
            } else {
              this.checkedData = []
            }
          } else {
            this.$message({
              type: 'error',
              message: '上传失败，请重新上传。'
            })
          }
          //清除input的value ,上传一样的
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
    // 关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },

    // 文件上传
    uploadFileLocal() {
      this.$refs.upload.submit()
    },
    fileChange(file, fileList) {
      // 这是关键一句
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    // 提交
    submitInfo() {
      if (this.tableData[0].judgmentType === null) {
        this.$confirm('数据未校验，请先进行导入验证', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '以确认提交'
            })
          })
          .catch(() => {
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
        })
          .then(() => {
            API.submitV1({
              mainId: this.mainIdLocal
            })
              .then((res) => {
                if (res.code === 1000) {
                  this.getTableData()
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                }
              })
              .catch()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
      }
    },
    // 下载excel模板
    downLoadElxModel() {
      API.downExcelTmpForV1({
        mainId: this.mainIdLocal,
        importType: 1,
        channelCode: 'NKA'
      }).then((response) => {
        const fileName = 'V1申请模板' + new Date().getTime() + '.xlsx'
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
    // 打开文件
    openFile(file) {
      // console.log(file)
      this.uploadFileName = file.name
      this.$refs.upload.clearFiles() // 去掉文件列表
    },
    // 关闭导入
    closeimportDialog() {
      this.importVisible = false
      this.checkedData = []
    },

    // 导出数据
    exportData() {
      // 导出数据筛选
      var data = {}
      data = { ...this.filterObj }
      API.exportV3(data).then((res) => {
        this.downloadFile(res, 'V3' + '.xlsx') // 自定义Excel文件名
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
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageV1({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelName: this.filterObj.channelCode,
        customerName: this.filterObj.customerCode,
        distributorName: this.filterObj.distributorCode,
        productName: this.filterObj.productCode,
        regionName: this.filterObj.regionName,
        yearAndMonth: this.localDate
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
          if (res.data.version === 'V1' && res.data.assignee === this.usernameLocal && this.submitBtn === 0) {
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
      this.getTableData()
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

<style>
.el-icon-my-file {
  background: url('~@/assets/images/selFile.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-file:before {
  content: '\e611';
  font-size: 16px;
}
</style>

<style>
.el-icon-my-down {
  background: url('~@/assets/images/downModel.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-down:before {
  content: '\e611';
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
::v-deep.my-el-dialog .upload-demo {
  display: flex;
  margin-top: 0px;
}
::v-deep.el-table td {
  padding: 6px 0;
}
::v-deep.el-upload-list__item:first-child {
  margin-top: 0px;
}
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .priceLevel {
      width: 60px;
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

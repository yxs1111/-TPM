<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU</span>
          <el-select v-model="filterObj.sku" filterable clearable placeholder="请选择">
            <el-option v-for="item in skuOptons" :key="item.productEsName" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG"  @click="search" v-permission="permissions['get']">查询</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" v-permission="permissions['delete']" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
      <!-- <el-button type="primary"  class="TpmButtonBG"  @click="timeOut">定时任务</el-button> -->
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
    </div>
    <el-table :data="tableData" ref="multipleTable" border max-height="600" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column width="250" fixed="left" align="center" prop="customerCsName" label="客户名称" />
      <el-table-column width="250" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="250" align="center" prop="sku" label="SKU" />
      <el-table-column width="320" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column v-slot="{ row }" width="240" align="right" prop="ptc" label="零售价｜PTC （RMB/Tin）">
        {{ FormateNum(row.ptc)}}
      </el-table-column>
      <el-table-column v-slot="{ row }" width="320" align="right" prop="ptr" label="平台进货含税价｜PTR （RMB/Tin） ">
        {{ FormateNum(row.ptr)}}
      </el-table-column>
      <el-table-column v-slot="{ row }" width="320" align="right" prop="ptw" label="经销商进货含税价｜PTW （RMB/Tin) ">
        {{ FormateNum(row.ptw)}}
      </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" v-slot="{ row }" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.substring(0, 10) : '' }}
      </el-table-column>
      <el-table-column width="150" align="center" prop="remark" label="备注" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="25%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="fileInfo ImportContent">
        <div class="fileTitle">模板</div>
        <div class="my-search selectFile" @click="exportData">
          <svg-icon icon-class="download_white" style="font-size: 16px;" />
          <span class="text">下载模板</span>
        </div>
      </div>
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <div class="my-search selectFile" @click="parsingExcelBtn">
          <img src="@/assets/images/selectFile.png" alt="" />
          <span class="text">选择文件</span>
        </div>
        <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)" />
        <div v-if="uploadFileName != ''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <div v-if="warningShow" class="warningWrap">
        <el-alert v-for="(item, index) in warningList" :key="index" :title="item" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport()">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, FormateThousandNum } from '@/utils'
import API from '@/api/masterData/mdprice.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'PriceMasterData',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        customerCode: '',
        yearAndMonth: '',
        sku: '',
        channelCode: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      customerArr: [],
      skuOptons: [],
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
      message: '',
      warningList: [],
      ChannelList: [],
      warningShow: false,
      checkArr: [], //批量删除,存放选中
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
    this.getCustomerList()
    this.getChannelList()
    this.getQuerySkuSelect()
  },
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerCode = ''
      this.getCustomerList()
    },
  },
  methods: {
    timeOut() {
      var formData = new FormData()
      formData.append('jobClassName', 'SampleJob')
      formData.append('jobGroupName', 'test')
      // formData.append('cronExpression', '0 0 2 * * ? *')
      selectAPI.timeout(formData).then((res) => {
        
      })
    },
    // 获取表格数据
    getTableData() {
      API.getPageMdprice({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        sku: this.filterObj.sku,
        channelCode: this.filterObj.channelCode,
        customerCsName: this.filterObj.customerCode,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    getQuerySkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuOptons = res.data
      })
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        this.ChannelList = res.data
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({ channelCode: this.filterObj.channelCode })
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
    //导入数据
    importData() {
      this.importVisible = true
    },
    //确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('excelFile', this.uploadFile)
      API.importMdprice(formData).then((response) => {
        if (response.code == 1000) {
          //this.closeImport()
          this.getTableData()
          this.warningShow = true
          this.warningList = response.data
          console.dir(this.warningList)
          // this.$message.success(`${response.data}`)
        }
        this.event.srcElement.value = '' // 置空
      })
    },
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.event = event
      this.uploadFile = event.target.files[0]
      this.uploadFileName = event.target.files[0].name
    },
    //关闭导入
    closeImport() {
      this.importVisible = false
      this.uploadFile = ''
      this.uploadFileName = ''
      this.event.target.value = null
      this.warningList = []
      this.warningShow = false
    },
    //导出数据
    exportData() {
      var data = {}
      data = { ...this.filterObj }
      API.exportMdprice(data).then((res) => {
        this.downloadFile(res, '价格主数据信息' + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
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
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    //多个删除
    mutidel() {
      if (this.checkArr.length === 0) return this.$message.error('请选择数据')
      else {
        const IdList = []
        this.checkArr.forEach((item) => {
          IdList.push(item.id)
        })
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.deleteMdPrice(IdList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
            this.toggleSelection()
          })
      }
    },
    //选中置空
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.checkArr = val
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
.message {
  color: #eb4f48;
  text-align: center;
  margin: 10px 0;
  white-space: normal;
}
.warningWrap {
  width: 100%;
  height: 100px;
  overflow-y: scroll;
}
</style>

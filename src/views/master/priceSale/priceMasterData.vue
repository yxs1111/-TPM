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
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData">
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="250" align="center" prop="customerCsName" label="客户名称" />
      <el-table-column width="250" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="250" align="center" prop="sku" label="SKU" />
      <el-table-column width="320" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column width="240" align="center" prop="ptc" label="零售价｜PTC （RMB/Tin）" />
      <el-table-column width="320" align="center" prop="ptr" label="平台进货含税价｜PTR （RMB/Tin） " />
      <el-table-column width="320" align="center" prop="ptw" label="经销商进货含税价｜PTW （RMB/Tin) " />
      <el-table-column width="180" v-slot="{ row }" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.substring(0, 10) : '' }}
      </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" v-slot="{ row }" align="center" prop="updateDate" label="更新时间">
        {{ row.updateDate ? row.updateDate.substring(0, 10) : '' }}
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="更新人" />
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
import { getDefaultPermissions } from '@/utils'
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
      message:'', 
      warningList: [],
      ChannelList: [],
      warningShow: false,
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
    this.getCustomerList()
     this.getChannelList()
     this.getQuerySkuSelect()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      API.getPageMdprice({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        sku: this.filterObj.sku,
        channelCode: this.filterObj.channelCode,
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
      selectAPI.queryCustomerList({}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    search() {
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
          console.log(typeof(this.warningList));
          // this.$message.success(`${response.data}`)
        }
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
  color: #EB4F48;
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

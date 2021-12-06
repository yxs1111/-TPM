// 促销计算维护
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">年月</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-input v-model="filterObj.customerCsName" placeholder="请输入" />
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" :loading="tableLoading">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" @click="exportData">
        <img src="@/assets/images/export.png" alt="">
        <span class="text">导出</span>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" stripe style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column width="150" align="center" prop="customerCsName" label="客户名称" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column width="150" align="center" prop="grossProfitPoints" label="毛利点数" />
      <el-table-column width="320" align="center" prop="dealerRebate" label="经销商返利" />
      <el-table-column width="150" align="center" prop="platformRebate" label="平台返利" />
      <el-table-column width="150" align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <div>
            {{row.createDate?row.createDate.slice(0,10):''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="150" align="center" prop="updateDate" label="更新时间">
        <template slot-scope="{row}">
          <div>
            {{row.updateDate?row.updateDate.slice(0,10):''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="updateBy" label="更新人" />
      <el-table-column width="150" align="center" prop="remark" label="备注" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="25%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div v-loading='dialogLoading' element-loading-text="正在导入">
        <div class="fileInfo ImportContent">
          <!-- <el-button type="primary" class="my-search selectFile" @click="TemplateDownload">
            <svg-icon icon-class="download_white" style="font-size: 16px;" />
            下载模板
          </el-button> -->
          <div class="fileTitle">模板</div>
          <div class="my-search selectFile" @click="TemplateDownload">
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
          <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)">
          <div class="fileName" v-if="uploadFileName!=''">
            <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
            <span>{{uploadFileName}}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmImport()">确 定</el-button>
          <el-button @click="closeImport">取 消</el-button>
        </span>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions } from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'saleComputeKeep',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        customerCsName: '',
        productEsName: '',
      },
      tableLoading: '',
      dialogLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
      event: '',
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageSaleComputeKeep({
        yearAndMonth: this.filterObj.yearAndMonth,
        customerCsName: this.filterObj.customerCsName,
        productEsName: this.filterObj.productEsName,
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    search() {
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        yearAndMonth: '',
        customerCsName: '',
        productEsName: '',
      }
      this.getTableData()
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    //确认导入
    confirmImport() {
      this.dialogLoading = true
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importSaleComputeKeep(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.$message.success('导入成功!')
            this.closeImport()
            this.getTableData()
            this.dialogLoading = false
          } else {
            var list = response.data
            let str = ''
            list.forEach((item) => {
              str += item
            })
            this.$message.error(`${str}`)
            this.dialogLoading = false
          }
        })
        .catch(() => {})
    },
    //选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    //关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' //置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    //导出数据
    exportData() {
      //导出数据筛选
      var data = {}
      data = { ...this.filterObj }
      API.exportSaleComputeKeep(data).then((res) => {
        this.downloadFile(res, '价促计算维护' + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    TemplateDownload() {
      API.SaleComputeKeepTemplateDownload().then((res) => {
        this.downloadFile(res, '价促计算维护模板' + '.xlsx') //自定义Excel文件名
        this.$message.success('下载成功!')
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

<style lang="scss" scoped></style>

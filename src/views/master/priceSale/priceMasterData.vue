
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">年月</span>
          <el-input v-model="filterObj.yearAndMonth" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称</span>
          <el-select v-model="filterObj.customerCode" placeholder="请选择">
            <el-option v-for="item in categoryArr" :key="item.name" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" :loading="tableLoading">查询</el-button>
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
      <el-table-column width="320" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column width="150" align="center" prop="ptc" label="零售价(PTC)" />
      <el-table-column width="320" align="center" prop="ptr" label="平台进货含税价(PTR)" />
      <el-table-column width="200" align="center" prop="ptw" label="经销商进货含税价(PTW)" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间" />
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="updateDate" label="更新时间" />
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
        <div class="fileTitle">文件</div>
        <el-button size="mini" class="el_user_btn user_portIn" @click="parsingExcelBtn">导入
          <i class="iconfont icon-piliangdaoru icon_font"></i>
        </el-button>
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
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions } from '@/utils'
import API from '@/api/masterData/mdprice.js'
import auth from '@/utils/auth'
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
        SKU: '',
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      checkArr: [], // 批量删除,存放选中
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
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
      API.getPageMdprice({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        customerCode: this.filterObj.customerCode,
        yearAndMonth: this.filterObj.yearAndMonth,
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
    //导入数据
    importData() {
      this.importVisible = true
    },
    //打开文件
    openFile(file) {
      console.log(file)
      this.uploadFileName = file.name
      this.uploadFile = file.raw
      this.$refs.upload.clearFiles() //去掉文件列表
    },
    //确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('excelFile', this.uploadFile)
      var that=this;
      $.ajax({
        url : 'mdprice/import',
        type : 'GET',
        async : false,
        data : formData,
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        success : function(data) {
         that.importVisible = false
         that.getTableData()
        }
    });
      // API.importMdprice(formData)
      //   .then((response) => {
      //     this.importVisible = false
      //   })
      //   .catch(() => {})
    },
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.uploadFile = event.target.files[0]
      
    },
    //关闭导入
    closeImport() {
      this.importVisible = false
    },
    //导出数据
    exportData() {
      var data = {}
      data = { ...this.filterObj }
      API.exportMdprice(data).then((res) => {
        this.downloadFile(res, '价格主数据信息' + '.xls') //自定义Excel文件名
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

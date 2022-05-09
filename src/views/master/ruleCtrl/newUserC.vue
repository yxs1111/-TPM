// 新客达成率
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
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" placeholder="请选择">
            <el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" filterable clearable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌:</span>
          <el-select v-model="filterObj.brandCode" placeholder="请选择">
            <el-option v-for="item in BrandList" :key="item.name" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
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
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" stripe style="width: 100%">
      <el-table-column width="150" align="center" prop="channelCode" label="年月" />
      <el-table-column width="150" align="center" prop="channelCsName" label="渠道" />
      <el-table-column width="150" align="center" prop="productCode" label="客户" />
      <el-table-column width="150" align="center" prop="productCsName" label="品牌" />
      <el-table-column width="150" align="center" prop="volMix" label="新客达成率" />
      <el-table-column width="150" align="center" prop="channelCode" label="创建人" />
      <el-table-column width="150" align="center" prop="channelCsName" label="创建时间" />
      <el-table-column width="150" align="center" prop="productCode" label="修改人" />
      <el-table-column width="150" align="center" prop="productCsName" label="修改时间" />
      <el-table-column width="150" align="center" prop="volMix" label="状态" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
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
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'NewUserC',
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
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      channelList: [],
      customerArr: [],
      BrandList: [],
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
    }
  },
  computed: {},
  mounted() {
    // this.getTableData()
    this.getCustomerList()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      API.getPageMdPriceGear({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    // 客户
    getCustomerList() {
      selectAPI.queryCustomerList({}).then((res) => {
        if (res.code === 1000) {
          this.customerArr = res.data
        }
      })
    },
    add() {
      this.dialogVisible = true
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
      var that = this
      $.ajax({
        url: 'mdprice/import',
        type: 'GET',
        async: false,
        data: formData,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: function (data) {
          that.importVisible = false
          that.getTableData()
        },
      })
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

<style lang="scss" scoped>
.option_box {
  display: flex;
  align-items: center;
}

.option_img {
  width: 25px;
  height: 25px;
  margin-right: 7px;
  background: url(../../../assets/images/selectError.png) no-repeat;
}

.inputStatus input {
  background: url(../../../assets/images/selectError.png) no-repeat;
}
.inputStatus div {
  background-color: blueviolet;
}
// .el-select>.el-input input{
//     display: block;
//     margin: 10px 0;
//     background: url(../../../assets/images/selectError.png) no-repeat;
//     background-position: 3px;
//     padding-left: 30px;
//     outline: none;
// }
</style>

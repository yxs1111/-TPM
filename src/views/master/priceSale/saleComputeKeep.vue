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
          <span class="SelectliTitle">渠道</span>
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="(item, index) in ChannelList" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.deleteFlag" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['有效','无效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG"  @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column width="150"  fixed="left" align="center" prop="customerCsName" label="客户名称" />
      <el-table-column width="150"  fixed="left" align="center" prop="customerMdmCode" label="客户MDM编码" />
      <el-table-column width="150" align="center" prop="channelEsName" label="渠道" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column v-slot={row} width="150" align="right" prop="grossProfitPoints" label="毛利点数">
        {{(row.grossProfitPoints*1).toFixed(4)}}
      </el-table-column>
      <el-table-column v-slot={row} width="150" align="right" prop="dealerRebate" label="经销商返利">
        {{(row.dealerRebate*1).toFixed(4)}}
      </el-table-column>
      <el-table-column v-slot={row} width="150" align="right" prop="platformRebate" label="平台返利">
        {{(row.platformRebate*1).toFixed(4)}}
      </el-table-column>
      <el-table-column prop="createBy" align="center" width="250" label="创建人"></el-table-column>
      <el-table-column v-slot={row} prop="createDate" align="center" width="160" label="创建时间">
         {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column width="250" align="center" prop="updateBy" label="修改人" />
      <el-table-column v-slot={row} width="160" align="center" prop="updateDate" label="修改时间">
         {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column v-slot={row} width="150" align="center" prop="deleteFlg" label="状态">
        {{row.deleteFlag==0?'有效':'无效'}}
      </el-table-column>
      <el-table-column width="150" align="center" prop="remark" label="备注" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
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
        <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)" />
        <div class="fileName" v-if="uploadFileName != ''">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport()">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
      <div v-if="warningShow" style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert v-for="(item, index) in warningList" :key="index" :title="item" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
    </el-dialog>
    <!-- 错误弹窗 -->
    <el-dialog width="50%" class="my-el-dialog" title="错误信息" :visible="errorVisible" @close="closeErrorDialog">
      <div style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert v-for="(item, index) in errorList" :key="index" :title="item" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions ,getHeight} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'saleComputeKeep',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        customerCode: '',
        channelCode: '',
        deleteFlag: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ChannelList: [],
      customerArr: [],
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
      event: '',
      warningList: [],
      warningShow: false,
      errorVisible: false, //错误信息弹窗
      errorList: [], //错误信息数据
      checkArr: [], //批量删除,存放选中
      maxheight: getHeight(),
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }

    this.getTableData()
    this.getChannelList()
    this.getCustomerList()
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
      API.getPageSaleComputeKeep({
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        customerCsName: this.filterObj.customerCode,
        deleteFlag: this.filterObj.deleteFlag,
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
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        this.ChannelList = res.data
      })
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
    Reset() {
      this.filterObj = {
        yearAndMonth: '',
        customerCode: '',
        channelCode: '',
      }
      this.getTableData()
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    //确认导入
    confirmImport() {
      this.warningShow = false
      this.warningList = []
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importSaleComputeKeep(formData).then((response) => {
        if (response.code === 1000) {
          this.$message.success('导入成功!')
          this.closeImport()
          this.getTableData()
        } else {
          if (typeof response.data === 'string') {
            this.$message.warning(response.data)
          } else if (response.data.length > 0) {
            this.warningShow = true
            this.warningList = response.data
          } else if (typeof response.data === 'object') {
            this.$message.error(response.data)
          }
        }
        this.event.srcElement.value = '' // 置空
      })
    },
    //选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      console.log(event)
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
      this.warningList = []
      this.warningShow = false
    },
    //关闭导入
    closeErrorDialog() {
      this.errorVisible = false
      this.errorList = []
    },
    //导出数据
    exportData() {
      //导出数据筛选
      API.exportSaleComputeKeep({
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        deleteFlag: this.filterObj.deleteFlag,
      }).then((res) => {
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
            API.DeleteSaleComputeKeep(IdList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              } else if(response.code === 1001) {
                this.errorList=response.data
                this.errorVisible=true
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
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

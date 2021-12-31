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
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptons" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptons" :key="index" :label="item.productEsName" :value="item.productEsName" />
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
    <el-table :data="tableData" max-height="500" :cell-style="columnStyle" :span-method="objectSpanMethod" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column fixed width="250" align="center" prop="productEsName" label="SKU" />
      <el-table-column width="150" align="center" prop="activityLevel" label="活动级别" />
      <el-table-column v-slot={row} width="150" align="right" prop="gear" label="档位（箱/Tin）">
        {{FormateNum(row.gear*1)}}
      </el-table-column>
      <el-table-column v-slot={row} width="150" align="right" prop="volMix" label="Vol Mix">
        {{row.volMix}}%
      </el-table-column>
      <el-table-column width="150" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="150" align="center" prop="yearAndMonth" label="年月" />
      <el-table-column width="280" align="center" prop="createBy" label="创建人" />
      <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="创建时间">
        {{row.createDate?row.createDate.substring(0,10):""}}
      </el-table-column>
      <el-table-column width="280" align="center" prop="updateBy" label="修改人" />
      <el-table-column v-slot={row} width="180" align="center" prop="updateDate" label="修改时间">
        {{row.updateDate?row.updateDate.substring(0,10):""}}
      </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{row}">
          <div>
            {{ row.state?'正常':'无效' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="exportTemplate">下载模板</el-button>
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
            <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)">
            <div class="fileName" v-if="uploadFileName!=''">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
              <span>{{uploadFileName}}</span>
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
          <el-table border height="440" :data="ImportData" style="width: 100%" :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN'
            }" :row-class-name="tableRowClassName" stripe>
            <el-table-column fixed align="center" label="是否通过" width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
                <img v-else-if="scope.row.judgmentType == 'Pass'" :src="passImg" style="width:25px;height:25px;">
              </template>
            </el-table-column>
            <el-table-column width="320" align="center" prop="error" label="错误信息" />
            <el-table-column align="center" prop="yearAndMonth" label="年月" />
            <el-table-column align="center" prop="channelCode" label="渠道" />
            <el-table-column align="center" prop="productEsName" label="SKU" />
            <el-table-column v-slot={row} width="150" align="center" prop="gear" label="档位（箱/Tin）">
              ¥{{row.gear}}
            </el-table-column>
            <el-table-column v-slot={row} width="150" align="center" prop="volMix" label="Vol Mix">
              {{row.volMix}}%
            </el-table-column>
          </el-table>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions,FormateThousandNum } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'PriceLevelKeep',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: null,
        channelCode: null,
        productCode: null,
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      skuOptons: [],
      channelOptons: [],
      // 导入
      importVisible: false, // 导入弹窗
      uploadFileName: '',
      ImportData: [],
      uploadFile: '',
      event: '',
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      spanArr: [], //行合并
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
    this.getQuerySkuSelect()
    this.getQueryChannelSelect()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      API.getPageMdPriceGear({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        productCode: this.filterObj.productCode,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.getSpanArr(this.tableData)
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
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptons = res.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导入数据
    importData() {
      this.importVisible = true
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importPriceGear(formData).then((response) => {
        if (response.code == 1000) {
          this.closeImport()
          this.$message.success('保存成功!')
          this.getTableData()
        }
      })
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      this.event = event
    },
    // 关闭导入
    closeImport() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      //清除input的value ,上传一样的
      // this.event.target.value = null
      this.ImportData = []
      this.saveBtn=''
    },
    //检测数据
    checkImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importCheck(formData).then((response) => {
        if (response.code == 1000) {
          this.ImportData = response.data
          this.saveBtn = response.data[0].judgmentType !== 'Error'
          this.event.srcElement.value = '' // 置空
        }
      })
    },
    exportErrorList() {
      API.exportPriceGearError().then((res) => {
        this.downloadFile(res, '价格档位异常信息' + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    // 导出数据
    exportData() {
      // 导出数据筛选
      API.exportPriceGear({
        yearAndMonth: this.filterObj.yearAndMonth,
        channelCode: this.filterObj.channelCode,
        productCode: this.filterObj.productCode,
      }).then((res) => {
        this.downloadFile(res, '价格档位' + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    // 下载模板
    exportTemplate() {
      API.exportTemplate().then((res) => {
        this.downloadFile(res, '价格档位模板' + '.xlsx') // 自定义Excel文件名
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
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 10) {
        return 'background:#fff!important'
      }
    },
    //合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // columnIndex === xx 找到第xx列，实现合并随机出现的行数
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
      if (columnIndex === 10) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    //合并行--导入弹窗检测数据
    objectSpanMethod_check({ row, column, rowIndex, columnIndex }) {
      // columnIndex === xx 找到第xx列，实现合并随机出现的行数
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
      if (columnIndex === 10) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    // 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (data[i].productEsName === data[i - 1].productEsName) {
            // 如果id相等就累加，并且push 0
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            // 不相等push 1
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    //格式化--千位分隔符、两位小数 
    FormateNum(num) {
     return FormateThousandNum(num)
    },
  },
}
</script>

<style lang="scss" scoped>
.importDialog {
  height: 600px;
}
</style>

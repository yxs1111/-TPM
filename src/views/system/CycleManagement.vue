<!--
 * @Description: 周期管理
 * @Date: 2022-02-28 13:50:00
 * @LastEditTime: 2022-03-01 11:53:22
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-date-picker v-model="filterObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="importData">新增</el-button>
    </div>
    <el-table :data="tableData" :max-height="maxheight" :cell-style="columnStyle" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="activityLevel" label="活动月" />
      <el-table-column width="280" align="center" prop="createBy" label="V0" />
      <el-table-column width="280" align="center" prop="createBy" label="V1" />
      <el-table-column width="280" align="center" prop="createBy" label="V2" />
      <el-table-column width="280" align="center" prop="createBy" label="V3" />
      <el-table-column width="150" align="center" prop="state" label="开启状态">
        <template slot-scope="{row}">
          <div>
            {{ row.state?'正常':'无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="开启人" />
      <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="开启时间">
        {{row.createDate?row.createDate.substring(0,10):""}}
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog width="66%" class="my-el-dialog" title="新增账期" :visible="importVisible" @close="closeImport">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="IO编码" prop="ioNumber">
            <el-input v-model="ruleForm.ioNumber" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="区域" prop="regionCode">
            <el-select v-model="ruleForm.regionCode" class="my-el-input"  clearable filterable placeholder="请选择">
              <el-option v-for="(item) in RegionList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, FormateThousandNum, getHeight } from '@/utils'
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
      saveBtn: false,
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
    this.getQuerySkuSelect()
    this.getQueryChannelSelect()
  },
  activated() {
    this.maxheight = getHeight()
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
    Reset() {
      this.filterObj = {
        yearAndMonth: null,
        channelCode: null,
        productCode: null,
      }
      this.getTableData()
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
      this.saveBtn = ''
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
        const timestamp = Date.parse(new Date())
        this.downloadFile(res, '价格档位维护-' + timestamp + '.xlsx') // 自定义Excel文件名
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
      // if (columnIndex === 0 || columnIndex === 10) {
      //   return 'background:#fff!important'
      // }
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


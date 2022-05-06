<template>
  <div class="app-container" style="border-radius: 0px;">
    <!-- 查询条件 -->
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">Product:</span>
          <el-input v-model="filterObj.product" clearable filterable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Scenario</span>
          <el-input v-model="filterObj.scenario" clearable filterable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Version:</span>
          <el-input v-model="filterObj.version" clearable filterable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Customer:</span>
          <el-input v-model="filterObj.customer" clearable filterable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Measure:</span>
          <el-input v-model="filterObj.measure" clearable filterable placeholder="请输入" />
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
      </div>
    </div>
    <div class="SelectBarWrap">
      <div class="TpmButtonBG" @click="importDataEC" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">EC Rawdata导入</span>
      </div>
    </div>
    <el-table  :max-height="maxheight" :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="230" align="center" prop="item" label="Item" />
      <el-table-column width="230" align="center" prop="dimProduct" label="Dim_Product" />
      <el-table-column width="260" align="center" prop="dimShopperType" label="Dim_Shopper_Type" />
      <el-table-column width="150" align="center" prop="dimUvType" label="Dim_UV_Type" />
      <el-table-column width="190" align="center" prop="dimBudgetOwner" label="Dim_Budget_Owner" />
      <el-table-column width="200" align="center" prop="dimScenario" label="Dim_Scenario" />
      <el-table-column width="130" align="center" prop="dimVersion" label="Dim_Version" />
      <el-table-column width="150" align="center" prop="dimCustomer" label="Dim_Customer" />
      <el-table-column width="100" align="center" prop="dimYear" label="Dim_Year" />
      <el-table-column width="360" align="center" prop="dimMeasure" label="Dim_Measure" />
      <el-table-column width="160" align="center" prop="jan" label="Jan" />
      <el-table-column width="160" align="center" prop="feb" label="Feb" />
      <el-table-column width="160" align="center" prop="mar" label="Mar" />
        <!-- {{ (row.mar*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="apr" label="Apr" />
        <!-- {{ (row.apr*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="may" label="May" />
        <!-- {{ (row.may*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="jun" label="Jun" />
        <!-- {{ (row.jun*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="jul" label="Jul" />
        <!-- {{ (row.jul*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="aug" label="Aug" />
        <!-- {{ (row.aug*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="sep" label="Sep" />
        <!-- {{ (row.sep*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="oct" label="Oct" />
        <!-- {{ (row.oct*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="nov" label="Nov" />
        <!-- {{ (row.nov*1).toFixed(2) }}
      </el-table-column> -->
      <el-table-column width="160" align="center" prop="dec" label="Dec" />
        <!-- {{ (row.dec*1).toFixed(2) }}
      </el-table-column> -->
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
    <!-- EC导入 -->
    <el-dialog width="30%" class="my-el-dialog" title="EC Rawdata导入" :visible="importVisibleEC" @close="closeImport">
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <el-button size="mini" class="my-search selectFile" @click="parsingExcelBtn">选择文件</el-button>
        <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
        <div v-if="uploadFileName!=''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="warningShow" @click="confirmImport">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
      <div v-if="warningShow" style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert
          v-for="(item, index) in warningList"
          :key="index"
          :title="item"
          style="margin-bottom:5px;"
          type="warning"
          effect="dark"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions,getHeightHaveTab } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'NKA',
  directives: { elDragDialog, permission },

  data() {
    return {
      skuArr: [],
      importVisibleEC: false,
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        product: '',
        scenario: '',
        version: '',
        customer: '',
        measure: ''
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      uploadFileName: '',
      warningShow: false,
      warningList: [],
      maxheight: getHeightHaveTab(),
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getSKU()
    this.getTableData()
  },
  methods: {
    getSKU() {
      selectAPI.querySkuSelect().then(res => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      }).catch()
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('type', 'EC')
      API.importEcRawData(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.$message.success(response.data)
            this.getTableData()
            this.closeImport()
          } else {
            // console.log('88888', typeof (response.data))
            if (typeof (response.data) === 'string') {
              this.$message.error(response.data)
            } else if (response.data.length > 0) {
              this.warningShow = true
              this.warningList = response.data
            } else if (typeof (response.data) === 'object') {
              this.$message.error(response.data)
            }
          }
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
      this.warningList = []
      this.warningShow = false
    },
    // 关闭导入
    closeImport() {
      this.importVisibleEC = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
      this.warningList = []
      this.warningShow = false
    },
    // 导入数据
    importDataEC() {
      this.importVisibleEC = true
    },
    // 获取表格数据
    getTableData() {
      
      API.getPageByDtoEC({
        product: this.filterObj.product,
        scenario: this.filterObj.scenario,
        version: this.filterObj.version,
        customer: this.filterObj.customer,
        measure: this.filterObj.measure,
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize // 每页条数
      })
        .then((response) => {
          
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    Reset() {
      this.filterObj = {
        product: '',
        scenario: '',
        version: '',
        customer: '',
        measure: ''
      }
      this.getTableData()
    },
    search() {
      this.pageNum=1
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

<style lang="scss" scoped></style>

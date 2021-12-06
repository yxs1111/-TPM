<template>
  <div class="app-container" style="border-radius: 0px;">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="TpmButtonBG" @click="importDataNKALine">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">NKALine导入</span>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="230" align="center" prop="item" label="名称" />
      <el-table-column width="230" align="center" prop="dimProduct" label="SKU" />
      <el-table-column width="150" align="center" prop="dimShopperType" label="销售商类型" />
      <el-table-column width="150" align="center" prop="dimUvType" label="UV类型" />
      <el-table-column width="190" align="center" prop="dimBudgetOwner" label="渠道" />
      <el-table-column width="200" align="center" prop="dimScenario" label="周期" />
      <el-table-column align="center" prop="dimVersion" label="版本" />
      <el-table-column width="150" align="center" prop="dimCustomer" label="经销商" />
      <el-table-column align="center" prop="dimYear" label="年" />
      <el-table-column width="360" align="center" prop="dimMeasure" label="估量" />
      <el-table-column width="100" align="center" prop="jan" label="一月" />
      <el-table-column width="100" align="center" prop="feb" label="二月" />
      <el-table-column width="100" align="center" prop="mar" label="三月" />
      <el-table-column width="100" align="center" prop="apr" label="四月" />
      <el-table-column width="100" align="center" prop="may" label="五月" />
      <el-table-column width="100" align="center" prop="jun" label="六月" />
      <el-table-column width="100" align="center" prop="jul" label="七月" />
      <el-table-column width="100" align="center" prop="aug" label="八月" />
      <el-table-column width="100" align="center" prop="aug" label="九月" />
      <el-table-column width="100" align="center" prop="oct" label="十月" />
      <el-table-column width="100" align="center" prop="nov" label="十一月" />
      <el-table-column width="100" align="center" prop="dec" label="十二月" />
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
    <el-dialog width="25%" class="my-el-dialog" title="NKA导入" :visible="importVisibleNKALine" @close="closeImport">
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
        <el-button type="primary" @click="confirmImport">确 定</el-button>
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

export default {
  name: 'NKA',
  directives: { elDragDialog, permission },

  data() {
    return {
      importVisibleNKALine: false,
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        name: '',
        key: '',
        category: ''
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      uploadFileName: ''
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
  },
  methods: {
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('type', 'NKA')
      API.importNkaRawDataGuideline(formData)
        .then((response) => {
          if (response === 1000) {
            this.$message.success(response.data)
          } else {
            this.$message.error(response.data)
          }
          this.closeImport()
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
      this.importVisibleNKALine = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    // 导入数据
    importDataNKALine() {
      this.importVisibleNKALine = true
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageByDtoNKAL({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize // 每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
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

<style lang="scss" scoped></style>

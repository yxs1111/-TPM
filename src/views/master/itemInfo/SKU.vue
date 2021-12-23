<template>
  <div class="app-container">
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">产品英文名称</span>
          <el-input v-model="filterObj.SKUEsName" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌</span>
          <el-input v-model="filterObj.brandName" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">阶段</span>
          <el-input v-model="filterObj.stage" placeholder="请输入" />
        </div>
         <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','正常']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG"  @click="search">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" max-height="600" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" fixed align="center" prop="productCode" label="产品编号">
      </el-table-column>
      <el-table-column width="360" align="center" prop="productCsName" label="产品中文名称">
      </el-table-column>
      <el-table-column width="220" align="center" prop="productEsName" label="产品英文名称">
      </el-table-column>
      <el-table-column width="340" align="center" prop="productAbbreviation" label="产品简称">
      </el-table-column>
      <el-table-column width="150" align="center" prop="category" label="品类">
      </el-table-column>
      <el-table-column width="150" align="center" prop="brand" label="品牌">
      </el-table-column>
      <el-table-column width="150" align="center" prop="series" label="系列">
      </el-table-column>
      <el-table-column width="150" align="center" prop="stage" label="阶段">
      </el-table-column>
      <!-- <el-table-column width="150" align="center" prop="pack" label="包装"> </el-table-column>
      <el-table-column width="150" align="center" prop="content" label="含量"> </el-table-column> -->
      <el-table-column width="150" align="center" prop="conversionRatio" label="大小单位转换比">
      </el-table-column>
      <el-table-column width="150" align="center" prop="largeUnit" label="大单位">
      </el-table-column>
      <el-table-column width="150" align="center" prop="largeUnitPrice" label="大单位价格">
      </el-table-column>
      <el-table-column width="150" align="center" prop="smallUnit" label="小单位">
      </el-table-column>
      <el-table-column width="150" align="center" prop="smallUnitPrice" label="小单位价格">
      </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '正常' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column width="150" align="center" prop="createBy" label="创建人"> </el-table-column>
      <el-table-column width="150" align="center" prop="createDate" label="创建时间"> </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人"> </el-table-column>
      <el-table-column width="150" align="center" prop="updateDate" label="修改时间"> </el-table-column>
      <el-table-column width="150" align="center" prop="remark" label="备注"> </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'SKU',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        SKUEsName: '',
        brandName: '',
        stage: '',
        state:'',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      API.getPageMdProduct({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        productEsName: this.filterObj.SKUEsName,
        brand: this.filterObj.brandName,
        stage: this.filterObj.stage,
        state: this.filterObj.state,
      })
        .then((response) => {
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

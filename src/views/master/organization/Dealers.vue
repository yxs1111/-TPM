<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="filterObj.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型关键词" prop="name">
        <el-input v-model="filterObj.key" placeholder="请输入模型关键词" />
      </el-form-item>
      <el-form-item label="分类" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  class="TpmButtonBG">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" prop="distributorCode" label="经销商编号"> </el-table-column>
      <el-table-column width="320" align="center" prop="distributorName" label="经销商中文名称"> </el-table-column>
      <el-table-column align="center" prop="zoneCode" label="大区"> </el-table-column>
      <el-table-column align="center" prop="regionCode" label="区域"> </el-table-column>
      <el-table-column align="center" prop="cityGroupCode" label="城市群"> </el-table-column>
      <el-table-column align="center" prop="cityCode" label="城市"> </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '正常' : '无效' }}
          </div>
        </template>
      </el-table-column>
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
  name: 'Dealers',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        name: '',
        key: '',
        category: '',
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
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
      this.tableLoading = true
      API.getPageMdDistributor({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
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
    },
  },
}
</script>

<style lang="scss" scoped></style>

<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">SKU</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">月份</span>
          <el-date-picker v-model="filterObj.month" type="month" placeholder="选择月">
          </el-date-picker>
        </div>
        <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG">查询</el-button>
      </div>
      <div class="OpertionBar">
        <div class="TpmButtonBG">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
        <div class="TpmButtonBG">
          <svg-icon icon-class="submit" />
          <span class="text">提交</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" >新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" >删除</el-button>
      <el-button type="success" icon="el-icon-plus" class="TpmButtonBG">发布</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作" width="100">
        <template slot-scope="{ row }">
          <div class="table_operation">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="brandCode" label="品牌编码"> </el-table-column>
      <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
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
  name: 'AbnormalAnalysisMonth',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        type: '',
        month: '',
        category: '',
      },
      tableLoading: '',
      categoryArr: [{ label: '19号线', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    // this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData = []
      API.getPageMdBrand({
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

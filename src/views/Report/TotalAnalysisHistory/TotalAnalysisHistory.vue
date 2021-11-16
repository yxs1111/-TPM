<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker v-model="filterObj.month" type="month" placeholder="选择月">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>

      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="0">V1</el-checkbox>
          <el-checkbox label="1">V2</el-checkbox>
          <el-checkbox label="2">V3谈判前</el-checkbox>
          <el-checkbox label="3">V3谈判后 </el-checkbox>
          <el-checkbox label="4">价格执行率1#V3谈判前 VS V1</el-checkbox>
          <el-checkbox label="5">价格执行率2#V3谈判后 VS V1</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-button type="primary" class="TpmButtonBG my-search">查询</el-button>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Date</span>
      </div>
      <div class="TpmButtonBG">
        <img src="../../../assets/images/downloadIcon.png" alt="">
        <span class="text">下载报表</span>
      </div>
    </div>
    <div class="tableContentWrap">
      <el-table :data="tableData" v-loading="tableLoading" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName" :cell-style="columnStyle" height="550"
        style="width: 100%">
        <el-table-column width="150" fixed>
          <template slot="header">
            <div class="filstColumn">RMB/tin</div>
          </template>
          <template slot-scope="scope">
            <div class="filstColumn">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="202010">
          <el-table-column align="center" width="150" prop="name" label="Total">
            <el-table-column v-for="(item, index) in tableOption" width="250" :key="index" :label="item.label" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.tableOption[index].value}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" width="150" prop="name" label="孩子王">
            <el-table-column v-for="(item, index) in tableOption" width="250" :key="index" :label="item.label" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.tableOption[index].value}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

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
  name: 'AbnormalAnalysisHistoryByChannel',

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
      //表格列
      tableOption: [
        { label: 'V1' },
        { label: 'V2' },
        { label: 'V3谈判前' },
        { label: 'V3谈判后' },
        { label: '价格执行率1# V3谈判前  VS  V1' },
        { label: '价格执行率1# V3谈判后  VS  V1' },
      ],
      tableData: [
        {
          id: '12987122',
          name: 'Total',
          number: '234',
          channel: 'NKA',
          amount3: 10,
          tableOption: [
            { value: 74 },
            { value: 21 },
            { value: 42 },
            { value: 31 },
            { value: 56 },
            { value: 75 },
          ],
        },
        {
          id: '12987122',
          name: '王小虎',
          number: '234',
          channel: 'NKA',
          amount3: 10,
          tableOption: [
            { value: 74 },
            { value: 21 },
            { value: 42 },
            { value: 31 },
            { value: 56 },
            { value: 75 },
          ],
        },
        {
          id: '12987123',
          name: '王小虎',
          number: '165',
          channel: 'NKA',
          amount3: 12,
          tableOption: [
            { value: 86 },
            { value: 91 },
            { value: 92 },
            { value: 89 },
            { value: 80 },
            { value: 94 },
          ],
        },
      ],
      checkList: ['0', '1'],
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
      // this.getTableData()
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
      if (rowIndex == 0) {
        return 'TotalRow'
      }
    },
    //表格头样式
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
        return 'headerStyle'
      }
    },
    //列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex !== 0) {
        return 'background:#4192d3;color: #fff'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  .checkBoxWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .checkBox {
      display: flex;
      align-items: center;
    }
    .checkBoxTitle {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #4d4d4d;
      margin-right: 20px;
    }
    .my-search {
      margin-left: 30px;
    }
  }
  .tableContentWrap {
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
  }
  .TopBar {
    display: flex;
    align-items: center;
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
  }
  .filstColumn {
    text-align: center;
  }
}
</style>
<style>
.headerStyle {
  background-color: #4192d3 !important;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
}
.TotalRow {
  background-color: #f3f7f8 !important;
  color: #666;
  font-size: 14px;
}
</style>




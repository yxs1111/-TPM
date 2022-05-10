<template>
  <div class="app-container">
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">经销商CP编码</span>
          <el-input v-model="filterObj.distributorCode" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商名称</span>
          <el-input v-model="filterObj.Distributor" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" prop="distributorCode" label="经销商CP编码"> </el-table-column>
      <el-table-column align="center" prop="distributorMdmCode" label="经销商MDM编码"> </el-table-column>
      <el-table-column align="center" prop="distributorName" label="经销商名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="有效性">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
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
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  getHeight,
  downloadFile
} from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'Dealers',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        distributorCode: '',
        Distributor: '',
        state: 1,
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      maxheight: getHeight(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      API.getPageMdDistributor({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        distributorName: this.filterObj.Distributor,
        distributorCode: this.filterObj.distributorCode,
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
    Reset() {
      this.filterObj = {
        distributorCode: '',
        Distributor: '',
        state: 1,
      }
      this.getTableData()
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('distributorName', this.filterObj.Distributor)
      formData.append('distributorCode', this.filterObj.distributorCode)
      formData.append('state', this.filterObj.state)
      API.exportDistributor(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '经销商 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
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

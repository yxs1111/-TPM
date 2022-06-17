<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">大区</span>
          <el-input v-model="filterObj.zone" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域</span>
          <el-input v-model="filterObj.region" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">城市群</span>
          <el-input v-model="filterObj.cityGroup" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">城市</span>
          <el-input v-model="filterObj.name" clearable placeholder="请输入" />
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
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column  align="center" prop="zoneAbridge" label="大区编码"> </el-table-column>
      <el-table-column  align="center" prop="zone" label="大区"> </el-table-column>
      <el-table-column  align="center" prop="regionAbridge" label="区域编码"> </el-table-column>
      <el-table-column  align="center" prop="region" label="区域"> </el-table-column>
      <el-table-column  align="center" prop="cityGroupAbridge" label="城市群编码"> </el-table-column>
      <el-table-column  align="center" prop="cityGroup" label="城市群"> </el-table-column>
      <el-table-column align="center" prop="nameAbridge" label="城市编码" > </el-table-column>
      <el-table-column align="center" prop="name" label="城市" > </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" > </el-table-column>
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
import { getDefaultPermissions, parseTime, getTextMap,getHeight,downloadFile } from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'Channel',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        zone: '',
        region: '',
        cityGroup: '',
        name: '',
        state: '',
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
      API.getOrgPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        zone: this.filterObj.zone,
        region: this.filterObj.region,
        cityGroup: this.filterObj.cityGroup,
        name: this.filterObj.name,
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
        zone: '',
        region: '',
        cityGroup: '',
        name: '',
        state: '',
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
      formData.append('zone', this.filterObj.zone)
      formData.append('region', this.filterObj.region)
      formData.append('cityGroup', this.filterObj.cityGroup)
      formData.append('name', this.filterObj.name)
      API.exportOrg(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '销售架构 -' + timestamp + '.xlsx') //自定义Excel文件名
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

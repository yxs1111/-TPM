<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">接口名称</span>
          <el-select v-model="filterObj.interfaceName" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">更新时间</span>
          <el-date-picker v-model="filterObj.invokeDateSting" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column align="center" prop="interfaceName" label="接口名称"> </el-table-column>
      <el-table-column align="center" prop="upstreamData" label="表名"> </el-table-column>
      <el-table-column v-slot={row} align="center" prop="invokeDate" label="更新时间">
         {{ row.createDate ? row.createDate.replace("T"," ") : '' }}  
      </el-table-column>
      <el-table-column align="center" prop="success" label="是否成功"> </el-table-column>
      <el-table-column align="center" prop="dataNum" label="数据条数"> </el-table-column>
      <!-- <el-table-column align="center" prop="inData" label="接口参数"> </el-table-column> -->
      <el-table-column align="center" prop="details" label="详情(失败原因)"> </el-table-column>
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
  getHeightSingle,
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'MonitoringManagement',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        interfaceName: '',
        invokeDateSting: '',
      },
      permissions: getDefaultPermissions(),
      InterfaceList: [],
      tableData: [],
      dialogVisible: false,
      maxheight: getHeightSingle(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    this.getTableData()
    this.getInterfaceList()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getMdDataInterface({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        interfaceName: this.filterObj.interfaceName,
        invokeDateSting: this.filterObj.invokeDateSting,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getInterfaceList() {
      API.getInterfaceList({
      }).then((response) => {
        this.InterfaceList = response.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        interfaceName: '',
        invokeDateSting: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('interfaceName', this.filterObj.interfaceName)
      formData.append('invokeDateSting', this.filterObj.invokeDateSting)
      API.exportMdDataInterface(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '监控管理 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    handleSelectionChange(val) {
      this.checkArr = val
      console.log(val)
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

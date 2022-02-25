<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">门店名称</span>
          <el-input v-model="filterObj.StoreName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称</span>
          <el-input v-model="filterObj.customerName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商名称</span>
          <el-input v-model="filterObj.distributorName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelList" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','正常']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG"  @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="storeCode" label="门店编码"> </el-table-column>
      <el-table-column width="250" align="center" prop="storeName" label="门店名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="channelCode" label="渠道名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="customerCode" label="客户编码"> </el-table-column>
      <el-table-column width="150" align="center" prop="customerCsName" label="客户名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="distributorCode" label="经销商编码"> </el-table-column>
      <el-table-column width="340" align="center" prop="distributorName" label="经销商名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="orgCode" label="城市编码"> </el-table-column>
      <el-table-column width="150" align="center" prop="orgName" label="城市名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="isFmc" label="IsFMC "> </el-table-column>
      <el-table-column width="150" align="center" prop="fmcCode" label="FMC编码"> </el-table-column>
      <el-table-column width="150" align="center" prop="fmcName" label="FMC名称"> </el-table-column>
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
import { getDefaultPermissions, parseTime, getTextMap,getHeight,downloadFile } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'Store',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        StoreName: '',
        customerName: '',
        distributorName: '',
        channelCode: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      channelList: [],
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
    this.getQueryChannelSelect()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageMdStore({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        StoreName: this.filterObj.StoreName,
        customerCsName: this.filterObj.customerName,
        distributorName: this.filterObj.distributorName,
        channelCode: this.filterObj.channelCode,
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
        StoreName: '',
        customerName: '',
        distributorName: '',
        channelCode: '',
        state: '',
      }
      this.getTableData()
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelList = res.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('StoreName', this.filterObj.StoreName)
      formData.append('customerCsName', this.filterObj.customerName)
      formData.append('distributorName', this.filterObj.distributorName)
      formData.append('channelCode', this.filterObj.channelCode)
      formData.append('state', this.filterObj.state)
      API.exportStore(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        // this.downloadFile(res, '渠道 -' + timestamp + '.xlsx') //自定义Excel文件名
        downloadFile(res,'门店 -' + timestamp + '.xlsx')
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

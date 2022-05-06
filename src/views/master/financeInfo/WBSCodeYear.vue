<!--
 * @Description: 
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-05-06 16:07:31
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column  align="center" prop="yearId" label="YearId"> </el-table-column>
      <el-table-column  align="center" prop="yearValue" label="YearValue"> </el-table-column>
      <el-table-column  align="center" prop="createBy" label="创建人" />
      <el-table-column  align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <div>
            {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column  align="center" prop="updateBy" label="更新人" />
      <el-table-column  align="center" prop="updateDate" label="更新时间">
        <template slot-scope="{row}">
          <div>
            {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
      <el-table-column  align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
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
import { getDefaultPermissions, getHeight } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'WBSCodeYear',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {},
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
  watch: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageYearWbs({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {}
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

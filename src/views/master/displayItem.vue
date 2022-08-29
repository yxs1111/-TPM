<!--
 * @Description: 
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-08-11 11:31:45
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package</span>
          <el-select
            v-model="filterObj.minePackage"
            @change="
              getCostItemList(
                minePackageList.filter(
                  (item) => filterObj.minePackage === item.name
                )[0].code
              )
            "
            class="my-el-input"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in minePackageList"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Item</span>
          <el-select
            v-model="filterObj.costItem"
            class="my-el-input"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in CostItemList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">业务细项</span>
          <el-input
            v-model="filterObj.item"
            class="my-el-input"
            clearable
            placeholder="请输入"
          />
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search"
          >查询</el-button
        >
        <el-button type="primary" class="TpmButtonBG" @click="Reset"
          >重置</el-button
        >
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      :max-height="maxheight"
      :header-cell-style="HeadTable"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column fixed align="center" label="操作" width="220">
        <template slot-scope="scope">
          <div class="table_operation">
            <div
              class="haveText_editor"
              v-show="isEditor === scope.$index"
              @click="saveRow(scope.row, scope.$index)"
            >
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div
              class="haveText_editor"
              v-show="isEditor !== scope.$index"
              @click="editorRow(scope.$index, scope.row)"
            >
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div
              class="haveText_editor"
              v-show="isEditor === scope.$index"
              @click="CancelEditorRow(scope.$index)"
            >
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="minePackage"
        label="Mine Package"
      >
      </el-table-column>
      <el-table-column width="180" align="center" prop="itemId" label="ID">
      </el-table-column>
      <el-table-column width="260" align="center" prop="item" label="业务细项">
      </el-table-column>
      <el-table-column
        width="280"
        align="center"
        prop="costItem"
        label="Cost Item"
        v-slot="scope"
      >
        <el-select
          v-if="isEditor === scope.$index"
          v-model="scope.row.costItem"
          class="my-el-input"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in CostItemList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span v-if="isEditor !== scope.$index">{{ scope.row.costItem }}</span>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="updateBy"
        label="修改人"
      >
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        width="180"
        align="center"
        prop="updateDate"
        label="修改时间"
      >
        {{ row.updateDate ? row.updateDate.replace('T', ' ') : '' }}
      </el-table-column>
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
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, getHeight, downloadFile } from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'displayItem',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        minePackage: '',
        costItem: '',
        item: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      CostItemList: [],
      minePackageList: [
        {
          name: 'Display',
          code: 'E',
        },
        {
          name: 'POSM',
          code: 'D',
        },
      ],
      isEditor: '',
      editorId: '',
      checkArr: [], //批量删除,存放选中
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
      API.getDisplayItem({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        ...this.filterObj,
      }).then((response) => {
        this.tableData = response.data.records
        this.total = response.data.total
      })
    },
    getCostItemList(code) {
      API.getCostItemList({
        minePackageCode: code,
      }).then((res) => {
        if (res.code === 1000) {
          this.filterObj.costItem = ''
          this.CostItemList = res.data
        }
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        minePackage: '',
        costItem: '',
        item: '',
        state: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportDisplayItem({
        ...this.filterObj,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Display Item-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    checkSelectable(row) {
      return row.state === 1
    },
    saveRow(row, index) {
      API.updateDisplayItem({
        id: row.id,
        costItem: row.costItem,
      }).then((response) => {
        if (response.code === 1000) {
          this.isEditor = ''
          this.$message.success(`保存成功`)
          this.getTableData()
        }
      })
    },
    editorRow(index, row) {
      const code = this.minePackageList.filter(
        (item) => row.minePackage === item.name
      )[0].code
      this.getCostItemList(code)
      this.isEditor = index
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      this.isEditor = ''
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

<style lang="scss" scoped>
//自定义el-input
.my-el-input {
  width: 180px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 180px !important;
  }
  .el-input--suffix {
    width: 180px !important;
  }
}
.svgIcon {
  width: 20px;
  height: 20px;
}
.message {
  color: #eb4f48;
  text-align: center;
  margin: 10px 0;
  white-space: normal;
}
.warningWrap {
  width: 100%;
  height: 300px;
  overflow-y: auto;
}
.tip {
  color: #666;
  font-size: 14px;
}
.tipStar {
  color: #eb4f48;
}
</style>
<style lang="scss">
.mutiInput {
  width: 300px !important;
  border-radius: 5px;
  margin-right: 20px;
  .el-input__inner {
    height: 37px;
    width: 300px !important;
  }
  .el-input--suffix {
    width: 300px !important;
  }
}
</style>

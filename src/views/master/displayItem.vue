<!--
 * @Description:
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-09-09 15:26:07
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">Cost Type:</span>
          <el-select v-model="filterObj.CostTypeIndex" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in CostTypeList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package:</span>
          <el-select v-model="filterObj.MinePackageIndex" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Item</span>
          <el-select v-model="filterObj.costItem" class="my-el-input" filterable clearable placeholder="请选择">
            <el-option v-for="item in CostItemList" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">业务细项</span>
          <el-input v-model="filterObj.item" class="my-el-input" clearable placeholder="请输入" />
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column fixed align="center" label="操作" width="220">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_editor" v-show="isEditor === scope.$index" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-show="isEditor !== scope.$index" @click="editorRow(scope.$index, scope.row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="isEditor === scope.$index" @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="minePackage" label="Mine Package">
      </el-table-column>
      <el-table-column width="180" align="center" prop="itemId" label="ID">
      </el-table-column>
      <el-table-column width="260" align="center" prop="item" label="业务细项">
      </el-table-column>
      <el-table-column width="280" align="center" prop="costItem" label="Cost Item" v-slot="scope">
        <el-select v-if="isEditor === scope.$index" v-model="scope.row.costItem" class="my-el-input" filterable clearable placeholder="请选择">
          <el-option v-for="item in CostItemList" :key="item" :label="item" :value="item" />
        </el-select>
        <span v-if="isEditor !== scope.$index">{{ scope.row.costItem }}</span>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人">
      </el-table-column>
      <el-table-column v-slot="{ row }" width="180" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace('T', ' ') : '' }}
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
import { getDefaultPermissions, getHeight2, downloadFile } from '@/utils'
import API from '@/api/masterData/masterData.js'
import item from '@/layout/components/Sidebar/Item'
import selectAPI from '@/api/selectCommon/selectCommon'
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
        // MinePackageIndex: '',
        item: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      CostItemList: [],
      CostTypeList: [],
      minePackageList: [],
      isEditor: '',
      editorId: '',
      checkArr: [], //批量删除,存放选中
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      maxheight: getHeight2(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight2()
      })()
    }
    this.getTableData()
    this.getCostTypeList()
    this.getMinePackageSelect()
    this.getCostItemList()
  },
  computed: {},
  watch: {
    'filterObj.CostTypeIndex'(value) {
      if(value!=='') {
        this.filterObj.CostType=this.CostTypeList[this.filterObj.CostTypeIndex].costTypeNumber
        this.filterObj.CostTypeName=this.CostTypeList[this.filterObj.CostTypeIndex].costType
      } else {
        this.filterObj.CostTypeName = ''
      }
      this.filterObj.MinePackageName = ''
      this.getMinePackageSelect(this.filterObj.CostTypeName)
    },
    'filterObj.MinePackageIndex'(value) {
      if(value!=='') {
        this.filterObj.MinePackageName=this.minePackageList[this.filterObj.MinePackageIndex].costType
        this.filterObj.MinePackage=this.minePackageList[this.filterObj.MinePackageIndex].costTypeNumber
      } else {
        this.filterObj.MinePackage = ''
      }
      this.filterObj.costItem = ''
      this.getCostItemList(this.filterObj.MinePackage)
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getDisplayItem({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        minePackage: this.filterObj.MinePackageName,
        // ...this.filterObj,
        costItem: this.filterObj.costItem,
        item: this.filterObj.item,
      }).then((response) => {
        this.tempObj.tempInfo = null
        this.tableData = response.data.records
        // this.tableData.minePackageCode = response.data.records
        this.total = response.data.total
      })
    },
    getCostItemList(minePackage) {
      selectAPI.getCostItemList({ minePackage }).then((res) => {
        if (res.code === 1000) {
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
      this.getCostItemList(this.tableData[index].minePackageCode)
      if (this.tempObj.tempInfo) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      //存放临时数据，用于取消编辑时重置
      this.tempObj.rowIndex = index
      this.tempObj.tempInfo = { ...this.tableData[index] }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => {
        item.isEditor = 0
      })
      // const code = this.minePackageList.filter(
      //   (item) => row.minePackage === item.costType
      // )[0].code
      // this.minePackageList.forEach((item) => {
      //   if (row.minePackage === item.costType) {
      //     console.log(item.costTypeNumber)
      //   }
      // })
      console.log(this.minePackageList)
      this.isEditor = index
      this.$forceUpdate()
      console.log(
        '点击编辑',
        this.tempObj.tempInfo,
        this.tempObj.rowIndex,
        this.minePackageList
      )
    },
    getCostTypeList() {
      selectAPI
        .getCostTypeList({
          costLevel: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.CostTypeList = res.data
          }
        })
    },
    getMinePackageSelect() {
      selectAPI
        .queryMinePackageSelect({
          parentId: this.filterObj.CostType,
        })
        .then((res) => {
          if (res.code == 1000) {
            this.minePackageList = res.data
            this.getCostItemList(this.filterObj.minePackage)
          }
        })
    },
    CancelEditorRow(index) {
      this.isEditor = ''
      this.tableData[index] = this.tempObj.tempInfo
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

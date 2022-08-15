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
          <el-select v-model="filterObj.minePackageCode" @change="getCostItemList" class="my-el-input" filterable clearable placeholder="请选择">
            <el-option v-for="item in minePackageList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Item</span>
          <el-select v-model="filterObj.costItem" class="my-el-input" filterable clearable placeholder="请选择">
            <el-option v-for="item in CostItemList" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">item</span>
          <el-input v-model="filterObj.item" class="my-el-input" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" clearable class="my-el-input" filterable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
      <el-table-column fixed align="center" label="操作" width="220">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isEditor" @click="editorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor " @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="minePackage" label="Mine Package"> </el-table-column>
      <el-table-column width="180" align="center" prop="itemId" label="ID"> </el-table-column>
      <el-table-column v-slot={row} width="260" align="center" prop="item" label="Item">
        <el-input v-if="row.isEditor" v-model="row.item" class="my-el-input" clearable placeholder="请输入" />
        <span v-if="!row.isEditor">{{row.item}}</span>
      </el-table-column>
      <el-table-column width="280" align="center" prop="costItem" label="Cost Item"> </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人"> </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.replace("T"," ") : '' }} </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人"> </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
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
    <el-dialog class="my-el-dialog" title="新增DisplayItem" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="el-form-row">
          <el-form-item label="Mine Package" prop="minePackageIndex">
            <el-select v-model="ruleForm.minePackageIndex" @change="getCostItemListDialog" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in minePackageList" :key="index" :label="item.name" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="Cost Item" prop="costItem">
            <el-select v-model="ruleForm.costItem" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item in CostItemListDialog" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="Item" prop="item">
            <el-input v-model="ruleForm.item" class="my-el-input" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="ruleForm.state" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>
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
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'displayItem',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        minePackageCode: '',
        costItem: '',
        item: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      CostItemList: [],
      CostItemListDialog: [],
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
      ruleForm: {
        minePackageCode: '',
        minePackageIndex: '',
        costItem: '',
        item: '',
        state: '',
      },
      rules: {
        minePackageIndex: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        costItem: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        item: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        state: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      isEditor: '',
      editorId: '',
      checkArr: [], //批量删除,存放选中
      maxheight: getHeight(),
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
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
    this.getCostItemList()
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
        minePackageCode: this.filterObj.minePackageCode,
        costItem: this.filterObj.costItem,
        item: this.filterObj.item,
        state: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.isEditor = 0
        })
        this.tableData = list
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getCostItemList() {
      API.getCostItemList({
        minePackageCode: this.filterObj.minePackageCode,
      }).then((res) => {
        if (res.code === 1000) {
          this.filterObj.costItem=''
          this.CostItemList = res.data
        }
      })
    },
    getCostItemListDialog() {
      API.getCostItemList({
        minePackageCode:
          this.minePackageList[this.ruleForm.minePackageIndex].code,
      }).then((res) => {
        if (res.code === 1000) {
          this.ruleForm.costItem=''
          this.CostItemListDialog = res.data
        }
      })
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        minePackageCode: '',
        costItem: '',
        item: '',
        state: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportDisplayItem({
        minePackageCode: this.filterObj.minePackageCode,
        costItem: this.filterObj.costItem,
        item: this.filterObj.item,
        state: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Display Item-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        minPackageCode: '',
        displayItem: '',
        costItem: '',
        state: '',
      }
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.addDisplayItem({
            minePackage:
              this.minePackageList[this.ruleForm.minePackageIndex].name,
            item: this.ruleForm.item,
            costItem: this.ruleForm.costItem,
            state: this.ruleForm.state,
          }).then((res) => {
            this.getTableData()
            this.resetForm(formName)
            this.$message.success('添加成功')
          })
        } else {
          this.$message.error('提交失败')
          return false
        }
      })
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    //多个删除
    mutidel() {
      if (this.checkArr.length === 0) return this.$message.error('请选择数据')
      else {
        const IdList = []
        this.checkArr.forEach((item) => {
          IdList.push(item.id)
        })
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.deleteDisplayItem(IdList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    checkSelectable(row) {
      return row.state===1
    },
    saveRow(row, index) {
      API.updateDisplayItem({
        id: row.id,
        item:row.item
      }).then((response) => {
        if (response.code === 1000) {
          this.$message.success(`保存成功`)
          this.getTableData()
        }
      })
    },
    editorRow(index) {
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
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      this.tableData[index].isEditor = 0
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

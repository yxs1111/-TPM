<!--
 * @Description: 
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-04-26 08:42:39
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">Entity Name</span>
          <el-input v-model="filterObj.entityName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Entity ID</span>
          <el-input v-model="filterObj.entityID" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Profit Center</span>
          <el-input v-model="filterObj.profitCenter" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']" >
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add" v-permission="permissions['insert']">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作" width="100">
        <template slot-scope="{ row }">
          <div class="table_operation" v-permission="permissions['update']">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="entityName" label="Entity Name"> </el-table-column>
      <el-table-column width="220" align="center" prop="entityID" label="Entity ID"> </el-table-column>
      <el-table-column width="220" align="center" prop="profitCenter" label="Profit Center"> </el-table-column>
      <el-table-column width="220" align="center" prop="expiryDate" label="有效期至">
        <template slot-scope="{row}">
          <div>
            {{ row.expiryDate ? row.expiryDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <div>
            {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="更新人" />
      <el-table-column width="180" align="center" prop="updateDate" label="更新时间">
        <template slot-scope="{row}">
          <div>
            {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
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
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + 'WBS Code-Entity'" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="Entity ID" prop="entityID" v-if="isEditor">
            <el-input v-model="ruleForm.entityID" disabled class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="Entity ID" prop="entityID" v-if="!isEditor">
            <el-input v-model="ruleForm.entityID" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="Entity Name" prop="entityName">
            <el-input v-model="ruleForm.entityName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="Profit Center" prop="profitCenter">
            <el-input v-model="ruleForm.profitCenter" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="Profit Center" prop="expiryDate">
            <el-date-picker v-model="ruleForm.expiryDate" class="my-el-input" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
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
  name: 'WBSCodeEntity',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        entityName: '',
        entityID: '',
        profitCenter: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        entityID: '',
        entityName: '',
        profitCenter: '',
        expiryDate: '',
      },
      rules: {
        entityID: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        entityName: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        profitCenter: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        expiryDate: [
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
      ChannelList: [],
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
      API.getPageEntityWbs({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        entityName: this.filterObj.entityName, 
        entityID: this.filterObj.entityID, 
        profitCenter: this.filterObj.profitCenter, 
        state: this.filterObj.state, 
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.ChannelList = res.data
        }
      })
    },
    add() {
      this.ruleForm = {
        entityID: '',
        entityName: '',
        profitCenter: '',
        expiryDate: '',
      }
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        entityName: '',
        entityID: '',
        profitCenter: '',
        state: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportEntityWbs({}).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'WBS Code - Entity -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        entityID: '',
        entityName: '',
        profitCenter: '',
        expiryDate: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        entityID: obj.entityID,
        entityName: obj.entityName,
        profitCenter: obj.profitCenter,
        expiryDate: obj.expiryDate,
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEditor) {
            API.updateEntityWbs({
              id: this.editorId,
              entityName: this.ruleForm.entityName,
              profitCenter: this.ruleForm.profitCenter,
              expiryDate: this.ruleForm.expiryDate,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`修改成功`)
                this.resetForm(formName)
                this.getTableData()
              }
            })
          } else {
            API.insertEntityWbs({
              id: this.editorId,
              entityID: this.ruleForm.entityID,
              entityName: this.ruleForm.entityName,
              profitCenter: this.ruleForm.profitCenter,
              expiryDate: this.ruleForm.expiryDate,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`添加成功`)
                this.resetForm(formName)
                this.getTableData()
              }
            })
          }
        } else {
          this.$message.error('提交失败')
          return false
        }
      })
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
            API.deleteEntityWbs(IdList).then((response) => {
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
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
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

<style lang="scss" scoped></style>

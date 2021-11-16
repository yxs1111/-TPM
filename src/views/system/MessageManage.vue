<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="filterObj.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型关键词" prop="name">
        <el-input v-model="filterObj.key" placeholder="请输入模型关键词" />
      </el-form-item>
      <el-form-item label="分类" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  class="TpmButtonBG">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
      <el-button type="success" icon="el-icon-plus" class="TpmButtonBG">发布</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading" border :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作" width="100">
        <template slot-scope="{ row }">
          <div class="table_operation">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="brandCode" label="品牌编码"> </el-table-column>
      <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '正常' : '无效' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '品牌信息'" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="品牌编号" v-show="!isEditor">
            <el-input v-model="ruleForm.brandCode" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌编号"  v-show="isEditor">
            <el-input v-model="ruleForm.brandCode" disabled class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌名称">
            <el-input v-model="ruleForm.brandName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" class="my-el-input" placeholder="请输入">
            </el-input>
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
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'MessageManage',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        name: '',
        key: '',
        category: '',
      },
      tableLoading: '',
      categoryArr: [{ label: '19号线', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        brandCode: '',
        brandName: '',
        remark: '',
      },
      rules: {
        brandCode: [
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
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    //this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData=[]
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
    add() {
      this.dialogVisible = true
    },
    search() {
      this.getTableData()
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        brandCode: '',
        brandName: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        brandCode: obj.brandCode,
        brandName: obj.brandName,
        remark: obj.remark,
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor ? API.updateMdBrand : API.insertMdBrand
          url({
            id: this.editorId,
            brandCode: this.ruleForm.brandCode,
            brandName: this.ruleForm.brandName,
            remark: this.ruleForm.remark,
          }).then((response) => {
            if (response.code === 1000) {
              this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
              this.resetForm(formName)
              this.getTableData()
            }
          })
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
            API.deleteMdBrand(IdList).then((response) => {
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

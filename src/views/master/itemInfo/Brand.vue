<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">品牌编码</span>
          <el-input v-model="filterObj.brandCode" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌名称</span>
          <el-input v-model="filterObj.brandName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
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
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add" v-permission="permissions['insert']">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作">
        <template slot-scope="{ row }">
          <div class="table_operation" v-permission="permissions['update']">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="brandCode" label="品牌编码"> </el-table-column>
      <el-table-column align="center" prop="brandName" label="品牌名称"> </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '品牌信息'" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="品牌编码" v-show="!isEditor">
            <el-input v-model="ruleForm.brandCode" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌编码"  v-show="isEditor">
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
import { getDefaultPermissions, parseTime, getTextMap ,getHeightSingle,downloadFile} from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'Brand',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        brandCode: '',
        brandName: '',
        state: '',
      },
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
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData=[]
      API.getPageMdBrand({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        brandCode: this.filterObj.brandCode,
        brandName: this.filterObj.brandName,
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
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum=1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        brandCode: '',
        brandName: '',
        state: '',
      }
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
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('brandCode', this.filterObj.brandCode)
      formData.append('brandName', this.filterObj.brandName)
      formData.append('state', this.filterObj.state)
      API.exportBrand(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '品牌 -' + timestamp + '.xlsx') //自定义Excel文件名
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

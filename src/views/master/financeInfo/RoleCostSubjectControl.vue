<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">费用类型名称</span>
          <el-input v-model="filterObj.costTypeName" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">MinePackage</span>
          <el-input v-model="filterObj.MinePackage" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">费用科目</span>
          <el-input v-model="filterObj.costItem" placeholder="请输入" />
        </div>
        <el-button type="primary" class="TpmButtonBG"  @click="search">查询</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" style="width: 100%">
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
      <el-table-column align="center" prop="costTypeNumber" label="费用类型编码"> </el-table-column>
      <el-table-column align="center" prop="costType" label="费用类型"> </el-table-column>
      <el-table-column align="center" prop="minePackageNumber" label="minePackageNumber"> </el-table-column>
      <el-table-column align="center" prop="minePackage" label="minePackage"> </el-table-column>
      <el-table-column align="center" prop="costItemTypeNumber" label="费用科目编码"> </el-table-column>
      <el-table-column align="center" prop="costItem" label="费用科目名称"> </el-table-column>
      
 
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '费用科目信息'" :visible="dialogVisible" width="30%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="el-form-row">
          <el-form-item label="费用级别">
            <el-radio v-model="costlevel" label="1">费用类型</el-radio>
            <el-radio v-model="costlevel" label="2">Mine Package</el-radio>
            <el-radio v-model="costlevel" label="3">费用科目</el-radio>
          </el-form-item>
          <div v-if="costlevel==='1'">
            <el-form-item label="费用类型编码" prop="costTypeNumber">
              <el-input v-model="ruleForm.costTypeNumber" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="费用类型名称" prop="costType">
              <el-input v-model="ruleForm.costType" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="费用类型中文名称">
              <el-input v-model="ruleForm.costItemName" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <div v-if="costlevel==='2'">
            <el-form-item label="费用类型">
              <el-select v-model="ruleForm.parentNumber" class="my-el-input" placeholder="请选择">
                <el-option v-for="item in costTypeList" :key="item.name" :label="item.costType" :value="item.costTypeNumber" />
              </el-select>
            </el-form-item>
            <el-form-item label="Mine Package编码" prop="costTypeNumber">
              <el-input v-model="ruleForm.costTypeNumber" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="Mine Package名称" prop="costType">
              <el-input v-model="ruleForm.costType" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="Mine Package中文名称">
              <el-input v-model="ruleForm.costItemName" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <div v-if="costlevel==='3'">
            <el-form-item label="费用类型">
              <el-select v-model="ruleForm.costItem" class="my-el-input" @change="changeCostType" placeholder="请选择">
                <el-option v-for="item in costTypeList" :key="item.name" :label="item.costType" :value="item.costTypeNumber" />
              </el-select>
            </el-form-item>
            <el-form-item label="Mine Package ">
              <el-select v-model="ruleForm.parentNumber" class="my-el-input" placeholder="请选择">
                <el-option v-for="item in MinePackageList" :key="item.name" :label="item.costType" :value="item.costTypeNumber" />
              </el-select>
            </el-form-item>
            <el-form-item label="费用科目" prop="costType">
              <el-input v-model="ruleForm.costType" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="费用科目中文名称">
              <el-input v-model="ruleForm.costItemName" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="费用科目编码" prop="costTypeNumber">
              <el-input v-model="ruleForm.costTypeNumber" class="my-el-input" placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button  type="primary" @click="resetForm('ruleForm')">取 消</el-button>
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
  name: 'RoleCostSubjectControl',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        costTypeName: '',
        MinePackage: '',
        costItem: '',
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        costItemName: '',
        costLevel: '',
        costItem: '', //三级选中的费用类型
        costType: '',
        costTypeNumber: '',
        parentNumber: '',
        remark: '',
      },
      rules: {
        costType: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        costTypeNumber: [
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
      costlevel: '1',
      costTypeList: [],
      MinePackageList: [],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.getTableData()
  },
  watch: {
    costlevel() {
      if (this.costlevel == '2') {
        API.getCostTypeList({
          costLevel: '1',
        }).then((response) => {
          this.costTypeList = response.data
        })
      } else if (this.costlevel == '3') {
        API.getCostTypeList({
          costLevel: '1',
        }).then((response) => {
          this.costTypeList = response.data
        })
      }
    },
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      API.getPageMdCostType({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
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
    changeCostType() {
      API.getCostTypeList({
        costLevel: '2',
      }).then((response) => {
        this.MinePackageList = response.data
      })
    },
    search() {
      this.getTableData()
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        costItemName: '',
        costLevel: '',
        costType: '',
        costTypeNumber: '',
        parentNumber: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        costItemName: obj.costItemName,
        costLevel: obj.costLevel,
        costType: obj.costType,
        costTypeNumber: obj.costTypeNumber,
        parentNumber: obj.parentNumber,
        remark: obj.remark,
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor ? API.updateMdCostType : API.insertMdCostType
          if (this.costlevel === '1') {
            url({
              id: this.editorId,
              costItemName: this.ruleForm.costItemName,
              costLevel: '1',
              costType: this.ruleForm.costType,
              costTypeNumber: this.ruleForm.costTypeNumber,
              remark: this.ruleForm.remark,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
                this.resetForm(formName)
                this.getTableData()
              }
            })
          } else if (this.costlevel === '2') {
            url({
              id: this.editorId,
              costItemName: this.ruleForm.costItemName,
              costLevel: '2',
              costType: this.ruleForm.costType,
              costTypeNumber: this.ruleForm.costTypeNumber,
              parentNumber: this.ruleForm.parentNumber,
              remark: this.ruleForm.remark,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
                this.resetForm(formName)
                this.getTableData()
              }
            })
          } else if (this.costlevel === '3') {
            url({
              id: this.editorId,
              costItemName: this.ruleForm.costItemName,
              costLevel: '3',
              costType: this.ruleForm.costType,
              costTypeNumber: this.ruleForm.costTypeNumber,
              parentNumber: this.ruleForm.parentNumber,
              remark: this.ruleForm.remark,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
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
            API.deleteMdCostType(IdList).then((response) => {
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

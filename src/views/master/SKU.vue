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
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="danger" plain class="my-export" icon="el-icon-delete" @click="mutidel">删除</el-button>

    </div>
    <el-table :data="tableData" v-loading="tableLoading" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column width="150" fixed align="center" prop="productCode" label="产品编号">
      </el-table-column>
      <el-table-column fixed align="center" label="操作" width="100">
        <template slot-scope="{ row }">
          <div class="table_operation">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="360" align="center" prop="productCsName" label="产品中文名称">
      </el-table-column>
      <el-table-column width="220" align="center" prop="productEsName" label="产品英文名称">
      </el-table-column>
      <el-table-column width="180" align="center" prop="productAbbreviation" label="产品简称">
      </el-table-column>
      <el-table-column width="150" align="center" prop="category" label="品类">
      </el-table-column>
      <el-table-column width="150" align="center" prop="brand" label="品牌">
      </el-table-column>
      <el-table-column width="150" align="center" prop="series" label="系列">
      </el-table-column>
      <el-table-column width="150" align="center" prop="stage" label="阶段">
      </el-table-column>
      <!-- <el-table-column width="150" align="center" prop="pack" label="包装"> </el-table-column>
      <el-table-column width="150" align="center" prop="content" label="含量"> </el-table-column> -->
      <el-table-column width="150" align="center" prop="conversionRatio" label="大小单位转换比">
      </el-table-column>
      <el-table-column width="150" align="center" prop="largeUnit" label="大单位">
      </el-table-column>
      <el-table-column width="150" align="center" prop="largeUnitPrice" label="大单位价格">
      </el-table-column>
      <el-table-column width="150" align="center" prop="smallUnit" label="小单位">
      </el-table-column>
      <el-table-column width="150" align="center" prop="smallUnitPrice" label="小单位价格">
      </el-table-column>
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
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '产品信息'" :visible="dialogVisible" width="48%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="产品编码" prop="productCode">
            <el-input v-model="ruleForm.productCode" class="my-el-input" placeholder="请输入">
            </el-input>
            <!-- <el-select v-model="ruleForm.productCode" class="my-el-select" clearable placeholder="请选择">
              <el-option v-for="(item, index) in settingTypeList" :key="index" :label="item" :value="index + 1" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="产品标准名称">
            <el-input v-model="ruleForm.productStandardName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="产品中文名称">
            <el-input v-model="ruleForm.productCsName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="产品英文名称">
            <el-input v-model="ruleForm.productEsName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="产品简称">
            <el-input v-model="ruleForm.productAbbreviation" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="品类">
            <el-input v-model="ruleForm.category" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="ruleForm.brand" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="系列">
            <el-input v-model="ruleForm.series" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="阶段">
            <el-input v-model="ruleForm.stage" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="包装">
            <el-input v-model="ruleForm.pack" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="含量">
            <el-input v-model="ruleForm.content" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="大小单位转换比">
            <el-input v-model="ruleForm.conversionRatio" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="大单位">
            <el-input v-model="ruleForm.largeUnit" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="大单位价格">
            <el-input v-model="ruleForm.largeUnitPrice" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="小单位">
            <el-input v-model="ruleForm.smallUnit" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="小单位价格">
            <el-input v-model="ruleForm.smallUnitPrice" class="my-el-input" placeholder="请输入">
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
  name: 'SKU',

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
        productCode: '',
        productStandardName: '',
        productCsName: '',
        productEsName: '',
        productAbbreviation: '',
        category: '',
        brand: '',
        series: '',
        stage: '',
        pack: '',
        content: '',
        conversionRatio: '',
        largeUnit: '',
        largeUnitPrice: '',
        smallUnit: '',
        smallUnitPrice: '',
        remark: '',
      },
      rules: {
        productCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        productStandardName: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        configtype: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        configvalue: [
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
    this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageMdProduct({
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
        productCode: '',
        productStandardName: '',
        productCsName: '',
        productEsName: '',
        productAbbreviation: '',
        category: '',
        brand: '',
        series: '',
        stage: '',
        pack: '',
        content: '',
        conversionRatio: '',
        largeUnit: '',
        largeUnitPrice: '',
        smallUnit: '',
        smallUnitPrice: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        productCode: obj.productCode,
        productStandardName: obj.productStandardName,
        productCsName: obj.productCsName,
        productEsName: obj.productEsName,
        productAbbreviation: obj.productAbbreviation,
        category: obj.category,
        brand: obj.brand,
        series: obj.series,
        stage: obj.stage,
        pack: obj.pack,
        content: obj.content,
        conversionRatio: obj.conversionRatio,
        largeUnit: obj.largeUnit,
        largeUnitPrice: obj.largeUnitPrice,
        smallUnit: obj.smallUnit,
        smallUnitPrice: obj.smallUnitPrice,
        remark: obj.remark,
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor ? API.updateMdProduct : API.insertMdProduct
          url({
            id: this.editorId,
            productCode: this.ruleForm.productCode,
            productStandardName: this.ruleForm.productStandardName,
            productCsName: this.ruleForm.productCsName,
            productEsName: this.ruleForm.productEsName,
            productAbbreviation: this.ruleForm.productAbbreviation,
            category: this.ruleForm.category,
            brand: this.ruleForm.brand,
            series: this.ruleForm.series,
            stage: this.ruleForm.stage,
            pack: this.ruleForm.pack,
            content: this.ruleForm.content,
            conversionRatio: this.ruleForm.conversionRatio,
            largeUnit: this.ruleForm.largeUnit,
            largeUnitPrice: this.ruleForm.largeUnitPrice,
            smallUnit: this.ruleForm.smallUnit,
            smallUnitPrice: this.ruleForm.smallUnitPrice,
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
            API.deleteMdProduct(IdList).then((response) => {
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

// 拆分规则
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="年月：" prop="name">
        <el-input v-model="filterObj.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="渠道：" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户：" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌：" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item style="color:red;">
        暂时缺少页面
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-download" class="TpmButtonBG" @click="mutidel">导入</el-button>
      <el-button type="primary" icon="el-icon-upload2" class="TpmButtonBG" @click="add">导出</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      stripe
      style="width: 100%"
    >
      <el-table-column width="" align="center" prop="channelCode" label="年月" />
      <el-table-column width="" align="center" prop="channelCsName" label="渠道" />
      <el-table-column width="150" align="center" prop="productCode" label="客户" />
      <el-table-column width="200" align="center" prop="productCsName" label="品牌" />
      <el-table-column width="" align="center" prop="volMix" label="新客达成率" />
      <el-table-column width="" align="center" prop="channelCode" label="创建人" />
      <el-table-column width="" align="center" prop="channelCsName" label="创建时间" />
      <el-table-column width="150" align="center" prop="productCode" label="修改人" />
      <el-table-column width="320" align="center" prop="productCsName" label="修改时间" />
      <el-table-column width="" align="center" prop="volMix" label="状态" />
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
    <el-dialog v-el-drag-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '产品信息'" :visible="dialogVisible" width="48%" @close="closeDialog">
      <div class="el-dialogContent">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="el-form-row">
          <el-form-item label="渠道编号" prop="channelCode">
            <el-input v-model="ruleForm.channelCode" class="my-el-input" placeholder="请输入" />
            <!-- <el-select v-model="ruleForm.productCode" class="my-el-select" clearable placeholder="请选择">
              <el-option v-for="(item, index) in settingTypeList" :key="index" :label="item" :value="index + 1" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="渠道中文名称">
            <el-input v-model="ruleForm.channelCsName" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="产品编号">
            <el-input v-model="ruleForm.productCode" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="产品中文名称">
            <el-input v-model="ruleForm.productCsName" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="档位">
            <el-input v-model="ruleForm.gear" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="volMin">
            <el-input v-model="ruleForm.volMin" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属年月">
            <el-input v-model="ruleForm.yearAndMonth" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" class="my-el-input" placeholder="请输入" />
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
import { getDefaultPermissions } from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'SplitRules',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        name: '',
        key: '',
        category: ''
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          channelCode: '111',
          channelCsName: '',
          productCode: '',
          productCsName: '',
          gear: '',
          volMix: ''
        }
      ],
      ruleForm: {
        channelCode: '',
        channelCsName: '',
        productCode: '',
        productEsName: '',
        productCsName: '',
        gear: '',
        volMin: '',
        yearAndMonth: '',
        remark: ''
      },
      rules: {
        channelCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      isEditor: '',
      editorId: '',
      checkArr: [] // 批量删除,存放选中
    }
  },
  computed: {},
  mounted() {
    // this.getTableData()
  },
  methods: {
    // select标签的change事件
    changeSelection(val) {
      const optionsImg = this.optionsImg
      const i = optionsImg.findIndex((item) => item.label === val)
      this.$refs['refSelect']
        .$el.children[0]
        .children[0]
        .setAttribute(
          'style',
          `
          background-color: red;
          background: url(../../../assets/images/selectError.png) no-repeat; 
          `
        )
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageMdPriceGear({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize // 每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
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
        channelCode: '',
        channelCsName: '',
        productCode: '',
        productEsName: '',
        productCsName: '',
        gear: '',
        volMin: '',
        yearAndMonth: '',
        remark: ''
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        channelCode: obj.channelCode,
        channelCsName: obj.channelCsName,
        productCode: obj.productCode,
        productEsName: obj.productEsName,
        productCsName: obj.productCsName,
        gear: obj.gear,
        volMin: obj.volMin,
        yearAndMonth: obj.yearAndMonth,
        remark: obj.remark
      }
      this.editorId = obj.id
    },
    // 提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const url = this.isEditor
            ? API.updateMdPriceGear
            : API.insertMdPriceGear
          url({
            id: this.editorId,
            channelCode: this.ruleForm.channelCode,
            channelCsName: this.ruleForm.channelCsName,
            productCode: this.ruleForm.productCode,
            productCsName: this.ruleForm.productCsName,
            gear: this.ruleForm.gear,
            volMin: this.ruleForm.volMin,
            yearAndMonth: this.ruleForm.yearAndMonth,
            remark: this.ruleForm.remark
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
    // 多个删除
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
          type: 'warning'
        })
          .then(() => {
            API.deleteMdPriceGear(IdList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    // 取消
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
    }
  }
}
</script>

<style lang="scss" scoped>
.option_box {
  display: flex;
  align-items: center;
}

.option_img {
  width: 25px;
  height: 25px;
  margin-right: 7px;
  background: url(../../../assets/images/selectError.png) no-repeat;
}

.inputStatus input {
  background: url(../../../assets/images/selectError.png) no-repeat;
}
.inputStatus div{
  background-color: blueviolet;
}
// .el-select>.el-input input{
//     display: block;
//     margin: 10px 0;
//     background: url(../../../assets/images/selectError.png) no-repeat;
//     background-position: 3px;
//     padding-left: 30px;
//     outline: none;
// }
</style>

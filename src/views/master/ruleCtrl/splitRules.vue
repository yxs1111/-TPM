// 拆分规则
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="渠道：">
        <el-select v-model="filterObj.channelCode" placeholder="请选择" clearable>
          <el-option v-for="item in channelOptons" :key="item.channelCode" :label="item.channelEsName" :value="item.channelEsName" />
        </el-select>
      </el-form-item>
      <el-form-item label="年月：">
        <el-date-picker v-model="filterObj.yeardate" type="month" value-format="yyyyMM" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="版本：">
        <el-select v-model="filterObj.versions" placeholder="请选择">
          <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="拆分类型：">
        <el-select v-model="filterObj.splitType" placeholder="请选择">
          <el-option v-for="item in splitTypeArr" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="getTableData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="add">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">新增</span>
      </div>
      <!-- <div class="TpmButtonBG" @click="add">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div> -->
      <div class="TpmButtonBG" @click="mutidel">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出</span>
      </div>
      <!-- <el-button type="primary" icon="el-icon-upload2" class="TpmButtonBG" @click="add">导出</el-button>
      <el-button type="primary" icon="el-icon-download" class="TpmButtonBG" @click="mutidel">导入</el-button> -->
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
      <el-table-column width="" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="" align="center" prop="yeardate" label="年月" />
      <el-table-column width="150" align="center" prop="versions" label="版本" />
      <el-table-column width="200" align="center" prop="splitType" label="拆分类型">
        <template slot-scope="scope">
          {{ scope.row.splitType === 1 ? '连续拆分':'不连续拆分' }}
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" prop="splitRule" label="拆分规则" />
      <el-table-column width="" align="center" prop="splitWeight" label="权重" />
      <el-table-column width="" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人" />
      <el-table-column width="180" align="center" prop="updateDate" label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.updateDate===null ? '': scope.row.updateDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="" align="center" prop="remark" label="备注" />
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
    <!-- 新增 -->
    <el-dialog v-el-drag-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '信息'" :visible="dialogVisible" width="70%" @close="closeDialog">
      <div class="el-dialogContent">
        <div style="margin-bottom:15px;">
          <el-row :gutter="20" style="margin-bottom:8px;">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                渠道：
                <el-select v-model="dialogAdd.channelcode" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in channelOptons"
                    :key="item.channelCode"
                    :label="item.channelEsName"
                    :value="item.channelCode"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                Mine Package：
                <el-select v-model="dialogAdd.costTypeNumber" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in mpOptons"
                    :key="item.costTypeNumber"
                    :label="item.costType"
                    :value="item.costTypeNumber"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                年月:
                <el-date-picker v-model="filterObj.yeardate" type="month" placeholder="请选择" size="small" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                版本：
                <el-select v-model="filterObj.versions" placeholder="请选择"  size="small">
                  <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                拆分类型：
                <el-select v-model="filterObj.splitType" placeholder="请选择" size="small">
                  <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.id" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                备注：
                <el-input v-model="dialogAdd.remark" style="width: 260px;" placeholder="请输入内容" size="small" />
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-button plain type="primary" size="mini" icon="el-icon-plus" @click="handleAddDetails">添加一行</el-button>
          <el-button
            type="success"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteDetails"
          >删除</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteAllDetails"
          >清空</el-button>
        </div>
        <div style="height:1px;background:#dcdfe6;margin:20px 0px;" />
        <div style="border: 1px solid #dcdfe6;">
          <el-table ref="tb" :data="systemList" :row-class-name="rowClassName" @selection-change="handleDetailSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" width="50" />
            <el-table-column label="拆分规则" align="center" prop="fs">
              <template slot-scope="scope">
                P&nbsp;
                <el-input v-model="systemList[scope.row.xh-1].cdmRuleF" style="width:30px;margin-right:8px;" size="small" placeholder="请输入" />
                &nbsp;M —— P&nbsp;
                <el-input v-model="systemList[scope.row.xh-1].cdmRuleS" style="width:30px;" size="small" placeholder="请输入" />
                &nbsp;M
              </template>
            </el-table-column>
            <el-table-column label="权重" align="center" prop="cdmName">
              <template slot-scope="scope">
                <span>{{ 60 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保 存</el-button>
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
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'SplitRules',
  directives: { elDragDialog, permission },

  data() {
    return {
      splitTypeArr: [{
        key: 1,
        value: '连续拆分'
      },
      {
        key: 2,
        value: '不连续拆分'
      }],
      checkArr: [], // 批量删除,存放选中
      channelOptons: [],
      skuOptons: [],
      mpOptons: [],
      systemList: [],
      cdmTypeOptions: [
        {
          code: 'cdm1',
          name: '打折'
        },
        {
          code: 'cdm2',
          name: '特价'
        },
        {
          code: 'cdm3',
          name: '满减'
        }
      ],
      checkedDetail: [],
      dialogAdd: {
        channelCode: '',
        costTypeNumber: '',
        productCode: '',
        remark: ''
      },
      dialogVisible: false,
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        yeardate: '',
        versions: '',
        splitType: ''
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
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
      isEditor: '',
      editorId: ''
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
    this.getQueryChannelSelect()
    this.getQueryMinePackageSelect()
  },
  methods: {
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then(res => {
        this.channelOptons = res.data
      }).catch()
    },
    getQueryMinePackageSelect() {
      selectAPI.queryMinePackageSelect().then(res => {
        this.mpOptons = res.data
      }).catch()
    },
    // 弹框 动态增加行
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1
    },
    // 单选框选中数据
    handleDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      } else {
        this.checkedDetail = selection
      }
    },
    handleAddDetails() {
      if (this.systemList === undefined) {
        // eslint-disable-next-line no-array-constructor
        this.systemList = new Array()
      }
      const obj = {}
      obj.cdmType = '1'
      obj.cdmRuleF = '0'
      obj.cdmRuleS = '0'
      obj.cdmName = ''
      this.systemList.push(obj)
    },
    handleDeleteDetails() {
      if (this.checkedDetail.length === 0) {
        this.$alert('请先选择要删除的数据', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.systemList.splice(this.checkedDetail[0].xh - 1, 1)
      }
    },
    handleDeleteAllDetails() {
      this.systemList = undefined
    },
    // 新增弹框
    add() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
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
      API.getPageByRequestSplitRule({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelCode: this.filterObj.channelCode,
        yeardate: this.filterObj.yeardate,
        versions: this.filterObj.versions,
        splitType: this.filterObj.splitType
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
    search() {
      this.getTableData()
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

// 价格主数据
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="渠道：">
        <el-select v-model="filterObj.channelCode" placeholder="请选择" clearable>
          <el-option v-for="item in channelOptons" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mine Package：">
        <el-select v-model="filterObj.costTypeNumber" placeholder="请选择" clearable>
          <el-option v-for="item in mpOptons" :key="item.costTypeNumber" :label="item.costType" :value="item.costTypeNumber" />
        </el-select>
      </el-form-item>
      <el-form-item label="SKU：">
        <el-select v-model="filterObj.productCode" placeholder="请选择" clearable>
          <el-option v-for="item in skuOptons" :key="item.productCode" :label="item.productCsName" :value="item.productCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="机制类型：">
        <el-select v-model="filterObj.cdmType" placeholder="请选择" clearable>
          <el-option v-for="item in cdmTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="机制名称：">
        <el-input v-model="filterObj.cdmName" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <!-- <el-button type="primary" icon="el-icon-download" class="TpmButtonBG" @click="mutidel">新增</el-button> -->
      <el-button type="primary" icon="el-icon-upload2" class="TpmButtonBG" @click="add">新增</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="150" align="center" prop="channelCsName" label="渠道" />
      <el-table-column width="320" align="center" prop="costType" label="Mine Package" />
      <el-table-column width="150" align="center" prop="sku" label="SKU" />
      <el-table-column width="320" align="center" prop="cdmType" label="机制类型">
        <template slot-scope="scope">
          {{ typeVSinfo(scope.row.cdmType) }}
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" prop="cdmName" label="机制名称" />
      <el-table-column width="180" align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateDate==null ? '': scope.row.updateDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="updateBy" label="更新人" />
      <el-table-column width="150" align="center" prop="remark" label="备注" />
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
    <el-dialog v-el-drag-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '信息'" :visible="dialogVisible" width="70%" @close="closeDialog">
      <div class="el-dialogContent">
        <div style="margin-bottom:15px;">
          <el-row :gutter="20">
            <el-col :span="5">
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
            <el-col :span="7">
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
            <el-col :span="5">
              <div class="grid-content bg-purple">
                SKU：
                <el-select v-model="dialogAdd.productCode" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in skuOptons"
                    :key="item.productCode"
                    :label="item.productCsName"
                    :value="item.productCode"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="7">
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
            <el-table-column label="机制类型" align="center" prop="cdmType">
              <template slot-scope="scope">
                <el-select
                  v-model="systemList[scope.row.xh-1].cdmType"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="dict in cdmTypeOptions"
                    :key="dict.code"
                    :label="dict.name"
                    :value="dict.code"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="机制规则" align="center" prop="fs">
              <template slot-scope="scope">
                <el-input v-model="systemList[scope.row.xh-1].cdmRuleF" :disabled="systemList[scope.row.xh-1].cdmType == '5'" style="width:80px;margin-right:8px;" size="small" placeholder="请输入" />
                <el-input v-model="systemList[scope.row.xh-1].cdmRuleS" :disabled="systemList[scope.row.xh-1].cdmType == '5'" style="width:80px;" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="机制名称" align="center" prop="cdmName">
              <template slot-scope="scope">
                <span v-if="systemList[scope.row.xh-1].cdmType != '5'">{{ '满 '+ systemList[scope.row.xh-1].cdmRuleF + ' 听 '+ systemList[scope.row.xh-1].cdmRuleS + ' 折' }}</span>
                <el-input v-if="systemList[scope.row.xh-1].cdmType == '5'" v-model="systemList[scope.row.xh-1].cdmName" style="width:260px;" size="small" placeholder="请输入内容" />
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
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'SystemPool',
  directives: { elDragDialog, permission },

  data() {
    return {
      input: '',
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        costTypeNumber: '',
        productCode: '',
        cdmType: '',
        cdmName: ''
      },
      dialogAdd: {
        channelCode: '',
        costTypeNumber: '',
        productCode: '',
        remark: ''
      },
      tableLoading: '',
      value: '',
      categoryArr: [{ label: '19号线', value: '19' }],
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
      dialogVisible: false,
      isEditor: '',
      editorId: '',
      checkArr: [], // 批量删除,存放选中
      channelOptons: [],
      skuOptons: [],
      mpOptons: [],
      systemList: [],
      checkedDetail: [],
      cdmTypeOptions: [
        {
          code: '1',
          name: '打折'
        },
        {
          code: '2',
          name: '特价'
        },
        {
          code: '3',
          name: '满减'
        },
        {
          code: '4',
          name: '买赠'
        },
        {
          code: '5',
          name: '其它'
        }
      ]
    }
  },

  computed: {
    typeVSinfo() {
      return function(type) {
        switch (type) {
          case '1':
            return '打折'
            break
          case '2':
            return '特价'
            break
          case '3':
            return '满减'
            break
          case '4':
            return '买赠'
            break
          case '5':
            return '其它'
            break
          default:
            break
        }
      }
    }
  },
  mounted() {
    this.getTableData()
    // 获取下拉框
    this.getQueryChannelSelect()
    this.getQuerySkuSelect()
    this.getQueryMinePackageSelect()
  },
  methods: {
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

    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then(res => {
        this.channelOptons = res.data
      }).catch()
    },
    getQuerySkuSelect() {
      selectAPI.querySkuSelect().then(res => {
        this.skuOptons = res.data
      }).catch()
    },
    getQueryMinePackageSelect() {
      selectAPI.queryMinePackageSelect().then(res => {
        this.mpOptons = res.data
      }).catch()
    },
    // 查询
    search() {
      this.tableLoading = true
      API.getPageByRequestConfig({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.costTypeNumber,
        sku: this.filterObj.productCode,
        cdmType: this.filterObj.cdmType,
        cdmName: this.filterObj.cdmName
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
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageByRequestConfig({
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
    submitForm() {
      console.log('*******addInfo*******')
      console.log(this.systemList)
      // 新增接口
      const cdmListLocal = []
      for (const item of this.systemList) {
        const cdnItem = {
          cdmTypeItem: '',
          cdmNameItem: '',
          beginNumItem: '',
          endNumItem: ''
        }
        cdnItem.cdmTypeItem = item.cdmType
        cdnItem.cdmNameItem = item.cdmType === '5' ? item.cdmName : '满' + item.cdmRuleF + '听' + item.cdmRuleS + '折'
        cdnItem.beginNumItem = item.cdmRuleF
        cdnItem.endNumItem = item.cdmRuleS
        cdmListLocal.push(cdnItem)
      }

      const params = {
        'channelCode': this.dialogAdd.channelCode,
        'minePackageCode': this.dialogAdd.costTypeNumber,
        'sku': this.dialogAdd.productCode,
        'remark': this.dialogAdd.remark,
        'cdmList': cdmListLocal
      }
      API.insertDataConfig(params).then(res => {
        if (res.code == 1000) {
          this.closeDialog()
        }
      }).catch()
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     const url = this.isEditor
      //       ? API.updateMdPriceGear
      //       : API.insertMdPriceGear
      //     url({
      //       id: this.editorId,
      //       channelCode: this.ruleForm.channelCode,
      //       channelCsName: this.ruleForm.channelCsName,
      //       productCode: this.ruleForm.productCode,
      //       productCsName: this.ruleForm.productCsName,
      //       gear: this.ruleForm.gear,
      //       volMin: this.ruleForm.volMin,
      //       yearAndMonth: this.ruleForm.yearAndMonth,
      //       remark: this.ruleForm.remark
      //     }).then((response) => {
      //       if (response.code === 1000) {
      //         this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
      //         this.resetForm(formName)
      //         this.getTableData()
      //       }
      //     })
      //   } else {
      //     this.$message.error('提交失败')
      //     return false
      //   }
      // })
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
      // this.$refs[formName].resetFields()
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
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    // background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    line-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

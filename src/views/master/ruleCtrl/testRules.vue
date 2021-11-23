// 检测规则
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="Mine Package：">
        <el-select v-model="filterObj.minePackage" placeholder="请选择" clearable>
          <el-option v-for="item in minePackage" :key="item.costTypeNumber" :label="item.costType" :value="item.costTypeNumber" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道：">
        <el-select v-model="filterObj.channel" placeholder="请选择" clearable>
          <el-option v-for="item in channelArr" :key="item.channelCode" :label="item.channelCode" :value="item.channelCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="年月：">
        <el-date-picker
          v-model="filterObj.date"
          type="month"
          value-format="yyyyMM"
          format="yyyyMM"
          placeholder="选择月"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" icon="el-icon-search" :loading="tableLoading" @click="getTableData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-download" class="TpmButtonBG" @click="mutidel">导入</el-button>
      <el-button type="primary" icon="el-icon-upload2" class="TpmButtonBG" @click="add">导出</el-button>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" :span-method="objectSpanMethod" border :cell-style="cellStyle" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="" align="center" prop="version" label="版本" />
      <el-table-column width="350" align="left" prop="ruleContentFront" label="验证规则" />
      <el-table-column width="100" align="left" prop="ruleUnit" label="" />
      <el-table-column width="260" align="left" prop="ruleContentAfter" label="">
        <!-- <template slot-scope="{row}">
          <el-select v-model="row.ruleContentAfter" placeholder="请选择" size="small">
            <el-option v-for="item in categoryArr" :key="item.name" :label="item.label" :value="item.value" />
          </el-select>
        </template> -->
      </el-table-column>
      <el-table-column width="" align="left" prop="checkType" label="验证类型">
        <!-- <template>
          <el-select v-model="filterObj.category" placeholder="请选择" size="small">
            <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.value" />
          </el-select>
        </template> -->
      </el-table-column>
      <el-table-column width="" align="left" prop="exceptionType" label="异常类型">
        <!-- <template slot-scope="{row}">
          <el-select ref="refSelect" v-model="row.ErrorType" style="width: 100%" placeholder="请选择图标" @change="changeSelection">
            <el-option v-for="item in optionsImg" :key="item.id" :value="item.label" :label="item.label">
              <div class="option_box">
                <el-image class="option_img" :src="item.valueImg" />
                {{ item.label }}
              </div>
            </el-option>
          </el-select>
        </template> -->
      </el-table-column>
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
  name: 'SaleComputeKeep',
  directives: { elDragDialog, permission },

  data() {
    return {
      url: '@/assets/images/selectError.png',
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        minePackage: '',
        channel: '',
        date: ''
      },
      tableLoading: false,
      categoryArr: [{ name: '19号线', value: '19' }],
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
      // 异常数组
      optionsImg: [
        {
          id: 0,
          label: 'Error',
          valueImg: require('@/assets/images/selectError.png')
        },
        {
          id: 1,
          label: 'Exception',
          valueImg: require('@/assets/images/warning.png')
        }
      ],
      ErrorType: '', // 异常类型
      minePackage: [],
      channelArr: [],
      V0Total: 0,
      V1Total: 0,
      V2Total: 0,
      V3Total: 0
    }
  },
  computed: {},
  mounted() {
    this.getChannel()
    this.getCostTypeList()
    this.getTableData()
    // 获取下拉框
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.version === 'V0') {
        if (columnIndex === 0) {
          if (rowIndex % this.V0Total === 0) {
            return {
              rowspan: this.V0Total,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else if (row.version === 'V1') {
        if (columnIndex === 0) {
          if ((rowIndex - this.V0Total) % this.V1Total === 0) {
            return {
              rowspan: this.V1Total,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else if (row.version === 'V2') {
        if (columnIndex === 0) {
          if ((rowIndex - this.V0Total - this.V1Total) % this.V2Total === 0) {
            return {
              rowspan: this.V2Total,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else if (row.version === 'V3') {
        if (columnIndex === 0) {
          if ((rowIndex - this.V0Total - this.V1Total - this.V2Total) % this.V3Total === 0) {
            return {
              rowspan: this.V3Total,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    // mine package
    getCostTypeList() {
      var params = { costLevel: 2 }
      API.getCostTypeList(params).then(res => {
        if (res.code === 1000) {
          this.minePackage = res.data
        }
      }).catch()
    },
    // 渠道
    getChannel() {
      API.getMdChannelList().then(res => {
        if (res.code === 1000) {
          this.channelArr = res.data
        }
      }).catch()
    },
    // select标签的change事件
    changeSelection(val) {
      const optionsImg = this.optionsImg
      const i = optionsImg.findIndex((item) => item.label === val)
      this.ErrorType = val
      this.$refs['refSelect'].$el.children[0].children[0].setAttribute(
        'style',
        `background: url(${optionsImg[i].valueImg}) no-repeat; 
         background-position: 10px center; 
				background-size: 20px 20px!important;
				text-indent: 30px;
          
          `
      )
      this.$forceUpdate()
      console.log(this.ErrorType)
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageByDto({
        channelCode: this.filterObj.channel,
        minePackage: this.filterObj.minePackage,
        yearAndMonth: this.filterObj.date,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.total = response.data.total
          this.computerColspan(this.tableData)
        })
        .catch(() => {})
    },
    // 计算各版本的条数
    computerColspan(data) {
      // 初始化
      this.V0Total = 0
      this.V1Total = 0
      this.V2Total = 0
      this.V3Total = 0
      for (const ele of data) {
        if (ele.version === 'V0') {
          this.V0Total += 1
        } else if (ele.version === 'V1') {
          this.V1Total += 1
        } else if (ele.version === 'V2') {
          this.V2Total += 1
        } else if (ele.version === 'V3') {
          this.V3Total += 1
        }
      }
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
      this.tableLoading = true
      this.getTableData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.tableLoading = true
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
    HeadTable(valHead) {
      console.log('******head****', valHead)
      if (valHead.columnIndex === 0) {
        return 'background: #fff;color: #333;font-size: 16px;font-weight: 400;font-family: Source Han Sans CN;'
      } else {
        return ' background: #fff;color: #333;font-size: 16px;font-weight: 400;font-family: Source Han Sans CN;border-right:none;'
      }
    },
    // 单元格样式
    cellStyle(val) {
      // console.log('******val*******', val)
      // 待定判断cols 设置边框
      // if (val.column.colSpan === 5) {
      //   return 'border:1px solid #EBEEF5;;'
      // }
      if (val.columnIndex === 0) {
        return 'background:white;'
      } else {
        return 'border:none;'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .el-table__body tr:hover > td{
//     background-color:yellow !important;
// }
table th{
     border-bottom: none;
}

table th {
    border-right: none;
}

.option_box {
  display: flex;
  align-items: center;
  background-color: #fff;
}

.option_img {
  width: 25px;
  height: 25px;
  margin-right: 7px;
  // background: url(../../../assets/images/selectError.png) no-repeat;
}

</style>

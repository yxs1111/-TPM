// 检测规则
<template>
  <div class="app-container" style="border-radius:0px;">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <!-- <div class="Selectli">
          <span class="SelectliTitle">Mine Package:</span>
          <el-select v-model="filterObj.minePackage" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in minePackage" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div> -->
        <div class="Selectli">
          <span class="SelectliTitle">年月:</span>
          <el-date-picker
            v-model="filterObj.date"
            clearable
            type="month"
            value-format="yyyyMM"
            format="yyyyMM"
            placeholder="选择月"
          />
        </div>
        <el-button type="primary" class="TpmButtonBG" :loading="tableLoading" @click="getTableData">查询</el-button>
        <div class="TpmButtonBG" @click="exportExcelInfo">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-my-saveBtn" class="TpmButtonBG" @click="updateSave">保存</el-button>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" :span-method="objectSpanMethod" border :cell-style="cellStyle" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="220" align="center" prop="version" label="版本" />
      <el-table-column width="460" align="left" prop="ruleContentFront" label="验证规则" />
      <el-table-column width="100" align="left" prop="ruleUnit" label="" />
      <el-table-column width="370" align="left" prop="ruleContentAfter" label="">
        <template slot-scope="{row}">
          <div v-if="row.ruleUnit === '∈'">
            [&nbsp;<el-input v-model="row.startRule" style="width:60px;" size="small" @blur="number($event,row)" />%, <el-input v-model="row.endRule" style="width:60px;" size="small" @blur="number($event,row)" />%&nbsp;]
          </div>
          <div v-else>
            {{ row.ruleContentAfter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="" align="left" prop="checkType" label="验证类型">
        <!-- <template>
          <el-select v-model="filterObj.category" placeholder="请选择" size="small">
            <el-option v-for="item in categoryArr" :key="item.name" :label="item.name" :value="item.value" />
          </el-select>
        </template> -->
      </el-table-column>
      <!-- <el-table-column width="" align="left" prop="exceptionType" label="异常类型">
        <template slot-scope="{row}">
          <el-select ref="refSelect" v-model="row.ErrorType" style="width: 100%" placeholder="请选择图标" @change="changeSelection">
            <el-option v-for="item in optionsImg" :key="item.id" :value="item.label" :label="item.label">
              <div class="option_box">
                <el-image class="option_img" :src="item.valueImg" />
                {{ item.label }}
              </div>
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column width="" align="left" prop="channelEsName" label="渠道" />
      <!-- <el-table-column width="180" align="left" prop="costType" label="Mine Package" /> -->
      <el-table-column width="150" align="left" prop="yearAndMonth" label="年月" />
    </el-table>
    <!-- 分页 -->
    <!-- <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
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
// import type from '@/views/meta/dict/type'
export default {
  name: 'TestRulesNew',
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
    // 验证input输入框数据
    number(e, row) {
      const flag = new RegExp('^(0|[1-9][0-9]*|-[1-9][0-9]*)$').test(e.target.value)
      if (!flag) {
        e.target.value = ''
        this.$message({
          showClose: true,
          message: '需要输入整数！',
          type: 'warning'
        })
      } else if (row.startRule > row.endRule && flag) {
        e.target.value = ''
        this.$message({
          showClose: true,
          message: '区域数值需要前大后小！',
          type: 'warning'
        })
      }
    },
    // 导出excel
    exportExcelInfo() {
      API.excportRuleSave().then(
        response => {
          const fileName = '检验数据Excel' + new Date().getTime() + '.xls'
          //   res.data:请求到的二进制数据
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel'
          }) // 1.创建一个blob
          const link = document.createElement('a') // 2.创建一个a链接
          link.download = fileName // 3.设置名称
          link.style.display = 'none' // 4.默认不显示
          link.href = URL.createObjectURL(blob) // 5.设置a链接href
          document.body.appendChild(link) // 6.将a链接dom插入当前html中
          link.click() // 7.点击事件
          URL.revokeObjectURL(link.href) // 8.释放url对象
          document.body.removeChild(link) // 9.移除a链接dom
        })
    },
    // 保存
    updateSave() {
      const params = []
      for (const item of this.tableData) {
        if (item.ruleUnit === '∈') {
          const tempItem = {
            ruleUnit: item.ruleUnit.trim(),
            startRule: item.startRule + '%',
            endRule: item.endRule.trim() + '%',
            id: item.id
          }
          params.push(tempItem)
        }
      }
      API.updateRuleSave(params).then(res => {
        if (res.code === 1000) {
          this.getTableData()
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      }).catch()
    },
    // 合并第一行操作
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
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      API.getPageByDto({
        channelCode: this.filterObj.channel,
        minePackage: 'N',
        yearAndMonth: this.filterObj.date
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.total = response.data.total
          // 验证内容字段修改
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].ruleUnit === '∈') {
              const temp = this.tableData[i].ruleContentAfter.split('%,')
              this.tableData[i].startRule = temp[0].replace('[', '')
              this.tableData[i].endRule = temp[1].replace(']', '').replace('%', '')
            }
          }
          this.$forceUpdate()
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

<style>
.el-icon-my-saveBtn{
  background: url('~@/assets/images/saveBtn.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-saveBtn:before{
    content: "\e611";
    font-size: 16px;
}
</style>

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

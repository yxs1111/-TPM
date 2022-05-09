<!--
 * @Description: 
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-05-09 09:11:44
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <!-- <div class="Selectli">
          <span class="SelectliTitle" style="width:200px">Contract Item 编码</span>
          <el-input v-model="filterObj.contractItemCode" clearable placeholder="请输入" />
        </div> -->
        <div class="Selectli">
          <span class="SelectliTitle">Contract Item</span>
          <el-input v-model="filterObj.contractItem" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">条款类型</span>
          <el-select v-model="filterObj.conditionType" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in ConditionsTypeList" :key="index" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">预提类型</span>
          <el-select v-model="filterObj.variablePoint" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in ['variable','fixed']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <div class="TpmButtonBG" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作" width="220">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-show="!scope.row.isEditor" @click="editorRow(scope.$index,scope.row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor " @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="contractItemCode" label="Contract Item 编码"> </el-table-column>
      <el-table-column width="220" align="center" prop="contractItem" label="Contract Item">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.contractItem" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.contractItem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="360" align="center" prop="conditionType" label="条件类型">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.conditionTypeList" multiple class="my-el-input mutiInput" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in ConditionsTypeList" :key="index" :label="item" :value="item" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.conditionTypeText }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="360" align="center" label="固定值/点数">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.variablePointList" multiple class="my-el-input mutiInput" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in FixOrPointList" :key="index" :label="item" :value="item" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.variablePointText }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="profitCenter" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.deleteFlag==0 ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人"> </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.replace("T"," ") : '' }} </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人"> </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" title="新增ContractItem" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="el-form-row">
          <el-form-item label="Contract Item" prop="contractItem">
            <el-input v-model="ruleForm.contractItem" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="条件类型" prop="conditionType">
            <el-select v-model="ruleForm.conditionType" multiple class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in ConditionsTypeList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="固定值/点数" prop="variablePoint">
            <el-select v-model="ruleForm.variablePoint" multiple class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in FixOrPointList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="fileInfo ImportContent">
        <div class="fileTitle">模板</div>
        <div class="my-search selectFile" @click="downloadTemplate">
          <svg-icon icon-class="download_white" style="font-size: 16px;" />
          <span class="text">下载模板</span>
        </div>
      </div>
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <div class="my-search selectFile" @click="parsingExcelBtn">
          <img src="@/assets/images/selectFile.png" alt="" />
          <span class="text">选择文件</span>
        </div>
        <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)" />
        <div v-if="uploadFileName != ''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport()">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
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
  contractList,
  downloadFile,
  CustomerDeductionsAndPayType,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'contractItem',

  data() {
    return {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        contractItemCode: '',
        contractItem: '',
        conditionType: '',
        variablePoint: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        contractItem: '',
        conditionType: [],
        variablePoint: [],
      },
      rules: {
        contractItemCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        contractItem: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        conditionType: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        variablePoint: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      importVisible: false,
      isEditor: '',
      editorId: '',
      checkArr: [], //批量删除,存放选中
      ConditionsTypeList: ['conditional', 'unconditional'],
      FixOrPointList: ['variable', 'fixed'],
      maxheight: getHeight(),
      contractList: contractList,
      CustomerDeductionsAndPayType: CustomerDeductionsAndPayType,
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      uploadFile:'',
      uploadFileName:'',
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
  watch: {
    'ruleForm.deductionPoints'(value) {
      this.ruleForm.paymentMethod=''
    }
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageContractItem({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        contractItemCode: this.filterObj.contractItemCode,
        contractItem: this.filterObj.contractItem,
        conditionType: this.filterObj.conditionType,
        state: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.deductionPointIndex = this.getPointIndex(item.deductionPoints)
          item.isEditor = 0
          item.conditionTypeText = item.conditionType
          item.variablePointText = item.variablePoint
          item.paymentMethodIndex = this.getPaymentMethodIndex(item.paymentMethod)
          if (item.conditionType) {
            item.conditionTypeList = item.conditionType.split(',')
          }
          if (item.variablePoint) {
            item.variablePointList = item.variablePoint.split(',')
          }
        })
        this.tempObj.tempInfo = null
        this.tableData = list
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    //获取支付方式value ，1、2、3
    getPaymentMethodIndex(label) {
      this.CustomerDeductionsAndPayType.forEach(item=>{
        let index=item.payTypeList.findIndex(pItem=>pItem.label==label)
        if(index!=-1) {
          return index
        }
      })
    },
    getPointIndex(value) {
      let index = this.CustomerDeductionsAndPayType.findIndex((item) => {
        return item.CustomerDeduction == value
      })
      return index!=-1?index:0
    },
    //更改支付方式
    changeDeductionPointIndex(row, index) {
      this.tableData[index].paymentMethodIndex = ''
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        contractItemCode: '',
        contractItem: '',
        conditionType: '',
        state: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportContractItem({
        contractItemCode: this.filterObj.contractItemCode,
        contractItem: this.filterObj.contractItem,
        conditionType: this.filterObj.conditionType,
        state: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Contract Item-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    //下载模板
    downloadTemplate() {
      API.downloadContractItemTemplate({}).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Contract Item模板-' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        contractItem: '',
        conditionType: '',
        variablePoint: '',
        costBearingRoom: '',
        deductionPoints: '',
        paymentMethod: '',
      }
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          API.insertContractItem({
            contractItem: this.ruleForm.contractItem,
            conditionType: this.ruleForm.conditionType.join(','),
            variablePoint: this.ruleForm.variablePoint.join(','),
          }).then((response) => {
            if (response.code === 1000) {
              this.$message.success(`添加成功`)
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
            API.deleteContractItem(IdList).then((response) => {
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
    saveRow(row, index) {
      API.updateContractItem({
        id: row.id,
        contractItem: row.contractItem,
        conditionType: row.conditionTypeList.join(','),
        variablePoint: row.variablePointList.join(','),
      }).then((response) => {
        if (response.code === 1000) {
          this.$message.success(`保存成功`)
          this.getTableData()
        }
      })
    },
    editorRow(index) {
      if (this.tempObj.tempInfo) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      //存放临时数据，用于取消编辑时重置
      this.tempObj.rowIndex = index
      this.tempObj.tempInfo = { ...this.tableData[index] }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => {
        item.isEditor = 0
      })
      this.tableData[index].isEditor = 1
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      this.tableData[index].isEditor = 0
      this.tableData[index] = this.tempObj.tempInfo
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    //确认
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importContractItem(formData).then((response) => {
        if (response.code == 1000) {
          this.closeImport()
          this.getTableData()
        }
        this.event.srcElement.value = '' // 置空
      })
      
    },
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      this.event = event
      this.uploadFile = event.target.files[0]
      this.uploadFileName = event.target.files[0].name
      
    },
    //关闭导入
    closeImport() {
      this.importVisible = false
      this.uploadFile = ''
      this.uploadFileName = ''
      this.event.target.value = null
      this.warningList = []
      this.warningShow = false
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

<style lang="scss" scoped>
.svgIcon {
  width: 20px;
  height: 20px;
}

</style>
<style lang="scss">
.mutiInput {
  width: 300px !important;
    border-radius: 5px;
    margin-right: 20px;
    .el-input__inner {
      height: 37px;
      width: 300px !important;
    }
    .el-input--suffix {
      width: 300px !important;
    }
}
</style>

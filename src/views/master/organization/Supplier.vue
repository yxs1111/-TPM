<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">供应商CP编码</span>
          <el-input v-model="filterObj.supplierCode" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商名称</span>
          <el-input v-model="filterObj.supplierName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','正常']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>

    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed width="100" align="center" label="操作">
        <template slot-scope="{ row }">
          <div class="table_operation">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column width="150" align="center" prop="supplierCode" label="供应商CP编码" />
      <el-table-column width="180" align="center" prop="supplierBiCode" label="供应商COUPA编码" />
      <el-table-column align="center" prop="supplierName" label="供应商名称" />
      <el-table-column width="150" align="center" prop="country" label="Country" />
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
      </el-table-column>
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
    <el-dialog v-el-drag-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '供应商信息'" :visible="dialogVisible" width="25%" @close="closeDialog">
      <div class="el-dialogContent">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="el-form-row">
          <el-form-item label="供应商CP编码" v-show="!isEditor" prop="supplierCode">
            <el-input v-model="ruleForm.supplierCode" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="供应商CP编码" v-show="isEditor" prop="supplierCode">
            <el-input v-model="ruleForm.supplierCode" disabled class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="供应商COUPA编码" prop="supplierBiCode">
            <el-input v-model="ruleForm.supplierBiCode" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="ruleForm.supplierName" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="Country">
            <el-input v-model="ruleForm.country" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="ruleForm.state" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="(item,index) in ['无效','正常']" :key="item" :label="item" :value="index" />
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
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downloadTemplate">下载模板</el-button>
            <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
          </div>
          <el-button v-if="saveBtn" type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile" @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png" alt="" />
              <span class="text">选择文件</span>
            </div>
            <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)">
            <div class="fileName" v-if="uploadFileName!=''">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
              <span>{{uploadFileName}}</span>
            </div>
          </div>
          <div class="seeData" style="width: auto;">
            <div class="exportError" @click="exportErrorList">
              <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon">
              <span>导出错误信息</span>
            </div>
          </div>
        </div>
        <div class="tableWrap">
          <el-table border height="300" :data="ImportData" style="width: 100%" :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN'
            }" :row-class-name="tableRowClassName" stripe>
            <el-table-column fixed align="center" label="是否通过" width="100">
              <template slot-scope="scope">
                <img v-if="scope.row.judgmentType == 'Error'" :src="errorImg">
                <img v-else-if="scope.row.judgmentType == 'Pass'||scope.row.judgmentType == ''" :src="passImg" style="width:25px;height:25px;">
              </template>
            </el-table-column>
            <el-table-column width="320" align="center" prop="error" label="错误信息" />
            <el-table-column width="150" align="center" prop="supplierCode" label="供应商CP编码" />
            <el-table-column width="180" align="center" prop="supplierBiCode" label="供应商COUPA编码" />
            <el-table-column width="180" align="center" prop="supplierName" label="供应商名称" />
            <el-table-column width="150" align="center" prop="country" label="Country" />
            <el-table-column width="150" align="center" prop="createBy" label="创建人" />
            <el-table-column v-slot={row} width="180" align="center" prop="createDate" label="创建时间">
              {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
            </el-table-column>
            <el-table-column width="150" align="center" prop="state" label="状态">
              <template slot-scope="{ row }">
                <div>
                  {{ row.state ? '正常' : '无效' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

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
} from '@/utils'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'Supplier',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        supplierCode: '',
        supplierName: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        supplierCode: '',
        supplierBiCode: '',
        supplierName: '',
        country: '',
        state: '',
      },
      rules: {
        supplierCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        supplierBiCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        supplierName: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        country: [
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
      checkArr: [], // 批量删除,存放选中
      // 导入
      importVisible: false, // 导入弹窗
      uploadFileName: '',
      uploadFile: '',
      event: '',
      maxheight: getHeight(),
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      ImportData: [],
      override: false, //覆盖数据dialog
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getTableData()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      API.getPageMdSupplier({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        supplierCode: this.filterObj.supplierCode,
        supplierName: this.filterObj.supplierName,
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
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        supplierCode: '',
        supplierName: '',
        state: '',
      }
      this.getTableData()
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        supplierCode: '',
        supplierBiCode: '',
        supplierName: '',
        country: '',
        state: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        supplierCode: obj.supplierCode,
        supplierBiCode: obj.supplierBiCode,
        supplierName: obj.supplierName,
        country: obj.country,
        state: obj.state,
      }
      this.editorId = obj.id
    },
    // 提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const url = this.isEditor
            ? API.updateMdSupplier
            : API.insertMdSupplier
          url({
            id: this.editorId,
            supplierBiCode: this.ruleForm.supplierBiCode,
            supplierName: this.ruleForm.supplierName,
            country: this.ruleForm.country,
            state: this.ruleForm.state,
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
          type: 'warning',
        })
          .then(() => {
            API.deleteMdSupplier(IdList).then((response) => {
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
    // 下载模板
    downloadTemplate() {
      var data = {}
      data = { ...this.filterObj }
      API.exportSupplierTemplate(data).then((res) => {
        this.downloadFile(res, '供应商模板' + '.xlsx') //自定义Excel文件名
        this.$message.success('模板下载成功!')
      })
    },
    exportErrorList() {
      API.exportSupplierEb().then((res) => {
        this.downloadFile(res, '供应商异常信息' + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    // 导入数据
    importData() {
      this.importVisible = true
    },
    // 确认导入
    confirmImport() {
      if (this.override) {
        this.$confirm('已有重复数据，确定要覆盖数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            var formData = new FormData()
            formData.append('file', this.uploadFile)
            API.importSupplier(formData).then((response) => {
              if (response.code === 1000) {
                this.$message.success('导入成功!')
                this.closeImport()
                this.getTableData()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        API.importSupplier(formData).then((response) => {
          if (response.code === 1000) {
            this.$message.success('导入成功!')
            this.closeImport()
            this.getTableData()
          }
        })
      }
    },

    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    //检测数据
    checkImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.checkSupplier(formData).then((response) => {
        if (response.code == 1000) {
          this.ImportData = response.data
          this.saveBtn = response.data[0].judgmentType !== 'Error'
          this.event.srcElement.value = '' // 置空
          this.override =
            response.data[0].judgmentType === 'Exception' ? true : false
        }
      })
    },
    // 关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    // 导出数据
    exportData() {
      // 导出数据筛选
      var data = {}
      data = { ...this.filterObj }
      API.exportSupplier().then((res) => {
        this.downloadFile(res, '供应商信息' + '.xlsx') // 自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    // 下载文件
    downloadFile(res, fileName) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      if (!fileName) {
        fileName = res.headers['content-disposition'].split('filename=').pop()
      }
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      }
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

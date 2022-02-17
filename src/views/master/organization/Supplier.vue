<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">供应商编码</span>
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
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
        <img src="@/assets/images/export.png" alt="">
        <span class="text">导出</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%"
      @selection-change="handleSelectionChange">
     
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="supplierCode" label="供应商编码" />
      <el-table-column width="360" align="center" prop="supplierName" label="供应商名称" />
      <el-table-column width="150" align="center" prop="country" label="country" />
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间" >
        <template slot-scope="{row}">
          <div>
           {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="更新人" />
      <el-table-column width="180" align="center" prop="updateDate" label="更新时间">
        <template slot-scope="{row}">
          <div>
            {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
          </div>
        </template>
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
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="el-form-row">
          <el-form-item v-show="!isEditor" label="供应商编码">
            <el-input v-model="ruleForm.supplierCode" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-show="isEditor" label="供应商编码">
            <el-input v-model="ruleForm.supplierCode" disabled class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input v-model="ruleForm.supplierName" class="my-el-input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="country">
            <el-input v-model="ruleForm.country" class="my-el-input" placeholder="请输入" />
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
    <!-- 导入 -->
    <el-dialog width="25%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <el-button size="mini" class="my-search selectFile" @click="parsingExcelBtn">选择文件</el-button>
        <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
        <div v-if="uploadFileName!=''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
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
import { getDefaultPermissions, parseTime, getTextMap,getHeight } from '@/utils'
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
        supplierName: '',
        country: '',
        remark: '',
      },
      rules: {
        supplierCode: [
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
        supplierName: '',
        country: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        supplierCode: obj.supplierCode,
        supplierName: obj.supplierName,
        country: obj.country,
        remark: obj.remark,
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
            supplierCode: this.ruleForm.supplierCode,
            supplierName: this.ruleForm.supplierName,
            country: this.ruleForm.country,
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
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importSupplier(formData)
        .then((response) => {
          this.closeImport()
        })
        .catch(() => {})
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
      console.log(this.event)
    },
    // 关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
      console.log(this.event)
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

<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">IO编码</span>
          <el-input v-model="filterObj.ioNumber" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">大区:</span>
          <el-select v-model="filterObj.largeAreaName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in largeAreaList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
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
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add" v-permission="permissions['insert']">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed align="center" label="操作" width="100">
        <template slot-scope="{ row }">
          <div class="table_operation" v-permission="permissions['update']">
            <div class="table_operation_detail" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ioNumber" label="IO编码"> </el-table-column>
      <el-table-column align="center" prop="name" label="区域名称"> </el-table-column>
      <el-table-column align="center" prop="code" label="区域编码"> </el-table-column>
      <el-table-column align="center" prop="largeAreaName" label="大区名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间">
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
      <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + 'IO维护'" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="IO编码" prop="ioNumber">
            <el-input v-model="ruleForm.ioNumber" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="区域" prop="regionCode">
            <el-select v-model="ruleForm.regionCode" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="(item) in RegionList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="大区" prop="largeAreaName">
            <el-select v-model="ruleForm.largeAreaName" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="(item, index) in largeAreaDialogList" :key="index" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
           <el-form-item label="状态">
              <el-radio v-model="ruleForm.state" label="0">无效</el-radio>
              <el-radio v-model="ruleForm.state" label="1">正常</el-radio>
            <!-- <el-select v-model="ruleForm.state" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="(item,index) in ['无效','正常']" :key="item" :label="item" :value="index" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" class="my-el-input" placeholder="请输入">
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
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  getHeightSingle,
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'WBS',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        ioNumber: '',
        regionCode: '',
        regionName: '',
        largeAreaName: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      RegionList: [],
      largeAreaList: [],
      largeAreaDialogList: [],
      ruleForm: {
        ioNumber: '',
        regionCode: '',
        regionName: '',
        largeAreaName: '',
        state: '1',
        remark: '',
      },
      rules: {
        ioNumber: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        regionCode: [
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
      maxheight: getHeightSingle(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    this.getRegionList()
    this.getLargeAreaList()
    this.getTableData()
  },
  computed: {},
  watch: {
    'ruleForm.regionCode'() {
      let obj = this.RegionList.find(
        (item) => item.code == this.ruleForm.regionCode
      )
      this.ruleForm.largeAreaName = ''
      this.getLargeAreaListDialog()
      if (obj) this.ruleForm.regionName = obj.name
    },
    'filterObj.regionCode'(value) {
      if (value == '') {
        this.filterObj.regionName = ''
        this.filterObj.largeAreaName = ''
      }
      this.filterObj.largeAreaName = ''
      this.getLargeAreaList()
      let obj = this.RegionList.find(
        (item) => item.code == this.filterObj.regionCode
      )
      if (obj) this.filterObj.regionName = obj.name
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageByIo({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        ioNumber: this.filterObj.ioNumber,
        code: this.filterObj.regionCode,
        name: this.filterObj.regionName,
        largeAreaCode: this.filterObj.largeAreaName,
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
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getLargeAreaList() {
      selectAPI
        .getLargeAreaList({
          parentCode: this.filterObj.regionCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.largeAreaList = res.data
          }
        })
    },
    getLargeAreaListDialog() {
      selectAPI
        .getLargeAreaList({
          parentCode: this.ruleForm.regionCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.largeAreaDialogList = res.data
          }
        })
    },
    add() {
      this.getLargeAreaListDialog()
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        ioNumber: '',
        regionCode: '',
        regionName: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportIo({
        ioNumber: this.filterObj.ioNumber,
        code: this.filterObj.regionCode,
        name: this.filterObj.regionName,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'IO维护 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        ioNumber: '',
        regionCode: '',
        regionName: '',
        largeAreaName: '',
        state: '1',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        ioNumber: obj.ioNumber,
        regionCode: obj.code,
        regionName: obj.name,
        largeAreaName: obj.largeAreaName,
        remark: obj.remark,
        state: String(obj.state),
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor ? API.updateIo : API.insertIo
          url({
            id: this.editorId,
            ioNumber: this.ruleForm.ioNumber,
            code: this.ruleForm.regionCode,
            name: this.ruleForm.regionName,
            state: this.ruleForm.state,
            largeAreaName: this.ruleForm.largeAreaName,
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
            API.deleteIo(IdList).then((response) => {
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

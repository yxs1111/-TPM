<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">分组编码</span>
          <el-input v-model="filterObj.groupCode" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">分组名称</span>
          <el-input v-model="filterObj.groupName" placeholder="请输入" />
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" :loading="tableLoading">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add">新增</el-button>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
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
      <el-table-column width="150" align="center" prop="groupCode" label="分组编码"> </el-table-column>
      <el-table-column width="180" align="center" prop="groupName" label="分组名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="channelCode" label="渠道编码"> </el-table-column>
      <el-table-column width="150" align="center" prop="channelEsName" label="渠道名称"> </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人"> </el-table-column>
      <el-table-column width="180" align="center" prop="createDate" label="创建时间"> </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人"> </el-table-column>
      <el-table-column width="180" align="center" prop="updateDate" label="修改时间"> </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '正常' : '无效' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '客户组'" :visible="dialogVisible" width="25%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="客户组编码" v-show="!isEditor">
            <el-input v-model="ruleForm.groupCode" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="客户组编码" v-show="isEditor">
            <el-input v-model="ruleForm.groupCode" disabled class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="客户组名称">
            <el-input v-model="ruleForm.groupName" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="渠道编码">
            <el-input v-model="ruleForm.channelCode" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="客户编码">
            <el-input v-model="ruleForm.customerCode" class="my-el-input" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="组织编码">
            <el-input v-model="ruleForm.orgCode" class="my-el-input" placeholder="请输入">
            </el-input>
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
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'CustomerTeam',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        groupCode: '',
        groupName: '',
      },
      tableLoading: '',
      categoryArr: [{ label: '19号线', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        groupCode: '',
        groupName: '',
        channelCode: '',
        customerCode: '',
        orgCode: '',
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
      checkArr: [], //批量删除,存放选中
      dialogVisible: false,
      isEditor: '',
      editorId: '',
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
      API.getPageMdCustomerGroup({
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
    search() {
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        groupCode: '',
        groupName: '',
      }
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        groupCode: '',
        groupName: '',
        channelCode: '',
        customerCode: '',
        orgCode: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        groupCode: obj.groupCode,
        groupName: obj.groupName,
        channelCode: obj.channelCode,
        customerCode: obj.customerCode,
        orgCode: obj.orgCode,
        remark: obj.remark,
      }
      this.editorId = obj.id
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor
            ? API.updateMdCustomerGroup
            : API.insertMdCustomerGroup
          url({
            id: this.editorId,
            groupCode: this.ruleForm.groupCode,
            groupName: this.ruleForm.groupName,
            channelCode: this.ruleForm.channelCode,
            customerCode: this.ruleForm.customerCode,
            orgCode: this.ruleForm.orgCode,
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
            API.deleteMdCustomerGroup(IdList).then((response) => {
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

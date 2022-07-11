<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">Cost Type:</span>
          <el-select v-model="filterObj.costType" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in costTypeList" :key="index" :label="item.costType" :value="item.costTypeNumber" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package</span>
          <el-select v-model="filterObj.minePackage" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Department</span>
          <el-input v-model="filterObj.department" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
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
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
      <el-table-column fixed align="center" label="操作">
        <template slot-scope="{ row }">
          <div class="table_operation">
            <div class="table_operation_detail" v-permission="permissions['update']" @click="editor(row)">
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costType" fixed label="Cost Type"> </el-table-column>
      <el-table-column width="180" align="center" prop="minePackage" fixed label="Mine Package"> </el-table-column>
      <el-table-column width="180" align="center" prop="channelName" fixed label="渠道"> </el-table-column>
      <el-table-column width="180" align="center" prop="zoneName" fixed label="大区"> </el-table-column>
      <el-table-column width="180" align="center" prop="departmentId" label="Department ID"> </el-table-column>
      <el-table-column width="180" align="center" prop="departmentName" label="Department"> </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" v-slot="{ row }" align="center" prop="createDate" label="创建时间">
        {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column width="280" align="center" prop="updateBy" label="修改人" />
      <el-table-column width="180" v-slot="{ row }" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="remark" label="备注"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + 'Package&部门匹配关系'" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="el-form-row">
          <el-form-item label="Cost Type" prop="costType">
            <el-select v-model="ruleForm.costTypeIndex" class="my-el-input" @change="changeCostTypeIndex" clearable filterable placeholder="请选择">
              <el-option v-for="item,index in costTypeList" :key="index" :label="item.costType" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mine Package" prop="minePackage">
            <el-select v-model="ruleForm.minePackageIndex" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="item,index in minePackageListDialog" :key="index" :label="item.costType" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道" prop="channelCode">
            <el-select v-model="ruleForm.channelCode" class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="大区">
            <el-select v-model="ruleForm.zoneName" class="my-el-input" @change="getDepartment" clearable filterable placeholder="请选择">
               <el-option v-for="item,index in largeAreaList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="Department ID" prop="departmentId">
            <el-input v-model="ruleForm.departmentId" disabled class="my-el-input">
            </el-input>
          </el-form-item>
          <el-form-item label="Department">
            <el-select v-model="ruleForm.departmentName" @change="getDepartmentId" multiple class="my-el-input" clearable filterable placeholder="请选择">
              <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName" :value="item.departmentName" />
            </el-select>
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
  getHeight,
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'pdMatchingRelationship',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        costTypeIndex: '',
        costType: '',
        costTypeNumber: '',
        minePackage: '',
        channelCode: '',
        department: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      minePackageList: [],
      minePackageListDialog: [],
      costTypeList: [],
      channelOptions: [],
      largeAreaList: [],
      departmentList: [],
      ruleForm: {
        costTypeIndex: '',
        costType: '',
        costTypeNumber: '',
        minePackageIndex: '',
        minePackage: '',
        minePackageCode: '',
        channelCode: '',
        zoneName: '',
        departmentId: '',
        departmentName: [],
      },
      rules: {
        costType: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        minePackage: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        departmentId: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        channelCode: [
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
      maxheight: getHeight(),
      oldDepartmentName: [],
      oldDepartmentId: null,
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
    this.getQueryChannelSelect()
    this.getMinePackageList()
    this.getLargeAreaList()
    this.getDepartmentList()
    this.getCostTypeList()
  },
  watch: {
    'filterObj.costType'() {
      this.filterObj.minePackage = ''
      this.getMinePackageList()
    },
    // 'ruleForm.costTypeIndex'() {
    //   if(this.ruleForm.costTypeIndex!=='') {
    //     this.ruleForm.costType=this.costTypeList[this.ruleForm.costTypeIndex].costType
    //     this.ruleForm.costTypeNumber=this.costTypeList[this.ruleForm.costTypeIndex].costTypeNumber
    //     // this.ruleForm.minePackageIndex = ''
    //     this.getMinePackageListDialog()
    //   }
      
    // },
    'ruleForm.minePackageIndex'() {
      if (this.ruleForm.minePackageIndex!==''&&this.minePackageListDialog.length) {
        this.ruleForm.minePackage=this.minePackageListDialog[this.ruleForm.minePackageIndex].costType
        this.ruleForm.minePackageCode=this.minePackageListDialog[this.ruleForm.minePackageIndex].costTypeNumber
      }
      
    },
  },
  computed: {},
  methods: {
    changeCostTypeIndex() {
      if(this.ruleForm.costTypeIndex!=='') {
        this.ruleForm.costType=this.costTypeList[this.ruleForm.costTypeIndex].costType
        this.ruleForm.costTypeNumber=this.costTypeList[this.ruleForm.costTypeIndex].costTypeNumber
        this.ruleForm.minePackageIndex = ''
        this.getMinePackageListDialog()
      }
    },
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPagePdMatchingRelationship({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        costType: this.filterObj.costType,
        minePackage: this.filterObj.minePackage,
        channelName: this.filterObj.channelCode,
        departmentName: this.filterObj.department,
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
    getMinePackageList() {
      selectAPI.queryMinePackageSelect({
        parentId: this.filterObj.costType,
      }).then((res) => {
        if (res.code === 1000) {
          this.minePackageList = res.data
        }
      })
    },
    async getMinePackageListDialog() {
      await selectAPI.queryMinePackageSelect({
        parentId: this.ruleForm.costTypeNumber,
      }).then((res) => {
        if (res.code === 1000) {
          this.minePackageListDialog = res.data
        }
      })
    },
    getDepartmentList() {
      selectAPI.getDepartmentList().then((res) => {
        if (res.code === 1000) {
          this.departmentList = res.data
        }
      })
    },
    getLargeAreaList() {
      API
        .getMatchingRelationZone({
          parentCode: '',
        })
        .then((res) => {
          if (res.code === 1000) {
            this.largeAreaList = res.data
          }
        })
    },
    getCostTypeList() {
      selectAPI
        .getCostTypeList({
          costLevel: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.costTypeList = res.data
          }
        })
    },
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.channelOptions = res.data
        }
      })
    },
    getDepartment() {
      API.getExistingData({
        costType: this.ruleForm.costType,
        minePackage: this.ruleForm.minePackage,
        channelName: this.ruleForm.channelCode,
        zoneName: this.ruleForm.zoneName,
      }).then((res) => {
        if (res.code == 1000) {
          this.ruleForm.departmentId=res.data.departmentId
          this.oldDepartmentId=res.data.departmentId
          if (res.data.departmentName) {
            this.ruleForm.departmentName=res.data.departmentName.split(",")
            this.oldDepartmentName=res.data.departmentName.split(",")
          }
          
        }
      })
    },
    getDepartmentId() {
      let departmentId='';
      this.ruleForm.departmentName.forEach(item=>{
        let index=this.departmentList.findIndex(department=>department.departmentName==item)
        if(index!=-1) {
          departmentId+=this.departmentList[index].departmentId+','
        }
      })
      if(departmentId) {
        this.ruleForm.departmentId=departmentId.slice(0,-1)
      } else {
        this.ruleForm.departmentId=''
      }
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
        brandCode: '',
        brandName: '',
        state: '',
      }
      this.getTableData()
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        costTypeIndex: '',
        costType: '',
        costTypeNumber: '',
        minePackageIndex: '',
        minePackage: '',
        minePackageCode: '',
        channelCode: '',
        zoneName: '',
        departmentId: '',
        departmentName: [],
      }
      this.minePackageListDialog=[]
    },
    async editor(obj) {
      if(!obj.state) {
        this.$message.info("该数据已无效,不能编辑")
        return
      }
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        costTypeIndex: this.getCostTypeIndex(obj.costType),
        costType: obj.costType,
        costTypeNumber: obj.costTypeNumber,
        minePackage: obj.minePackage,
        minePackageIndex: '',
        minePackageCode: obj.minePackageCode,
        channelCode: obj.channelName,
        zoneName: obj.zoneName,
        departmentId: obj.departmentId,
        departmentName: obj.departmentName.split(','),
      }
      await this.getMinePackageListDialog()
      this.ruleForm.minePackageIndex=this.getMinePackageIndex(obj.minePackageCode)
      this.editorId = obj.id
    },
    getCostTypeIndex(costType) {
      return this.costTypeList.findIndex(item=>item.costType==costType)
    },
    getMinePackageIndex(minePackageCode) {
      return this.minePackageListDialog.findIndex(item=>item.costTypeNumber==minePackageCode)
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.isEditor ? API.updatePdMatchingRelationship : API.addPdMatchingRelationship
          url({
            id: this.editorId,
            costType: this.ruleForm.costType,
            minePackage: this.ruleForm.minePackage,
            minePackageCode: this.ruleForm.minePackageCode,
            channelName: this.ruleForm.channelCode,
            zoneName: this.ruleForm.zoneName,
            departmentId: this.ruleForm.departmentId,
            departmentName: this.ruleForm.departmentName.join(","),
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
            API.deletePdMatchingRelationship(IdList).then((response) => {
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
    //导出数据
    exportData() {
      API.exportPdMatchingRelationship({
        costType: this.filterObj.costType,
        minePackage: this.filterObj.minePackage,
        channelName: this.filterObj.channelCode,
        departmentName: this.filterObj.department,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, 'Package&部门匹配关系 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    checkSelectable(row) {
      return row.state === 1
    },
    handleSelectionChange(val) {
      this.checkArr = val
      console.log(val)
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

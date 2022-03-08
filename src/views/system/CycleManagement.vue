<!--
 * @Description: 周期管理
 * @Date: 2022-02-28 13:50:00
 * @LastEditTime: 2022-03-08 11:50:01
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-date-picker v-model="filterObj.activityMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
          </el-date-picker>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="showAddDialog">新增</el-button>
      <el-button type="primary" icon="el-icon-circle-close" class="TpmButtonBG" @click="closeTheAccount">关账</el-button>
    </div>
    <el-table :data="tableData" :max-height="maxheight" :cell-style="columnStyle" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" :selectable="checkSelectable"  />
      <el-table-column align="center" fixed type="index" label="序号" width="80">
        <template slot-scope="scope">
          <div>
            {{ (pageNum - 1) * pageSize + 1 + scope.$index }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" fixed="left" prop="activityMonth" label="活动月" />
      <el-table-column width="280" align="center" prop="startAndEndVZero" label="V0" />
      <el-table-column width="280" align="center" prop="startAndEndVOne" label="V1" />
      <el-table-column width="280" align="center" prop="startAndEndVTwo" label="V2" />
      <el-table-column width="280" align="center" prop="startAndEndVThree" label="V3" />
      <el-table-column  width="150" align="center" prop="openingStatus" label="开启状态">
        <template slot-scope="scope">
          <div>
            <el-switch disabled v-model="scope.row.openingStatus" :active-value="1"   :inactive-value="2">
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="createBy" label="开启人" />
      <el-table-column v-slot="{ row }" width="180" align="center" prop="createDate" label="开启时间">
        {{ row.createDate ? row.createDate.replace('T',' ') : '' }}
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog width="30%" class="my-el-dialog" title="新增账期" :visible="addVisible" @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="el-form-row">
          <el-form-item label="活动月" prop="ioNumber">
            <el-input v-model="ruleForm.activityMonth" disabled class="my-el-dateRange" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="V0" prop="startAndEndVZero">
            <el-date-picker v-model="ruleForm.startAndEndVZero" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V1" prop="startAndEndVOne">
            <el-date-picker v-model="ruleForm.startAndEndVOne" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V2" prop="startAndEndVTwo">
            <el-date-picker v-model="ruleForm.startAndEndVTwo" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V3" prop="startAndEndVThree">
            <el-date-picker v-model="ruleForm.startAndEndVThree" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAdd('ruleForm')">确 定</el-button>
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
  FormateThousandNum,
  getHeight,
  parseTime,
} from '@/utils'
import API from '@/api/system/CycleConfig'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'CycleManagement',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        activityMonth: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {
        activityMonth: '',
        startAndEndVZero: '',
        startAndEndVOne: '',
        startAndEndVTwo: '',
        startAndEndVThree: '',
      },
      rules: {
        activityMonth: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        startAndEndVZero: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        startAndEndVOne: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        startAndEndVTwo: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        startAndEndVThree: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      // 导入
      addVisible: false, // 导入弹窗
      uploadFileName: '',
      ImportData: [],
      uploadFile: '',
      event: '',
      saveBtn: false,
      maxheight: getHeight(),
      checkArr: [],
    }
  },
  computed: {
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getTableData()
  },
  activated() {
    this.maxheight = getHeight()
  },

  methods: {
    // 获取表格数据
    getTableData() {
      API.getPageCycleConfig({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        activityMonth: this.filterObj.activityMonth,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导入数据
    showAddDialog() {
      this.addVisible = true
      this.getInfoYearAndMonth()
    },
    getInfoYearAndMonth() {
      API.getInfoByYearAndMonth().then((response) => {
        this.ruleForm.activityMonth = response.data.activityMonth
        this.ruleForm.startAndEndVZero = this.FormDateRange(
          response.data.startAndEndVZero
        )
        this.ruleForm.startAndEndVOne = this.FormDateRange(
          response.data.startAndEndVOne
        )
        this.ruleForm.startAndEndVTwo = this.FormDateRange(
          response.data.startAndEndVTwo
        )
        this.ruleForm.startAndEndVThree = this.FormDateRange(
          response.data.startAndEndVThree
        )
      })
    },
    //日期范围格式化
    FormDateRange(date) {
      let list = date.split('-')
      list.forEach(item=>{
        item=item.trim()
      })
      return list
    },
    FormDataRangeTransfer(dateList) {
      return dateList[0] + ' - ' + dateList[1]
    },
    closeDialog() {
      this.addVisible = false
      this.ruleForm = {
        activityMonth: '',
        startAndEndVZero: '',
        startAndEndVOne: '',
        startAndEndVTwo: '',
        startAndEndVThree: '',
      }
    },
    //提交form
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.confirmCycleConfig({
            activityMonth: this.ruleForm.activityMonth,
            startAndEndVZero: this.FormDataRangeTransfer(
              this.ruleForm.startAndEndVZero
            ),
            startAndEndVOne: this.FormDataRangeTransfer(
              this.ruleForm.startAndEndVOne
            ),
            startAndEndVTwo: this.FormDataRangeTransfer(
              this.ruleForm.startAndEndVTwo
            ),
            startAndEndVThree: this.FormDataRangeTransfer(
              this.ruleForm.startAndEndVThree
            ),
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
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    //关账
    closeTheAccount() {
      if (this.checkArr.length != 1)
        return this.$message.error('请选择一条数据')
      else {
        var Id = ''
        this.checkArr.forEach((item) => {
          Id = item.id
        })
        this.$confirm('确定要关账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.closeTheAccount({ id: Id }).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                if(response.data.status==="success") {
                  this.$message.success(response.data.msg)
                } else if(response.data.status==="fail") {
                  this.$message.info(response.data.msg)
                }
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
    checkSelectable(row) {
      return row.openingStatus===1
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
    columnStyle({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0 || columnIndex === 10) {
      //   return 'background:#fff!important'
      // }
    },
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
  },
}
</script>

<style lang="scss" scoped>
.importDialog {
  height: 600px;
}
.el-form-row .my-el-dateRange {
  width: 242px !important;
  border-radius: 5px;
  margin-right: 20px;
}
</style>

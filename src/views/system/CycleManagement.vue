<!--
 * @Description: 周期管理
 * @Date: 2022-02-28 13:50:00
 * @LastEditTime: 2022-08-03 14:47:57
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
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
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
      <el-table-column width="150" align="center" fixed="left" prop="activityMonth" label="活动月" />
      <el-table-column width="280" align="center" prop="startAndEndVZero" label="V0" />
      <el-table-column width="280" align="center" prop="startAndEndVOne" label="V1" />
      <el-table-column width="280" align="center" prop="startAndEndVTwo" label="V2" />
      <el-table-column width="280" align="center" prop="startAndEndVThree" label="V3" />
      <el-table-column width="150" align="center" prop="leWeek" label="LE销量Week" />
      <el-table-column width="150" align="center" prop="leVtwoDate" label="V2LE销量日期" />
      <el-table-column width="150" align="center" prop="leVthreeDate" label="V3实际销量日期" />
      <!-- <el-table-column width="180" align="center" prop="fmcV2MtdNumberDate" label="获取MTD人数日期" />
      <el-table-column width="180" align="center" prop="rsV2MtdVolDate" label="获取MTD场次日期" /> -->
      <el-table-column width="150" align="center" prop="openingStatus" label="开启状态">
        <template slot-scope="scope">
          <div>
            <el-switch disabled v-model="scope.row.openingStatus" :active-value="1" :inactive-value="2">
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
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog width="55%"  :title="(isEditor ? '修改' : '新增') + '账期'" :visible="addVisible" @close="closeDialog" class="my-el-dialog">
      <div class="el-dialogContent">
        <el-form class="el-form-row">
          <div class="Selectli el_Dialog_dateRange" style="margin-bottom: 10px;width:50%">
            <span class="SelectliTitle" style="margin-right: 2px;">活动月</span>
            <el-input v-model="ruleForm.activityMonth" disabled class="my-el-dateRange" placeholder="请输入">
            </el-input>
          </div>
          <div class="Selectli" style="visibility: hidden;width:50%">
            <span class="SelectliTitle">活动月</span>
            <el-input v-model="ruleForm.activityMonth" disabled class="my-el-dateRange" placeholder="请输入">
            </el-input>
          </div>
        </el-form>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="el-form-row">
          <el-form-item label="V0" v-if="!isEditor" prop="startAndEndVZero" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVZero" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V1" v-if="!isEditor" prop="startAndEndVOne" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVOne" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V2" v-if="!isEditor" prop="startAndEndVTwo" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVTwo" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V3" v-if="!isEditor" prop="startAndEndVThree" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVThree" class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V0" v-if="isEditor" prop="startAndEndVZero" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVZero" disabled class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V1" v-if="isEditor" prop="startAndEndVOne" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVOne" disabled class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V2" v-if="isEditor" prop="startAndEndVTwo" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVTwo" disabled class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V3" v-if="isEditor" prop="startAndEndVThree" class="el_Dialog_dateRange">
            <el-date-picker v-model="ruleForm.startAndEndVThree" disabled class="my-el-dateRange" type="daterange" value-format="yyyy/MM/dd" format="yyyy/MM/dd" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="LE销量Week" prop="leWeek"  class="el_Dialog_dateRange el-form_le">
            <el-select v-model="ruleForm.leWeek" clearable filterable class="my-el-dateRange" placeholder="请选择">
              <el-option v-for="item,index in ['W1','W2','W3','W4','W5']" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="V2LE销量日期" prop="leVtwoDate"  class="el_Dialog_dateRange el-form_le">
            <el-date-picker v-model="ruleForm.leVtwoDate" type="date" class="my-el-dateRange" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="V3实际销量日期" prop="leVthreeDate"  class="el_Dialog_dateRange el-form_levThree">
            <el-date-picker v-model="ruleForm.leVthreeDate" type="date" class="my-el-dateRange" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="获取MTD人数日期" prop="fmcV2MtdNumberDate"  class="el_Dialog_dateRange el-form_levThree">
            <el-date-picker v-model="ruleForm.fmcV2MtdNumberDate" type="date" class="my-el-dateRange" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="获取MTD场次日期" prop="rsV2MtdVolDate"  class="el_Dialog_dateRange el-form_levThree">
            <el-date-picker v-model="ruleForm.rsV2MtdVolDate" type="date" class="my-el-dateRange" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="V2LE销量日期" prop="leVtwoDate"  class="el_Dialog_dateRange" style="visibility: hidden;width:50%">
            <el-date-picker v-model="ruleForm.leVtwoDate" type="date" class="my-el-dateRange" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmAdd('ruleForm')" v-if="!isConfirm">检 测</el-button>
        <el-button type="primary" @click="confirmAdd('ruleForm')" v-if="isConfirm">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
      <el-divider></el-divider>
      <el-form class="el-form-row" v-if="statusList.length">
        <div class="statusLi" v-for="item,key in statusList" :key="key">
          <img :src=errorImg alt="" class="statusImg" v-if="item.exceptionType==1">
          <img :src="excepImg" alt="" class="statusImg" v-if="item.exceptionType==2">
          <img :src="passImg" alt="" class="statusImg" v-if="item.exceptionType==0">
          <div class="statusContent">
            <div class="statusTop">
              <div class="statusTopLeft">
                <span :class="item.exceptionType==0?'statusTitle':item.exceptionType==1?'statusTitle_error':item.exceptionType==2?'statusTitle_warning':''">{{item.itemName}}</span>
                <span class="ParticleSize">粒度：{{item.particle}}</span>
              </div>
              <div class="statusTopRight">
                <span v-if="item.isOpen" @click="PackUp(key)">收起<i class="el-icon-arrow-up"></i></span>
                <span v-if="!item.isOpen" @click="PackDown(key)">展开<i class="el-icon-arrow-down"></i></span>
              </div>
            </div>
            <div class="detailContent" v-show="item.isOpen">
              <div class="detailContentItem" v-for="sitem,sindex in item.children" :key="sindex">{{sitem.itemDesc}}</div>
            </div>
          </div>
        </div>
      </el-form>
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
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      total: 0,
      pageSize: 100,
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
        leWeek: 'W3',
        leVthreeDate: '',
        leVtwoDate: '',
        fmcV2MtdNumberDate: '',
        rsV2MtdVolDate: '',
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
        leWeek: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        leVtwoDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        leVthreeDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        fmcV2MtdNumberDate: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        rsV2MtdVolDate: [
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
      isConfirm: 0,
      statusList: [],
      isEditor: '',
      editorId:'',
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
      list.forEach((item) => {
        item = item.trim()
      })
      return list
    },
    FormDataRangeTransfer(dateList) {
      return dateList[0].trim() + ' - ' + dateList[1].trim()
    },
    closeDialog() {
      this.addVisible = false
      this.statusList = []
      this.isConfirm = 0
      this.isEditor = false
      this.ruleForm = {
        activityMonth: '',
        startAndEndVZero: '',
        startAndEndVOne: '',
        startAndEndVTwo: '',
        startAndEndVThree: '',
        leWeek: 'W3',
        leVthreeDate: '',
        leVtwoDate: '',
        fmcV2MtdNumberDate: '',
        rsV2MtdVolDate: '',
      }
    },
    //提交form
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isConfirm) {
            let url=this.isEditor?API.updateCycleConfig:API.confirmCycleConfig
            url({
              id: this.editorId,
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
              leWeek:this.ruleForm.leWeek,
              leVtwoDate:this.ruleForm.leVtwoDate,
              leVthreeDate:this.ruleForm.leVthreeDate,
              fmcV2MtdNumberDate:this.ruleForm.fmcV2MtdNumberDate,
              rsV2MtdVolDate:this.ruleForm.rsV2MtdVolDate,
            }).then((response) => {
              if (response.code === 1000) {
                this.$message.success(`${this.isEditor?'修改':'添加'}成功`)
                this.resetForm(formName)
                this.getTableData()
              }
            })
          } else {
            API.checkComplete({
              activityMonth: this.ruleForm.activityMonth,
            }).then((response) => {
              if (response.code === 1000) {
                let obj = response.data
                let list = []
                for (const key in obj) {
                  if (Object.hasOwnProperty.call(obj, key)) {
                    const element = obj[key]
                    let template = {
                      exceptionType: element[0].exceptionType,
                      itemName: element[0].itemName,
                      particle: element[0].particle,
                      isOpen: 0,
                      children: [],
                    }
                    template.children = element
                    list.push(template)
                  }
                }
                let errorList = list.filter((item) => {
                  return item.exceptionType == 1
                })
                if (errorList.length == 0) {
                  this.isConfirm = 1
                } else {
                  this.isConfirm = 0
                }
                console.log(errorList)
                this.statusList = list
              }
            })
          }
        } else {
          this.$message.error('提交失败')
          return false
        }
      })
    },
    getFormatDateRange(dateStr) {
      if(dateStr) {
        let list=dateStr.split(' - ')
        console.log(list);
        return list
      }
    },
    editor(obj) {
      this.isEditor = true
      this.addVisible = true
      this.editorId = obj.id
      this.ruleForm = {
        activityMonth: obj.activityMonth,
        startAndEndVZero: this.getFormatDateRange(obj.startAndEndVZero),
        startAndEndVOne: this.getFormatDateRange(obj.startAndEndVOne),
        startAndEndVTwo: this.getFormatDateRange(obj.startAndEndVTwo),
        startAndEndVThree: this.getFormatDateRange(obj.startAndEndVThree),
        leWeek: obj.leWeek,
        leVtwoDate: obj.leVtwoDate,
        leVthreeDate: obj.leVthreeDate,
        fmcV2MtdNumberDate: obj.fmcV2MtdNumberDate,
        rsV2MtdVolDate: obj.rsV2MtdVolDate,
      }
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
                if (response.data.status === 'success') {
                  this.$message.success(response.data.msg)
                } else if (response.data.status === 'fail') {
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
      return row.openingStatus === 1
    },
    PackUp(index) {
      this.statusList.forEach((item) => {
        item.isOpen = 0
      })
      this.statusList[index].isOpen = 0
      this.$forceUpdate()
      console.log(this.statusList[index].isOpen)
    },
    PackDown(index) {
      this.statusList.forEach((item) => {
        item.isOpen = 0
      })
      this.statusList[index].isOpen = 1
      this.$forceUpdate()
      console.log(this.statusList[index].isOpen)
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
  .el-input__inner {
    height: 37px;
    width: 242px!important;
  }
  .el-input--suffix {
    width: 242px !important;
  }
}
.el_Dialog_dateRange {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.statusLi {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  .statusImg {
    width: 25px;
    height: 25px;
    margin-right: 20px;
  }
  .statusContent {
    width: calc(100% - 50px);
    .statusTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .statusTitle {
        font-size: 16px;
        font-weight: 600;
        color: #74bb8b;
        //error e2887c
        //warning f4bb40
        //pass  74bb8b
      }
      .statusTitle_error {
        font-size: 16px;
        font-weight: 600;
        color: #e2887c;
        //error e2887c
        //warning f4bb40
        //pass  74bb8b
      }
      .statusTitle_warning {
        font-size: 16px;
        font-weight: 600;
        color: #f4bb40;
        //error e2887c
        //warning f4bb40
        //pass  74bb8b
      }
      .ParticleSize {
        font-size: 14px;
        color: #666;
        margin-left: 20px;
      }
    }
    .detailContent {
      width: 100%;
      max-height: 400px;
      overflow-y: auto;
      background-color: #f5f8fa;
      .detailContentItem {
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #b8b9bb;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
    .statusTopRight {
      cursor: pointer;
    }
  }
}
.app-container {
  border-radius: 16px;
  overflow: hidden;
}
.app-container .el-form-row {
    display: flex;
    justify-content: center;
    flex-direction: row !important;
    flex-wrap: wrap;
    align-items: center;
}
</style>
<style lang="scss">
.el-form-row .my-el-dateRange {
  width: 242px !important;
  border-radius: 5px;
  margin-right: 20px;
  .el-input__inner {
    height: 37px;
    width: 242px!important;
  }
  .el-input--suffix {
    width: 242px !important;
  }
}
.el-form_le .el-form-item__label {
  margin-left: -65px;
}
.el-form_levThree .el-form-item__label {
  margin-left: -85px;
}
</style>

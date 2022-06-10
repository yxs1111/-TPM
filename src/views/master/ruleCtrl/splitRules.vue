// 拆分规则
<template>
  <div class="app-container" style="border-radius:0px;">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.channelCode" placeholder="请选择" clearable>
            <el-option v-for="item in channelOptons" :key="item.channelCode" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">年月：</span>
          <el-date-picker v-model="filterObj.yeardate" type="month" value-format="yyyyMM" placeholder="请选择" clearable />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">版本：</span>
          <el-select v-model="filterObj.varsionName" placeholder="请选择" clearable>
            <el-option v-for="item in versionsArr" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">拆分类型：</span>
          <el-select v-model="filterObj.splitType" placeholder="请选择" clearable>
            <el-option v-for="item in splitTypeArr" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG"  @click="getTableData" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportExcelInfo" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <!-- 查询条件 -->
    <!-- <el-form ref="modelSearchForm" :inline="true" :model="filterObj" class="demo-form-inline">
      <el-form-item label="年月：">
        <el-date-picker v-model="filterObj.yeardate" type="month" value-format="yyyyMM" placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="版本：">
        <el-select v-model="filterObj.varsionName" placeholder="请选择" clearable>
          <el-option v-for="item in versionsArr" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="拆分类型：">
        <el-select v-model="filterObj.splitType" placeholder="请选择" clearable>
          <el-option v-for="item in splitTypeArr" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG" @click="getTableData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <div class="TpmButtonBG" @click="exportExcelInfo">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </el-form-item>
    </el-form> -->
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-plus" @click="add" v-permission="permissions['insert']">新增</el-button>
      <el-button
        type="danger"
        v-permission="permissions['delete']"
        class="TpmButtonBG"
        icon="el-icon-delete"
        size="small"
        @click="mutidel"
      >删除</el-button>
    </div>
    <el-table
      ref="Tdata"
      :data="tableData"
      border
      :max-height="maxheight"
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      stripe
      style="width: 100%"
    >
      <el-table-column type="selection" fixed="left" align="center" />
      <el-table-column width="180" align="center" fixed="left" prop="updateDate" label="操作">
        <template slot-scope="scope">
          <div class="table_operation" v-permission="permissions['update']">
            <div class="table_operation_detail" @click="editor(scope.row)">
              <i class="el-icon-edit-outline" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="channelCode" label="渠道" />
      <el-table-column width="100" align="center" prop="yeardate" label="年月" />
      <el-table-column width="220" align="center" prop="varsionName" label="版本" />
      <!-- <el-table-column width="200" align="center" prop="costType" label="Mine Package" /> -->
      <el-table-column width="150" align="center" prop="splitType" label="拆分类型">
        <template slot-scope="scope">
          {{ scope.row.splitType === 1 ? '连续拆分':'不连续拆分' }}
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" prop="splitRule" label="拆分规则" />
      <el-table-column width="120" align="center" prop="splitWeight" label="权重" />
      <el-table-column width="260" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createDate===null ? '': scope.row.createDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人" />
      <el-table-column width="180" align="center" prop="updateDate" label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.updateDate===null ? '': scope.row.updateDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="" align="center" prop="remark" label="备注" />
      
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[100, 200, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增 -->
    <el-dialog v-el-drag-dialog class="my-el-dialog" :title="(isEditor ? '修改' : '新增') + '信息'" :visible="dialogVisible" width="695px" @close="closeDialog">
      <div class="el-dialogContent">
        <div style="margin-bottom:15px;">
          <el-row :gutter="20" style="margin-bottom:8px;">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span style="color:red;">*</span>渠道：
                <el-select v-model="dialogAdd.channelCode" placeholder="请选择" size="small" :disabled="isEditor">
                  <el-option
                    v-for="item in channelOptons"
                    :key="item.channelCode"
                    :label="item.channelEsName"
                    :value="item.channelCode"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" style="padding-left: 60px;">
                <span style="color:red;">*</span>年月：
                <el-date-picker v-model="dialogAdd.yeardate" value-format="yyyyMM" type="month" placeholder="请选择" size="small" :disabled="isEditor" />
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom:8px;">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span style="color:red;">*</span>费用类型：
                <el-select v-model="dialogAdd.minePackageCodeP" placeholder="请选择" size="small" :disabled="isEditor" @change="getQueryMinePackageSelectDialog">
                  <el-option
                    v-for="item in MPA"
                    :key="item.costType"
                    :label="item.costType"
                    :value="item.costTypeNumber"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span style="color:red;">*</span>Mine Package：
                <el-select v-model="dialogAdd.minePackageCode" placeholder="请选择" size="small" :disabled="isEditor">
                  <el-option
                    v-for="item in mpOptonsDialog"
                    :key="item.costTypeNumber"
                    :label="item.costType"
                    :value="item.costTypeNumber"
                  />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom:8px;">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <span style="color:red;">*</span>版本：
                <el-select v-model="dialogAdd.varsionName" placeholder="请选择" clearable :disabled="isEditor" size="small">
                  <el-option v-for="item in versionsArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" style="padding-left: 31px;">
                <span style="color:red;">*</span>拆分类型：
                <el-select v-model="dialogAdd.splitType" placeholder="请选择" size="small" :disabled="isEditor">
                  <el-option v-for="item in splitTypeArr" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content bg-purple" style="padding-left:5px;">
                备注：
                <el-input v-model="dialogAdd.remark" style="width: 190px;" placeholder="请输入内容" size="small" />
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="dialogAdd.splitType===2">
          <el-button plain type="primary" size="mini" icon="el-icon-plus" @click="handleAddDetails">添加一行</el-button>
          <el-button
            type="success"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteDetails"
          >删除</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDeleteAllDetails"
          >清空</el-button>
        </div>
        <!-- 分割线 -->
        <div style="height:1px;background:#dcdfe6;margin:20px 0px;" />
        <div v-if="dialogAdd.splitType===1" style="text-align:center;">
          拆分规则：
          P&nbsp;
          <el-input v-model="dialogAdd.splitRuleF" style="width:60px;" size="small" @blur="number($event)" />
          &nbsp;M
          <!-- —— P&nbsp;
          <el-input v-model="dialogAdd.splitRuleS" style="width:60px;" size="small" @blur="number($event)" />
          &nbsp;M -->
        </div>
        <div v-if="dialogAdd.splitType===2" style="border: 1px solid #dcdfe6;">
          <el-table ref="tb" :data="systemList" :row-class-name="rowClassName" @selection-change="handleDetailSelectionChange">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column type="index" label="序号" align="center" width="50" /> -->
            <el-table-column label="拆分规则" align="center" prop="fs">
              <template slot-scope="scope">
                P&nbsp;
                <el-input v-model="systemList[scope.row.xh-1].splitRuleF" style="width:60px;" size="small" placeholder="请输入" @blur="numberNo($event, scope.row.xh-1)" />
                &nbsp;M —— P&nbsp;
                <el-input v-model="systemList[scope.row.xh-1].splitRuleS" style="width:60px;" size="small" placeholder="请输入" @blur="numberNo($event, scope.row.xh-1)" />
                &nbsp;M
              </template>
            </el-table-column>
            <el-table-column label="权重（%）" align="center" prop="cdmName">
              <template slot-scope="scope">
                <el-input v-model="systemList[scope.row.xh-1].splitWeight" style="width:130px;" size="small" placeholder="请输入数字" @blur="numberNoWeight($event, scope.row.xh-1)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!isEditor" type="primary" @click="submitForm()">保 存</el-button>
        <el-button v-if="isEditor" type="primary" @click="submitFormUpdate()">修 改</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions,getHeight } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'SplitRules',
  directives: { elDragDialog, permission },

  data() {
    return {
      mpOptonsDialog: [],
      MPA: [],
      dialogVisibleT: false,
      versionsArr: [],
      splitTypeArr: [{
        key: 1,
        value: '连续拆分'
      },
      {
        key: 2,
        value: '不连续拆分'
      }],
      checkArr: [], // 批量删除,存放选中
      channelOptons: [],
      skuOptons: [],
      mpOptons: [],
      systemList: [],
      cdmTypeOptions: [
        {
          code: 'cdm1',
          name: '打折'
        },
        {
          code: 'cdm2',
          name: '特价'
        },
        {
          code: 'cdm3',
          name: '满减'
        }
      ],
      checkedDetail: [],
      dialogAdd: {
        channelCode: '',
        costTypeNumber: '',
        remark: '',
        yeardate: '',
        varsionName: '',
        splitType: '',
        minePackageCodeP: '',
        minePackageCode: '',
        splitWeight: '',
        splitRuleF: ''
        // splitRuleS: ''
      },
      dialogVisible: false,
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        yeardate: '',
        varsionName: '',
        splitType: ''
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      ruleForm: {},
      rules: {
        channelCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur'
          }
        ]
      },
      isEditor: false,
      editorId: '',
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
    this.getQueryChannelSelect()
    // this.getQueryMinePackageSelect()
    this.getDictInfoByType()
  },
  methods: {
    Reset() {
      this.filterObj = {
        channelCode: '',
        yeardate: '',
        varsionName: '',
        splitType: ''
      }
      this.getTableData()
    },
    number(e) {
      const flag = new RegExp('^[1-9]([0-9])*$').test(e.target.value)
      if (!flag) {
        this.dialogAdd.splitRuleF = ''
        this.$message({
          showClose: true,
          message: '拆分规则需要输入正整数！',
          type: 'warning'
        })
      }
    },
    numberNo(e, i) {
      const flag = new RegExp('^[1-9]([0-9])*$').test(e.target.value)
      // debugger
      if (!flag) {
        this.systemList[i].splitRuleF = ''
        this.systemList[i].splitRuleS = ''
        this.$message({
          showClose: true,
          message: '拆分规则、权重需要输入正整数！',
          type: 'warning'
        })
      }
    },
    // 权重限制
    numberNoWeight(e, i) {
      const flag = new RegExp('^[1-9]([0-9])*$').test(e.target.value)
      let weightTotal = 0
      for (const item of this.systemList) {
        weightTotal += Number(item.splitWeight)
      }
      // debugger
      if (!flag) {
        this.systemList[i].splitWeight = ''
        this.$message({
          showClose: true,
          message: '拆分规则、权重需要输入正整数！',
          type: 'warning'
        })
      } else if (weightTotal > 100) {
        this.systemList[i].splitWeight = ''
        this.$message({
          showClose: true,
          message: '权重之和应等于100',
          type: 'warning'
        })
      }
    },
    // 导出excel
    exportExcelInfo() {
      var data = {
        channelCode: this.filterObj.channelCode,
        yeardate: this.filterObj.yeardate,
        versions: this.filterObj.varsionName,
        splitType: this.filterObj.splitType,
        minePackageCode: 'A'
      }
      API.exportExcelSplitRule(data).then(
        response => {
          const fileName = '拆分规则导出Excel' + new Date().getTime() + '.xlsx'
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
    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then(res => {
        this.channelOptons = res.data
      }).catch()
    },
    getQueryMinePackageSelect() {
      selectAPI.queryMinePackageSelect().then(res => {
        this.mpOptons = res.data
      }).catch()
    },
    getQueryMinePackageSelectDialog() {
      this.dialogAdd.minePackageCode = ''
      selectAPI.queryMinePackageSelect({
        parentId: this.dialogAdd.minePackageCodeP
      }).then(res => {
        this.mpOptonsDialog = res.data
      }).catch()
    },
    // 版本
    getDictInfoByType() {
      selectAPI.getDictInfoByType({
        typeCodes: 'versions'
      }).then(res => {
        if (res.code === 1000) {
          this.versionsArr = res.data.versions
        }
      }).catch()
    },
    // 弹框 动态增加行
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1
    },
    // 单选框选中数据
    handleDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      } else {
        this.checkedDetail = selection
      }
    },
    handleAddDetails() {
      if (this.systemList === undefined) {
        // eslint-disable-next-line no-array-constructor
        this.systemList = new Array()
      }
      const obj = {}
      obj.splitRuleF = ''
      obj.splitRuleS = ''
      obj.splitWeight = ''
      this.systemList.push(obj)
    },
    handleDeleteDetails() {
      if (this.checkedDetail.length === 0) {
        this.$alert('请先选择要删除的数据', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.systemList.splice(this.checkedDetail[0].xh - 1, 1)
      }
    },
    handleDeleteAllDetails() {
      this.systemList = undefined
    },
    // 新增弹框
    add() {
      this.isEditor = false
      this.dialogVisible = true
      this.queryParentMinePackage()
    },
    // 获取父类MP
    queryParentMinePackage() {
      API.queryParentMinePackage().then(res => {
        if (res.code === 1000) {
          this.MPA = res.data
        }
      }).catch()
    },
    closeDialog() {
      this.dialogVisible = false
      this.dialogAdd = {
        channelCode: '',
        costTypeNumber: '',
        remark: '',
        yeardate: '',
        varsionName: '',
        splitType: '',
        minePackageCodeP: '',
        minePackageCode: '',
        splitWeight: '',
        splitRuleF: '',
        checkArr: [] // 批量删除,存放选中
      }
      this.systemList = []
    },
    // select标签的change事件
    changeSelection(val) {
      const optionsImg = this.optionsImg
      const i = optionsImg.findIndex((item) => item.label === val)
      this.$refs['refSelect']
        .$el.children[0]
        .children[0]
        .setAttribute(
          'style',
          `
          background-color: red;
          background: url(../../../assets/images/selectError.png) no-repeat; 
          `
        )
    },
    // 获取表格数据
    getTableData() {
      API.getPageByRequestSplitRule({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelCode: this.filterObj.channelCode,
        yeardate: this.filterObj.yeardate,
        versions: this.filterObj.varsionName,
        splitType: this.filterObj.splitType,
        minePackageCode: 'A'
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    search() {
      this.getTableData()
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      // this.ruleForm = {}
      this.editorId = obj.id
      this.dialogAdd = obj
      if (obj.splitType === 1) {
        this.dialogAdd = {}
        // this.dialogAdd.splitRuleF = obj.splitRule.replace(/P/g, '').replace(/M/g, '')
        this.dialogAdd = {
          channelCode: obj.channelCode,
          costTypeNumber: obj.costTypeNumber,
          remark: obj.remark,
          yeardate: obj.yeardate,
          varsionName: obj.varsionName,
          splitType: obj.splitType,
          minePackageCode: obj.minePackageCode,
          splitWeight: obj.splitWeight,
          splitRuleF: obj.splitRule.replace(/P/g, '').replace(/M/g, '')
        }
        // this.dialogAdd.splitRuleS = obj.splitRule.replace(/P/g, '').replace(/M/g, '').replace('-', '').split('')[1]
      } else if (obj.splitType === 2) {
        const mulSplitRule = obj.splitRule.replace(/P/g, '').replace(/M/g, '').replace(/-/g, '').split(',')
        const mulWeight = obj.splitWeight.split(',')
        for (let i = 0; i < mulSplitRule.length; i++) {
          const first = mulSplitRule[i].split('')[0]
          const second = mulSplitRule[i].split('')[1]
          this.systemList.push({
            splitRuleF: first,
            splitRuleS: second,
            splitWeight: mulWeight[i]
          })
        }
      }
    },
    // 提交form
    submitForm() {
      if (this.dialogAdd.channelCode == '' || this.dialogAdd.minePackageCodeP == '' || this.dialogAdd.yeardate == '' || this.dialogAdd.varsionName == '' || this.dialogAdd.splitType == '') {
        this.$alert('带*号为必选项', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        // 新增接口
        let splitRuleThis = ''
        let splitWeightThis = ''
        let weightTotal = 0
        if (this.dialogAdd.splitType === 1 && (this.dialogAdd.splitRuleF === '')) {
          // 判断输入是否为空
          this.$alert('输入框不能为空', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        } else if (this.dialogAdd.splitType === 1 && this.dialogAdd.splitRuleF !== '') {
          // 非空  -P' + this.dialogAdd.splitRuleS + 'M,'
          splitRuleThis = 'P' + this.dialogAdd.splitRuleF + 'M,'
          splitWeightThis = this.dialogAdd.splitWeight
          this.submitFormAPI(splitRuleThis, splitWeightThis)
        } else if (this.dialogAdd.splitType === 2) {
          for (const item of this.systemList) {
            if (item.splitRuleF === '' || item.splitRuleS === '' || item.splitWeight === '') {
              // 判断输入是否为空
              this.$alert('输入框不能为空', '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              })
              break
            } else {
              splitRuleThis += 'P' + item.splitRuleF + 'M-P' + item.splitRuleS + 'M,'
              splitWeightThis += item.splitWeight + ','
              weightTotal += Number(item.splitWeight)
            }
          }
          // 判断权重和小于100时
          if (Number(weightTotal) < 100) {
            this.$alert('权重之和应等于100', '提示', {
              confirmButtonText: '确定',
              callback: action => {}
            })
          } else {
            this.submitFormAPI(splitRuleThis, splitWeightThis)
          }
        }
      }
    },
    // 保存数据接口
    submitFormAPI(splitRuleThis, splitWeightThis) {
      const params = {
        'channelCode': this.dialogAdd.channelCode,
        'minePackageCode': this.dialogAdd.minePackageCode,
        'yeardate': this.dialogAdd.yeardate,
        'versions': this.dialogAdd.varsionName,
        'splitType': this.dialogAdd.splitType,
        'splitRule': splitRuleThis.slice(0, -1),
        'splitWeight': splitWeightThis.slice(0, -1),
        'remark': this.dialogAdd.remark
      }
      API.insertSplitRule(params).then(res => {
        if (res.code === 1000) {
          this.closeDialog()
          this.getTableData()
        }
      }).catch()
    },
    // 修改数据
    submitFormUpdate() {
      // 新增接口
      let splitRuleThis = ''
      let splitWeightThis = ''
      if (this.dialogAdd.splitType === 1) {
        // -P' + this.dialogAdd.splitRuleS + 'M,'
        splitRuleThis = 'P' + this.dialogAdd.splitRuleF + 'M,'
        splitWeightThis = this.dialogAdd.splitWeight
      } else if (this.dialogAdd.splitType === 2) {
        for (const item of this.systemList) {
          splitRuleThis += 'P' + item.splitRuleF + 'M-P' + item.splitRuleS + 'M,'
          splitWeightThis += item.splitWeight + ','
        }
      }
      const params = {
        id: this.editorId,
        'splitType': this.dialogAdd.splitType,
        'splitRule': splitRuleThis.slice(0, -1),
        'splitWeight': splitWeightThis.slice(0, -1),
        'remark': this.dialogAdd.remark
      }
      API.updateSplitRule(params).then(res => {
        if (res.code === 1000) {
          this.closeDialog()
          this.getTableData()
        }
      }).catch()
    },
    // 多个删除
    mutidel() {
      var that = this
      var ids = that.$refs.Tdata.selection
      if (ids.length === 0) {
        that.$alert('请选择要删除的数据', '提示', {
          confirmButtonText: '确定'
        }).then()
        return
      }
      var idList = []
      ids.forEach((item, index) => {
        idList[index] = item.id
      })
      this.$confirm('确定要删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.deleteSplitRule(idList).then(
          res => {
            if (res.code === 1000) {
              that.getTableData(that.pageNum, that.pageSize)
              that.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          }
        ).catch(() => {
        })
      }).catch(() => {
        // 取消时清空 selection被选项
        this.$refs.Tdata.clearSelection()
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消
    resetForm() {
      // this.$refs[formName].resetFields()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.option_box {
  display: flex;
  align-items: center;
}

.option_img {
  width: 25px;
  height: 25px;
  margin-right: 7px;
  background: url(../../../assets/images/selectError.png) no-repeat;
}

.inputStatus input {
  background: url(../../../assets/images/selectError.png) no-repeat;
}
.inputStatus div{
  background-color: blueviolet;
}
// .el-select>.el-input input{
//     display: block;
//     margin: 10px 0;
//     background: url(../../../assets/images/selectError.png) no-repeat;
//     background-position: 3px;
//     padding-left: 30px;
//     outline: none;
// }
</style>

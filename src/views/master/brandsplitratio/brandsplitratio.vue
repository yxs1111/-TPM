<!--
 * @Description:
 * @Date: 2022-04-13 11:50:36
 * @LastEditTime: 2022-07-05 17:31:53
-->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package:</span>
          <el-select
            v-model="filterObj.minePackage"
            @change="
              getCostItemList(
                minePackageList.filter(
                  (item) => filterObj.minePackage === item.name
                )[0].code
              )
            "
            class="my-el-input"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in minePackageList"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Item:</span>
          <el-select
            v-model="filterObj.costItem"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in CostItemList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select
            v-model="filterObj.activityMonth"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in monthList"
              :key="index"
              :label="item.activityMonth"
              :value="item.activityMonth"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select
            v-model="filterObj.state"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in ['无效', '有效']"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search"
          >查询</el-button
        >
        <!-- v-permission="permissions['get']" -->
        <div class="TpmButtonBG" @click="exportData">
          <!-- v-permission="permissions['export']" -->
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <!-- 新增 删除 -->
    <div class="TpmButtonBGWrap">
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="TpmButtonBG"
        @click="add"
        >新增</el-button
      >
      <!-- v-permission="permissions['insert']" -->
      <el-button
        type="primary"
        class="TpmButtonBG"
        icon="el-icon-delete"
        @click="mutidel"
        >删除</el-button
      >
      <!-- v-permission="permissions['delete']" -->
    </div>
    <!-- 数据列表 -->
    <el-table
      :data="tableData"
      border
      :max-height="maxheight"
      :header-cell-style="HeadTable"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column type="selection" align="center" fixed />
      <el-table-column
        align="center"
        width="150"
        prop="minePackage"
        label="Mine Package"
      >
      </el-table-column>
      <el-table-column
        align="center"
        width="280"
        prop="costItem"
        label="Cost Item"
      >
      </el-table-column>
      <el-table-column align="center" prop="gold" width="120" label="Gold(%)">
      </el-table-column>
      <el-table-column
        align="center"
        width="120"
        prop="prestige"
        label="Prestige(%)"
      >
      </el-table-column>
      <el-table-column align="center" width="120" prop="novas" label="Novas(%)">
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="startMonth"
        label="生效起始月份"
      >
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="endMonth"
        label="生效结束月份"
      >
      </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template v-slot="{ row }">
          {{ row.state === 1 ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="createBy"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        align="center"
        width="200"
        prop="createDate"
        label="创建时间"
      >
        {{ row.createDate ? row.createDate.replace('T', ' ') : '' }}
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        prop="updateBy"
        label="更新人"
      >
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        align="center"
        width="200"
        prop="updateDate"
        label="更新时间"
      >
        {{ row.updateDate ? row.updateDate.replace('T', ' ') : '' }}
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增 -->
    <el-dialog
      class="my-el-dialog"
      title="新增"
      :visible="dialogVisible"
      width="50%"
      v-el-drag-dialog
      @close="closeDialog"
    >
      <div class="el-dialogContent">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="el-form-row"
        >
          <el-form-item label="Mine Package" prop="minePackage">
            <el-select
              v-model="ruleForm.minePackage"
              @change="
                getCostItemList(
                  minePackageList.filter(
                    (item) => ruleForm.minePackage === item.name
                  )[0].code
                )
              "
              class="my-el-input"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in minePackageList"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Cost Item">
            <el-select
              v-model="ruleForm.costItem"
              clearable
              filterable
              class="my-el-input"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in CostItemList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Gold" prop="gold">
            <el-input v-model="ruleForm.gold" type="number" class="my-el-input"
              ><i slot="suffix">%</i>
            </el-input>
          </el-form-item>
          <el-form-item label="Prestige" prop="prestige">
            <el-input
              v-model="ruleForm.prestige"
              type="number"
              class="my-el-input"
            >
              <i slot="suffix">%</i>
            </el-input>
          </el-form-item>
          <el-form-item label="Novas" prop="novas">
            <el-input
              v-model="ruleForm.novas"
              type="number"
              class="my-el-input"
              disabled
              ><i slot="suffix">%</i></el-input
            >
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="ruleForm.state"
              class="my-el-input"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in ['无效', '有效']"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
        <el-button @click="closeDialog()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  getHeight,
  contractList,
  downloadFile,
  CustomerDeductionsAndPayType,
} from '@/utils'
import API from '@/api/brandsplitratio/index.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'contractItem',

  data() {
    return {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        minePackage: '',
        costItem: '',
        activityMonth: '',
        state: '',
      },
      monthList: [],
      permissions: getDefaultPermissions(),
      tableData: [],
      minePackageList: [
        {
          name: 'Display',
          code: 'E',
        },
        {
          name: 'POSM',
          code: 'D',
        },
      ],
      ruleForm: {
        minePackage: '',
        costItem: '',
        novas: 0,
        prestige: '',
        gold: '',
        state: 1,
      },
      rules: {
        minePackage: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        costItem: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        novas: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        prestige: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        gold: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        state: [
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
      uploadFile: '',
      uploadFileName: '',
      warningList: [],
      warningShow: false,
      CostItemList: [],
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
    this.getAllMonth()
  },
  computed: {},
  watch: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getPageContractItem({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        ...this.filterObj,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.deductionPointIndex = this.getPointIndex(item.deductionPoints)
          item.isEditor = 0
          item.conditionTypeText = item.conditionType
          item.variablePointText = item.variablePoint
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
    //获取活动月数据
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    getCostItemList(code) {
      API.getCostItemList({
        minePackageCode: code,
      }).then((res) => {
        if (res.code === 1000) {
          this.filterObj.costItem = ''
          this.CostItemList = res.data
        }
      })
    },
    getPointIndex(value) {
      let index = this.CustomerDeductionsAndPayType.findIndex((item) => {
        return item.CustomerDeduction == value
      })
      return index != -1 ? index : 0
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    exportData() {
      API.exportContractItem({
        ...this.filterObj,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '品牌拆分比例' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        minePackage: '',
        costItem: '',
        novas: 0,
        prestige: '',
        gold: '',
        state: 1,
      }
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.insertContractItem({
            ...this.ruleForm,
          }).then((response) => {
            response.data
              ? this.$message.success('新增成功！')
              : this.$message.error(response.message)
            this.getTableData()
            this.closeDialog()
          })
        } else {
          this.$message.error('提交失败')
          this.closeDialog()
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
.message {
  color: #eb4f48;
  text-align: center;
  margin: 10px 0;
  white-space: normal;
}
.warningWrap {
  width: 100%;
  height: 300px;
  overflow-y: auto;
}
.tip {
  color: #666;
  font-size: 14px;
}
.tipStar {
  color: #eb4f48;
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

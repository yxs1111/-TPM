<!--
 * @Description: V3Collection
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-06-25 17:42:21
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month" filterable clearable placeholder="请选择">
            <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">MinePackage:</span>
          <el-select v-model="filterObj.minePackage" placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">费用科目:</span>
          <el-select v-model="filterObj.costAccount" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item) in ['NKA']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap" style="align-items: center;">
      <div class="TpmButtonBG" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel">删除</el-button>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月">
      </el-table-column>
      <el-table-column width="120" align="center" prop="costType" label="费用类型">
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackage" label="Mine Package">
      </el-table-column>
      <el-table-column width="180" align="center" prop="costAccount" label="费用科目">
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelCode" label="渠道">
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerName" label="客户">
      </el-table-column>
      <el-table-column width="220" align="center" prop="brandName" label="品牌">
      </el-table-column>
      <el-table-column width="220" align="center" prop="skuName" label="SKU">
      </el-table-column>
      <el-table-column width="280" align="center" prop="distributorOrSupplierName" label="经销商/供应商">
      </el-table-column>
      <el-table-column width="220" align="center" prop="zoneName" label="大区">
      </el-table-column>
      <el-table-column width="220" align="center" prop="regionName" label="区域">
      </el-table-column>
      <el-table-column width="220" align="center" prop="contractItem" label="Contract Item">
      </el-table-column>
      <el-table-column width="220" align="center" prop="activityType" label="活动类型">
      </el-table-column>
      <el-table-column v-slot={row} width="220" align="right" prop="costAmount" label="费用金额">
        {{formatNum(row.costAmount)}}
      </el-table-column>
      <el-table-column width="120" align="center" prop="applicantRemark" label="申请人备注">
      </el-table-column>
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见">
      </el-table-column>
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImportDialog">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary" plain class="my-export" icon="el-icon-my-down" @click="downloadTemplate">下载模板</el-button>
          </div>
          <el-button v-if="saveBtn" type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile" @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png" alt="">
              <span class="text">选择文件</span>
            </div>
            <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
            <div v-if="uploadFileName!=''" class="fileName">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
              <span>{{ uploadFileName }}</span>
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
          <el-table border height="400" :data="ImportData" style="width: 100%" :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN'
            }" :row-class-name="tableRowClassName" stripe>
            <el-table-column prop="date" fixed align="center" label="是否通过" width="200">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                  <div slot="content" v-html="getTip(row)" />
                  <div class="statusWrap">
                    <img v-if="row.systemJudgment=='Pass'" src="@/assets/images/success.png" alt="">
                    <img v-if="row.systemJudgment!=null&&row.systemJudgment.indexOf('Exception') > -1" src="@/assets/images/warning.png" alt="">
                    <img v-if="row.systemJudgment=='Error'" src="@/assets/images/selectError.png" alt="">
                    <span class="judgmentText">{{ row.systemJudgment }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="400" align="center" prop="systemjudgmentContent" label="验证信息" />
            <el-table-column align="center" width="460" prop="cpId" label="CPID">
            </el-table-column>
            <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月">
            </el-table-column>
            <el-table-column width="120" align="center" prop="costType" label="费用类型">
            </el-table-column>
            <el-table-column width="190" align="center" prop="minePackage" label="Mine Package">
            </el-table-column>
            <el-table-column width="180" align="center" prop="costAccount" label="费用科目">
            </el-table-column>
            <el-table-column width="120" align="center" prop="channelCode" label="渠道">
            </el-table-column>
            <el-table-column width="220" align="center" prop="customerName" label="客户">
            </el-table-column>
            <el-table-column width="220" align="center" prop="brandName" label="品牌">
            </el-table-column>
            <el-table-column width="220" align="center" prop="skuName" label="SKU">
            </el-table-column>
            <el-table-column width="280" align="center" prop="distributorOrSupplierName" label="经销商/供应商">
            </el-table-column>
            <el-table-column width="220" align="center" prop="zoneName" label="大区">
            </el-table-column>
            <el-table-column width="220" align="center" prop="regionName" label="区域">
            </el-table-column>
            <el-table-column width="220" align="center" prop="contractItem" label="Contract Item">
            </el-table-column>
            <el-table-column width="220" align="center" prop="activityType" label="活动类型">
            </el-table-column>
            <el-table-column v-slot={row} width="220" align="right" prop="costAmount" label="费用金额">
              {{formatNum(row.costAmount)}}
            </el-table-column>
            <el-table-column width="120" align="center" prop="applicantRemark" label="申请人备注">
            </el-table-column>
            <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见">
            </el-table-column>
            <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见">
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
  getHeightHaveTab,
  messageObj,
  downloadFile,
  messageMap,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V3/Collection'
export default {
  name: 'V3Collection',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        minePackage: '',
        costAccount: '',
        month: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      MinePackageList: [],
      tableData: [],
      RegionList: [],
      maxheight: getHeightHaveTab(),
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      isSelf: 0, //是否是当前审批人
      mainId: '',
      usernameLocal: '',
      messageMap: messageMap(),
      // 导入
      importVisible: false, // 导入弹窗
      ImportData: [],
      uploadFileName: '',
      event: '',
      uploadFile: '',
      errorImg: require('@/assets/images/selectError.png'),
      excepImg: require('@/assets/images/warning.png'),
      passImg: require('@/assets/images/success.png'),
      saveBtn: false,
      isCheck: false, //检测数据按钮显示或隐藏
      checkArr: [],
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    this.getAllMonth()
    this.getMinePackage()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.month == '') {
        this.$message.info(messageObj.requireMonth)
        return
      } else {
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          minePackage: this.filterObj.minePackage,
          costAccount: this.filterObj.costAccount,
          version:'V3'
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
      }
    },
    // 通过与审批按钮控制
    infoByMainId() {
      selectAPI
        .infoByMainId({
          mainId: this.mainId,
        })
        .then((res) => {
          if (res.code === 1000) {
            if (
              res.data.version === 'V3' &&
              res.data.assignee.indexOf(this.usernameLocal) != -1
            ) {
              //本人可以提交
              this.isSelf = true
            } else {
              //其他人禁用
              this.isSelf = false
            }
          }
        })
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
        }
      })
    },
    getMinePackage() {
      selectAPI
        .queryMinePackageSelect({
          parentId: '',
        })
        .then((res) => {
          this.MinePackageList = res.data
        })
    },
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
      const money = num * 1
      return money.toLocaleString('zh', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //多个删除
    mutidel() {
      if (this.checkArr.length === 0) return this.$message.error('请选择数据')
      else {
        const ItemList = []
        this.checkArr.forEach((item) => {
          ItemList.push(item)
        })
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.delete(ItemList).then((response) => {
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
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.downExcel({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          minePackage: this.filterObj.minePackage,
          costAccount: this.filterObj.costAccount,
          channelName: this.filterObj.channelCode,
          version:'V3'
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_补录_${this.filterObj.channelCode}_V3_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
    },
    importData() {
      this.saveBtn = false
      if (this.filterObj.month == '') {
        this.$message.info('请先选择年月！')
      } else {
        this.importVisible = true
      }
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.saveBtn = false
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.isCheck = false
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.month)
      API.importSrVTwo(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data)) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            this.ImportData = response.data
            this.saveBtn = response.data[0].judgmentType !== 'Error'
          }
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    // 关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn = false
      this.isCheck = false
    },
    // 校验数据
    checkImport() {
      API.exceptionCheck({
        yearAndMonth: this.filterObj.month,
        channelCode: this.filterObj.channelCode,
      }).then((response) => {
        if (response.code == 1000) {
          this.$message.success(this.messageMap.checkSuccess)
          this.ImportData = response.data
          this.saveBtn = response.data[0].judgmentType !== 'Error'
        } else {
          this.$message.info(this.messageMap.checkError)
        }
      })
    },
    // 确认导入
    confirmImport() {
      API.saveVTwoData({
        yearAndMonth: this.filterObj.month,
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success(this.messageMap.saveSuccess)
          this.getTableData()
          this.closeImportDialog()
        } else {
          this.$message.info(this.messageMap.saveError)
        }
      })
    },
    // 导出异常信息
    exportErrorList() {
      if (this.ImportData.length) {
        API.downExcelError({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          supplierCode: this.filterObj.supplierCode,
          regionCode: this.filterObj.regionCode,
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          downloadFile(res, 'V3_RoadShow异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
          this.$message.success(this.messageMap.exportErrorSuccess)
        })
      } else {
        this.$message.info('异常数据为空!')
      }
    },
    // 下载模板
    downloadTemplate() {
      // 导出数据筛选
      API.downloadTemplate({
        yearAndMonth: this.filterObj.month,
        version:'V3'
      }).then((res) => {
        downloadFile(
          res,
          `${this.filterObj.month}_补录_${this.filterObj.channelCode}_V3申请.xlsx`
        ) //自定义Excel文件名
        this.$message.success(this.messageMap.exportSuccess)
      })
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
    getTip(row) {
      return `<div class="Tip">${row.systemjudgmentContent}</div>`
    },
    handleSelectionChange(val) {
      this.checkArr = val
    },
  },
}
</script>

<style lang="scss" scoped>
.tooltip {
  border-radius: 10px;
}
.Tip {
  text-align: center;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  margin: 3px 0;
}
.tip {
  color: #eb4f48;
  font-size: 14px;
  margin-bottom: 10px;
}
.tipStar {
  font-size: 12px;
  color: #eb4f48;
}
</style>

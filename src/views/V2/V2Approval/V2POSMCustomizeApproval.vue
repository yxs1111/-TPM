<!--
 * @Description: V2POSM定制
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-09-06 08:40:42
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select
            v-model="filterObj.yearAndMonth"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in monthList"
              :key="item.id"
              :label="item.activityMonth"
              :value="item.activityMonth"
            />
          </el-select>
        </div>
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select
            v-model="filterObj.channelCode"
            clearable
            filterable
            placeholder="请选择"
            @change="getCustomerList"
          >
            <el-option
              v-for="(item, index) in channelArr"
              :key="index"
              :label="item.channelCsName"
              :value="item.channelCode"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select
            v-model="filterObj.customerName"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in customerArr"
              :key="index"
              :label="item.customerCsName"
              :value="item.customerCsName"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商:</span>
          <el-select
            v-model="filterObj.supplierName"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in supplierList"
              :key="index"
              :label="item.supplierName"
              :value="item.supplierName"
            />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search"
          >查询</el-button
        >
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap" style="align-items: center">
      <div
        class="TpmButtonBG"
        :class="isSubmit ? '' : 'noClick'"
        @click="importData"
      >
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
      <div
        class="TpmButtonBG"
        :class="isSubmit ? '' : 'noClick'"
        @click="approve('agree')"
      >
        <svg-icon icon-class="passApprove" style="font-size: 24px" />
        <span class="text">通过</span>
      </div>
      <div
        class="TpmButtonBG"
        :class="isSubmit ? '' : 'noClick'"
        @click="approve('reject')"
      >
        <svg-icon icon-class="passApprove" style="font-size: 24px" />
        <span class="text">驳回</span>
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      :max-height="maxheight"
      border
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        width="520"
        prop="cpId"
        label="CPID"
        fixed
      >
      </el-table-column>
      <el-table-column
        width="120"
        align="center"
        prop="yearAndMonth"
        label="活动月"
      >
      </el-table-column>
      <el-table-column
        width="120"
        align="center"
        prop="costType"
        label="费用类型"
      >
      </el-table-column>
      <el-table-column
        width="190"
        align="center"
        prop="minePackage"
        label="Mine Package"
      >
      </el-table-column>
      <el-table-column
        width="240"
        align="center"
        prop="costItem"
        label="费用科目"
      >
      </el-table-column>
      <el-table-column
        width="120"
        align="center"
        prop="channelName"
        label="渠道"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="customerName"
        label="客户系统名称"
      >
      </el-table-column>
      <el-table-column width="220" align="center" prop="brandName" label="品牌">
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="supplierName"
        label="供应商"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="voneCost"
        label="V1计划费用(RMB)"
      >
        <template v-slot:header>
          <div>V1计划费用(RMB)<br /><span class="subTitle">KA+Brand</span></div>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="vtwoCostDefault"
        label="V2预估费用-默认(RMB)"
      >
        <template v-slot:header>
          <div>
            V2预估费用-默认(RMB)<br /><span class="subTitle">KA+Brand</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="vtwoCostAdjust"
        label="V2预估费用-调整后(RMB)"
      >
        <template v-slot:header>
          <div>
            V2预估费用-调整后(RMB)<br /><span class="subTitle"
              >KA+Brand+Vendor</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="costAscriptionDept"
        label="费用归属部门"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="costWriteoffMethod"
        label="费用核销方式"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="costDifference"
        label="费用差值(RMB)"
      >
        <template v-slot:header>
          <div>费用差值(RMB)<br /><span class="subTitle">KA+Brand</span></div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="systemJudgment"
        label="系统判定"
      >
      </el-table-column>
      <el-table-column
        width="800"
        align="left"
        prop="systemJudgmentContent"
        label="系统判定内容"
      >
      </el-table-column>
      <el-table-column
        width="120"
        align="center"
        prop="applicantRemark"
        label="申请人备注"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="poApprovalComments"
        label="Package Owner审批意见"
      >
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        prop="finApprovalComments"
        label="Finance审批意见"
      >
      </el-table-column>
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
    <!-- 导入 -->
    <el-dialog
      width="66%"
      class="my-el-dialog"
      title="导入"
      :visible="importVisible"
      @close="closeImportDialog"
    >
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button
              type="primary"
              plain
              class="my-export"
              icon="el-icon-my-down"
              @click="downloadTemplate"
              >下载模板</el-button
            >
<!--            <el-button-->
<!--              v-if="isCheck"-->
<!--              type="primary"-->
<!--              plain-->
<!--              class="my-export"-->
<!--              icon="el-icon-my-checkData"-->
<!--              @click="checkImport"-->
<!--              >检测数据</el-button-->
<!--            >-->
          </div>
          <el-button
            v-if="saveBtn"
            type="primary"
            class="TpmButtonBG"
            @click="confirmImport"
            >保存</el-button
          >
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile" @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png" alt="" />
              <span class="text">选择文件</span>
            </div>
            <input
              id="fileElem"
              ref="filElem"
              type="file"
              style="display: none"
              @change="parsingExcel($event)"
            />
            <div v-if="uploadFileName != ''" class="fileName">
              <img
                src="@/assets/upview_fileicon.png"
                alt=""
                class="upview_fileicon"
              />
              <span>{{ uploadFileName }}</span>
            </div>
          </div>
<!--          <div class="seeData" style="width: auto">-->
<!--            <div class="exportError" @click="exportErrorList">-->
<!--              <img-->
<!--                src="@/assets/exportError_icon.png"-->
<!--                alt=""-->
<!--                class="exportError_icon"-->
<!--              />-->
<!--              <span>导出错误信息</span>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div class="tableWrap">
          <el-table
            border
            height="400"
            :data="ImportData"
            style="width: 100%"
            :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN',
            }"
            :row-class-name="tableRowClassName"
            stripe
          >
            <el-table-column
              prop="date"
              fixed
              align="center"
              label="是否通过"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="dark"
                  placement="bottom"
                  popper-class="tooltip"
                >
                  <div slot="content" v-html="getTip(row)" />
                  <div class="statusWrap">
                    <img
                      v-if="row.systemJudgment == 'Pass'"
                      src="@/assets/images/success.png"
                      alt=""
                    />
                    <img
                      v-if="
                        row.systemJudgment != null &&
                        row.systemJudgment.indexOf('Exception') > -1
                      "
                      src="@/assets/images/warning.png"
                      alt=""
                    />
                    <img
                      v-if="row.systemJudgment == 'Error'"
                      src="@/assets/images/selectError.png"
                      alt=""
                    />
                    <span class="judgmentText">{{ row.systemJudgment }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              width="400"
              fixed
              align="center"
              prop="systemJudgmentContent"
              label="验证信息"
            />
            <el-table-column
              align="center"
              width="460"
              prop="cpId"
              label="CPID"
            />
            <el-table-column
              width="120"
              align="center"
              prop="yearAndMonth"
              label="活动月"
            />
            <el-table-column
              width="120"
              align="center"
              prop="costType"
              label="费用类型"
            />
            <el-table-column
              width="190"
              align="center"
              prop="minePackage"
              label="Mine Package"
            />
            <el-table-column
              width="240"
              align="center"
              prop="costItem"
              label="费用科目"
            />
            <el-table-column
              width="120"
              align="center"
              prop="channelName"
              label="渠道"
            />
            <el-table-column
              width="220"
              align="center"
              prop="customerName"
              label="客户系统名称"
            />
            <el-table-column
              width="220"
              align="center"
              prop="brandName"
              label="品牌"
            />
            <el-table-column
              width="220"
              align="center"
              prop="supplierName"
              label="供应商"
            />
            <el-table-column
              width="220"
              align="right"
              prop="voneCost"
              label="V1计划费用(RMB)"
            >
              <template v-slot:header>
                <div>
                  V1计划费用(RMB)<br /><span class="subTitle">KA+Brand</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="220"
              align="right"
              prop="vtwoCostDefault"
              label="V2预估费用-默认(RMB)"
            >
              <template v-slot:header>
                <div>
                  V2预估费用-默认(RMB)<br /><span class="subTitle"
                    >KA+Brand</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="220"
              align="right"
              prop="vtwoCostAdjust"
              label="V2预估费用-调整后(RMB)"
            >
              <template v-slot:header>
                <div>
                  V2预估费用-调整后(RMB)<br /><span class="subTitle"
                    >KA+Brand+Vendor</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="220"
              align="center"
              prop="costAscriptionDept"
              label="费用归属部门"
            ></el-table-column>
            <el-table-column
              width="220"
              align="center"
              prop="costWriteoffMethod"
              label="费用核销方式"
            ></el-table-column>
            <el-table-column
              width="220"
              align="right"
              prop="costDifference"
              label="费用差值(RMB)"
            >
              <template v-slot:header>
                <div>
                  费用差值(RMB)<br /><span class="subTitle">KA+Brand</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              prop="applicantRemark"
              label="申请人备注"
            />
            <el-table-column
              width="220"
              align="center"
              prop="poApprovalComments"
              label="Package Owner审批意见"
            />
            <el-table-column
              width="220"
              align="center"
              prop="finApprovalComments"
              label="Finance审批意见"
            />
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
  FormateThousandNum,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V2/POSM-custom'
export default {
  name: 'V2POSMCustomize',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        supplierName: '',
        customerName: '',
        yearAndMonth: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      supplierList: [],
      maxheight: getHeightHaveTab(),
      isSubmit: false,
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
    this.getSupplierList()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (
        this.filterObj.channelCode == '' ||
        this.filterObj.yearAndMonth == ''
      ) {
        if (this.filterObj.yearAndMonth == '') {
          this.$message.info(messageObj.requireyearAndMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getPageApprove({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          supplierName: this.filterObj.supplierName, //供应商
          customerName: this.filterObj.customerName, //客户系统名称
          yearAndMonth: this.filterObj.yearAndMonth,
          channelName: this.filterObj.channelCode, //渠道
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          this.mainId = this.tableData[0].mainId
          this.infoByMainId()
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
              res.data.assignee.indexOf(this.usernameLocal) > -1 &&
              res.data.version.indexOf('V2') > -1 &&
              res.data.activityName.indexOf('审批') > -1
            ) {
              //本人可以提交
              this.isSubmit = true
            } else {
              //其他人禁用
              this.isSubmit = false
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
          this.getCustomerList(this.filterObj.channelCode)
        }
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    // 供应商
    getSupplierList() {
      selectAPI.getSupplierList().then((res) => {
        if (res.code === 1000) {
          this.supplierList = res.data
        }
      })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
      return FormateThousandNum(num)
    },
    formateHundredNumber(num) {
      if (num === null || num === 'null') {
        return ''
      } else {
        const money = num * 100
        return money.toLocaleString('zh', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportExcel({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelName: this.filterObj.channelCode, //渠道
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.yearAndMonth}_POSM-定制_${this.filterObj.channelCode}_V2_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
    },
    importData() {
      this.saveBtn = false
      if (this.filterObj.channelCode == '') {
        this.$message.info('请先选择渠道！')
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
      formData.append('yearAndMonth', this.filterObj.yearAndMonth)
      formData.append('channelName', this.filterObj.channelCode)
      formData.append('importType', 0)
      API.import(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data) || response.data.length === 0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.ImportData = response.data
            this.saveBtn = this.ImportData.length ? true : false
            this.$message.success('导入成功！')
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
        yearAndMonth: this.filterObj.yearAndMonth,
        channelName: this.filterObj.channelCode,
      }).then((response) => {
        if (response.code == 1000) {
          if (!Array.isArray(response.data)) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.checkSuccess)
            this.ImportData = response.data.sort(function (a, b) {
              if (a.systemJudgment > b.systemJudgment) {
                return 1
              } else {
                return -1
              }
            })
            let isError = this.ImportData.findIndex((item) => {
              return item.systemJudgment == 'Error'
            })
            this.saveBtn = isError == -1 ? 1 : 0
            console.log(this.saveBtn)
          }
        } else {
          this.$message.info(this.messageMap.checkError)
        }
        this.saveBtn = 1
      })
    },
    // 确认导入
    confirmImport() {
      this.closeImportDialog()
      this.getTableData()
    },
    // 导出异常信息
    exportErrorList() {
      if (this.ImportData.length) {
        API.exportV2Error({
          ...this.filterObj,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.yearAndMonth}_POSM-定制_${this.filterObj.channelName}_V2异常信息.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('异常数据为空!')
      }
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.downloadTemplate({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelName: this.filterObj.channelCode,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.yearAndMonth}_POSM-定制_${this.filterObj.channelName}_V2审批.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    approve(state) {
      if (this.tableData.length) {
        const judgmentType = this.tableData[0].systemJudgment
        if (judgmentType != null) {
          this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              const mainId = this.tableData[0].mainId
              API.approve({
                mainId: mainId, // 主表id
                opinion: state, // 审批标识(agree：审批通过，reject：审批驳回)
              }).then((response) => {
                if (response.code === 1000) {
                  if (state === 'agree') {
                    this.$message.success('提交成功')
                  } else {
                    this.$message.success('驳回成功')
                    this.isSubmit = false
                  }
                  this.getTableData()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
        } else {
          this.$message.info('数据未校验，请先进行导入验证')
        }
      } else {
        this.$message.warning('数据不能为空')
      }
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
      return `<div class="Tip">${row.systemJudgmentContent}</div>`
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

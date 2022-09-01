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
              v-for="(item, index) in monthList"
              :key="index"
              :label="item.activityMonth"
              :value="item.activityMonth"
            />
          </el-select>
        </div>
        <div class="Selectli">
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
              :label="item.channelEsName"
              :value="item.channelCode"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <!-- <el-date-picker v-model="filterObj.custom" type="yearAndMonth" placeholder="请选择" /> -->
          <el-select
            v-model="filterObj.customerCode"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in customerArr"
              :key="index"
              :label="item.customerCsName"
              :value="item.customerCode"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select
            v-model="filterObj.distributorCode"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in distributorArr"
              :key="index"
              :label="item.distributorName"
              :value="item.distributorCode"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">大区:</span>
          <el-select
            v-model="filterObj.zoneCode"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in largeAreaDialogList"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select
            v-model="filterObj.regionCode"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in RegionList"
              :key="index"
              :label="item.name"
              :value="item.nameAbridge"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Display item:</span>
          <el-select
            v-model="filterObj.displayItem"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in displayItemList"
              :key="index"
              :label="item.item"
              :value="item.item"
            />
          </el-select>
        </div>
        <div class="OpertionBar">
          <el-button type="primary" class="TpmButtonBG" @click="getTableData"
            >查询</el-button
          >
          <div class="TpmButtonBG" @click="exportExcelInfo(filterObj)">
            <img src="../../../assets/images/export.png" alt="" />
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
          <svg-icon icon-class="rejectApprove" style="font-size: 24px" />
          <span class="text">驳回</span>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      stripe
      :max-height="maxheight"
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column
        width="420"
        align="center"
        prop="cpId"
        label="CPID"
        fixed
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
        prop="costTypeName"
        label="费用类型"
      />
      <el-table-column
        width="150"
        align="center"
        prop="minePackageName"
        label="Mine Package"
      />
      <el-table-column
        width="260"
        align="center"
        prop="costItemName"
        label="费用科目"
      />
      <el-table-column
        width="120"
        align="center"
        prop="channelName"
        label="渠道"
      />
      <el-table-column
        width="120"
        align="center"
        prop="customerName"
        label="客户系统名称"
      />
      <el-table-column
        width="120"
        align="center"
        prop="brandName"
        label="品牌"
      />
      <el-table-column
        width="400"
        align="center"
        prop="distributorName"
        label="经销商"
      />
      <el-table-column
        width="120"
        align="center"
        prop="zoneName"
        label="大区"
      />
      <el-table-column
        width="120"
        align="center"
        prop="regionName"
        label="区域"
      />
      <el-table-column
        width="280"
        align="center"
        prop="displayItem"
        label="Display Item"
      >
        <template v-slot:header>
          <div>
            Display Item
            <br />
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        align="center"
        prop="planCost"
        label="V1计划费用(RMB)"
      >
        <template v-slot:header>
          <div>
            V1计划费用(RMB)
            <br />
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        align="center"
        prop="estimateCost"
        label="V2预估费用-默认(RMB)"
      >
        <template v-slot:header>
          <div>
            V2预估费用-默认(RMB)
            <br />
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        align="center"
        prop="adjustedCost"
        label="V2预估费用-调整后(RMB)"
      >
        <template v-slot:header>
          <div>
            V2预估费用-调整后(RMB)
            <br />
            <span class="subTitle">KA+Brand+region+经销商+item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="dept"
        label="费用归属部门"
      />
      <el-table-column
        width="150"
        align="center"
        prop="cancelCost"
        label="费用核销方式"
      />
      <el-table-column
        width="280"
        align="center"
        prop="differenceCost"
        label="费用差值(RMB)"
      >
        <template v-slot:header>
          <div>
            费用差值(RMB)
            <br />
            <span class="subTitle">KA+Brand+Region + item</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="judgmentType"
        label="系统判定"
      />
      <el-table-column
        width="400"
        align="center"
        prop="judgmentContent"
        label="系统判定内容"
      />
      <el-table-column
        width="120"
        align="center"
        prop="applyRemarks"
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
          </div>
          <el-button
            v-if="saveBtn"
            type="primary"
            class="TpmButtonBG"
            @click="importVisible = false"
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
                      v-if="row.judgmentType == 'Pass'"
                      src="@/assets/images/success.png"
                      alt=""
                    />
                    <img
                      v-if="
                        row.judgmentType != null &&
                        row.judgmentType.indexOf('Exception') > -1
                      "
                      src="@/assets/images/warning.png"
                      alt=""
                    />
                    <img
                      v-if="row.judgmentType == 'Error'"
                      src="@/assets/images/selectError.png"
                      alt=""
                    />
                    <span class="judgmentText">{{ row.judgmentType }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              align="center"
              prop="judgmentType"
              label="系统判定"
            />
            <el-table-column
              width="300"
              align="center"
              prop="judgmentContent"
              label="系统判定内容"
            />
            <el-table-column
              width="420"
              align="center"
              prop="cpId"
              label="CPID"
              fixed
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
              prop="costTypeName"
              label="费用类型"
            />
            <el-table-column
              width="150"
              align="center"
              prop="minePackageName"
              label="Mine Package"
            />
            <el-table-column
              width="260"
              align="center"
              prop="costItemName"
              label="费用科目"
            />
            <el-table-column
              width="120"
              align="center"
              prop="channelName"
              label="渠道"
            />
            <el-table-column
              width="120"
              align="center"
              prop="customerName"
              label="客户系统名称"
            />
            <el-table-column
              width="120"
              align="center"
              prop="brandName"
              label="品牌"
            />
            <el-table-column
              width="400"
              align="center"
              prop="distributorName"
              label="经销商"
            />
            <el-table-column
              width="120"
              align="center"
              prop="zoneName"
              label="大区"
            />
            <el-table-column
              width="120"
              align="center"
              prop="regionName"
              label="区域"
            />
            <el-table-column
              width="120"
              align="center"
              prop="displayItem"
              label="Display Item"
            />
            <el-table-column
              width="280"
              align="center"
              prop="planCost"
              label="V1计划费用(RMB)"
            >
            </el-table-column>
            <el-table-column
              width="280"
              align="center"
              prop="estimateCost"
              label="V2预估费用-默认(RMB)"
            >
            </el-table-column>
            <el-table-column
              width="280"
              align="center"
              prop="adjustedCost"
              label="V2预估费用-调整后(RMB)"
            >
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              prop="dept"
              label="费用归属部门"
            />
            <el-table-column
              width="120"
              align="center"
              prop="cancelCost"
              label="费用核销方式"
            />
            <el-table-column
              width="280"
              align="center"
              prop="differenceCost"
              label="费用差值(RMB)"
            >
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              prop="applyRemarks"
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
  FormateThousandNum,
  getHeightHaveTab,
  downloadFile,
  messageMap,
} from '@/utils'
import API from '@/api/V2/V2.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'V1discountDiscount',
  directives: { elDragDialog, permission },

  data() {
    return {
      // 导入
      total: 0,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonth: '',
        customerCode: '',
        channelCode: '',
        distributorCode: '',
        displayItem: '',
        regionCode: '',
        zoneCode: '',
      },
      messageMap: messageMap(),
      monthList: [],
      RegionList: [],
      categoryArr: [],
      tableData: [],
      channelArr: [],
      skuArr: [],
      customerArr: [],
      distributorArr: [],
      largeAreaDialogList: [],
      maxheight: getHeightHaveTab(),
      importVisible: false,
      uploadFileName: '',
      event: '',
      ImportData: [],
      displayItemList: [],
      uploadFile: '',
      saveBtn: false,
      isSubmit: false,
      username: '',
      mainId: '',
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.username = localStorage.getItem('usernameLocal')
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getChannel()
    this.getAllMonth()
    this.getSKU()
    this.getRegionList()
    // this.getCustomerList()
    this.getDistributorList()
    this.getAreaList()
    this.DisolayItem()
  },
  methods: {
    // 获取display item 数据
    DisolayItem() {
      selectAPI.DisplayItemList().then((res) => {
        if (res.code === 1000) {
          this.displayItemList = res.data
        }
      })
    },
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    getAllMonth() {
      selectAPI.getAllMonth().then((res) => {
        this.monthList = res.data
      })
    },
    // 获取大区数据
    getAreaList() {
      selectAPI.getLargeAreaList({ parentCode: '' }).then((res) => {
        if (res.code === 1000) {
          this.largeAreaDialogList = res.data
        }
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
    // 获取区域
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getSKU() {
      selectAPI.querySkuSelect().then((res) => {
        if (res.code === 1000) {
          this.skuArr = res.data
        }
      })
    },
    // 客户
    getCustomerList() {
      this.filterObj.customerCode = ''
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
    // 经销商
    getDistributorList() {
      selectAPI
        .queryDistributorList({
          customerMdmCode: this.filterObj.customerMdmCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.distributorArr = res.data
          }
        })
    },
    // 导出excel
    exportExcelInfo(filterObj) {
      API.excdisplayData({ ...filterObj }).then((response) => {
        const fileName = `${this.filterObj.yearAndMonth}_display_${this.filterObj.channelCode}_V2_查询.xlsx`
        //   res.data:请求到的二进制数据
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
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
    // 获取表格数据
    getTableData() {
      API.displayList({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        ...this.filterObj,
        isSubmit: 1,
      }).then((response) => {
        this.tableData = response.data.records
        if (response.data.records.length > 0) {
          this.total = response.data.total
          this.mainId = this.tableData[0].mainId
          this.infoByMainId(response.data.records[0].mainId)
        } else {
          this.mainId = null
        }
      })
    },
    // 通过与审批按钮控制
    infoByMainId(id) {
      API.infoByMainId({ mainId: id }).then((res) => {
        if (res.code === 1000) {
          if (
            res.data.assignee.indexOf(this.username) > -1 &&
            res.data.version === 'V2' &&
            res.data.activityName.indexOf('审批') > -1
          ) {
            this.isSubmit = true
          } else {
            this.isSubmit = false
          }
        }
      })
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.saveBtn = false
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入框
    importData() {
      this.saveBtn = false
      if (this.filterObj.channelCode == '') {
        this.$message.info('请先选择渠道！')
      } else {
        this.importVisible = true
      }
    },
    // 关闭导入
    closeImportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
      this.ImportData = []
      this.saveBtn = false
    },
    // 导入
    parsingExcel(event) {
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.yearAndMonth)
      formData.append('channelCode', this.filterObj.channelCode)
      API.importNormal(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code === 1000) {
          if (!Array.isArray(response.data) || response.data.length === 0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            this.ImportData = response.data
            this.saveBtn = true
          }
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.downExcelTemplate({
          yearAndMonth: this.filterObj.yearAndMonth,
          channelCode: this.filterObj.channelCode,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.yearAndMonth}_display_${this.filterObj.channelCode}_V2审批.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    // 提交
    approve(state) {
      if (this.tableData.length) {
        const judgmentType = this.tableData[0].judgmentType
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
      return `<div class="Tip">${row.judgmentContent}</div>`
    },
  },
}
</script>

<style>
.el-icon-my-file {
  background: url('~@/assets/images/selFile.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-file:before {
  content: '\e611';
  font-size: 16px;
}
</style>

<style>
.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 0 !important;
  border-bottom: 0 !important;
}
.el-icon-my-down {
  background: url('~@/assets/images/downModel.png') no-repeat;
  font-size: 16px;
  background-size: cover;
}
.el-icon-my-down:before {
  content: '\e611';
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
.el-icon-arrow-left:before {
  content: '上一页';
}
.el-icon-arrow-right:before {
  content: '下一页';
}
.SelectBarWrap {
  display: flex;
  flex-direction: column;
}
.OpertionBar {
  flex: 1;
  padding-right: 15px;
  justify-content: flex-end;
}
::v-deep.my-el-dialog .upload-demo {
  display: flex;
  margin-top: 0px;
}
::v-deep.el-table td {
  padding: 6px 0;
}
::v-deep.el-upload-list__item:first-child {
  margin-top: 0px;
}
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .priceLevel {
      width: 60px;
      height: 34px;
      line-height: 34px;
      border-radius: 17px;
      background: #f2e9ea;
      color: #e87071 !important;
      text-align: center;
    }
    .priceCenter {
      background: #ebfbf8;
      color: #38d7b7 !important;
    }
    .priceLow {
      background: #e1edf4;
      color: #4192d3 !important;
    }
    .TotalNum {
      font-weight: bold;
      color: #ff8912;
    }
  }
}
</style>

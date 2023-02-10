<!--
 * @Description: V2ListingFee
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-08-15 09:57:16
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
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in ['NKA']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌:</span>
          <el-select v-model="filterObj.brandCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptions" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in distributorArr" :key="index" :label="item.distributorName" :value="item.distributorCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.code" />
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
      <div class="TpmButtonBG" :class="!isSubmit&&isSelf?'':'noClick'" @click="importData">
        <img src="@/assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" :class="!isSubmit&&isSelf?'':'noClick'" @click="approve()">
        <svg-icon icon-class="passApprove" style="font-size: 24px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed >
        <template v-slot:header>
          <div>CPID<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cpId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" >
        <template v-slot:header>
          <div>活动月<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.yearAndMonth }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" >
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" >
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目" >
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelName" label="渠道" >
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" >
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="brandName" label="品牌" >
        <template v-slot:header>
          <div>品牌<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.brandName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="productName" label="SKU" >
        <template v-slot:header>
          <div>SKU<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="distributorName" label="经销商">
        <template v-slot:header>
          <div>经销商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.distributorName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="regionName" label="区域">
        <template v-slot:header>
          <div>区域<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.regionName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle">KA+Brand</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="forecastCost" label="V2预估费用-调整后(RMB)">
        <template v-slot:header>
          <div>V2预估费用-调整后(RMB)<br><span class="subTitle">KA+SKU+经销商+Region</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.forecastCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costDeptName" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costDeptName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="payType" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.payType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="planCost" label="费用差值(RMB)">
        <template v-slot:header>
          <div>费用差值(RMB)<br><span class="subTitle">KA+Brand</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.costDifference) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="judgmentType" label="系统判定">
        <template v-slot:header>
          <div>系统判定<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="{row}">
          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
            <div slot="content" v-html="getTip(row)" />
            <div class="statusWrap">
              <img v-if="row.judgmentType=='Pass'" src="@/assets/images/success.png" alt="">
              <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1" src="@/assets/images/warning.png" alt="">
              <img v-if="row.judgmentType=='Error'" src="@/assets/images/selectError.png" alt="">
              <span class="judgmentText">{{ row.judgmentType }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="800" align="left" prop="judgmentContent" label="系统判定内容">
      <template v-slot:header>
          <div>系统判定内容<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.judgmentContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" >
        <template v-slot:header>
          <div>申请人备注<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyRemarks }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" >
        <template v-slot:header>
          <div>Package Owner审批意见<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.poApprovalComments }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见">
        <template v-slot:header>
          <div>Finance审批意见<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.finApprovalComments }}
          </div>
        </template>
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
            <el-button v-if="isCheck" type="primary" plain class="my-export" icon="el-icon-my-checkData" @click="checkImport">检测数据</el-button>
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
            <el-table-column prop="date" fixed align="center" label="系统判定" width="200">
              <template slot-scope="{row}">
                <el-tooltip effect="dark" placement="bottom" popper-class="tooltip">
                  <div slot="content" v-html="getTip(row)" />
                  <div class="statusWrap">
                    <img v-if="row.judgmentType=='Pass'" src="@/assets/images/success.png" alt="">
                    <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1" src="@/assets/images/warning.png" alt="">
                    <img v-if="row.judgmentType=='Error'" src="@/assets/images/selectError.png" alt="">
                    <span class="judgmentText">{{ row.judgmentType }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="400" align="center" fixed prop="judgmentContent" label="系统判定内容" />
            <el-table-column align="center" width="460" prop="cpId" label="CPID" />
            <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
            <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
            <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" />
            <el-table-column width="180" align="center" prop="costItemName" label="费用科目" />
            <el-table-column width="120" align="center" prop="channelName" label="渠道" />
            <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
            <el-table-column width="220" align="center" prop="brandName" label="品牌" />
            <el-table-column width="220" align="center" prop="productName" label="SKU" />
            <el-table-column width="220" align="center" prop="distributorName" label="经销商" />
            <el-table-column width="220" align="center" prop="regionName" label="区域" />
            <el-table-column width="220" align="right" prop="planCost" label="V1计划费用(RMB)">
              <template v-slot:header>
                <div>V1计划费用(RMB)<br><span class="subTitle">KA+Brand</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.planCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="forecastCost" label="V2预估费用-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估费用-调整后(RMB)<br><span class="subTitle">KA+SKU+经销商+Region</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.forecastCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="center" prop="costDeptName" label="费用归属部门"></el-table-column>
            <el-table-column width="220" align="center" prop="payType" label="费用核销方式"></el-table-column>
            <el-table-column width="220" align="right" prop="costDifference" label="费用差值(RMB)">
              <template v-slot:header>
                <div>费用差值(RMB)<br><span class="subTitle">KA+Brand</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.costDifference) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
            <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
            <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
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
  formatThousandNum
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V2/ListingFee'
export default {
  name: 'V2ListingFee',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        distributorCode: '',
        regionCode: '',
        customerCode: '',
        customerMdmCode: '',
        month: '',
        productName: '',
        brandCode: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      RegionList: [],
      BrandList: [],
      skuOptions: [],
      distributorArr: [],
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
    this.getBrandList()
    this.getDistributorList()
    this.getRegionList()
    this.getQuerySkuSelect()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        this.isSubmit=1
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          brandCode: this.filterObj.brandCode,
          productName: this.filterObj.productName,
          distributorCode: this.filterObj.distributorCode,
          regionCode: this.filterObj.regionCode,
          yearAndMonth: this.filterObj.month,
        }).then((response) => {
          this.tableData = response.data.records
          this.isSubmit = this.tableData[0].isSubmit
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
              res.data.version.includes('V2') &&
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
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          this.getCustomerList()
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
    getQuerySkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuOptions = res.data
      })
    },
    getRegionList() {
      if (this.filterObj.distributorCode != '') {
        selectAPI
          .getRegionList({
            distributorName: this.filterObj.distributorCode,
          })
          .then((res) => {
            if (res.code === 1000) {
              this.RegionList = res.data
            }
          })
      } else {
        selectAPI.getRegionList().then((res) => {
          if (res.code === 1000) {
            this.RegionList = res.data
          }
        })
      }
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    //千分位分隔符+两位小数
    formatNum(num) {
       return formatThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportPageExcel({
          channelCode: this.filterObj.channelCode,
          customerCode: this.filterObj.customerCode,
          brandCode: this.filterObj.brandCode,
          productName: this.filterObj.productName,
          distributorCode: this.filterObj.distributorCode,
          regionCode: this.filterObj.regionCode,
          yearAndMonth: this.filterObj.month,
          isSubmit:0
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_ListingFee_${this.filterObj.channelCode}_V2_查询.xlsx`
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
      this.event = event
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('yearAndMonth', this.filterObj.month)
      formData.append('channelCode', this.filterObj.channelCode)
      formData.append('isSubmit', 0)
      API.fileImport(formData).then((response) => {
        //清除input的value ,上传一样的
        this.event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data)||response.data.length===0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            let importList=response.data
            importList.forEach(item=>{
              if (item.judgmentType=="Error") {
                item.sort=1
              } else if(item.judgmentType.indexOf("Exception")!=-1) {
                item.sort=2
              } else {
                item.sort=3
              }
            })
            importList.sort((item,nextItem)=>item.sort-nextItem.sort)
            this.ImportData = importList
            let isError = this.ImportData.findIndex((item) => {
              return item.judgmentType == 'Error'
            })
            this.isCheck = isError == -1 ? 1 : 0
            console.log(this.saveBtn)
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
      API.formatCheck({
        yearAndMonth:this.filterObj.month,
        channelCode:this.filterObj.channelCode,
        isSubmit:0
      }).then((response) => {
        if (response.code == 1000) {
          if (!Array.isArray(response.data)) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.checkSuccess)
            let checkList=response.data
            checkList.forEach(item=>{
              if (item.judgmentType=="Error") {
                item.sort=1
              } else if(item.judgmentType.indexOf("Exception")!=-1) {
                item.sort=2
              } else {
                item.sort=3
              }
            })
            let isError=checkList.findIndex(item=>{
              return item.judgmentType=='Error'
            })
            checkList.sort((item,nextItem)=>item.sort-nextItem.sort)
            this.ImportData = checkList
            this.saveBtn = isError==-1?1:0
            console.log(this.saveBtn);
          }
        } else {
          this.$message.info(this.messageMap.checkError)
        }
      })
    },
    // 确认导入
    confirmImport() {
      API.importSave({
        yearAndMonth: this.filterObj.month,
        channelCode: this.filterObj.channelCode,
        isSubmit: 0,
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
        API.exportCheckData({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          isSubmit: 0,
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          downloadFile(
            res,
            'V2_ListingFee异常信息 -' + timestamp + '.xlsx'
          ) // 自定义Excel文件名
          this.$message.success(this.messageMap.exportErrorSuccess)
        })
      } else {
        this.$message.info('异常数据为空!')
      }
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.exportTemplateExcel({
          yearAndMonth: this.filterObj.month,
          channelCode: this.filterObj.channelCode,
          isSubmit: 0,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_ListingFee_${this.filterObj.channelCode}_V2申请.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    approve() {
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
                opinion: 'agree', // 审批标识(agree：审批通过，reject：审批驳回)
                isSubmit: 0, //申请0,审批1
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('提交成功')
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

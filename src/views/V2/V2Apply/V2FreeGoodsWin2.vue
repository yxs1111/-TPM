<!--
 * @Description: V2FreeGoodsWin2
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-09-15 13:28:12
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
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in ['NKA','EC']" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select v-model="filterObj.customerCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.productName" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in skuOptions" :key="index" :label="item.productEsName" :value="item.productEsName" />
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
      <div class="TpmButtonBG" v-permission="permissions['SAP']" @click="showUploadSAP">
        <svg-icon icon-class="uploadFile" style="font-size: 15px;" />
        <span class="text">上传SAP File</span>
      </div>
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
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed>
        <template v-slot:header>
          <div>CPID<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cpId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月">
        <template v-slot:header>
          <div>活动月<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.yearAndMonth }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型">
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package">
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目">
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="channelCode" label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称">
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="brandName" label="品牌">
        <template v-slot:header>
          <div>品牌<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.brandName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="productName" label="SKU">
        <template v-slot:header>
          <div>SKU<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.productName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="onePlanCost" label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle">KA+Brand</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.onePlanCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="twoEstimateUnitCost" label="V2预估单位费用(RMB/Tin)">
        <template v-slot:header>
          <div>V2预估单位费用(RMB/Tin)<br><span class="subTitle">SKU+Channel</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.twoEstimateUnitCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="twoEstimateNum" label="V2预估用量(Tin)">
        <template v-slot:header>
          <div>V2预估用量(Tin)<br><span class="subTitle">SKU+Channel</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.twoEstimateNum) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="twoEstimateCost" label="V2预估费用(RMB)">
        <template v-slot:header>
          <div>V2预估费用(RMB)<br><span class="subTitle">SKU+Channel</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.twoEstimateCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="adjustedTwoEstimateUnitCost" label="V2预估单位费用(RMB/Tin)">
        <template v-slot:header>
          <div>V2预估单位费用(RMB/Tin)<br><span class="subTitle">SKU+Channel</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedTwoEstimateUnitCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="adjustedTwoEstimateNum" label="V2预估用量-调整后(Tin)">
        <template v-slot:header>
          <div>V2预估用量-调整后(Tin)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.adjustedTwoEstimateNum }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="right" prop="adjustedTwoEstimateCost" label="V2预估费用-调整后(RMB)">
        <template v-slot:header>
          <div>V2预估费用-调整后(RMB)<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedTwoEstimateCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="260" align="center" prop="costDept" label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">SKU+KA</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costDept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="costWriteoffMethod" label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costWriteoffMethod }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="right" prop="costDifference" label="费用差值(RMB)">
        <template v-slot:header>
          <div>费用差值(RMB)<br><span class="subTitle">KA+Brand</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costDifference }}
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
      <el-table-column width="880" align="left" prop="judgmentContent" label="系统判定内容">
        <template v-slot:header>
          <div>系统判定内容<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.judgmentContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注">
        <template v-slot:header>
          <div>申请人备注<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyRemarks }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见">
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
            <el-table-column prop="date" fixed align="center" label="是否通过" width="200">
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
            <el-table-column width="400" align="center" prop="judgmentContent" label="验证信息" />
            <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed />
            <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
            <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
            <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" />
            <el-table-column width="280" align="center" prop="costItemName" label="费用科目" />
            <el-table-column width="120" align="center" prop="channelCode" label="渠道" />
            <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
            <el-table-column width="280" align="center" prop="brandName" label="品牌" />
            <el-table-column width="220" align="center" prop="productName" label="SKU" />
            <el-table-column width="220" align="right" prop="onePlanCost" label="V1计划费用(RMB)">
              <template v-slot:header>
                <div>V1计划费用(RMB)<br><span class="subTitle">KA+Brand</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.onePlanCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="twoEstimateUnitCost" label="V2预估单位费用(RMB/Tin)">
              <template v-slot:header>
                <div>V2预估单位费用(RMB/Tin)<br><span class="subTitle">SKU+Channel</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.twoEstimateUnitCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="twoEstimateNum" label="V2预估用量(Tin)">
              <template v-slot:header>
                <div>V2预估用量(Tin)<br><span class="subTitle">SKU+Channel</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.twoEstimateNum) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="twoEstimateCost" label="V2预估费用(RMB)">
              <template v-slot:header>
                <div>V2预估费用(RMB)<br><span class="subTitle">SKU+Channel</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.twoEstimateCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="adjustedTwoEstimateUnitCost" label="V2预估单位费用(RMB/Tin)">
              <template v-slot:header>
                <div>V2预估单位费用(RMB/Tin)<br><span class="subTitle">SKU+Channel</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedTwoEstimateUnitCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="adjustedTwoEstimateNum" label="V2预估用量-调整后(Tin)">
              <template v-slot:header>
                <div>V2预估用量-调整后(CTN)<br><span class="subTitle">SKU+KA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.adjustedTwoEstimateNum }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="right" prop="adjustedTwoEstimateCost" label="V2预估费用-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估费用-调整后(RMB)<br><span class="subTitle">SKU+KA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedTwoEstimateCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="260" align="center" prop="costDept" label="费用归属部门">
              <template v-slot:header>
                <div>费用归属部门<br><span class="subTitle">SKU+KA</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costDept }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="center" prop="costWriteoffMethod" label="费用核销方式">
              <template v-slot:header>
                <div>费用核销方式<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costWriteoffMethod }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="right" prop="costDifference" label="费用差值(RMB)">
              <template v-slot:header>
                <div>费用差值(RMB)<br><span class="subTitle">KA+Brand</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costDifference }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注">
              <template v-slot:header>
                <div>申请人备注<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.applyRemarks }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见">
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
        </div>
      </div>
    </el-dialog>
    <!-- 上传SAP  -->
    <el-dialog width="50%" class="my-el-dialog" title="上传SAP" :visible="isSAPVisible" @close="closeUploadSAP">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="el-form-row">
          <el-form-item label="活动月" prop="month">
            <el-select v-model="ruleForm.month" filterable clearable placeholder="请选择">
              <el-option v-for="item in monthList" :key="item.id" :label="item.activityMonth" :value="item.activityMonth" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道" prop="channelName">
            <el-select v-model="ruleForm.channelName" clearable filterable placeholder="请选择" @change="getCustomerList">
              <el-option v-for="(item) in ['NKA','EC']" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="fileInfo ImportContent" style="margin-left: 31px;margin-bottom: 20px;">
        <div class="fileTitle">文件</div>
        <div class="my-search selectFile" @click="parsingSAPBtn">
          <img src="@/assets/images/selectFile.png" alt="">
          <span class="text">选择文件</span>
        </div>
        <input id="fileElem" ref="SAPFile" type="file" style="display: none" @change="uploadSAP($event)">
        <div v-if="uploadSAPFileName!=''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
          <span>{{ uploadSAPFileName }}</span>
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
import API from '@/api/V2/FreeGoods'
export default {
  name: 'V2FreeGoodsWin2',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        customerName: '',
        productName: '',
        month: '',
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      monthList: [],
      customerArr: [],
      tableData: [],
      skuOptions: [],
      maxheight: getHeightHaveTab(),
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      isSelf: 0, //是否是当前审批人
      mainId: '',
      usernameLocal: '',
      messageMap: messageMap(),
      // 导入
      importVisible: false, // 导入弹窗
      isSAPVisible: false, // 导入弹窗
      ImportData: [],
      uploadFileName: '',
      uploadSAPFileName: '',
      event: '',
      uploadFile: '',
      uploadSAPFile: '',
      ruleForm: {
        month: '',
        channelName: '',
      },
      rules: {
        month: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        channelName: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
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
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          customerCode: this.filterObj.customerName,
          productName: this.filterObj.productName,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
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
              res.data.version === 'Free Goods-V2' &&
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
    //千分位分隔符+两位小数
    formatNum(num) {
      return FormateThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.downExcel({
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          customerName: this.filterObj.customerName,
          productName: this.filterObj.productName,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_Free Goods-Win2_${this.filterObj.channelCode}_V2_查询.xlsx`
          ) //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
    },
    showUploadSAP() {
      this.isSAPVisible = true
    },
    closeUploadSAP() {
      this.isSAPVisible = false
      this.uploadSAPFile = null
      this.uploadSAPFileName = null
      this.ruleForm.month = null
      this.ruleForm.channelName = null
    },
    // 选择导入文件 SAP
    parsingSAPBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$refs.SAPFile.dispatchEvent(new MouseEvent('click'))
        } else {
          this.$message.error('请先选择活动月、渠道')
          return false
        }
      })
    },
    //SAP 文件上传
    uploadSAP(event) {
      this.uploadSAPFileName = event.target.files[0].name
      this.uploadSAPFile = event.target.files[0]
      const formData = new FormData()
      formData.append('file', this.uploadSAPFile)
      formData.append('yearAndMonth', this.ruleForm.month)
      formData.append('type', 2)
      formData.append('channelName', this.ruleForm.channelName)
      API.uploadSAP(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          this.$message.success('SAP File 上传成功')
          this.closeUploadSAP()
        }
      })
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
      formData.append('yearAndMonth', this.filterObj.month)
      formData.append('channelName', this.filterObj.channelCode)
      formData.append('type', 2) //（1：Free Goods - Tin，2：Free Goods - Win 2）
      formData.append('importType', 1) //	导入类型（1：申请导入，2：审批导入）
      API.importNormal(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data) || response.data.length === 0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            this.ImportData = response.data
            this.isCheck = response.data[0].judgmentType !== 'Error'
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
        channelName: this.filterObj.channelCode,
        type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
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
      API.save({
        yearAndMonth: this.filterObj.month,
        channelName: this.filterObj.channelCode,
        type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
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
          channelName: this.filterObj.channelCode,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          downloadFile(res, 'V2_Free Goods-Win2异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
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
        API.downExcelTemplate({
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          type: 2, //cost item类型（1：Free Goods - Tin，2：Free Goods - Win 2）
          downType: 1, //下载模板类型（1：申请，2：审批）
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_Free Goods-Win2_${this.filterObj.channelCode}_V2申请.xlsx`
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
              API.submit({
                mainId: mainId, // 主表id
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

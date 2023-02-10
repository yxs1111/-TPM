<!--
 * @Description: V2ECM
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-12-05 17:13:46
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月:</span>
          <el-select v-model="filterObj.month"
                     filterable
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in monthList"
                       :key="item.id"
                       :label="item.activityMonth"
                       :value="item.activityMonth" />
          </el-select>
        </div>
        <div class="Selectli"
             @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item) in channelArr"
                       :key="item"
                       :label="item.channelEsName"
                       :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Cost Type:</span>
          <el-select v-model="filterObj.CostTypeIndex" clearable filterable placeholder="请选择" class="my-el-select"  @change='changeMinepackage2'>
            <el-option v-for="(item, index)  in CostTypeList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">MinePackage:</span>
          <el-select v-model="filterObj.MinePackageIndex" clearable filterable placeholder="请选择" class="my-el-select"  @change='changeMinepackage'>
            <el-option v-for="(item, index)  in MinePackageList" :key="index" :label="item.costType" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">费用科目:</span>
          <el-select v-model="filterObj.costAccount" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in CostItemList" :key="index" :label="item.costType" :value="item.costTypeCode" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary"
                   class="TpmButtonBG"
                   @click="clear">清除数据</el-button>
        <el-button type="primary"
                   class="TpmButtonBG"
                   @click="search">查询</el-button>
        <div class="TpmButtonBG"
             @click="downExcel">
          <img src="@/assets/images/export.png"
               alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap"
         style="align-items: center;">
      <!-- :class="!isSubmit&&isSelf?'':'noClick'" -->
      <div class="TpmButtonBG"
           :class="!isSubmit&&isSelf?'':'noClick'"
           @click="importData">
        <img src="@/assets/images/import.png"
             alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG"
           :class="!isSubmit&&isSelf?'':'noClick'"
           @click="approve()">
        <svg-icon icon-class="passApprove"
                  style="font-size: 24px;" />
        <span class="text">提交</span>
      </div>
    </div>
    <el-table :data="tableData"
              :max-height="maxheight"
              border
              :header-cell-style="HeadTable"
              :row-class-name="tableRowClassName"
              style="width: 100%">
      <el-table-column align="center"
                       width="460"
                       prop="cpId"
                       label="CPID"
                       fixed>
        <template v-slot:header>
          <div>CPID<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.cpId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       align="center"
                       prop="yearAndMonth"
                       label="活动月">
        <template v-slot:header>
          <div>活动月<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.yearAndMonth }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150"
                       align="center"
                       prop="costType"
                       label="费用类型">
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190"
                       align="center"
                       prop="minePackage"
                       label="Mine Package">
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190"
                       align="center"
                       prop="costItem"
                       label="费用科目">
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       align="center"
                       prop="channelCode"
                       label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="pnlCustomerCode"
                       label="pnl客户">
        <template v-slot:header>
          <div>pnl客户<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerPnlName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="customerName"
                       label="客户">
        <template v-slot:header>
          <div>客户<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="brandName"
                       label="品牌">
        <template v-slot:header>
          <div>品牌<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.brandSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="skuCode"
                       label="SKU(Only for FG)">
        <template v-slot:header>
          <div>SKU(Only for FG)<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.skuSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="distributorCode"
                       label="经销商">
        <template v-slot:header>
          <div>经销商<br><span class="subTitle"> -</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{  scope.row.distributorSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="zoneSpName"
                       label="大区">
        <template v-slot:header>
          <div>大区<br><span class="subTitle"> -</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{  scope.row.zoneSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="regionSpName"
                       label="区域">
        <template v-slot:header>
          <div>区域<br><span class="subTitle"> -</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{  scope.row.regionSpName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="pickingQuantity"
                       label="领用量(tin,Only for FG)">
        <template v-slot:header>
          <div>领用量(tin,Only for FG)<br><span class="subTitle"> - </span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.pickingQuantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="costAmount"
                       label="费用金额(RMB)">
        <template v-slot:header>
          <div>费用金额(RMB)<br><span class="subTitle"> -</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costAmount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="costAscriptionDept"
                       label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costAscriptionDept }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180"
                       align="center"
                       prop="systemJudgment"
                       label="系统判定">
        <template v-slot:header>
          <div>系统判定<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="{row}">
          <el-tooltip effect="dark"
                      placement="bottom"
                      popper-class="tooltip">
            <div slot="content"
                 v-html="getTip(row)" />
            <div class="statusWrap">
              <img v-if="row.systemJudgment=='Pass'"
                   src="@/assets/images/success.png"
                   alt="">
              <img v-if="row.systemJudgment!=null&&row.systemJudgment.indexOf('Exception') > -1"
                   src="@/assets/images/warning.png"
                   alt="">
              <img v-if="row.systemJudgment=='Error'"
                   src="@/assets/images/selectError.png"
                   alt="">
              <span class="judgmentText">{{ row.systemJudgment }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="800"
                       align="left"
                       prop="systemJudgmentContent"
                       label="系统判定内容">
        <template v-slot:header>
          <div>系统判定内容<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.systemJudgmentContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       align="center"
                       prop="applicantRemark"
                       label="申请人备注">
        <template v-slot:header>
          <div>申请人备注<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.applicantRemark }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="hqPpmIdea"
                       label="HQ PPM审批意见">
        <template v-slot:header>
          <div>HQ PPM审批意见<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.hqPpmIdea }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="finIdea"
                       label="Fin审批意见">
        <template v-slot:header>
          <div>Fin审批意见<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.finIdea }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum"
                     :page-sizes="[5, 10, 50, 100]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="66%"
               class="my-el-dialog"
               title="导入"
               :visible="importVisible"
               @close="closeImportDialog">
      <div class="importDialog">
        <div class="el-downloadFileBar">
          <div>
            <el-button type="primary"
                       plain
                       class="my-export"
                       icon="el-icon-my-down"
                       @click="downloadTemplate">下载模板</el-button>
            <el-button v-if="isCheck"
                       type="primary"
                       plain
                       class="my-export"
                       icon="el-icon-my-checkData"
                       @click="checkImport">检测数据</el-button>
          </div>
          <el-button v-if="saveBtn"
                     type="primary"
                     class="TpmButtonBG"
                     @click="confirmImport">保存</el-button>
        </div>
        <div class="fileInfo">
          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <div class="my-search selectFile"
                 @click="parsingExcelBtn">
              <img src="@/assets/images/selectFile.png"
                   alt="">
              <span class="text">选择文件</span>
            </div>
            <input id="fileElem"
                   ref="filElem"
                   type="file"
                   style="display: none"
                   @change="parsingExcel($event)">
            <div v-if="uploadFileName!=''"
                 class="fileName">
              <img src="@/assets/upview_fileicon.png"
                   alt=""
                   class="upview_fileicon">
              <span>{{ uploadFileName }}</span>
            </div>
          </div>
          <div class="seeData"
               style="width: auto;">
            <div class="exportError"
                 @click="exportErrorList">
              <img src="@/assets/exportError_icon.png"
                   alt=""
                   class="exportError_icon">
              <span>导出错误信息</span>
            </div>
          </div>
        </div>
        <div class="tableWrap">
          <el-table border
                    height="400"
                    :data="ImportData"
                    style="width: 100%"
                    :header-cell-style="{
              background: '#fff',
              color: '#333',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 400,
              fontFamily: 'Source Han Sans CN'
            }"
                    :row-class-name="tableRowClassName"
                    stripe>
            <el-table-column width="180"
                             align="center"
                             fixed="left"
                             prop="systemJudgment"
                             label="系统判定">
              <template v-slot:header>
                <div>系统判定<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="{row}">
                <el-tooltip effect="dark"
                            placement="bottom"
                            popper-class="tooltip">
                  <div slot="content"
                       v-html="getTip(row)" />
                  <div class="statusWrap">
                    <img v-if="row.systemJudgment=='Pass'"
                         src="@/assets/images/success.png"
                         alt="">
                    <img v-if="row.systemJudgment!=null&&row.systemJudgment.indexOf('Exception') > -1"
                         src="@/assets/images/warning.png"
                         alt="">
                    <img v-if="row.systemJudgment=='Error'"
                         src="@/assets/images/selectError.png"
                         alt="">
                    <span class="judgmentText">{{ row.systemJudgment }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column width="350"
                             align="left"
                             fixed="left"
                             prop="systemJudgmentContent"
                             label="系统判定内容">
              <template v-slot:header>
                <div>系统判定内容<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.systemJudgmentContent }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             width="230"
                             prop="cpId"
                             label="CPID">
              <template v-slot:header>
                <div>CPID<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.cpId }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120"
                             align="center"
                             prop="yearAndMonth"
                             label="活动月">
              <template v-slot:header>
                <div>活动月<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.yearAndMonth }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120"
                             align="center"
                             prop="costType"
                             label="费用类型">
              <template v-slot:header>
                <div>费用类型<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costTypeSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="190"
                             align="center"
                             prop="minePackage"
                             label="Mine Package">
              <template v-slot:header>
                <div>Mine Package<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.minePackageSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="180"
                             align="center"
                             prop="costItem"
                             label="费用科目">
              <template v-slot:header>
                <div>费用科目<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costItemSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120"
                             align="center"
                             prop="channelCode"
                             label="渠道">
              <template v-slot:header>
                <div>渠道<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.channelSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="pnlCustomerCode"
                             label="pnl客户">
              <template v-slot:header>
                <div>pnl客户<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.customerPnlName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="customerName"
                             label="客户">
              <template v-slot:header>
                <div>客户<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.customerSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="brandName"
                             label="品牌">
              <template v-slot:header>
                <div>品牌<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.brandSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="skuCode"
                             label="SKU(Only for FG)">
              <template v-slot:header>
                <div>SKU(Only for FG)<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.skuSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="distributorCode"
                             label="经销商">
              <template v-slot:header>
                <div>经销商<br><span class="subTitle"> -</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{  scope.row.distributorSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="zoneSpName"
                             label="大区">
              <template v-slot:header>
                <div>大区<br><span class="subTitle"> -</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{  scope.row.zoneSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="regionSpName"
                             label="区域">
              <template v-slot:header>
                <div>区域<br><span class="subTitle"> -</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{  scope.row.regionSpName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="pickingQuantity"
                             label="领用量(tin,Only for FG)">
              <template v-slot:header>
                <div>领用量(tin,Only for FG)<br><span class="subTitle"> - </span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.pickingQuantity }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="costAmount"
                             label="费用金额(RMB)">
              <template v-slot:header>
                <div>费用金额(RMB)<br><span class="subTitle"> -</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costAmount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="costAscriptionDept"
                             label="费用归属部门">
              <template v-slot:header>
                <div>费用归属部门<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costAscriptionDept }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120"
                             align="center"
                             prop="applicantRemark"
                             label="申请人备注">
              <template v-slot:header>
                <div>申请人备注<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.applicantRemark }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="hqPpmIdea"
                             label="HQ PPM审批意见">
              <template v-slot:header>
                <div>HQ PPM审批意见<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.hqPpmIdea }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="finIdea"
                             label="Fin审批意见">
              <template v-slot:header>
                <div>Fin审批意见<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.finIdea }}
                </div>
              </template>
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
  formatThousandNum,
} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V2/allrkartm'
export default {
  name: 'V2Allrkartm',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        MinePackageIndex: '',
        costAccount: '',
        MinePackageName: '',
        channelCode: '', //渠道
        month: '', //活动月
      },
      permissions: getDefaultPermissions(),
      channelArr: [],
      supplierArr: [], //供应商下拉
      zoneArr: [], //大区下拉
      regionArr: [], //区域下拉
      CostItemList: [],
      monthList: [],
      CostTypeList: [],
      customerArr: [],
      MinePackageList: [],
      tableData: [],

      BrandList: [],

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
  watch: {
    'filterObj.CostTypeIndex'(value) {
      console.log(this.CostTypeList)
      if(value!=='') {
        this.filterObj.costTypeName=this.CostTypeList[this.filterObj.CostTypeIndex].costType
        this.filterObj.costType=this.CostTypeList[this.filterObj.CostTypeIndex].costTypeNumber
      } else {
        this.filterObj.costType = ''
      }
      this.filterObj.MinePackage = ''
      this.getMinePackage(this.filterObj.costType)
    },
    'filterObj.MinePackageIndex'(value) {
      console.log(this.MinePackageList)
      if(value!=='') {
        this.filterObj.MinePackageName=this.MinePackageList[this.filterObj.MinePackageIndex].costType
        this.filterObj.MinePackage=this.MinePackageList[this.filterObj.MinePackageIndex].costTypeNumber
      } else {
        this.filterObj.MinePackage = ''
      }
      this.filterObj.costItem = ''
      this.getCostItemList(this.filterObj.MinePackage)
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    this.getChannel()
    this.getAllMonth()
    this.getMinePackage(this.filterObj.costType)
    this.getCostType()
    this.getCostItemList(this.filterObj.MinePackage)
  },
  methods: {
    changeMinepackage() {
      this.filterObj.costAccount = ''
    },
    // 清除数据
    clear() {
      if (this.filterObj.channelCode == '' || this.filterObj.month == '') {
        if (this.filterObj.month == '') {
          this.$message.info(messageObj.requireMonth)
          return
        }
        if (this.filterObj.channelCode == '') {
          this.$message.info(messageObj.requireChannel)
        }
      } else {
        API.getClear({
          channelCode: this.filterObj.channelCode, //渠道
          yearAndMonth: this.filterObj.month,
          //   isSubmit: 0,
        }).then((res) => {
          if (res.code === 1000) {
            res.data.forEach((item) => {
              this.$message.success('清除成功!')
            })
          }
        })
      }
    },
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
        this.isSubmit = 1
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数

          channelCode: this.filterObj.channelCode, //渠道
          minePackageCode: this.filterObj.MinePackage,

          costTypeCode: this.filterObj.costType,
          costItemMdmCode: this.filterObj.costAccount,
          yearAndMonth: this.filterObj.month,
          //   isSubmit: 0,
        }).then((response) => {
          this.tableData = response.data.records

          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          if (this.tableData.length > 0) {
            this.isSubmit = this.tableData[0].isSubmit
            this.mainId = this.tableData[0].mainId
          }
          if (this.total === 0 || response.data.records[0].isFirstSubmit === '1') {
            // 第一次提交没有审批流
            this.isSelf = true
            this.isSubmit = 0
          } else if (this.total != 0 ||response.data.records[0].isFirstSubmit === '0') {
            // 驳回之后，是否当前审批人
            this.infoByMainId()
          }
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
              res.data.version.includes('V2') && res.data.activityName.includes('调整') &&
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
    // 渠道获取下拉框
    getChannel() {
      selectAPI.othersChannelSelect().then((res) => {
        if (res.code === 1000) {
          res.data.forEach((item) => {
            if (item.channelEsName !== 'NKA' && item.channelEsName !== 'EC') {
              this.channelArr.push(item)
            }
          })
        }
      })
    },
    // cost type下拉
    getCostType() {
      API.getCostTypeList({
        parentId: '',
      })
        .then((res) => {
          if (res.code === 1000) {
            this.CostTypeList = res.data
          }
          // this.getCostItemList(this.filterObj.MinePackageCode)
        })
    },
    // 费用科目获取下拉框
    getCostItemList(code) {
      API.getCostItemList({
        minePackageCode: code,
      }).then((res) => {
        if (res.code === 1000) {
          this.CostItemList = res.data
        }
      })
    },
    // minepackage
    getMinePackage(code) {
      API.getMinePackageList({
        costType: code,
      })
        .then((res) => {
          this.MinePackageList = res.data
          // this.getCostItemList(this.filterObj.MinePackageCode)
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
          //   pageNum: this.pageNum, // 当前页
          //   pageSize: this.pageSize, // 每页条数
          channelCode: this.filterObj.channelCode, //渠道
          minePackageCode: this.filterObj.MinePackage,

          costTypeCode: this.filterObj.costType,
          costItemMdmCode: this.filterObj.costAccount,
          yearAndMonth: this.filterObj.month,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_All-RKA&RTM_${this.filterObj.channelCode}_V2_查询.xlsx`
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
      formData.append('importType', 1) // 1申请0审批
      //   formData.append('isSubmit', 0)
      API.fileImport(formData).then((response) => {
        //清除input的value ,上传一样的
        this.event.srcElement.value = '' // 置空
        if (response.code == 1000) {
          if (!Array.isArray(response.data) || response.data.length === 0) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.importSuccess)
            let importList = response.data
            importList.forEach((item) => {
              if (item.systemJudgment == 'Error') {
                item.sort = 1
              } else if (item.systemJudgment.indexOf('Exception') != -1) {
                item.sort = 2
              } else {
                item.sort = 3
              }
            })
            importList.sort((item, nextItem) => item.sort - nextItem.sort)
            this.ImportData = importList
            let isError = this.ImportData.findIndex((item) => {
              return item.systemJudgment == 'Error'
            })
            this.saveBtn = isError == -1 ? 1 : 0
            console.log(this.saveBtn)
          }
        } else {
          this.$message.info(this.messageMap.importError)
        }
      })
    },
    // 导出异常信息
    exportErrorList() {
      if (this.ImportData.length) {
        API.exportCheckData({
          channelCode: this.filterObj.channelCode, //渠道
          minePackage: this.filterObj.MinePackage,

          costTypeCode: this.filterObj.costType,
          costItemMdmCode: this.filterObj.costAccount,
          yearAndMonth: this.filterObj.month,
          //   isSubmit: 0,
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          downloadFile(res, 'V2_All-RKA&RTM异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
          this.$message.success(this.messageMap.exportErrorSuccess)
        })
      } else {
        this.$message.info('异常数据为空!')
      }
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
    // 确认导入
    confirmImport() {
      API.importSave({
        // mainId: this.tableData[0].mainId,
        yearAndMonth: this.filterObj.month,
        channelCode: this.filterObj.channelCode, //渠道
        // isSubmit: 0,
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
    // 下载模板
    downloadTemplate() {
      // 导出数据筛选
      API.exportTemplateExcel({
        channelCode: this.filterObj.channelCode, //渠道
        yearAndMonth: this.filterObj.month,
        //   isSubmit: 0,
      }).then((res) => {
        downloadFile(
          res,
          `${this.filterObj.month}_All-RKA&RTM_${this.filterObj.channelCode}_V2申请.xlsx`
        ) // 自定义Excel文件名
        this.$message.success(this.messageMap.exportSuccess)
      })
    },
    approve() {
      if (this.tableData.length) {
        this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const mainId = this.tableData[0].mainId
            API.approve({
              yearAndMonth: this.filterObj.month,
              channelCode: this.filterObj.channelCode, //渠道
              // mainId: mainId, // 主表id
              paramMap: { opinion: 'agree'}, // 审批标识(agree：审批通过，reject：审批驳回)
              // isSubmit: 0, //申请0,审批1
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

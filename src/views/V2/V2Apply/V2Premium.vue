<!--
 * @Description: V2POSM
 * @Date: 2022-04-28 14:44:18
<<<<<<< HEAD
 * @LastEditTime: 2022-12-22 16:41:00
=======
 * @LastEditTime: 2022-12-05 17:13:55
>>>>>>> dev
-->
<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
<!--        活动月-->
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
                     placeholder="请选择"
                     @change="getCustomerList">
            <el-option
              v-for="(item, index) in channelArr"
              :key="index"
              :label="item.channelEsName"
              :value="item.channelCode"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select v-model="filterObj.customerCode"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in customerArr"
                       :key="index"
                       :label="item.customerCsName"
                       :value="item.customerCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商:</span>
          <el-select v-model="filterObj.supplierCode"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in supplierArr"
                       :key="index"
                       :label="item.supplierName"
                       :value="item.supplierCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.distributorCode"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in distributorCodeArr"
                       :key="index"
                       :label="item.distributorName"
                       :value="item.distributorMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动类型:</span>
          <el-select v-model="filterObj.item"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in regionArr"
                       :key="index"
                       :label="item.item"
                       :value="item.item" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">

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
      <div
        class="TpmButtonBG"
        :class="!isSubmit && isSelf ?  '' : 'noClick'"
        @click="importData"
      >
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG"
           :class=" !isSubmit && isSelf? '':'noClick'"
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
                       width="600"
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
      <el-table-column width="120"
                       align="center"
                       prop="costTypeName"
                       label="费用类型">
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costTypeName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="190"
                       align="center"
                       prop="minePackageCode"
                       label="Mine Package">
        <template v-slot:header>
          <div>Mine Package<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.minePackageName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180"
                       align="center"
                       prop="costItemName"
                       label="费用科目">
        <template v-slot:header>
          <div>费用科目<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costItemName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       align="center"
                       prop="channelName"
                       label="渠道">
        <template v-slot:header>
          <div>渠道<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.channelName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="customerName"
                       label="客户系统名称">
        <template v-slot:header>
          <div>客户系统名称<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.customerName }}
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
            {{ scope.row.brandName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="distributorName"
                       label="供应商/经销商">
        <template v-slot:header>
          <div>供应商/经销商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.distributorName == null ? scope.row.supplierName : scope.row.distributorName }}          </div>
        </template>
        <!-- 数据未对接 -->
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="item"
                       label="活动类型">
        <template v-slot:header>
          <div>活动类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.item }}
          </div>
        </template>
        <!-- 数据未对接 -->
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="planCost"
                       label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle"> KA + Brand + 活动类型 </span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.planCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="forecastCost"
                       label="V2预估费用-默认(RMB)">
        <template v-slot:header>
          <div>V2预估费用-默认(RMB)<br><span class="subTitle"> KA + Brand + 活动类型 </span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.forecastCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="adjustedCost"
                       label="V2预估费用-调整后(RMB)">
        <template v-slot:header>
          <div>V2预估费用-调整后(RMB)<br><span class="subTitle"> KA + Brand + Vendor/Dist + 活动类型</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.adjustedCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="costDeptCode"
                       label="费用归属部门">
        <template v-slot:header>
          <div>费用归属部门<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costDeptName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="payType"
                       label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.payType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="costDifference"
                       label="费用差值(RMB)">
        <template v-slot:header>
          <div>费用差值(RMB)<br><span class="subTitle"> KA + Brand </span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.costDifference) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180"
                       align="center"
                       prop="judgmentType"
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
              <span class="judgmentText">{{ row.judgmentType }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="800"
                       align="center"
                       prop="judgmentContent"
                       label="系统判定内容">
        <template v-slot:header>
          <div>系统判定内容<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.judgmentContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       align="center"
                       prop="applyRemarks"
                       label="申请人备注">
        <template v-slot:header>
          <div>申请人备注<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyRemarks }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="poApprovalComments"
                       label="Package Owner审批意见">
        <template v-slot:header>
          <div>Package Owner审批意见<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.poApprovalComments }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="finApprovalComments"
                       label="Finance审批意见">
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
      <el-pagination :current-page="pageNum"
                     :page-sizes="[100, 200, 500, 1000]"
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
          <vxe-table border
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
            <vxe-table-column width="180"
                             align="center"
                             field="systemJudgment"
                             title="系统判定"
                              fixed="left">
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
                    <img v-if="row.judgmentType=='Pass'"
                         src="@/assets/images/success.png"
                         alt="">
                    <img v-if="row.judgmentType!=null&&row.judgmentType.indexOf('Exception') > -1"
                         src="@/assets/images/warning.png"
                         alt="">
                    <img v-if="row.judgmentType=='Error'"
                         src="@/assets/images/selectError.png"
                         alt="">
                    <span class="judgmentText">{{ row.judgmentType }}</span>
                  </div>
                </el-tooltip>
              </template>
            </vxe-table-column>
            <vxe-table-column width="270"
                              align="center"
                              fixed='left'
                              field="systemJudgmentContent"
                              title="系统判定内容">
              <template v-slot:header>
                <div>系统判定内容<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.judgmentContent }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column align="center"
                             width="330"
                             field="cpId"
                             title="CPID">
              <template v-slot:header>
                <div>CPID<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.cpId }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="120"
                             align="center"
                             field="yearAndMonth"
                             title="活动月">
              <template v-slot:header>
                <div>活动月<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.yearAndMonth }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="120"
                             align="center"
                             field="costTypeName"
                             title="费用类型">
              <template v-slot:header>
                <div>费用类型<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costTypeName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="190"
                             align="center"
                             field="minePackageCode"
                             title="Mine Package">
              <template v-slot:header>
                <div>Mine Package<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.minePackageName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="180"
                             align="center"
                             field="costItemCode"
                             title="费用科目">
              <template v-slot:header>
                <div>费用科目<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costItemName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="120"
                             align="center"
                             field="channelCode"
                             title="渠道">
              <template v-slot:header>
                <div>渠道<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.channelCode }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="customerName"
                             title="客户系统名称">
              <template v-slot:header>
                <div>客户系统名称<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.customerName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="brandName"
                             title="品牌">
              <template v-slot:header>
                <div>品牌<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.brandName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="supplierName"
                             title="供应商">
              <template v-slot:header>
                <div>供应商/经销商<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.distributorName == null ? scope.row.supplierName : scope.row.distributorName }}
                </div>
              </template>
              <!-- 数据未对接 -->
            </vxe-table-column>
            <vxe-table-column width="220"
                              align="center"
                              field="item"
                              title="活动类型">
              <template v-slot:header>
                <div>活动类型<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.item }}
                </div>
              </template>
              <!-- 数据未对接 -->
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="planCost"
                             title="V1计划费用(RMB)">
              <template v-slot:header>
                <div>V1计划费用(RMB)<br><span class="subTitle"> KA + Brand + 活动类型</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.planCost) }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="forecastCost"
                             title="V2预估费用-默认(RMB)">
              <template v-slot:header>
                <div>V2预估费用-默认(RMB)<br><span class="subTitle"> KA + Brand + 活动类型 </span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.forecastCost) }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="adjustedCost"
                             title="V2预估费用-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估费用-调整后(RMB)<br><span class="subTitle"> KA + Brand + Vendor/Dist + 活动类型</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.adjustedCost) }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="costDeptCode"
                             title="费用归属部门">
              <template v-slot:header>
                <div>费用归属部门<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costDeptName }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="payType"
                             title="费用核销方式">
              <template v-slot:header>
                <div>费用核销方式<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.payType }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="costDifference"
                             title="费用差值(RMB)">
              <template v-slot:header>
                <div>费用差值(RMB)<br><span class="subTitle"> KA + Brand </span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.costDifference) }}
                </div>
              </template>
            </vxe-table-column>

            <vxe-table-column width="120"
                             align="center"
                             field="applyRemarks"
                             title="申请人备注">
              <template v-slot:header>
                <div>申请人备注<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.applyRemarks }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="poApprovalComments"
                             title="Package Owner审批意见">
              <template v-slot:header>
                <div>Package Owner审批意见<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.poApprovalComments }}
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220"
                             align="center"
                             field="finApprovalComments"
                             title="Finance审批意见">
              <template v-slot:header>
                <div>Finance审批意见<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.finApprovalComments }}
                </div>
              </template>
            </vxe-table-column>
          </vxe-table>
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
import API from '@/api/V2/Premium'
export default {
  name: 'V2Premium',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        supplierCode: '', //供应商
        channelCode: '', //渠道
        customerCode: '', //客户系统名称
        month: '', //活动月
        distributorCode: '', //经销商
        item: '', //活动类型
      },
      permissions: getDefaultPermissions(),
      supplierArr: [], //供应商下拉
      distributorCodeArr: [],
      regionArr: [], //区域下拉

      monthList: [],
      customerArr: [],
      tableData: [],
      channelArr: [],

      BrandList: [],

      maxheight: getHeightHaveTab(),
      isSubmit: 0, // 提交状态  1：已提交，0：未提交
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
    // // 拿到表格挂载后的真实DOM
    // const table = this.$refs.table;
    // // 拿到表格中承载数据的div元素
    // const bodyWrapper = table.bodyWrapper;
    // // 监听滚动事件
    // bodyWrapper.onscroll = () => {
    //   // 滚动条位置强制设置指定行上边缘（48为行高）
    //   bodyWrapper.scrollTop = Math.round(bodyWrapper.scrollTop / 71.333) * 71.333;
    // }
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.usernameLocal = localStorage.getItem('usernameLocal')
    // this.getChannel()
    this.getAllMonth()
    this.getBrandList()
    this.getzoneArr()
    // this.getDistributorList()
    // this.getRegionList()
    this.getPageMdSupplier()
    this.queryDistributorList()
    this.getChannel()
    // this.getQuerySkuSelect()
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
        this.isSubmit = 0
        API.getPage({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          channelCode: this.filterObj.channelCode, //渠道
          customerCode: this.filterObj.customerCode, //客户系统名称
          brandCode: this.filterObj.brandCode, //品牌系统名称
          item: this.filterObj.item, //活动类型
          distributorCode: this.filterObj.distributorCode, //经销商
          supplierCode: this.filterObj.supplierCode, //供应商

          yearAndMonth: this.filterObj.month, //活动月
        }).then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
          console.log(this.pageNum, this.pageSize, this.total, 'dangqianye')
          this.isSubmit = this.tableData[0].isSubmit
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
              res.data.version === 'Premium-V2' &&
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
    getPageMdSupplier() {
      selectAPI.getPageMdSupplier({pageSize: 9999}).then((res) => {
        if (res.code === 1000) {
          this.supplierArr = res.data
        }
      })
    },
    // 经销商
    queryDistributorList() {
      selectAPI.queryDistributorList({}).then((res) => {
        if (res.code === 1000) {
          this.distributorCodeArr = res.data
        }
      })
    },
    //渠道
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          this.getCustomerList(this.filterObj.channelCode)
        }
      })
    },
    //活动类型
    getBrandList() {
      selectAPI.getECMItemList({ minePackage: 'Premium'}).then((res) => {
        if (res.code === 1000) {
          this.regionArr = res.data
        }
      })
    },
    //获取大区下拉
    getzoneArr() {
      selectAPI.getLargeAreaList({}).then((res) => {
        if (res.code === 1000) {
          this.zoneArr = res.data
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
          //   pageNum: this.pageNum, // 当前页
          //   pageSize: this.pageSize, // 每页条数
          item: this.filterObj.item, //活动
          supplierName: this.filterObj.supplierName, //供应商
          channelCode: this.filterObj.channelCode, //渠道
          customerCode: this.filterObj.customerCode, //客户系统名称

          yearAndMonth: this.filterObj.month,
          brandCode: this.filterObj.brandCode,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_Premium_${this.filterObj.channelCode}_V2_查询.xlsx`
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
      // formData.append('importType', 1) //1申请0审批
      formData.append('isSubmit', 0)
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
              console.log(importList)
              if (item.judgmentType == 'Error') {
                item.sort = 1
              } else if (item.judgmentType.indexOf('Exception') != -1) {
                item.sort = 2
              } else {
                item.sort = 3
              }
            })
            importList.sort((item, nextItem) => item.sort - nextItem.sort)
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
        yearAndMonth: this.filterObj.month,
        channelCode: this.filterObj.channelCode,
        isSubmit: 0,
      }).then((response) => {
        if (response.code == 1000) {
          if (!Array.isArray(response.data)) {
            this.$message.info('导入数据为空，请检查模板')
          } else {
            this.$message.success(this.messageMap.checkSuccess)
            let checkList = response.data
            checkList.forEach((item) => {
              if (item.judgmentType == 'Error') {
                item.sort = 1
              } else if (item.judgmentType.indexOf('Exception') != -1) {
                item.sort = 2
              } else {
                item.sort = 3
              }
            })
            let isError = checkList.findIndex((item) => {
              return item.judgmentType == 'Error'
            })
            console.log(isError, 'isError')
            checkList.sort((item, nextItem) => item.sort - nextItem.sort)
            this.ImportData = checkList
            this.saveBtn = isError == -1 ? 1 : 0
            console.log(this.saveBtn)
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
          downloadFile(res, 'V2_Premium_异常信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
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
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_Premium_${this.filterObj.channelCode}_V2申请.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    approve() {
      if (this.tableData.length) {
        const systemJudgment = this.tableData[0].judgmentType
        if (systemJudgment != null) {
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
.statusWrap{
  img{height: 25px;width: 25px;margin-right: 5px}
  align-items: center;
  display: flex;
  justify-content: center;
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

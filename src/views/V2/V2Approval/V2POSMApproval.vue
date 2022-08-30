<!--
 * @Description: V2POSMApproval
 * @Date: 2022-04-28 14:44:18
 * @LastEditTime: 2022-08-15 09:57:35
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
                     placeholder="请选择"
                     @change="getCustomerList">
            <el-option v-for="(item) in ['NKA']"
                       :key="item"
                       :label="item"
                       :value="item" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户系统名称:</span>
          <el-select v-model="filterObj.customerName"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in customerArr"
                       :key="index"
                       :label="item.customerCsName"
                       :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">供应商:</span>
          <el-select v-model="filterObj.supplierName"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in supplierArr"
                       :key="index"
                       :label="item.supplierName"
                       :value="item.supplierName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">大区:</span>
          <el-select v-model="filterObj.zoneName"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in zoneArr"
                       :key="index"
                       :label="item.name"
                       :value="item.name" />
          </el-select>
        </div>

        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.regionName"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in regionArr"
                       :key="index"
                       :label="item.name"
                       :value="item.name" />
          </el-select>
        </div>

        <div class="Selectli">
          <span class="SelectliTitle">POSM item:</span>
          <el-select v-model="filterObj.brandCode"
                     clearable
                     filterable
                     placeholder="请选择">
            <el-option v-for="(item, index) in BrandList"
                       :key="index"
                       :label="item.brandName"
                       :value="item.brandName" />
          </el-select>
          <!-- 下拉数据接口未对接 -->
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
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG"
           :class="!isSubmit?'':'noClick'"
           @click="importData">
        <img src="@/assets/images/import.png"
             alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG"
           :class="!isSubmit?'':'noClick'"
           @click="approve(1)">
        <svg-icon icon-class="passApprove"
                  style="font-size: 24px;" />
        <span class="text">通过</span>
      </div>
      <div class="TpmButtonBG"
           :class="!isSubmit?'':'noClick'"
           @click="approve(0)">
        <svg-icon icon-class="rejectApprove"
                  style="font-size: 24px;" />
        <span class="text">驳回</span>
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
      <el-table-column width="120"
                       align="center"
                       prop="costType"
                       label="费用类型">
        <template v-slot:header>
          <div>费用类型<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costType }}
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
            {{ scope.row.minePackage }}
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
            {{ scope.row.costItem }}
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
            {{ scope.row.channelCode }}
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
      <!-- <el-table-column width="220"
                       align="center"
                       prop="supplierName"
                       label="SKU">
        <template v-slot:header>
          <div>SKU<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.supplierName }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column width="220"
                       align="center"
                       prop="supplierName"
                       label="供应商">
        <template v-slot:header>
          <div>供应商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.supplierName }}
          </div>
        </template>
        <!-- 数据未对接 -->
      </el-table-column>
      <!-- <el-table-column width="220"
                       align="center"
                       prop="zoneName"
                       label="经销商">
        <template v-slot:header>
          <div>经销商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.zoneName }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column width="220"
                       align="center"
                       prop="zoneName"
                       label="大区">
        <template v-slot:header>
          <div>大区<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.zoneName }}
          </div>
        </template>
        <!-- 数据未对接 -->
      </el-table-column>
      <el-table-column width="220"
                       align="center"
                       prop="regionName"
                       label="区域">
        <template v-slot:header>
          <div>区域<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.regionName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="posmItem"
                       label="POSM item">
        <template v-slot:header>
          <div>POSM item<br><span class="subTitle"> KA + Brand + Region + Item</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{  scope.row.posmItem }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="voneCost"
                       label="V1计划费用(RMB)">
        <template v-slot:header>
          <div>V1计划费用(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.voneCost) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="vtwoCostDefault"
                       label="V2预估费用-默认(RMB)">
        <template v-slot:header>
          <div>V2预估费用-默认(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.vtwoCostDefault) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="vtwoCostAdjust"
                       label="V2预估费用-调整后(RMB)">
        <template v-slot:header>
          <div>V2预估费用-调整后(RMB)<br><span class="subTitle"> KA + Brand + Region + Vendor + Item</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.vtwoCostAdjust) }}
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
      <el-table-column width="220"
                       align="center"
                       prop="costWriteoffMethod"
                       label="费用核销方式">
        <template v-slot:header>
          <div>费用核销方式<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.costWriteoffMethod }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       align="right"
                       prop="costDifference"
                       label="费用差值(RMB)">
        <template v-slot:header>
          <div>费用差值(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝 3</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatNum(scope.row.costDifference) }}
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
            <!-- <el-table-column prop="date"
                             align="center"
                             label="是否通过"
                             width="200">
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
            </el-table-column>
            <el-table-column width="400"
                             align="center"
                             prop="judgmentContent"
                             label="验证信息">
            </el-table-column> -->
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
            <el-table-column align="center"
                             width="460"
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
                  {{ scope.row.costType }}
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
                  {{ scope.row.minePackage }}
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
                  {{ scope.row.costItem }}
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
                  {{ scope.row.channelCode }}
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
            <!-- <el-table-column width="220"
                       align="center"
                       prop="supplierName"
                       label="SKU">
        <template v-slot:header>
          <div>SKU<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.supplierName }}
          </div>
        </template>
      </el-table-column> -->
            <el-table-column width="220"
                             align="center"
                             prop="supplierName"
                             label="供应商">
              <template v-slot:header>
                <div>供应商<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.supplierName }}
                </div>
              </template>
              <!-- 数据未对接 -->
            </el-table-column>
            <!-- <el-table-column width="220"
                       align="center"
                       prop="zoneName"
                       label="经销商">
        <template v-slot:header>
          <div>经销商<br><span class="subTitle">-</span></div>
        </template>
        <template slot-scope="scope">
          <div>
            {{ scope.row.zoneName }}
          </div>
        </template>
      </el-table-column> -->
            <el-table-column width="220"
                             align="center"
                             prop="zoneName"
                             label="大区">
              <template v-slot:header>
                <div>大区<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.zoneName }}
                </div>
              </template>
              <!-- 数据未对接 -->
            </el-table-column>
            <el-table-column width="220"
                             align="center"
                             prop="regionName"
                             label="区域">
              <template v-slot:header>
                <div>区域<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.regionName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="posmItem"
                             label="POSM item">
              <template v-slot:header>
                <div>POSM item<br><span class="subTitle"> KA + Brand + Region + Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{  scope.row.posmItem }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="voneCost"
                             label="V1计划费用(RMB)">
              <template v-slot:header>
                <div>V1计划费用(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.voneCost) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="vtwoCostDefault"
                             label="V2预估费用-默认(RMB)">
              <template v-slot:header>
                <div>V2预估费用-默认(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.vtwoCostDefault) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="vtwoCostAdjust"
                             label="V2预估费用-调整后(RMB)">
              <template v-slot:header>
                <div>V2预估费用-调整后(RMB)<br><span class="subTitle"> KA + Brand + Region + Vendor + Item</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.vtwoCostAdjust) }}
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
            <el-table-column width="220"
                             align="center"
                             prop="costWriteoffMethod"
                             label="费用核销方式">
              <template v-slot:header>
                <div>费用核销方式<br><span class="subTitle">-</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.costWriteoffMethod }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="220"
                             align="right"
                             prop="costDifference"
                             label="费用差值(RMB)">
              <template v-slot:header>
                <div>费用差值(RMB)<br><span class="subTitle"> KA + Brand + Region + Item 拷贝 3</span></div>
              </template>
              <template slot-scope="scope">
                <div>
                  {{ formatNum(scope.row.costDifference) }}
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
import API from '@/api/V2/POSM'
export default {
  name: 'V2POSMApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        zoneName: '', //大区
        regionName: '', //区域
        supplierName: '', //供应商
        channelCode: '', //渠道
        customerCode: '', //客户系统名称
        month: '', //活动月
        posmItem: '',
      },
      permissions: getDefaultPermissions(),
      supplierArr: [], //供应商下拉
      zoneArr: [], //大区下拉
      regionArr: [], //区域下拉
      monthList: [],
      customerArr: [],
      tableData: [],

      BrandList: [],

      maxheight: getHeightHaveTab(),
      isSubmit: 1, // 提交状态  1：已提交，0：未提交
      isSelf: 0, //是否是当前审批人
      isGainLe: 0, //是否已经从LE接过数据
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
    this.getAllMonth()
    this.getBrandList()
    this.getzoneArr()
    // this.getDistributorList()
    this.getRegionList()
    this.getPageMdSupplier()
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
        this.isSubmit = 1
        API.getPosmPipVTwoPageApproval({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          zoneName: this.filterObj.zoneName, //大区
          regionName: this.filterObj.regionName, //区域
          supplierName: this.filterObj.supplierName, //供应商
          channelName: this.filterObj.channelCode, //渠道
          customerName: this.filterObj.customerCode, //客户系统名称

          posmItem: this.filterObj.posmItem, //
          yearAndMonth: this.filterObj.month,

          isSubmit: 1,
        }).then((response) => {
          this.tableData = response.data.records
          this.isSubmit = this.tableData[0].isSubmit
          this.isGainLe = this.tableData[0].isGainLe
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
              res.data.version === 'V2' &&
              res.data.assignee.indexOf(this.usernameLocal) != -1
            ) {
              //本人可以提交
              this.isSubmit = false
            } else {
              //其他人禁用
              this.isSubmit = true
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
      selectAPI.getPageMdSupplier({}).then((res) => {
        if (res.code === 1000) {
          this.supplierArr = res.data
        }
      })
    },
    //获取区域下拉
    getRegionList() {
      if (this.filterObj.distributorCode != '') {
        selectAPI
          .getRegionList({
            zoneName: this.filterObj.distributorCode,
          })
          .then((res) => {
            if (res.code === 1000) {
              this.regionArr = res.data
            }
          })
      } else {
        selectAPI.getRegionList().then((res) => {
          if (res.code === 1000) {
            this.regionArr = res.data
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
      return FormateThousandNum(num)
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.exportPageExcel({
          pageNum: this.pageNum, // 当前页
          pageSize: this.pageSize, // 每页条数
          zoneName: this.filterObj.zoneName, //大区
          regionName: this.filterObj.regionName, //区域
          supplierName: this.filterObj.supplierName, //供应商
          channelName: this.filterObj.channelCode, //渠道
          customerName: this.filterObj.customerCode, //客户系统名称

          posmItem: this.filterObj.posmItem, //
          yearAndMonth: this.filterObj.month,
          isSubmit: 1,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_POSM_${this.filterObj.channelCode}_V2_审批.xlsx`
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
      formData.append('yearAndMonth', this.filterObj.month)
      formData.append('channelName', this.filterObj.channelCode)
      formData.append('importType', 0) //1申请0审批
      formData.append('isSubmit', 1)
      API.fileImport(formData).then((response) => {
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
    // 确认导入
    confirmImport() {
      this.closeImportDialog()
      this.getTableData()
    },
    // 下载模板
    downloadTemplate() {
      if (this.tableData.length) {
        // 导出数据筛选
        API.exportTemplateExcel({
          yearAndMonth: this.filterObj.month,
          channelName: this.filterObj.channelCode,
          isSubmit: 1,
        }).then((res) => {
          downloadFile(
            res,
            `${this.filterObj.month}_POSM_${this.filterObj.channelCode}_V2审批.xlsx`
          ) //自定义Excel文件名
          this.$message.success(this.messageMap.exportSuccess)
        })
      } else {
        this.$message.info('数据不能为空')
      }
    },
    approve(value) {
      if (this.tableData.length) {
        if (value == 1) {
          this.$confirm('此操作将审批通过, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              API.approve({
                mainId: mainId, // 主表id
                opinion: 'agree', // 审批标识(agree：审批通过，reject：审批驳回)
                isSubmit: 1, //申请0,审批1
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message({
                    type: 'success',
                    message: '审批成功!',
                  })
                  this.getTableData()
                } else {
                  this.$message({
                    type: 'info',
                    message: '审批失败!',
                  })
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
          this.$confirm('此操作将驳回审批, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              API.approve({
                mainId: this.tableData[0].mainId,
                opinion: 'reject', // 审批标识(agree：审批通过，reject：审批驳回)
                isSubmit: 1, //申请0,审批1
              }).then((response) => {
                if (response.code === 1000) {
                  this.$message.success('驳回成功!')
                  this.getTableData()
                } else {
                  this.$message.info('驳回失败!')
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
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

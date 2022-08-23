<!--
 * @Description: 
 * @Date: 2021-11-16 14:01:16
 * @LastEditTime: 2022-07-28 08:43:38
-->
<template>
  <div class="MainContent">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">客户名称:</span>
          <el-select v-model="filterObj.customerMdmCode" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in customerArr" :key="index" :label="item.customerCsName" :value="item.customerMdmCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同期间:</span>
          <el-date-picker v-model="filterObj.contractDate" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">系统生效时间:</span>
          <el-date-picker v-model="filterObj.systemDate" type="monthrange" value-format="yyyyMM" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">合同状态:</span>
          <el-select v-model="filterObj.state" clearable filterable placeholder="请选择">
            <el-option v-for="item,index in contractList" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap" style="align-items: center;">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="addNewRow" v-permission="permissions['insert']">新增一行</el-button>
      <!-- <div class="TpmButtonBG" @click="save">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">保存</span>
      </div> -->
      <el-button type="primary" class="TpmButtonBG" @click="submit" v-permission="permissions['submit']">提交</el-button>
      <div class="tip">
        <span class="tipStar">*</span>
        注意事项：如果合同期间存在跨年情况，请分两份录入
      </div>
      <!-- <div class="TpmButtonBG cancelButton" @click="cancelAddNewRow">
        <span class="text">取消</span>
      </div> -->
    </div>
    <el-table :data="tableData" :key="tableKey" :max-height="maxheight" :min-height="800" border @selection-change="handleSelectionChange" :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column type="selection" align="center" :selectable="checkSelectable" />
      <el-table-column fixed align="center" width="80" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column fixed align="center" width="280" label="操作">
        <template slot-scope="scope">
          <div class="table_operation">
            <div class="haveText_delete" @click="deleteRow(scope.row, scope.$index)" v-permission="permissions['delete']">
              <svg-icon icon-class="delete" class="svgIcon" />
              <span>删除</span>
            </div>
            <div class="haveText_editor" v-permission="permissions['update']"  @click="copyRow(scope.row, scope.$index)">
              <svg-icon icon-class="copy" class="svgIcon" />
              <span>复制</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor" @click="saveRow(scope.row, scope.$index)">
              <svg-icon icon-class="save-light" class="svgIcon" />
              <span>保存</span>
            </div>
            <div class="haveText_editor" v-permission="permissions['update']" v-show="!scope.row.isEditor&&!scope.row.isNewData" @click="editorRow(scope.$index,scope.row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" v-show="scope.row.isEditor &&!scope.row.isNewData" @click="CancelEditorRow(scope.$index)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>取消编辑</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractCode" fixed align="center" width="220" label="合同ID"></el-table-column>
      <el-table-column prop="channelCode" fixed align="center" width="120" label="渠道">
      </el-table-column>
      <el-table-column prop="customerMdmCode" fixed align="center" width="220" label="客户名称">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.customerMdmCode" :disabled="scope.row.isRefused==1?true:false" class="my-el-input" @change="changeCustomer(scope.row)" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in customerArr" :key="index" :label="item.customerCsName" :value="item.customerMdmCode" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.customerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="regionCode"  align="center" width="220" label="大区">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-select v-model="scope.row.regionCode" :disabled="scope.row.isRequireRegion==1?false:true" class="my-el-input" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in largeAreaList" :key="index" :label="item.name" :value="item.nameAbridge" />
            </el-select>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.regionName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saleAmount" align="center" width="220" label="目标销售额(RMB)">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.saleAmount" type="number" clearable class="my-el-input" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{FormateNum(scope.row.saleAmount ? scope.row.saleAmount : 0)}}
            <!-- {{ scope.row.saleAmount ? scope.row.saleAmount : 0 }} -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" width="280" label="合同期间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.contractDate" :disabled="scope.row.isRefused==1?true:false" :picker-options="pickerOptions" class="select_date" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.contractBeginDate.replaceAll('-','/') + ' - ' + scope.row.contractEndDate.replaceAll('-','/') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="systemDate" align="center" width="220" label="系统生效时间">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-date-picker v-model="scope.row.systemDate" type="monthrange" value-format="yyyyMM" :picker-options="pickerOptionsSystemDate(scope.row)" format="yyyyMM" range-separator="至" start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.effectiveBeginDate + ' - ' + scope.row.effectiveEndDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" label="合同状态">
        <template slot-scope="scope">
          <div class="contractStatusWrap">
            <div>
              {{ contractList[scope.row.contractState] }}
            </div>
            <div class="timeOutWrap">
              <el-popover :ref="'popover-' + scope.row.id" placement="right" width="300" trigger="click">
                <div class="PopoverContent">
                  <div class="PopoverContentTop">
                    <span>调整系统生效时间</span>
                  </div>
                  <div class="PopoverContentOption">
                    <div class="PopoverContentOptionItem">
                      <el-date-picker v-model="scope.row.expireDate" value-format="yyyyMM" format="yyyyMM" type="month" placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="PopoverContentFoot">
                    <div class="TpmButtonBG" @click="popoverSubmit(scope.$index,scope.row)">保存</div>
                    <div class="TpmButtonBG cancelButton" @click="popoverCancel(scope.row.id)">取消</div>
                  </div>
                </div>
                <svg-icon :icon-class="scope.row.earlyExpireDate!=null?'timeout':'timeout_dark'" slot="reference" class="svgIcon" />
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="合同条款">
        <template slot-scope="scope">
          <div class="seeActivity" @click="showTermsDetail(scope.$index)">
            条款明细
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="220" label="申请人备注">
        <template slot-scope="scope">
          <div v-show="scope.row.isEditor">
            <el-input v-model="scope.row.remark"  type="textarea" autosize   clearable class="my-el-input my-textArea" placeholder="请输入">
            </el-input>
          </div>
          <div v-show="!scope.row.isEditor">
            {{ scope.row.remark }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="poApprovalComments" align="center" width="220" label="Package Owner意见" />
      <el-table-column prop="finApprovalComments" align="center" width="220" label="Finance 意见"></el-table-column>
      <el-table-column prop="createBy" align="center" width="240" label="创建人"></el-table-column>
      <el-table-column prop="createDate" align="center" width="220" label="创建时间"></el-table-column>
      <el-table-column prop="updateBy" align="center" width="240" label="修改人"></el-table-column>
      <el-table-column prop="updateDate" align="center" width="220" label="修改时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="90%" ref="termDialog" class="termDialog" title="条款明细" :visible="isTermsDetailVisible" @close="closeTermsDetail">
      <div class="dialogContent">
        <div class="termInfo">
          <span class="termItem">客户名称:{{termInfo.customerName}}</span>
          <span class="termItem" v-if="termInfo.channelCode==='RKA'">大区:{{termInfo.regionName}}</span>
          <span class="termItem">目标销售额(RMB):{{FormateNum(termInfo.saleAmount)}}</span>
          <span
            class="termItem">合同期间:{{termInfo.contractBeginDate?termInfo.contractBeginDate.replaceAll('-','/'):''}}-{{termInfo.contractEndDate?termInfo.contractEndDate.replaceAll('-','/'):''}}</span>
          <span class="termItem">系统生效时间:{{termInfo.effectiveBeginDate}}-{{termInfo.effectiveEndDate}}</span>
          <span class="termItem">合同状态:{{contractList[termInfo.contractState]}}</span>
        </div>
        <div class="termTableWrap">
          <el-table :data="termTotalData" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(0,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemVariableList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemVariableList[scope.row.contractItem].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemVariableList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" style="display: flex;align-items: center;">
                  <el-input v-model="scope.row.costRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index,scope.row)">
                  </el-input>
                  <span>%</span>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ termInfo.saleNumber*(scope.row.costRatio/100) }} -->
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(0,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData" class="detailText">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="termVariableData" :show-header="false" ref="termVariableTable" max-height="240" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(0,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemVariableList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemVariableList[scope.row.contractItem].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemVariableList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" style="display: flex;align-items: center;">
                  <el-input v-model="scope.row.costRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index,scope.row)">
                  </el-input>
                  <span>%</span>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ termInfo.saleNumber*(scope.row.costRatio/100) }} -->
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(0,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData" class="detailText">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="termVariableTotalData" :show-header="false" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(0,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemVariableList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemVariableList[scope.row.contractItem].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemVariableList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" style="display: flex;align-items: center;">
                  <el-input v-model="scope.row.costRatio" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCostRate(scope.$index,scope.row)">
                  </el-input>
                  <span>%</span>
                </div>
                <div v-show="!scope.row.isNewData">
                  {{ FormateNum(scope.row.costRatio) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ termInfo.saleNumber*(scope.row.costRatio/100) }} -->
                  {{FormateNum(scope.row.taxCost)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(0,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData" class="detailText">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap" v-if="isEditor">
            <div class="addNewRow" @click="addNewRowToVariable">
              <i class="el-icon-plus"></i>
              <span class="addNewRowText">新增一行</span>
            </div>
          </div>
          <el-table :data="termFixData" ref="termFixTable" :show-header="false" max-height="200" style="width: 100%" :header-cell-style="HeadTable"
            :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(1,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemFixList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemFixList[Number(scope.row.contractItem)].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemFixList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ (termInfo.saleNumber/scope.row.cost) }}% -->
                  {{FormateNum(scope.row.costRatio)}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model="scope.row.taxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index,scope.row)">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark"  clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(1,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData" class="detailText">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="termFixTotalData" :show-header="false" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassNameDialog">
            <el-table-column align="center" width="140" fixed>
              <template v-slot:header> </template>
              <template slot-scope="{ row }">
                <div>
                  {{ row.type }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="contractItem" align="center" label="contract item" width="160">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="scope.row.isNewData">
                    <el-select v-model="scope.row.contractItem" class="my-el-select_dialog" filterable clearable placeholder="请选择"
                      @change="changeContractItem(1,scope.row,scope.row.contractItem)">
                      <el-option v-for="(item, index) in contractItemFixList" :key="index" :label="item.name" :value="index" />
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isNewData">
                    {{contractItemFixList[Number(scope.row.contractItem)].name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="条件类型">
              <template slot-scope="scope">
                <div v-if="!scope.row.isTotal">
                  <div v-if="contractItemFixList[scope.row.contractItem].conditionalIsTwo===2&&scope.row.isNewData">
                    <el-select v-model="scope.row.conditions" class="my-el-select_dialog" filterable clearable placeholder="请选择">
                      <el-option v-for="(item, index) in ['conditional','unconditional']" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else>{{scope.row.conditions}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="costRatio" align="center" label="费比(%)" width="150">
              <template slot-scope="scope">
                <div>
                  <!-- {{ (termInfo.saleNumber/scope.row.cost) }}% -->
                  {{FormateNum(scope.row.costRatio)}}%
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="含税费用(RMB)" width="150">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData">
                  <el-input v-model="scope.row.taxCost" type="number" clearable class="my-el-inputNumber" placeholder="请输入" @blur="changeCost(scope.$index,scope.row)">
                  </el-input>
                </div>
                <div v-show="!scope.row.isNewData">{{ FormateNum(scope.row.taxCost) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="left" label="描述">
              <template slot-scope="scope">
                <div v-show="scope.row.isNewData" class="TermDetail">
                  <el-input v-model="scope.row.remark" clearable class="my-el-detail" placeholder="请输入描述">
                  </el-input>
                  <img v-if="scope.row.isNewData" src="@/assets/images/closeIcon.png" alt="" class="closeIcon" @click="deleteTerm(1,scope.$index)">
                </div>
                <div v-show="!scope.row.isNewData" class="detailText">
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="addNewRowWrap" v-if="isEditor">
            <div class="addNewRow" @click="addNewRowToFix">
              <i class="el-icon-plus"></i>
              <span class="addNewRowText">新增一行</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTermsDetail()">确 定</el-button>
        <el-button @click="closeTermsDetail">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/customer'
import {
  getDefaultPermissions,
  getContractEntry,
  FormateThousandNum,
  contractList,
  downloadFile,
  getCurrentYearRange,
  pickerOptions,
  pickerOptionsSystemDate
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'StraightGiving',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        customerMdmCode: '',
        contractDate: [],
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        state: '',
      },
      maxheight: getContractEntry(),
      checkArr: [], //选中的数据
      tableData: [],
      customerArr: [],
      largeAreaList: [],
      contractList: contractList,
      contractItemVariableList: [],
      contractItemFixList: [],
      isAddCount: 0,
      tableKey: 0,
      customerId: 0,
      isTermsDetailVisible: false, //条款明细弹窗
      termInfo: {}, //条款明细信息
      termTotalData: [],
      termVariableTotalData: [],
      termFixTotalData: [],
      termVariableData: [],
      termFixData: [],
      //VariableData+FixData
      TotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      VariableTotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      FixTotalData: {
        totalPoint: 0,
        totalCost: 0,
      },
      //取消编辑 --》数据重置（不保存）
      tempObj: {
        rowIndex: 0,
        tempInfo: null,
      },
      isEditor: 0,
      editorIndex: 0,
      isShowPopover: false,
      selectDate: '',
      pickerOptions: {
        onPick: (obj) => {
          this.selectDate = obj.minDate
          //若存在最大值，将已选中的值置空（下次可选另一年（且保证同年））
          if (obj.maxDate) {
            this.selectDate = ''
          }
        },
        // 限制年月
        disabledDate: (time) => {
          const date = new Date(this.selectDate)
          const year = date.getFullYear()
          //未选择初始日期时，不做限制
          if (this.selectDate == '') {
            return false
          }
          return (
            //日期限制（同一年）
            time.getFullYear() == year ? false : true
          )
        },
      },
      permissions: getDefaultPermissions(),
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getContractEntry()
      })()
    }
    // this.getTableData()
    this.getCustomerList()
    this.getContractItemList()
    this.getLargeAreaList()
  },
  computed: {},
  watch: {
    'filterObj.contractDate'(value) {
      if (value) {
        this.filterObj.contractBeginDate = value[0]
        this.filterObj.contractEndDate = value[1]
      } else {
        this.filterObj.contractBeginDate = ''
        this.filterObj.contractEndDate = ''
      }
    },
    'filterObj.systemDate'(value) {
      if (value) {
        this.filterObj.effectiveBeginDate = value[0]
        this.filterObj.effectiveEndDate = value[1]
      } else {
        this.filterObj.effectiveBeginDate = ''
        this.filterObj.effectiveEndDate = ''
      }
    },
  },
  directives: { elDragDialog, permission },
  methods: {
    //获取表格数据
    getTableData() {
      this.isEditor=0 //编辑弹窗
      API.getPage({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        customerType: 1,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((response) => {
        let list = response.data.records
        list.forEach((item) => {
          item.isEditor = 0
          item.isNewData = 0
          if(item.contractState==='2') {
            item.isRefused=1
          } else {
            item.isRefused=0
          }
          // item.regionCode = ''
          // item.regionName = ''
          // item.earlyExpireDate =item.earlyExpireDate!=''
          item.expireDate = item.earlyExpireDate //定时任务--终止日期字段
          item.contractDate = [item.contractBeginDate, item.contractEndDate]
          item.systemDate = [item.effectiveBeginDate, item.effectiveEndDate]
        })
        this.tableData = [...list]
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
        this.tempObj.tempInfo = null
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .getCustomerListByType({
          type: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    // 获取ContractItem
    getContractItemList() {
      API.getContractItemList().then((res) => {
        if (res.code === 1000) {
          this.contractItemFixList = []
          this.contractItemVariableList = []
          let list = res.data
          //区分variable 和 fixed
          list.forEach((item) => {
            if (item.conditionType && item.variablePoint) {
              item.name = item.contractItem
              item.code = item.contractItemCode
              item.conditionType = item.conditionType
              if (item.conditionType.indexOf(',') != -1) {
                item.conditionalIsTwo = 2
              } else {
                item.conditionalIsTwo = 1
              }
              if (item.variablePoint.indexOf('variable') != -1) {
                item.isVariableOrFix = 0
              }
              if (item.variablePoint.indexOf('fix') != -1) {
                item.isVariableOrFix = 1
              }
              if (
                item.variablePoint.indexOf('fix') != -1 &&
                item.variablePoint.indexOf('variable') != -1
              ) {
                item.isVariableOrFix = 2
              }
            }
          })
          list.forEach((item) => {
            if (item.isVariableOrFix === 0) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
            if (item.isVariableOrFix === 1) {
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
            if (item.isVariableOrFix === 2) {
              this.contractItemVariableList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
              this.contractItemFixList.push({
                code: item.code,
                name: item.name,
                conditionalIsTwo: item.conditionalIsTwo,
                isVariableOrFix: item.isVariableOrFix,
                conditionType: item.conditionType,
              })
            }
          })
        }
      })
    },
    getLargeAreaList() {
      selectAPI
        .getLargeAreaList({
          parentCode: '',
        })
        .then((res) => {
          if (res.code === 1000) {
            this.largeAreaList = res.data
          }
        })
    },
    //新增一行数据
    addNewRow() {
      this.tableData.unshift({
        customerName: '',
        saleAmount: '',
        Tax: '',
        NoTax: '',
        contractDate: getCurrentYearRange(),
        contractBeginDate: '',
        contractEndDate: '',
        systemDate: [],
        effectiveBeginDate: '',
        effectiveEndDate: '',
        contractStatus: 0,
        systemStatus: '',
        remark: '',
        regionCode: '',
        regionName: '',
        packageOwner: '',
        finance: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
        isEditor: 1, //是否 处于编辑状态
        isNewData: 1, //是否 是新增的数据
        isTimeout: '',
        contractTimeoutStatus: '',
        contractTimeoutTime: '',
      })
      this.isAddCount++
      // this.tableKey++
    },
    cancelAddNewRow() {
      if (this.isAddCount <= 0) {
        this.$message.info('当前没有新增的行')
      } else {
        this.tableData.shift()
        this.isAddCount--
      }
    },
    //新增保存
    save() {
      let addList = this.tableData.filter((item) => item.isNewData == 1)
      let list = []
      addList.forEach((item) => {
        let obj = {
          customerMdmCode: '', //客户编号
          saleAmount: '', //目标销售额
          contractBeginDate: '', //合同区间-开始
          contractEndDate: '', //合同区间-结束
          effectiveBeginDate: '', //系统生效-开始时间
          effectiveEndDate: '', //系统生效-结束时间
          regionCode: '', //regionCode
          remark: '', //备注
        }
        obj.customerMdmCode = item.customerMdmCode
        obj.saleAmount = item.saleAmount
        obj.contractBeginDate = item.contractDate[0]
        obj.contractEndDate = item.contractDate[1]
        obj.effectiveBeginDate = item.systemDate[0]
        obj.effectiveEndDate = item.systemDate[1]
        obj.regionCode = item.regionCode
        obj.remark = item.remark
        list.push(obj)
      })
      API.addCustomerContract(list).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
        }
      })
    },
    saveSingle(row) {
      let isRequireRegion =
        this.customerArr.findIndex(
          (item) =>
            item.channelCode == 'RKA' &&
            item.customerMdmCode == row.customerMdmCode
        ) != -1
          ? true
          : false
      console.log(isRequireRegion)
      if (isRequireRegion) {
        if (row.regionCode == '') {
          this.$message.warning('请填写大区')
          return
        }
      } else {
        if (row.regionCode) {
          this.$message.warning('该客户大区应为空')
          return
        }
      }
      let obj = {
        customerMdmCode: '', //客户编号
        regionCode: '', //客户编号
        saleAmount: '', //目标销售额
        contractBeginDate: '', //合同区间-开始
        contractEndDate: '', //合同区间-结束
        effectiveBeginDate: '', //系统生效-开始时间
        effectiveEndDate: '', //系统生效-结束时间
        remark: '', //备注
      }
      obj.customerMdmCode = row.customerMdmCode
      obj.regionCode = row.regionCode
      obj.saleAmount = row.saleAmount
      obj.contractBeginDate = row.contractDate[0]
      obj.contractEndDate = row.contractDate[1]
      obj.effectiveBeginDate = row.systemDate[0]
      obj.effectiveEndDate = row.systemDate[1]
      obj.remark = row.remark
      API.addCustomerContract([obj]).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
          this.$message.success("新增成功")
        }
      })
    },
    //录入提交
    async submit() {
      if (this.checkArr.length === 0) return this.$message.info('请选择数据')
      else {
        this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            let IdList = []
            let isSubmit = 1
            for (let index = 0; index < this.checkArr.length; index++) {
              const item = this.checkArr[index]
              IdList.push(item.id)
              await API.findOneSaveDetail({
                id: item.id,
                isMain: 1,
                isDetail: 1,
              }).then((res) => {
                if (
                  res.data.fixed.length === 0 &&
                  res.data.variable.length === 0
                ) {
                  isSubmit = 0
                }
              })
            }
            //提交合同明细
            this.submitHandler(IdList, isSubmit)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //提交合同明细
    submitHandler(IdList, isSubmit) {
      if (isSubmit) {
        API.submitCustomerContract(IdList).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            this.$message.success('提交成功')
          }
        })
      } else {
        this.$message.info('合同条款明细不能为空')
      }
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    //导出数据
    async exportData() {
      await API.exportCustomerContractInfo({
        customerType: 1,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '直供客户合同录入 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('客户合同录入导出成功!')
      })
      await API.exportCustomerContractDetail({
        customerType: 1,
        contractBeginDate: this.filterObj.contractBeginDate,
        contractEndDate: this.filterObj.contractEndDate,
        effectiveBeginDate: this.filterObj.effectiveBeginDate,
        effectiveEndDate: this.filterObj.effectiveEndDate,
        customerMdmCode: this.filterObj.customerMdmCode,
        contractState: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '直供客户合同录入明细 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('客户合同录入明细导出成功!')
      })
    },
    //编辑行数据
    editorRow(index, row) {
      //编辑状态：草稿、被拒绝
      if(row.contractState !== '0'&&row.contractState !== '2') {
        this.isEditor=0
        if(row.contractState==1) {
          this.$message.info('审批中的合同不允许编辑')
        } else if(row.contractState==3) {
          this.$message.info('该合同不能被编辑，仅能通过“调整”按钮修改系统生效时间结束时间')
        } else if(row.contractState==4||row.contractState==5) {
          this.$message.info('该合同不允许编辑')
        }
        return 
      }
      if (this.tempObj.tempInfo && !row.isNewData) {
        this.tableData[this.tempObj.rowIndex] = this.tempObj.tempInfo
      }
      //不存新增的数据，新增没有取消编辑
      if (!row.isNewData) {
        //存编辑之前的数据
        this.tempObj.rowIndex = index
        this.tempObj.tempInfo = { ...this.tableData[index] }
      }
      //全部的编辑状态置空 -->保证当前只有一个处于编辑状态
      this.tableData.forEach((item) => {
        if (!item.isNewData) {
          item.isEditor = 0
        }
      })
      this.changeCustomer(row)
      this.tableData[index].isEditor = 1
      this.isEditor=1 //可以编辑弹窗
      this.editorIndex=index
      this.$forceUpdate()
    },
    CancelEditorRow(index) {
      this.isEditor=0 //编辑弹窗
      // this.tableData.forEach((item) => (item.isEditor = 0))
      if (this.tableData[index].isNewData) {
        //新增的不能取消编辑，只有删除
      } else {
        this.tableData[index].isEditor = 0
        this.tableData[index] = this.tempObj.tempInfo
      }
    },
    compareDate(date) {
      let currentDate = new Date()
      let month =
        currentDate.getMonth() < 10
          ? '0' + (currentDate.getMonth() + 1)
          : currentDate.getMonth() + 1
      let year = currentDate.getFullYear()
      let currentMonth = year + month
      return Number(currentMonth) < Number(date)
    },
    //删除该行数据
    deleteRow(row, index) {
      //判断当前月份是否处于系统生效开始时间，若处于则可以删除,若不处于系统生效开始时间随便删，不受状态影响
      let isDeleteFlag = this.compareDate(row.systemDate[0])
      //允许删除：草稿、被拒绝、通过（未汇算）
      if (row.contractState === '1' ||(row.contractState == '3'&&!isDeleteFlag)||row.contractState === '4'||row.contractState === '5') {
        if(row.contractState === '1') {
          this.$message.info('审批中的合同不能删除，请联系审批人驳回后删除')
        } else if(row.contractState == '3'&&!isDeleteFlag||row.contractState === '4'||row.contractState === '5') {
          this.$message.info('该合同不允许删除')
        }
        return
      }
      //删除新增的
      if (row.isNewData) {
        this.$confirm('确定要删除新增的数据吗？此操作不可逆', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.tableData.splice(index, 1)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        //删除数据库中的数据
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            console.log([this.tableData[index].id])
            API.deleteCustomerContract([this.tableData[index].id]).then(
              (res) => {
                if (res.code === 1000) {
                  this.getTableData()
                  if (res.data) {
                    this.$message.success('删除成功')
                  } else {
                    this.$message.info(`${res.message}`)
                  }
                }
              }
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //保存 该行
    saveRow(row, index) {
      if (row.saleAmount > 9999999999) {
        this.$message.info('超出最大数值')
      } else {
        if (row.isNewData) {
          if(row.isNewData===1) {
            //新增数据保存
            this.saveSingle(row)
          }else if(row.isNewData===2) {
            this.saveCopy(row)
          }
          
        } else if (row.isEditor) {
          let isRequireRegion =
            this.customerArr.findIndex(
              (item) =>
                item.channelCode == 'RKA' &&
                item.customerMdmCode == row.customerMdmCode
            ) != -1
              ? true
              : false
          console.log(isRequireRegion)
          //客户属于RKA ，大区必填项
          if (isRequireRegion) {
            if (row.regionCode == '' || row.regionCode == null) {
              this.$message.warning('请填写大区')
              return
            }
          } else {
            if (row.regionCode) {
              this.$message.warning('该客户大区应为空')
              return
            }
          }
          //修改操作
          API.updateCustomerContract({
            id: row.id,
            customerMdmCode: row.customerMdmCode,
            regionCode: row.regionCode,
            saleAmount: row.saleAmount,
            contractBeginDate: row.contractDate[0],
            contractEndDate: row.contractDate[1],
            effectiveBeginDate: row.systemDate[0],
            effectiveEndDate: row.systemDate[1],
            remark: row.remark,
          }).then((res) => {
            if (res.code === 1000) {
              this.getTableData()
              if (res.data) {
                this.$message.success('修改成功')
              } else {
                this.$message.info(`${res.message}`)
              }
            }
          })
        }
      }
    },
    //判断当前选中的客户类型--》大区是否可选择
    changeCustomer(row) {
      let isRequireRegion = this.customerArr.findIndex((item) =>
                item.channelCode == 'RKA' &&
                item.customerMdmCode == row.customerMdmCode
            ) != -1
              ? true
              : false
      row.isRequireRegion=isRequireRegion
      console.log(isRequireRegion);
    },
    //复制
    copyRow(row, index) {
      console.log(row);
      let isRequireRegion = this.customerArr.findIndex((item) =>
                item.channelCode == 'RKA' &&
                item.customerMdmCode == row.customerMdmCode
            ) != -1
              ? true
              : false
      this.tableData.unshift({
        id:row.id,
        customerName: row.customerName,
        customerMdmCode: row.customerMdmCode,
        saleAmount: row.saleAmount,
        Tax: row.Tax,
        contractDate: [row.contractBeginDate,row.contractEndDate],
        contractBeginDate: row.contractBeginDate,
        contractEndDate: row.contractEndDate,
        systemDate: row.systemDate,
        effectiveBeginDate: row.effectiveBeginDate,
        effectiveEndDate: row.effectiveEndDate,
        contractStatus: 0,
        systemStatus: row.systemStatus,
        remark: row.remark,
        regionCode: row.regionCode,
        regionName: row.regionName,
        poApprovalComments:row.poApprovalComments,
        finApprovalComments: row.finApprovalComments,
        createBy: row.createBy,
        createDate: row.createDate,
        updateBy: row.updateBy,
        updateDate: row.updateDate,
        isEditor: 1, //是否 处于编辑状态
        isNewData: 2, //是否 是新增的数据 0否，1新增，2 copy
        isTimeout: '',
        contractTimeoutStatus: '',
        contractTimeoutTime: '',
        isRequireRegion: isRequireRegion,
      })
      this.isAddCount++
    },
    saveCopy(row) {
      API.copyCustomerContract([{
        id: row.id,
        customerMdmCode: row.customerMdmCode,
        regionCode: row.regionCode,
        saleAmount: row.saleAmount,
        contractBeginDate: row.contractDate[0],
        contractEndDate: row.contractDate[1],
        effectiveBeginDate: row.systemDate[0],
        effectiveEndDate: row.systemDate[1],
        remark: row.remark,
      }]).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
          if (res.data) {
            this.$message.success('复制成功')
          } else {
            this.$message.info(`${res.message}`)
          }
        }
      })
    },
    //定时任务确定--终止合同
    async popoverSubmit(index, row) {
      let newStr =
        row.expireDate.substring(0, 4) + '-' + row.expireDate.substring(4)
      let expireDate = new Date(newStr)
      let contractDate = new Date(
        row.contractDate[1].substring(0, 4) +
          '-' +
          row.contractDate[1].substring(5, 7)
      )
      if (
        expireDate.getTime() < contractDate.getTime() &&
        row.contractStateName == '通过'
      ) {
        this.$message.info('系统生效时间结束时间不能早于合同期间结束时间')
        return
      } else if (
        row.contractStateName == '过期' ||
        row.contractStateName == '终止'
      ) {
        this.$message.info(
          '只有状态为“通过”的合同，允许调整生效时间，其他都不允许，请知悉，谢谢！'
        )
        return
      }
      let distributorContract=[]
      let isCheck=0
      await API.findOne({
        id: row.id,
        isCustomerContract: 1, //是否查询客户合同（1是0否）
        isCustomerContractDetail: 0, //是否查询客户合同条款（1是0否）
        isDistributorContractDetail: 0, //是否查询经销商合同详情（1是0否）
      }).then((res) => {
        distributorContract=res.data.distributorContract
        console.log(distributorContract);
        if(distributorContract.findIndex(item=>item.contractStateName=='待审批')!=-1) {
          this.$message.info(
          '该客户合同下存在待审批状态的经销商分摊协议不允许修改系统生效时间结束时间'
          )
          return
        }  
        
      })
      //往后调
      if(Number(row.expireDate)>Number(row.systemDate[1])) {
        this.$message.info(
        '此修改只修改客户合同，分摊协议的系统生效时间不会调整，如需要请自行到经销商分摊协议页面修改，谢谢！'
        )
      }else {
        isCheck=1
        //系统生效时间前调
        distributorContract.forEach((item,index)=>{
          //若“调整后的客户合同系统生效时间结束时间”早于“经销商分摊协议系统生效时间开始时间”
          if(Number(row.expireDate)<Number(item.effectiveBeginDate)) {
            item.checkInfo=`${index+1} 若进行此调整，则${item.distributorName}经销商分摊协议（${item.contractCode}）会被标记为终止，请确认`
            console.log(`若进行此调整，则${item.distributorName}经销商分摊协议（${item.contractCode}）会被标记为终止，请确认`);
          } 
          //若“调整后的客户合同系统生效时间结束时间”处于“经销商分摊协议系统生效时间”之内，且晚于“经销商分摊协议合同期间结束时间”
          if(Number(item.effectiveBeginDate)<=Number(row.expireDate)&&Number(row.expireDate)<=Number(item.effectiveEndDate)&&this.dateCompare(row.expireDate,item.contractEndDate)){
            item.checkInfo=`${index+1} 此操作会使得${item.distributorName}经销商分摊协议（${item.contractCode}）系统生效时间结束时间随之变动，调整为“${row.expireDate}”`
          }
          //若“调整后的客户合同系统生效时间结束时间”晚于“经销商分摊协议系统生效时间结束时间”，
          if(Number(row.expireDate)>Number(item.effectiveEndDate)) {
            item.checkInfo=`${index+1} 此修改只修改客户合同，${item.distributorName}分摊协议（${item.contractCode}）的系统生效时间不会调整，如需要请自行到经销商分摊协议页面修改，谢谢`
            console.log(`此修改只修改客户合同，${item.distributorName}分摊协议（${item.contractCode}）的系统生效时间不会调整，如需要请自行到经销商分摊协议页面修改，谢谢`)
          }
        })
      }
      if(isCheck) {
        let str=''
        distributorContract.forEach(item=>{
          str+=item.checkInfo+'<br/>'
        })
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          API.termination({
          id: row.id,
          date: row.expireDate,
        }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('调整成功')
            this.popoverCancel(row.id)
            this.getTableData()
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });
      } else {
        API.termination({
          id: row.id,
          date: row.expireDate,
        }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('调整成功')
            this.popoverCancel(row.id)
            this.getTableData()
          }
        })
      }
    },
    dateCompare(expireDate,contractEndDate) {
      return new Date((expireDate).slice(0, 4),Number((expireDate).slice(4)),0).getTime()>new Date(contractEndDate).getTime()
    },
    //定时任务取消
    popoverCancel(id) {
      this.$refs[`popover-` + id].doClose()
      this.tableKey++
    },
    //条款明细--弹窗展示
    showTermsDetail(index) {
      this.customerId = this.tableData[index].id
      if (this.tableData[index].isNewData) {
        this.$message.info('请先进行保存,再进行操作')
      } else {
        //草稿、被拒绝可以编辑，其他仅查看
        if (this.tableData[index].isEditor) {
          this.$confirm('点击"是"以返回保存<br/> 点击"否"以进入"条款明细"编辑页面', '是否有修改基础信息', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
            dangerouslyUseHTMLString: true
          })
            .then(() => {})
            .catch(() => {
              this.$refs.termDialog.$el.firstChild.style.height = '98%'
              this.getContractTermData(index)
            })
        } else {
          this.getContractTermData(index)
        }
      }
    },
    //获取客户合同明细数据
    getContractTermData(index) {
      API.findOneSaveDetail({
        id: this.customerId,
        isMain: 1,
        isDetail: 1,
      }).then((res) => {
        if (res.code === 1000) {
          this.termVariableData = []
          this.termFixData = []
          let data = res.data
          this.termInfo = { ...data }
          let variableListOrigin = this.termInfo.variable
          let variableList = []
          //获取total +variable total
          let isEditor = this.isEditor && index == this.editorIndex
          variableListOrigin.forEach((item) => {
            let obj = {
              id: item.id,
              type: item.type,
              contractItem: this.getContractItemByCode(0, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              remark: item.remark,
              isNewData: isEditor, //是否未新添数据
              isTotal: 0, //是否total 行
            }
            variableList.push(obj)
            this.TotalData.totalCost += item.taxCost
            this.TotalData.totalPoint += item.costRatio
            this.VariableTotalData.totalCost += item.taxCost
            this.VariableTotalData.totalPoint += item.costRatio
          })
          let fixedListOrigin = this.termInfo.fixed
          let fixList = []
          //获取total +fixed total
          fixedListOrigin.forEach((item) => {
            let obj = {
              id: item.id,
              type: item.type,
              contractItem: this.getContractItemByCode(1, item.conditionsItem),
              conditionType: item.conditions,
              conditions: item.conditions,
              costRatio: item.costRatio,
              taxCost: item.taxCost,
              remark: item.remark,
              isNewData: isEditor, //是否未新添数据
              isTotal: 0, //是否total 行
            }
            fixList.push(obj)
            this.TotalData.totalCost += item.taxCost
            this.TotalData.totalPoint += item.costRatio
            this.FixTotalData.totalCost += item.taxCost
            this.FixTotalData.totalPoint += item.costRatio
          })
          this.termTotalData.push({
            type: 'Total',
            contractItem: '',
            conditionType: '',
            costRatio: this.TotalData.totalPoint,
            taxCost: this.TotalData.totalCost,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1, //是否total 行
          })
          //variable  -- 设置variable
          this.termVariableData = [...this.termVariableData, ...variableList]
          //variable  -- 设置variable total
          this.termVariableTotalData.push({
            type: 'Variable total',
            contractItem: '',
            conditionType: '',
            costRatio: this.VariableTotalData.totalPoint,
            taxCost: this.VariableTotalData.totalCost,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1,
          })
          //Fixed  -- Fixed
          this.termFixData = [...this.termFixData, ...fixList]
          //Fixed  -- Fixed total
          this.termFixTotalData.push({
            type: 'Fixed total',
            contractItem: '',
            conditionType: '',
            costRatio: this.FixTotalData.totalPoint,
            taxCost: this.FixTotalData.totalCost,
            remark: '',
            isNewData: 0, //是否未新添数据
            isTotal: 1,
          })
          this.isTermsDetailVisible = true
        }
      })
    },
    //更改ContractItem --》改变条件类型
    changeContractItem(flag, row, value) {
      if (!flag) {
        if (this.contractItemVariableList[value].conditionalIsTwo === 2) {
          row.conditions = ''
        } else {
          row.conditions = this.contractItemVariableList[value].conditionType
        }
      } else {
        if (this.contractItemFixList[value].conditionalIsTwo === 2) {
          row.conditions = ''
        } else {
          row.conditions = this.contractItemFixList[value].conditionType
        }
      }
    },
    //通过code 获取ContractItem索引展示
    getContractItemByCode(flag, code) {
      if (!flag) {
        if (!code) {
          return 0
        }
        let index = this.contractItemVariableList.findIndex(
          (item) => item.code == code
        )
        //variable
        return index != -1 ? index : 0
      } else {
        if (!code) {
          return 0
        }
        let index = this.contractItemFixList.findIndex(
          (item) => item.code == code
        )
        //fix
        return index != -1 ? index : 0
      }
    },
    //条款明细保存
    confirmTermsDetail() {
      let isCheck = 1 //费比校验
      let Repeat = 0 //contract Item  是否重复
      if (!this.isEditor) {
        //已经通过不能进行编辑，仅能查看
        this.closeTermsDetail()
        return
      }
      let obj = {
        ccId: this.customerId,
        variable: [],
        fixed: [],
      }
      this.termVariableData.forEach((item) => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 ）不能重复
          let RepeatList = this.termVariableData.filter((vItem) => {
            return (
              vItem.contractItem == item.contractItem &&
              vItem.conditions == item.conditions
            )
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem:
              this.contractItemVariableList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
          }
          obj.variable.push(detailObj)
        }
      })
      this.termFixData.forEach((item) => {
        if (item.isNewData) {
          if (item.costRatio == '' || item.costRatio == 0) {
            isCheck = 0
          }
          //行（contract Item  条件类型 ）不能重复
          let RepeatList = this.termFixData.filter((vItem) => {
            return (
              vItem.contractItem == item.contractItem &&
              vItem.conditions == item.conditions
            )
          })
          if (RepeatList.length > 1) {
            Repeat = 1
          }
          let detailObj = {
            id: item.id,
            type: item.type, //明细类型 variable和fixed
            conditionsItem: this.contractItemFixList[item.contractItem].code,
            conditions: item.conditions, //条件类型condition和unconditional
            costRatio: item.costRatio, //费比
            taxCost: item.taxCost, //费用
            remark: item.remark, //备注
          }
          obj.fixed.push(detailObj)
        }
      })
      if (this.TotalData.totalPoint > 100) {
        this.$message.info('Total 费比应该小于100%')
        return
      }
      if (this.TotalData.totalCost > this.termInfo.saleAmount) {
        this.$message.info('Total 含税费用应该小于目标销售额')
        return
      }
      if (!isCheck) {
        this.$message.info('费比不能为空,请填写费比')
        return
      }
      if (Repeat) {
        this.$message.info('contract Item加条件类型不能重复')
        return
      }
      console.log(obj)
      API.saveDetail(obj).then((res) => {
        if (res.code === 1000) {
          this.closeTermsDetail()
          this.getTableData()
          this.$message.success('客户明细保存成功')
        }
      })
    },
    //条款明细关闭
    closeTermsDetail() {
      this.termTotalData = []
      this.termVariableTotalData = []
      this.termFixTotalData = []
      this.termVariableData = []
      this.termFixData = []
      this.FixTotalData.totalPoint = 0
      this.FixTotalData.totalCost = 0
      this.VariableTotalData.totalPoint = 0
      this.VariableTotalData.totalCost = 0
      this.TotalData.totalPoint = 0
      this.TotalData.totalCost = 0
      this.customerId = 0
      this.isTermsDetailVisible = false
      // this.isEditor=0 //编辑弹窗
    },
    //新增条款--variable
    addNewRowToVariable() {
      //新添元素更改位置
      this.termVariableData.push({
        type: 'Variable',
        contractItem: 0,
        conditions: '',
        costRatio: 0,
        taxCost: 0,
        remark: '',
        isNewData: 1, //是否未新添数据
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.termVariableTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.termVariableTable.bodyWrapper.scrollTop = scrollHeight
      })
      //scrollTop
    },
    //新增条款--fix
    addNewRowToFix() {
      this.termFixData.push({
        type: 'Fixed',
        contractItem: 0,
        conditions:
          this.contractItemFixList[0].conditionalIsTwo == 2
            ? ''
            : this.contractItemFixList[0].conditionType,
        costRatio: 0,
        taxCost: 0,
        remark: '',
        isNewData: 1, //是否未新添数据
      })
      //滚动条随着新增滚动到底部
      let scrollHeight = this.$refs.termFixTable.bodyWrapper.scrollHeight
      this.$nextTick(function () {
        this.$refs.termFixTable.bodyWrapper.scrollTop = scrollHeight
      })
    },
    deleteTerm(flag, index) {
      //variable 明细删除
      if (flag == 0) {
        this.termVariableData.splice(index, 1)
      } else {
        //fixed 明细删除
        this.termFixData.splice(index, 1)
      }
      this.getNewTotalData()
    },
    //费比更改
    changeCostRate(index, row) {
      this.termVariableData[index].taxCost =
        this.termInfo.saleAmount * (Number(row.costRatio) / 100)
      this.getNewTotalData()
    },
    //含税费用更改
    changeCost(index, row) {
      // {{ (termInfo.saleAmount/scope.row.taxCost) }}%
      this.termFixData[index].costRatio =
        (Number(row.taxCost) / this.termInfo.saleAmount) * 100
      this.getNewTotalData()
    },
    // 获取total 数据
    getTotalData() {
      this.TotalData.totalCost = this.termVariableData[0].taxCost
      this.TotalData.totalPoint = this.termVariableData[0].costRatio
    },
    getNewTotalData() {
      this.VariableTotalData.totalPoint = 0
      this.VariableTotalData.totalCost = 0
      //获取VariableData Total
      this.termVariableData.forEach((item) => {
        let { costRatio, taxCost } = item
        item.costRatio = Number(item.costRatio)
        this.VariableTotalData.totalPoint += Number(costRatio)
        this.VariableTotalData.totalCost += Number(taxCost)
      })
      this.termVariableTotalData[0].costRatio =
        this.VariableTotalData.totalPoint
      this.termVariableTotalData[0].taxCost = this.VariableTotalData.totalCost
      this.FixTotalData.totalPoint = 0
      this.FixTotalData.totalCost = 0
      //汇总行索引
      //获取FixData Total
      this.termFixData.forEach((item) => {
        let { costRatio, taxCost } = item
        item.taxCost = Number(item.taxCost)
        this.FixTotalData.totalPoint += Number(costRatio)
        this.FixTotalData.totalCost += Number(taxCost)
      })
      this.termFixTotalData[0].costRatio = this.FixTotalData.totalPoint
      this.termFixTotalData[0].taxCost = this.FixTotalData.totalCost
      //获取所有VariableData Total+FixData Total
      this.TotalData.totalCost =
        this.VariableTotalData.totalCost + this.FixTotalData.totalCost
      this.TotalData.totalPoint =
        this.VariableTotalData.totalPoint + this.FixTotalData.totalPoint
      this.setAllTotalData()
    },
    setAllTotalData() {
      this.termTotalData[0].taxCost = this.TotalData.totalCost
      this.termTotalData[0].costRatio = this.TotalData.totalPoint
    },
    //处于草稿状态可提交
    checkSelectable(row) {
      return row.contractState === '0' || row.contractState === '2'
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
    //弹窗表格样式
    tableRowClassNameDialog({ row, rowIndex }) {
      if (row.type.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.type.indexOf('total') != -1) {
        return 'first-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    handleSelectionChange(val) {
      this.checkArr = val
    },
    //格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    pickerOptionsSystemDate(row) {
      return pickerOptionsSystemDate(row)
    }
  },
}
</script>

<style lang="scss" scoped>
.seeActivity {
  height: 32px;
  background: #d7e8f2;
  border-radius: 6px;
  font-size: 16px;
  color: #4192d3;
  font-weight: 600;
  line-height: 32px;
  cursor: pointer;
}
.operation {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4192d3;
  font-size: 16px;
  cursor: pointer;
  .submit_icon {
    font-size: 26px;
  }
}
.svgIcon {
  width: 20px;
  height: 20px;
}
.contractStatusWrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.timeOutWrap {
  margin-left: 10px;
  cursor: pointer;
}
//自定义el-input
.my-el-input {
  width: 180px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 180px !important;
  }
  .el-input--suffix {
    width: 180px !important;
  }
}
.my-el-input_dialog {
  width: 150px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 150px !important;
  }
  .el-input--suffix {
    width: 150px !important;
  }
}

.PopoverContent {
  .PopoverContentTop {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
    font-weight: 600;
    justify-content: space-between;
  }
  .PopoverContentOption {
    .PopoverContentOptionItem {
      display: flex;
      align-items: center;
      margin: 10px 0;
      .PopoverContentOptionItemText {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }
    }
  }
  .PopoverContentFoot {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .TpmButtonBG {
      min-width: 66px;
      width: 66px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #4192d3;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 10px;
      cursor: pointer;
      background-color: #4192d3 !important;
      color: #fff;
    }
    .cancelButton {
      width: 66px;
      background-color: #fff !important;
      color: #4192d3;
      border: 1px solid #4192d3;
      text-align: center;
    }
  }
}
.dialogContent {
  .termInfo {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .termItem {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
    }
  }
  .termTableWrap {
    width: 100%;
    border: 1px solid #e7e7e7;
    .addNewRowWrap {
      width: 100%;
      height: 50px;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
      .addNewRow {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #f4f9ff;
        color: #666;
        cursor: pointer;
        .addNewRowText {
          margin-left: 10px;
          color: #333;
        }
      }
    }
  }
}
.my-el-inputNumber {
  width: 120px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 120px;
  }
  .el-input--suffix {
    width: 120px !important;
  }
}
.my-el-detail {
  width: 280px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 280px;
  }
  .el-input--suffix {
    width: 280px !important;
  }
}
.TermDetail {
  display: flex;
  align-items: center;
  justify-content: center;
  .my-el-detail {
    width: 400px !important;
    margin: 0 auto;
  }
}
.detailText {
  text-align: left;
}
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
  color: #4192d3;
  font-size: 14px;
  margin-bottom: 10px;
}
.tipStar {
  font-size: 12px;
  color: #4192d3;
}
</style>
<style lang="less">
.termDialog {
  .el-dialog {
    margin-top: 1vh !important;
    top: 50%;
    transform: translateY(-50%);
    .el-dialog__body {
      padding: 20px 20px !important;
    }
  }
  .el-dialog__header {
    height: 50px;
    padding: 0 0 0 20px;
    background-color: #4192d3;
  }
  .el-dialog__title {
    font-size: 16px;
    font-family: Source Han Sans CN Light;
    font-weight: bold;
    color: #fff;
    line-height: 50px;
  }
  .el-dialog__headerbtn {
    top: 16px;
    .el-dialog__close {
      color: #fff;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    .el-button--default {
      width: 122px;
      height: 37px;
      background: #ffffff;
      border: 1px solid #4192d3;
      border-radius: 5px;
      color: #4192d3;
    }
    .el-button--primary {
      width: 120px;
      height: 37px;
      background: #4192d3;
      border-radius: 5px;
      border: 1px solid #4192d3;
      background-color: #4192d3;
    }
    .el-button + .el-button {
      margin-left: 15px;
    }
  }
  .el-downloadFileBar {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button--primary {
      width: 122px;
      height: 41px;
      line-height: 41px;
      border-radius: 8px;
      margin-bottom: 0;
      padding: 0;
    }
    .el-button--primary.is-plain:active {
      background: #fff;
      border-color: #4192d3;
      color: #4192d3;
    }
    .el-button--primary.is-plain {
      width: 122px;
      background: #fff;
      border-color: #4192d3;
      color: #4192d3;
    }
  }
  .tableWrap {
    width: 100%;
    max-height: 400px;
    margin-top: 20px;
    font-size: 14px;
    font-family: Source Han Sans CN Light;
    font-weight: 400;
    color: #333333;
  }
}
.termDialog .el-dialog__body {
  padding: 10px 20px;
}
.contract_firstRow {
  background-color: #4192d3 !important;
  color: #fff;
  font-size: 14px;
}
.hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.hover-row .filstColumn {
  color: #666;
}
.termTableWrap .hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.termTableWrap .hover-row .filstColumn {
  color: #666;
}

.my-el-select_dialog {
  width: 120px !important;
  border-radius: 5px;
  .el-input__inner {
    height: 37px;
    width: 120px;
  }
  .el-input--suffix {
    width: 120px !important;
  }
}
.MainContent .select_date {
  width: 240px !important;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 240px !important;
  }
}
.termTableWrap {
  width: 100%;
  border: 1px solid #e7e7e7;
  .el-table {
    td {
      padding: 4px 0 !important;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: center;
    }
    th {
      padding: 4px 0 !important;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: center;
    }
  }
}
</style>

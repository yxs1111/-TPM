<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="tableSearchForm" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="扣车编号" prop="num">
        <el-input v-model="queryParams.num" placeholder="请输入扣车编号" />
      </el-form-item>
      <el-form-item label="申请部门" prop="applyDept">
        <el-input v-model="queryParams.applyDept" placeholder="请输入申请部门" />
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input v-model="queryParams.applyUser" placeholder="请输入申请人" />
      </el-form-item>
      <el-form-item label="扣停车号" prop="carNum">
        <el-input v-model="queryParams.carNum" placeholder="请输入扣停车号" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="detainCarDialog.visible = true;detainCarDialog.type = 'create'">新增扣车流程</el-button>
      <el-button v-show="showApproveFlag" type="danger" icon="el-icon-plus" @click="approveDetainCar()">审核</el-button>
      <el-button type="error" icon="el-icon-plus" @click="openFlowDiagram()">流程图</el-button>
    </div>
    <el-table
      ref="detainCarTable"
      v-loading="searchLoading"
      :data="detainCarData"
      element-loading-text="正在查询"
      border
      fit
      stripe
      height="600"
      highlight-current-row
      @row-click="handleCurrentRowClick"
      @row-dblclick="handleCurrentRowDblClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column v-slot="scopeProps" align="center" label="序号" width="95">
        {{ scopeProps.$index+1 }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="扣车编号" align="center">
        {{ row.num }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="扣停列车号" align="center">
        {{ row.carNum }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="申请部门" align="center">
        {{ row.applyDept }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="申请人" align="center">
        {{ row.applyUser }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="证件编号" align="center">
        {{ row.credentialsNum }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="申请人电话" align="center">
        {{ row.applyPhone }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="申请人班组" align="center">
        {{ row.applyGroup }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="扣车开始时间" align="center">
        {{ row.detainStart }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="预计结束时间" align="center">
        {{ row.detainEnd }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="实际结束时间" align="center">
        {{ row.actualEnd }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="是否延期" align="center">
        {{ row.hasDefer }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="状态" align="center">
        {{ row.status | renderStatus }}
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template>
          <el-button size="mini" type="primary" @click="detainCarDetailDialog.visible = true">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="queryParams.start"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryParams.total"
    />
    <!--  扣车审批弹框  -->
    <div v-if="approveDialog.activate">
      <approve-flow
        :visible.sync="approveDialog.visible"
        :business-id="approveDialog.businessId"
        title="扣车审批"
        width="90%"
        @delete="deleteDetailCarApply"
        @flowEnd="completeDetailCarApply"
        @pass="passDetailCarApply"
      >
        <el-form :inline="true">
          <el-form-item label="扣车编号" prop="applyPhone">
            <el-input v-model="approveDialog.data.num" style="width: 180px" />
          </el-form-item>
          <el-form-item label="申请时间" prop="applyPhone">
            <el-input v-model="approveDialog.data.createDate" style="width: 180px" />
          </el-form-item>
          <el-form-item label="申请部门" prop="applyPhone">
            <el-input v-model="approveDialog.data.applyDept" style="width: 180px" />
          </el-form-item>
          <el-form-item label="申请人名称" prop="applyPhone">
            <el-input v-model="approveDialog.data.applyUser" style="width: 180px" />
          </el-form-item>
          <el-form-item label="证件编号" prop="applyPhone">
            <el-input v-model="approveDialog.data.credentialsNum" style="width: 180px" />
          </el-form-item>
          <el-form-item label="申请人电话" prop="applyPhone">
            <el-input v-model="approveDialog.data.applyPhone" style="width: 180px" />
          </el-form-item>
          <el-table
            border
            fit
            stripe
            highlight-current-row
            :data="approveDialog.data.tableData"
            style="width: 100%"
          >
            <el-table-column label="扣停列车号" prop="carNum" />
            <el-table-column label="扣车开始时间" prop="detainStart" />
            <el-table-column label="预计结束时间" prop="detainEnd" />
            <el-table-column label="走行公里数" prop="walk" />
            <el-table-column label="停扣原因" prop="reason" />
          </el-table>
        </el-form>
      </approve-flow>
    </div>
    <!--  扣车申请弹框  -->
    <!--    <dynamic-form
      :visible.sync="detainCarDialog.visible"
      :title="textMap[detainCarDialog.type]"
      :module="detainCarDialog.module"
      :operation="detainCarDialog.operation"
      @submitForm="saveDetainCar"
    />-->
    <el-dialog
      v-loading="detainCarDialog.loading"
      :visible.sync="detainCarDialog.visible"
      title="新增扣车申请"
      width="80%"
    >
      <el-form ref="tableForm" :model="detainCarDialog.data">
        <el-form-item label="联系电话" prop="applyPhone" label-width="80px">
          <el-input v-model="detainCarDialog.data.applyPhone" style="width: 180px" />
        </el-form-item>
        <el-table
          border
          fit
          stripe
          highlight-current-row
          :data="detainCarDialog.data.tableData"
          style="width: 100%"
        >
          <el-table-column label="扣停列车号" prop="carNum">
            <template slot-scope="{row}">
              <el-select v-model="row.carNum" placeholder="请选择扣停列车号">
                <el-option label="JC001" value="JC001" />
                <el-option label="JC002" value="JC002" />
                <el-option label="JC003" value="JC003" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="扣车开始时间" prop="detainStart">
            <template slot-scope="{row}">
              <el-date-picker v-model="row.detainStart" type="date" placeholder="选择日期" style="width: 100%;" />
            </template>
          </el-table-column>
          <el-table-column label="预计结束时间" prop="detainEnd">
            <template slot-scope="{row}">
              <el-date-picker v-model="row.detainEnd" type="date" placeholder="选择日期" style="width: 100%;" />
            </template>
          </el-table-column>
          <el-table-column label="走行公里数" prop="walk">
            <template slot-scope="{row}">
              <el-input v-show="true" v-model="row.walk" placeholder="请输入走行公里数" />
            </template>
          </el-table-column>
          <el-table-column label="停扣原因" prop="reason">
            <template slot-scope="{row}">
              <el-input v-show="true" v-model="row.reason" placeholder="请输入停扣原因" />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item style="text-align: center;padding-top: 30px">
          <el-button type="primary" @click="saveDetainCar">提交</el-button>
          <el-button @click="detainCarDialog.visible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  流程图  -->
    <div v-if="flowDiagram.visible">
      <flow-diagram
        svg-type="instance"
        :business-id="flowDiagram.businessId"
        :visible.sync="flowDiagram.visible"
        title="扣车申请流程图"
        width="90%"
      />
    </div>
    <el-dialog :visible="detainCarDetailDialog.visible">
      <div>
        <p>1、要求接触网停电的工作组合格人员填写：</p>
        <p>本人申请在<el-checkbox label="美食/餐厅线上活动" name="type" /></p>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./detain.js"/>

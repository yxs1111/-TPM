<template>
  <div class="app-container" @keyup.enter="search">
    <el-form ref="processSearchForm" :inline="true" :model="queryParams" class="demo-form-inline">
      <!-- 查询条件 -->
      <el-form-item label="流程名称" prop="nameLike">
        <el-input v-model="queryParams.nameLike" placeholder="请输入流程名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="流程关键字" prop="key">
        <el-input v-model="queryParams.key" placeholder="请输入流程关键字" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="loading" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  流程列表  -->
    <el-table
      ref="processTable"
      v-loading="loading"
      :data="tableData"
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
      <el-table-column v-slot="{row}" label="关键字" align="center">
        {{ row.key }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="流程名" align="center">
        {{ row.name }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="模型版本" align="center">
        {{ row.version }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="是否有流程图" :show-overflow-tooltip="true" align="center">
        <el-tag :type="row.graphicalNotationDefined | hasGraphicalStyleFilter" @click="showFlowDiagram(row)">{{ row.graphicalNotationDefined | hasGraphicalTextFilter }}</el-tag>
      </el-table-column>
      <el-table-column v-slot="{row}" label="状态" :show-overflow-tooltip="true" align="center">
        <el-tag :type="row.suspended | processStatsStyleFilter">{{ row.suspended | processStatsTextFilter }}</el-tag>
      </el-table-column>
      <el-table-column v-slot="{row}" label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <el-button v-permission="permissions['update']" size="mini" type="primary" @click="startProcess(row)">
          {{ $t('table.enable') }}
        </el-button>
        <el-button v-if="row.suspended" v-permission="permissions['update']" size="mini" type="success" @click="activateProcess(row)">
          {{ $t('table.activate') }}
        </el-button>
        <el-button v-else v-permission="permissions['update']" size="mini" type="danger" @click="suspendProcess(row)">
          {{ $t('table.suspend') }}
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="queryParams.start"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryParams.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--  流程图  -->
    <flow-diagram
      svg-type="definition"
      :process-definition-id="flowDiagram.processDefinitionId"
      :visible.sync="flowDiagram.visible"
      title="流程图"
      width="90%"
    />
  </div>
</template>

<script src="./process.js"/>

<!--
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-12-03 08:59:20
-->
<template>
  <div class="app-container" @keyup.enter="search">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">流程名称：</span>
          <el-input v-model="filterObj.name" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">流程关键词：</span>
          <el-input v-model="filterObj.keyName" placeholder="请输入" />
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" autofocusclass="TpmButtonBG">查询</el-button>
      </div>
    </div>
    <!--  流程列表  -->
    <el-table ref="processTable" v-loading="loading" :data="tableData" element-loading-text="正在查询" border fit stripe height="600" highlight-current-row
      @row-click="handleCurrentRowClick" @row-dblclick="handleCurrentRowDblClick" @selection-change="handleSelectionChange">
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
        <el-button  size="mini" type="primary" @click="startProcess(row)">
          {{ $t('table.enable') }}
        </el-button>
        <el-button v-if="row.suspended"  size="mini" type="success" @click="activateProcess(row)">
          {{ $t('table.activate') }}
        </el-button>
        <el-button v-else  size="mini" type="danger" @click="suspendProcess(row)">
          {{ $t('table.suspend') }}
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!--  流程图  -->
    <flow-diagram svg-type="definition" :process-definition-id="flowDiagram.processDefinitionId" :visible.sync="flowDiagram.visible" title="流程图" width="90%" />
  </div>
</template>

<script src="./process.js"/>

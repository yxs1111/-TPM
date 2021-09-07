<template>
  <div class="app-container" @keyup.enter="pageList">
    <!--查询条件-->
    <el-form ref="taskSearchForm" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="pageList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="taskTable"
      v-loading="searchLoading"
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
        {{ scopeProps.$index + 1 }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="优先级" align="center">
        {{ row.priority }}
      </el-table-column>
      <el-table-column v-slot="{row}" prop="name" label="任务名" align="center">
        {{ row.name }}
      </el-table-column>
      <el-table-column v-slot="{row}" prop="createTime" label="创建时间" align="center">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
      </el-table-column>
      <el-table-column v-slot="{row}" label="状态" :show-overflow-tooltip="true" align="center">
        <el-tag :type="row.suspended | taskStatsStyleFilter">{{ row.suspended | taskStatsTextFilter }}</el-tag>
      </el-table-column>
      <el-table-column v-slot="{row}" label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <el-button v-permission="permissions['update']" size="mini" type="primary" @click="operateProcess(row)">
          处理任务
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :current-page="queryParams.start"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script src="./task.js"/>
<style>
.block{
  padding-left: 30%;
}
</style>

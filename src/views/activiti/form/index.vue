<template>
  <div class="app-container" @keyup.enter="pageList">
    <!--查询条件-->
    <el-form ref="userInfoForm" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item prop="name" label="业务表名称">
        <el-input v-model="queryParams.businessName" placeholder="请输入业务表名称" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" :loading="searchLoading" @click="pageList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="formTable"
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
        {{ scopeProps.$index+1 }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="表单编码" align="center">
        {{ row.code }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="表单名" align="center">
        {{ row.name }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="业务表" align="center">
        {{ row.businessTable }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="业务表中文名" align="center">
        {{ row.businessName }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="所属模块" align="center">
        {{ row.module }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="操作类型" align="center">
        <el-tag type="success">{{ row.operation }}</el-tag>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="designForm(row)">
            设计表单
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
  </div>
</template>

<script src="./form.js"/>

<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="tableSearchForm" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="名称" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="addBusinessTableForm">新增</el-button>
    </div>
    <el-table
      ref="businessTable"
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
      <el-table-column prop="alias" label="别名" width="80" />
      <el-table-column prop="name" label="表明" width="180" />
      <el-table-column prop="comment" label="表注释/说明" width="180" />
      <el-table-column prop="source" label="表来源" width="80" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="updateTable(row)">
            {{ $t('table.update') }}
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
    <!--  新增/修改业务表  -->
    <el-dialog
      v-el-drag-dialog
      width="80%"
      :title="textMap[tableDialog.type]"
      :visible.sync="tableDialog.visible"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <el-row :gutter="10">
        <el-form ref="tableForm" :model="tableDialog.data" :rules="tableDialog.verify">
          <el-input v-show="false" v-model="tableDialog.data.id" />
          <el-col :span="6">
            <el-form-item label="表别名" prop="alias" label-width="80px">
              <el-input v-model="tableDialog.data.alias" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表名" prop="name" label-width="80px">
              <el-input v-model="tableDialog.data.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表注释" prop="comment" label-width="80px">
              <el-input v-model="tableDialog.data.comment" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类" prop="category" label-width="80px">
              <el-select v-model="tableDialog.data.categoryId" placeholder="请选择">
                <el-option
                  v-for="item in categoryArr"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-card>
            <el-table
              :data="tableDialog.data.fieldList"
              style="width: 100%"
            >
              <el-table-column label="字段名" prop="name">
                <template slot-scope="{row}">
                  <el-input v-show="true" v-model="row.name" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column label="字段注释" prop="comment">
                <template slot-scope="{row}">
                  <el-input v-show="true" v-model="row.comment" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column label="数据类型" prop="type">
                <template slot-scope="{row}">
                  <el-select v-model="row.type" placeholder="请选择类型">
                    <el-option label="字符串" value="String" />
                    <el-option label="整数" value="Integer" />
                    <el-option label="小数" value="Double" />
                    <el-option label="时间" value="Date" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="数据长度" prop="length">
                <template slot-scope="{row}">
                  <el-input v-show="true" v-model="row.length" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column label="默认值" prop="defaultValue">
                <template slot-scope="{row}">
                  <el-input v-show="true" v-model="row.defaultValue" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                  <el-button size="mini" type="primary" @click="tableDialog.data.fieldList.push({})">
                    增加一行
                  </el-button>
                  <el-button size="mini" type="danger" @click="tableDialog.data.fieldList.splice(tableDialog.data.fieldList.findIndex(tableField => tableField === row), 1)">
                    {{ $t('table.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-form-item style="text-align: center;padding-top: 20px">
            <el-button type="primary" @click="saveOrUpdateTable">保存</el-button>
            <el-button @click="tableDialog.visible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script src="./table.js"/>

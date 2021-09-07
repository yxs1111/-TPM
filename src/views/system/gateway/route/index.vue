<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="gatewayRouteForm" :inline="true" :model="gatewayRouteQuery" class="demo-form-inline">
      <el-form-item label="描述">
        <el-input v-model="gatewayRouteQuery.description" :clearable="true" placeholder="描述" maxlength="50" />
      </el-form-item>
      <el-form-item label="URI">
        <el-input v-model="gatewayRouteQuery.uri" :clearable="true" placeholder="URI" maxlength="50" />
      </el-form-item>
      <el-form-item label="判定器">
        <el-input v-model="gatewayRouteQuery.predicates" :clearable="true" placeholder="判定器" maxlength="50" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button v-permission="permissions['delete']" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="showDeleteDialog">
        删除
      </el-button>
      <el-button v-permission="permissions['insert']" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="gatewayRouteTable"
      v-loading="searchLoading"
      :data="gatewayRoutePageProps.records"
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
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="routeId" label="路由ID" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" prop="uri" label="URI" />
      <el-table-column align="center" prop="predicates" label="判定器" />
      <el-table-column align="center" prop="filters" label="过滤器" />
      <el-table-column align="center" prop="routeOrder" label="排序" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-permission="permissions['update']" type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-permission="permissions['delete']" size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-permission="permissions['get']" size="mini" type="default" @click="getRowData(row)">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="gatewayRoutePageProps.total"
      :page-size="gatewayRoutePageProps.pageSize"
      :current-page="gatewayRoutePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[gatewayRouteDialog.state]" :visible.sync="gatewayRouteDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="gatewayRouteDataForm"
        :rules="rules"
        :model="gatewayRouteDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="routeId" label="路由ID">
          <el-input v-model="gatewayRouteDialog.data.routeId" />
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="gatewayRouteDialog.data.description" />
        </el-form-item>
        <el-form-item prop="uri" label="URI">
          <el-input v-model="gatewayRouteDialog.data.uri" />
        </el-form-item>
        <el-form-item prop="predicates" label="判定器">
          <el-input v-model="gatewayRouteDialog.data.predicates" />
        </el-form-item>
        <el-form-item prop="filters" label="过滤器">
          <el-input v-model="gatewayRouteDialog.data.filters" />
        </el-form-item>
        <el-form-item prop="routeOrder" label="排序">
          <el-input-number v-model="gatewayRouteDialog.data.routeOrder" style="width: 100%" :min="0" :precision="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gatewayRouteDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="gatewayRouteDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      @dragDialog="handleDrag"
    >
      <span v-if="multipleSelection && multipleSelection.length>0">确认删除选中的{{ multipleSelection.length }}项？</span>
      <span v-else>未选中任何内容。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button v-if="multipleSelection && multipleSelection.length>0" type="primary" @click="handleDeleteRows">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>

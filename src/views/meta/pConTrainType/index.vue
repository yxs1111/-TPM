<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="pConTrainTypeForm" :inline="true" :model="pConTrainTypeQuery" class="demo-form-inline">
      <el-form-item label="车型编码" prop="trainTypeCode">
        <el-input v-model="pConTrainTypeQuery.trainTypeCode" :clearable="true" placeholder="车型编码" maxlength="36" />
      </el-form-item>
      <el-form-item label="车型名称" prop="trainTypeName">
        <el-input v-model="pConTrainTypeQuery.trainTypeName" :clearable="true" placeholder="车型名称" maxlength="36" />
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
      ref="pConTrainTypeTable"
      v-loading="searchLoading"
      :data="pConTrainTypePageProps.records"
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
      <el-table-column align="center" prop="trainTypeCode" label="车型编码" />
      <el-table-column align="center" prop="trainTypeName" label="车型名称" />
      <el-table-column align="center" prop="trainTypeDesc" label="车型描述" />
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column align="center" prop="changeLen" label="换长" />
      <el-table-column align="center" prop="trainNo" label="编组数量" />
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
      :total="pConTrainTypePageProps.total"
      :page-size="pConTrainTypePageProps.pageSize"
      :current-page="pConTrainTypePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[pConTrainTypeDialog.state]" :visible.sync="pConTrainTypeDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="pConTrainTypeDataForm"
        :rules="rules"
        :model="pConTrainTypeDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="trainTypeCode" label="车型编码">
          <el-input v-model="pConTrainTypeDialog.data.trainTypeCode" maxlength="36" />
        </el-form-item>
        <el-form-item prop="trainTypeName" label="车型名称">
          <el-input v-model="pConTrainTypeDialog.data.trainTypeName" maxlength="36" />
        </el-form-item>
        <el-form-item prop="changeLen" label="换长">
          <el-input-number v-model="pConTrainTypeDialog.data.changeLen" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item prop="trainTypeDesc" label="车型描述">
          <el-input v-model="pConTrainTypeDialog.data.trainTypeDesc" type="textarea" maxlength="255" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="pConTrainTypeDialog.data.remark" type="textarea" maxlength="200" />
        </el-form-item>
        <el-form-item prop="trainNo" label="编组数量" hidden>
          <el-input v-model="pConTrainTypeDialog.data.trainNo" maxlength="36" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pConTrainTypeDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="pConTrainTypeDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

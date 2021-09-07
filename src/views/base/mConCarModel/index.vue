<template>
  <div class="app-container" @keyup.enter="search">
	<!--查询条件-->
    <el-form ref="mConCarModelForm" :inline="true" :model="mConCarModelQuery" class="demo-form-inline">
      <el-form-item label="节点编码" prop="modelCode">
		<el-input v-model="mConCarModelQuery.modelCode" :clearable="true" placeholder="节点编码" maxlength="50" />
      </el-form-item>
      <el-form-item label="节点名称" prop="modelName">
		<el-input v-model="mConCarModelQuery.modelName" :clearable="true" placeholder="节点名称" maxlength="100" />
      </el-form-item>
      <el-form-item label="线路ID" prop="lineId">
		<el-input v-model="mConCarModelQuery.lineId" :clearable="true" placeholder="线路ID" maxlength="36" />
      </el-form-item>
      <el-form-item label="车型ID" prop="trainTypeId">
		<el-input v-model="mConCarModelQuery.trainTypeId" :clearable="true" placeholder="车型ID" maxlength="36" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
		<el-input v-model="mConCarModelQuery.remark" :clearable="true" placeholder="备注" maxlength="500" />
      </el-form-item>
      <el-form-item label="层级" prop="level">
		<el-input v-model="mConCarModelQuery.level" :clearable="true" placeholder="层级" />
      </el-form-item>
      <el-form-item label="父亲名称" prop="paModelName">
		<el-input v-model="mConCarModelQuery.paModelName" :clearable="true" placeholder="父亲名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="父节点" prop="paModelId">
		<el-input v-model="mConCarModelQuery.paModelId" :clearable="true" placeholder="父节点" maxlength="32" />
      </el-form-item>
       <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="mConCarModelQuery.dataRange"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd"
          :default-time="['00:00:00','23:59:59']"
          @change="search"
        />
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
      ref="mConCarModelTable"
      v-loading="searchLoading"
      :data="mConCarModelPageProps.record"
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
      <el-table-column align="center" prop="id" label="ID" />
      <el-table-column align="center" prop="modelCode" label="节点编码" />
      <el-table-column align="center" prop="modelName" label="节点名称" />
      <el-table-column align="center" prop="lineId" label="线路ID" />
      <el-table-column align="center" prop="trainTypeId" label="车型ID" />
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column align="center" prop="level" label="层级" />
      <el-table-column align="center" prop="paModelName" label="父亲名称" />
      <el-table-column align="center" prop="paModelId" label="父节点" />
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
      :total="mConCarModelPageProps.total"
      :page-size="mConCarModelPageProps.pageSize"
      :current-page="mConCarModelPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[mConCarModelDialog.state]" :visible.sync="mConCarModelDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="mConCarModelDataForm"
        :rules="rules"
        :model="mConCarModelDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="modelCode" label="节点编码">
          <el-input v-model="mConCarModelDialog.data.modelCode" maxlength="50" />
        </el-form-item>
        <el-form-item prop="modelName" label="节点名称">
          <el-input v-model="mConCarModelDialog.data.modelName" maxlength="100" />
        </el-form-item>
        <el-form-item prop="lineId" label="线路ID">
          <el-input v-model="mConCarModelDialog.data.lineId" maxlength="36" />
        </el-form-item>
        <el-form-item prop="trainTypeId" label="车型ID">
          <el-input v-model="mConCarModelDialog.data.trainTypeId" maxlength="36" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="mConCarModelDialog.data.remark" maxlength="500" />
        </el-form-item>
        <el-form-item prop="level" label="层级">
          <el-input v-model="mConCarModelDialog.data.level" />
        </el-form-item>
        <el-form-item prop="paModelName" label="父亲名称">
          <el-input v-model="mConCarModelDialog.data.paModelName" maxlength="50" />
        </el-form-item>
        <el-form-item prop="paModelId" label="父节点">
          <el-input v-model="mConCarModelDialog.data.paModelId" maxlength="32" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mConCarModelDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="mConCarModelDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

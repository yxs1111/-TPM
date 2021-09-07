<template>
  <div class="app-container" @keyup.enter="search">
	<!--查询条件-->
    <el-form ref="mConCodeTemplateForm" :inline="true" :model="mConCodeTemplateQuery" class="demo-form-inline">
      <el-form-item label="模版名称" prop="name">
		<el-input v-model="mConCodeTemplateQuery.name" :clearable="true" placeholder="模版名称" maxlength="255" />
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
		<el-input v-model="mConCodeTemplateQuery.code" :clearable="true" placeholder="模板编码" maxlength="255" />
      </el-form-item>
      <el-form-item label="模版类型" prop="type">
        <el-select v-model="mConCodeTemplateQuery.type" clearable placeholder="请选择">
          <el-option
            v-for="item in codeTemplateType"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
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
      ref="mConCodeTemplateTable"
      v-loading="searchLoading"
      :data="mConCodeTemplatePageProps.record"
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
<!--      <el-table-column align="center" prop="id" label="物理主键" />-->
      <el-table-column align="center" prop="name" label="模版名称" />
<!--      <el-table-column align="center" prop="code" label="模板编码" />-->
      <el-table-column align="center" prop="codeVal" label="模版编码" />
      <el-table-column align="center" prop="type" label="模版类型" />
<!--      <el-table-column align="center" prop="attInfo" label="附件信息" />-->
      <el-table-column align="center" prop="status" label="状态">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">{{ row.status | statusFilter }}</el-tag>
      </template>
      </el-table-column>
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
      :total="mConCodeTemplatePageProps.total"
      :page-size="mConCodeTemplatePageProps.pageSize"
      :current-page="mConCodeTemplatePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[mConCodeTemplateDialog.state]" :visible.sync="mConCodeTemplateDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="mConCodeTemplateDataForm"
        :rules="rules"
        :model="mConCodeTemplateDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="name" label="模版名称">
          <el-input v-model="mConCodeTemplateDialog.data.name" maxlength="255" />
        </el-form-item>
        <el-form-item prop="codeVal" label="模版编码">
          <el-input v-model="mConCodeTemplateDialog.data.codeVal" />
        </el-form-item>
        <el-form-item prop="type" label="模版类型">
          <el-select v-model="mConCodeTemplateDialog.data.type" clearable placeholder="请选择">
            <el-option
              v-for="item in codeTemplateType"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="attInfo" label="附件信息">
          <el-input v-model="mConCodeTemplateDialog.data.attInfo" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="mConCodeTemplateDialog.data.status" clearable  placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mConCodeTemplateDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="mConCodeTemplateDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

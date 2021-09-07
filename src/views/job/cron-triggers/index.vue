<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="qrtzCronTriggersForm" :inline="true" :model="qrtzCronTriggersQuery" class="demo-form-inline">
      <el-form-item label="cronExpression" prop="cronExpression">
        <el-input v-model="qrtzCronTriggersQuery.cronExpression" :clearable="true" placeholder="" maxlength="120" />
      </el-form-item>
      <el-form-item label="timeZoneId" prop="timeZoneId">
        <el-input v-model="qrtzCronTriggersQuery.timeZoneId" :clearable="true" placeholder="" maxlength="80" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="qrtzCronTriggersQuery.dataRange"
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
      ref="qrtzCronTriggersTable"
      v-loading="searchLoading"
      :data="qrtzCronTriggersPageProps.records"
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
      <el-table-column align="center" prop="schedName"  label="schedName" />
      <el-table-column align="center" prop="triggerName"  label="triggerName" />
      <el-table-column align="center" prop="triggerGroup"  label="triggerGroup" />
      <el-table-column align="center" prop="cronExpression"  label="cronExpression" />
      <el-table-column align="center" prop="timeZoneId"  label="timeZoneId" />
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
      :total="qrtzCronTriggersPageProps.total"
      :page-size="qrtzCronTriggersPageProps.pageSize"
      :current-page="qrtzCronTriggersPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[qrtzCronTriggersDialog.state]" :visible.sync="qrtzCronTriggersDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="qrtzCronTriggersDataForm"
        :rules="rules"
        :model="qrtzCronTriggersDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="cronExpression" label="cronExpression">
          <el-input v-model="qrtzCronTriggersDialog.data.cronExpression" maxlength="120" />
        </el-form-item>
        <el-form-item prop="timeZoneId" label="timeZoneId">
          <el-input v-model="qrtzCronTriggersDialog.data.timeZoneId" maxlength="80" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrtzCronTriggersDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="qrtzCronTriggersDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

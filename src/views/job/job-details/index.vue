<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="qrtzJobDetailsForm" :inline="true" :model="qrtzJobDetailsQuery" class="demo-form-inline">
      <el-form-item label="description" prop="description">
        <el-input v-model="qrtzJobDetailsQuery.description" :clearable="true" placeholder="" maxlength="250" />
      </el-form-item>
      <el-form-item label="jobClassName" prop="jobClassName">
        <el-input v-model="qrtzJobDetailsQuery.jobClassName" :clearable="true" placeholder="" maxlength="250" />
      </el-form-item>
      <el-form-item label="isDurable" prop="isDurable">
        <el-input v-model="qrtzJobDetailsQuery.isDurable" :clearable="true" placeholder="" maxlength="1" />
      </el-form-item>
      <el-form-item label="isNonconcurrent" prop="isNonconcurrent">
        <el-input v-model="qrtzJobDetailsQuery.isNonconcurrent" :clearable="true" placeholder="" maxlength="1" />
      </el-form-item>
      <el-form-item label="isUpdateData" prop="isUpdateData">
        <el-input v-model="qrtzJobDetailsQuery.isUpdateData" :clearable="true" placeholder="" maxlength="1" />
      </el-form-item>
      <el-form-item label="requestsRecovery" prop="requestsRecovery">
        <el-input v-model="qrtzJobDetailsQuery.requestsRecovery" :clearable="true" placeholder="" maxlength="1" />
      </el-form-item>
      <el-form-item label="jobData" prop="jobData">
        <el-input v-model="qrtzJobDetailsQuery.jobData" :clearable="true" placeholder="" />
      </el-form-item>
      <el-form-item label="删除人" prop="deleteBy">
        <el-input v-model="qrtzJobDetailsQuery.deleteBy" :clearable="true" placeholder="删除人" maxlength="50" />
      </el-form-item>
      <el-form-item label="删除时间" prop="deleteDate">
        <el-input v-model="qrtzJobDetailsQuery.deleteDate" :clearable="true" placeholder="删除时间" />
      </el-form-item>
      <el-form-item label="禁用标识" prop="locked">
        <el-input v-model="qrtzJobDetailsQuery.locked" :clearable="true" placeholder="禁用标识" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="qrtzJobDetailsQuery.dataRange"
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
      ref="qrtzJobDetailsTable"
      v-loading="searchLoading"
      :data="qrtzJobDetailsPageProps.records"
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
      <el-table-column align="center" prop="jobName"  label="jobName" />
      <el-table-column align="center" prop="jobGroup"  label="jobGroup" />
      <el-table-column align="center" prop="description"  label="description" />
      <el-table-column align="center" prop="jobClassName"  label="jobClassName" />
      <el-table-column align="center" prop="isDurable"  label="isDurable" />
      <el-table-column align="center" prop="isNonconcurrent"  label="isNonconcurrent" />
      <el-table-column align="center" prop="isUpdateData"  label="isUpdateData" />
      <el-table-column align="center" prop="requestsRecovery"  label="requestsRecovery" />
      <el-table-column align="center" prop="jobData"  label="jobData" />
      <el-table-column align="center" prop="deleteBy" label="删除人" />
      <el-table-column align="center" prop="deleteDate" label="删除时间" />
      <el-table-column align="center" prop="locked" label="禁用标识" />
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
      :total="qrtzJobDetailsPageProps.total"
      :page-size="qrtzJobDetailsPageProps.pageSize"
      :current-page="qrtzJobDetailsPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[qrtzJobDetailsDialog.state]" :visible.sync="qrtzJobDetailsDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="qrtzJobDetailsDataForm"
        :rules="rules"
        :model="qrtzJobDetailsDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="description" label="description">
          <el-input v-model="qrtzJobDetailsDialog.data.description" maxlength="250" />
        </el-form-item>
        <el-form-item prop="jobClassName" label="jobClassName">
          <el-input v-model="qrtzJobDetailsDialog.data.jobClassName" maxlength="250" />
        </el-form-item>
        <el-form-item prop="isDurable" label="isDurable">
          <el-input v-model="qrtzJobDetailsDialog.data.isDurable" maxlength="1" />
        </el-form-item>
        <el-form-item prop="isNonconcurrent" label="isNonconcurrent">
          <el-input v-model="qrtzJobDetailsDialog.data.isNonconcurrent" maxlength="1" />
        </el-form-item>
        <el-form-item prop="isUpdateData" label="isUpdateData">
          <el-input v-model="qrtzJobDetailsDialog.data.isUpdateData" maxlength="1" />
        </el-form-item>
        <el-form-item prop="requestsRecovery" label="requestsRecovery">
          <el-input v-model="qrtzJobDetailsDialog.data.requestsRecovery" maxlength="1" />
        </el-form-item>
        <el-form-item prop="jobData" label="jobData">
          <el-input v-model="qrtzJobDetailsDialog.data.jobData" />
        </el-form-item>
        <el-form-item prop="deleteBy" label="删除人">
          <el-input v-model="qrtzJobDetailsDialog.data.deleteBy" maxlength="50" />
        </el-form-item>
        <el-form-item prop="deleteDate" label="删除时间">
          <el-input v-model="qrtzJobDetailsDialog.data.deleteDate" />
        </el-form-item>
        <el-form-item prop="locked" label="禁用标识">
          <el-input v-model="qrtzJobDetailsDialog.data.locked" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrtzJobDetailsDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="qrtzJobDetailsDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="invitationRecordForm" :inline="true" :model="invitationRecordQuery" class="demo-form-inline">
      <el-form-item label="用户手机号" prop="userPhone">
        <el-input v-model="invitationRecordQuery.userPhone" :clearable="true" placeholder="用户手机号" maxlength="20" />
      </el-form-item>
      <el-form-item label="租户名称" prop="tenantName">
        <el-input v-model="invitationRecordQuery.tenantName" :clearable="true" placeholder="租户名称" maxlength="100" />
      </el-form-item>
      <el-form-item label="即将加入的组织名称" prop="orgName">
        <el-input v-model="invitationRecordQuery.orgName" :clearable="true" placeholder="即将加入的组织名称" maxlength="100" />
      </el-form-item>
      <el-form-item label="邀请状态（0：进行中，1：已加入，2：已拒绝）" prop="state">
        <el-input v-model="invitationRecordQuery.state" :clearable="true" placeholder="邀请状态（0：进行中，1：已加入，2：已拒绝）" maxlength="1" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="invitationRecordQuery.dataRange"
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
      ref="invitationRecordTable"
      v-loading="searchLoading"
      :data="invitationRecordPageProps.records"
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
      <el-table-column align="center" prop="userId" label="用户ID" />
      <el-table-column align="center" prop="userPhone" label="用户手机号" />
      <el-table-column align="center" prop="tenantId" label="租户ID" />
      <el-table-column align="center" prop="tenantSchema" label="租户schema" />
      <el-table-column align="center" prop="tenantName" label="租户名称" />
      <el-table-column align="center" prop="orgName" label="即将加入的组织名称" />
      <el-table-column align="center" prop="state" label="邀请状态（0：进行中，1：已加入，2：已拒绝）" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
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
      :total="invitationRecordPageProps.total"
      :page-size="invitationRecordPageProps.pageSize"
      :current-page="invitationRecordPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[invitationRecordDialog.state]" :visible.sync="invitationRecordDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="invitationRecordDataForm"
        :rules="rules"
        :model="invitationRecordDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="invitationRecordDialog.data.userId" maxlength="100" />
        </el-form-item>
        <el-form-item prop="userPhone" label="用户手机号">
          <el-input v-model="invitationRecordDialog.data.userPhone" maxlength="20" />
        </el-form-item>
        <el-form-item prop="tenantId" label="租户ID">
          <el-input v-model="invitationRecordDialog.data.tenantId" />
        </el-form-item>
        <el-form-item prop="tenantSchema" label="租户schema">
          <el-input v-model="invitationRecordDialog.data.tenantSchema" maxlength="100" />
        </el-form-item>
        <el-form-item prop="tenantName" label="租户名称">
          <el-input v-model="invitationRecordDialog.data.tenantName" maxlength="100" />
        </el-form-item>
        <el-form-item prop="orgId" label="即将加入的组织ID">
          <el-input v-model="invitationRecordDialog.data.orgId" />
        </el-form-item>
        <el-form-item prop="orgName" label="即将加入的组织名称">
          <el-input v-model="invitationRecordDialog.data.orgName" maxlength="100" />
        </el-form-item>
        <el-form-item prop="state" label="邀请状态（0：进行中，1：已加入，2：已拒绝）">
          <el-input v-model="invitationRecordDialog.data.state" maxlength="1" />
        </el-form-item>
        <el-form-item prop="createBy" label="创建人">
          <el-input v-model="invitationRecordDialog.data.createBy" maxlength="50" />
        </el-form-item>
        <el-form-item prop="createDate" label="创建时间">
          <el-input v-model="invitationRecordDialog.data.createDate" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invitationRecordDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="invitationRecordDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

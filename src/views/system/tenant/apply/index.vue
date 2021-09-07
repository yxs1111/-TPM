<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="authTenantApplyForm" :inline="true" :model="authTenantApplyQuery" class="demo-form-inline">
      <el-form-item label="名称" prop="name">
        <el-input v-model="authTenantApplyQuery.name" :clearable="true" placeholder="名称" maxlength="100" />
      </el-form-item>
      <el-form-item label="所属区域ID" prop="areaId">
        <el-input v-model="authTenantApplyQuery.areaId" :clearable="true" placeholder="所属区域ID" />
      </el-form-item>
      <el-form-item label="联系人名称" prop="contactName">
        <el-input v-model="authTenantApplyQuery.contactName" :clearable="true" placeholder="联系人名称" maxlength="100" />
      </el-form-item>
      <el-form-item label="申请人手机号" prop="applyPhone">
        <el-input v-model="authTenantApplyQuery.applyPhone" :clearable="true" placeholder="申请人手机号" maxlength="20" />
      </el-form-item>
      <el-form-item label="审核状态" prop="approved">
        <el-select
          v-model="authTenantApplyQuery.approved"
          clearable
          placeholder="审核状态"
        >
          <el-option label="未通过" :value="0" />
          <el-option label="已通过" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="authTenantApplyQuery.dataRange"
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
        <el-button
          v-permission="permissions['get']"
          type="primary"
          icon="el-icon-search"
          :loading="searchLoading"
          @click="search"
        >搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button
        v-permission="permissions['delete']"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="showDeleteDialog"
      >
        删除
      </el-button>
      <el-button
        v-permission="permissions['insert']"
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="newRowData"
      >
        新增
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="authTenantApplyTable"
      v-loading="searchLoading"
      :data="authTenantApplyPageProps.records"
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
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="名称" />
      <el-table-column align="center" prop="nickName" label="简称" />
      <el-table-column align="center" prop="areaName" label="所属区域名称" />
      <el-table-column align="center" prop="applyPhone" label="申请人手机号" />
      <el-table-column align="center" prop="contactName" label="联系人名称" />
      <el-table-column align="center" prop="contactPhone" label="联系人电话" />
      <el-table-column align="center" prop="contactEmail" label="联系人邮箱" />
      <el-table-column class-name="status-col" label="过期状态" align="center" prop="approved">
        <template slot-scope="{row}">
          {{ row.approved | approvedWordFilter }}
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
      :total="authTenantApplyPageProps.total"
      :page-size="authTenantApplyPageProps.pageSize"
      :current-page="authTenantApplyPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[authTenantApplyDialog.state]"
      :visible.sync="authTenantApplyDialog.visible"
      @dragDialog="handleDrag"
    >
      <el-form
        ref="authTenantApplyDataForm"
        :rules="rules"
        :model="authTenantApplyDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="name" label="名称">
          <el-input v-model="authTenantApplyDialog.data.name" maxlength="100" />
        </el-form-item>
        <el-form-item prop="nickName" label="简称">
          <el-input v-model="authTenantApplyDialog.data.nickName" maxlength="50" />
        </el-form-item>
        <el-form-item prop="areaName" label="所属区域名称">
          <el-input v-model="authTenantApplyDialog.data.areaName" maxlength="50" />
        </el-form-item>
        <el-form-item prop="applyPhone" label="申请人手机号">
          <el-input v-model="authTenantApplyDialog.data.applyPhone" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item prop="contactName" label="联系人名称">
          <el-input v-model="authTenantApplyDialog.data.contactName" maxlength="100" />
        </el-form-item>
        <el-form-item prop="contactPhone" label="联系人手机号">
          <el-input v-model="authTenantApplyDialog.data.contactPhone" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item prop="contactEmail" label="联系人邮箱">
          <el-input v-model="authTenantApplyDialog.data.contactEmail" maxlength="20" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authTenantApplyDialog.visible = false">
          关闭
        </el-button>
        <el-button
          v-if="authTenantApplyDialog.state==='info'"
          v-permission="permissions['update']"
          type="primary"
          @click="changeToEdit"
        >
          编辑
        </el-button>
        <el-button
          v-else
          v-permission="permissions['update']"
          type="primary"
          :loading="saveLoading"
          @click="saveOrUpdate"
        >
          保存并关闭
        </el-button>
        <el-button
          v-if="authTenantApplyDialog.data.id && authTenantApplyDialog.data.approved !== 1"
          v-permission="permissions['update']"
          type="success"
          :loading="saveLoading"
          @click="approved"
        >
          审核通过
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
        <el-button
          v-if="multipleSelection && multipleSelection.length>0"
          type="primary"
          @click="handleDeleteRows"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>

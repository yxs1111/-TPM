<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="authTenantForm" :inline="true" :model="authTenantQuery" class="demo-form-inline">
      <el-form-item label="租户ID" prop="tenantId">
        <el-input v-model="authTenantQuery.tenantId" :clearable="true" placeholder="编码" maxlength="50" />
      </el-form-item>
      <el-form-item label="名称" prop="tenantName">
        <el-input v-model="authTenantQuery.tenantName" :clearable="true" placeholder="名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="管理员账号" prop="manager">
        <el-input v-model="authTenantQuery.manager" :clearable="true" placeholder="管理员账号" maxlength="50" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button v-permission="permissions['insert']" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
      <el-button v-permission="permissions['delete']" class="filter-item" style="margin-left: 10px;" type="danger" @click="showDeleteDialog">
        禁用
      </el-button>
      <el-button v-permission="permissions['delete']" class="filter-item" style="margin-left: 10px;" type="success" @click="showActiveDialog">
        启用
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="authTenantTable"
      v-loading="searchLoading"
      :data="authTenantPageProps.records"
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
      <el-table-column align="center" prop="tenantName" label="名称" />
      <el-table-column align="center" prop="tenantSchema" label="schema" />
      <el-table-column align="center" prop="manager" label="管理员账号" />
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.locked | lockedStatusFilter">{{ row.locked | lockedWordFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-permission="permissions['update']" type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.isDisabled === '0'" v-permission="permissions['delete']" size="mini" type="danger" @click="handleDelete(row)">
            禁用
          </el-button>
          <el-button v-if="row.isDisabled === '1'" v-permission="permissions['delete']" size="mini" type="success" @click="handleActive(row)">
            启用
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
      :total="authTenantPageProps.total"
      :page-size="authTenantPageProps.pageSize"
      :current-page="authTenantPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[authTenantDialog.state]" :visible.sync="authTenantDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="authTenantDataForm"
        :rules="authTenantDialog.state === 'create' ? rules : {}"
        :model="authTenantDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="tenantId" label="租户ID">
          <el-input-number v-model="authTenantDialog.data.tenantId" style="width: 100%" :min="1" :precision="0" :disabled="authTenantDialog.state !== 'create'" />
        </el-form-item>
        <el-form-item prop="tenantName" label="名称">
          <el-input v-model="authTenantDialog.data.tenantName" @blur="setManager(authTenantDialog.data.tenantName)" />
        </el-form-item>
        <el-form-item prop="manager" label="管理员账号">
          <el-input v-model="authTenantDialog.data.manager" :disabled="authTenantDialog.state !== 'create'" />
        </el-form-item>
        <el-form-item v-if="authTenantDialog.state === 'create'" label="管理员手机号" prop="phone">
          <el-input v-model="authTenantDialog.data.phone" maxlength="20" :clearable="true" placeholder="管理员手机号" show-word-limit />
        </el-form-item>
        <el-form-item v-if="authTenantDialog.state === 'create'" label="性别" prop="gender">
          <el-radio v-model="authTenantDialog.data.gender" :label="0">男</el-radio>
          <el-radio v-model="authTenantDialog.data.gender" :label="1">女</el-radio>
          <el-radio v-model="authTenantDialog.data.gender" :label="2">其他</el-radio>
        </el-form-item>
        <el-form-item v-if="authTenantDialog.state === 'create'" label="过期时间" prop="expireAt">
          <el-date-picker v-model="authTenantDialog.data.expireAt" type="date" placeholder="请选择过期时间" format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authTenantDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="authTenantDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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
      <span v-if="multipleSelection && multipleSelection.length>0">确认禁用选中的{{ multipleSelection.length }}项？</span>
      <span v-else>未选中任何内容。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button v-if="multipleSelection && multipleSelection.length>0" type="primary" @click="handleDeleteRows">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="提示"
      :visible.sync="activeDialogVisible"
      width="30%"
      center
      @dragDialog="handleDrag"
    >
      <span v-if="multipleSelection && multipleSelection.length>0">确认启用选中的{{ multipleSelection.length }}项？</span>
      <span v-else>未选中任何内容。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activeDialogVisible = false">关 闭</el-button>
        <el-button v-if="multipleSelection && multipleSelection.length>0" type="primary" @click="handleActiveRows">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>

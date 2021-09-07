<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="authUserTenantForm" :inline="true" :model="authUserTenantQuery" class="demo-form-inline">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="authUserTenantQuery.userId" :clearable="true" placeholder="用户ID" maxlength="100" />
      </el-form-item>
      <el-form-item label="租户ID" prop="tenantId">
        <el-input v-model="authUserTenantQuery.tenantId" :clearable="true" placeholder="租户ID" />
      </el-form-item>
      <el-form-item label="租户schema" prop="tenantSchema">
        <el-input v-model="authUserTenantQuery.tenantSchema" :clearable="true" placeholder="租户schema" maxlength="100" />
      </el-form-item>
      <el-form-item label="是否禁用" prop="locked">
        <el-input v-model="authUserTenantQuery.locked" :clearable="true" placeholder="是否禁用" maxlength="1" />
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input v-model="authUserTenantQuery.createBy" :clearable="true" placeholder="创建人" maxlength="50" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="authUserTenantQuery.createDate" :clearable="true" placeholder="创建时间" />
      </el-form-item>
      <el-form-item label="修改人" prop="updateBy">
        <el-input v-model="authUserTenantQuery.updateBy" :clearable="true" placeholder="修改人" maxlength="50" />
      </el-form-item>
      <el-form-item label="修改时间" prop="updateDate">
        <el-input v-model="authUserTenantQuery.updateDate" :clearable="true" placeholder="修改时间" />
      </el-form-item>
      <el-form-item label="删除人" prop="deleteBy">
        <el-input v-model="authUserTenantQuery.deleteBy" :clearable="true" placeholder="删除人" maxlength="50" />
      </el-form-item>
      <el-form-item label="删除时间" prop="deleteDate">
        <el-input v-model="authUserTenantQuery.deleteDate" :clearable="true" placeholder="删除时间" />
      </el-form-item>
      <el-form-item label="删除标记(0:未删除，其他:已删除)" prop="deleteFlag">
        <el-input v-model="authUserTenantQuery.deleteFlag" :clearable="true" placeholder="删除标记(0:未删除，其他:已删除)" />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="authUserTenantQuery.version" :clearable="true" placeholder="版本" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="authUserTenantQuery.dataRange"
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
      ref="authUserTenantTable"
      v-loading="searchLoading"
      :data="authUserTenantPageProps.records"
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
      <el-table-column align="center" prop="id" label="主键" />
      <el-table-column align="center" prop="userId" label="用户ID" />
      <el-table-column align="center" prop="tenantId" label="租户ID" />
      <el-table-column align="center" prop="tenantSchema" label="租户schema" />
      <el-table-column align="center" prop="locked" label="是否禁用" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
      <el-table-column align="center" prop="updateBy" label="修改人" />
      <el-table-column align="center" prop="updateDate" label="修改时间" />
      <el-table-column align="center" prop="deleteBy" label="删除人" />
      <el-table-column align="center" prop="deleteDate" label="删除时间" />
      <el-table-column align="center" prop="deleteFlag" label="删除标记(0:未删除，其他:已删除)" />
      <el-table-column align="center" prop="version" label="版本" />
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
      :total="authUserTenantPageProps.total"
      :page-size="authUserTenantPageProps.pageSize"
      :current-page="authUserTenantPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[authUserTenantDialog.state]" :visible.sync="authUserTenantDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="authUserTenantDataForm"
        :rules="rules"
        :model="authUserTenantDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="authUserTenantDialog.data.userId" maxlength="100" />
        </el-form-item>
        <el-form-item prop="tenantId" label="租户ID">
          <el-input v-model="authUserTenantDialog.data.tenantId" />
        </el-form-item>
        <el-form-item prop="tenantSchema" label="租户schema">
          <el-input v-model="authUserTenantDialog.data.tenantSchema" maxlength="100" />
        </el-form-item>
        <el-form-item prop="locked" label="是否禁用">
          <el-input v-model="authUserTenantDialog.data.locked" maxlength="1" />
        </el-form-item>
        <el-form-item prop="createBy" label="创建人">
          <el-input v-model="authUserTenantDialog.data.createBy" maxlength="50" />
        </el-form-item>
        <el-form-item prop="createDate" label="创建时间">
          <el-input v-model="authUserTenantDialog.data.createDate" />
        </el-form-item>
        <el-form-item prop="updateBy" label="修改人">
          <el-input v-model="authUserTenantDialog.data.updateBy" maxlength="50" />
        </el-form-item>
        <el-form-item prop="updateDate" label="修改时间">
          <el-input v-model="authUserTenantDialog.data.updateDate" />
        </el-form-item>
        <el-form-item prop="deleteBy" label="删除人">
          <el-input v-model="authUserTenantDialog.data.deleteBy" maxlength="50" />
        </el-form-item>
        <el-form-item prop="deleteDate" label="删除时间">
          <el-input v-model="authUserTenantDialog.data.deleteDate" />
        </el-form-item>
        <el-form-item prop="deleteFlag" label="删除标记(0:未删除，其他:已删除)">
          <el-input v-model="authUserTenantDialog.data.deleteFlag" />
        </el-form-item>
        <el-form-item prop="version" label="版本">
          <el-input v-model="authUserTenantDialog.data.version" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authUserTenantDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="authUserTenantDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

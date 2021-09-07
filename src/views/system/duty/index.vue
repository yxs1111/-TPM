<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="authDutyForm" :inline="true" :model="authDutyQuery" class="demo-form-inline">
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="authDutyQuery.name" :clearable="true" placeholder="岗位名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="组织" prop="orgId">
        <div style="width: 200px">
          <treeselect
            v-model="authDutyQuery.orgId"
            :multiple="false"
            :options="allOrg"
            :normalizer="normalizer"
            placeholder="所属组织"
          />
        </div>
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select
          v-model="authDutyQuery.locked"
          clearable
          placeholder="锁定状态"
        >
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="authDutyQuery.dataRange"
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
      ref="authDutyTable"
      v-loading="searchLoading"
      :data="authDutyPageProps.records"
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
      <el-table-column align="center" prop="name" label="岗位名称" />
      <el-table-column align="center" prop="orgName" label="组织名称" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
      <el-table-column class-name="status-col" label="锁定状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.locked | lockedStatusFilter">{{ row.locked | lockedWordFilter }}</el-tag>
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
      :total="authDutyPageProps.total"
      :page-size="authDutyPageProps.pageSize"
      :current-page="authDutyPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[authDutyDialog.state]" :visible.sync="authDutyDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="authDutyDataForm"
        :rules="rules"
        :model="authDutyDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="name" label="岗位名称">
          <el-input v-model="authDutyDialog.data.name" maxlength="50" />
        </el-form-item>
        <el-form-item label="所属组织" prop="orgId">
          <treeselect
            v-model="authDutyDialog.data.orgId"
            :multiple="false"
            :options="allOrg"
            :normalizer="normalizer"
            clear-value-text="清除"
            placeholder=" "
            @input="onInputChange"
          />
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <el-switch
            v-model="authDutyDialog.data.locked"
            active-text="已锁定"
            inactive-text="未锁定"
            :active-value="1"
            :inactive-value="0"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authDutyDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="authDutyDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

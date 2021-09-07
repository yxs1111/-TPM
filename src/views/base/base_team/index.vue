<template>
  <div class="app-container" @keyup.enter="search">
	<!--查询条件-->
    <el-form ref="baseTeamForm" :inline="true" :model="baseTeamQuery" class="demo-form-inline">
      <el-form-item label="班组名称" prop="teamName">
		<el-input v-model="baseTeamQuery.teamName" :clearable="true" placeholder="班组名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="班组类型" prop="teamType">
        <el-select v-model="baseTeamQuery.teamType" placeholder="请选择" clearable>
          <el-option
            v-for="item in teamType"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联组织" prop="organizationId">
		<el-input v-model="baseTeamQuery.organizationId" :clearable="true" placeholder="所属组织ID" />
      </el-form-item>
      <el-form-item label="是否有效" prop="isFlag">
        <el-select v-model="baseTeamQuery.isFlag" placeholder="请选择">
          <el-option
            v-for="item in isFlag"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
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
      <el-button v-permission="permissions['insert']" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="editTeamUser">
        成员管理
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="baseTeamTable"
      v-loading="searchLoading"
      :data="baseTeamPageProps.record"
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
      <el-table-column align="center" prop="teamName" label="班组名称" />
      <el-table-column align="center" prop="teamType" label="班组类型">
        <template slot-scope="{row}">
          <p :type="row.teamType | teamTypeFilter">{{ row.teamType | teamTypeFilter }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="teamShiftId" label="班制" />
      <el-table-column align="center" prop="organizationId" label="所属组织">
        <template slot-scope="{row}">
          <p :type="row.organizationId | orgFilter">{{ row.organizationId | orgFilter }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column align="center" prop="isFlag" label="是否有效">
        <template slot-scope="{row}">
          <el-tag :type="row.isFlag | isFlagFilter">{{ row.isFlag | isFlagFilter }}</el-tag>
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
      :total="baseTeamPageProps.total"
      :page-size="baseTeamPageProps.pageSize"
      :current-page="baseTeamPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[baseTeamDialog.state]" :visible.sync="baseTeamDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="baseTeamDataForm"
        :rules="rules"
        :model="baseTeamDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="teamName" label="班组名称">
          <el-input v-model="baseTeamDialog.data.teamName" maxlength="50" />
        </el-form-item>
        <el-form-item prop="teamType" label="班组类型">
          <el-select v-model="baseTeamDialog.data.teamType" placeholder="请选择" clearable>
            <el-option
              v-for="item in teamType"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="organizationId" label="关联组织">
          <treeselect
            v-model="baseTeamDialog.data.organizationId"
            :disabled="baseTeamDialog.state === 'info'"
            :multiple="false"
            :options="allOrg"
            :normalizer="normalizer"
            clear-value-text="清除"
            placeholder=" "
            @input="onInputChange"
          />
        </el-form-item>
        <el-form-item prop="teamShiftId" label="班制">
          <el-input v-model="baseTeamDialog.data.teamShiftId" />
        </el-form-item>
        <el-form-item prop="isFlag" label="是否有效">
          <el-select v-model="baseTeamDialog.data.isFlag" placeholder="请选择" clearable>
            <el-option
              v-for="item in isFlag"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input type="textarea" v-model="baseTeamDialog.data.remark" maxlength="255" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baseTeamDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="baseTeamDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--组成员管理-->
    <el-dialog v-el-drag-dialog title="班组成员管理" :visible.sync="teamMemberDialog.visible" @dragDialog="handleDrag">
      <div style="text-align: center">
        <el-transfer
          v-model="transferUserProps.value"
          :filterable="true"
          :props="{
            key: 'id',
            label: 'name'
          }"
          :titles="['未加入', '已加入']"
          :data="transferUserProps.data"
          style="text-align: left; display: inline-block"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="teamMemberDialog.visible = false">
          关闭
        </el-button>
        <el-button v-permission="permissions['update']" type="primary" @click="saveTeamUsers">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--删除确认框   -->
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

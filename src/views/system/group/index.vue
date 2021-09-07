<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="groupForm" :inline="true" :model="groupQuery" class="demo-form-inline">
      <el-form-item label="用户组名称" prop="name">
        <el-input v-model="groupQuery.name" placeholder="用户组名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select
          v-model="groupQuery.locked"
          clearable
          placeholder="锁定状态"
        >
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="groupQuery.dataRange"
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
      <el-button v-permission="permissions['get']" :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editGroupMember">
        组成员管理
      </el-button>
      <el-button v-permission="permissions['get']" :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editGroupRole">
        组-角色管理
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="groupTable"
      v-loading="searchLoading"
      :data="groupPageProps.records"
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
      <el-table-column label="用户组名称" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="{row}">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_date" label="创建时间">
        <template slot-scope="{row}">
          <em class="el-icon-time" />
          <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
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
      :total="groupPageProps.total"
      :page-size="groupPageProps.pageSize"
      :current-page="groupPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[groupDialog.state]" :visible.sync="groupDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="groupDataForm"
        :rules="rules"
        :model="groupDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="用户组名称" prop="name">
          <span v-if="groupDialog.state === 'info'">{{ groupDialog.data.name }}</span>
          <el-input
            v-else
            v-model="groupDialog.data.name"
            maxlength="50"
            :clearable="true"
            placeholder="用户组名称"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="用户组编码" prop="code">
          <el-input
            v-if="groupDialog.state === 'create'"
            v-model="groupDialog.data.code"
            maxlength="36"
            :clearable="true"
            placeholder="用户组编码"
            show-word-limit
          />
          <span v-else>{{ groupDialog.data.code }}</span>
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <span v-if="groupDialog.state === 'info'">{{ groupDialog.data.locked | lockedWordFilter }}</span>
          <el-switch
            v-else
            v-model="groupDialog.data.locked"
            active-text="已锁定"
            inactive-text="未锁定"
            :active-value="1"
            :inactive-value="0"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
        </el-form-item>
        <el-form-item v-if="groupDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ groupDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="groupDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(groupDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="groupDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--删除确认框-->
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
    <!--组成员管理-->
    <el-dialog v-el-drag-dialog title="组成员管理" :visible.sync="groupMemberDialog.visible" @dragDialog="handleDrag">
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
        <el-button @click="groupMemberDialog.visible = false">
          关闭
        </el-button>
        <el-button v-permission="permissions['update']" type="primary" @click="saveMembers">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--组-角色管理框-->
    <el-dialog v-el-drag-dialog title="组-角色管理" :visible.sync="groupRoleDialog.visible" @dragDialog="handleDrag">
      <div style="text-align: center">
        <el-transfer
          v-model="transferRoleProps.value"
          :filterable="true"
          :props="{
            key: 'code',
            label: 'name'
          }"
          :titles="['未绑定', '已绑定']"
          :data="transferRoleProps.data"
          style="text-align: left; display: inline-block"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupRoleDialog.visible = false">
          关闭
        </el-button>
        <el-button v-permission="permissions['update']" type="primary" @click="saveRoles">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>

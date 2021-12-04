<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="userInfoForm" :inline="true" :model="userQuery" class="demo-form-inline">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="userQuery.name" placeholder="用户名" maxlength="50" />
      </el-form-item>
      <el-form-item label="过期状态" prop="expireState">
        <el-select
          v-model="userQuery.expireState"
          clearable
          placeholder="过期状态"
        >
          <el-option label="未过期" value="0" />
          <el-option label="已过期" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select
          v-model="userQuery.locked"
          clearable
          placeholder="锁定状态"
        >
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="userQuery.dataRange"
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
        <el-button  type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button  class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="showDeleteDialog">
        删除
      </el-button>
      <el-button  class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
      <el-button  :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editUserRole">
        角色
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="userInfoTable"
      v-loading="searchLoading"
      :data="userPageProps.records"
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="登录名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
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
      <el-table-column align="center" prop="expireAt" label="过期状态">
        <template slot-scope="{row}">
          <el-popover
            placement="top-start"
            title="过期时间"
            width="200"
            trigger="hover"
          >
            <em class="el-icon-time" />
            <span>{{ parseJson(row.expireAt, '{y}-{m}-{d} {h}:{i}') }}</span>
            <el-tag slot="reference" :type="row.expireAt | expireStatusFilter">{{ row.expireAt | expireWordFilter }}</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="锁定状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.locked | lockedStatusFilter">{{ row.locked | lockedWordFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button  type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button  type="success" size="mini" @click="resetPw(row)">
            重置密码
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button  size="mini" type="default" @click="getRowData(row)">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="userPageProps.total"
      :page-size="userPageProps.pageSize"
      :current-page="userPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[userInfoDialog.state]" :visible.sync="userInfoDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="userDataForm"
        :rules="rules"
        :model="userInfoDialog.data"
        label-position="left"
        label-width="90px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="name">
          <span v-if="userInfoDialog.state === 'info'">{{ userInfoDialog.data.name }}</span>
          <el-input v-else v-model="userInfoDialog.data.name" maxlength="50" :clearable="true" placeholder="用户名" show-word-limit />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input
            v-if="userInfoDialog.state === 'create'"
            v-model="userInfoDialog.data.loginName"
            maxlength="50"
            :clearable="true"
            placeholder="登录名"
            show-word-limit
          />
          <span v-else>{{ userInfoDialog.data.loginName }}</span>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <span v-if="userInfoDialog.state === 'info'">{{ userInfoDialog.data.phone }}</span>
          <el-input v-else v-model="userInfoDialog.data.phone" maxlength="20" :clearable="true" placeholder="电话号码" show-word-limit />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-if="userInfoDialog.state !== 'info'" v-model="userInfoDialog.data.gender" :label="0">男</el-radio>
          <el-radio v-if="userInfoDialog.state !== 'info'" v-model="userInfoDialog.data.gender" :label="1">女</el-radio>
          <el-radio v-if="userInfoDialog.state !== 'info'" v-model="userInfoDialog.data.gender" :label="2">其他</el-radio>
          <span v-if="userInfoDialog.state === 'info'">
            <span v-show="userInfoDialog.data.gender === 0">男</span>
            <span v-show="userInfoDialog.data.gender === 1">女</span>
            <span v-show="userInfoDialog.data.gender === 2">其他</span>
          </span>
        </el-form-item>
        <el-form-item label="组织权限" prop="orgId">
          <treeselect
            v-model="userInfoDialog.data.orgId"
            :disabled="userInfoDialog.state === 'info'"
            :multiple="false"
            :options="allOrg"
            :normalizer="normalizer"
            clear-value-text="清除"
            placeholder=" "
            @input="onInputChange"
          />
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <span v-if="userInfoDialog.state === 'info'">{{ userInfoDialog.data.locked | lockedWordFilter }}</span>
          <el-switch
            v-else
            v-model="userInfoDialog.data.locked"
            active-text="已锁定"
            inactive-text="未锁定"
            :active-value="1"
            :inactive-value="0"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireAt">
          <em v-if="userInfoDialog.state === 'info'" class="el-icon-time" />
          <span v-if="userInfoDialog.state === 'info'">{{ parseJson(userInfoDialog.data.expireAt, '{y}-{m}-{d} {h}:{i}') }}</span>
          <el-date-picker v-else v-model="userInfoDialog.data.expireAt" type="datetime" placeholder="请选择过期时间" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item v-if="userInfoDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ userInfoDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="userInfoDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(userInfoDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userInfoDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="userInfoDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

    <!--用户-角色管理框-->
    <el-dialog v-el-drag-dialog title="用户-角色管理" :visible.sync="userRoleDialog.visible" @dragDialog="handleDrag">
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
        <el-button @click="userRoleDialog.visible = false">
          关闭
        </el-button>
        <el-button v-permission="permissions['update']" type="primary" @click="saveRoles">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--  甘特图  -->
    <el-dialog v-el-drag-dialog title="甘特图" :visible.sync="ganttDialog.visible" width="70%" height="500">
      <gantt-elastic
        :options="options"
        :tasks="tasks"
        @tasks-changed="tasksUpdate"
        @options-changed="optionsUpdate"
        @dynamic-style-changed="styleUpdate"
      >
        <gantt-header slot="header"></gantt-header>
      </gantt-elastic>
      <div class="q-mt-md" />
<!--      <q-btn @click="addTask" icon="mdi-plus" label="Add task" />-->
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>
<style scoped>
  .danger {
    color: #F56C6C
  }
  .info {
    font-size: 16px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>


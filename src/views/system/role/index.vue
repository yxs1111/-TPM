<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="roleForm" :inline="true" :model="roleQuery" class="demo-form-inline">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleQuery.name" placeholder="角色名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select
          v-model="roleQuery.locked"
          clearable
          placeholder="锁定状态"
        >
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="roleQuery.dataRange"
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
      <el-button v-permission="permissions['get']" :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="showPermission">
        权限绑定
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="roleTable"
      v-loading="searchLoading"
      :data="rolePageProps.records"
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
      <el-table-column label="角色名称" align="center">
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
      :total="rolePageProps.total"
      :page-size="rolePageProps.pageSize"
      :current-page="rolePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[roleDialog.state]" :visible.sync="roleDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="roleDataForm"
        :rules="rules"
        :model="roleDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="name">
          <span v-if="roleDialog.state === 'info'">{{ roleDialog.data.name }}</span>
          <el-input v-else v-model="roleDialog.data.name" maxlength="50" :clearable="true" placeholder="角色名称" show-word-limit />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-if="roleDialog.state === 'create'" v-model="roleDialog.data.code" maxlength="36" :clearable="true" placeholder="角色编码" show-word-limit />
          <span v-else>{{ roleDialog.data.code }}</span>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="roleDialog.data.type" placeholder="请选择角色类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sorting">
          <el-input-number v-model="roleDialog.data.sorting" :min="0" :max="999999" :clearable="true" />
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <span v-if="roleDialog.state === 'info'">{{ roleDialog.data.locked | lockedWordFilter }}</span>
          <el-switch
            v-else
            v-model="roleDialog.data.locked"
            active-text="已锁定"
            inactive-text="未锁定"
            :active-value="1"
            :inactive-value="0"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
        </el-form-item>
        <el-form-item v-if="roleDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ roleDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="roleDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(roleDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="roleDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else v-permission="permissions['update']" type="primary" :loading="saveLoading" @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--关闭提示框-->
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
    <!--权限绑定框-->
    <el-dialog v-el-drag-dialog title="权限绑定" :visible.sync="rolePermissionDialog.visible" top="3vh" width="70%" @dragDialog="handleDrag">
      <el-row style="margin-left: 20px; padding-bottom: 0; padding-top: 0;">
        <el-col :span="10">
          <!--查询条件-->
          <el-form ref="menuForm" :inline="true" :model="menuQuery" class="demo-form-inline">
            <el-form-item style="margin-bottom: 5px;">
              <el-select
                v-model="menuQuery.currentOsCode"
                filterable
                placeholder="所属系统"
                @change="fetchMenuData"
              >
                <el-option
                  v-for="item in osSelectOption"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="fetchMenuData">刷新</el-button>
            </el-form-item>
          </el-form>
          <!--搜索框-->
          <el-input
            v-model="filterText"
            placeholder="输入菜单名称进行过滤"
            clearable
            maxlength="50"
            style="width: 90%"
          />
          <!--菜单树-->
          <el-tree
            ref="menuTree"
            class="filter-tree"
            :data="treeProps.data"
            :props="defaultProps"
            :current-node-key="currentNodeKey"
            :filter-node-method="filterNode"
            accordion
            node-key="code"
            highlight-current
            :expand-on-click-node="true"
            :default-expanded-keys="['root']"
            @current-change="handleCurrentNodeChange"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <span class="info">
                  {{ node.label }}
                </span>
                <span v-if="data.locked === 1" class="danger">
                  （已锁定）
                </span>
              </span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="13">
          <!--查询条件-->
          <el-form ref="perForm" :inline="true" :model="perQuery" :disabled="perSearch" class="demo-form-inline">
            <el-form-item style="margin-bottom: 5px;">
              <el-input
                v-model="filterTableText"
                placeholder="输入名称或编码过滤"
                clearable
                maxlength="50"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-checkbox v-model="showCheckedOnly">只看已绑定</el-checkbox>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button v-permission="permissions['get']" type="primary" :loading="searchLoading" @click="clickToSearchPer">搜索</el-button>
            </el-form-item>
            <el-form-item style="margin-bottom: 5px;">
              <el-button v-permission="permissions['update']" type="primary" @click="bindPermission">绑定权限</el-button>
            </el-form-item>
          </el-form>
          <!--查询结果-->
          <el-table
            ref="perTable"
            v-loading="searchLoading"
            :data="filterPerPage()"
            element-loading-text="正在查询"
            border
            fit
            stripe
            height="490"
            highlight-current-row
            size="mini"
            :row-class-name="perTableRowClassName"
            @row-click="handleCurrentPerRowClick"
            @selection-change="handlePerSelectionChange"
          >
            <el-table-column
              align="center"
              type="selection"
              width="55"
            />
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column ref="perColumn" label="权限名称" align="center">
              <template slot-scope="{row}">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column label="权限编码" align="center">
              <template slot-scope="{row}">
                {{ row.code }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="rolePermissionDialog.visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>
<style scoped>
  .treeWrap{
    float: left;
    width: 40%;
  }
  .tableWrap {
    float: right;
    width: 55%;
  }
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
  .el-table .hide-row {
    display: none;
  }
</style>

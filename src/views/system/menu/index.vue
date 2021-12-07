<template>
  <div class="app-container">
    <div class="treeWrap">
      <!--查询条件-->
      <el-form ref="menuForm" :inline="true" :model="menuQuery" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="menuQuery.currentOsCode"
            filterable
            placeholder="所属系统"
            @change="fetchData"
          >
            <el-option
              v-for="item in osSelectOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" icon="el-icon-search" :loading="searchLoading" @click="fetchData">刷新</el-button>
        </el-form-item>
      </el-form>
      <!--搜索框-->
      <el-input
        v-model="filterText"
        placeholder="输入菜单名称进行过滤"
        clearable
      />
      <!--菜单树 属性：draggable，拖拽排序待后期完善-->
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
        @node-click="handleNodeClick"
        @current-change="handleCurrentChange"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <span class="info">
              {{ node.label }}
            </span>
            <span v-if="data.locked === 1" class="danger">
              （已锁定）
            </span>
            <span
              v-if="data.isNew && data.isNew === 1"
              class="danger"
            >*</span>
          </span>
          <span v-if="currentNodeKey === data.code">
            <el-button
              v-if="!(data.isNew && data.isNew === 1) && node.level < 4"
              type="text"
              size="mini"
              @click="() => append(node,data)"
            >
              添加子菜单
            </el-button>
            <el-button
              v-if="data.code !== 'root'"
              type="text"
              size="mini"
              class="danger"
              @click="() => handleRemove(node, data)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <!--编辑窗口-->
    <div v-show="editVisible" class="tableWrap">
      <el-collapse
        v-model="activeName"
        accordion
        @change="handleCollapseChange"
      >
        <el-collapse-item title="菜单信息" name="menuInfo">
          <el-form
            ref="menuInfoForm"
            size="small"
            :rules="rules"
            :model="menuInfoProps"
            label-width="150px"
            border
          >
            <el-form-item label="父级编码" prop="parentCode">
              <el-input
                v-if="editState === 'update'"
                v-model="menuInfoProps.parentCode"
                maxlength="50"
                placeholder="父级编码"
                show-word-limit
              />
              <span v-else>{{ menuInfoProps.parentCode }}</span>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuInfoProps.name" maxlength="100" :clearable="true" placeholder="菜单名称" show-word-limit />
            </el-form-item>
            <el-form-item label="菜单编码" prop="code">
              <el-input
                v-if="editState === 'create'"
                v-model="menuInfoProps.code"
                maxlength="50"
                :clearable="true"
                placeholder="菜单编码"
                show-word-limit
              />
              <span v-else>{{ menuInfoProps.code }}</span>
            </el-form-item>
            <el-form-item label="后台url" prop="url">
              <el-input v-model="menuInfoProps.url" maxlength="200" :clearable="true" placeholder="url" show-word-limit />
            </el-form-item>
            <el-form-item label="前台router" prop="router">
              <el-input v-model="menuInfoProps.router" maxlength="200" :clearable="true" placeholder="router" show-word-limit />
            </el-form-item>
            <el-form-item label="排序" prop="sorting">
              <el-input-number v-model="menuInfoProps.sorting" :min="0" :max="999999" :clearable="true" />
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input
                v-model="menuInfoProps.remark"
                type="textarea"
                maxlength="120"
                show-word-limit
                :clearable="true"
                placeholder="描述"
              />
            </el-form-item>
            <el-form-item label="锁定状态" prop="locked">
              <el-switch
                v-model="menuInfoProps.locked"
                active-text="已锁定"
                inactive-text="未锁定"
                :active-value="1"
                :inactive-value="0"
                active-color="#ff4949"
                inactive-color="#13ce66"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="editVisible=false">关闭</el-button>
              <el-button
              
                :type="editState === 'update' ? 'primary' : 'success'"
                :loading="saveLoading"
                @click="saveOrUpdate"
              >
                {{ textMap[editState] }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item v-show="perVisible" title="权限信息" name="permissionInfo">
          <!--查询条件-->
          <el-form ref="perForm" :inline="true" :model="perQuery" class="demo-form-inline">
            <el-form-item prop="input">
              <el-input
                v-model="perQuery.input"
                placeholder="请输入"
                maxlength="50"
                clearable
                @keyup.enter.native="searchPer"
              >
                <el-select slot="prepend" v-model="perQuery.select" placeholder="请选择" style="width: 75px;">
                  <el-option label="名称" value="name" />
                  <el-option label="编码" value="code" />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button  type="primary" icon="el-icon-search" :loading="searchLoading" @click="searchPer">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toPermissionPage">编辑权限</el-button>
            </el-form-item>
          </el-form>
          <!--查询结果-->
          <el-table
            ref="perTable"
            v-loading="searchLoading"
            :data="perPageProps.records"
            element-loading-text="正在查询"
            border
            fit
            stripe
            height="490"
            highlight-current-row
            size="mini"
            @row-click="handleCurrentRowClick"
          >
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="权限名称" align="center">
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
          <!--分页-->
          <el-pagination
            background
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="perPageProps.total"
            :page-size="perPageProps.pageSize"
            :current-page="perPageProps.pageNum"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--删除提示框-->
    <el-dialog
      v-el-drag-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      @dragDialog="handleDrag"
    >
      <span>{{ removeWarn }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="remove">确 定</el-button>
      </span>
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
</style>

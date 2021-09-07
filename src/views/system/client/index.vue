<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="clientForm" :inline="true" :model="clientQuery" class="demo-form-inline">
      <el-form-item label="客户端ID" prop="clientId">
        <el-input v-model="clientQuery.clientId" placeholder="客户端ID" maxlength="50" />
      </el-form-item>
      <el-form-item label="客户端名称" prop="clientName">
        <el-input v-model="clientQuery.clientName" placeholder="客户端名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="锁定状态" prop="locked">
        <el-select
          v-model="clientQuery.locked"
          clearable
          placeholder="锁定状态"
        >
          <el-option label="未锁定" value="0" />
          <el-option label="已锁定" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="clientQuery.dataRange"
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
      ref="clientTable"
      v-loading="searchLoading"
      :data="clientPageProps.records"
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
      <el-table-column label="客户端ID" align="center">
        <template slot-scope="{row}">
          {{ row.clientId }}
        </template>
      </el-table-column>
      <el-table-column label="客户端名称" align="center">
        <template slot-scope="{row}">
          {{ row.clientName }}
        </template>
      </el-table-column>
      <el-table-column label="授权类型" align="center">
        <template slot-scope="{row}">
          {{ row.authorizedGrantTypes }}
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
      :total="clientPageProps.total"
      :page-size="clientPageProps.pageSize"
      :current-page="clientPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[clientDialog.state]" :visible.sync="clientDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="clientDataForm"
        :rules="rules"
        :model="clientDialog.data"
        label-position="left"
        label-width="160px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="客户端ID" prop="clientId">
          <el-input
            v-if="clientDialog.state === 'create'"
            v-model="clientDialog.data.clientId"
            maxlength="256"
            :clearable="true"
            placeholder="客户端ID"
            show-word-limit
          />
          <span v-else>{{ clientDialog.data.clientId }}</span>
        </el-form-item>
        <el-form-item label="客户端名称" prop="clientName">
          <span v-if="clientDialog.state === 'info'">{{ clientDialog.data.clientName }}</span>
          <el-input v-else v-model="clientDialog.data.clientName" maxlength="256" :clearable="true" placeholder="客户端名称" show-word-limit />
        </el-form-item>
        <el-form-item label="授权类型" prop="authorizedGrantTypesArr">
          <span v-if="clientDialog.state === 'info'">{{ clientDialog.data.authorizedGrantTypes }}</span>
          <el-checkbox-group
            v-else
            v-model="clientDialog.data.authorizedGrantTypesArr"
          >
            <el-checkbox
              v-for="item in grantTypeSelectOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
              border
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="clientDialog.state === 'create'" label="客户端密码" prop="clientSecret">
          <el-input
            v-model="clientDialog.data.clientSecret"
            maxlength="50"
            :clearable="true"
            show-password
            placeholder="客户端密码"
          />
        </el-form-item>
        <el-form-item label="token有效期" prop="accessTokenValidity">
          <span v-if="clientDialog.state === 'info'">{{ clientDialog.data.accessTokenValidity }}</span>
          <el-input-number v-else v-model="clientDialog.data.accessTokenValidity" :min="60" :max="2592000" :clearable="true" />
        </el-form-item>
        <el-form-item label="refresh_token有效期" prop="refreshTokenValidity">
          <span v-if="clientDialog.state === 'info'">{{ clientDialog.data.refreshTokenValidity }}</span>
          <el-input-number v-else v-model="clientDialog.data.refreshTokenValidity" :min="60" :max="2592000" :clearable="true" />
        </el-form-item>
        <el-form-item label="锁定状态" prop="locked">
          <span v-if="clientDialog.state === 'info'">{{ clientDialog.data.locked | lockedWordFilter }}</span>
          <el-switch
            v-else
            v-model="clientDialog.data.locked"
            active-text="已锁定"
            inactive-text="未锁定"
            :active-value="1"
            :inactive-value="0"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
        </el-form-item>
        <el-form-item v-if="clientDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ clientDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="clientDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(clientDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clientDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="clientDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

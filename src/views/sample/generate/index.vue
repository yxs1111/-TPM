<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="datasourceForm" :inline="true" :model="datasourceQuery" class="demo-form-inline">
      <el-form-item label="数据库名称" prop="dbName">
        <el-input v-model="datasourceQuery.dbName" :clearable="true" placeholder="数据库名称" maxlength="64" />
      </el-form-item>
      <el-form-item label="数据库host" prop="host">
        <el-input v-model="datasourceQuery.host" :clearable="true" placeholder="数据库host" maxlength="64" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="datasourceQuery.dataRange"
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
        <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="showDeleteDialog">
        删除
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="newRowData">
        新增
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="datasourceTable"
      v-loading="searchLoading"
      :data="datasourcePageProps.records"
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
      <el-table-column class-name="status-col" label="数据库类型" align="center" prop="dbType">
        <template slot-scope="{row}">
          {{ row.dbType | dbTypeWordFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="dbName" label="数据库名称" />
      <el-table-column align="center" prop="host" label="数据库host" />
      <el-table-column align="center" prop="port" label="数据库端口" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <em class="el-icon-time" />
          <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="showCodeDialog(row)">
            生成代码
          </el-button>
          <el-button type="primary" size="mini" @click="editRowData(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
          <el-button size="mini" type="default" @click="getRowData(row)">
            {{ $t('table.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="datasourcePageProps.total"
      :page-size="datasourcePageProps.pageSize"
      :current-page="datasourcePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[datasourceDialog.state]" :visible.sync="datasourceDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="datasourceDataForm"
        :rules="rules"
        :model="datasourceDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="dbType" label="数据库类型">
          <el-select
            v-model="datasourceDialog.data.dbType"
            filterable
            default-first-option
          >
            <el-option
              v-for="item in dbTypeConfig"
              :key="item.dbType"
              :label="item.label"
              :value="item.dbType"
            />
          </el-select>
          <el-button type="success" :loading="testLoading" @click="onDatasourceTest">测试连接</el-button>
        </el-form-item>
        <el-form-item prop="host" label="数据库host">
          <el-input v-model="datasourceDialog.data.host" maxlength="64" />
        </el-form-item>
        <el-form-item prop="port" label="数据库端口">
          <el-input v-model="datasourceDialog.data.port" />
        </el-form-item>
        <el-form-item prop="dbName" label="数据库名称">
          <el-input v-model="datasourceDialog.data.dbName" maxlength="64" />
        </el-form-item>
        <el-form-item prop="username" label="数据库用户名">
          <el-input v-model="datasourceDialog.data.username" maxlength="64" />
        </el-form-item>
        <el-form-item prop="password" label="数据库密码">
          <el-input v-model="datasourceDialog.data.password" maxlength="64" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="datasourceDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="datasourceDialog.state==='info'" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else type="primary" :loading="saveLoading" @click="saveOrUpdate">
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
    <!--代码生成框-->
    <el-dialog v-el-drag-dialog :visible.sync="codeDialog.visible" top="3vh" width="70%" @dragDialog="handleDrag">
      <el-row :gutter="20" style="padding-bottom: 0; padding-top: 0;">
        <el-col :span="12">
          <h4>选择表</h4>
          <el-input
            v-model="tableSearch"
            prefix-icon="el-icon-search"
            clearable
            size="mini"
            placeholder="过滤表"
            style="margin-bottom: 10px;width: 100%;"
          />
          <el-table
            ref="tableSearchTable"
            v-loading="tableLoading"
            :data="tableListData"
            element-loading-text="正在查询"
            border
            fit
            stripe
            height="600"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @row-click="handleTableRowClick"
            @selection-change="onTableListSelect"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="tableName"
              label="表名"
            />
          </el-table>
        </el-col>
        <el-col :span="12">
          <h4>选择模板</h4>
          <el-input
            v-model="templateSearch"
            prefix-icon="el-icon-search"
            clearable
            size="mini"
            placeholder="过滤模板"
            style="margin-bottom: 10px;width: 100%;"
          />
          <el-table
            ref="templateSearchTable"
            v-loading="templateLoading"
            :data="templateListData"
            element-loading-text="正在查询"
            border
            fit
            stripe
            height="560"
            highlight-current-row
            :row-class-name="templateRowClassName"
            @row-click="handleTemplateRowClick"
            @selection-change="onTemplateListSelect"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="模板名称"
            />
          </el-table>
          包名（package）<el-input v-model="clientParam.packageName" required placeholder="cn.jbinfo.imt.base" show-word-limit maxlength="100" style="width: 80%" />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="codeDialog.visible = false">
          关闭
        </el-button>
        <el-button v-loading="generateLoading" type="success" @click="onGenerate">生成代码</el-button>
      </div>
    </el-dialog>
    <!--代码生成结果框-->
    <el-dialog v-el-drag-dialog :visible.sync="codeResultDialog.visible" top="3vh" width="70%" @dragDialog="handleDrag">
      <div style="padding-bottom: 0; padding-top: 0;">
        <el-container>
          <el-aside style="height: 700px;">
            <el-button
              icon="el-icon-download"
              type="text"
              @click="downloadAll"
            >下载全部</el-button>
            <el-input
              v-show="treeData.length > 0"
              v-model="filterText"
              prefix-icon="el-icon-search"
              placeholder="搜索"
              size="mini"
              clearable
              style="margin-bottom: 10px;"
            />
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              node-key="id"
              default-expand-all
              highlight-current
              @current-change="onTreeSelect"
            />
          </el-aside>
          <el-main v-show="fileInfo.content.length > 0">
            <el-button
              type="text"
              icon="el-icon-document-copy"
              :data-clipboard-text="fileInfo.content"
              class="copyBtn"
            >
              复制代码
            </el-button>
            <el-button
              icon="el-icon-download"
              type="text"
              @click="downloadText(fileInfo.fileName, fileInfo.content)"
            >
              下载当前文件
            </el-button>
            <codemirror
              v-model="fileInfo.content"
              :options="cmOptions"
            />
          </el-main>
        </el-container>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="codeResultDialog.visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-table .hidden-row {
  display: none;
}
.cm-s-neat {
  height: 600px;
}
</style>

<script src="./index.js">

</script>

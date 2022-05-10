<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="genTemplateForm" :inline="true" :model="templateQuery" class="demo-form-inline">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="templateQuery.name" :clearable="true" placeholder="模板名称" maxlength="64" />
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="templateQuery.dataRange"
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
      ref="genTemplateTable"
      v-loading="searchLoading"
      :data="templatePageProps.records"
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
      <el-table-column align="center" prop="name" label="模板名称" />
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <em class="el-icon-time" />
          <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateBy" label="修改人" />
      <el-table-column align="center" prop="updateDate" label="修改时间">
        <template slot-scope="{row}">
          <span>{{ parseJson(row.updateDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="version" label="版本" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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
      :total="templatePageProps.total"
      :page-size="templatePageProps.pageSize"
      :current-page="templatePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[templateDialog.state]" :visible.sync="templateDialog.visible" top="3vh" width="90%" @dragDialog="handleDrag">
      <el-row :gutter="20" style="padding-bottom: 0; padding-top: 0;">
        <el-col :span="16">
          <el-form
            ref="genTemplateDataForm"
            :rules="rules"
            :model="templateDialog.data"
            label-position="left"
            label-width="120px"
            style="margin-left:50px;"
          >
            <el-form-item prop="name" label="模板名称">
              <el-input v-model="templateDialog.data.name" maxlength="64" />
            </el-form-item>
            <el-form-item prop="fileName" label="文件名称">
              <el-input v-model="templateDialog.data.fileName" maxlength="128" />
            </el-form-item>
            <el-form-item prop="content" label="内容">
              <el-link type="primary" :underline="false" href="https://www.cnblogs.com/codingsilence/archive/2011/03/29/2146580.html" target="_blank">Velocity语法</el-link>
              <codemirror
                ref="editor"
                v-model="templateDialog.data.content"
                :options="cmOptions"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <h3>Velocity变量</h3>
          <p class="velocity-tip">
            点击变量直接插入
          </p>
          <div v-for="item in treeData" :key="item.expression" class="velocity-var">
            <div v-if="!item.children">
              <ul>
                <a @click="onExpressionClick(item.expression)">{{ item.expression }}</a>：{{ item.text }}
              </ul>
            </div>
            <div v-else>
              <h4>{{ item.expression }}</h4>
              <ul v-for="child in item.children" :key="child.expression">
                <a @click="onExpressionClick(child.expression)">{{ child.expression }}</a>：{{ child.text }}
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="templateDialog.state==='info'" type="primary" @click="changeToEdit">
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
  </div>
</template>

<style scoped>
.cm-s-neat {
  height: 800px;
}
.el-form-item--mini .el-form-item__content,
.el-form-item--mini .el-form-item__label,
.el-form-item__content {
  line-height: 20px;
}
.velocity-tip {
  color: #606266;
  font-size: 13px;
}
.velocity-var {}
.velocity-var li {
  font-size: 14px;
  color: #606266;
  line-height: 26px;
}
.velocity-var a {
  color: #409EFF;
  font-weight: 500;
}
.velocity-var a:hover {
  color: rgba(64, 158, 255, 0.75);
}
</style>
<script src="./index.js">

</script>

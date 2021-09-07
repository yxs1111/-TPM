<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="pConTrackForm" :inline="true" :model="pConTrackQuery" class="demo-form-inline">
      <el-form-item label="股道名称" prop="trackName">
        <el-input v-model="pConTrackQuery.trackName" :clearable="true" placeholder="股道名称"/>
      </el-form-item>
      <el-form-item label="所在场段" prop="parentFactory">
        <el-select v-model="pConTrackQuery.parentFactory" placeholder="请选择">
          <el-option
            v-for="item in parentFactoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="轨道带电" prop="thirdRailFlag">
        <el-select v-model="pConTrackQuery.thirdRailFlag" placeholder="请选择" >
          <el-option
            v-for="item in thirdRailFlagOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有效" prop="isFlag">
        <el-select v-model="pConTrackQuery.isFlag" placeholder="请选择">
          <el-option
            v-for="item in isFlagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="permissions['get']"
          type="primary"
          icon="el-icon-search"
          :loading="searchLoading"
          @click="search">搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button
        v-permission="permissions['delete']"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="showDeleteDialog">
        删除
      </el-button>
      <el-button
        v-permission="permissions['insert']"
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="newRowData">
        新增
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="pConTrackTable"
      v-loading="searchLoading"
      :data="pConTrackPageProps.record"
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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="trackName" label="股道名称"/>
      <el-table-column align="center" prop="isDecon" label="解编股道"   :formatter="formatter2"/>
      <el-table-column align="center" prop="thirdRailFlag" label="轨道带电"
                       :formatter="formatter"/>
      <el-table-column align="center" prop="remark" label="备注"/>
      <el-table-column align="center" prop="isFlag" label="是否有效" :formatter="formatter3"/>
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
      :total="pConTrackPageProps.total"
      :page-size="pConTrackPageProps.pageSize"
      :current-page="pConTrackPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog
      v-el-drag-dialog
      :title="textMap[pConTrackDialog.state]"
      :visible.sync="pConTrackDialog.visible"
      @dragDialog="handleDrag">
      <el-form
        ref="pConTrackDataForm"
        :rules="rules"
        :model="pConTrackDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="trackCode" label="股道编码">
            <el-input v-model="pConTrackDialog.data.trackCode" maxlength="36"/>
        </el-form-item>
        <el-form-item prop="trackName" label="股道名称">
          <el-input v-model="pConTrackDialog.data.trackName" maxlength="36"/>
        </el-form-item>
        <el-form-item prop="parentFactory" label="车辆段">
          <el-input v-model="pConTrackDialog.data.parentFactory" maxlength="36"/>
        </el-form-item>
        <el-form-item prop="thirdRailFlag" label="轨道带电">
          <el-select v-model="pConTrackDialog.data.thirdRailFlag" placeholder="请选择">
            <el-option
              v-for="item in thirdRailFlagOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isFlag" label="是否有效">
          <el-select v-model="pConTrackDialog.data.isFlag" placeholder="请选择">
            <el-option
              v-for="item in isFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isDecon" label="解编轨道">
          <el-select v-model="pConTrackDialog.data.isDecon" placeholder="请选择">
            <el-option
              v-for="item in isDeconOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="pConTrackDialog.data.remark" maxlength="200"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="pConTrackDialog.visible = false">
          关闭
        </el-button>
        <el-button
          v-if="pConTrackDialog.state==='info'"
          v-permission="permissions['update']"
          type="primary"
          @click="changeToEdit">
          编辑
        </el-button>
        <el-button
          v-else
          v-permission="permissions['update']"
          type="primary"
          :loading="saveLoading"
          @click="saveOrUpdate">
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
        <el-button
          v-if="multipleSelection && multipleSelection.length>0"
          type="primary"
          @click="handleDeleteRows">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="./index.js">
</script>

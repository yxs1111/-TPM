<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="pConShiftForm" :inline="true" :model="pConShiftQuery" class="demo-form-inline">
      <el-form-item label="班次编码" prop="shiftCode">
        <el-input v-model="pConShiftQuery.shiftCode" :clearable="true" placeholder="班次编码" maxlength="50"/>
      </el-form-item>
      <el-form-item label="班次名称" prop="shiftName">
        <el-input v-model="pConShiftQuery.shiftName" :clearable="true" placeholder="班次名称" maxlength="50"/>
      </el-form-item>
      <el-form-item label="是否有效" prop="isFlag">
        <el-select v-model="pConShiftQuery.isFlag" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班组类型" prop="groupType">
        <el-input v-model="pConShiftQuery.groupType" :clearable="true" placeholder="班组类型" maxlength="50"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-time-picker
          v-model="pConShiftQuery.startTime"
          type="timerange"
          format="HH:mm"
          value-format="HH:mm">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-time-picker
          v-model="pConShiftQuery.endTime"
          type="timerange"
          format="HH:mm"
          value-format="HH:mm">
        </el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索
        </el-button>
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
      ref="pConShiftTable"
      v-loading="searchLoading"
      :data="pConShiftPageProps.record"
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
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shiftCode" label="班次编码"/>
      <el-table-column align="center" prop="shiftName" label="班次名称"/>
      <el-table-column align="center" prop="startTime" label="开始时间"/>
      <el-table-column align="center" prop="endTime" label="结束时间"/>
      <el-table-column align="center" label="是否有效">
        <template slot-scope="{row}">
          <el-tag :type="row.isFlag | lockedStatusFilter">{{ row.isFlag | isFlagFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createBy" label="创建人"/>
      <el-table-column align="center" prop="createDate" label="创建时间"/>
      <el-table-column align="center" prop="updateBy" label="修改人"/>
      <el-table-column align="center" prop="updateDate" label="修改时间"/>
      <el-table-column align="center" prop="groupType" label="班组类型"/>
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
      :total="pConShiftPageProps.total"
      :page-size="pConShiftPageProps.pageSize"
      :current-page="pConShiftPageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[pConShiftDialog.state]" :visible.sync="pConShiftDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="pConShiftDataForm"
        :rules="rules"
        :model="pConShiftDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="shiftName" label="班次名称">
          <el-input v-model="pConShiftDialog.data.shiftName" maxlength="50"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            v-model="pConShiftDialog.data.startTime"
            type="timerange"
            format="HH:mm"
            value-format="HH:mm">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            v-model="pConShiftDialog.data.endTime"
            type="timerange"
            format="HH:mm"
            value-format="HH:mm">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="是否有效" prop="isFlag">
          <span v-if="pConShiftDialog.state === 'info'">{{ pConShiftDialog.data.isFlag | isFlagFilter }}</span>
          <el-select v-else v-model="pConShiftDialog.data.isFlag" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in isFlagOptions"
              :key="item.key"
              :label="item.text"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="groupType" label="班组类型">
          <el-input v-model="pConShiftDialog.data.groupType" maxlength="50"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pConShiftDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="pConShiftDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

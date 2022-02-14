<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="permissionForm" :inline="true" :model="permissionQuery" class="demo-form-inline">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="permissionQuery.name" placeholder="权限名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input v-model="permissionQuery.code" placeholder="权限编码" maxlength="50" />
      </el-form-item>
      <el-form-item label="所属系统" prop="osCode">
        <el-select v-model="permissionQuery.osCode" filterable clearable placeholder="所属系统" @change="handleOsChange">
          <el-option v-for="item in osSelectOption" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属菜单" prop="menuCode">
        <el-select ref="menuCode" v-model="permissionQuery.menuCode" filterable clearable placeholder="所属菜单">
          <el-option v-for="item in menuSelectOption" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker v-model="permissionQuery.dataRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd" :default-time="['00:00:00','23:59:59']" @change="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="TpmButtonBG"  @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset" class="TpmButtonBG">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG"  icon="el-icon-delete" @click="showDeleteDialog">删除</el-button>
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="newRowData">新增</el-button>
    </div>
    <!--查询结果-->
    <el-table ref="permissionTable"  :header-cell-style="HeadTable" :row-class-name="tableRowClassName"  :data="permissionPageProps.records"  border fit  :max-height="maxheight" highlight-current-row
      @row-click="handleCurrentRowClick" @row-dblclick="handleCurrentRowDblClick" @selection-change="handleSelectionChange">
      <el-table-column align="center" fixed="left" type="selection" width="55" />
      <el-table-column align="center" fixed="left" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="权限名称" align="center" width="250">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="权限编码" align="center" width="280">
        <template slot-scope="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <el-table-column label="所属系统" align="center" width="100">
        <template slot-scope="{row}">
          {{ row.osName }}
        </template>
      </el-table-column>
      <el-table-column label="所属菜单" align="center" width="180">
        <template slot-scope="{row}">
          {{ row.menuName }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="250">
        <template slot-scope="{row}">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_date" label="创建时间" width="250">
        <template slot-scope="{row}">
          <em class="el-icon-time" />
          <span>{{ parseJson(row.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
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
    <div class="TpmPaginationWrap">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="permissionPageProps.total" :page-size="permissionPageProps.pageSize"
        :current-page="permissionPageProps.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[permissionDialog.state]" :visible.sync="permissionDialog.visible" @dragDialog="handleDrag">
      <el-form ref="permissionDataForm" :rules="rules" :model="permissionDialog.data" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
        <el-form-item label="权限名称" prop="name">
          <span v-if="permissionDialog.state === 'info'">{{ permissionDialog.data.name }}</span>
          <el-input v-else v-model="permissionDialog.data.name" maxlength="50" :clearable="true" placeholder="权限名称" show-word-limit />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-if="permissionDialog.state === 'create'" v-model="permissionDialog.data.code" maxlength="50" :clearable="true" placeholder="权限编码" show-word-limit />
          <span v-else>{{ permissionDialog.data.code }}</span>
        </el-form-item>
        <el-form-item label="所属系统" prop="osCode">
          <span v-if="permissionDialog.state === 'info'">{{ permissionDialog.data.osName }}</span>
          <el-select v-else v-model="permissionDialog.data.osCode" filterable clearable placeholder="所属系统" @change="handleOsChange">
            <el-option v-for="item in osSelectOption" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单" prop="menuCode">
          <span v-if="permissionDialog.state === 'info'">{{ permissionDialog.data.menuName }}</span>
          <el-select v-else v-model="permissionDialog.data.menuCode" filterable clearable placeholder="所属菜单">
            <el-option v-for="item in menuSelectOption" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="位移值" prop="bitDigit">
          <el-input-number v-if="permissionDialog.state === 'create'" v-model="permissionDialog.data.bitDigit" :min="0" :max="25" :clearable="true" />
          <span v-else>{{ permissionDialog.data.bitDigit }}</span>
        </el-form-item>
        <el-form-item v-if="permissionDialog.state !== 'create'" label="创建人" prop="createBy">
          <span>{{ permissionDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item v-if="permissionDialog.state !== 'create'" label="创建时间" prop="createDate">
          <em class="el-icon-time" />
          <span>{{ parseJson(permissionDialog.data.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="permissionDialog.state==='info'" type="primary" @click="changeToEdit">
          编辑
        </el-button>
        <el-button v-else type="primary"  @click="saveOrUpdate">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
    <!--关闭提示框-->
    <el-dialog v-el-drag-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center @dragDialog="handleDrag">
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

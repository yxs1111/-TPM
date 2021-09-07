<template>
  <div class="app-container" @keyup.enter="search">
    <!--查询条件-->
    <el-form ref="openInterfaceForm" :inline="true" :model="openInterfaceQuery" class="demo-form-inline">
      <el-form-item label="所属服务" prop="resourceId">
        <el-select
          ref="resourceId"
          v-model="openInterfaceQuery.resourceId"
          filterable
          clearable
          placeholder="所属服务"
        >
          <el-option
            v-for="item in resourceServerSelection"
            :key="item.id"
            :label="item.description+'('+item.routeId+')'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接口名" prop="interfaceName">
        <el-input v-model="openInterfaceQuery.interfaceName" :clearable="true" placeholder="接口名" maxlength="256" />
      </el-form-item>
      <el-form-item label="接口地址" prop="interfacePath">
        <el-input v-model="openInterfaceQuery.interfacePath" :clearable="true" placeholder="接口地址" maxlength="256" />
      </el-form-item>
      <el-form-item label="接口说明" prop="interfaceDesc">
        <el-input v-model="openInterfaceQuery.interfaceDesc" :clearable="true" placeholder="接口说明" maxlength="256" />
      </el-form-item>
      <el-form-item label="接口类型" prop="interfaceType">
        <el-select
          v-model="openInterfaceQuery.interfaceType"
          clearable
          placeholder="接口类型"
        >
          <el-option label="通用接口" value="0" />
          <el-option label="授权接口" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="dataRange">
        <el-date-picker
          v-model="openInterfaceQuery.dataRange"
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
      <el-button v-permission="permissions['get']" :disabled="editDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editClientOpenInterface">
        分配
      </el-button>
      <el-button v-permission="permissions['get']"  class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="thirdPartyStatus">
        test
      </el-button>
    </div>
    <!--查询结果-->
    <el-table
      ref="openInterfaceTable"
      v-loading="searchLoading"
      :data="openInterfacePageProps.record"
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
      <el-table-column align="center" prop="resourceId" label="所属服务" >
        <template slot-scope="{row}">
          <span>{{ row.resourceId | resourceNameWordFilter(resourceServerSelection) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="interfaceName" label="接口名" />
      <el-table-column align="center" prop="interfacePath" label="接口地址" />
      <el-table-column align="center" prop="interfaceDesc" label="接口说明" />
      <el-table-column align="center" prop="interfaceType" label="接口类型" >
        <template slot-scope="{row}">
          <span>{{ row.interfaceType | interfaceTypeWordFilter }}</span>
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
      :total="openInterfacePageProps.total"
      :page-size="openInterfacePageProps.pageSize"
      :current-page="openInterfacePageProps.pageNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--信息框-->
    <el-dialog v-el-drag-dialog :title="textMap[openInterfaceDialog.state]" :visible.sync="openInterfaceDialog.visible" @dragDialog="handleDrag">
      <el-form
        ref="openInterfaceDataForm"
        :rules="rules"
        :model="openInterfaceDialog.data"
        label-position="left"
        label-width="120px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item prop="resourceId" label="所属服务">
          <span v-if="openInterfaceDialog.state === 'info'">{{ openInterfaceDialog.data.resourceName }}</span>
          <el-select
            v-else
            ref="resourceId"
            v-model="openInterfaceDialog.data.resourceId"
            filterable
            placeholder="所属服务"
          >
            <el-option
              v-for="item in resourceServerSelection"
              :key="item.id"
              :label="item.description+'('+item.routeId+')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="interfaceName" label="接口名">
          <span v-if="openInterfaceDialog.state === 'info'">{{ openInterfaceDialog.data.interfaceName }}</span>
          <el-input v-else v-model="openInterfaceDialog.data.interfaceName" maxlength="256" />
        </el-form-item>
        <el-form-item prop="interfacePath" label="接口地址">
          <span v-if="openInterfaceDialog.state === 'info'">{{ openInterfaceDialog.data.interfacePath }}</span>
          <el-input v-else v-model="openInterfaceDialog.data.interfacePath" maxlength="256" />
        </el-form-item>
        <el-form-item prop="interfaceDesc" label="接口说明">
          <span v-if="openInterfaceDialog.state === 'info'">{{ openInterfaceDialog.data.interfaceDesc }}</span>
          <el-input v-else v-model="openInterfaceDialog.data.interfaceDesc" maxlength="256" />
        </el-form-item>
        <el-form-item prop="interfaceType" label="接口类型">
          <span v-if="openInterfaceDialog.state === 'info'">{{ openInterfaceDialog.data.interfaceTypeName }}</span>
          <el-select
            v-else
            v-model="openInterfaceDialog.data.interfaceType"
            ref="interfaceType"
            placeholder="接口类型"
          >
            <el-option label="通用接口" value="0" />
            <el-option label="授权接口" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openInterfaceDialog.visible = false">
          关闭
        </el-button>
        <el-button v-if="openInterfaceDialog.state==='info'" v-permission="permissions['update']" type="primary" @click="changeToEdit">
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

    <!--开放接口-客户端管理框-->
    <el-dialog v-el-drag-dialog title="开放接口-客户端管理" :visible.sync="openInterfaceClientDialog.visible" @dragDialog="handleDrag">
      <div style="text-align: center">
        <el-transfer
          v-model="transferClientProps.value"
          :filterable="true"
          :props="{
            key: 'id',
            label: 'clientName'
          }"
          :titles="['未绑定', '已绑定']"
          :data="transferClientProps.data"
          style="text-align: left; display: inline-block"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openInterfaceClientDialog.visible = false">
          关闭
        </el-button>
        <el-button v-permission="permissions['update']" type="primary" @click="saveClientOpenInterface">
          保存并关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js">

</script>

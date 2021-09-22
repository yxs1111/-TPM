<template>
  <div class="app-container" @keyup.enter="search">
    <!-- 查询条件 -->
    <el-form
      ref="modelSearchForm"
      :inline="true"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="渠道编码" prop="name">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入渠道编码"
        />
      </el-form-item>
      <el-form-item label="渠道名称" prop="name">
        <el-input
          v-model="queryParams.channelCsName"
          placeholder="请输入渠道名称"
        />
      </el-form-item>
      <el-form-item label="分类" prop="name">
        <el-select v-model="queryParams.date" placeholder="请选择状态">
          <el-option
            v-for="item in categoryArr"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父渠道" prop="name">
        <el-select
          v-model="queryParams.parentChannelCsName"
          placeholder="请选择父渠道"
        >
          <el-option
            v-for="item in categoryArr"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="tableLoading"
          @click="search"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="reset"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <!-- <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="openModelDialog">新增</el-button>
      <el-button type="success" icon="el-icon-plus" @click="publishModel">发布</el-button>
    </div> -->
    <el-table>
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        v-slot="scopeProps"
        align="center"
        label="序号"
        width="95"
      >
        {{ scopeProps.$index + 1 }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="渠道编码">
        {{ row.channelCode }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="中文名称">
        {{ row.channelCsName }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="英文名称">
        {{ row.channelEsName }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="状态">
        {{ row.state }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="父渠道">
        {{ row.parentChannelCsName }}
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <el-button
          v-permission="permissions['update']"
          size="mini"
          type="danger"
          @click="deleteModel(row)"
        >
          {{ $t("table.delete") }}
        </el-button>
        <el-button
          v-permission="permissions['update']"
          size="mini"
          type="primary"
          @click="editModel(row)"
        >
          {{ $t("table.edit") }}
        </el-button>
        <el-button
          v-permission="permissions['update']"
          size="mini"
          type="primary"
          @click="designModel(row)"
        >
          {{ $t("table.design") }}
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :current-page="queryParams.start"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增 -->
    <el-dialog
      v-el-drag-dialog
      v-loading="loading"
      :title="textMap[modelDialog.type]"
      :visible.sync="modelDialog.visible"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <el-form ref="modelDataForm" :model="modelDialog.data" :rules="rules">
        <el-input v-show="false" v-model="modelDialog.data.id" />
        <el-form-item label="编码" prop="key" label-width="80px">
          <el-input v-model="modelDialog.data.key" />
        </el-form-item>
        <el-form-item label="名称" prop="name" label-width="80px">
          <el-input v-model="modelDialog.data.name" />
        </el-form-item>
        <el-form-item label="版本" prop="version" label-width="80px">
          <el-input v-model.number="modelDialog.data.version" />
        </el-form-item>
        <el-form-item label="分类" prop="category" label-width="80px">
          <el-select v-model="modelDialog.data.category" placeholder="请选择">
            <el-option
              v-for="item in categoryArr"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程方向" prop="direction" label-width="80px">
          <el-radio-group
            v-model="modelDialog.data.direction"
            @change="directionChange()"
          >
            <el-radio
              v-for="item in flowDirection"
              :key="item.value"
              :label="item.value"
            >{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程描述" prop="description" label-width="80px">
          <el-input
            v-model="modelDialog.data.description"
            type="textarea"
            @input="onInput"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveOrUpdateModel"
        >确定</el-button>
        <el-button
          icon="el-icon-close"
          @click="closeModelDialog"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./master.js"/>

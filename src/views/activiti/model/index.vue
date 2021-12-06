<!--
 * @Description: 
 * @Date: 2021-12-06 08:33:29
 * @LastEditTime: 2021-12-06 20:24:32
-->
<template>
  <div class="app-container" @keyup.enter="search">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">模型名称:</span>
          <el-input v-model="queryParams.name" placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">模型关键词:</span>
          <el-input v-model="queryParams.key" placeholder="请输入" />
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-plus" @click="openModelDialog">新增</el-button>
      <el-button type="success" icon="el-icon-plus" @click="publishModel">发布</el-button>
    </div>
    <el-table ref="modelInfoTable" :data="tableData" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" border fit stripe height="600" highlight-current-row
      @row-click="handleCurrentRowClick" @row-dblclick="handleCurrentRowDblClick" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column v-slot="scopeProps" align="center" label="序号" width="95">
        {{ scopeProps.$index+1 }}
      </el-table-column>
      <el-table-column prop="key" align="center" label="关键字">
      </el-table-column>
      <el-table-column prop="name" align="center" label="模型名">
      </el-table-column>
      <el-table-column prop="version" align="center" label="模型版本">
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
      </el-table-column>
      <el-table-column align="center" label="最后更新时间">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.lastUpdateTime, '{y}-{m}-{d} {h}:{i}') }}</span>
      </el-table-column>
      <el-table-column v-slot="{row}" label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <div class="operationWrap">
          <div @click="deleteModel(row)" class="operation">
            <img src="@/assets/images/delete_l.png" alt="">
            <span>删除</span>
          </div>
          <div @click="editModel(row)" class="operation">
            <img src="@/assets/images/editor.png" alt="">
            <span>编辑</span>
          </div>
          <div @click="designModel(row)" class="operation">
            <img src="@/assets/images/design.png" alt="">
            <span>设计</span>
          </div>
        </div>
        <!-- <el-button size="mini" type="danger" @click="deleteModel(row)">
          {{ $t('table.delete') }}
        </el-button>
        <el-button size="mini" type="primary" @click="editModel(row)">
          {{ $t('table.edit') }}
        </el-button>
        <el-button size="mini" type="primary" @click="designModel(row)">
          {{ $t('table.design') }}
        </el-button> -->
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="queryParams.start" :page-sizes="[5, 10, 50, 100]" :page-size="queryParams.size" layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 新增 -->
    <el-dialog v-el-drag-dialog :title="textMap[modelDialog.type]" :visible.sync="modelDialog.visible" :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="false" center>
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
        <el-form-item label="流程描述" prop="description" label-width="80px">
          <el-input v-model="modelDialog.data.description" type="textarea" @input="onInput" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdateModel">确定</el-button>
        <el-button icon="el-icon-close" @click="closeModelDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./model.js"/>
<style lang="scss" scoped>
.operationWrap {
  display: flex;
  align-items: center;
  .operation {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #4192d3;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
  .deleteOperation {
    color: #EB4F48;
  }
}
</style>


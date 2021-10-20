<template>
  <div class="app-container" @keyup.enter="search">
    <!-- 查询条件 -->
    <el-form
      ref="modelSearchForm"
      :inline="true"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型关键词" prop="name">
        <el-input v-model="queryParams.key" placeholder="请输入模型关键词" />
      </el-form-item>
      <el-form-item label="分类" prop="name">
        <el-select v-model="queryParams.category" placeholder="请选择">
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
          v-permission="permissions['get']"
          type="primary"
          icon="el-icon-search"
          :loading="tableLoading"
          @click="search"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button v-permission="permissions['get']" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div id="buttonDiv" style="margin-bottom: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="openModelDialog"
        >新增</el-button
      >
      <el-button type="success" icon="el-icon-plus" @click="publishModel"
        >发布</el-button
      >
    </div>
    <el-table
      ref="modelInfoTable"
      v-loading="tableLoading"
      :data="tableData"
      element-loading-text="正在查询"
      border
      fit
      stripe
      highlight-current-row
      @row-click="handleCurrentRowClick"
      @row-dblclick="handleCurrentRowDblClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        v-slot="scopeProps"
        align="center"
        label="序号"
        width="95"
      >
        {{ scopeProps.$index + 1 }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="关键字">
        {{ row.key }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="模型名">
        {{ row.name }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="模型版本">
        {{ row.version }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="创建时间">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.createTime, "{y}-{m}-{d} {h}:{i}") }}</span>
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="最后更新时间">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.lastUpdateTime, "{y}-{m}-{d} {h}:{i}") }}</span>
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
              >{{ item.text }}</el-radio
            >
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
          >确定</el-button
        >
        <el-button icon="el-icon-close" @click="closeModelDialog"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getDefaultPermissions, parseTime, getTextMap } from "@/utils";
import BpmConfig from "@/components/activiti/template/BpmConfig";
import modelApi from "@/api/activiti/modelApi";
import permission from "@/directive/permission";
import elDragDialog from "@/directive/el-drag-dialog";
export default {
  data() {
    return {
      modelDialog: {
        type: null,
        visible: false,
        data: {
          id: null,
          category: null,
          name: "",
          key: "",
          version: null,
          description: ""
        },
        confirm: {
          visible: false
        }
      },
      categoryArr: [{ label: "19号线", value: "19" }],
      flowDirection: [
        { text: "从左往右", value: "horizontal" },
        { text: "从上往下", value: "vertical" }
      ],
      permissions: getDefaultPermissions(),
      textMap: getTextMap(),
      rules: {
        key: [
          { required: true, message: "请输入编码", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入模型名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        version: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { type: "number", min: 1, message: "最少为1", trigger: "blur" }
        ]
      }
    };
  },
  directives: { elDragDialog, permission },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState("model", [
      "loading",
      "tableLoading",
      "modelSelected",
      "modelData",
      "queryParams",
      "tableData"
    ])
  },
  methods: {
    ...mapMutations("model", ["selectModel", "unSelectModel"]),
    ...mapActions("model", [
      "saveModel",
      "updateModel",
      "pageList",
      "rowSelected",
      "deleteModel",
      "publishModelApi",
      "reset"
    ]),
    search() {
      this.pageList();
    },
    // 每页记录数改变时会触发
    handleSizeChange(newSize) {
      this.queryParams.size = newSize;
      this.pageList();
    },
    // 当前页码改变时会触发
    handleCurrentChange(newCurrent) {
      this.queryParams.start = newCurrent;
      this.pageList();
    },
    // 设计模型
    designModel: function(row) {
      this.selectModel(row);
      this.$router.push({ path: "/modeler", query: row });
    },
    /**
     * 新增/编辑模型
     * @returns {Promise<void>}
     */
    saveOrUpdateModel: function() {
      this.$refs.modelDataForm.validate(valid => {
        if (valid) {
          // 获取bpmn模板
          if (this.modelDialog.type === "create") {
            // 新增
            const defaultBpmnData = new BpmConfig(
              this.modelDialog.data.key,
              this.modelDialog.data.name,
              this.modelDialog.description
            );
            this.modelDialog.data.sourceUrl = defaultBpmnData.sourceUrlTemplate;
            this.saveModel(this.modelDialog.data).then(data => {
              if (data) {
                this.$confirm("是否开始设计模型?", "提示", {
                  confirmButtonText: "设 计"
                })
                  .then(() => {
                    this.selectModel(data);
                    this.$router.push({ path: "/modeler", query: data });
                  })
                  .catch(() => {
                    this.pageList();
                  });
              }
            });
          } else {
            // 编辑
            this.updateModel(this.modelDialog.data);
          }
          this.modelDialog.visible = false;
        } else {
          return false;
        }
      });
    },
    publishModel() {
      this.$confirm("确认要发布吗?", "发布模型", {
        confirmButtonText: "确定",
        callback: () => {
          this.publishModelApi(this);
        }
      }).then(r => {
        console.log("发布成功", r);
      });
    },
    /**
     * 关闭模型新增/编辑弹框
     */
    closeModelDialog() {
      this.resetModelInfoDialog();
      this.modelDialog.visible = false;
      if (this.modelDialog.type !== "info") {
        this.pageList();
      }
    },
    /**
     * 编辑模型弹窗
     * @param currentRow
     */
    editModel(currentRow) {
      this.modelDialog.data = currentRow;
      if (currentRow.metaInfo) {
        this.modelDialog.data.description = JSON.parse(
          currentRow.metaInfo
        ).description;
        this.modelDialog.data.direction = JSON.parse(
          currentRow.metaInfo
        ).direction;
      }

      this.modelDialog.visible = true;
      this.modelDialog.type = "update";

      this.$nextTick(() => {
        this.$refs["modelDataForm"].clearValidate();
      });
    },
    /**
     * 打开模型弹窗
     */
    openModelDialog() {
      this.modelDialog.visible = true;
      this.modelDialog.type = "create";
      this.resetModelInfoDialog();
    },
    init() {
      // 获取分类数据
      modelApi.getCategoryOfModel({ tenantId: "0" }).then(res => {
        this.categoryArr = res.data;
      });
      // 初始化列表页
      this.pageList();
    },
    onInput() {
      this.$forceUpdate();
    },
    // 单击行，切换选中状态
    handleCurrentRowClick(row, column) {
      if (column.label !== "操作" && this.$refs["modelInfoTable"]) {
        this.$refs["modelInfoTable"].toggleRowSelection(row);
        this.selectModel(row);
      }
    },
    // 双击行，显示详情
    handleCurrentRowDblClick(row, column) {
      if (column.label !== "操作" && this.$refs["modelInfoTable"]) {
        this.$refs["modelInfoTable"].clearSelection();
        this.$refs["modelInfoTable"].toggleRowSelection(row);
        this.getRowData(row);
      }
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetModelInfoDialog();
      this.modelDialog.visible = true;
      this.modelDialog.data = Object.assign({}, row);
      if (this.modelDialog.data.metaInfo) {
        this.modelDialog.data.description = JSON.parse(
          this.modelDialog.data.metaInfo
        ).description;
        this.modelDialog.data.direction = JSON.parse(
          this.modelDialog.data.metaInfo
        ).direction;
      }
      this.modelDialog.type = "info";
    },
    resetModelInfoDialog() {
      this.$nextTick(() => {
        if (this.$refs["modelDataForm"]) {
          this.$refs["modelDataForm"].clearValidate();
        }
      });
      this.modelDialog.data = {
        id: null,
        category: null,
        name: "",
        key: "",
        version: null,
        description: ""
      };
    },
    // 行选中状态变更
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    directionChange() {
      this.$forceUpdate();
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return "";
      }
      return parseTime(time, cFormat);
    }
  }
};
</script>

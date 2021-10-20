<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form
      ref="modelSearchForm"
      :inline="true"
      :model="filterObj"
      class="demo-form-inline"
    >
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="filterObj.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型关键词" prop="name">
        <el-input v-model="filterObj.key" placeholder="请输入模型关键词" />
      </el-form-item>
      <el-form-item label="分类" prop="name">
        <el-select v-model="filterObj.category" placeholder="请选择">
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
          class="TpmButtonBG"
          icon="el-icon-search"
          :loading="tableLoading"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="permissions['get']"
          class="TpmButtonBG"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG"
        >新增</el-button
      >
      <el-button type="success" icon="el-icon-plus" class="TpmButtonBG"
        >发布</el-button
      >
    </div>
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column align="center" prop="date" label="日期"> </el-table-column>
      <el-table-column align="center" prop="name" label="姓名"> </el-table-column>
      <el-table-column align="center" prop="address" label="地址"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import permission from "@/directive/permission";
import elDragDialog from "@/directive/el-drag-dialog";
import { getDefaultPermissions, parseTime, getTextMap } from "@/utils";
export default {
  name: "Role",

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
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
      filterObj: {
        name: "",
        key: "",
        category: ""
      },
      tableLoading:'',
      categoryArr: [{ label: "19号线", value: "19" }],
      flowDirection: [
        { text: "从左往右", value: "horizontal" },
        { text: "从上往下", value: "vertical" }
      ],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  directives: { elDragDialog, permission },
  mounted() {},
  computed: {},
  methods: {
    handleSelectionChange(val) {
      this.checkArr = val;
      console.log(val);
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pageSize = size;
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pageNum = num;
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped></style>

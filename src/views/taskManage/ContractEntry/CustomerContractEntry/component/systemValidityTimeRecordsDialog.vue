<!--
 * @Description: 
 * @Date: 2022-12-10 16:26:53
 * @LastEditTime: 2022-12-10 17:14:33
-->
<template>
  <div>
    <el-dialog v-bind="$attrs" :visible="isVisible" width="60%" class="my-el-dialog">
      <div class="dialogContent">
        <el-table :data="tableData" style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="date" label="变更前">
          </el-table-column>
          <el-table-column prop="name" label="变更后">
          </el-table-column>
          <el-table-column prop="address" label="变更时间">
          </el-table-column>
          <el-table-column prop="address" label="变更人">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TimeRecordsDialog',

  data() {
    return {
      isVisible: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
  computed: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    dialogVisible: {
      handler(val) {
        this.isVisible = val
      },
      immediate: true,
    },
  },
  mounted() {},

  methods: {
    cancelDialog() {
      this.$bus.$emit('cancel', false)
    },
    confirmDialog() {
      this.$bus.$emit('cancel', false)
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
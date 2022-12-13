<!--
 * @Description: 
 * @Date: 2022-12-10 16:26:53
 * @LastEditTime: 2022-12-13 11:39:41
-->
<template>
  <div>
    <el-dialog v-bind="$attrs" :visible="isVisible" width="60%" class="my-el-dialog" :before-close="cancelDialog">
      <div class="dialogContent">
        <el-table :data="tableData" border style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
          <!-- 序号 -->
          <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
          <el-table-column align="center" prop="oldEffectiveDate" label="变更前">
          </el-table-column>
          <el-table-column align="center" prop="newEffectiveDate" label="变更后">
          </el-table-column>
          <el-table-column align="center" prop="createDate" label="变更时间">
          </el-table-column>
          <el-table-column align="center" prop="createBy" label="变更人">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/ContractEntry/customer'
import axios from 'axios'
import auth from '@/utils/auth'
export default {
  name: 'TimeRecordsDialog',

  data() {
    return {
      isVisible: false,
      tableData: [
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
    getTableData(id) {
      API.getRecords({id}).then((res) => {
        this.tableData = res.data
        this.tableData.forEach((item) => {
          item.oldEffectiveDate = item.oldEffectiveBeginDate+'-'+item.oldEffectiveEndDate
          item.newEffectiveDate = item.newEffectiveBeginDate+'-'+item.newEffectiveEndDate
        })
      })
    },
    cancelDialog() {
      this.$emit('cancel', false)
    },
    confirmDialog() {
      this.$emit('cancel', false)
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
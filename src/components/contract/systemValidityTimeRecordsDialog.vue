<!--
 * @Description: 
 * @Date: 2022-12-10 16:26:53
 * @LastEditTime: 2022-12-16 16:05:57
-->
<template>
  <div>
    <el-dialog v-bind="$attrs" :visible="isVisible" width="80%" class="my-el-dialog" :before-close="cancelDialog">
      <div class="dialogContent">
        <el-table :data="tableData" border style="width: 100%" :header-cell-style="HeadTable" :row-class-name="tableRowClassName">
          <!-- 序号 -->
          <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
          <el-table-column align="center" width="180" prop="oldEffectiveDate" label="变更前"></el-table-column>
          <el-table-column align="center" width="180" prop="newEffectiveDate" label="变更后"></el-table-column>
          <el-table-column align="center" width="180" prop="createDate" label="变更时间"></el-table-column>
          <el-table-column align="center" width="180" prop="approveStateName" label="变更状态"></el-table-column>
          <el-table-column align="center" width="180" :show-overflow-tooltip="true" prop="createBy" label="变更人"></el-table-column>
          <el-table-column align="center" width="150" :show-overflow-tooltip="true" prop="remark" label="申请人备注"></el-table-column>
          <el-table-column align="center" width="180" :show-overflow-tooltip="true" prop="poApprovalComments" label="Package Owner意见"></el-table-column>
          <el-table-column align="center" width="150" :show-overflow-tooltip="true" prop="finApprovalComments" label="HQ PPM审批意见"></el-table-column>
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
<!--
 * @Description: 
 * @Date: 2022-04-12 08:50:29
 * @LastEditTime: 2022-04-12 13:16:17
-->
<template>
  <div class="ContentDetail">
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <svg-icon icon-class="save" style="font-size: 24px;" />
        <span class="text">暂存</span>
      </div>
      <div class="TpmButtonBG">
        <svg-icon icon-class="passLocal" style="font-size: 22px;" />
        <span class="text">提交</span>
      </div>
      <div class="TpmButtonBG cancelButton">
        <span class="text">取消</span>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" :min-height="800" border :header-cell-style="HeadTable" :cell-style="columnStyle" :row-class-name="tableRowClassName"
      style="width: 100%">
      <!-- 客户 -->
      <el-table-column align="center" width="740" fixed="left">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 客户名称: 高鑫零售</span>
            <span class="topTarget"> 目标销售额(含税,¥): 100000 </span>
          </div>
        </template>
        <template>
          <el-table-column width="740">
            <template v-slot:header>
            </template>
            <template>
              <el-table-column align="center" width="120">
                <template v-slot:header></template>
                <template slot-scope="{ row }">
                  <div>
                    {{ row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="contractItem" align="center" width="150" label="Contract item">
                <!-- <template slot-scope="{row}">
                  <div v-if="row.contractItem!==''">
                    {{row.isVariable?contractItemVariableList[row.contractItem].name:contractItemFixList[row.contractItem].name}}
                  </div>
                </template> -->
              </el-table-column>
              <el-table-column prop="conditionType" align="center" width="120" label="条件类型">
              </el-table-column>
              <el-table-column prop="pointCount" align="center" width="100" label="费比（%）">
              </el-table-column>
              <el-table-column prop="taxPrice" align="center" width="150" label="含税金额（￥）">
              </el-table-column>
              <el-table-column prop="detail" align="center" width="100" label="描述"></el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template v-slot:header>
          <div class="topInfoWrap">
            <span class="topInfo"> 经销商名称: 成都华隆</span>
            <span class="topTarget"> 目标销售额(含税,¥): 100000 </span>
          </div>
        </template>
        <template>
          <el-table-column>
            <template v-slot:header>
            </template>
            <template>
              <el-table-column prop="contractItem" align="center" width="150" label="Contract item">
              </el-table-column>
              <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
              </el-table-column>
              <el-table-column prop="cost" align="center" width="150" label="含税金额（￥）">
              </el-table-column>
              <el-table-column prop="detail" align="center" width="150" label="描述"></el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              菲仕兰承担
            </template>
            <template>
              <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
              </el-table-column>
              <el-table-column prop="cost" align="center" width="150" label="含税金额（￥）">
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
              经销商承担
            </template>
            <template>
              <el-table-column prop="pointCount" align="center" width="150" label="费比（%）">
              </el-table-column>
              <el-table-column prop="cost" align="center" width="150" label="含税金额（￥）">
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot:header>
            </template>
            <template>
              <el-table-column prop="pointCount" align="center" width="150" label="客户扣缴税点">
              </el-table-column>
              <el-table-column prop="cost" align="center" width="150" label="支付方式">
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import API from '@/api/taskManage/taskManage.js'
import {
  getDefaultPermissions,
  getTextMap,
  parseTime,
  getContractEntry,
  FormateThousandNum,
  setSplitAssignee,
} from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'dealerTermDetail',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      maxheight: getContractEntry(),
      tableData: [
        {
          name: 'Total',
          data: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
          contractItem: '',
          conditionType: '',
          pointCount: 3,
          taxPrice: 21,
          detail: '',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Variable',
          data: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
          contractItem: '0',
          conditionType: '0',
          pointCount: 3,
          taxPrice: 21,
          detail: '描述',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Variable total',
          data: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
          contractItem: '0',
          conditionType: '0',
          pointCount: 3,
          taxPrice: 21,
          detail: '描述',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Fixed',
          data: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
          contractItem: '0',
          conditionType: '0',
          pointCount: 3,
          taxPrice: 21,
          detail: '描述',
          isVariable: 1, //total 、Fix 区分
        },
        {
          name: 'Fixed total',
          data: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              cost: 21,
              taxRate: '',
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
          contractItem: '0',
          conditionType: '0',
          pointCount: 3,
          taxPrice: 21,
          detail: '描述',
          isVariable: 1, //total 、Fix 区分
        },
      ],
      AllTableData: [
        {
          name: 'Total',
          customerInfo: {
            contractItem: '',
            conditionType: '',
            pointCount: 3,
            taxPrice: 21,
            detail: '',
            isVariable: 1, //total 、Fix 区分
          },
          dealerList: [
            {
              contractItem: '',
              conditionType: '',
              pointCount: 3,
              taxPrice: 21,
              detail: '',
              isVariable: 1, //total 、Fix 区分
            },
          ],
        },
      ],
    }
  },

  mounted() {},

  methods: {
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pageSize = size
      this.getTableData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pageNum = num
      this.getTableData()
    },
    //弹窗表格样式
    tableRowClassName({ row, rowIndex }) {
      if (row.name.indexOf('Total') === 0) {
        return 'contract_firstRow'
      }
      if (row.name.indexOf('total') != -1) {
        return 'first-row'
      }
    },
    // 列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (row.name.indexOf('Total') !== -1) {
        return 'background-color: #4192d3 !important;color: #fff!important;'
      }
      if (row.name.indexOf('total') !== -1) {
        return 'background-color: #E3F3FF !important;color: #666!important;'
      }
    },
    HeadTable({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background-color: #E3F3FF !important;color: #333!important;font-family: Source Han Sans CN;font-size: 16px;'
      }
      return ' background: #4192d3;color: #fff;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  },
}
</script>

<style lang="scss" scoped>
.ContentDetail {
  height: 100%;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
  .topInfoWrap {
    letter-spacing: 2px;
    .topTarget {
      margin-left: 20px;
    }
  }
}
.contract_firstRow {
  background-color: #4192d3 !important;
  color: #fff;
  font-size: 14px;
}
.headerStyle {
  background-color: #4192d3 !important;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
}
.TotalRow {
  background-color: #f3f7f8 !important;
  color: #666;
  font-size: 14px;
}
.hover-row {
  color: #666 !important;
  background-color: #f3f7f8;
}
.hover-row .filstColumn {
  color: #666;
}
</style>
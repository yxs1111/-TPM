<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">异常类别：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker v-model="filterObj.month" type="month" placeholder="选择月">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>

      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="0">Pass数量</el-checkbox>
          <el-checkbox label="1">Exception1数量</el-checkbox>
          <el-checkbox label="2">Exception2数量</el-checkbox>
          <el-checkbox label="3">Exception3数量 </el-checkbox>
          <el-checkbox label="4">Pass占比</el-checkbox>
          <el-checkbox label="5">Exception1占比</el-checkbox>
          <el-checkbox label="6">Exception2占比</el-checkbox>
          <el-checkbox label="7">Exception3占比 </el-checkbox>
        </el-checkbox-group>
      </div>

      <el-button type="primary" class="TpmButtonBG my-search">查询</el-button>
    </div>
    <div class="colorWrap">
      <div class="TpmButtonBGWrap">
        <div class="TpmButtonBG">
          <img src="../../../assets/images/export.png" alt="">
          <span class="text">导出Raw Date</span>
        </div>
        <div class="TpmButtonBG">
          <img src="../../../assets/images/downloadIcon.png" alt="">
          <span class="text">下载报表</span>
        </div>
      </div>
      <div class="colorBar">
        <div class="colorli">
          <div class="color"></div>
          <span>V1</span>
        </div>
        <div class="colorli">
          <div class="color v2color"></div>
          <span>V2</span>
        </div>
        <div class="colorli">
          <div class="color v3color"></div>
          <span>V3</span>
        </div>
      </div>
    </div>
    <div class="tableContentWrap">
      <el-table :data="tableData" v-loading="tableLoading" border :header-cell-class-name="headerStyle" height="500" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column align="center" width="150" fixed prop="channel" label="数据维度"> </el-table-column>
        <el-table-column align="center" prop="name" label="202010">
          <el-table-column align="center" width="150" prop="name" label="Pass数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception1数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception2数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception3数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Pass占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception1占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception2占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception3占比"></el-table-column>
        </el-table-column>
        <el-table-column align="center" prop="name" label="202011">
          <el-table-column align="center" width="150" prop="name" label="Pass数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception1数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception2数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception3数量"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Pass占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception1占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception2占比"></el-table-column>
          <el-table-column align="center" width="150" prop="name" label="Exception3占比"></el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'LossAnalysisMonth',

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        type: '',
        month: '',
        category: '',
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          id: '12987122',
          name: '王小虎',
          number: '234',
          channel: 'NKA',
          amount3: 10,
        },
        {
          id: '12987123',
          name: '王小虎',
          number: '165',
          channel: 'NKA',
          amount3: 12,
        },
        {
          id: '12987124',
          name: '王小虎',
          number: '324',
          channel: 'NKA',
          amount3: 9,
        },
        {
          id: '12987125',
          name: '王小虎',
          number: '621',
          channel: 'NKA',
          amount3: 17,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
        },
      ],
      checkList: ['0', '1'],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    // this.getTableData()
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData = []
      API.getPageMdBrand({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    search() {
      this.getTableData()
    },
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
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 6 < 2) {
        return 'rowStyle1'
      }
      if (rowIndex % 6 < 4) {
        return 'rowStyle2'
      }
      if (rowIndex % 6 < 6) {
        return 'rowStyle3'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return 'headerStyle'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  .checkBoxWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .checkBox {
       display: flex;
    align-items: center;
    }
    .checkBoxTitle {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #4d4d4d;
      margin-right: 20px;
    }
    .my-search {
      margin-left: 30px;
    }
  }
  .tableContentWrap {
    border-radius: 10px 10px 0px 0px;
    overflow: hidden;
  }
  .colorWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .colorBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .colorli {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #4d4d4d;
        display: flex;
        margin-right: 30px;
        align-items: center;
        .color {
          width: 19px;
          height: 9px;
          margin-right: 5px;
          background-color: #fae2e3;
          border: solid 1px #e87071;
        }
        .v2color {
          background-color: #d7f7f1;
          border: solid 1px #38d7b7;
        }
        .v3color {
          background-color: #ffeecc;
          border: solid 1px #ffaa00;
        }
      }
    }
  }
}
</style>
<style>
.headerStyle {
  background-color: #4192d3 !important;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
}
.rowStyle1 {
  background-color: #fdf0f1 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
.rowStyle2 {
  background-color: #ebfbf8 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
.rowStyle3 {
  background-color: #fff6e5 !important;
  color: #666;
  font-weight: 400;
  font-size: 14px;
}
</style>

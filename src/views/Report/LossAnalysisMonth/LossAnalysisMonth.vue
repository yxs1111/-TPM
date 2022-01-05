<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker
            v-model="filterObj.month"
            type="monthrange"
            format="yyyy-MM"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域：</span>
          <el-select v-model="filterObj.regionCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.type" placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <el-button type="primary" class="TpmButtonBG my-search" style="margin-bottom:0px;">查询</el-button>
        </div>
      </div>
    </div>
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
    <div class="ContentWrap">
      <div class="contentli">
        <div class="contentTop">
          <div class="SKUTitle">费用（k RMB）</div>
        </div>
        <div class="contentInfoWrap">
          <div class="tableContentWrap">
            <el-table v-loading="tableLoading" :data="tableData" border :header-cell-class-name="headerStyle" height="400" :row-class-name="tableRowClassName" style="width: 100%">
              <el-table-column align="center" width="150" fixed prop="channel" label="数据维度" />
              <el-table-column align="center" prop="name" label="Total">
                <el-table-column align="center" width="150" prop="name" label="CPT" />
                <el-table-column align="center" width="150" prop="name" label="V1" />
                <el-table-column align="center" width="150" prop="name" label="V2" />
                <el-table-column align="center" width="150" prop="name" label="V3" />
              </el-table-column>
              <el-table-column align="center" prop="name" label="NKA">
                <el-table-column align="center" width="150" prop="name" label="孩子王">
                  <el-table-column align="center" width="150" prop="name" label="CPT" />
                  <el-table-column align="center" width="150" prop="name" label="V1" />
                  <el-table-column align="center" width="150" prop="name" label="V2" />
                  <el-table-column align="center" width="150" prop="name" label="V3" />
                </el-table-column>
                <el-table-column align="center" width="150" prop="name" label="沃尔玛">
                  <el-table-column align="center" width="150" prop="name" label="CPT" />
                  <el-table-column align="center" width="150" prop="name" label="V1" />
                  <el-table-column align="center" width="150" prop="name" label="V2" />
                  <el-table-column align="center" width="150" prop="name" label="V3" />
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="contentli">
        <div class="contentTop">
          <div class="SKUTitle">费比（% vs .GMV）</div>
        </div>
        <div class="contentInfoWrap">
          <div class="tableContentWrap">
            <el-table v-loading="tableLoading" :data="tableData" border :header-cell-class-name="headerStyle" height="400" :row-class-name="tableRowClassName" style="width: 100%">
              <el-table-column align="center" width="150" fixed prop="channel" label="数据维度" />
              <el-table-column align="center" prop="name" label="Total">
                <el-table-column align="center" width="150" prop="name" label="CPT" />
                <el-table-column align="center" width="150" prop="name" label="V1" />
                <el-table-column align="center" width="150" prop="name" label="V2" />
                <el-table-column align="center" width="150" prop="name" label="V3" />
              </el-table-column>
              <el-table-column align="center" prop="name" label="NKA">
                <el-table-column align="center" width="150" prop="name" label="孩子王">
                  <el-table-column align="center" width="150" prop="name" label="CPT" />
                  <el-table-column align="center" width="150" prop="name" label="V1" />
                  <el-table-column align="center" width="150" prop="name" label="V2" />
                  <el-table-column align="center" width="150" prop="name" label="V3" />
                </el-table-column>
                <el-table-column align="center" width="150" prop="name" label="沃尔玛">
                  <el-table-column align="center" width="150" prop="name" label="CPT" />
                  <el-table-column align="center" width="150" prop="name" label="V1" />
                  <el-table-column align="center" width="150" prop="name" label="V2" />
                  <el-table-column align="center" width="150" prop="name" label="V3" />
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  name: 'LossAnalysisHistory',
  directives: { elDragDialog, permission },

  data() {
    return {
      RegionList: [],
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        type: '',
        regionCode: '',
        month: '',
        category: ''
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      checkList: ['0', '1']
    }
  },
  computed: {},
  mounted() {
    // this.getTableData()
    this.getRegionList()
  },
  methods: {
    // 下拉框
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData = []
      API.getPageMdBrand({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize // 每页条数
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
      if ((rowIndex + 1) % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
        return 'headerStyle'
      }
    }
  }
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
  .ContentWrap {
    width: 100%;
    .contentli {
      // height: 480px;
      padding: 20px;
      border-radius: 20px;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #f2f3f5;
      box-shadow: 3px 3px 14px 0px rgba(228, 228, 228, 0.6);
      margin-bottom: 20px;
      .contentTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .SKUTitle {
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 600;
          color: #111111;
        }
        .GuidePriceBar {
          display: flex;
          align-items: center;
          color: #4192d3;
          font-weight: 500;
          font-size: 16px;
          .guide {
            width: 20px;
            height: 20px;
          }
          .GuidePriceWrap {
            .guideText {
              margin: 0 5px;
            }
            .GuidePrice {
              font-size: 20px;
              margin-left: 5px;
            }
          }
        }
      }
      .contentInfoWrap {
        display: flex;
        margin-top: 10px;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        .filstColumn {
          text-align: center;
          background-color: #4192d3;
          color: #fff;
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
</style>

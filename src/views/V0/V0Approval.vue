<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2021-11-17 14:04:18
-->
<template>
  <div class="app-container">
    <div class="Maincontent" @keyup.enter="search">
      <div class="SelectBarWrap">
        <div class="SelectBar">
          <div class="Selectli">
            <span class="SelectliTitle">SKU</span>
            <el-select v-model="SKU" placeholder="请选择">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
            </el-select>
          </div>
          <div class="Selectli">
            <span class="SelectliTitle">月份</span>
            <el-date-picker v-model="month" type="month" placeholder="选择月">
            </el-date-picker>
          </div>
          <el-button type="primary" class="TpmButtonBG">查询</el-button>
        </div>
        <div class="OpertionBar">
          <div class="TpmButtonBG" @click="importData">
            <img src="../../assets/images/import.png" alt="">
            <span class="text">导入</span>
          </div>
          <div class="TpmButtonBG">
            <img src="../../assets/images/export.png" alt="">
            <span class="text">导出</span>
          </div>
           <div class="TpmButtonBG">
            <img src="../../assets/images/submitIcon.png" alt="">
            <span class="text">通过</span>
          </div>
          <div class="TpmButtonBG">
            <svg-icon icon-class="close" />
            <span class="text">驳回</span>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="ContentWrap">
        <div class="contentli">
          <div class="contentTop">
            <div class="SKUTitle">
              皇家美素力1段婴儿配方奶粉12*350g
            </div>
          </div>
          <div class="contentInfoWrap">
            <el-table :data="tableData" class="customTable" :summary-method="getSummaries" show-summary border :header-cell-style="HeadTable" :cell-style="columnStyle"
              style="width: 100%">
              <el-table-column width="150" fixed>
                <template slot="header">
                  <div></div>
                </template>
                <template slot-scope="scope">
                  <div class="filstColumn">
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" prop="name" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channel" label="渠道"></el-table-column>
              <el-table-column align="center" width="120" prop="number" label="CPT VOL(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="200.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="180.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="160.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="City Plan预拆分均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="City Plan预拆分费用(RMB)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="CPT均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="CPT费用(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="均价差值(%)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="费用差值(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="系统判定"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="contentli">
          <div class="contentTop">
            <div class="SKUTitle">
              皇家美素力1段婴儿配方奶粉12*350g
            </div>
          </div>
          <div class="contentInfoWrap">
            <el-table :data="tableData" class="customTable" :summary-method="getSummaries" show-summary border :header-cell-style="HeadTable" :cell-style="columnStyle"
               style="width: 100%">
              <el-table-column width="150" fixed>
                <template slot="header">
                  <div></div>
                </template>
                <template slot-scope="scope">
                  <div class="filstColumn">
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" prop="name" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channel" label="渠道"></el-table-column>
              <el-table-column align="center" width="120" prop="number" label="CPT VOL(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="200.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="180.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="160.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="City Plan预拆分均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="City Plan预拆分费用(RMB)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="CPT均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="CPT费用(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="均价差值(%)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="费用差值(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="系统判定"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="number" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 导入 -->
      <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeimportDialog">
        <div class="el-downloadFileBar">
          <el-button type="primary" plain class="my-export" icon="el-icon-download">下载模板</el-button>
          <el-button type="primary" plain class="my-export" icon="el-icon-odometer">检测数据</el-button>
        </div>

        <div class="fileInfo">
          <div class="fileTitle">文件</div>
          <el-button type="primary" class="my-search selectFile">选择文件</el-button>
          <div class="fileName">
            <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
            <span>文件名文件名文件名.XLSX</span>
          </div>
        </div>
        <div class="seeData">
          <div class="LeftBar">
            <div class="seeDataTitle">浏览数据</div>
            <div class="SelectLi">
              <el-select v-model="filterImportData.sku" class="my-el-viewData-select" clearable placeholder="请选择">
                <el-option v-for="item in ['SKU']" :key="item" :label="item" :value="item" />
              </el-select>
            </div>
          </div>

          <div class="exportError">
            <img src="@/assets/exportError_icon.png" alt="" class="exportError_icon" />
            <span>导出错误信息</span>
          </div>
        </div>
        <div class="tableWrap">
          <el-table border height="240" :data="ImportData" style="width: 100%" :header-cell-style="{
                background: '#fff',
                color: '#333',
                fontSize: '16px',
                textAlign: 'center',
                fontWeight: 400,
                fontFamily: 'Source Han Sans CN'
              }" :row-class-name="tableRowClassName" stripe>
            <el-table-column prop="date" fixed align="center" label="是否通过" width="180">
            </el-table-column>
            <el-table-column prop="name" fixed align="center" label="Excel行号" width="180">
            </el-table-column>
            <el-table-column prop="address" align="center" label="验证信息" width="380">
            </el-table-column>
            <el-table-column prop="address" align="center" label="SKU" width="380">
            </el-table-column>
            <el-table-column prop="address" align="center" label="月份" width="380">
            </el-table-column>
            <el-table-column prop="address" align="center" label="KA" width="380">
            </el-table-column>
            <el-table-column prop="address" align="center" label="档位" width="380">
            </el-table-column>
            <el-table-column prop="address" align="center" label="VOL" width="380">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'V0Approval',
  data() {
    return {
      categoryArr: [{ label: '19号线', value: '19' }],
      permissions: getDefaultPermissions(),
      month: '',
      SKU: '',
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
      ],
      ruleForm: {
        scenario: '',
        version: '',
        channel: '',
      },
      rules: {
        scenario: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      isEditor: '',
      editorId: '',
      //导入
      importVisible: false, //导入弹窗
      filterImportData: { sku: '' }, //筛选导入数据
      ImportData: [
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
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    }
  },
  directives: { elDragDialog, permission },
  mounted() {},
  computed: {},
  methods: {
    search() {},
    getCPTData() {
      this.dialogVisible = true
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetForm(formName)
        } else {
          this.$message.error('提交失败')
          return false
        }
      })
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    // 弹窗关闭
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        scenario: '',
        version: '',
        channel: '',
      }
    },
    //汇总计算
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total(销量)'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' '
        } else {
          sums[index] = ' '
        }
      })
      return sums
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    //关闭导入
    closeimportDialog() {
      this.importVisible = false
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
      return ' background: #4192D3;color: #fff;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'background:#4192d3'
      }
      if (columnIndex === 4) {
        return 'background:#FEF5F6'
      }
      if (columnIndex === 5) {
        return 'background:#EFFCF9'
      }
      if (columnIndex === 6) {
        return 'background:#F0F6FC '
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.Maincontent {
  .TopBar {
    display: flex;
    align-items: center;
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
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
<style  lang="scss">
// // 合计行样式
// .el-table__footer-wrapper tbody td,
// .el-table__header-wrapper tbody td {
//   background-color: #e3f3ff !important;
//   color: #666;
// }
// .el-table__footer-wrapper .is-leaf {
//   color: #666 !important;
// }
// .el-table__fixed-footer-wrapper tbody td {
//   border-top: 1px solid #ebeef5;
//   background-color: #e3f3ff;
//   color: #666;
//   text-align: center !important;
// }
// .has-gutter tr td .cell {
//   text-align: center;
//   color: #001111;
// }
// //合并行放在第一行
// .contentInfoWrap .el-table {
//   display: flex;
//   flex-direction: column;
// }
// .contentInfoWrap .el-table__body-wrapper {
//   order: 1;
// }
// .contentInfoWrap .el-table__fixed-body-wrapper {
//   top: 97px !important;
// }
// .contentInfoWrap .el-table__fixed-footer-wrapper {
//   z-index: 0;
//   top: 50px;
// }
</style>

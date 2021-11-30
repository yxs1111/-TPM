<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2021-11-30 15:36:53
-->
<template>
  <div class="app-container">
    <div class="Maincontent" @keyup.enter="search">
      <div class="SelectBarWrap">
        <div class="SelectBar">
          <div class="Selectli">
            <span class="SelectliTitle">SKU</span>
            <el-select v-model="filterObj.SKU" placeholder="请选择">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
            </el-select>
          </div>
          <div class="Selectli">
            <span class="SelectliTitle">月份</span>
            <el-date-picker v-model="filterObj.month" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyy-MM">
            </el-date-picker>
          </div>
          <el-button type="primary" icon="el-icon-search" class="TpmButtonBG" @click="search">查询</el-button>
        </div>
        <div class="OpertionBar">
          <div class="TpmButtonBG" @click="importData">
            <img src="@/assets/images/import.png" alt="" />
            <span class="text">导入</span>
          </div>
          <div class="TpmButtonBG" @click="exportData">
            <img src="@/assets/images/export.png" alt="" />
            <span class="text">导出</span>
          </div>
          <div class="TpmButtonBG" @click="approve(1)">
            <img src="@/assets/images/submitIcon.png" alt="" />
            <span class="text">通过</span>
          </div>
          <div class="TpmButtonBG" @click="approve(0)">
            <svg-icon icon-class="close" />
            <span class="text">驳回</span>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="ContentWrap" v-loading="loading" element-loading-text="正在查询">
        <div class="contentli" v-for="(tableData, key, index) in ContentData" :key="index">
          <div class="contentTop">
            <div class="SKUTitle">
              {{ key }}
            </div>
          </div>
          <div class="contentInfoWrap">
            <el-table :data="tableData" class="customTable" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" :cell-style="columnStyle" style="width: 100%">
              <el-table-column width="150" fixed>
                <template slot="header">
                  <div></div>
                </template>
                <template slot-scope="scope">
                  <div :class="
                      scope.$index == 0 ? 'filstColumn_total' : 'filstColumn'
                    ">
                    <span>{{ scope.row.dimCustomer }} </span>
                    <!-- {{scope.$index}} -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" prop="yearAndMonth" label="活动月"></el-table-column>
              <el-table-column align="center" width="120" prop="channelCode" label="渠道"></el-table-column>
              <el-table-column align="center" width="120" prop="cptVolBox" label="CPT VOL(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" v-for="(citem, cindex) in columnList(tableData)" :key="cindex">
                <template slot="header">
                  {{ tableData[0].customGearList[cindex].gear }}RMB/听
                  档位销量(箱)
                </template>
                <template slot-scope="{ row }">
                  <div>
                    {{ row.customGearList[cindex].actualNum }}
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" width="250" prop="number" label="180.00RMB/听 档位销量(箱)"></el-table-column>
              <el-table-column align="center" width="250" prop="number" label="160.00RMB/听 档位销量(箱)"></el-table-column> -->
              <el-table-column align="center" width="250" prop="cityPlanAveragePrice" label="City Plan预拆分均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="250" prop="cityPlanPromotionExpenses" label="City Plan预拆分费用(RMB)"></el-table-column>
              <el-table-column align="center" width="250" prop="cptAveragePrice" label="CPT均价(RMB/Tin)"></el-table-column>
              <el-table-column align="center" width="160" prop="cptPromotionExpenses" label="CPT费用(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="averagePriceRange" label="均价差值(%)"></el-table-column>
              <el-table-column align="center" width="160" prop="promotionExpensesGapValue" label="费用差值(RMB)"></el-table-column>
              <el-table-column align="center" width="160" prop="judgmentType" label="系统判定"></el-table-column>
              <el-table-column align="center" width="250" prop="applyRemarks" label="申请人备注"></el-table-column>
              <el-table-column align="center" width="250" prop="poApprovalComments" label="Package Owner审批意见"></el-table-column>
              <el-table-column align="center" width="160" prop="finApprovalComments" label="Finance审批意见"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 导入 -->
      <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeimportDialog">
        <div v-loading="dialogLoading" element-loading-text="正在导入">
          <div class="el-downloadFileBar">
            <div>
              <el-button type="primary" plain class="my-export" icon="el-icon-download">下载模板</el-button>
              <el-button type="primary" plain class="my-export" icon="el-icon-odometer">检测数据</el-button>
            </div>
            <el-button type="primary" class="TpmButtonBG" @click="confirmImport">保存</el-button>
          </div>

          <div class="fileInfo">
            <div class="fileTitle">文件</div>
            <el-button type="primary" class="my-search selectFile">选择文件</el-button>
            <div class="fileName">
              <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
              <span>文件名文件名文件名.XLSX</span>
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
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDefaultPermissions,
  getCPTMonth,
  parseTime,
  getTextMap,
} from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import API from '@/api/V0/V0.js'
export default {
  name: 'V0Approval',
  data() {
    return {
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      filterObj: {
        month: '',
        SKU: '',
      },
      permissions: getDefaultPermissions(),
      ContentData: [],
      loading: '',
      dialogVisible: false,
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
      mainId: '',
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    //this.getList()
    this.filterObj.month = getCPTMonth()
  },
  computed: {},
  methods: {
    getList() {
      this.loading = true
      API.getList({
        yearAndMonth: this.filterObj.month,
        productCode: this.filterObj.SKU,
      })
        .then((response) => {
          this.ContentData = response.data
          for (const key in this.ContentData) {
            let list = this.ContentData[key]
            this.mainId = this.ContentData[key][0].mainId
            for (let i = 0; i < list.length; i++) {
              list[i].customGearList = JSON.parse(list[i].customGear)
            }
          }
          this.loading = false
          console.log(this.mainId)
        })
        .catch(() => {})
    },
    //档位列
    columnList(list) {
      let columnList = list[0].customGearList
      return columnList
    },
    search() {
      this.getList()
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    //关闭导入
    closeimportDialog() {
      this.importVisible = false
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    //确认导入文件
    confirmImport() {
      if (this.uploadFile != '') {
        this.dialogLoading = true
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        API.importExcel(formData).then((response) => {
          this.dialogLoading = false
          this.$message.success('导入成功!')
          this.closeimportDialog()
        })
      } else {
        this.$message.error('请选择文件')
      }
    },
    //导出数据
    exportData() {
      if (this.filterObj.month != '') {
        //导出数据筛选
        API.exportExcel({
          yearAndMonth: this.filterObj.month,
          productCode: this.filterObj.SKU,
        }).then((res) => {
          let timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V0 -' + timestamp + '.xlsx') //自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.error('请先选择年月')
      }
    },
    //下载文件
    downloadFile(res, fileName) {
      let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      if (!fileName) {
        fileName = res.headers['content-disposition'].split('filename=').pop()
      }
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      }
    },
    //审批
    approve(value) {
      let arr = Object.keys(this.ContentData)
      if (arr.length) {
        let mainId = this.ContentData[arr[0]][0].mainId
        console.log(mainId)
        if (value) {
          API.approve({
            mainId, //主表id
            approve: 'agree', //审批标识(agree：审批通过，reject：审批驳回)
          })
            .then((response) => {
              this.$message.success('审批通过!')
            })
            .catch(() => {})
        } else {
          API.approve({
            mainId, //主表id
            approve: 'reject', //审批标识(agree：审批通过，reject：审批驳回)
          })
            .then((response) => {
              this.$message.success('审批驳回!')
            })
            .catch(() => {})
        }
      } else {
        this.$message.error('数据不能为空')
      }
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'first-row'
      }
    },
    HeadTable() {
      return ' background: #4192D3;color: #fff;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex != 0) {
        return 'background:#4192d3!important'
      }
      if (columnIndex === 4 && rowIndex != 0) {
        return 'background:#FEF5F6'
      }
      if (columnIndex === 5 && rowIndex != 0) {
        return 'background:#EFFCF9'
      }
      if (columnIndex === 6 && rowIndex != 0) {
        return 'background:#F0F6FC'
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
    min-height: 50vh;
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
        .filstColumn_total {
          text-align: center;
          color: #001111;
        }
      }
    }
  }
}
</style>

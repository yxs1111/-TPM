<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-date-picker v-model="filterObj.custom" type="month" placeholder="请选择" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">经销商:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <el-select v-model="filterObj.channel" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.label" :value="index" />
          </el-select>
        </div>

      </div>
      <div class="OpertionBar">
        <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG">查询</el-button>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <div class="TpmButtonBG" @click="exportExcelInfo">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出</span>
      </div>
      <div class="TpmButtonBG" @click="agree">
        <svg-icon icon-class="submit" />
        <span class="text">通过</span>
      </div>
      <div class="TpmButtonBG" @click="reject">
        <svg-icon icon-class="close" />
        <span class="text">驳回</span>
      </div>
    </div>
    <el-table v-loading="tableLoading" :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column width="400" align="center" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="120" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelName" label="渠道" />
      <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="120" align="center" prop="brandName" label="品牌" />
      <el-table-column width="160" align="center" prop="productName" label="SKU" />
      <el-table-column width="190" align="center" prop="priceGearAmount" label="价格档位（RMB/Tin）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="priceLevel" :class="scope.$index%3===0?'':scope.$index%3===1?'priceCenter':'priceLow'">{{ scope.row.priceGearAmount }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" prop="totalPriceGearVol" label="价格档位销量总计（CTN）">
        <template slot-scope="scope">
          <div class="priceLevelWrap">
            <div class="TotalNum">{{ scope.row.totalPriceGearVol }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="400" align="center" prop="distributorName" label="经销商" />
      <el-table-column width="120" align="center" prop="regionName" label="区域" />
      <el-table-column width="220" align="center" prop="systemRecommendedVol" label="系统拆分销量（CTN）" />
      <el-table-column width="220" align="center" prop="adjustedVol" label="调整后销量（CTN）" />
      <el-table-column width="220" align="center" prop="volDifference" label="销量差值（%）" />
      <el-table-column width="220" align="center" prop="adjustedAmount" label="调整后费用（RMB）" />
      <el-table-column width="120" align="center" prop="mechanismType" label="机制类型" />
      <el-table-column width="120" align="center" prop="mechanismName" label="机制名称" />
      <el-table-column width="120" align="center" prop="activityTheme" label="活动主题窗口" />
      <el-table-column width="120" align="center" prop="activityDateStart" label="活动开始时间" />
      <el-table-column width="120" align="center" prop="activityDateEnd" label="活动结束时间" />
      <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
      <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
      <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
      <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
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

    <!-- 导入 -->
    <el-dialog width="66%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeimportDialog">
      <div class="el-downloadFileBar" style="display:flex;">
        <div>
          <el-button type="primary" plain class="my-export" icon="el-icon-download" @click="downLoadElxModel">下载模板
          </el-button>
          <el-button v-if="uploadFileName!=''" type="primary" plain class="my-export" icon="el-icon-odometer" @click="confirmImport()">检测数据
          </el-button>
        </div>
        <div>
          <el-button type="primary" plain class="my-export" icon="el-icon-odometer" @click="saveImportInfo">保存
          </el-button>
        </div>
      </div>

      <div class="fileInfo" style="justify-content: space-between;">
        <div style="display: flex;">
          <div class="fileTitle" style="width:35px;line-height:40px;">文件</div>
          <el-button size="mini" class="my-search selectFile" @click="parsingExcelBtn">选择文件</el-button>
          <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
          <div v-if="uploadFileName!=''" class="fileName">
            <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
            <span>{{ uploadFileName }}</span>
          </div>
        </div>
      </div>

      <div class="tableWrap">
        <el-table
          border
          height="240"
          :data="checkedData"
          style="width: 100%"
          :header-cell-style="{
            background: '#fff',
            color: '#333',
            fontSize: '16px',
            textAlign: 'center',
            fontWeight: 400,
            fontFamily: 'Source Han Sans CN'
          }"
          :row-class-name="tableRowClassName"
          stripe
        >
          <el-table-column prop="date" fixed align="center" label="是否通过" width="100" />
          <el-table-column width="400" align="center" prop="cpId" label="CPID" />
          <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
          <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
          <el-table-column width="150" align="center" prop="minePackageName" label="Mine Package" />
          <el-table-column width="260" align="center" prop="costItemName" label="费用科目" />
          <el-table-column width="120" align="center" prop="channelName" label="渠道" />
          <el-table-column width="120" align="center" prop="customerName" label="客户系统名称" />
          <el-table-column width="120" align="center" prop="brandName" label="品牌" />
          <el-table-column width="160" align="center" prop="productName" label="SKU" />
          <el-table-column width="190" align="center" prop="priceGearAmount" label="价格档位（RMB/Tin）">
            <template slot-scope="scope">
              <div class="priceLevelWrap">
                <div class="priceLevel" :class="scope.$index%3===0?'':scope.$index%3===1?'priceCenter':'priceLow'">{{ scope.row.priceGearAmount }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="220" align="center" prop="totalPriceGearVol" label="价格档位销量总计（CTN）">
            <template slot-scope="scope">
              <div class="priceLevelWrap">
                <div class="TotalNum">{{ scope.row.totalPriceGearVol }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="400" align="center" prop="distributorName" label="经销商" />
          <el-table-column width="120" align="center" prop="regionName" label="区域" />
          <el-table-column width="220" align="center" prop="systemRecommendedVol" label="系统拆分销量（CTN）" />
          <el-table-column width="220" align="center" prop="adjustedVol" label="调整后销量（CTN）" />
          <el-table-column width="220" align="center" prop="volDifference" label="销量差值（%）" />
          <el-table-column width="220" align="center" prop="adjustedAmount" label="调整后费用（RMB）" />
          <el-table-column width="120" align="center" prop="mechanismType" label="机制类型" />
          <el-table-column width="120" align="center" prop="mechanismName" label="机制名称" />
          <el-table-column width="120" align="center" prop="activityTheme" label="活动主题窗口" />
          <el-table-column width="120" align="center" prop="activityDateStart" label="活动开始时间" />
          <el-table-column width="120" align="center" prop="activityDateEnd" label="活动结束时间" />
          <el-table-column width="120" align="center" prop="judgmentType" label="系统判定" />
          <el-table-column width="120" align="center" prop="applyRemarks" label="申请人备注" />
          <el-table-column width="220" align="center" prop="poApprovalComments" label="Package Owner审批意见" />
          <el-table-column width="220" align="center" prop="finApprovalComments" label="Finance审批意见" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions } from '@/utils'
import API from '@/api/V1/v1.js'

export default {
  name: 'V1discountDiscountApproval',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        sku: '',
        month: ''
      },
      tableLoading: '',
      categoryArr: [{ label: '选项一', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          id: '12987123',
          name: '王小虎',
          number: 200,
          channel: 'NKA',
          amount3: 12,
          total: 20.0
        },
        {
          id: '12987124',
          name: '王小虎',
          number: 180,
          channel: 'NKA',
          amount3: 9,
          total: 21.0
        },
        {
          id: '12987125',
          name: '王小虎',
          number: 160,
          channel: 'NKA',
          amount3: 17,
          total: 68.5
        },
        {
          id: '12987126',
          name: '王小虎',
          number: '539',
          channel: 'NKA',
          amount3: 15,
          total: 47.0
        }
      ],
      dialogVisible: false,
      mainIdLocal: null,
      importVisible: false, // 导入弹窗
      uploadFileName: '',
      checkedData: []
    }
  },
  computed: {},
  mounted() {
    this.getTableData()
  },
  methods: {
    // 导入数据
    importData() {
      this.importVisible = true
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    // 关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    // 导入文件检索后保存
    saveImportInfo() {
      API.saveImportInfo().then(res => {
        console.log('111', res)
      }).catch()
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      formData.append('importType', 2)
      API.importV1(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.event.srcElement.value = '' // 置空
            this.uploadFileName = ''
            this.uploadFile = ''
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            if (response.data != null) {
              this.checkedData = response.data
            } else {
              this.checkedData = []
            }
          } else {
            this.$message({
              type: 'error',
              message: '上传失败，请重新上传。'
            })
          }
        })
        .catch(() => {})
    },
    // 下载excel模板
    downLoadElxModel() {
      API.downExcelTmpForV1({
        mainId: this.mainIdLocal,
        importType: 2
      }).then(
        response => {
          const fileName = 'V1审批模板' + new Date().getTime() + '.xlsx'
          //   res.data:请求到的二进制数据
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel'
          }) // 1.创建一个blob
          const link = document.createElement('a') // 2.创建一个a链接
          link.download = fileName // 3.设置名称
          link.style.display = 'none' // 4.默认不显示
          link.href = URL.createObjectURL(blob) // 5.设置a链接href
          document.body.appendChild(link) // 6.将a链接dom插入当前html中
          link.click() // 7.点击事件
          URL.revokeObjectURL(link.href) // 8.释放url对象
          document.body.removeChild(link) // 9.移除a链接dom
        })
    },
    // 关闭导入
    closeimportDialog() {
      this.importVisible = false
    },
    // 导出excel
    exportExcelInfo() {
      if (this.mainIdLocal === null || this.mainIdLocal === '') {
        this.$alert('未查询到数据，请稍后重试。', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        API.exportExcel({
          mainId: this.mainIdLocal
        }).then(
          response => {
            const fileName = '导出审批Excel' + new Date().getTime() + '.xlsx'
            //   res.data:请求到的二进制数据
            const blob = new Blob([response], {
              type: 'application/vnd.ms-excel'
            }) // 1.创建一个blob
            const link = document.createElement('a') // 2.创建一个a链接
            link.download = fileName // 3.设置名称
            link.style.display = 'none' // 4.默认不显示
            link.href = URL.createObjectURL(blob) // 5.设置a链接href
            document.body.appendChild(link) // 6.将a链接dom插入当前html中
            link.click() // 7.点击事件
            URL.revokeObjectURL(link.href) // 8.释放url对象
            document.body.removeChild(link) // 9.移除a链接dom
          })
      }
    },
    // v1流程审批
    agree() {
      this.$confirm('此操作将审批通过, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.approveV1({
          mainId: this.mainIdLocal,
          opinion: 'agree'
        }).then(res => {
          if (res.code === 1000) {
            this.$message({
              type: 'success',
              message: '审批成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '审批失败!'
            })
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    reject() {
      this.$confirm('此操作将驳回审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.approveV1({
          mainId: this.mainIdLocal,
          opinion: 'reject'
        }).then(res => {
          if (res.code === 1000) {
            this.$message({
              type: 'success',
              message: '审批成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '审批失败!'
            })
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      this.tableData = []
      API.getApprovePageV1({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize // 每页条数
      })
        .then((response) => {
          this.tableLoading = false
          this.tableData = response.data.records
          this.mainIdLocal = response.data.records[0].mainId
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch((error) => {})
    },
    search() {
      console.log('hh')
      // this.getTableData()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.MainContent {
  .priceLevelWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .priceLevel {
      width: 88px;
      height: 34px;
      line-height: 34px;
      border-radius: 17px;
      background: #f2e9ea;
      color: #e87071 !important;
      text-align: center;
    }
    .priceCenter {
      background: #ebfbf8;
      color: #38d7b7 !important;
    }
    .priceLow {
      background: #e1edf4;
      color: #4192d3 !important;
    }
    .TotalNum {
      font-weight: bold;
      color: #ff8912;
    }
  }
}
</style>

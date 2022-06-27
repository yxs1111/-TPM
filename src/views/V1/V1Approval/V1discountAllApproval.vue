<template>
  <div class="MainContent">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli" @keyup.enter="search">
          <span class="SelectliTitle">渠道:</span>
          <el-select v-model="filterObj.channelCode" clearable filterable placeholder="请选择" @change="getCustomerList">
            <el-option v-for="(item) in channelArr" :key="item.channelCode" :label="item.channelEsName" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户</span>
          <el-select v-model="filterObj.customerName" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌:</span>
          <el-select v-model="filterObj.brandCode" clearable filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <div class="TpmButtonBG" @click="downExcel">
          <img src="@/assets/images/export.png" alt="">
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border max-height="600" :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" width="460" prop="cpId" label="CPID" fixed />
      <el-table-column width="120" align="center" prop="yearAndMonth" label="活动月" />
      <el-table-column width="120" align="center" prop="costTypeName" label="费用类型" />
      <el-table-column width="190" align="center" prop="minePackageName" label="Mine Package" />
      <el-table-column width="180" align="center" prop="costItemName" label="费用科目" />
      <el-table-column width="120" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="220" align="center" prop="customerName" label="客户系统名称" />
      <el-table-column width="220" align="center" prop="brandName" label="品牌" />
      <el-table-column v-slot="{row}" width="220" align="right" prop="planVol" label="V1计划总销量(CTN)" >
        {{ getPlanCost(row.planVol) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="120" align="right" prop="planNewUserNum" label="目标新客数量" >
          {{ getPlanCost(row.planNewUserNum) }}
      </el-table-column>
      <el-table-column v-slot="{row}" width="220" align="right" prop="planCost" label="V1计划费用(RMB)">
        <!-- {{row.planCost.toLocaleString()}} -->
        {{ getPlanCost(row.planCost) }}
      </el-table-column>
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
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, parseTime, getTextMap ,FormateThousandNum} from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/V1/v1.js'
export default {
  name: 'V1discountNU',
  directives: { elDragDialog, permission },

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        brandCode: '',
        customerName: '',
        month: ''
      },
      categoryArr: [],
      permissions: getDefaultPermissions(),
      channelArr: [],
      skuArr: [],
      customerArr: [],
      tableData: [],
      BrandList: [],
      dialogVisible: false,
      mainIdLocal: null,
      submitBtn: 1,
      btnStatus: true,
      usernameLocal: ''
    }
  },
  computed: {},
  watch: {
    'filterObj.channelCode'() {
      this.filterObj.customerName = ''
      this.getCustomerList()
    }
  },
  mounted() {
    this.usernameLocal = localStorage.getItem('usernameLocal')
    // this.getEffectiveDate()
    this.getChannel()
    // this.getCustomerList()
    this.getBrandList()
  },
  methods: {
    getEffectiveDate() {
      API.getEffectiveDate({ version: 'V1' }).then((res) => {
        this.filterObj.month = res.data
        this.getTableData()
      })
    },
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          if(!this.$route.query.channelCode) {
            this.filterObj.channelCode = this.channelArr[0].channelEsName
          }else {
            this.filterObj.channelCode=this.$route.query.channelCode
          }
         
          this.getCustomerList()
          this.getEffectiveDate()
        }
      })
    },
    // 客户
    getCustomerList() {
      selectAPI
        .queryCustomerList({
          channelCode: this.filterObj.channelCode
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
          }
        })
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    // 获取表格数据
    getTableData() {
      // API.getPageNU({
      //   pageNum: this.pageNum, // 当前页
      //   pageSize: this.pageSize, // 每页条数
      //   customerName: this.filterObj.customerName,
      //   channelCode: this.filterObj.channelCode,
      //   brandCode: this.filterObj.brandCode,
      //   yearAndMonth: this.filterObj.month
      // }).then((response) => {
      //   if (response.data.records.length > 0) {
      //     this.tableData = response.data.records
      //     this.mainIdLocal = response.data.records[0].mainId
      //     this.submitBtn = response.data.records[0].isSubmit
      //     this.infoByMainId()
      //   } else {
      //     this.mainIdLocal = null
      //     this.btnStatus = false
      //   }
      //   this.pageNum = response.data.pageNum
      //   this.pageSize = response.data.pageSize
      //   this.total = response.data.total
      // })
    },
    // 通过与审批按钮控制
    infoByMainId() {
      API.infoByMainId({
        mainId: this.mainIdLocal
      }).then(res => {
        if (res.code === 1000) {
          if (res.data.version === 'V1' && res.data.assignee === this.usernameLocal && this.submitBtn === 0) {
            this.btnStatus = true
          } else {
            this.btnStatus = false
          }
        } else {
          this.btnStatus = false
        }
      }).catch()
    },
    //千分位分隔符+两位小数
    getPlanCost(num) {
      FormateThousandNum(num)
    },
    search() {
      this.pageNum=1
      this.getTableData()
    },
    // 导出
    downExcel() {
      if (this.tableData.length) {
        API.downExcelNU({
          customerName: this.filterObj.customerName,
          channelCode: this.filterObj.channelCode,
          brandCode: this.filterObj.brandCode,
          yearAndMonth: this.filterObj.month
        }).then((res) => {
          const timestamp = Date.parse(new Date())
          this.downloadFile(res, 'V1新客信息 -' + timestamp + '.xlsx') // 自定义Excel文件名
          this.$message.success('导出成功!')
        })
      } else {
        this.$message.info('数据为空')
      }
    },
    // 下载文件
    downloadFile(res, fileName) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
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
</style>

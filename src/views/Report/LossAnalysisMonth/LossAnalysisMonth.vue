<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker
            v-model="filterObj.yearAndMonthList"
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
          <el-select v-model="filterObj.channelCode" multiple placeholder="请选择" @change="getCustomerList">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <el-select v-model="filterObj.customerCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域：</span>
          <el-select v-model="filterObj.regionName" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.nameAbridge" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <el-select v-model="filterObj.brandName" clearable multiple filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select>
        </div>
        <div class="Selectli">
          <el-button type="primary" class="TpmButtonBG my-search" style="margin-bottom:0px;" @click="getReport">查询</el-button>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Date</span>
      </div>
      <div class="TpmButtonBG" @click="exportExcel">
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
            <el-table id="outTable" v-loading="tableLoading" :data="tableData" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName" style="width: 100%">
              <el-table-column v-slot="{row}" align="center" width="150" fixed prop="channel" label="数据维度">
                {{ row.name }}
              </el-table-column>
              <el-table-column align="center" label="Total">
                <!-- <el-table-column v-for="(item,index) in totalArr" :key="index" align="center"> -->
                <template>
                  <el-table-column v-slot="{row}" align="center" width="150" label="CPT" prop="CPT">
                    {{ FormateNum(row.CPT) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V1" prop="one">
                    {{ FormateNum(row.one) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V2" prop="two">
                    {{ FormateNum(row.two) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V3" prop="three">
                    {{ FormateNum(row.three) }}
                  </el-table-column>
                </template>
                <!-- </el-table-column> -->
              <!-- <el-table-column align="center" width="150" prop="name" label="CPT" />
                <el-table-column align="center" width="150" prop="name" label="V1" />
                <el-table-column align="center" width="150" prop="name" label="V2" />
                <el-table-column align="center" width="150" prop="name" label="V3" /> -->
              </el-table-column>
              <el-table-column v-for="(value,key) in tableData[0].channel" :key="key" align="center">
                <template v-slot:header>
                  {{ key }}
                </template>
                <template>
                  <el-table-column v-for="(item,index) in value" :key="index" align="center">
                    <template v-slot:header>
                      {{ item.customerName }}
                    </template>
                    <template>
                      <el-table-column align="center" width="150" label="CPT">
                        {{ FormateNum(item.cptCost) }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V1">
                        {{ FormateNum(item.voneCost) }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V2">
                        {{ FormateNum(item.vtwoCost) }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V3">
                        {{ FormateNum(item.vthreeCost) }}
                      </el-table-column>
                    </template>

                  </el-table-column>
                </template>
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
            <el-table id="outTable1" v-loading="tableLoading" :data="tableData" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName" style="width: 100%">
              <el-table-column v-slot="{row}" align="center" width="150" fixed prop="channel" label="数据维度">
                {{ row.name }}
              </el-table-column>
              <el-table-column align="center" label="Total">
                <template>
                  <el-table-column v-slot="{row}" align="center" width="150" label="CPT" prop="CPT">
                    {{ FormateNum(row.CPTFabe) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V1" prop="one">
                    {{ FormateNum(row.oneFabe) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V2" prop="two">
                    {{ FormateNum(row.twoFabe) }}
                  </el-table-column>
                  <el-table-column v-slot="{row}" align="center" width="150" label="V3" prop="three">
                    {{ FormateNum(row.threeFabe) }}
                  </el-table-column>
                </template>
              </el-table-column>
              <el-table-column v-for="(value,key) in tableData[0].channel" :key="key" align="center">
                <template v-slot:header>
                  {{ key }}
                </template>
                <template>
                  <el-table-column v-for="(item,index) in value" :key="index" align="center">
                    <template v-slot:header>
                      {{ item.customerName }}
                    </template>
                    <template>
                      <el-table-column align="center" width="150" label="CPT">
                        {{ item.cptFabe===null?'':item.cptFabe + '%' }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V1">
                        {{ item.voneFabe===null?'':item.voneFabe + '%' }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V2">
                        {{ item.vtwoFabe===null?'':item.vtwoFabe + '%' }}
                      </el-table-column>
                      <el-table-column align="center" width="150" label="V3">
                        {{ item.vthreeFabe===null?'':item.vthreeFabe + '%' }}
                      </el-table-column>
                    </template>

                  </el-table-column>
                </template>
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
import {
  getDefaultPermissions,
  getCurrentMonth1,
  ReportBgColorMap,
  FormateThousandNum,
  getYearAndMonthRange
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import APIReport from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import axios from 'axios'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  name: 'LossAnalysisHistory',
  directives: { elDragDialog, permission },

  data() {
    return {
      customerArr: [],
      channelOptions: [],
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
        yearAndMonthList: getCurrentMonth1(),
        type: '',
        regionCode: '',
        month: '',
        category: ''
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [{
        channel: []
      }],
      checkList: ['0', '1'],
      totalArr: [],
      CPT: [],
      one: [],
      two: [],
      three: [],
      BrandList: [],
      RegionList: []
    }
  },
  computed: {},
  mounted() {
    this.getReport()
    // this.getTableData()
    this.getQueryChannelSelect()
    // this.getRegionList()
    this.getBrandList()
    this.getRegionList()
  },
  methods: {
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
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
    // 下载报表
    exportExcel() {
      this.exportExcel1()
      const element = document.getElementById('outTable')
      const fix = element.querySelector('.el-table__fixed')
      let wb
      if (fix) {
        // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
        wb = XLSX.utils.table_to_book(
          document.querySelector('#outTable').removeChild(fix)
        )
        document.querySelector('#outTable').appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(document.querySelector('#outTable'))
      }
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          '损益分析报告费用.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    exportExcel1() {
      const element = document.getElementById('outTable1')
      const fix = element.querySelector('.el-table__fixed')
      let wb
      if (fix) {
        // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
        wb = XLSX.utils.table_to_book(
          document.querySelector('#outTable1').removeChild(fix)
        )
        document.querySelector('#outTable1').appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(document.querySelector('#outTable1'))
      }
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          '损益分析报告费比.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    // 客户
    getCustomerList() {
      selectAPI
        .getCustomerListByChannels({
          channelCodes: this.filterObj.channelCode
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
            // const list = []
            // this.customerArr.forEach((item) => {
            //   // if (list.length<10) {
            //   //   list.push(item.customerCsName)
            //   // }
            //   list.push(item.customerCsName)
            // })
            // this.filterObj.customerCode = list
          }
        })
    },
    // 获取渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptions = res.data
        // this.filterObj.channelCode = [this.channelOptions[0].channelEsName]
        // this.filterObj.channelCode = ['NKA']
        this.getCustomerList()
      })
    },
    // 获取页面信息
    getReport() {
      const yearAndMonthList = getYearAndMonthRange(
        this.filterObj.yearAndMonthList[0],
        this.filterObj.yearAndMonthList[1]
      )
      const params = {
        yearAndMonth: yearAndMonthList,
        channelName: this.filterObj.channelCode,
        customerName: this.filterObj.customerCode,
        brandName: this.filterObj.brandName,
        regionName: this.filterObj.regionName
      }
      APIReport.profitAndLossReport(params)
      // axios({
      //   method: 'post',
      //   url: '/profitAndLossReport/get',
      //   data: params
      // })
        // .get('/profitAndLossReport/get', { params: {
        //   yearAndMonth: '',
        //   channelName: '',
        //   customerName: '',
        //   brandName: '',
        //   regionName: ''
        // }})
        .then((response) => {
          this.tableData = [{
            channel: []
          }]
          const list = response.data
          const AllList = []
          for (let index = 0; index < list.length - 1; index++) {
            const sList = list[index].cost
            for (let sIndex = 0; sIndex < sList.length; sIndex++) {
              const element = sList[sIndex]
              AllList.push(element)
            }
          }
          // console.log(AllList)
          // 对version进行分组处理
          const AllData = {}
          for (let m = 0; m < AllList.length; m++) {
            // 根据version 进行分组
            if (!AllData[AllList[m].version]) {
              const obj = {
                name: '',
                channel: []
              }
              Object.assign(obj, { name: AllList[m].version })
              var arr = obj.channel
              arr.push(AllList[m])
              AllData[AllList[m].version] = obj
            } else {
              AllData[AllList[m].version].channel.push(AllList[m])
            }
          }
          // 对渠道进行分组
          for (const key in AllData) {
            if (Object.hasOwnProperty.call(AllData, key)) {
              const channelList = AllData[key].channel
              const channelData = {}
              for (let m = 0; m < channelList.length; m++) {
                // 根据channelName 进行分组
                if (!channelData[channelList[m].channelName]) {
                  var arr1 = []
                  arr1.push(channelList[m])
                  channelData[channelList[m].channelName] = arr1
                } else {
                  channelData[channelList[m].channelName].push(channelList[m])
                }
              }
              AllData[key].channel = channelData
            }
          }
          console.log(AllData)
          let tableList = []
          for (const key in AllData) {
            if (Object.hasOwnProperty.call(AllData, key)) {
              const element = AllData[key]
              tableList.push(element)
            }
          }
          if (tableList.length === 0) {
            tableList = [{
              channel: []
            }]
          }
          this.tableData = tableList
          // total
          const total = list[list.length - 1].cost
          // console.log('uuuuuu', this.tableData)
          for (let i = 0; i < total.length; i++) {
            this.tableData[i].CPT = total[i].cptCost
            this.tableData[i].one = total[i].voneCost
            this.tableData[i].two = total[i].vtwoCost
            this.tableData[i].three = total[i].vthreeCost

            this.tableData[i].CPTFabe = total[i].cptFabe
            this.tableData[i].oneFabe = total[i].voneFabe
            this.tableData[i].twoFabe = total[i].vtwoFabe
            this.tableData[i].threeFabe = total[i].vthreeFabe
          }
          this.$forceUpdate()
          // console.log('wwwww', this.tableData)
        })
        .catch((error) => {
          console.log(error)
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

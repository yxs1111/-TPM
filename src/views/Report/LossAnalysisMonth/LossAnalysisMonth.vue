<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker v-model="filterObj.yearAndMonthList" type="monthrange" format="yyyy-MM" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <MutiSelect v-model="filterObj.channelCode" :list="channelOptions" :props="{value:'channelEsName',label:'channelEsName',key:'channelCode'}" />
          <!-- <el-select v-model="filterObj.channelCode" multiple placeholder="请选择" @change="getCustomerList">
            <el-option v-for="item,index in channelOptions" :key="index" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <MutiSelect v-model="filterObj.customerCode" :list="customerArr" :props="{value:'customerCsName',label:'customerCsName',key:'customerCode'}" />
          <!-- <el-select v-model="filterObj.customerCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in customerArr" :key="item.customerCode + index" :label="item.customerCsName" :value="item.customerCsName" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域：</span>
          <MutiSelect v-model="filterObj.regionName" :list="RegionList" :props="{value:'nameAbridge',label:'name',key:'nameAbridge'}" />
          <!-- <el-select v-model="filterObj.regionName" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.nameAbridge" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <MutiSelect v-model="filterObj.brandName" :list="BrandList" :props="{value:'brandName',label:'brandName',key:'brandName'}" />
          <!-- <el-select v-model="filterObj.brandName" clearable multiple filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <el-button type="primary" class="TpmButtonBG my-search" style="margin-bottom:0px;" @click="getReport">查询</el-button>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG exportDataButton">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Data</span>
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
            <el-table id="outTable" :key="tableKey" v-loading="tableLoading" :data="tableData" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName"
              style="width: 100%">
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
                <!-- NKA  OR EC -->
                <template v-slot:header>
                  {{ key }}
                </template>
                <template>
                  <el-table-column v-for="(item,index) in value" :key="index" align="center">
                    <template v-slot:header>
                      {{ item.customerName }}
                    </template>
                    <template>
                      <el-table-column v-slot="{row}" align="center" width="150" label="CPT">
                        <!-- {{ FormateNum(item.cptCost) }} -->
                        {{ FormateNum(row.channel[key][index].cptCost) }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V1">
                        <!-- {{ FormateNum(item.voneCost) }} -->
                        {{ FormateNum(row.channel[key][index].voneCost) }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V2">
                        <!-- {{ FormateNum(item.vtwoCost) }} -->
                        {{ FormateNum(row.channel[key][index].vtwoCost) }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V3">
                        <!-- {{ FormateNum(item.vthreeCost) }} -->
                        {{ FormateNum(row.channel[key][index].vthreeCost) }}
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
            <el-table id="outTable1" :key="tableKey2" v-loading="tableLoading" :data="tableDataRange" border :header-cell-class-name="headerStyle"
              :row-class-name="tableRowClassName" style="width: 100%">
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
                      <el-table-column v-slot="{row}" align="center" width="150" label="CPT">
                        <!-- {{ FormateNum(row.channel[key][index].vthreeCost) }} -->
                        {{ row.channel[key][index].cptFabe===null?'':row.channel[key][index].cptFabe + '%' }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V1">
                        {{ row.channel[key][index].voneFabe===null?'':row.channel[key][index].voneFabe + '%' }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V2">
                        {{ row.channel[key][index].vtwoFabe===null?'':row.channel[key][index].vtwoFabe + '%' }}
                      </el-table-column>
                      <el-table-column v-slot="{row}" align="center" width="150" label="V3">
                        {{ row.channel[key][index].vthreeFabe===null?'':row.channel[key][index].vthreeFabe + '%' }}
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
  getYearAndMonthRange,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import APIReport from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXStyle from 'xlsx-style'
import MutiSelect from '@/components/MutiSelect'
export default {
  name: 'LossAnalysisHistory',
  directives: { elDragDialog, permission },
  components: { MutiSelect },
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
        category: '',
        channelCode: [],
        customerCode: [],
        brandName: [],
        regionName: [],
      },
      tableLoading: '',
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [
        {
          channel: [],
        },
      ],
      tableDataRange: [],
      checkList: ['0', '1'],
      totalArr: [],
      CPT: [],
      one: [],
      two: [],
      three: [],
      BrandList: [],
      RegionList: [],
      tableKey: 0, //el-table key
      tableKey2: 0, //el-table key
    }
  },
  computed: {},
  mounted() {
    this.getReport()
    this.getQueryChannelSelect()
    // this.getRegionList()
    this.getBrandList()
    this.getRegionList()
  },
  watch: {
    'filterObj.channelCode'() {
      this.getCustomerList()
    },
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
      const fix = document.querySelector('#outTable .el-table__fixed')
      // 创建一个workbook对象
      let wb = XLSX.utils.book_new()
      let ws
      // debugger
      if (fix) {
        //生成 V1 worksheet对象
        ws = XLSX.utils.table_to_sheet(
          document.querySelector('#outTable .el-table__fixed')
        )
      }
      if (document.querySelector('#outTable1 .el-table__fixed')) {
        //追加v2 dom到 worksheet对象，origin：-1 表示从上一个表格的末尾行追加
        XLSX.utils.sheet_add_dom(
          ws,
          document.querySelector('#outTable1 .el-table__fixed'),
          { origin: -1 }
        )
      }
      // debugger
      Object.keys(ws).forEach((key) => {
        //这里遍历单元格给单元格对象设置属性,s为控制样式的属性
        if (key.indexOf('!') < 0) {
          ws[key].s = {
            alignment: {
              //对齐方式
              horizontal: 'center', //水平居中
              vertical: 'center', //竖直居中
              wrapText: true, //自动换行
            },
          }
        }
      })
      //把worksheet对象添加进workbook对象，第三个参数是excel中sheet的名字
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      const wbout = XLSXStyle.write(wb, {
        type: 'binary',
        bookType: 'xlsx',
      })
      try {
        FileSaver.saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
          '损益分析报告.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    //字符串转ArrayBuffer
    s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    },
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
    },
    // 客户
    getCustomerList() {
      selectAPI
        .getCustomerListByChannels({
          channelCodes: this.filterObj.channelCode,
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
        // yearAndMonth: ['202203', '202204'],
        yearAndMonth: yearAndMonthList,
        channelName: this.filterObj.channelCode,
        customerName: this.filterObj.customerCode,
        brandName: this.filterObj.brandName,
        regionName: this.filterObj.regionName,
      }
      APIReport.profitAndLossReport(params)
        .then((response) => {
          this.tableData = [
            {
              channel: [],
            },
          ]
          const list = response.data
          const AllList = []
          for (let index = 0; index < list.length - 1; index++) {
            const sList = list[index].cost
            for (let sIndex = 0; sIndex < sList.length; sIndex++) {
              // debugger
              const element = sList[sIndex]
              if (element.version == 'Price Promotion') {
                let PosObj = {
                  version: 'POS Vol(ctn)',
                  cptCost: element.cptPosVol,
                  voneCost: element.onePosVol,
                  vtwoCost: element.twoPosVol,
                  vthreeCost: element.threePosVol,
                  channelName: element.channelName,
                  customerName: element.customerName,
                }
                let GmvObj = {
                  version: 'GMV(KRMB)',
                  cptCost: element.cptGmv,
                  voneCost: element.oneGmv,
                  vtwoCost: element.twoGmv,
                  vthreeCost: element.threeGmv,
                  channelName: element.channelName,
                  customerName: element.customerName,
                }
                AllList.push(PosObj)
                AllList.push(GmvObj)
              }
              AllList.push(element)
            }
            // AllList.push(versionList)
          }

          // console.log(AllList)
          // 对version进行分组处理
          const AllData = {}
          for (let m = 0; m < AllList.length; m++) {
            // 根据version 进行分组
            if (!AllData[AllList[m].version]) {
              const obj = {
                name: '',
                channel: [],
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

          let tableList = []
          console.log(AllData)
          for (const key in AllData) {
            if (Object.hasOwnProperty.call(AllData, key)) {
              const element = AllData[key]
              tableList.push(element)
            }
          }
          if (tableList.length === 0) {
            //表格数据进行初始化
            tableList = [
              {
                channel: [],
                name: 'POS Vol(ctn)',
              },
              {
                channel: [],
                name: 'GMV(KRMB)',
              },
              {
                channel: [],
                name: 'Price Promotion',
              },
              {
                channel: [],
                name: 'New User',
              },
            ]
          }
          this.tableData = tableList
          // total
          const total = list[list.length - 1].cost
          const TotalList = []
          for (let m = 0; m < total.length; m++) {
            const element = total[m]
            if (element.version == 'Price Promotion') {
              let PosObj = {
                version: 'POS Vol(ctn)',
                cptCost: element.cptPosVol,
                voneCost: element.onePosVol,
                vtwoCost: element.twoPosVol,
                vthreeCost: element.threePosVol,
                channelName: element.channelName,
                customerName: element.customerName,
              }
              let GmvObj = {
                version: 'GMV(KRMB)',
                cptCost: element.cptGmv,
                voneCost: element.oneGmv,
                vtwoCost: element.twoGmv,
                vthreeCost: element.threeGmv,
                channelName: element.channelName,
                customerName: element.customerName,
              }
              TotalList.push(PosObj)
              TotalList.push(GmvObj)
            }
            TotalList.push(element)
          }

          for (let i = 0; i < TotalList.length; i++) {
            if (
              this.tableData[i].name == 'Price Promotion' ||
              this.tableData[i].name == 'New User'
            ) {
              this.tableData[i].CPT = TotalList[i].cptCost
              this.tableData[i].one = TotalList[i].voneCost
              this.tableData[i].two = TotalList[i].vtwoCost
              this.tableData[i].three = TotalList[i].vthreeCost
              this.tableData[i].CPTFabe = TotalList[i].cptFabe
              this.tableData[i].oneFabe = TotalList[i].voneFabe
              this.tableData[i].twoFabe = TotalList[i].vtwoFabe
              this.tableData[i].threeFabe = TotalList[i].vthreeFabe
            } else if (
              this.tableData[i].name == 'POS Vol(ctn)' ||
              this.tableData[i].name == 'GMV(KRMB)'
            ) {
              this.tableData[i].CPT = TotalList[i].cptCost
              this.tableData[i].one = TotalList[i].voneCost
              this.tableData[i].two = TotalList[i].vtwoCost
              this.tableData[i].three = TotalList[i].vthreeCost
            }
          }
          this.$forceUpdate()
          this.tableDataRange = []
          for (let s = 0; s < this.tableData.length; s++) {
            const element = this.tableData[s]
            if (
              element.name == 'Price Promotion' ||
              element.name == 'New User'
            ) {
              this.tableDataRange.push(element)
            }
          }
          this.tableKey = Math.random()
          this.tableKey2 = Math.random()
        })
        .catch((error) => {
          console.log(error)
        })
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
  .ContentWrap {
    width: 100%;
    height: calc(100% - 200px);
    overflow-y: auto;
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

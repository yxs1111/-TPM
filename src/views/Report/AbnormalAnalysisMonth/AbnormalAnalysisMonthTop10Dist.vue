<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">异常类别：</span>
          <el-select v-model="filterObj.exception" placeholder="请选择">
            <el-option v-for="(item, index) in ['数量','费用']" :key="index+1" :label="item" :value="index+1" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <!-- <SelectMonth v-on:multipleMonth="getMultipleMonth" :defaultMonth='filterObj.month' :Disabled="false" /> -->
          <el-date-picker v-model="filterObj.month" type="monthrange" format='yyyy-MM' value-format='yyyyMM' range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
          </el-date-picker>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">CostType:</span>
          <el-select v-model="filterObj.CostType" placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in CostTypeList" :key="index" :label="item.costType" :value="item.costTypeNumber" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine package:</span>
          <el-select v-model="filterObj.MinePackage" placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.id" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">品牌：</span>
          <MutiSelect v-model="filterObj.brandCode" :list="BrandList" :props="{value:'brandName',label:'brandName',key:'brandName'}" />
          <!-- <el-select v-model="filterObj.brandCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in BrandList" :key="index" :label="item.brandName" :value="item.brandName" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域:</span>
          <MutiSelect v-model="filterObj.regionCode" :list="RegionList" :props="{value:'nameAbridge',label:'name',key:'nameAbridge'}" />
          <!-- <el-select v-model="filterObj.regionCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="(item, index) in RegionList" :key="index" :label="item.name" :value="item.nameAbridge" />
          </el-select> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU:</span>
          <MutiSelect v-model="filterObj.productCode" :list="skuList" :props="{value:'productEsName',label:'productEsName',key:'productEsName'}" />
          <!-- <el-select v-model="filterObj.productCode" clearable multiple collapse-tags filterable placeholder="请选择">
            <el-option v-for="item,index in skuList" :key="index" :label="item.productEsName" :value="item.productEsName" />
          </el-select> -->
        </div>

      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.value" v-for="item in dynamicColumn" :key="item.value">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-button type="primary" class="TpmButtonBG my-search" @click="search">查询</el-button>
      <div class="TpmButtonBG exportDataButton">
        <img src="../../../assets/images/export.png" alt="">
        <span class="text">导出Raw Data</span>
      </div>
    </div>
    <div class="colorWrap">
      <div class="TpmButtonBGWrap">
        <div class="TpmButtonBG" @click="exportExcel">
          <img src="../../../assets/images/downloadIcon.png" alt="">
          <span class="text">下载报表</span>
        </div>
      </div>
      <div class="colorBar">
        <div class="colorli">
          <div class="color" />
          <span>V1</span>
        </div>
        <div class="colorli">
          <div class="color v2color" />
          <span>V2</span>
        </div>
        <div class="colorli">
          <div class="color v3color" />
          <span>V3</span>
        </div>
      </div>
    </div>
    <div class="tableContentWrap">
      <div class="ContentWrap">
        <el-table :data="V1Data" v-if="V1Data.length" id="outTable" :key="tableKey" :header-cell-class-name="headerStyle" :cell-style="columnStyle" style="width: 100%">
          <el-table-column align="center" fixed="left" prop="name" label="数据维度" />
          <el-table-column align="center" prop="name" v-for="item,key in V1Data[0].month" :key="'V1'+item.yearAndMonth+'-'+key">
            <template v-slot:header>
              {{ item.yearAndMonth }}
            </template>
            <template>
              <el-table-column align="center" width="140" v-for="(titleItem,index) in tableColumnList" :key="'V1'+item.yearAndMonth+'-'+key+index">
                <template v-slot:header>
                  {{ titleItem.title }}
                </template>
                <template slot-scope="{row}">
                  <div v-if="String(row.month[key][titleItem.value]).indexOf('%')==-1&&row.month[key][titleItem.value]!=null">
                    {{FormateNum(row.month[key][titleItem.value])}}
                  </div>
                  <div v-else>
                    {{row.month[key][titleItem.value]}}
                  </div>
                </template>
              </el-table-column>
            </template>

          </el-table-column>
        </el-table>
        <el-table :data="V2Data" v-if="V2Data.length" id="outTable2" :key="tableKey2" :header-cell-class-name="headerStyle" :cell-style="columnStyle" style="width: 100%">
          <el-table-column align="center" fixed="left" prop="name" label="数据维度" />
          <el-table-column align="center" prop="name" v-for="item,key in V2Data[0].month" :key="'V2'+item.yearAndMonth+'-'+key">
            <template v-slot:header>
              {{ item.yearAndMonth }}
            </template>
            <template>
              <el-table-column align="center" width="140" v-for="(titleItem,index) in tableColumnList" :key="'V2'+item.yearAndMonth+'-'+key+index">
                <template v-slot:header>
                  {{ titleItem.title }}
                </template>
                <template slot-scope="{row}">
                  <div v-if="String(row.month[key][titleItem.value]).indexOf('%')==-1&&row.month[key][titleItem.value]!=null">
                    {{FormateNum(row.month[key][titleItem.value])}}
                  </div>
                  <div v-else>
                    {{row.month[key][titleItem.value]}}
                  </div>
                </template>
              </el-table-column>
            </template>

          </el-table-column>
        </el-table>
        <el-table :data="V3Data" v-if="V3Data.length" id="outTable3" :key="tableKey3" :header-cell-class-name="headerStyle" :cell-style="columnStyle" style="width: 100%">
          <el-table-column align="center" fixed="left" prop="name" label="数据维度" />
          <el-table-column align="center" prop="name" v-for="item,key in V3Data[0].month" :key="'V3'+item.yearAndMonth+'-'+key">
            <template v-slot:header>
              {{ item.yearAndMonth }}
            </template>
            <template>
              <el-table-column align="center" width="140" v-for="(titleItem,index) in tableColumnList" :key="'V3'+item.yearAndMonth+'-'+key+index">
                <template v-slot:header>
                  {{ titleItem.title }}
                </template>
                <template slot-scope="{row}">
                  <div v-if="String(row.month[key][titleItem.value]).indexOf('%')==-1&&row.month[key][titleItem.value]!=null">
                    {{FormateNum(row.month[key][titleItem.value])}}
                  </div>
                  <div v-else>
                    {{row.month[key][titleItem.value]}}
                  </div>
                </template>
              </el-table-column>
            </template>

          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  ReportCheckList,
  FormateThousandNum,
  dynamicColumn,
  dynamicColumnCost,
  getCurrentMonth,
  ReportBgColorMap,
  createCellPos,
  s2ab,
  getMonthBetween,
} from '@/utils'
import API from '@/api/report/report.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import SelectMonth from '@/components/SelectMonth/SelectMonth.vue'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import MutiSelect from '@/components/MutiSelect'
import XLSXStyle from 'xlsx-style'

export default {
  name: 'AbnormalAnalysisMonthByChannel',
  directives: { elDragDialog, permission },
  components: { SelectMonth, MutiSelect },
  data() {
    return {
      filterObj: {
        exception: 1,
        month: getCurrentMonth(),
        CostType: 'Disc',
        MinePackage: 14,
        regionCode: [],
        brandCode: [],
        productCode: [],
      },
      BrandList: [],
      permissions: getDefaultPermissions(),
      V1Data: [],
      V2Data: [],
      V3Data: [],
      skuList: [],
      RegionList: [],
      MinePackageList: [],
      CostTypeList: [],
      checkList: [], //已选中的列
      tableColumnList: [], //动态列
      dynamicColumn: dynamicColumn(), //展示列选项框
      ReportBgColorMap: ReportBgColorMap(), //动态列背景色
      tableKey: 0, //el-table key
      tableKey2: 0, //el-table key
      tableKey3: 0, //el-table key
      columnCount: 0, //列数
    }
  },
  computed: {},
  mounted() {
    this.checkList = ReportCheckList()

    this.getMinePackage()
    this.getSkuSelect()
    this.getRegionList()
    this.getBrandList()
    this.getCostTypeList()
    this.getTableData()
  },
  watch: {
    //动态列渲染
    checkList() {
      this.tableRender()
    },
    'filterObj.CostType'() {
      this.filterObj.MinePackage = ''
      this.getMinePackage()
    },
    'filterObj.exception'() {
      if (this.filterObj.exception == 1) {
        this.dynamicColumn = dynamicColumn()
        this.tableRender()
      } else {
        this.dynamicColumn = dynamicColumnCost
        this.tableRender()
      }
      this.getTableData()
    },
  },
  methods: {
    // 获取表格数据
    getTableData() {
      API.getExceptionAnalysisReport({
        exceptionType: this.filterObj.exception,
        startDate: this.filterObj.month[0],
        endDate: this.filterObj.month[1],
        minePackageId: this.filterObj.MinePackage,
        queryType: 'top',
        brandCodeList: this.filterObj.brandCode,
        regionCodeList: this.filterObj.regionCode,
        productCodeList: this.filterObj.productCode,
      }).then((response) => {
        if (Object.keys(response.data).length) {
          let AllData = response.data
          this.V1Data = []
          this.V2Data = []
          this.V3Data = []
          for (const version in AllData) {
            if (Object.hasOwnProperty.call(AllData, version)) {
              let yearMonthObj = AllData[version]
              let list = []
              let haveMonth = []
              //版本分组处理
              for (const key in yearMonthObj) {
                if (Object.hasOwnProperty.call(yearMonthObj, key)) {
                  const element = yearMonthObj[key]
                  for (let index = 0; index < element.length; index++) {
                    list.push(element[index])
                  }
                }
                //存当前版本的 月份
                haveMonth.push(key)
              }
              let versionObj = {}
              // 渠道分组处理
              for (let m = 0; m < list.length; m++) {
                if (!versionObj[list[m].distributorName]) {
                  var arr = []
                  arr.push(list[m])
                  versionObj[list[m].distributorName] = arr
                } else {
                  versionObj[list[m].distributorName].push(list[m])
                }
              }

              let versionList = []
              for (const channelKey in versionObj) {
                if (Object.hasOwnProperty.call(versionObj, channelKey)) {
                  let obj = {
                    version: version,
                    name: channelKey,
                    month: versionObj[channelKey],
                    haveMonth,
                  }
                  if (versionObj[channelKey].length == haveMonth.length) {
                    //月份排序
                    obj.month.sort(function (a, b) {
                      return Number(a.yearAndMonth) - Number(b.yearAndMonth)
                    })
                    versionList.push(obj)
                  } else {
                    //生成缺失的月份
                    let missMonth = []
                    for (let i = 0; i < obj.haveMonth.length; i++) {
                      let month = obj.haveMonth[i]
                      for (let m = 0; m < obj.month.length; m++) {
                        let currentMonth = obj.month[m].yearAndMonth
                        if (month != currentMonth) {
                          missMonth.push(month)
                        } else continue
                      }
                    }
                    //补奇缺失月份
                    for (let index = 0; index < missMonth.length; index++) {
                      obj.month.push({
                        channelCode: '-',
                        countNum: '-',
                        exceptionOneNum: '-',
                        exceptionOneRange: '-',
                        exceptionThreeNum: '-',
                        exceptionThreeRange: '-',
                        exceptionTwoNum: '-',
                        exceptionTwoRange: '-',
                        passNum: '-',
                        passRange: '-',
                        version: '',
                        yearAndMonth: missMonth[index],
                      })
                    }
                    //月份排序
                    obj.month.sort(function (a, b) {
                      return Number(a.yearAndMonth) - Number(b.yearAndMonth)
                    })
                    versionList.push(obj)
                  }
                }
              }
              //排序
              AllData[version] = versionList
            }
            if (version == 'v1') {
              this.V1Data = [...AllData.v1]
            }
            if (version == 'v2') {
              this.V2Data = [...AllData.v2]
            }
            if (version == 'v3') {
              this.V3Data = [...AllData.v3]
            }
          }
        } else {
          this.V1Data = []
          this.V2Data = []
          this.V3Data = []
        }
      })
    },
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
      })
    },
    getRegionList() {
      selectAPI.getRegionList().then((res) => {
        if (res.code === 1000) {
          this.RegionList = res.data
        }
      })
    },
    getCostTypeList() {
      selectAPI
        .getCostTypeList({
          costLevel: 1,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.CostTypeList = res.data
          }
        })
    },
    getMinePackage() {
      selectAPI
        .queryMinePackageSelect({
          parentId: this.filterObj.CostType,
        })
        .then((res) => {
          this.MinePackageList = res.data
        })
    },
    getBrandList() {
      selectAPI.getBrand({}).then((res) => {
        if (res.code === 1000) {
          this.BrandList = res.data
        }
      })
    },
    //获取子组件传递的多个月份值
    getMultipleMonth(data) {
      this.filterObj.month = data
      this.getTableData()
    },
    search() {
      this.getTableData()
    },
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
      if (document.querySelector('#outTable2 .el-table__fixed')) {
        //追加v2 dom到 worksheet对象，origin：-1 表示从上一个表格的末尾行追加
        XLSX.utils.sheet_add_dom(
          ws,
          document.querySelector('#outTable2 .el-table__fixed'),
          { origin: -1 }
        )
      }
      if (document.querySelector('#outTable3 .el-table__fixed')) {
        //追加v3 dom到 worksheet对象，origin：-1 表示从上一个表格的末尾行追加
        XLSX.utils.sheet_add_dom(
          ws,
          document.querySelector('#outTable3 .el-table__fixed'),
          { origin: -1 }
        )
      }
      // debugger
      let borderAll = {
        color: { auto: 1 },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
      ws['!cols'] = this.getColumWidth()
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
        if (
          key.replace(/[^0-9]/gi, '') === '1' ||
          key.replace(/[^0-9]/gi, '') === '2'
        ) {
          ws[key].s = {
            border: borderAll,
            fill: {
              //背景色
              fgColor: { rgb: '4192D3' },
            },
            font: {
              color: { rgb: 'FFFFFFFF' },
            },
            alignment: {
              //对齐方式
              horizontal: 'center', //水平居中
              vertical: 'center', //竖直居中
              wrapText: true, //自动换行
            },
          }
        }
      })
      this.addRangeBorder(ws['!merges'], ws)
      //把worksheet对象添加进workbook对象，第三个参数是excel中sheet的名字
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1')
      const wbout = XLSXStyle.write(wb, {
        type: 'binary',
        bookType: 'xlsx',
      })
      try {
        FileSaver.saveAs(
          new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
          '异常分析报告-bychannel.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    //需要传入列的总数
    initColum() {
      let AllColum = []
      for (let index = 0; index < this.columnCount; index++) {
        AllColum.push(createCellPos(index))
      }
      return AllColum
    },
    addRangeBorder(range, ws) {
      //得到所有列名
      let cols = this.initColum()
      range.forEach((item) => {
        //添加单元格border样式
        let style = {
          s: {
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            },
          },
        }
        // 处理合并行
        for (let i = item.s.c; i <= item.e.c; i++) {
          ws[`${cols[i]}${Number(item.e.r) + 1}`] =
            ws[`${cols[i]}${Number(item.e.r) + 1}`] || style
          // 处理合并列
          for (let k = item.s.r + 2; k <= item.e.r + 1; k++) {
            ws[cols[i] + k] = ws[cols[k] + item.e.r] || style
          }
        }
      })
      return ws
    },
    //获取数组宽度列表
    getColumWidth() {
      let yearAndMonthList = this.filterObj.month
      let start = ''
      let end = ''
      if (yearAndMonthList[0]) {
        start =
          yearAndMonthList[0].substring(0, 4) +
          '-' +
          yearAndMonthList[0].substring(4)
      }
      if (yearAndMonthList[0]) {
        end =
          yearAndMonthList[1].substring(0, 4) +
          '-' +
          yearAndMonthList[1].substring(4)
      }
      let MonthList = getMonthBetween(start, end)

      let columnCount = MonthList.length * this.checkList.length + 1
      this.columnCount = columnCount
      let ColumWidthList = []
      for (let index = 0; index < columnCount; index++) {
        if (index == 0) {
          ColumWidthList.push({
            wpx: 250,
          })
        } else {
          ColumWidthList.push({
            wpx: 150,
          })
        }
      }
      return ColumWidthList
    },
    //列表渲染
    tableRender() {
      this.tableColumnList = this.dynamicColumn.filter(
        (item) => this.checkList.indexOf(item.value) != -1
      )
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
      this.tableKey3 = Math.random()
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      return this.ReportBgColorMap[row.version]
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1) {
        return 'headerStyle'
      }
    },
    // 格式化--千位分隔符、两位小数
    FormateNum(num) {
      return FormateThousandNum(num)
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
      white-space: nowrap;
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
    height: calc(100% - 230px);
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
  .ContentWrap {
    height: calc(100% - 10px);
    overflow-y: auto;
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

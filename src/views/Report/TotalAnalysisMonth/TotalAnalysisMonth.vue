<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">活动月：</span>
          <el-date-picker v-model="filterObj.yearAndMonthList" type="monthrange" format="yyyy-MM" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份" />
          <!-- <el-date-picker v-model="filterObj.month" multiple  type="month" value-format="yyyy-MM" placeholder="选择月">
          </el-date-picker> -->
          <!-- <SelectMonth  :Disabled="false" /> -->
          <!-- <el-date-picker v-model="filterObj.month" disabled type="monthrange" format="yyyy-MM" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" /> -->
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <MutiSelect v-model="filterObj.channelCode" :list="channelOptions" :props="{value:'channelEsName',label:'channelEsName',key:'channelCode'}" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户名称：</span>
          <MutiSelect v-model="filterObj.customerCode" :list="customerArr" :props="{value:'customerCsName',label:'customerCsName',key:'customerCode'}" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU：</span>
          <MutiSelect v-model="filterObj.productName" :list="skuList" :props="{value:'productEsName',label:'productEsName',key:'productEsName'}" />
        </div>
      </div>
    </div>
    <div class="checkBoxWrap">
      <div class="checkBox">
        <span class="checkBoxTitle">显示内容:</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item,index in dynamicColumn" :key="index" :label="item.value">{{ getCheckTitle(item.title) }}</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-button type="primary" class="TpmButtonBG my-search" @click="search">查询</el-button>
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
    <div class="tableContentWrap">
      <el-table v-if="tableData.length" id="outTable" :key="tableKey" :data="tableData" border :header-cell-class-name="headerStyle" :row-class-name="tableRowClassName"
        :cell-style="columnStyle" :max-height="maxheight" style="width: 100%">
        <el-table-column width="150" fixed>
          <template slot="header">
            <div class="filstColumn">RMB/tin</div>
          </template>
          <template slot-scope="scope">
            <div class="filstColumn">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="item,key in tableData[0].month" :key="key" align="center" prop="name">
          <template v-slot:header>
            {{ key }}
          </template>
          <template>
            <el-table-column v-for="(CustomerItem,CustomerKey) in item" :key="CustomerKey" align="center">
              <template v-slot:header>
                {{ CustomerItem.customerName1 }}
              </template>
              <template>
                <el-table-column v-for="(titleItem,index) in tableColumnList" :key="index" align="center" :width="titleItem.width">
                  <template v-slot:header>
                    <!-- {{ titleItem.title }} -->
                    <span v-html="titleItem.title"></span>
                  </template>
                  <template slot-scope="{row}">
                    <div class="NumWrap">
                      <div v-if="compareNode(key,index)">  {{ FormateNum(row.month[key][CustomerKey][titleItem.value]) }}{{ titleItem.value=='priceExecutionRate1'?'%':titleItem.value=='priceExecutionRate2'?'%':'' }}</div>
                      <!-- {{ FormateNum(row.month[key][CustomerKey][titleItem.value]) }}{{ titleItem.value=='priceExecutionRate1'?'%':titleItem.value=='priceExecutionRate2'?'%':'' }} -->
                    </div>
                  </template>
                </el-table-column>
              </template>

            </el-table-column>
          </template>

        </el-table-column>
      </el-table>
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
  createCellPos,
  s2ab,
  getHeight,
} from '@/utils'
import API from '@/api/report/report.js'
import SelectMonth from '@/components/SelectMonth/SelectMonth.vue'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'
import MutiSelect from '@/components/MutiSelect'
export default {
  name: 'TotalAnalysisMonth',
  components: { SelectMonth, MutiSelect },
  directives: { elDragDialog, permission },
  data() {
    return {
      total: 1,
      pageSize: 10,
      pageNum: 1,
      filterObj: {
         yearAndMonthList: [],
        // yearAndMonthList: getCurrentMonth1(),
        customerCode: [],
        channelCode: [],
        productName: [],
      },
      permissions: getDefaultPermissions(),
      // 表格列
      tableOption: [
        { label: 'V1' },
        { label: 'V2' },
        { label: 'V3谈判前' },
        { label: 'V3谈判后' },
        { label: '价格执行率1# V3谈判前  VS  V1' },
        { label: '价格执行率1# V3谈判后  VS  V1' },
      ],
      tableData: [],
      channelOptions: [],
      customerArr: [],
      AllCustomerList: [],
      skuList: [],
      checkList: [], // 已选中的列
      tableColumnList: [], // 动态列
      dynamicColumn: [
        { title: 'V1', value: 'v1Avg', width: 90 },
        { title: 'V2', value: 'v2Avg', width: 90 },
        { title: 'V3谈判前', value: 'v3BeforeAvg', width: 100 },
        { title: 'V3谈判后', value: 'v3AfterAvg', width: 100 },
        {
          title: `价格执行率1<br>#V3谈判前 VS V1`,
          value: 'priceExecutionRate1',
          width: 140,
        },
        {
          title: `价格执行率2<br>#V3谈判后 VS V1`,
          value: 'priceExecutionRate2',
          width: 140,
        },
      ], // 展示列选项框
      ReportBgColorMap: ReportBgColorMap(), // 动态列背景色
      tableKey: 0, // el-table key
      maxheight: window.innerHeight - 380,
      selectIsAll: false, //选择框是否全选
      columCount: 0, //下载报表所有列=》确定width 和 合并单元格
      TaskNode: ['202203-V1', '202203-V2', '202203-NUV3','202203-V0',],
    }
  },
  computed: {},
  watch: {
    // 动态列渲染
    checkList(checkedList) {
      this.tableColumnList = this.dynamicColumn.filter(
        (item) => checkedList.indexOf(item.value) != -1
      )
      this.tableKey++
    },
    'filterObj.channelCode'() {
      this.getCustomerList()
    },
    'filterObj.customerCode'(Value, oldValue) {
      
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = window.innerHeight - 380
      })()
    }
    this.checkList = [
      'v1Avg',
      'v2Avg',
      'v3AfterAvg',
      'v3BeforeAvg',
      'priceExecutionRate1',
      'priceExecutionRate2',
    ]
    this.getQueryChannelSelect()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      const yearAndMonthList = getYearAndMonthRange(
        this.filterObj.yearAndMonthList[0],
        this.filterObj.yearAndMonthList[1]
      )
      API.getTotalReportList({
        yearAndMonthList: yearAndMonthList,
        customerNameList: this.filterObj.customerCode,
        channelNameList: this.filterObj.channelCode,
        productNameList: this.filterObj.productName,
      }).then((response) => {
        const AllObj = response.data
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
        this.getTaskNode()
        // 按SKU,customer拆分
        const allList = []
        for (const key in AllObj) {
          if (AllObj.hasOwnProperty.call(AllObj, key)) {
            // 2021 09 year
            const yearObj = AllObj[key]
            const year = key
            for (const customerKey in yearObj) {
              if (yearObj.hasOwnProperty.call(yearObj, customerKey)) {
                const list = yearObj[customerKey]
                const customerName1 = customerKey
                for (let index = 0; index < list.length; index++) {
                  const obj = Object.assign(list[index], {
                    year,
                    customerName1,
                  })
                  allList.push(obj)
                }
              }
            }
          }
        }
        const AllData = {}
        // 按SKU 重新分组
        for (let m = 0; m < allList.length; m++) {
          // 根据productEsName 进行分组
          if (!AllData[allList[m].productEsName]) {
            var arr = []
            arr.push(allList[m])
            AllData[allList[m].productEsName] = arr
          } else {
            AllData[allList[m].productEsName].push(allList[m])
          }
        }
        const AllDataList = []
        // 按年月重新分组
        for (const productItem in AllData) {
          if (Object.hasOwnProperty.call(AllData, productItem)) {
            //对客户进行排序
            const list = this.sortByCustomer(AllData[productItem])
            const yearData = {}
            for (let m = 0; m < list.length; m++) {
              if (!yearData[list[m].year]) {
                var arr = []
                arr.push(list[m])
                yearData[list[m].year] = arr
              } else {
                yearData[list[m].year].push(list[m])
              }
            }
            AllData[productItem] = yearData
            const obj = Object.assign(
              { name: productItem },
              { month: yearData }
            )
            AllDataList.push(obj)
          }
        }
        // AllDataList.sort(function (a, b) {
        //   return b.name.indexOf('Total') - a.name.indexOf('Total')
        // })
        this.tableData = AllDataList
        
      })
    },
    sortByCustomer(array) {
      var newList = []
      var order = this.AllCustomerList
      newList = array.sort(function compareFunction(item1, item2) {
        return (
          order.indexOf(item1.customerName1) -
          order.indexOf(item2.customerName1)
        )
      })
      return newList
    },
    getTaskNode() {
      API.getTaskNode({
        startDate: this.filterObj.yearAndMonthList[0].replace('-', ''),
        endDate: this.filterObj.yearAndMonthList[
          this.filterObj.yearAndMonthList.length - 1
        ].replace('-', ''),
        channelCode: this.filterObj.channelCode.join(','),
      }).then((res) => {
        if (res.code === 1000) {
          let compareList = res.data
          this.TaskNode=[]
          compareList.forEach((item) => {
            this.TaskNode.push(`${item.yearAndMonth}-${item.version}`)
          })
          console.log(compareList)
        }
      })
    },
    compareNode(yearAndMonth, version) {
      if (version == 0) {
        return (
          this.findVersion(yearAndMonth, 'V1') ||
          this.findVersion(yearAndMonth, 'V2') ||
          this.findVersion(yearAndMonth, 'V3')
        )
      }
      if (version == 1) {
        return (
          this.findVersion(yearAndMonth, 'V2') ||
          this.findVersion(yearAndMonth, 'V3')
        )
      }
      if (version >= 2) {
        return this.findVersion(yearAndMonth, 'V3')
      }
    },
    // 与节点数组进行比对
    findVersion(yearAndMonth, version) {
      let index = this.TaskNode.indexOf(`${yearAndMonth}-${version}`)
      return index != -1
    },
    // 获取渠道
    getQueryChannelSelect() {
      selectAPI.queryChannelSelect().then((res) => {
        this.channelOptions = res.data
        // this.filterObj.channelCode = [this.channelOptions[0].channelEsName]
        // this.filterObj.channelCode = ['NKA']
        // this.getCustomerList()
      })
    },
    // 客户
    getCustomerList() {
      if(this.filterObj.channelCode=='') {
        this.$message.info('请先选择渠道')
        return
      }
      selectAPI
        .getCustomerListByChannels({
          channelCodes: this.filterObj.channelCode,
        })
        .then((res) => {
          if (res.code === 1000) {
            this.customerArr = res.data
            let list = []
            this.customerArr.forEach((item) => {
              // if (list.length<10) {
              //   list.push(item.customerCsName)
              // }
              list.push(item.customerCsName)
            })
            // this.filterObj.customerCode = list
            this.AllCustomerList = list
            this.getSkuSelect()
          }
        })
    },
    // 获取SKU
    getSkuSelect() {
      selectAPI.querySkuSelect().then((res) => {
        this.skuList = res.data
        let list = []
        this.skuList.forEach((item) => {
          list.push(item.productEsName)
        })
        // this.filterObj.productName = [...list]
        this.getTableData()
      })
    },
    // 获取子组件传递的多个月份值
    getMultipleMonth(data) {
      this.filterObj.yearAndMonthList = data
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    exportExcel() {
      const fix = document.querySelector('.el-table__fixed')
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
      let ws = wb.Sheets.Sheet1
      //获取列宽数组
      ws['!cols'] = this.getColumWidth()
      // debugger
      let borderAll = {
        color: { auto: 1 },
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      }
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
          key.replace(/[^0-9]/gi, '') === '2' ||
          key.replace(/[^0-9]/gi, '') === '3'
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
      const wbout = XLSXStyle.write(wb, {
        type: 'binary',
        bookType: 'xlsx',
      })
      try {
        FileSaver.saveAs(
          new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
          '汇总分析报告.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    //获取数组宽度列表
    getColumWidth() {
      //得到渠道下所有客户的数量
      let AllData = { ...this.tableData[0].month }
      let customCount = 0
      for (const key in AllData) {
        if (AllData.hasOwnProperty.call(AllData, key)) {
          const customList = AllData[key]
          customCount += Number(customList.length)
        }
      }
      //所有列：(客户+1)*4+1
      let columCount = (customCount + 1) * 6 + 1
      this.columCount = columCount
      let ColumWidthList = []
      for (let index = 0; index < columCount; index++) {
        if (index > 10) {
          if ((index - 10) % 6 == 1 || (index - 10) % 6 == 2) {
            ColumWidthList.push({
              wpx: 150,
            })
          } else {
            ColumWidthList.push({
              wpx: 100,
            })
          }
        } else if (index == 5 || index == 6) {
          ColumWidthList.push({
            wpx: 150,
          })
        } else if(index==0) {
          ColumWidthList.push({
            wpx: 150,
          })
        } else {
          ColumWidthList.push({
            wpx: 100,
          })
        }
      }
      return ColumWidthList
    },

    //需要传入列的总数 count default 26
    initColum() {
      let AllColum = []
      for (let index = 0; index < this.columCount; index++) {
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
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'TotalRow'
      }
    },
    // 表格头样式
    headerStyle({ column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) {
        return 'headerStyle'
      }
    },
    // 列样式
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 &&
        rowIndex !== 0 &&
        row.name.indexOf('Total') == -1
      ) {
        return 'background:#4192d3;color: #fff'
      }
      if (row.name.indexOf('Total') !== -1) {
        return 'background-color: #f3f7f8 !important;color: #666!important;'
      }
    },
    getCheckTitle(str) {
      return str.replace(/<br>/g, ' ')
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
  .filstColumn {
    text-align: center;
  }
  .NumWrap {
    text-align: right;
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


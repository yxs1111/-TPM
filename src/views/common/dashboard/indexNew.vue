<!--
 * @Description: 甘特图组件 --基于gantt-elastic
 * @Date: 2022-06-16 09:31:24
 * @LastEditTime: 2022-11-04 09:13:33
-->
<template>
  <div>
    <!-- <div class="out"><b>类别</b> <em>姓名</em></div> -->
<!--    <div class="gunterTitle">-->
<!--      &lt;!&ndash; <b>活动周期</b>-->
<!--      <em>年月</em> &ndash;&gt;-->
<!--      &lt;!&ndash;      <div class="month">年月</div>&ndash;&gt;-->
<!--      &lt;!&ndash;      <div class="cycle">活动周期</div>&ndash;&gt;-->
<!--    </div>-->
    <div style=' border-radius: 25px;background-color: #fff; padding-bottom: 20px'>
      <GanttElastic ref="ganttGroup" style='padding-top: 10px; padding-left: 10px; padding-right: 10px' :tasks="tasks" :options="options">
        <!-- <GanttElasticHeader slot="header"></GanttElasticHeader> -->
      </GanttElastic>
      <div v-show="popUpShow" class="hover_con" :style="positionStyle">
        <div class="triangle"></div>
        {{ content.label }}<br />
        开始日期:{{ dayjs(content.startTime) }} <br />
        结束日期:{{ dayjs(content.endTime) }} <br />
      </div>
      <div class="CityPlan">
        <div class="CityPlanTop">
          <span class="date">{{this.activeMoon}}</span>
        </div>
        <div class="PointTipWrap">
          <div class="PointTipWrap3">
            <el-button-group>
              <el-button type="primary" v-for="item in ['NKA', 'EC', 'RKA']" :key='item' @click="getHomePageData(item)">{{item}}</el-button>
            </el-button-group>
          </div>
          <div class="PointTipWrap2">
            <div class="PointTip">
              <img src="@/assets/images/index/point_right.png" alt="" class="pointTipImg">
              <span>已完成</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_circle.png" alt="" class="pointTipImg">
              <span>当前节点</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_amaze.png" alt="" class="pointTipImg">
              <span>延误节点</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point.png" alt="" class="pointTipImg">
              <span>未开始</span>
            </div>
          </div>
        </div>
        <div class="CityPlanTop2">
          <span class="V0">V0</span>
          <span class="V1">V1</span>
          <span class="V2">V2</span>
          <span class="V3">V3</span>
        </div>
        <!-- 活动月 -->
        <div class="monthBarWrap">
          <!-- 流程 -->
          <div class="monthBar" v-for="(MonthItem,MonthIndex) in ActivityList" :key="MonthIndex">
            <!--          <div class="monthBg">-->
            <!--            &lt;!&ndash; <div class="monthName">{{(getCPTMonth(MonthItem.month))}}</div> &ndash;&gt;-->
            <!--            <div class="monthName">{{MonthItem.month}}</div>-->
            <!--          </div>-->
            <div class="monthPoint">
              <!-- 渠道 -->
              <div v-for="(value,ckey) in MonthItem.channelList" :key="ckey">
                <div v-for="item,index in value" :key="index">
                  <!-- PP -->
                  <div class="PPBar" v-if="item.isPrice">
                    <div class="PointTitle" :class="item.isPrice?'PointTitle':'NoPriceTaskIndexList'">{{item.TaskName}}</div>
                    <div :class="TaskLi" v-for="(TaskLi,TaskIndex) in item.isPrice?PriceTaskIndexList:NoPriceTaskIndexList" :key="TaskLi">
                      <div class="passIcon" v-if="item.taskNumber>TaskIndex||(item.taskNumber==TaskIndex&&(item.processStatus==2))"></div>
                      <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.taskNumber==TaskIndex&&item.workDateFlag==='0'&&(item.processStatus==1)">
                        <div slot="content" v-html="getTip(item)"></div>
                        <div class="currentPoint" v-if="item.taskNumber==TaskIndex&&item.workDateFlag==='0'&&(item.processStatus==1)"></div>
                      </el-tooltip>
                      <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.taskNumber==TaskIndex&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                        <div slot="content" v-html="getTip(item)"></div>
                        <div class="delayPoint" v-if="item.taskNumber==TaskIndex&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                      </el-tooltip>
                      <div class="pointCircle" v-if="TaskIndex>item.taskNumber"></div>
                      <div class="line" v-if="item.taskNumber>TaskIndex&&TaskLi!='V3'"></div>
                      <div class="lineDark" v-if="TaskIndex>=item.taskNumber&&TaskLi!='V3'"></div>
                    </div>
                  </div>
                  <div class="NU" v-if="!item.isPrice">
                    <div class="PointTitle" :class="item.isPrice?'PointTitle':'NoPriceTaskIndexList'">{{item.TaskName}}</div>
                    <div class="NuPoint">
                      <div :class="TaskLi" v-for="(TaskLi,TaskIndex) in item.isPrice?PriceTaskIndexList:NoPriceTaskIndexList" :key="TaskLi">
                        <div class="passIcon" v-if="item.taskNumber>TaskIndex||(item.taskNumber==TaskIndex&&(item.processStatus==2))"></div>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.taskNumber==TaskIndex&&item.workDateFlag==='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="currentPoint" v-if="item.taskNumber==TaskIndex&&item.workDateFlag==='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.taskNumber==TaskIndex&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="delayPoint" v-if="item.taskNumber==TaskIndex&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <div class="pointCircle" v-if="TaskIndex>item.taskNumber"></div>
                        <div class="line" v-if="item.taskNumber>TaskIndex&&TaskLi!='V3'"></div>
                        <div class="lineDark" v-if="TaskIndex>=item.taskNumber&&TaskLi!='V3'"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    我的代办-->
    <div class="BottomBar">
      <div class="MyToDo">
        <div class="BarTitleWrap">
          <span>我的待办</span>
          <div class="TabBar">
            <div class="Tabli " :class="currentIndex == index ? 'currentTabli' : ''" v-for="(item, index) in TabList" :key="item.id" @click="changeCurrent(index)">
              {{ item.title }}
            </div>
            <!-- <div class="Tabli ">已完成</div> -->
          </div>
        </div>
        <div class="TimeLineWrap" v-show="currentIndex == 0">
          <el-table
            max-height="190"
            :data="TodoList"
            stripe
            style="width: 100%">
            <el-table-column
              prop="yearAndMonth"
              label="年月"
              width="80">
            </el-table-column>
            <el-table-column
              prop="version"
              label="版本号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="activityName"
              label="当前节点">
            </el-table-column>
            <el-table-column
              prop="assignee"
              label="办理人">
              <template slot-scope="scope">
                <div class="TimeLineTitleli" v-html="getAssigneeName(scope.row.assignee)"></div>
              </template>
<!--              <div class="TimeLineTitleli" v-html="getAssigneeName(item.assignee)"></div>-->
            </el-table-column>
            <el-table-column
              prop=""
              label="操作">
              <template slot-scope="scope">
                <div class="TimeLineTitleli">
                  <div class="transact" @click="goAssignee(scope.row.version,scope.row.activityName,scope.row.channelCode,scope.row.minePackageName,scope.row)">办理</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="TimeLineWrap" v-show="currentIndex == 1">
          <el-table
            max-height="190"
            :data="TodoList"
            stripe
            style="width: 100%">
            <el-table-column
              prop="yearAndMonth"
              label="年月"
              width="80">
            </el-table-column>
            <el-table-column
              prop="version"
              label="版本号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="activityName"
              label="当前节点">
            </el-table-column>
            <el-table-column
              prop="assignee"
              label="办理人">
              <template slot-scope="scope">
                <div class="TimeLineTitleli" v-html="getAssigneeName(scope.row.assignee)"></div>
              </template>
              <!--              <div class="TimeLineTitleli" v-html="getAssigneeName(item.assignee)"></div>-->
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="Message MyToDo">
        <div class="BarTitleWrap">
          <span>消息</span>
          <span class="more" @click="MoreMsg">更多</span>
        </div>
        <div class="MessgaeWrap">
          <div class="Messgaeli" v-for="item,index in MessageList" :key="index">
            <span class="MessageDate">[{{item.time}}]</span>
            <span class="MessageContent">{{item.msg}}</span>
          </div>
        </div>
      </div>
      <el-popover
        placement="right"
        width="500"
        trigger="click">
        <div class='documentation'>用户文档中心</div>
        <el-table :data="gridData">
          <el-table-column width="50" property="" label="">
            <template slot-scope="scope">
              <img src='../../../assets/images/EXCEL.png' v-if='scope.row.format == "excel"'>
              <img src='../../../assets/images/word.png' v-if='scope.row.format == "word"'>
              <img src='../../../assets/images/yasuowenjian.png' v-if='scope.row.format == "zip"'>
              <img src='../../../assets/images/PPT.png' v-if='scope.row.format == "ppt"'>
              <img src='../../../assets/images/tupian.png' v-if='scope.row.format == "pdf"'>
              <img src='../../../assets/images/shipin.png' v-if='scope.row.format == "video"'>
            </template>
          </el-table-column>
          <el-table-column width="250" property="name" label="文件名称"></el-table-column>
          <el-table-column width="100" property="size" label="文件大小"></el-table-column>
          <el-table-column width="60" label="">
            <template slot-scope="scope">
              <el-link :href="scope.row.fileUrl">
                <img src='../../../assets/images/dwonload.png'>
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-button class='needHelp' slot="reference" @click='needHelp'>
<!--          <img src='../../../assets/images/help.png'>-->
          <div style=' border-radius: 50%; border: 1px solid #fff; font-size: 20px; width: 30px; height: 30px; padding-top: 3px'>?</div>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import GanttElastic from 'gantt-group'
import GanttElasticHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'
import auth from '@/utils/auth'
import TaskAPI from '@/api/taskManage/taskManage.js'
import API from '@/api/index/index.js'
import completeAPI from '@/api/taskManage/taskManage.js'
import { logger } from 'runjs/lib/common'
import item from '@/layout/components/Sidebar/Item'
import { getFileType } from '@/utils'
export default {
  name: 'Dashboard',

  data() {
    function getDate(hours) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      const currentDay = currentDate.getDate()
      const timeStamp = new Date(
        currentYear,
        currentMonth,
        currentDay,
        0,
        0,
        0
      ).getTime()
      return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
    }
    let options = {
      maxRows: 100,
      maxHeight: 800,
      title: {
        label: 'Your project title as html (link or whatever...)',
        html: false,
      },
      row: {
        height: 24,
      },
      times: {
        timeScale: 60 * 1000,
        timeZoom: 22, //24
        stepDuration: 'day',
      },
      calendar: {
        hour: {
          display: false,
        },
      },
      chart: {
        progress: {
          bar: false,
        },
        expander: {
          display: true,
        },
      },
      taskList: {
        expander: {
          straight: false,
        },
        columns: [
          {
            id: 2,
            label: '活动月',
            value: 'label',
            width: 200,
            center: true,
            expander: true,
            html: true,
            events: {
              click({ data, column }) {
                // alert('description clicked!\n' + data.label)
                // this.activeMoon = data.label
                // // console.log(data)
              }
            }
          }
        ]
      },
      locale: {
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        months: [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
        ],
      },
      /* locale:{
          name: 'pl', // name String
          weekdays: 'Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota_Niedziela'.split('_'), // weekdays Array
          weekdaysShort: 'Pon_Wto_Śro_Czw_Pią_Sob_Nie'.split('_'), // OPTIONAL, short weekdays Array, use first three letters if not provided
          weekdaysMin: 'Pn_Wt_Śr_Cz_Pt_So_Ni'.split('_'), // OPTIONAL, min weekdays Array, use first two letters if not provided
          months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split('_'), // months Array
          monthsShort: 'Sty_Lut_Mar_Kwi_Maj_Cze_Lip_Sie_Wrz_Paź_Lis_Gru'.split('_'), // OPTIONAL, short months Array, use first three letters if not provided
          ordinal: n => `${n}`, // ordinal Function (number) => return number + output
          relativeTime: { // relative time format strings, keep %s %d as the same
            future: 'za %s', // e.g. in 2 hours, %s been replaced with 2hours
            past: '%s temu',
            s: 'kilka sekund',
            m: 'minutę',
            mm: '%d minut',
            h: 'godzinę',
            hh: '%d godzin', // e.g. 2 hours, %d been replaced with 2
            d: 'dzień',
            dd: '%d dni',
            M: 'miesiąc',
            MM: '%d miesięcy',
            y: 'rok',
            yy: '%d lat'
          }
       }*/
    }
    return {
      gridData: [{
        format: '2016-05-02',
        name: '王小虎',
        size: '45kb',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      avatar: auth.getAvatar(),
      name: auth.getName(),
      SalesAmountChart: '',
      ActualSalesChart: '',
      currentIndex: 0,
      activeMoon: '',
      tabPosition: 'left',
      TabList: [
        { id: 0, title: '待完成' },
        { id: 1, title: '已完成' },
      ],
      MessageList: [], //消息列表
      startTimeArr: [],
      endTimeArr: [],
      ActivityList: [],
      TodoList: [],
      completeData: [],
      BackGroundColorList: ['#FB5A56', '#2C85FF', '#FFAA30'],
      PriceTaskIndexList: ['V0', 'V1', 'V2', 'V3'],
      NoPriceTaskIndexList: ['V1', 'V2', 'V3'],
      TaskMapper: {
        'In Store Promo - Price Related': '价促', //price
        'Free Goods - Tin': '价促-FG tin', //Free Goods - Tin
        'New user costs': '新客', //NU
        'Free Goods - Win 2': '新客-FG win2',
        'CRM Rep Cost': 'FMC',
        'Roadshows and Weekend Events': 'RS',
        'Listing fee': 'Listing',
        'HIH rebate': 'HIH rebate',
        'KA rebate': 'KA rebate',
        'In Store POSM - Customized': 'POSM-定',
      },
      tasks: [
        {
          id: 'task-3',
          label: '202206',
          start: dayjs('2022-06-02').valueOf(),
          end: dayjs('2022-09-15').valueOf(),
          percent: 25,
          type: 'group',
          tasks: [
            {
              id: 12,
              label: 'V0',
              start: dayjs('2022-06-01').valueOf(),
              end: dayjs('2022-07-16').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-3'
            },
            {
              id: 13,
              label: 'V1',
              start: dayjs('2022-07-18').valueOf(),
              end: dayjs('2022-08-28').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-3'
            },
          ]
        },
        {
          id: 'task-4',
          label: '202205',
          start: dayjs('2022-06-02').valueOf(),
          end: dayjs('2022-09-15').valueOf(),
          percent: 25,
          type: 'group',
          tasks: [
            {
              id: 12,
              label: 'V0',
              start: dayjs('2022-06-01').valueOf(),
              end: dayjs('2022-07-16').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-4'
            },
            {
              id: 13,
              label: 'V1',
              start: dayjs('2022-07-18').valueOf(),
              end: dayjs('2022-08-28').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-4'
            },
          ]
        },
        {
          id: 'task-5',
          label: '202204',
          start: dayjs('2022-06-02').valueOf(),
          end: dayjs('2022-09-15').valueOf(),
          percent: 25,
          type: 'group',
          tasks: [
            {
              id: 12,
              label: 'V0',
              start: dayjs('2022-06-01').valueOf(),
              end: dayjs('2022-07-16').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-5'
            },
            {
              id: 13,
              label: 'V1',
              start: dayjs('2022-07-18').valueOf(),
              end: dayjs('2022-08-28').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor:'#4795D4'
                }
              },
              parentId:'task-5'
            },
          ]
        },
      ],
      options: options,
      content: {
        label: '',
        startTime: '',
        endTime: '',
      },
      popUpShow: false,
      positionStyle: { top: '0px', left: '0px' },
    }
  },
  components: {
    GanttElastic,
    GanttElasticHeader,
  },
  created() {},
  mounted() {
    this.$bus.$on('currentMonthChange', data=>{
      this.tasks.forEach((item) => {
        if (item.id == data) {
          this.activeMoon = item.label
        }
      })
    })
    this.$bus.$on('taskMouseEnter', (content) => {
      console.log(content)
      const { event, data } = content
      this.popUpShow = true
      const x = event.pageX + 5 + 'px'
      const y = event.pageY + 10 + 'px'
      this.content.label = data.label
      this.content.startTime = data.startTime
      this.content.endTime = data.endTime
      this.positionStyle = { top: y, left: x }
    })
    this.$bus.$on('taskMouseout', (content) => {
      this.popUpShow = false
    })
    this.getMesList()
    this.getToDoData()
    this.getCompleteData()
    this.getActivitycycle()
  },
  watch: {
    '$store.state.app.sidebar.opened'() {
      // setTimeout(() => {
      //   console.log('change')
      //   this.SalesAmountChart.resize()
      //   this.ActualSalesChart.resize()
      // }, 200)
    },
  },
  methods: {
    needHelp() {
      this.gridData = []
      TaskAPI.getNeedHelp().then((res) => {
        res.data.forEach((item, index) => {
          item.name = item.fileName
          item.size = item.fileSize
          this.gridData.push(item)
          item.format = getFileType(item.fileName)
        })
      })
    },
    getActivitycycle() {
      this.tasks = []
      API.getActivity().then((res) => {
        if (this.activeMoon == '') {
          this.activeMoon = res.data[0].activityMonth
          this.getHomePageData()
        }
        res.data.forEach((item,index) => {
          if (index==0) {
            this.$refs.ganttGroup.state.isActiveId = item.id
          }
          this.startTimeArr = []
          item.label = item.activityMonth
          item.startVZero = item.startAndEndVZero.substring(0, 10)
          item.EndVZero = item.startAndEndVZero.substring(item.startAndEndVZero.length - 10, item.startAndEndVZero.length)
          item.startVOne = item.startAndEndVOne.substring(0, 10)
          item.EndVOne = item.startAndEndVOne.substring(item.startAndEndVOne.length - 10, item.startAndEndVOne.length)
          item.startVTwo = item.startAndEndVTwo.substring(0, 10)
          item.EndVTwo = item.startAndEndVTwo.substring(item.startAndEndVTwo.length - 10, item.startAndEndVTwo.length)
          item.startVThree = item.startAndEndVThree.substring(0, 10)
          item.EndVThree = item.startAndEndVThree.substring(item.startAndEndVThree.length - 10, item.startAndEndVThree.length)
          this.startTimeArr.push(new Date(item.startVZero), new Date(item.EndVZero), new Date(item.startVOne), new Date(item.EndVOne), new Date(item.startVTwo), new Date(item.EndVTwo), new Date(item.startVThree), new Date(item.EndVThree))
          let maxDate = new Date(Math.max.apply(null, this.startTimeArr))
          let minDate = new Date(Math.min.apply(null, this.startTimeArr))
          const formatDateTime = function (date) {
            const y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? ('0' + m) : m
            let d = date.getDate()
            d = d < 10 ? ('0' + d) : d
            return y + '-' + m + '-' + d
          }
          maxDate = formatDateTime(maxDate)
          minDate = formatDateTime(minDate)
          item.start = dayjs(minDate).valueOf(),
          item.end = dayjs(maxDate).valueOf()
          item.type = 'group'
          item.tasks = []
          item.tasks.push(
            {
              id: item.id + 'v0',
              label: 'V0',
              start: dayjs(item.startVZero).valueOf(),
              end: dayjs(item.EndVZero).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor: '#4795D4'
                }
              },
              parentId: item.id
            },
            {
              id: item.id + 'v1',
              label: 'V1',
              start: dayjs(item.startVOne).valueOf(),
              end: dayjs(item.EndVOne).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor: '#4795D4'
                }
              },
              parentId: item.id
            },
            {
              id: item.id + 'v2',
              label: 'V2',
              start: dayjs(item.startVTwo).valueOf(),
              end: dayjs(item.EndVTwo).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor: '#4795D4'
                }
              },
              parentId: item.id
            },
            {
              id: item.id + 'v3',
              label: 'V3',
              start: dayjs(item.startVThree).valueOf(),
              end: dayjs(item.EndVThree).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#C0E2D9',
                  textColor: '#4795D4'
                }
              },
              parentId: item.id
            }
          )
          this.tasks.push(item)
          console.log(minDate, maxDate)
        })
      })
    },
    dayjs(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },
    changeCurrent(index) {
      this.currentIndex = index
    },
    getTip(value) {
      if (!value.assignee) {
        return null
      }
      let assigneeList = value.assignee.split(',')
      let assigneeStr = ''
      assigneeList.forEach((item) => {
        assigneeStr += `<span>${item}</span></br>`
      })
      return `<div class="Tip">
                <span class="TipTitle">节点名称: </span>
                <span>${value.activityName}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">渠道: </span>
                <span>${value.channelName}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">办理人: </span>
                <span>${assigneeStr}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">办理状态: </span>
                <span>${value.processStatus == 2 ? '已办理' : value.workDateFlag == '1' ? '未办理(延误)' : '未办理'}</span>
              </div>`
    },
    // 获取信息列表
    getMesList() {
      API.getHomePageMsg().then((res) => {
        let obj = {
          time: '',
          msg: '',
        }
        res.data.forEach((item) => {
          obj.time = item.substring(1, 10)
          obj.msg = item.substring(12)
          if (this.MessageList.length < 5)
            this.MessageList.push({
              ...obj,
            })
        })
      })
    },
    // 查看更多信息
    MoreMsg() {
      this.$router.push('/os/MessageManage')
    },
    // 日历和流程
    getHomePageData(item) {
      if (item === undefined) {
        item = 'NKA'
      }
      API.getHomePageData({
        yearAndMonth: this.activeMoon,
        channelName: item
      }).then((res) => {
        let array = res.data.investList
        //流程处理 日期分组
        let data = {}
        for (let m = 0; m < array.length; m++) {
          //对date 进行分组
          array[m].activityMonth = this.getCPTMonth(array[m].yearAndMonth)
          //设置排序
          if (array[m].minePackageName == 'Price Promotion') {
            array[m].sortCode = 1
          } else {
            array[m].sortCode = 0
          }
          //根据yearAndMonth 进行分组
          if (!data[array[m].yearAndMonth]) {
            var arr = []
            arr.push(array[m])
            data[array[m].yearAndMonth] = arr
          } else {
            data[array[m].yearAndMonth].push(array[m])
            //PP、NU 排序
            data[array[m].yearAndMonth].sort(function (a, b) {
              return b.sortCode - a.sortCode
            })
          }
        }
        //流程--渠道分组处理
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const array = data[key]
            let cdata = {} //活动月下进行渠道分组
            for (let index = 0; index < array.length; index++) {
              //设置排序
              if (array[index].minePackageName == 'Price Promotion') {
                array[index].sortCode = 1
              } else {
                array[index].sortCode = 0
              }
              //根据渠道进行分组
              if (!cdata[array[index].channelName]) {
                var arr = []
                arr.push(array[index])
                array[index].isPrice =
                  array[index].minePackageName == 'Price Promotion' ? 1 : 0
                if(array[index].isPrice&&array[index].costItemName == 'Free Goods - Tin') {
                  array[index].isPrice=0
                }
                if(array[index].isPrice) {
                  //节点序列号
                  array[index].taskNumber = this.PriceTaskIndexList.findIndex(
                    (item) => array[index].version.includes(item)
                  )
                } else {
                  //节点序列号
                  array[index].taskNumber = this.NoPriceTaskIndexList.findIndex(
                    (item) => array[index].version.includes(item)
                  )
                }
                array[index].TaskName = this.setTaskName(
                  array[index].minePackageName,
                  array[index].costItemName
                )
                cdata[array[index].channelName] = arr
              } else {
                array[index].isPrice =
                  array[index].minePackageName == 'Price Promotion' ? 1 : 0
                if(array[index].isPrice&&array[index].costItemName == 'Free Goods - Tin') {
                  array[index].isPrice=0
                }
                if(array[index].isPrice) {
                  //节点序列号
                  array[index].taskNumber = this.PriceTaskIndexList.findIndex(
                    (item) => array[index].version.includes(item)
                  )
                } else {
                  //节点序列号
                  array[index].taskNumber = this.NoPriceTaskIndexList.findIndex(
                    (item) => array[index].version.includes(item)
                  )
                }
                array[index].TaskName = this.setTaskName(
                  array[index].minePackageName,
                  array[index].costItemName
                )
                cdata[array[index].channelName].push(array[index])
                //PP、NU 排序
                cdata[array[index].channelName].sort(function (a, b) {
                  return b.sortCode - a.sortCode
                })
              }
            }
            data[key] = cdata
          }
        }
        // for (const key in data) {
        //   if (Object.hasOwnProperty.call(data, key)) {
        //     //渠道
        //     const channelObj = data[key]
        //     for (const ckey in channelObj) {
        //       if (Object.hasOwnProperty.call(channelObj, ckey)) {
        //         //MinePackage
        //         const MinePackageList = channelObj[ckey]
        //         let MinePackageObj={}
        //         for (let m = 0; m < MinePackageList.length; m++) {
        //           //根据MinePackage进行分组
        //           if (!MinePackageObj[MinePackageList[m].minePackageName]) {
        //             var arr = []
        //             arr.push(MinePackageList[m])
        //             MinePackageObj[MinePackageList[m].minePackageName] = arr
        //           } else {
        //             MinePackageObj[MinePackageList[m].minePackageName].push(MinePackageList[m])
        //           }
        //         }
        //         channelObj[ckey]=MinePackageObj
        //       }
        //     }
        //   }
        // }
        let list = []
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key]
            let obj = {
              month: '',
              channelList: [],
            }
            obj.month = key
            obj.channelList = element
            list.push(obj)
          }
        }
        let reverseList = []
        reverseList = list.reverse()
        this.ActivityList = [...reverseList]
        //日期处理
        let DateArray = res.data.calendar
        let DateData = {}
        for (let m = 0; m < DateArray.length; m++) {
          DateArray[m].dateObj = this.createDate(DateArray[m].date)
          //对date 进行分组
          if (!DateData[DateArray[m].yearMonth]) {
            var arr = []
            arr.push(DateArray[m])
            DateData[DateArray[m].yearMonth] = arr
          } else {
            DateData[DateArray[m].yearMonth].push(DateArray[m])
          }
        }
        let ColorIndex = 0 //颜色初始值
        //日历格式化
        // for (const key in DateData) {
        //   let pointList = DateData[key]
        //   for (let index = 0; index < pointList.length; index++) {
        //     let obj = {
        //       key: pointList[index].yearMonth + '-' + pointList[index].version,
        //       dot: {
        //         style: {
        //           //dot 样式设置
        //           backgroundColor: this.BackGroundColorList[ColorIndex % 3],
        //         },
        //       },
        //       dates: pointList[index].dateObj,
        //       popover: {
        //         label:
        //           pointList[index].yearMonth + '-' + pointList[index].version,
        //       },
        //     }
        //     this.attrs.push(obj)
        //   }
        //   ColorIndex++
        // }
      })
    },
    setTaskName(minePackageName, costItemName) {
      let TaskName = ''
      if (minePackageName == 'Price Promotion') {
        TaskName = 'PP'
        if (costItemName == 'Free Goods - Tin') {
          TaskName = '价促-FG tin'
        }
      } else if (minePackageName == 'New User') {
        TaskName = 'NU'
        if (costItemName == 'Free Goods - Win 2') {
          TaskName = '新客-FG win2'
        }
      } else if (minePackageName == 'KA Contract') {
        if (costItemName == 'KA rebate') {
          TaskName = 'KA rebate'
        }
        if (costItemName == 'HIH rebate') {
          TaskName = 'HIH rebate'
        }
      } else if (minePackageName == 'POSM') {
        if (costItemName == 'In Store POSM - Standard') {
          TaskName = 'POSM-标'
        }
        if (costItemName == 'In Store POSM - Customized') {
          TaskName = 'POSM-定'
        }
      } else {
        TaskName = minePackageName
      }
      return TaskName
    },
    //获取date 日期对象
    createDate(value) {
      return new Date(Date.parse(value.replace(/-/g, '/'))) //转换成Data();
    },
    //获取活动月
    getCPTMonth(value) {
      let dateStr = value.substring(0, 4) + '-' + value.substring(4, 6)
      let date = new Date(dateStr)
      //月份
      let month = date.getMonth() + 1
      //活动月计算 9  -> 6+6
      let firstMonth = ''
      if (month <= 3) {
        firstMonth = month + 9
        //0+12
        if (month == 3) firstMonth = 0
      } else {
        firstMonth = month - 3
      }
      let secondMonth = 12 - firstMonth
      let activityMonth = firstMonth + '+' + secondMonth
      return activityMonth
    },
    //获取待办数据
    getToDoData() {
      TaskAPI.getList({
        pageNum: 1, //当前页
        pageSize: 999, //每页条数
      }).then((response) => {
        this.TodoList = response.data.records
      })
    },
    //获取表格数据
    getCompleteData() {
      completeAPI
        .getMyHandleList({
          pageNum: 1, //当前页
          pageSize: 999, //每页条数
        })
        .then((response) => {
          this.completeData = response.data.records
        })
    },
    //办理
    goAssignee(version, name, channelCode, minePackage, row) {
      let minePackageName = minePackage
      if(minePackageName=='KA Contract') {
        if (row.costItemName=='HIH rebate') {
          minePackageName='HIH Rebate'
        } else if(row.costItemName=='KA rebate') {
          minePackageName='KA Rebate'
        }
      }
      if(minePackageName=='POSM') {
        if (row.costItemName=='In Store POSM - Standard') {
          minePackageName='POSM - Standard'
        } else if(row.costItemName=='In Store POSM - Customized') {
          minePackageName='POSM - Customized'
        }
      }
      if(minePackageName=='Price Promotion') {
        if (row.costItemName=='Free Goods - Tin') {
          minePackageName='Free Goods-Tin'
        } else {
          minePackageName='Price Promotion'
        }
      }
      if(minePackageName=='New User') {
        if(row.costItemName=='Free Goods - Win 2') {
          minePackageName='Free Goods-Win2'
        } else {
          minePackageName='New User'
        }
      }
      if (version.indexOf('V0')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({
            path: '/costManagement/V0/V0ApplyList',
            params: { channelCode },
          })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({
            path: '/costManagement/V0/V0ApprovalList',
            params: { channelCode },
          })
        }
      }
      if (version.indexOf('V1') != -1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Apply', query: { channelCode,minePackageName } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Approval', query: { channelCode, minePackageName } })
        }
      }
      if (version.indexOf('V2') != -1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Apply', query: { channelCode,minePackageName } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Approval', query: { channelCode, minePackageName } })
        }
      }
      if (version.indexOf('V3') != -1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Apply', query: { channelCode,minePackageName } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Approval', query: { channelCode, minePackageName } })
        }
      }
      //this.$router.push({ path: '/process', query: currentRow })
    },
    //获取办理人姓名
    getAssigneeName(assigneeStr) {
      if (assigneeStr != '') {
        let list = assigneeStr.split(',')
        let allName = ''
        list.forEach((item) => {
          let index = item.indexOf('@')
          if (index != -1) {
            allName += '<br>' + item.slice(0, index)
          } else {
            allName += '<br>' + item.slice(0)
          }
        })
        return allName.slice(4)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hover_con {
  position: fixed;
  max-width: 220px;
  padding: 10px;
  border: 1px solid #666;
  background: #303133;
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
}
.triangle {
  width: 0px;
  height: 0px;
  line-height: 0px;
  font-size: 0px;
  border: 10px solid transparent;
  border-bottom-color: #303133;
  /* background-color: #fff; */
  position: absolute;
  top: -15px;
}
</style>
<style lang="scss">
//gannttGroup
.gantt-elastic {
  height: 180px;
  overflow-y: scroll;
}
.gantt-elastic__task-list-wrapper {
  margin-top: 60px;
}
.gantt-elastic__task-list-expander-wrapper {
  display: none !important;
}
/* 日期刻度 隐藏 */
.gantt-elastic__chart-calendar-container {
  /* display: none !important; */
}
.gantt-elastic__task-list-header-column {
  display: none !important;
}
.gantt-elastic__task-list-header {
  display: none !important;
}
.gantt-elastic__task-list-container {
  width: 100px !important;
  height: 100% !important;
  margin-right: 20px;
}
.gantt-elastic__main-container {
  height: 100% !important;
}
.gantt-elastic__main-container-wrapper {
  height: 100% !important;
}
.gantt-elastic__main-container-wrapper {
  // height: 75px !important;
  overflow-y: auto !important;
}
.gantt-elastic__chart-scroll-container--vertical {
  display: none;
}
.gantt-elastic__main-view-container {
  overflow: visible;
}
.gantt-elastic__chart-scroll-container--vertical {
  display: none;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* //滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}
.gantt-elastic__task-list-item {
  border-radius: 10px;
  text-align: center;
  color: #000 !important;
  font-weight: 600;
  font-size: 16px;
  justify-content: center;
  margin: 4px 0 !important;
}
/* taskList active */
.gantt-elastic__task-list-item_active {
  background-color: #4192d3 !important;
  color: #fff !important;
}
.gantt-elastic__task-list-item_active
.gantt-elastic__task-list-item-value-wrapper {
  color: #fff !important;
  background-color: transparent;
}
.gantt-elastic__task-list-item-value {
  font-size: 14px !important;
  text-align: center !important;
}
.gantt-elastic__chart-scroll-container--horizontal {
  margin-left: 85px !important;
}

// .out {
//   border-top: 40px #f5f5f5 solid; /*上边框宽度等于表格第一行行高*/
//   width: 0px; /*让容器宽度为0*/
//   height: 0px; /*让容器高度为0*/
//   border-left: 80px #eee solid; /*左边框宽度等于表格第一行第一格宽度*/
//   position: relative; /*让里面的两个子容器绝对定位*/
// }
// b {
//   font-style: normal;
//   display: block;
//   position: absolute;
//   top: -40px;
//   left: -40px;
//   width: 35px;
//   font-size: 14px;
// }
// em {
//   font-style: normal;
//   display: block;
//   position: absolute;
//   font-size: 14px;
//   top: -25px;
//   left: -70px;
//   width: 55x;
// }
.date{
  background-color: rgb(198, 235, 254);
  padding: 5px 15px;
  border-radius: 10px;
}
.CityPlan {
  margin: 10px 10px 0px 10px;
  width: 99%;
  height: 310px;
  background-color: #f0fbff;
  border-radius: 20px;
  box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
  .CityPlanTop {
    width: 100%;
    height: 52px;
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
    padding-right: 60px;
    //border-bottom: 1px solid #dce1e6;
    .V0 {
      width: 33%;
    }
    .V1 {
      width: 33%;
    }
    .V2 {
      width: 33%;
    }
  }
  .CityPlanTop2 {
    width: 100%;
    height: 30px;
    padding-left: 200px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
    padding-right: 60px;
    //border-bottom: 1px solid #dce1e6;
    .V0 {
      width: 33%;
    }
    .V1 {
      width: 33%;
    }
    .V2 {
      width: 33%;
    }
  }
  .PointTipWrap {
    width: 100%;
    margin: 0px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .PointTip {
      margin-right: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;
      .pointTipImg {
        width: 17px;
        height: 17px;
        margin-right: 6px;
      }
    }
  }
  .PointTipWrap2 {
    width: 35%;
    margin: 0px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .PointTip {
      margin-right: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;

      .pointTipImg {
        width: 17px;
        height: 17px;
        margin-right: 6px;
      }
    }
  }
  .PointTipWrap3 {
    border-radius: 10px;
    width: 25%;
    margin: 5px 0px 5px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    el-button{
      padding: 5px 20px;
      background-color: #00afff
    }
    div:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    div:last-child {
      border-right: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .PointTip {
      margin-right: 40px;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;

      .pointTipImg {
        width: 17px;
        height: 17px;
        margin-right: 6px;
      }
    }
  }
  .monthBarWrap {
    width: 100%;
    padding: 0 20px;
    height: calc(100% - 140px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .monthBar {
      width: 100%;
      // height: 110px;
      //background: #ffffff;
      //box-shadow: 0px 0px 18px 0px rgba(114, 114, 114, 0.07);
      border-radius: 15px;
      box-sizing: border-box;
      display: flex;
      //margin-bottom: 20px;

      .monthBg {
        width: 150px;
        // height: 110px;
        display: flex;
        font-weight: 600;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: url('../../../assets/images/index/month (1).png')
        no-repeat;
        background-size: 100% 100%;
        padding-left: 30px;
        box-sizing: border-box;
        .monthName {
          width: 100%;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          text-align: left;
        }
      }
      .monthPoint {
        width: calc(100% - 0px);
        // height: 110px;
        overflow-y: scroll;
        //padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .PPBar {
          width: 100%;
          display: flex;
          height: 28px;
          align-items: center;
          margin: 5px 0;
          // background-color: pink;
        }
        .NU {
          width: 100%;
          display: flex;
          height: 28px;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0;
          .NuPoint {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-left: 18px;
          }
          // background-color: pink;
        }
        .PointTitle {
          width: 160px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #000;
          margin-right: 10px;
          white-space: nowrap;
        }
        .V0 {
          width: 33%;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
          }
        }
        .V1 {
          width: 33%;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
          }
        }
        .V2 {
          width: 33%;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
          }
        }
        .line {
          width: calc(100% - 28px);
          height: 10px;
          background-color: #e5e5e5;
          //box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31);
        }
        .lineDark {
          width: calc(100% - 28px);
          height: 10px;
          background-color: #C6DCEE;
          // box-shadow: 0px 2px 6px 0px rgba(251, 113, 119, 0.31);
        }
        .pointCircle {
          width: 27px;
          height: 27px;
          background-color: #e5e5e5;
          border: 1px solid #fff;
          border-radius: 50%;
        }
        .passIcon {
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_right.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(85, 186, 158, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .currentPoint {
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_circle.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(44, 133, 255, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .delayPoint {
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_amaze.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(251, 90, 86, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .noStart {
          width: 27px;
          height: 27px;
          background-color: #fee4e4;
          border: 1px solid #fff;
          border-radius: 50%;
        }
      }
    }
    .monthBar:nth-child(3n + 1) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #fb5a56;
      }
      background: url('../../../assets/images/index/monthNew (1).png')
      no-repeat;
      background-size: 100% 100%;
    }
    .monthBar:nth-child(3n + 2) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #2c85ff;
      }
      background: url('../../../assets/images/index/monthNew (2).png')
      no-repeat;
      background-size: 100% 100%;
    }
    .monthBar:nth-child(3n + 3) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffaa30;
      }
      background: url('../../../assets/images/index/monthNew (3).png')
      no-repeat;
      background-size: 100% 100%;
    }
  }
}
.gunterTitle {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  position: relative;
  ::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -24px;
    width: 172%;
    height: 121%;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    transform-origin: bottom center;
    transform: rotate(45deg);
  }
  .month {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    height: 40px;
    line-height: 40px;
    text-align: right;
  }
  .cycle {
    text-align: left;
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    color: #999;
  }
}
.BottomBar {
  width: 100%;
  height: 310px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
  .MyToDo {
    width: 65%;
    height: 345px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
    .TimeLineWrap {
      width: 100%;
      margin-top: 20px;
      height: calc(100% - 80px);
      background-color: #f5f5f5;
      border-radius: 4px;
      .TimeLineTop {
        width: 100%;
        display: flex;
        height: 50px;
        align-items: center;
        justify-content: space-between;
        padding-left: 80px;
        padding-right: 48px;
        box-sizing: border-box;
        border-bottom: 1px solid #dce1e6;
        .TimeLineTitleli {
          width: 20%;
          height: 50px;
          line-height: 50px;
          color: #333333;
          font-size: 18px;
        }
      }
      .TimeLineBar {
        width: 100%;
        padding-top: 20px;
        padding-right: 48px;
        box-sizing: border-box;
        height: 190px;
        overflow-y: scroll;

        .TimeLineli {
          width: 200%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 10px;
          box-sizing: border-box;
          box-shadow: 0px 0px 38px 0px rgba(12, 12, 12, 0.04);
          border-radius: 10px;
          background-color: #fff;
          .TimeLineTitleli {
            width: 20%;
            line-height: 30px;
            padding: 5px 0;
            color: #333333;
            font-size: 16px;
            .TimeLineOpertion {
              width: 80px;
              height: 40px;
              line-height: 40px;
              color: #fff;
              background-color: #4192d3;
              border-radius: 4px;
              text-align: center;
              cursor: pointer;
            }
          }
        }

        .el-timeline-item {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .transact {
    width: 80px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background-color: #4192d3;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .Message {
    width: 33%;
    .MessgaeWrap {
      width: 100%;
      margin-top: 30px;
      .Messgaeli {
        width: 100%;
        display: flex;
        font-size: 16px;
        color: #999999;
        margin-bottom: 24px;
        .MessageDate {
          white-space: nowrap;
          color: #333333;
          margin-right: 10px;
        }
        .MessageContent {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .BarTitleWrap {
    font-family: SourceHanSansCN-Medium;
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .TabBar {
      width: 180px;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      box-sizing: border-box;
      border-radius: 4px;

      color: #999;
      background-color: #f3f7f8;
      .Tabli {
        width: 90px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
        cursor: pointer;
        font-family: SourceHanSansCN-Medium;
      }
      .currentTabli {
        background-color: #ffffff;
        border-radius: 4px;
        color: #4192d3;
      }
    }
    .more {
      font-size: 16px;
      color: #4192d3;
      cursor: pointer;
    }
  }
}
.documentation {
  text-align: center;
  font-size: 17px;
  font-weight: bold;
  color: #a39d9d;
}
.dashWrap {
  height: calc(100% - 33px);
  overflow-y: auto;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
  width: 0px;
  height: 2px;
}
/* //滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 3px;
}
.needHelp{
  position: absolute;
  background-color: #00afff;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: inline-block;
  color: #fff;
  font-size: 20px;
  margin: 0px 0px 0px -90px
}
</style>

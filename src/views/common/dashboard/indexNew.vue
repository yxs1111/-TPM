<!--
 * @Description: 甘特图组件 --基于gantt-elastic
 * @Date: 2022-06-16 09:31:24
 * @LastEditTime: 2023-02-10 14:29:44
-->
<template>
  <div class="indexNew">
    <div class="index_container">
      <GanttElastic ref="ganttGroup" style="padding-top: 10px; padding-left: 10px; padding-right: 10px" :tasks="tasks" :options="options">
        <!-- <GanttElasticHeader slot="header"></GanttElasticHeader> -->
      </GanttElastic>
      <div v-show="popUpShow" class="hover_con" :style="positionStyle">
        <div class="triangle" />
        <!--        {{ content.label }}<br />-->
        {{ dayjs(content.startTime) }} - {{ dayjs(content.endTime) }} <br />
      </div>
      <div class="CityPlan">
<!--        <div class="CityPlanTop">-->
<!--        </div>-->
        <div class="PointTipWrap">
          <div class="PointTipWrap3">
            <span class="date">{{ this.activeMoon }}</span>
            <el-radio-group class='btnGroup' v-model="tabPosition" @change="getHomePageData">
              <el-radio-button v-for="(item) in channelArr" :label=item.channelCsName>{{item.channelEsName}}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="PointTipWrap2">
            <div class="PointTip">
              <img src="@/assets/images/index/point_right2.png" alt="" class="pointTipImg" />
              <span>已完成</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_circle2.png" alt="" class="pointTipImg" />
              <span>待办</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_amaze2.png" alt="" class="pointTipImg" />
              <span>延误</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point5.png" alt="" class="pointTipImg" />
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
          <div v-for="(MonthItem, MonthIndex) in ActivityList" :key="MonthIndex" class="monthBar">
            <div class="monthPoint">
              <!-- 渠道 -->
              <div v-for="(value, ckey) in MonthItem.channelList" :key="ckey">
                <div v-for="(item, index) in value" :key="index">
                  <!-- PP -->
                  <div v-if="item.isPrice" class="PPBar">
                    <div class="PointTitle" :class="item.isPrice ? 'PointTitle' : 'NoPriceTaskIndexList'">{{ item.TaskName }}</div>
                    <div class="NuPoint">
                      <div v-for="(TaskLi, TaskIndex) in item.isPrice ? PriceTaskIndexList : NoPriceTaskIndexList" :key="TaskLi" :class="TaskLi">
                        <div v-if="item.taskNumber > TaskIndex || (item.taskNumber == TaskIndex && item.processStatus == 2)" class="passIcon" />
                        <el-tooltip v-if="item.taskNumber == TaskIndex && item.workDateFlag === '0' && item.processStatus == 1" effect="light" placement="bottom" popper-class="tooltip">
                          <div slot="content" v-html="getTip(item)" />
                          <div v-if="item.taskNumber == TaskIndex && item.workDateFlag === '0' && item.processStatus == 1" class="currentPoint" />
                        </el-tooltip>
                        <el-tooltip v-if="item.taskNumber == TaskIndex && item.workDateFlag !== '0' && item.processStatus == 1" effect="light" placement="bottom" popper-class="tooltip">
                          <div slot="content" v-html="getTip(item)" />
                          <div v-if="item.taskNumber == TaskIndex && item.workDateFlag !== '0' && item.processStatus == 1" class="delayPoint" />
                        </el-tooltip>
                        <div v-if="TaskIndex > item.taskNumber" class="noStart" />
                        <div v-if="item.taskNumber > TaskIndex && TaskLi != 'V3'" class="line" />
                        <div v-if="TaskIndex >= item.taskNumber && TaskLi != 'V3'" class="lineDark" />
                      </div>
                    </div>
                  </div>
                  <div v-if="!item.isPrice" class="NU">
                    <div class="PointTitle" :class="item.isPrice ? 'PointTitle' : 'NoPriceTaskIndexList'">{{ item.TaskName }}</div>
                    <div class="NuPoint">
                      <div v-for="(TaskLi, TaskIndex) in item.isPrice ? PriceTaskIndexList : NoPriceTaskIndexList" :key="TaskLi" :class="TaskLi">
                        <div v-if="item.taskNumber > TaskIndex || (item.taskNumber == TaskIndex && item.processStatus == 2)" class="passIcon" />
                        <el-tooltip v-if="item.taskNumber == TaskIndex && item.workDateFlag === '0' && item.processStatus == 1" effect="light" placement="bottom" popper-class="tooltip">
                          <div slot="content" v-html="getTip(item)" />
                          <div v-if="item.taskNumber == TaskIndex && item.workDateFlag === '0' && item.processStatus == 1" class="currentPoint" />
                        </el-tooltip>
                        <el-tooltip v-if="item.taskNumber == TaskIndex && item.workDateFlag !== '0' && item.processStatus == 1" effect="light" placement="bottom" popper-class="tooltip">
                          <div slot="content" v-html="getTip(item)" />
                          <div v-if="item.taskNumber == TaskIndex && item.workDateFlag !== '0' && item.processStatus == 1" class="delayPoint" />
                        </el-tooltip>
                        <div v-if="TaskIndex > item.taskNumber" class="noStart" />
                        <div v-if="item.taskNumber > TaskIndex && TaskLi != 'V3'" class="line" />
                        <div v-if="TaskIndex >= item.taskNumber && TaskLi != 'V3'" class="lineDark" />
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
      <div class="MyToDo agent">
        <div class="BarTitleWrap">
          <span>我的待办</span>
          <div class="TabBar">
            <div v-for="(item, index) in TabList" :key="item.id" class="Tabli" :class="currentIndex == index ? 'currentTabli' : ''" @click="changeCurrent(index)">
              {{ item.title }}
            </div>
            <!-- <div class="Tabli ">已完成</div> -->
          </div>
        </div>
        <!--        费用管理-->
        <div v-show="currentIndex == 0" class="TimeLineWrap">
          <el-table :header-cell-style="{ color: '#000000', height: '53px' }" :data="TodoList" :max-height="maxheight" stripe style="width: 100%">
            <el-table-column align="left" width='85' prop="yearAndMonth" show-overflow-tooltip label="活动周期" />
            <el-table-column prop="costTypeName" width='120' show-overflow-tooltip label="Cost Type" />
            <el-table-column prop="minePackageName" show-overflow-tooltip label="Mine Package" />
            <el-table-column prop="costItemName" show-overflow-tooltip label="Cost Item" />
            <el-table-column prop="channelName" width='100' show-overflow-tooltip label="渠道" />
            <el-table-column prop="num" width='85' label="版本号" />
            <el-table-column width='120' align="left" prop="" label="查看">
              <template slot-scope="{ row }">
                <div class="transact" @click="openFlowDiagram(row)">查看流程</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="操作" width="100">
              <template slot-scope="scope">
                <div class="operation" @click="goAssignee(scope.row.version, scope.row.activityName, scope.row.channelCode, scope.row.minePackageName, scope.row)">
                  <svg-icon icon-class="submit_l" class="submit_icon" />
                  办理
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--        合同管理-->
        <div v-show="currentIndex == 1" class="TimeLineWrap">
          <el-table :header-cell-style="{ color: '#000000' }" :max-height="maxheight" :data="contractList" stripe style="width: 100%">
            <el-table-column prop="item" label="审批流类型" width="140" />
            <el-table-column prop="contractCode" show-overflow-tooltip label="合同ID" width="280" />
            <el-table-column prop="customerName" show-overflow-tooltip label="客户名称" />
            <el-table-column prop="distributorName" show-overflow-tooltip label="经销商名称" />
            <el-table-column prop="activityName" show-overflow-tooltip label="当前节点" />
            <el-table-column prop="" label="查看" width="120">
              <template slot-scope="{ row }">
                <div class="transact" @click="openFlowDiagram(row)">
                  <div class="transctTxt">查看流程</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作">
              <template slot-scope="{ row }">
                <div class="operation" @click="operateProcess(row.minePackageCode, row.name,row.item)">
                  <svg-icon icon-class="submit_l" class="submit_icon" />
                  办理
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="Message MyToDo new">
        <div class="BarTitleWrap">
          <span>消息</span>
          <!--          <span class="more" @click="MoreMsg">更多</span>-->
          <notice />
        </div>
        <div class="MessgaeWrap">
          <div v-for="(item, index) in MessageList" :key="index" class="Messgaeli">
            <span class="MessageDate">[{{ item.time }}]</span>
            <span class="MessageContent">{{ item.msg }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="flowDiagram.visible">
      <flow-diagram svg-type="instance" :business-id="flowDiagram.businessId" :process-id="flowDiagram.processId" :visible.sync="flowDiagram.visible" title="流程图" width="90%" />
    </div>
  </div>
</template>

<script>
import Notice from '@/components/Notice'
import GanttElastic from 'gantt-group'
import GanttElasticHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'
import auth from '@/utils/auth'
import TaskAPI from '@/api/taskManage/taskManage.js'
import API from '@/api/index/index.js'
import completeAPI from '@/api/taskManage/taskManage.js'
import FlowDiagram from '@/components/FlowDiagram'
import { logger } from 'runjs/lib/common'
import item from '@/layout/components/Sidebar/Item'
import { getFileType } from '@/utils'
import requestApi from '@/api/request-api'
import { mapMutations } from 'vuex'
import selectAPI from '@/api/selectCommon/selectCommon'
export default {
  name: 'Dashboard',
  components: {
    GanttElastic,
    GanttElasticHeader,
    FlowDiagram,
    Notice,
  },

  data() {
    function getDate(hours) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      const currentDay = currentDate.getDate()
      const timeStamp = new Date(currentYear, currentMonth, currentDay, 0, 0, 0).getTime()
      return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
    }
    const options = {
      maxRows: 3,
      maxHeight: 800,
      title: {
        label: 'Your project title as html (link or whatever...)',
        html: false,
      },
      row: {
        height: 26,
      },
      times: {
        timeScale: 60 * 1000,
        timeZoom: 22.9, // 24
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
        grid: {
          horizontal: {
            gap: 12, //*
          },
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
              },
            },
          },
        ],
      },
      locale: {
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
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
      maxheight: this.changeScreen2(),
      gridData: [
        {
          format: '2016-05-02',
          name: '王小虎',
          size: '45kb',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      tabPosition: '',
      avatar: auth.getAvatar(),
      name: auth.getName(),
      SalesAmountChart: '',
      ActualSalesChart: '',
      currentIndex: 0,
      activeMoon: '',
      TabList: [
        { id: 0, title: '费用管理' },
        { id: 1, title: '合同管理' },
      ],
      flowDiagram: {
        visible: false,
        activate: false,
        businessId: null,
        processId: null,
      },
      MessageList: [], // 消息列表
      startTimeArr: [],
      endTimeArr: [],
      ActivityList: [],
      channelArr: [],
      TodoList: [],
      contractList: [],
      completeData: [],
      BackGroundColorList: ['#FB5A56', '#2C85FF', '#FFAA30'],
      PriceTaskIndexList: ['V0', 'V1', 'V2', 'V3'],
      NoPriceTaskIndexList: ['V1', 'V2', 'V3'],
      TaskMapper: {
        'In Store Promo - Price Related': '价促', // price
        'Free Goods - Tin': '价促-FG tin', // Free Goods - Tin
        'New user costs': '新客', // NU
        'Free Goods - Win 2': '新客-FG win2',
        'CRM Rep Cost': 'FMC',
        'Roadshows and Weekend Events': 'RS',
        'Listing fee': 'Listing',
        'HIH rebate': 'HIH rebate',
        'KA rebate': 'KA rebate',
        'In Store POSM - Customized': 'POSM-定',
      },
      tasks: [
      ],
      options: options,
      content: {
        label: '',
        startTime: '',
        endTime: '',
      },
      popUpShow: false,
      positionStyle: { top: '0px', left: '0px' },
      screenWidth: 0,
      tempScreen: 0, //中间，比较
    }
  },
  watch: {
    activeMoon() {
      this.getHomePageData()
    },

    '$store.state.app.sidebar.opened'() {
      const width = document.body.clientWidth
      if (this.$store.state.app.sidebar.opened) {
        //获取常见屏幕分辨率，根据宽度动态匹配甘特图的宽度
        if (width <= 1366) {
          this.options.times.timeZoom = 22.9
        } else if (width <= 1440) {
          this.options.times.timeZoom = 22.9
        } else if (width <= 1920) {
          this.options.times.timeZoom = 22.2
        }
      } else {
        if (width <= 1366) {
          this.options.times.timeZoom = 22.6
        } else if (width <= 1440) {
          this.options.times.timeZoom = 22.5
        } else if (width <= 1920) {
          this.options.times.timeZoom = 21.9
        }
      }
    },
  },
  created() {},
  mounted() {
    this.changeScreen2()
    //浏览器放大缩小 监听
    window.addEventListener('resize', this.changeScreen)
    window.addEventListener('resize', this.changeScreen2)
    const width = document.body.clientWidth
    if (this.$store.state.app.sidebar.opened) {
      //获取常见屏幕分辨率，根据宽度动态匹配甘特图的宽度
      if (width <= 1366) {
        this.options.times.timeZoom = 22.9
      } else if (width <= 1440) {
        this.options.times.timeZoom = 22.9
      } else if (width <= 1920) {
        this.options.times.timeZoom = 22.2
      } else if (width <= 2560) {
        this.options.times.timeZoom = 21.8
      } else {
        this.options.times.timeZoom = 21
      }
    }
    window.onresize = () => {
      return (() => {
        this.screenWidth = width
      })()
    }
    this.$bus.$on('currentMonthChange', (data) => {
      this.tasks.forEach((item) => {
        if (item.id == data) {
          this.activeMoon = item.label
        }
      })
    })
    this.$bus.$on('taskMouseEnter', (content) => {
      const { event, data } = content
      this.popUpShow = true
      const x = event.pageX + 5 + 'px'
      const y = event.pageY + 10 + 'px'
      this.content.label = data.label
      this.content.startTime = data.startTime2
      this.content.endTime = data.endTime
      this.positionStyle = { top: y, left: x }
    })
    this.$bus.$on('taskMouseout', (content) => {
      this.popUpShow = false
    })
    this.getMesList()
    this.getToDoData()
    this.getContract()
    this.getCompleteData()
    this.getActivitycycle()
    this.needHlep()
    this.getChannel()
    this.getHomePageData()
  },
  methods: {
    //app OPEN_BREADCRUMB 映射成openBreadcrumb方法
    ...mapMutations('app', ['OPEN_BREADCRUMB']),
    needHlep() {
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
    // 获取下拉框
    getChannel() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code === 1000) {
          this.channelArr = res.data
          this.tabPosition = res.data[0].channelCsName
        }
      })
    },
    changeScreen() {
      const width = document.body.clientWidth
      const height = document.body.clientHeight
      //是否放大
      let isAmplification = this.tempScreen < width
      if (this.$store.state.app.sidebar.opened) {
        //获取常见屏幕分辨率，根据宽度动态匹配甘特图的宽度
        if (width <= 1366) {
          this.options.times.timeZoom = 22.9
        } else if (width <= 1440) {
          this.options.times.timeZoom = 22.9
        } else if (width <= 1920) {
          this.options.times.timeZoom = 22.2
        } else {
          if (!isAmplification) {
            this.options.times.timeZoom += 0.8
          } else {
            this.options.times.timeZoom -= 0.8
          }
        }
      } else {
        if (width <= 1366) {
          this.options.times.timeZoom = 22.6
        } else if (width <= 1440) {
          this.options.times.timeZoom = 22.5
        } else if (width <= 1920) {
          this.options.times.timeZoom = 21.9
        } else {
          if (!isAmplification) {
            this.options.times.timeZoom += 0.8
          } else {
            this.options.times.timeZoom -= 0.8
          }
        }
      }
      this.tempScreen = width
      if (height <= 929) {
        this.maxheight = 234
      } else if (height <= 1032) {
        this.maxheight = 275
      } else if (height <= 1162) {
        this.maxheight = 324
      } else if (height <= 1239) {
        this.maxheight = 352
      } else if (height <= 1394) {
        this.maxheight = 413
      } else if (height <= 1859) {
        this.maxheight = 588
      } else if (height <= 2788) {
        this.maxheight = 945
      } else if (height <= 3717) {
        this.maxheight = 1286
      }
      return this.maxheight
    },
    changeScreen2() {
      const height = document.body.clientHeight
      if (height <= 929) {
        this.maxheight = 234
      } else if (height <= 1032) {
        this.maxheight = 275
      } else if (height <= 1080) {
        this.maxheight = 292
      } else if (height <= 1162) {
        this.maxheight = 324
      } else if (height <= 1200) {
        this.maxheight = 334
      } else if (height <= 1239) {
        this.maxheight = 352
      } else if (height <= 1394) {
        this.maxheight = 413
      } else if (height <= 1859) {
        this.maxheight = 588
      } else if (height <= 2788) {
        this.maxheight = 945
      } else if (height <= 3717) {
        this.maxheight = 1286
      }
      return this.maxheight
    },
    getActivitycycle() {
      this.tasks = []
      API.getActivity().then((res) => {
        if (this.activeMoon == '') {
          this.activeMoon = res.data[0].activityMonth
          this.getHomePageData()
        }
        res.data.forEach((item, index) => {
          if (index == 0) {
            this.$refs.ganttGroup.state.isActiveId = item.id
          }
          this.startTimeArr = []
          item.label = item.activityMonth
          item.startVZero = item.startAndEndVZero.substring(0, 10)
          // console.log(item.EndVZero)
          item.EndVZero = item.startAndEndVZero.substring(item.startAndEndVZero.length - 10, item.startAndEndVZero.length)
          item.startVOne = item.startAndEndVOne.substring(0, 10)
          item.EndVOne = item.startAndEndVOne.substring(item.startAndEndVOne.length - 10, item.startAndEndVOne.length)
          item.startVTwo = item.startAndEndVTwo.substring(0, 10)
          item.EndVTwo = item.startAndEndVTwo.substring(item.startAndEndVTwo.length - 10, item.startAndEndVTwo.length)
          item.startVThree = item.startAndEndVThree.substring(0, 10)
          item.EndVThree = item.startAndEndVThree.substring(item.startAndEndVThree.length - 10, item.startAndEndVThree.length)
          item.EndVZero=this.isCompare(item.startVZero,item.EndVZero)
          item.EndVOne=this.isCompare(item.startVOne,item.EndVOne)
          item.EndVTwo=this.isCompare(item.startVTwo,item.EndVTwo)
          item.EndVThree=this.isCompare(item.startVThree,item.EndVThree)

          this.startTimeArr.push(new Date(item.startVZero), new Date(item.EndVZero), new Date(item.startVOne), new Date(item.EndVOne), new Date(item.startVTwo), new Date(item.EndVTwo), new Date(item.startVThree), new Date(item.EndVThree))
          let maxDate = new Date(Math.max.apply(null, this.startTimeArr))
          let minDate = new Date(Math.min.apply(null, this.startTimeArr))
          const formatDateTime = function (date) {
            const y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? '0' + m : m
            let d = date.getDate()
            d = d < 10 ? '0' + d : d
            return y + '-' + m + '-' + d
          }
          maxDate = formatDateTime(maxDate)
          minDate = formatDateTime(minDate)
          const date = new Date()
          const seperator1 = '-'
          let month1 = date.getMonth()
          let month2 = date.getMonth() + 1
          let month3 = date.getMonth() + 2
          let strDate = date.getDate()
          let strDate1 = '02'
          let strDate2 = '30'
          if (month1 >= 1 && month1 <= 9) {
            month1 = '0' + month1
          }
          if (month2 >= 1 && month2 <= 9) {
            month2 = '0' + month2
          }
          if (month3 >= 1 && month3 <= 9) {
            month3 = '0' + month3
          }
          // if (strDate >= 0 && strDate <= 9) {
          //   strDate = '0' + strDate
          // }
          // const currentdate1 = '2022-9-01'
          // const currentdate3 = '2022-12-31'
          // const currentdate1 = date.getFullYear() + seperator1 + month1 + seperator1 + strDate1
          // const currentdate3 = date.getFullYear() + seperator1 + month3 + seperator1 + strDate2
          //获取当前月 上一月 月初
          const currentdate1 = dayjs().subtract(1, 'month').startOf('month').add(1,'day').format('YYYY-MM-DD')
          //获取当前月 下一月 月末
          const currentdate3 = dayjs().add(1, 'month').endOf('month').subtract(1, 'day').format('YYYY-MM-DD')
          item.start = dayjs(currentdate1).valueOf()
          item.end = dayjs(currentdate3).valueOf()
          item.type = 'group'
          item.tasks = []
          console.log(item.startVThree)
          console.log(item.end)
          // this.tasks.push(
          item.tasks.push(
            {
              id: item.id + 'v0',
              label: 'V0',
              start: dayjs(item.startVZero).valueOf()<item.start?item.start:dayjs(item.startVZero).valueOf(),
              startTime2: dayjs(item.startVZero).valueOf(),
              end: dayjs(item.EndVZero).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#E7E7E7',
                  textColor: '#4795D4',
                },
              },
              parentId: item.id,
            },
            {
              id: item.id + 'v1',
              label: 'V1',
              start: dayjs(item.startVOne).valueOf(),
              startTime2: dayjs(item.startVOne).valueOf(),
              end: dayjs(item.EndVOne).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#E7E7E7',
                  textColor: '#4795D4',
                },
              },
              parentId: item.id,
            },
            {
              id: item.id + 'v2',
              label: 'V2',
              start: dayjs(item.startVTwo).valueOf(),
              startTime2: dayjs(item.startVTwo).valueOf(),
              end: dayjs(item.EndVTwo).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#E7E7E7',
                  textColor: '#4795D4',
                },
              },
              parentId: item.id,
            },
          )
          //若V3的开始时间 大于甘特图的结束时间则不该显示
          if(dayjs(item.startVThree).valueOf()>item.end) {

          } else {
            item.tasks.push(
              {
              id: item.id + 'v3',
              label: 'V3',
              start: dayjs(item.startVThree).valueOf()>item.end?item.end:dayjs(item.startVThree).valueOf(),
              startTime2: dayjs(item.startVThree).valueOf(),
              end: dayjs(item.EndVThree).valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C6EBFE',
                  stroke: '#E7E7E7',
                  textColor: '#4795D4',
                },
              },
              parentId: item.id,
            }
            )
          }
          this.tasks.push(item)
        })
      })
    },
    //判断两天是否相等，若相等则结束日期加一天
    isCompare(start,end) {
      if(start==end){
        return dayjs(end).add(1,'day').format('YYYY-MM-DD')
      } else {
        return end
      }
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
      const assigneeList = value.assignee.split(',')
      let assigneeStr = ''
      assigneeList.forEach((item) => {
        assigneeStr += `<span>${item}</span></br>`
      })
      return `<div class="Tip">
                <span style='font-weight: bold'>${value.createDate ? value.createDate.substring(0, 11).replaceAll('T', ' ') : ''}</span>-
                <span style='font-weight: bold'>${value.updateDate ? value.updateDate.substring(0, 11).replaceAll('T', ' ') : ''}</span>
              </div>`
    },
    // 获取信息列表
    getMesList() {
      const height = document.body.clientHeight
      requestApi
        .request_get('/mdm/mdEmailRecordRule/getPage', {
          receiverCode: localStorage.usernameLocal,
        })
        .then((res) => {
          const obj = {
            time: '',
            msg: '',
          }
          res.data.records.forEach((item) => {
            // console.log(item)
            obj.time = item.createDate.substring(0, 10)
            obj.msg = item.theme
            this.MessageList.push({
              ...obj,
            })
            // if (height <= 929 || this.MessageList.length < 5) {
            //   this.MessageList.push({
            //     ...obj,
            //   })
            // } else if (height <= 1032 || this.MessageList.length < 6) {
            //   this.MessageList.push({
            //     ...obj,
            //   })
            // } else if (height <= 1080) {
            //   this.maxheight = 292
            // } else if (height <= 1162) {
            //   this.maxheight = 324
            // } else if (height <= 1239) {
            //   this.maxheight = 352
            // } else if (height <= 1394) {
            //   this.maxheight = 413
            // } else if (height <= 1859) {
            //   this.maxheight = 588
            // } else if (height <= 2788) {
            //   this.maxheight = 945
            // } else if (height <= 3717) {
            //   this.maxheight = 1286
            // }
            // return this.maxheight
          })
        })
    },
    // 查看更多信息
    MoreMsg() {
      this.$router.push('/os/MessageManage')
    },
    // 日历和流程
    getHomePageData(item, event) {
      if (item === undefined) {
        item = 'NKA'
      }
      API.getHomePageData({
        yearAndMonth: this.activeMoon,
        channelName: this.tabPosition,
      }).then((res) => {
        const array = res.data.investList
        // 流程处理 日期分组
        const data = {}
        for (let m = 0; m < array.length; m++) {
          // 对date 进行分组
          array[m].activityMonth = this.getCPTMonth(array[m].yearAndMonth)
          // 设置排序
          if (array[m].minePackageName == 'Price Promotion') {
            array[m].sortCode = 1
          } else {
            array[m].sortCode = 0
          }
          // 根据yearAndMonth 进行分组
          if (!data[array[m].yearAndMonth]) {
            var arr = []
            arr.push(array[m])
            data[array[m].yearAndMonth] = arr
          } else {
            data[array[m].yearAndMonth].push(array[m])
            // PP、NU 排序
            data[array[m].yearAndMonth].sort(function (a, b) {
              return b.sortCode - a.sortCode
            })
          }
        }
        // 流程--渠道分组处理
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const array = data[key]
            const cdata = {} // 活动月下进行渠道分组
            for (let index = 0; index < array.length; index++) {
              // 设置排序
              if (array[index].minePackageName == 'Price Promotion') {
                array[index].sortCode = 1
              } else {
                array[index].sortCode = 0
              }
              // 根据渠道进行分组
              if (!cdata[array[index].channelName]) {
                var arr = []
                arr.push(array[index])
                array[index].isPrice = array[index].minePackageName == 'Price Promotion' ? 1 : 0
                if (array[index].isPrice && array[index].costItemName == 'Free Goods - Tin') {
                  array[index].isPrice = 0
                }
                if (array[index].isPrice) {
                  // 节点序列号
                  array[index].taskNumber = this.PriceTaskIndexList.findIndex((item) => array[index].version.includes(item))
                } else {
                  // 节点序列号
                  array[index].taskNumber = this.NoPriceTaskIndexList.findIndex((item) => array[index].version.includes(item))
                }
                array[index].TaskName = this.setTaskName(array[index].minePackageName, array[index].costItemName)
                cdata[array[index].channelName] = arr
              } else {
                array[index].isPrice = array[index].minePackageName == 'Price Promotion' ? 1 : 0
                if (array[index].isPrice && array[index].costItemName == 'Free Goods - Tin') {
                  array[index].isPrice = 0
                }
                if (array[index].isPrice) {
                  // 节点序列号
                  array[index].taskNumber = this.PriceTaskIndexList.findIndex((item) => array[index].version.includes(item))
                } else {
                  // 节点序列号
                  array[index].taskNumber = this.NoPriceTaskIndexList.findIndex((item) => array[index].version.includes(item))
                }
                array[index].TaskName = this.setTaskName(array[index].minePackageName, array[index].costItemName)
                cdata[array[index].channelName].push(array[index])
                // PP、NU 排序
                cdata[array[index].channelName].sort(function (a, b) {
                  return b.sortCode - a.sortCode
                })
              }
            }
            data[key] = cdata
          }
        }
        const list = []
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key]
            const obj = {
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
    // 获取活动月
    getCPTMonth(value) {
      const dateStr = value.substring(0, 4) + '-' + value.substring(4, 6)
      const date = new Date(dateStr)
      // 月份
      const month = date.getMonth() + 1
      // 活动月计算 9  -> 6+6
      let firstMonth = ''
      if (month <= 3) {
        firstMonth = month + 9
        // 0+12
        if (month == 3) firstMonth = 0
      } else {
        firstMonth = month - 3
      }
      const secondMonth = 12 - firstMonth
      const activityMonth = firstMonth + '+' + secondMonth
      return activityMonth
    },
    // 获取待办数据
    getToDoData() {
      TaskAPI.getList({
        pageNum: 1, // 当前页
        pageSize: 999, // 每页条数
      }).then((response) => {
        this.TodoList = response.data.records
        response.data.records.forEach((item) => {
          item.num = item.version.substring(item.version.length - 2, item.version.length)
        })
      })
    },
    // 获取合同管理数据
    getContract() {
      TaskAPI.getContract({
        pageNum: 1, // 当前页
        pageSize: 999, // 每页条数
      }).then((response) => {
        this.contractList = response.data.records
      })
    },
    // 获取表格数据
    getCompleteData() {
      completeAPI
        .getMyHandleList({
          pageNum: 1, // 当前页
          pageSize: 999, // 每页条数
        })
        .then((response) => {
          this.completeData = response.data.records
        })
    },
    operateProcess(version, name,item) {
      this.OPEN_BREADCRUMB()
      if(item.includes('经销商')) {
        if(name.indexOf('审批') != -1) {
          if(item.includes('变更')) {
            sessionStorage.setItem('currentIndex', 1)
          } else{
            sessionStorage.setItem('currentIndex', 0)
          }
          this.$router.push('/contractManagement/dealer/dealerContractApproval')
        } else {
          this.$router.push('/contractManagement/dealer/dealerContractEntry')
        }
      } else if(item.includes('客户')) {
        if(name.indexOf('审批') != -1) {
          if(item.includes('变更')) {
            sessionStorage.setItem('currentIndex', 1)
          } else{
            sessionStorage.setItem('currentIndex', 0)
          }
          this.$router.push('/contractManagement/ContractEntry/CustomerContractApproval')
        } else {
          this.$router.push('/contractManagement/ContractEntry/CustomerContractEntry')
        }
      }
    },
    // 查看流程
    openFlowDiagram(row) {
      this.flowDiagram.businessId = row.businessKey
      this.flowDiagram.processId = row.processId
      this.flowDiagram.visible = true
    },
    // 办理
    goAssignee(version, name, channelCode, minePackage, row) {
      let minePackageName = minePackage
      if (minePackageName == 'KA Contract') {
        if (row.costItemName == 'HIH rebate') {
          minePackageName = 'HIH Rebate'
        } else if (row.costItemName == 'KA rebate') {
          minePackageName = 'KA Rebate'
        }
      }
      if (minePackageName == 'POSM') {
        if (row.costItemName == 'In Store POSM - Standard') {
          minePackageName = 'POSM - Standard'
        } else if (row.costItemName == 'In Store POSM - Customized') {
          minePackageName = 'POSM - Customized'
        }
      }
      if (minePackageName == 'Price Promotion') {
        if (row.costItemName == 'Free Goods - Tin') {
          minePackageName = 'Free Goods-Tin'
        } else {
          minePackageName = 'Price Promotion'
        }
      }
      if (minePackageName == 'New User') {
        if (row.costItemName == 'Free Goods - Win 2') {
          minePackageName = 'Free Goods-Win2'
        } else {
          minePackageName = 'New User'
        }
      }
      if (version.indexOf('V0') != -1) {
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
          this.$router.push({
            path: '/costManagement/V1/V1Apply',
            query: { channelCode, minePackageName },
          })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({
            path: '/costManagement/V1/V1Approval',
            query: { channelCode, minePackageName },
          })
        }
      }
      if (version.indexOf('V2') != -1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({
            path: '/costManagement/V2/V2Apply',
            query: { channelCode, minePackageName },
          })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({
            path: '/costManagement/V2/V2Approval',
            query: { channelCode, minePackageName },
          })
        }
      }
      if (version.indexOf('V3') != -1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({
            path: '/costManagement/V3/V3Apply',
            query: { channelCode, minePackageName },
          })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({
            path: '/costManagement/V3/V3Approval',
            query: { channelCode, minePackageName },
          })
        }
      }
      // this.$router.push({ path: '/process', query: currentRow })
    },
    // 获取办理人姓名
    getAssigneeName(assigneeStr) {
      if (assigneeStr != '') {
        const list = assigneeStr.split(',')
        let allName = ''
        list.forEach((item) => {
          const index = item.indexOf('@')
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
.hover_con {
  position: fixed;
  max-width: 220px;
  padding: 10px;
  border: 1px solid #fff;
  background: #ffffff;
  color: #999999;
  border-radius: 10px;
  font-size: 14px;
}
.triangle {
  width: 0px;
  height: 0px;
  line-height: 0px;
  font-size: 0px;
  border: 10px solid transparent;
  border-bottom-color: #fff;
  /* background-color: #fff; */
  position: absolute;
  top: -15px;
}
</style>
<style lang="scss">
.gantt-elastic__calendar-wrapper {
  width: 100% !important;
  div {
    width: 100% !important;
  }
}
.indexTable {
  .el-tooltip {
    text-align: left;
  }
}
.el-popoverTwo {
  height: 410px !important;
  overflow: auto !important;
}
.Selectli {
  .el-input {
    //margin-left: 20px;
    .el-input__inner {
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }
  }
}
.indexNew {
  height: 100%;
  //padding: 11px;
  overflow-x: hidden;
}
.index_container {
  height: 60%;
  border-radius: 25px;
  background-color: #fff;
  padding-bottom: 20px;
}
.gantt-elastic__main-view-container {
  width: 91% !important;
}
.title {
  padding-bottom: 17px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  margin-left: 5px !important;
}
.gantt-elastic__calendar-row-text--month {
  font-size: 14px !important;
  font-weight: 600;
}
.gantt-elastic__calendar-row-rect--month {
  line-height: 36px !important;
}
.gantt-elastic__calendar-row--month {
  height: 35px !important;
}
.gantt-elastic {
  border: 0px;
  div {
    border: 0px solid #ffffff !important;
  }
}
//.el-table td {
//  text-align: center;
//}
//.el-table th>.cell {
//  text-align: center;
//}
.gantt-elastic {
  overflow-y: scroll;
}
.gantt-elastic__task-list-wrapper {
  margin-top: 60px;
  height: 78% !important;
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
.gantt-elastic__task-list-item-column {
  height: 30px !important;
}
.gantt-elastic__task-list-item-value {
  line-height: 30px !important;
}
//.gantt-elastic__main-container {
//  height: 100% !important;
//}
.gantt-elastic__main-container-wrapper {
  height: 240px !important;
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
.gantt-elastic__task-list-items {
  height: 177px !important;
  padding-top: 20px !important;
}
.gantt-elastic__task-list-item {
  margin: 0 5px;
  box-shadow: 0px 0px 12px 0px rgba(127, 127, 127, 0.1);
  border-radius: 6px;
  text-align: center;
  color: #000 !important;
  font-weight: 600;
  font-size: 16px;
  justify-content: center;
  margin-top: 18px !important;
}
.gantt-elastic__chart-graph-container {
  margin-top: 10px !important;
  height: 146px !important;
  //.gantt-elastic__chart-row-text-content {
  //  display: none;
  //}
  div {
    height: 146px !important;
  }
}
.gantt-elastic__chart-graph {
  svg {
    height: 146px !important;
  }
}
/* taskList active */
.gantt-elastic__task-list-item_active {
  background-color: #c5ebfe !important;
  color: #4192d3 !important;
}
.gantt-elastic__task-list-item_active .gantt-elastic__task-list-item-value-wrapper {
  color: #4192d3 !important;
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
.el-button-group > .el-button:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
.el-button-group > .el-button:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.date {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Source Han Sans CN Light', Arial, sans-serif;
  background-color: rgb(198, 235, 254);
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 16px;
}
.gantt-elastic__chart-row-task {
  text {
    font-size: 14px !important;
  }
}
.CityPlan {
  margin: 20px 20px 0px 20px;
  width: 97%;
  height: calc(100% - 280px);
  background-color: #f0fbff;
  border-radius: 20px;
  box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
  .CityPlanTop {
    padding-top: 10px;
    width: 100%;
    height: 52px;
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 600;
    color: #4192d3;
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
    padding-top: 20px;
    width: 100%;
    height: 30px;
    padding-left: 200px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: bold;
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
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Source Han Sans CN Light', Arial, sans-serif;
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
    justify-content: end;

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
    width: 24%;
    margin: 17px 0px 5px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    //justify-content: space-between;
    .btnGroup {
      margin-left: 15px;
    }
    .el-button {
      font-size: 16px;
      color: #333333;
      height: 35px;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #4192d3;
    }
    .el-radio-button__inner,
    .el-radio-group {
      line-height: 0.5;
    }
    .el-radio-button__inner {
      border: 0px;
      background-color: #c5ebfe;
      font-size: 13px;
      font-weight: bold;
      padding: 15px 15px !important;
    }
    .el-button--primary {
      background-color: #c5ebfe;
      border-color: #c5ebfe;
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
      background: #4192d3;
      color: #ffffff;
    }
    el-button {
      padding: 5px 20px;
      //background-color: #00afff;
    }
    div:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    div:last-child {
      //border-right: 10px;
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
    height: calc(100% - 90px);
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
        background: url('../../../assets/images/index/month (1).png') no-repeat;
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
        position: relative;
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
          .NuPoint {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-left: 18px;
            padding-right: 40px;
            .V0 {
              .line {
                border-top-left-radius: 10px !important;
                border-bottom-left-radius: 10px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
            }
            .V1 {
              .lineDark {
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
              .line {
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
            }
            .V2 {
              .lineDark {
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
              .line {
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
            }
          }
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
            padding-right: 40px;
            .V2 {
              .line {
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 10px !important;
                border-bottom-right-radius: 10px !important;
                width: calc(100% - 0px) !important;
                height: 26px !important;
                background-color: #c6dcee;
                box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31) !important;
              }
            }
          }
          // background-color: pink;
        }
        .PointTitle {
          width: 153px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #000;
          margin-right: 10px;
          white-space: nowrap;
        }
        .V0 {
          width: 32.5%;
          display: flex;
          align-items: center;
          .lineDark {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          img {
            width: 28px;
            height: 28px;
          }
        }
        .V1 {
          width: 32.5%;
          display: flex;
          align-items: center;
          .lineDark {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          img {
            width: 28px;
            height: 28px;
          }
        }
        .V2 {
          width: 34.2%;
          display: flex;
          align-items: center;
          .lineDark {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
          img {
            width: 28px;
            height: 28px;
          }
        }
        .V3 {
          width: 0%;
          display: flex;
          align-items: center;
          .noStart {
            margin-left: -20px !important;
          }
          .passIcon {
            margin-left: -20px !important;
          }
          .currentPoint {
            margin-left: -20px;
          }
          .delayPoint {
            margin-left: -20px;
          }
          img {
            width: 28px;
            height: 28px;
          }
        }
        .line {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          width: calc(100% - 0px);
          height: 26px;
          background-color: #c6dcee;
          box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31);
          margin: 0;
        }
        .lineDark {
          width: calc(100% - 0px);
          height: 26px;
          background-color: #c6dcee;
          box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31);
        }
        .pointCircle {
          width: 27px;
          height: 27px;
          background-color: #c6dcee;
          border: 1px solid #fff;
          border-radius: 50%;
        }
        .passIcon {
          position: absolute;
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_right2.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(85, 186, 158, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .currentPoint {
          position: absolute;
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_circle.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(44, 133, 255, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .delayPoint {
          position: absolute;
          width: 28px;
          height: 28px;
          background: url('../../../assets/images/index/point_amaze2.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(251, 90, 86, 0.38);
          border-radius: 50%;
          overflow: hidden;
        }
        .noStart {
          position: absolute;
          width: 27px;
          height: 27px;
          background: url('../../../assets/images/index/point5.png');
          background-size: 100% 100%;
          box-shadow: 0px 6px 13px 0px rgba(103, 102, 102, 0.38);
          //border: 1px solid #fff;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }
    .monthBar:nth-child(3n + 1) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #fb5a56;
      }
      background: url('../../../assets/images/index/monthNew (1).png') no-repeat;
      background-size: 100% 100%;
    }
    .monthBar:nth-child(3n + 2) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #2c85ff;
      }
      background: url('../../../assets/images/index/monthNew (2).png') no-repeat;
      background-size: 100% 100%;
    }
    .monthBar:nth-child(3n + 3) .monthBg {
      .monthName {
        font-family: PingFang SC;
        font-weight: bold;
        color: #ffaa30;
      }
      background: url('../../../assets/images/index/monthNew (3).png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.el-table_1_column_1 {
  .cell {
    text-align: left !important;
  }
}
//.el-table_1_column_7 {
//  .cell {
//    text-align: left !important;
//  }
//}
.TimeLineWrap {
  /*滚动条的宽度*/
  // ::-webkit-scrollbar {
  //   width: 0px !important;
  //   height: 2px;
  // }
  // /* //滚动条的滑块 */
  // ::-webkit-scrollbar-thumb {
  //   background-color: #d1d1d1;
  //   border-radius: 3px;
  // }
  // .el-table {
  //   border: 1px solid #ebeff5;
  //   .el-table__fixed-right {
  //     margin-top: 5px;
  //   }
  //   td {
  //     padding: 6px 0px !important;
  //   }
  //   .cell {
  //     padding: 0 10px;
  //   }
  // }
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
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 20px;
  width: 20px;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;

  & .hover-effect {
    cursor: pointer;
    transition: background 0.3s;

    & :hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
.BottomBar {
  width: 100%;
  height: 38%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 17px;
  .new {
    margin-left: 15px;
    padding-right: 20px !important;
  }
  .agent {
    padding-right: 20px !important;
  }
  .MyToDo {
    width: 65%;
    height: 100%;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
    //.el-table__body-wrapper {
    //  max-height: 260px !important;
    //}
    .TimeLineWrap {
      //.el-table--enable-row-transition {
      //  max-height: 234px !important;
      //}
      //.is-scrolling-left {
      //  max-height: 210px !important;
      //}
      //.is-scrolling-right {
      //  max-height: 210px !important;
      //}
      //.is-scrolling-middle {
      //  max-height: 210px !important;
      //}
      // .is-scrolling-none {
      //   max-height: 1900px !important;
      // }
      .el-table__fixed-body-wrapper {
        top: 48px !important;
        //max-height: 1900px !important;
        table {
          thody {
            tr {
              td:last-child {
                height: 99px !important;
              }
            }
          }
        }
      }
      width: 100%;
      margin-top: 10px;
      height: calc(100% - 40px);
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
    font-weight: bold;
    font-size: 16px;
    //width: 80px;
    height: 40px;
    line-height: 40px;
    background-color: rgb(89, 190, 135, 0.15);
    border-radius: 4px;
    text-align: center;
    color: #59be87;
    cursor: pointer;
  }
  .Message {
    overflow: hidden;
    width: 34%;
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
          font-weight: 600;
          white-space: nowrap;
          color: #333333;
          margin-right: 10px;
        }
        .MessageContent {
          font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Source Han Sans CN Light', Arial, sans-serif;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .BarTitleWrap {
    //padding-left: 10px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Source Han Sans CN Light', Arial, sans-serif;
    font-size: 17px;
    color: #333333;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .TabBar {
      width: 180px;
      height: 42px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      box-sizing: border-box;
      border-radius: 4px;

      color: #000000;
      background-color: #f3f7f8;
      .Tabli {
        font-weight: bold;
        width: 90px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Source Han Sans CN Light', Arial, sans-serif;
      }
      .currentTabli {
        background-color: #4192d3;
        border-radius: 4px;
        color: #ffffff;
      }
    }
    .more {
      font-size: 16px;
      color: #4192d3;
      cursor: pointer;
    }
  }
}
.gantt-elastic {
  padding-left: 30px !important;
  padding-top: 20px !important;
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
.needHlep {
  box-shadow: 0px 0px 13px 0px rgba(127, 127, 127, 0.1);
  position: absolute;
  //background-color: rgba(65, 146, 211, 1);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: inline-block;
  color: rgba(65, 146, 211, 1);
  font-size: 20px;
  margin: 0px 0px 0px -90px;
  .needHlepTxt {
    font-weight: 600;
    border-radius: 50%;
    border: 2px solid rgba(65, 146, 211, 1);
    font-size: 20px;
    width: 30px;
    height: 30px;
    padding-top: 3px;
  }
}
.needHlep:active {
  background: #126c9e !important;
  font-weight: bold;
}
/*按钮悬浮*/
.needHlep:hover {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHlepTxt {
    border: 2px solid #fff;
  }
}
/*按钮点击*/
.needHlep:focus {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHlepTxt {
    border: 2px solid #fff;
  }
}
.operation {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4192d3;
  font-size: 16px;
  cursor: pointer;

  .submit_icon {
    font-size: 26px;
  }
}
.gantt-elastic ::-webkit-scrollbar {
  width: 0px !important;
  height: 6px !important;
}
.gantt-elastic ::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 3px;
}
</style>

<!--
 * @Description: 甘特图组件 --基于gantt-elastic
 * @Date: 2022-06-16 09:31:24
 * @LastEditTime: 2022-10-20 14:25:01
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
    <GanttElastic :tasks="tasks" :options="options">
      <!-- <GanttElasticHeader slot="header"></GanttElasticHeader> -->
    </GanttElastic>
    <div v-show="popUpShow" class="hover_con" :style="positionStyle">
      <div class="triangle"></div>
      {{ content.label }}<br />
      开始日期:{{ dayjs(content.startTime) }} <br />
      结束日期:{{ dayjs(content.endTime) }} <br />
    </div>
  </div>
</template>

<script>
import GanttElastic from 'gantt-group'
import GanttElasticHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'
export default {
  name: 'VueAdminTemplateIndex',

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
                alert('description clicked!\n' + data.label)
              },
            },
          },
        ],
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
      tasks: [
        {
          id: 'task-3',
          label: '202206',
          start: dayjs('2022-02-02').valueOf(),
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
          label: '202207',
          start: dayjs('2022-08-10').valueOf(),
          end: dayjs('2023-03-01').valueOf(),
          percent: 25,
          type: 'group',
          tasks: [
            {
              id: 15,
              label: 'V0',
              start: dayjs('2022-08-15').valueOf(),
              end: dayjs('2022-08-25').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C0E2D9',
                  stroke: '#C0E2D9',
                  textColor:'#5EBCA2'
                }
              },
              parentId:'task-4'
            },
            {
              id: 16,
              label: 'V1',
              start: dayjs('2022-08-28').valueOf(),
              end: dayjs('2023-02-28').valueOf(),
              percent: 50,
              type: 'task',
              style: {
                base: {
                  fill: '#C0E2D9',
                  stroke: '#C0E2D9',
                  textColor:'#5EBCA2'
                }
              },
              parentId:'task-4'
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
    // let date = new Date()
    // console.log(date.getTime())
    // console.log(dayjs('2022-06-16').valueOf())
  },

  methods: {
    dayjs(time) {
      return dayjs(time).format('YYYY-MM-DD')
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
  height: 300px;
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
</style>

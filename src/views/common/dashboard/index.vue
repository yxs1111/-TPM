<!--
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-11-17 19:21:02
-->
<template>
  <div class="dashboard-container">
    <div class="TopBar">
      <div class="Topli">
        <div>上月总金额</div>
        <div class="TopliNumWrap">
          <span class="unit">¥</span>
          <span class="TopliNum">564,839.00</span>
        </div>
      </div>
      <div class="Topli">
        <div>上月总销量</div>
        <div class="TopliNumWrap">
          <span class="TopliNum">396.0</span>
        </div>
      </div>
      <div class="Topli">
        <div>上月新客达成率</div>
        <div class="TopliNumWrap">
          <span class="TopliNum">80%</span>
        </div>
      </div>
      <div class="Topli">
        <div>待审批任务</div>
        <div class="TopliNumWrap">
          <span class="TopliNum">483</span>
        </div>
      </div>
    </div>
    <div class="chartWrap">
      <div class="chartli" id="SalesAmount"></div>
      <div class="chartli" id="ActualSales"></div>
    </div>
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
          <div class="TimeLineTop">
            <div class="TimeLineTitleli">年月</div>
            <div class="TimeLineTitleli">版本号</div>
            <div class="TimeLineTitleli">当前节点</div>
            <div class="TimeLineTitleli">提交人</div>
            <div class="TimeLineTitleli">操作</div>
          </div>
          <div class="TimeLineBar">
            <el-timeline>
              <el-timeline-item color="#4192d3">
                <div class="TimeLineli">
                  <div class="TimeLineTitleli">2019年10月1日</div>
                  <div class="TimeLineTitleli">V3</div>
                  <div class="TimeLineTitleli">Fin 审批</div>
                  <div class="TimeLineTitleli">Frodo</div>
                  <div class="TimeLineTitleli">
                    <div class="TimeLineOpertion">办理</div>
                  </div>
                </div>
              </el-timeline-item>
              <el-timeline-item color="#4192d3">
                <div class="TimeLineli">
                  <div class="TimeLineTitleli">2019年10月1日</div>
                  <div class="TimeLineTitleli">V3</div>
                  <div class="TimeLineTitleli">Fin 审批</div>
                  <div class="TimeLineTitleli">Frodo</div>
                  <div class="TimeLineTitleli">
                    <div class="TimeLineOpertion">办理</div>
                  </div>
                </div>
              </el-timeline-item>
              <el-timeline-item color="#4192d3">
                <div class="TimeLineli">
                  <div class="TimeLineTitleli">2019年10月1日</div>
                  <div class="TimeLineTitleli">V3</div>
                  <div class="TimeLineTitleli">Fin 审批</div>
                  <div class="TimeLineTitleli">Frodo</div>
                  <div class="TimeLineTitleli">
                    <div class="TimeLineOpertion">办理</div>
                  </div>
                </div>
              </el-timeline-item>
              <el-timeline-item color="#4192d3">
                <div class="TimeLineli">
                  <div class="TimeLineTitleli">2019年10月1日</div>
                  <div class="TimeLineTitleli">V3</div>
                  <div class="TimeLineTitleli">Fin 审批</div>
                  <div class="TimeLineTitleli">Frodo</div>
                  <div class="TimeLineTitleli">
                    <div class="TimeLineOpertion">办理</div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="TimeLineWrap" v-show="currentIndex == 1">
          已完成
        </div>
      </div>
      <div class="Message MyToDo">
        <div class="BarTitleWrap">
          <span>消息</span>
          <span class="more">更多</span>
        </div>
        <div class="MessgaeWrap">
          <div class="Messgaeli">
            <span class="MessageDate">[2019-10-01]</span>
            <span class="MessageContent">您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！</span>
          </div>
          <div class="Messgaeli">
            <span class="MessageDate">[2019-10-01]</span>
            <span class="MessageContent">您有新的待审批任务。</span>
          </div>
          <div class="Messgaeli">
            <span class="MessageDate">[2019-10-01]</span>
            <span class="MessageContent">您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！</span>
          </div>
          <div class="Messgaeli">
            <span class="MessageDate">[2019-10-01]</span>
            <span class="MessageContent">您有新的待审批任务。</span>
          </div>
          <div class="Messgaeli">
            <span class="MessageDate">[2019-10-01]</span>
            <span class="MessageContent">您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！您有一个新的消息啦！</span>
          </div>
          <div class="Messgaeli">
            <span class="MessageDate">……</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '@/utils/auth'

export default {
  name: 'Dashboard',
  created() {},
  data() {
    return {
      avatar: auth.getAvatar(),
      name: auth.getName(),
      SalesAmountChart: '',
      ActualSalesChart: '',
      TabList: [
        { id: 0, title: '待完成' },
        { id: 1, title: '已完成' },
      ],
      currentIndex: 0,
    }
  },
  mounted() {
    this.createdEchart()
    window.addEventListener('resize', () => {
      this.SalesAmountChart.resize()
      this.ActualSalesChart.resize()
    })
  },
  watch: {
    '$store.state.app.sidebar.opened'() {
      setTimeout(() => {
        console.log('change')
        this.SalesAmountChart.resize()
        this.ActualSalesChart.resize()
      }, 200)
    },
  },
  methods: {
    // 创建图表
    createdEchart() {
      var SalesAmountChart = echarts.init(
        document.getElementById('SalesAmount')
      )
      SalesAmountChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          text: '每月促销金额',
          textStyle: {
            fontSize: 22,
            color: '#333',
          },
          top: '5%',
          left: '2%',
        },
        grid: {
          top: '24%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          nameTextStyle: {
            fontSize: 16,
            color: '#999999',
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: 14,
            itemStyle: {
              color: '#4192d3',
              borderRadius: [7, 7, 0, 0],
            },
          },
        ],
      })
      this.SalesAmountChart = SalesAmountChart
      var ActualSalesChart = echarts.init(
        document.getElementById('ActualSales')
      )
      ActualSalesChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        title: {
          text: '每月实际销量',
          textStyle: {
            fontSize: 22,
            color: '#333',
          },
          top: '5%',
          left: '2%',
        },
        grid: {
          top: '24%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          nameTextStyle: {
            fontSize: 16,
            color: '#999999',
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
            // 设置折线上圆点大小
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
              color: '#579cf9',
              borderWidth: 2,
              borderColor: '#ffffff',
            },
            lineStyle: {
              color: '#579cf9',
            },

            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#4c8bfd',
                },
                {
                  offset: 1,
                  color: '#ffffff',
                },
              ]),
            },
            smooth: true,
          },
        ],
      })
      this.ActualSalesChart = ActualSalesChart
    },
    changeCurrent(index) {
      this.currentIndex = index
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  font-size: 16px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .TopBar {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .Topli {
      // width: 361px;
      height: 160px;
      width: 24%;
      // height: 100%;
      border-radius: 20px;
      padding: 36px 45px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fafcfd;
      box-shadow: -2px 0px 29px 0px rgba(57, 172, 253, 0.69);
      font-size: 20px;
      color: #fafcfd;
      background: url('../../../assets/images/index/HomeBG (4).png') no-repeat;
      // background-position: -30px -30px;
      background-size: 100% 100%;
      .TopliNumWrap {
        .unit {
          margin-right: 5px;
        }
        .TopliNum {
          font-family: SourceHanSansCN-Regular;
          font-size: 38px;
          font-weight: 600;
        }
      }
    }
    & .Topli:nth-child(4n + 1) {
      background-image: url('../../../assets/images/index/HomeBG (1).png');
    }
    & .Topli:nth-child(4n + 2) {
      background-image: url('../../../assets/images/index/HomeBG (2).png');
      box-shadow: -2px 0px 29px 0px rgba(250, 133, 102, 0.69);
    }
    & .Topli:nth-child(4n + 3) {
      background-image: url('../../../assets/images/index/HomeBG (3).png');
      box-shadow: -2px 0px 29px 0px rgba(58, 218, 202, 0.69);
    }
    & .Topli:nth-child(4n + 4) {
      background-image: url('../../../assets/images/index/HomeBG (4).png');
      box-shadow: -2px 0px 29px 0px rgba(255, 185, 65, 0.69);
    }
  }
  .chartWrap {
    width: 100%;
    height: 310px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
    .chartli {
      width: 49%;
      height: 310px;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
    }
  }
  .BottomBar {
    width: 100%;
    height: 370px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
    .MyToDo {
      width: 65%;
      height: 370px;
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
            width: 100%;
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
              line-height: 68px;
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
      font-size: 22px;
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
}
</style>
<style>
/* timeLine 样式设置 */
.el-timeline-item__wrapper {
  width: 100%;
}
.el-timeline-item__timestamp.is-bottom {
  margin-bottom: 0;
}
.el-timeline-item__tail {
  height: 190%;
  width: 3px;
  background-color: #4192d3;
  border: none;
}
.el-timeline-item__node {
  background-color: #fff !important;
  border: 2px solid #4192d3!important;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* //滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 3px;
}
</style>

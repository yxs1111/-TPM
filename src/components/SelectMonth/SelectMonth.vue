<!--
 * @Description: 多个月份选择
 * @Date: 2022-01-07 14:42:30
 * @LastEditTime: 2022-01-07 15:04:39
-->
<template>
  <div class="monthEl">
    <div @mouseenter="changeIcon" @mouseleave="removeIcon">
      <el-input v-model="monthVal" placeholder="选择月份" readonly @click.stop.native="isMonthDis = true">
      </el-input>
      <i class="el-icon-circle-close" v-show="isRemove" @click="monthValRemove"></i>
    </div>
    <transition name="fade">
      <div class="month" v-show="isMonthDis" @click.stop="isMonthDis = true">
        <div class="YearWrap">
          <i class="el-icon-d-arrow-left" @click="addAndReduce('reduce')"></i>
          <span>{{years}}年</span>
          <i class="el-icon-d-arrow-right" @click="addAndReduce('add')"></i>
        </div>
        <ul class="monthWrap">
          <li v-for="(item, i) in months" :key="i" @click="monthSelected(item)">
            <span :class="{'selected': item.show, 'active': item.currentM}">{{item.num}}月</span>
          </li>
        </ul>
        <el-row type="flex" justify="end">
          <el-button class="mini" @click.stop="sure">确定</el-button>
        </el-row>
      </div>
    </transition>
  </div>
</template>
<script>
// import moment from 'moment'
export default {
  data() {
    return {
      monthVal: '',
      years: '',
      months: [],
      isMonthDis: false,
      isRemove: false,
      filter: {
        billinDateList: [],
      },
    }
  },
  mounted() {
    let date = new Date()
    this.years = date.getFullYear()
    for (var i = 1; i <= 12; i++) {
      this.months.push({
        num: i,
        show: false,
        currentM: false,
      })
    }
  },
  watch: {
    // 月账单
    monthVal(val) {
      let arr = []
      if (val) {
        console.log(val);
        this.$emit('multipleMonth',val)
      } else {
        this.filter.billinDateList = null
        this.clearSelected()
      }
    },
    isMonthDis(val) {
      if (val) {
        this.ergodic()
      } else {
        if (!this.monthVal) {
          this.clearSelected()
        }
      }
    },
  },
  methods: {
    // 清除选中项
    clearSelected() {
      this.months.forEach((e) => {
        e.show = false
      })
    },
    // 高亮当前月
    ergodic() {
      let date = new Date()
      this.months.forEach((e) => {
        if (
          this.years === date.getFullYear() &&
          e.num === date.getMonth() + 1
        ) {
          e.currentM = true
        } else {
          e.currentM = false
        }
      })
    },
    // 选中月份
    monthSelected(item) {
      item.show = !item.show
    },
    // 确定选中值
    sure() {
      let arr = []
      this.months.forEach((e) => {
        if (e.show) {
          arr.push(`${this.years}-${e.num}`)
        }
      })
      this.monthVal = arr.join(',')
      this.isMonthDis = false
    },
    // 加减月份
    addAndReduce(type) {
      if (type === 'reduce') {
        this.years--
      } else {
        this.years++
      }
      this.ergodic()
    },
    // 鼠标移入
    changeIcon() {
      if (this.monthVal) {
        this.isRemove = true
      }
    },
    // 鼠标离开
    removeIcon() {
      this.isRemove = false
    },
    // 清空月值
    monthValRemove() {
      this.monthVal = ''
    },
  },
}
</script>
<style lang="less" scoped>
.monthEl {
  position: relative;
  width: 220px;
  .el-input {
    position: relative;
    cursor: pointer;
    input {
      text-overflow: ellipsis;
    }
  }
  .el-icon-circle-close {
    position: absolute;
    top: 11px;
    right: 10px;
    font-size: 14px;
    color: #c0c4cc;
    cursor: pointer;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    transform: translateY(-10px);
  }
  .month {
    position: absolute;
    top: 48px;
    left: 0;
    z-index: 4;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 12px;
    border-radius: 4px;
    .YearWrap {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 5px;
      i {
        font-size: 12px;
        margin-top: 7px;
      }
    }
    ul {
      list-style: none;
      padding-left: 0;
      li {
        width: 25%;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        cursor: pointer;
        font-size: 12px;
        text-align: center;
        span {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
        }
      }
      li:hover {
        color: #409eff;
      }
      .active {
        color: #409eff;
        font-weight: 700;
      }
      .selected {
        color: #fff;
        background: #409eff;
        border-radius: 15px;
      }
    }
    .mini {
      font-size: 12px;
    }
  }
}
.monthWrap {
  display: flex;
  flex-wrap: wrap;
}
</style>

<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-06-20 15:37:22
-->
<template>
  <div class="tabViewsWrap">
    <div class="tabViews" ref="tab" @mousemove="mousemove" @mousedown="mousedown" @mouseup="mouseup">
      <router-link v-for="(item, index) in routerList" :key="index" :to="item.path" tag="div" class="tabli" :class="index === currentIndex ? 'currentTabli' : ''"
        @click.native="changeTab(index)">
        <img v-if="index != currentIndex" :src="item.img.light" alt="">
        <img v-if="index == currentIndex" :src="item.img.dark" alt="">
        <div class="tabTitle"> {{ item.name }}</div>
      </router-link>
    </div>
    <div style="margin-top: -5px;">
      <router-view />
    </div>
  </div>
</template>

<script>
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  directives: { elDragDialog, permission },
  name: 'CustomerContractEntry',
  data() {
    return {
      // routerList: [
      //   {name:'折扣项-汇总',path:'/V2/V2Apply/V2discountAll'},
      //   {name:'折扣项-价促',path:'/V2/V2Apply/V2discountDiscount'},
      //   {name:'折扣项-新客',path:'/V2/V2Apply/V2discountNU'},
      // ],
      routerList: [
        {
          name: '间供',
          path: '/contractManagement/ContractEntry/CustomerContractEntry/UnStraightGiving',
          img: {
            dark: require('@/assets/images/tab/UnStraightGiving.png'),
            light: require('@/assets/images/tab/UnStraightGiving_l.png'),
          },
        },
        {
          name: '准直供',
          path: '/contractManagement/ContractEntry/CustomerContractEntry/LikenessStraightGiving',
          img: {
            dark: require('@/assets/images/tab/LikeStraightGiving.png'),
            light: require('@/assets/images/tab/LikeStraightGiving_l.png'),
          },
        },
        {
          name: '直供',
          path: '/contractManagement/ContractEntry/CustomerContractEntry/StraightGiving',
          img: {
            dark: require('@/assets/images/tab/StraightGiving.png'),
            light: require('@/assets/images/tab/StraightGiving_l.png'),
          },
        },
      ],
      currentIndex: 0,
      startX: 0,
      endX: 0,
      isCanMove: 0,
      setInterval:null
    }
  },
  computed: {},
  mounted() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
    } else {
      this.currentIndex = 0
    }
  },
  methods: {
    // tabview 切换
    changeTab(index) {
      this.currentIndex = index
      sessionStorage.setItem('currentIndex', index)
    },
    mousemove(e) {
      // if (this.isCanMove) {
      //   console.log(this.isCanMove)
      //   this.endX = e.clientX
      //   let distance
      //   if (this.startX > this.endX) {
      //     console.log('左滑')
      //     distance = this.startX - this.endX
      //     // let index = 0
      //     this.$refs.tab.scrollLeft-=distance
      //     // if (index < distance) {
      //     //   index++
      //     //   this.setInterval = setInterval(() => {
      //     //     this.$refs.tab.scrollLeft--
      //     //   }, 100)
      //     // } else {
      //     //   clearInterval(this.setInterval)
      //     // }
      //   } else {
      //     distance = this.endX - this.startX
      //     console.log('右滑')
      //     this.$refs.tab.scrollLeft += distance
      //   }
      // }
    },
    mousedown(e) {
      this.isCanMove = 1
      this.startX = e.clientX
      console.log(this.isCanMove)
    },
    mouseup(e) {
      this.isCanMove = 0
      console.log(this.isCanMove)
    },
  },
}
</script>

<style lang="scss" scoped>
.tabViews {
  width: 100%;
  height: 38px;
  display: flex;
  margin-left: 25px;
  overflow-x: scroll;
  overflow-y: hidden;
  .tabli {
    display: flex;
    align-items: center;
    padding: 0 52px;
    height: 38px;
    background: #4192d3;
    border-radius: 6px 6px 0px 0px;
    margin-right: 20px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    img {
      width: 17px;
      height: 17px;
      margin-right: 10px;
    }
    .tabTitle {
      width: 50px;
      padding: 30px 0;
    }
  }
  .currentTabli {
    background-color: #fff;
    color: #666;
    font-weight: 600;
  }
}
</style>
<style lang="scss">
//   .tabViews ::-webkit-scrollbar {
//   width: 6px !important;
//   height: 6px!important;
// }
// /* //滚动条的滑块 */
// .tabViews ::-webkit-scrollbar-thumb {
//   background-color: #a1a3a9!important;
//   border-radius: 3px!important;
// }
.tabViews::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
  -webkit-appearance: none;
}
.tabViews::-webkit-scrollbar:vertical {
  width: 11px;
}
.tabViews::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

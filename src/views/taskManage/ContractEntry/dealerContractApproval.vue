<!--
 * @Description: 经销商合同审批 Tab
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2023-01-14 12:20:03
-->
<template>
  <div class="tabViewsWrap">
    <div class="tabViews" ref="tab">
      <router-link v-for="(item, index) in routerList" :key="index" :to="item.path" tag="div" class="tabli" :class="index === currentIndex ? 'currentTabli' : ''" @click.native="changeTab(index)">
        <img v-if="index != currentIndex" :src="item.img.light" alt="" />
        <img v-if="index == currentIndex" :src="item.img.dark" alt="" />
        <span class="tabTitle">{{ item.name }}</span>
      </router-link>
    </div>
    <div style="margin-top: -5px">
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
      routerList: [
        {
          name: '明细审批',
          path: '/contractManagement/dealer/dealerContractApproval/dealerContractTermApproval',
          img: {
            dark: require('@/assets/images/tab/Term.png'),
            light: require('@/assets/images/tab/Term_l.png'),
          },
        },
        {
          name: '变更审批',
          path: '/contractManagement/dealer/dealerContractApproval/dealerContractChangeApproval',
          img: {
            dark: require('@/assets/images/tab/Change.png'),
            light: require('@/assets/images/tab/Change_l.png'),
          },
        },
      ],
      currentIndex: 0,
      startX: 0,
      endX: 0,
      isCanMove: 0,
      setInterval: null,
    }
  },
  computed: {},
  mounted() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
      this.$router.push(this.routerList[this.currentIndex].path)
    } else {
      this.currentIndex = 0
    }
  },
  activated() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
      this.$router.push(this.routerList[this.currentIndex].path)
    } else {
      this.currentIndex = 0
    }
  },
  methods: {
    // tabview 切换
    changeTab(index) {
      this.currentIndex = index
      sessionStorage.removeItem('filterObj')
      sessionStorage.setItem('currentIndex', index)
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
      white-space: nowrap;
      // width: 50px;
      // padding: 30px 0;
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

<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2021-11-26 15:50:54
-->
<template>
  <div>
    <div class="tabViews">
      <router-link :to="item.path" tag="div" class="tabli" :class="index === currentIndex ? 'currentTabli' : ''" v-for="(item, index) in routerList" :key="index"
        @click.native="changeTab(index)">{{ item.name }}</router-link>
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { getDefaultPermissions, parseTime, getTextMap } from '@/utils'
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  data() {
    return {
      routerList: [
        {name:'折扣项-汇总',path:'/V2/V2Approval/V2AllApproval'},
        {name:'折扣项-价促',path:'/V2/V2Approval/V2DiscountApproval'},
        {name:'折扣项-新客',path:'/V2/V2Approval/V2NUApproval'},
      ],
      currentIndex: 0
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    if (sessionStorage.getItem('currentIndex')) {
      this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
    } else {
      this.currentIndex = 0
    }
  },
  computed: {},
  methods: {
    //tabview 切换
    changeTab(index) {
      this.currentIndex = index
      sessionStorage.setItem('currentIndex', index)
    }
  },
}
</script>

<style lang="scss" scoped>
.tabViews {
  width: 100%;
  height: 36px;
  display: flex;
  margin-left: 25px;
  .tabli {
    padding: 0 52px;
    height: 36px;
    background: #FFF;
    border-radius: 6px 6px 0px 0px;
    margin-right: 20px;
    font-size: 14px;
    color: #666;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }
  .currentTabli {
    
    background-color: #4192D3;
    color: #fff;
    font-weight: 600;
  }
}
</style>

<!--
 * @Description: 
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-06-10 16:44:01
-->
<template>
  <div class="tabViewsWrap">
    <div class="tabViews">
      <router-link :to="item.path" tag="div" class="tabli" :class="index === currentIndex ? 'currentTabli' : ''" v-for="(item, index) in routerList" :key="index"
        @click.native="changeTab(index)">
        <img v-if="index != currentIndex" :src="item.img.light" alt="">
        <img v-if="index == currentIndex" :src="item.img.dark" alt="">
        {{ item.name }}
      </router-link>
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
        {
          name: '汇总 - 费用管理',
          path: '/taskManage/MyTodo/MyTodoAll',
          img: {
            dark: require('@/assets/images/tab/tab1.png'),
            light: require('@/assets/images/tab/tab1_l.png'),
          },
        },
        // {
        //   name: '折扣项',
        //   path: '/taskManage/MyTodo/MyTodoDiscount',
        //   img: {
        //     dark: require('@/assets/images/tab/tab2.png'),
        //     light: require('@/assets/images/tab/tab2_l.png'),
        //   },
        // },
        {
          name: '折扣项',
          path: '/taskManage/MyTodo/MyTodoDiscount',
          img: {
            dark: require('@/assets/images/tab/tab2.png'),
            light: require('@/assets/images/tab/tab2_l.png'),
          },
        },
        // {
        //   name: 'Contract',
        //   path: '/taskManage/MyTodo/ContractTodo',
        //   img: {
        //     dark: require('@/assets/images/tab/tab3.png'),
        //     light: require('@/assets/images/tab/tab3_l.png'),
        //   },
        // },
      ],
      currentIndex: 0,
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
  }
  .currentTabli {
    background-color: #fff;
    color: #666;
    font-weight: 600;
  }
}
</style>

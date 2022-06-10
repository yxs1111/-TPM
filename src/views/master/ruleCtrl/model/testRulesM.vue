<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-06-10 16:42:53
-->
<template>
  <div>
    <div class="tabViews">
      <router-link
        v-for="(item, index) in routerList"
        :key="index"
        :to="item.path"
        tag="div"
        class="tabli"
        :class="index === currentIndex ? '' : 'currentTabli'"
        @click.native="changeTab(index)"
      >{{ item.name }}</router-link>
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>

import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  directives: { elDragDialog, permission },
  data() {
    return {
      routerList: [
        // { name: 'Price Promotion', path: '/master/ruleCtrl/model/TestRules' },
        // { name: 'New User', path: '/master/ruleCtrl/model/TestRulesNew' }
      ],
      currentIndex: 0
    }
  },
  computed: {},
  mounted() {
    this.queryMinePackageSelect()
  },
  methods: {
    // tab标签权限
    queryMinePackageSelect() {
      let signP = 0
      let signN = 0
      selectAPI.queryMinePackageSelect().then(res => {
        res.data.forEach(element => {
          if (element.costType === 'Price Promotion' && signP === 0) {
            this.routerList.push({ name: 'Price Promotion', path: '/master/ruleCtrl/model/TestRules' })
            signP = 1
          } else if (element.costType === 'New User' && signN === 0) {
            this.routerList.push({ name: 'New User', path: '/master/ruleCtrl/model/TestRulesNew' })
            signN = 1
          }
        })
        if (this.routerList.length === 0 || res.data.length === 0) {
          this.routerList = [
            { name: 'Price Promotion', path: '/master/ruleCtrl/model/TestRules' },
            { name: 'New User', path: '/master/ruleCtrl/model/TestRulesNew' }
          ]
        }
        // this.routerList = [
        //     ...this.routerList,
        //     {
        //       name: 'HIH Rebate',
        //       path: '/master/ruleCtrl/model/splitRulesHIH',
        //       img: {
        //         dark: require('@/assets/images/tab/tab2.png'),
        //         light: require('@/assets/images/tab/tab2_l.png')
        //       }
        //     },
        //     {
        //       name: 'KA Rebate',
        //       path: '/master/ruleCtrl/model/splitRulesKA',
        //       img: {
        //         dark: require('@/assets/images/tab/tab3.png'),
        //         light: require('@/assets/images/tab/tab3_l.png')
        //       }
        //     }
        //   ]
        if (sessionStorage.getItem('currentIndex')) {
          this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
        } else {
          this.currentIndex = 0
        }
      }).catch()
    },
    // tabview 切换
    changeTab(index) {
      this.currentIndex = index
      sessionStorage.setItem('currentIndex', index)
    }
  }
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

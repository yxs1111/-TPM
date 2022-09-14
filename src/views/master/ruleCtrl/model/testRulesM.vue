<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-09-14 09:54:55
-->
<template>
  <div class='tabViewsWrap'>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane :label="item.name"
                   :name="item.name"
                   v-for="item,index in routerList"
                   :key="index">
        <!-- tab 内容 -->
        <template slot="label">
          <div class="TabWrap">
            <div>{{item.name}}</div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div style="height: calc(100vh - 0px);">
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
      currentIndex: 0,
      activeName: '',
    }
  },
  computed: {},
  mounted() {
    this.queryMinePackageSelect()
  },
  methods: {
    tabInit() {
      if (sessionStorage.getItem('currentIndex')) {
        this.activeName = this.routerList[Number(this.currentIndex)].name
        this.$router.push(this.routerList[Number(this.currentIndex)].path)
      } else {
        this.activeName = this.routerList[0].name
        this.$router.push(this.routerList[0].path)
      }
    },
    handleClick(tab) {
      let index = Number(tab.index)
      this.currentIndex = index
      this.$router.push(this.routerList[index].path)
      sessionStorage.setItem('currentIndex', index)
    },
    // tab标签权限
    queryMinePackageSelect() {
      let signP = 0
      let signN = 0
      selectAPI
        .queryMinePackageSelect()
        .then((res) => {
          res.data.forEach((element) => {
            if (element.costType === 'Price Promotion' && signP === 0) {
              this.routerList.push({
                name: 'Price Promotion',
                path: '/master/ruleCtrl/model/TestRules',
              })
              signP = 1
            } else if (element.costType === 'New User' && signN === 0) {
              this.routerList.push({
                name: 'New User',
                path: '/master/ruleCtrl/model/TestRulesNew',
              })
              signN = 1
            }
          })
          if (this.routerList.length === 0 || res.data.length === 0) {
            this.routerList = [
              {
                name: 'Price Promotion',
                path: '/master/ruleCtrl/model/TestRules',
              },
              { name: 'New User', path: '/master/ruleCtrl/model/TestRulesNew' },
            ]
          }
          this.routerList = [
            ...this.routerList,
            {
              name: 'HIH Rebate',
              path: '/master/ruleCtrl/model/splitRulesHIH',
              img: {
                dark: require('@/assets/images/tab/tab2.png'),
                light: require('@/assets/images/tab/tab2_l.png'),
              },
            },
            {
              name: 'KA Rebate',
              path: '/master/ruleCtrl/model/splitRulesKA',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'FMC',
              path: '/master/ruleCtrl/model/splitRulesFMC',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'Roadshow',
              path: '/master/ruleCtrl/model/splitRulesRoadShow',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'Listing Fee',
              path: '/master/ruleCtrl/model/splitRulesListingFee',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'POSM-标准',
              path: '/master/ruleCtrl/model/splitRulesPOSM',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'ECM',
              path: '/master/ruleCtrl/model/splitRulesECM',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'Display',
              path: '/master/ruleCtrl/model/splitRulesDisplay',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'Premium',
              path: '/master/ruleCtrl/model/splitRulesPremium',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
            {
              name: 'Free Goods-Tin',
              path: '/master/ruleCtrl/model/splitRulesFreeGoods-Tin',
              img: {
                dark: require('@/assets/images/tab/tab3.png'),
                light: require('@/assets/images/tab/tab3_l.png'),
              },
            },
          ]
          if (sessionStorage.getItem('currentIndex')) {
            this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
          } else {
            this.currentIndex = 0
          }
          if (!this.$route.query.minePackageName) {
          } else {
            // 我的待办跳转
            this.currentIndex = this.routerList.findIndex(
              (item) =>
                item.minePackageName == this.$route.query.minePackageName
            )
            sessionStorage.setItem('currentIndex', this.currentIndex)
          }
          this.tabInit()
        })
        .catch()
    },
  },
}
</script>

<style lang="scss" scoped>
.tabViews {
  width: 100%;
  height: 38px;
  display: flex;
  margin-left: 10px;
  .tabli {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 38px;
    background: #4192d3;
    border-radius: 6px 6px 0px 0px;
    margin-right: 20px;
    font-size: 11px;
    color: #fff;
    text-align: center;
    line-height: 15px;
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
<style lang='scss'>
.el-tabs__header {
  margin-bottom: 0 !important;
}
.el-tabs__item {
  padding: 0 20px !important;
  height: 38px;
  background: #4192d3;
  border-radius: 6px 6px 0px 0px;
  margin-right: 20px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  &:hover {
    // background-color: #fff;
    color: #fff;
  }
  .TabWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    .TabImg {
      width: 17px;
      height: 17px;
      margin-right: 10px;
    }
  }
}
.el-tabs__item.is-active {
  background-color: #fff !important;
  color: #666 !important;
}
.el-tabs__active-bar {
  display: none;
}
</style>

<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-09-14 09:23:55
-->
<template>
  <div class="tabViewsWrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="item.name"
        :name="item.name"
        v-for="(item, index) in routerList"
        :key="index"
      >
        <!-- tab 内容 -->
        <template slot="label">
          <div class="TabWrap">
            <img
              v-show="index == currentIndex"
              class="TabImg"
              :src="item.img.dark"
            />
            <img
              v-show="index != currentIndex"
              class="TabImg"
              :src="item.img.light"
            />
            <div>{{ item.name }}</div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div style="height: calc(100vh - 0px)">
      <router-view />
    </div>
  </div>
</template>

<script>
import selectAPI from '@/api/selectCommon/selectCommon.js'

export default {
  data() {
    return {
      routerList: [],
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
                name: '折扣项-价促',
                path: '/costManagement/V1/V1Approval/V1discountDiscountApproval',
                img: {
                  dark: require('@/assets/images/tab/tab2.png'),
                  light: require('@/assets/images/tab/tab2_l.png'),
                },
                minePackageName: 'Price Promotion',
              })
              signP = 1
            } else if (element.costType === 'New User' && signN === 0) {
              this.routerList.push({
                name: '折扣项-新客',
                path: '/costManagement/V1/V1Approval/V1discountNUApproval',
                img: {
                  dark: require('@/assets/images/tab/tab3.png'),
                  light: require('@/assets/images/tab/tab3_l.png'),
                },
                minePackageName: 'New User',
              })
              signN = 1
            }
          })
          if (this.routerList.length === 0 || res.data.length === 0) {
            this.routerList = [
              {
                name: '折扣项-价促',
                path: '/costManagement/V1/V1Approval/V1discountDiscountApproval',
                img: {
                  dark: require('@/assets/images/tab/tab2.png'),
                  light: require('@/assets/images/tab/tab2_l.png'),
                },
              },
              {
                name: '折扣项-新客',
                path: '/costManagement/V1/V1Approval/V1discountNUApproval',
                img: {
                  dark: require('@/assets/images/tab/tab3.png'),
                  light: require('@/assets/images/tab/tab3_l.png'),
                },
              },
            ]
          }
          this.routerList = [
            ...this.routerList,
            {
              name: '折扣项-HIH Rebate',
              path: '/costManagement/V1/V1Approval/V1HIHRebate',
              img: {
                dark: require('@/assets/images/tab/tab_HIH.png'),
                light: require('@/assets/images/tab/tab_HIH_l.png'),
              },
              minePackageName: 'HIH Rebate',
            },
            {
              name: '折扣项-KA Rebate',
              path: '/costManagement/V1/V1Approval/V1KARebate',
              img: {
                dark: require('@/assets/images/tab/tab_KA.png'),
                light: require('@/assets/images/tab/tab_KA_l.png'),
              },
              minePackageName: 'KA Rebate',
            },
            {
              name: 'FMC',
              path: '/costManagement/V1/V1Approval/V1FMCApproval',
              img: {
                dark: require('@/assets/images/tab/tab_FMC.png'),
                light: require('@/assets/images/tab/tab_FMC_l.png'),
              },
              minePackageName: 'FMC',
            },
            {
              name: 'Roadshow',
              path: '/costManagement/V1/V1Approval/V1RoadShowApproval',
              img: {
                dark: require('@/assets/images/tab/tab_RoadShow.png'),
                light: require('@/assets/images/tab/tab_RoadShow_l.png'),
              },
              minePackageName: 'Roadshow',
            },
            {
              name: 'Listing Fee',
              path: '/costManagement/V1/V1Approval/V1ListingFeeApprove',
              img: {
                dark: require('@/assets/images/tab/tab_ListingFee.png'),
                light: require('@/assets/images/tab/tab_ListingFee_l.png'),
              },
              minePackageName: 'Listing fee',
            },
            {
              name: 'POSM-标准',
              path: '/costManagement/V1/V1Approval/V1POSMApprove',
              img: {
                dark: require('@/assets/images/tab/tab_POSM.png'),
                light: require('@/assets/images/tab/tab_POSM_l.png'),
              },
              minePackageName: 'POSM - Standard',
            },
            {
              name: 'POSM-定制',
              path: '/costManagement/V1/V1Approval/V1POSMCustomize',
              params: {
                smartplan: false,
              },
              img: {
                dark: require('@/assets/images/tab/tab_POSM.png'),
                light: require('@/assets/images/tab/tab_POSM_l.png'),
              },
              minePackageName: 'POSM - Customized',
            },
            {
              name: 'ECM',
              path: '/costManagement/V1/V1Approval/V1ECMApproval',
              img: {
                dark: require('@/assets/images/tab/tab_ECM.png'),
                light: require('@/assets/images/tab/tab_ECM_l.png'),
              },
              minePackageName: 'ECM',
            },
            {
              name: 'Display',
              path: '/costManagement/V1/V1Approval/V1ApplyrovalDisplay',
              img: {
                dark: require('@/assets/images/tab/UnStraightGiving.png'),
                light: require('@/assets/images/tab/UnStraightGiving_l.png'),
              },
              minePackageName: 'Display',
            },
            {
              name: 'Premium',
              path: '/costManagement/V1/V1Approval/V1Premium',
              img: {
                dark: require('@/assets/images/tab/StraightGiving.png'),
                light: require('@/assets/images/tab/StraightGiving_l.png'),
              },
              minePackageName: 'Premium',
            },
            {
              name: 'Free Goods-Tin',
              path: '/costManagement/V1/V1Approval/V1FreeGoodsTinApproval',
              img: {
                dark: require('@/assets/images/tab/FreeGoodsTin.png'),
                light: require('@/assets/images/tab/FreeGoodsTin_l.png'),
              },
              minePackageName:'Free Goods-Tin',
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
  margin-left: 25px;
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
<style lang="scss">
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

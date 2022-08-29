<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-06-21 10:05:28
-->
<template>
  <div class="tabViewsWrap">
    <div class="tabViews">
      <router-link v-for="(item, index) in routerList"
                   :key="index"
                   :to="item.path"
                   tag="div"
                   class="tabli"
                   :class="index === currentIndex ? 'currentTabli' : ''"
                   @click.native="changeTab(index)">
        <img v-if="index != currentIndex"
             :src="item.img.light"
             alt="">
        <img v-if="index == currentIndex"
             :src="item.img.dark"
             alt="">
        <!-- <img :src="imgSrcList[index]" alt="" v-if="index != currentIndex">
        <img :src="imgSrcList[index+3]" alt="" v-if="index == currentIndex"> -->
        {{ item.name }}
      </router-link>
    </div>
    <div style="height: calc(100vh - 0px);">
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
  data() {
    return {
      routerList: [
        // {
        //   name: '折扣项-汇总',
        //   path: '/V1/V1Apply/V1discountAll',
        //   img: {
        //     dark: require('@/assets/images/tab/tab1.png'),
        //     light: require('@/assets/images/tab/tab1_l.png'),
        //   },
        // },
        // {
        //   name: '折扣项-价促',
        //   path: '/V1/V1Apply/V1discountDiscount',
        //   img: {
        //     dark: require('@/assets/images/tab/tab2.png'),
        //     light: require('@/assets/images/tab/tab2_l.png')
        //   }
        // },
        // {
        //   name: '折扣项-新客',
        //   path: '/V1/V1Apply/V1discountNU',
        //   img: {
        //     dark: require('@/assets/images/tab/tab3.png'),
        //     light: require('@/assets/images/tab/tab3_l.png')
        //   }
        // }
      ],
      currentIndex: 0,
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
      selectAPI
        .queryMinePackageSelect()
        .then((res) => {
          res.data.forEach((element) => {
            if (element.costType === 'Price Promotion' && signP === 0) {
              this.routerList.push({
                name: '折扣项-价促',
                path: '/costManagement/V1/V1Apply/V1discountDiscount',
                img: {
                  dark: require('@/assets/images/tab/tab2.png'),
                  light: require('@/assets/images/tab/tab2_l.png'),
                },
              })
              signP = 1
            } else if (element.costType === 'New User' && signN === 0) {
              this.routerList.push({
                name: '折扣项-新客',
                path: '/costManagement/V1/V1Apply/V1discountNU',
                img: {
                  dark: require('@/assets/images/tab/tab3.png'),
                  light: require('@/assets/images/tab/tab3_l.png'),
                },
              })
              signN = 1
            }
          })
          if (this.routerList.length === 0 || res.data.length === 0) {
            this.routerList = [
              {
                name: '折扣项-价促',
                path: '/costManagement/V1/V1Apply/V1discountDiscount',
                img: {
                  dark: require('@/assets/images/tab/tab2.png'),
                  light: require('@/assets/images/tab/tab2_l.png'),
                },
              },
              {
                name: '折扣项-新客',
                path: '/costManagement/V1/V1Apply/V1discountNU',
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
              path: '/costManagement/V1/V1Apply/V1HIHRebate',
              img: {
                dark: require('@/assets/images/tab/tab_HIH.png'),
                light: require('@/assets/images/tab/tab_HIH_l.png'),
              },
            },
            {
              name: '折扣项-KA Rebate',
              path: '/costManagement/V1/V1Apply/V1KARebate',
              img: {
                dark: require('@/assets/images/tab/tab_KA.png'),
                light: require('@/assets/images/tab/tab_KA_l.png'),
              },
            },
            {
              name: 'FMC',
              path: '/costManagement/V1/V1Apply/V1FMC',
              img: {
                dark: require('@/assets/images/tab/tab_FMC.png'),
                light: require('@/assets/images/tab/tab_FMC_l.png'),
              },
            },
            {
              name: 'Roadshow',
              path: '/costManagement/V1/V1Apply/V1RoadShow',
              img: {
                dark: require('@/assets/images/tab/tab_RoadShow.png'),
                light: require('@/assets/images/tab/tab_RoadShow_l.png'),
              },
            },
            {
              name: 'Listing Fee',
              path: '/costManagement/V1/V1Apply/V1ListingFee',
              img: {
                dark: require('@/assets/images/tab/tab_ListingFee.png'),
                light: require('@/assets/images/tab/tab_ListingFee_l.png'),
              },
            },
            {
              name: 'POSM-标准',
              path: '/costManagement/V1/V1Apply/V1POSM',
              img: {
                dark: require('@/assets/images/tab/tab_POSM.png'),
                light: require('@/assets/images/tab/tab_POSM_l.png'),
              },
            },
          ]
          if (sessionStorage.getItem('currentIndex')) {
            this.currentIndex = Number(sessionStorage.getItem('currentIndex'))
          } else {
            this.currentIndex = 0
          }
          if (!this.$route.query.channelCode) {
            // 我的待办跳转
            this.$router.push(this.routerList[this.currentIndex].path)
          } else {
            this.$router.push({
              path: this.routerList[this.currentIndex].path,
              query: { channelCode: this.$route.query.channelCode },
            })
          }
        })
        .catch()
    },
    // tabview 切换
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
    padding: 0 20px;
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

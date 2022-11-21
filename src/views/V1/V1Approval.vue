<!--
 * @Description:
 * @Date: 2021-11-03 14:17:00
 * @LastEditTime: 2022-11-18 16:34:40
-->
<template>
  <div class="tabViewsWrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.name" :name="item.name" v-for="(item, index) in routerList" :key="index">
        <!-- tab 内容 -->
        <template slot="label">
          <div class="TabWrap">
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
import { sortList } from '@/utils/index'
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
                name: '价促',
                path: '/costManagement/V1/V1Approval/V1discountDiscountApproval',
                minePackageName: 'Price Promotion',
              })
              signP = 1
            } else if (element.costType === 'New User' && signN === 0) {
              this.routerList.push({
                name: 'NU',
                path: '/costManagement/V1/V1Approval/V1discountNUApproval',
                minePackageName: 'New User',
              })
              signN = 1
            }
          })
          if (this.routerList.length === 0 || res.data.length === 0) {
            this.routerList = [
              {
                name: '价促',
                path: '/costManagement/V1/V1Approval/V1discountDiscountApproval',
              },
              {
                name: '新客',
                path: '/costManagement/V1/V1Approval/V1discountNUApproval',
              },
            ]
          }
          this.routerList = [
            ...this.routerList,
            {
              name: 'HIH rebate',
              path: '/costManagement/V1/V1Approval/V1HIHRebate',
              minePackageName: 'HIH Rebate',
            },
            {
              name: 'KA rebate',
              path: '/costManagement/V1/V1Approval/V1KARebate',
              minePackageName: 'KA Rebate',
            },
            {
              name: 'FMC',
              path: '/costManagement/V1/V1Approval/V1FMCApproval',
              minePackageName: 'FMC',
            },
            {
              name: 'RS',
              path: '/costManagement/V1/V1Approval/V1RoadShowApproval',
              minePackageName: 'Roadshow',
            },
            {
              name: 'Listing',
              path: '/costManagement/V1/V1Approval/V1ListingFeeApprove',
              minePackageName: 'Listing fee',
            },
            {
              name: 'POSM-标',
              path: '/costManagement/V1/V1Approval/V1POSMApprove',
              minePackageName: 'POSM - Standard',
            },
            {
              name: 'POSM-定',
              path: '/costManagement/V1/V1Approval/V1POSMCustomize',
              minePackageName: 'POSM - Customized',
            },
            {
              name: 'ECM',
              path: '/costManagement/V1/V1Approval/V1ECMApproval',
              minePackageName: 'ECM',
            },
            {
              name: 'Display',
              path: '/costManagement/V1/V1Approval/V1ApplyrovalDisplay',
              minePackageName: 'Display',
            },
            {
              name: 'Premium',
              path: '/costManagement/V1/V1Approval/V1Premium',
              minePackageName: 'Premium',
            },
            {
              name: '价促-FG tin',
              path: '/costManagement/V1/V1Approval/V1FreeGoodsTinApproval',
              minePackageName: 'Free Goods-Tin',
            },
            {
              name: 'NU-FG win2',
              path: '/costManagement/V1/V1Approval/V1FreeGoodsWin2Approval',
              minePackageName: 'Free Goods-Win2',
            },
            {
              name: 'DM',
              path: '/costManagement/V1/V1Approval/V1DM',
              minePackageName: 'DM',
            },
            {
              name: 'Transport',
              path: '/costManagement/V1/V1Approval/V1Transport',
              minePackageName: 'Transport',
            },
          ]
          let TabList = []
          sortList.forEach((item) => {
            let findIndex = this.routerList.findIndex(
              (routerItem) => routerItem.minePackageName == item
            )
            if (findIndex != -1) {
              TabList.push(this.routerList[findIndex])
            }
          })
          this.routerList = TabList
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
  padding: 0 10px !important;
  height: 38px;
  background: #eff2f9;
  border-radius: 6px 6px 0px 0px;
  margin-right: 10px;
  border: 1px solid #e8e8ea;
  font-size: 14px;
  color: #999;
  text-align: center;
  cursor: pointer;
  &:hover {
    // background-color: #fff;
    color: #999;
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
  background-color: #4192d3 !important;
  color: #fff !important;
}
.el-tabs__active-bar {
  display: none;
}
</style>

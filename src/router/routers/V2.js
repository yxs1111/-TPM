/*
 * @Description:
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-11-28 13:43:09
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function () {
  const V2 = [
    {
      path: '/costManagement/V2',
      component: () => import('@/views/master/modelIndex.vue'),
      code: 'price_nka_v2',
      name: 'V2',
      alwaysShow: true,
      meta: { title: 'V2 - Accrual 预提调整', icon: 'V2' },
      children: [
        {
          path: '/costManagement/V2/V2Apply',
          code: 'price_nka_v2_apply',
          name: 'V2Apply',
          component: () => import('@/views/V2/V2ApplyNew.vue'),
          meta: { title: '申请', icon: 'apply' },
          redirect: '/costManagement/V2/V2Apply/V2discountAll',
          children: [
            //页面权限配置，需要再菜单管理新添新的PP、NU 页，而不是只有一个申请页（新增页面的时候是否得添加一个该页面的getList,login 的时候才返回数据）
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountAll',
              code: 'price_nka_v2_apply',
              name: 'V2discountAll',
              component: () => import('@/views/V2/V2Apply/V2discountAll.vue'),
              meta: {
                title: '折扣项-汇总',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountDiscount',
              code: 'price_nka_v2_apply',
              name: 'V2discountDiscount',
              component: () =>
                import('@/views/V2/V2Apply/V2discountDiscount.vue'),
              meta: {
                title: '折扣项-价促',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountNU',
              code: 'price_nka_v2_apply',
              name: 'V2discountNU',
              component: () => import('@/views/V2/V2Apply/V2discountNU.vue'),
              meta: {
                title: '折扣项-新客',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2HIHRebate',
              code: 'price_nka_v2_apply',
              name: 'V2HIHRebate',
              component: () => import('@/views/V2/V2Apply/V2HIHRebate.vue'),
              meta: {
                title: '折扣项-HIH Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2KARebate',
              code: 'price_nka_v2_apply',
              name: 'V2KARebate',
              component: () => import('@/views/V2/V2Apply/V2KARebate.vue'),
              meta: {
                title: '折扣项-KA Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2FMC',
              code: 'price_nka_v2_apply',
              name: 'V2FMC',
              component: () => import('@/views/V2/V2Apply/V2FMC.vue'),
              meta: {
                title: 'FMC',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2RoadShow',
              code: 'price_nka_v2_apply',
              name: 'V2RoadShow',
              component: () => import('@/views/V2/V2Apply/V2RoadShow.vue'),
              meta: {
                title: 'Roadshow',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2ListingFee',
              code: 'price_nka_v2_apply',
              name: 'V2ListingFee',
              component: () => import('@/views/V2/V2Apply/V2ListingFee.vue'),
              meta: {
                title: 'Listing Fee',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2POSM',
              code: 'price_nka_v2_apply',
              name: 'V2POSM',
              component: () => import('@/views/V2/V2Apply/V2POSM.vue'),
              meta: {
                title: 'POSM-标准',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2POSMCustomize',
              code: 'price_nka_v2_apply',
              name: 'V2POSMCustomize',
              component: () => import('@/views/V2/V2Apply/V2POSMCustomize.vue'),
              meta: {
                title: 'POSM-定制',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2ECM',
              code: 'price_nka_v2_apply',
              name: 'ECM',
              component: () => import('@/views/V2/V2Apply/V2ECM.vue'),
              meta: {
                title: 'ECM',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Collection',
              code: 'price_nka_v2_apply',
              name: 'V2Collection',
              component: () => import('@/views/V2/V2Apply/V2Collection.vue'),
              meta: {
                title: '补录',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Display',
              code: 'price_nka_v2_apply',
              name: 'V2Display',
              component: () => import('@/views/V2/V2Apply/V2ApplyDisplay.vue'),
              meta: {
                title: 'Display',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2MMC',
              code: 'price_nka_v2_apply',
              name: 'V2MMC',
              component: () => import('@/views/V2/V2Apply/V2MMC.vue'),
              meta: {
                title: 'MMC',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Premium',
              code: 'price_nka_v2_apply',
              name: 'V2Premium',
              component: () => import('@/views/V2/V2Apply/V2Premium.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2FreeGoodsTin',
              code: 'price_nka_v2_apply',
              name: 'V2FreeGoodsTin',
              component: () => import('@/views/V2/V2Apply/V2FreeGoodsTin.vue'),
              meta: {
                title: 'Free Goods-Tin',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2FreeGoodsWin2',
              code: 'price_nka_v2_apply',
              name: 'V2FreeGoodsWin2',
              component: () => import('@/views/V2/V2Apply/V2FreeGoodsWin2.vue'),
              meta: {
                title: 'Free Goods-Win2',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2DM',
              code: 'price_nka_v2_apply',
              name: 'V2DM',
              component: () => import('@/views/V2/V2Apply/V2DM.vue'),
              meta: {
                title: 'DM',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Transport',
              code: 'price_nka_v2_apply',
              name: 'V2Transport',
              component: () => import('@/views/V2/V2Apply/V2Transport.vue'),
              meta: {
                title: 'Transport',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Allrkartm',
              code: 'price_nka_v2_apply',
              name: 'V2Allrkartm',
              component: () => import('@/views/V2/V2Apply/V2Allrkartm.vue'),
              meta: {
                title: 'Allrkartm',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2Others',
              code: 'price_nka_v2_apply',
              name: 'V2Others',
              component: () => import('@/views/V2/V2Apply/V2Others.vue'),
              meta: {
                title: 'Others',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2OthersFG',
              code: 'price_nka_v2_apply',
              name: 'V2OthersFG',
              component: () => import('@/views/V2/V2Apply/V2OthersFG.vue'),
              meta: {
                title: 'OthersFG',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Apply',
              },
            },
          ],
        },
        {
          path: '/costManagement/V2/V2Approval',
          code: 'price_nka_v2_approve',
          name: 'V2Approval',
          component: () => import('@/views/V2/V2ApprovalNew.vue'),
          meta: { title: '审批', icon: 'approve' },
          redirect: '/costManagement/V2/V2Approval/V2AllApproval',
          children: [
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2AllApproval',
              code: 'price_nka_v2_approve',
              name: 'V2AllApproval',
              component: () => import('@/views/V2/V2Approval/V2AllApproval'),
              meta: {
                title: '折扣项-汇总',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2DiscountApproval',
              code: 'price_nka_v2_approve',
              name: 'V2DiscountApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2DiscountApproval.vue'),
              meta: {
                title: '折扣项-价促',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2NUApproval',
              code: 'price_nka_v2_approve',
              name: 'V2NUApproval',
              component: () => import('@/views/V2/V2Approval/V2NUApproval.vue'),
              meta: {
                title: '折扣项-新客',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2HIHRebateApproval',
              code: 'price_nka_v2_approve',
              name: 'V2HIHRebateApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2HIHRebateApproval.vue'),
              meta: {
                title: '折扣项-HIH Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2KARebate',
              code: 'price_nka_v2_approve',
              name: 'V2KARebateApprove',
              component: () => import('@/views/V2/V2Apply/V2KARebate.vue'),
              meta: {
                title: '折扣项-KA Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2FMCApproval',
              code: 'price_nka_v2_approve',
              name: 'V2FMCApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2FMCApproval.vue'),
              meta: {
                title: 'FMC',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2RoadShowApproval',
              code: 'price_nka_v2_approve',
              name: 'V2RoadShowApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2RoadShowApproval.vue'),
              meta: {
                title: 'Roadshow',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2ListingFeeApproval',
              code: 'price_nka_v2_approve',
              name: 'V2ListingFeeApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2ListingFeeApproval.vue'),
              meta: {
                title: 'Listing Fee',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2POSMApproval',
              code: 'price_nka_v2_approve',
              name: 'V2POSMAApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2POSMApproval.vue'),
              meta: {
                title: 'POSM-标准',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2POSMCustomizeApproval',
              code: 'price_nka_v2_approve',
              name: 'V2POSMCustomizeApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2POSMCustomizeApproval.vue'),
              meta: {
                title: 'POSM—定制',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2ECMApproval',
              code: 'price_nka_v2_approve',
              name: 'V2ECMAApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2ECMApproval.vue'),
              meta: {
                title: 'ECM',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2ApplyrovalDisplay',
              code: 'price_nka_v2_approve',
              name: 'V2ApplyrovalDisplay',
              component: () =>
                import('@/views/V2/V2Approval/V2ApplyrovalDisplay.vue'),
              meta: {
                title: 'Display',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2ApplyrovalMMC',
              code: 'price_nka_v2_approve',
              name: 'V2ApplyrovalMMC',
              component: () =>
                import('@/views/V2/V2Approval/V2ApplyrovalMMC.vue'),
              meta: {
                title: 'MMC',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2PremiumApproval',
              code: 'price_nka_v2_approve',
              name: 'V2PremiumApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2PremiumApproval.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2FreeGoodsTinApproval',
              code: 'price_nka_v2_approve',
              name: 'V2FreeGoodsTinApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2FreeGoodsTinApproval.vue'),
              meta: {
                title: 'Free Goods-Tin',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2FreeGoodsWin2Approval',
              code: 'price_nka_v2_approve',
              name: 'V2FreeGoodsWin2Approval',
              component: () =>
                import('@/views/V2/V2Approval/V2FreeGoodsWin2Approval.vue'),
              meta: {
                title: 'Free Goods-Win2',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2DMApproval',
              code: 'price_nka_v2_approve',
              name: 'V2DMApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2DMApproval.vue'),
              meta: {
                title: 'DM',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2TransportApproval',
              code: 'price_nka_v2_approve',
              name: 'V2TransportApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2TransportApproval.vue'),
              meta: {
                title: 'Transport',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2AllrkartmApproval',
              code: 'price_nka_v2_approve',
              name: 'V2AllrkartmApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2AllrkartmApproval.vue'),
              meta: {
                title: 'Allrkartm',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2OthersApproval',
              code: 'price_nka_v2_approve',
              name: 'V2OthersApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2OthersApproval.vue'),
              meta: {
                title: 'Others',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2OthersFGApproval',
              code: 'price_nka_v2_approve',
              name: 'V2OthersFGApproval',
              component: () =>
                import('@/views/V2/V2Approval/V2OthersFGApproval.vue'),
              meta: {
                title: 'OthersFG',
                icon: 'form',
                activeMenu: '/costManagement/V2/V2Approval',
              },
            },
          ],
        },
      ],
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V2
  }
}

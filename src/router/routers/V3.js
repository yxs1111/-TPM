/*
 * @Description:
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-11-18 17:21:43
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function () {
  const V3 = [
    {
      path: '/costManagement/V3',
      component: () => import('@/views/master/modelIndex.vue'),
      code: 'price_nka_v3',
      name: 'V3',
      alwaysShow: true,
      meta: { title: 'V3 - Actual 实际入账', icon: 'V3' },
      children: [
        {
          path: '/costManagement/V3/V3Apply',
          code: 'price_nka_v3_apply',
          name: 'V3Apply',
          component: () => import('@/views/V3/V3ApplyNew.vue'),
          meta: { title: '申请', icon: 'apply' },
          children: [
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountAll',
              code: 'price_nka_v3_apply',
              name: 'V3discountAll',
              component: () => import('@/views/V3/V3Apply/V3discountAll.vue'),
              meta: {
                title: '折扣项-汇总',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountDiscount',
              code: 'price_nka_v3_apply',
              name: 'V3discountDiscount',
              component: () =>
                import('@/views/V3/V3Apply/V3discountDiscount.vue'),
              meta: {
                title: '折扣项-价促',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountNU',
              code: 'price_nka_v3_apply',
              name: 'V3discountNU',
              component: () => import('@/views/V3/V3Apply/V3discountNU.vue'),
              meta: {
                title: '折扣项-新客',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3HIHRebate',
              code: 'price_nka_v3_apply',
              name: 'V3HIHRebate',
              component: () => import('@/views/V3/V3Apply/V3HIHRebate.vue'),
              meta: {
                title: '折扣项-HIH Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3KARebate',
              code: 'price_nka_v3_apply',
              name: 'V3KARebate',
              component: () => import('@/views/V3/V3Apply/V3KARebate.vue'),
              meta: {
                title: '折扣项-KA Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3FMC',
              code: 'price_nka_v3_apply',
              name: 'V3FMC',
              component: () => import('@/views/V3/V3Apply/V3FMC.vue'),
              meta: {
                title: 'FMC',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3RoadShow',
              code: 'price_nka_v3_apply',
              name: 'V3RoadShow',
              component: () => import('@/views/V3/V3Apply/V3RoadShow.vue'),
              meta: {
                title: 'Roadshow',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3ListingFee',
              code: 'price_nka_v3_apply',
              name: 'V3ListingFee',
              component: () => import('@/views/V3/V3Apply/V3ListingFee.vue'),
              meta: {
                title: 'Listing Fee',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3POSM',
              code: 'price_nka_v3_apply',
              name: 'V3POSM',
              component: () => import('@/views/V3/V3Apply/V3POSM.vue'),
              meta: {
                title: 'POSM-标准',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3POSMCustomize',
              code: 'price_nka_v3_apply',
              name: 'V3POSMCustomize',
              component: () => import('@/views/V3/V3Apply/V3POSMCustomize.vue'),
              meta: {
                title: 'POSM-定制',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3ECM',
              code: 'price_nka_v3_apply',
              name: 'ECM',
              component: () => import('@/views/V3/V3Apply/V3ECM.vue'),
              meta: {
                title: 'ECM',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3Collection',
              code: 'price_nka_v3_apply',
              name: 'V3Collection',
              component: () => import('@/views/V3/V3Apply/V3Collection.vue'),
              meta: {
                title: '补录',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3Display',
              code: 'price_nka_v3_apply',
              name: 'V3Display',
              component: () => import('@/views/V3/V3Apply/V3ApplyDisplay.vue'),
              meta: {
                title: 'Display',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3Premium',
              code: 'price_nka_v3_apply',
              name: 'V3Premium',
              component: () => import('@/views/V3/V3Apply/V3Premium.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3FreeGoodsTin',
              code: 'price_nka_v3_apply',
              name: 'V3FreeGoodsTin',
              component: () => import('@/views/V3/V3Apply/V3FreeGoodsTin.vue'),
              meta: {
                title: 'Free Goods-Tin',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3FreeGoodsWin2',
              code: 'price_nka_v3_apply',
              name: 'V3FreeGoodsWin2',
              component: () => import('@/views/V3/V3Apply/V3FreeGoodsWin2.vue'),
              meta: {
                title: 'Free Goods-Win2',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3DM',
              code: 'price_nka_v3_apply',
              name: 'V3DM',
              component: () => import('@/views/V3/V3Apply/V3DM.vue'),
              meta: {
                title: 'Free Goods-Win2',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3Transport',
              code: 'price_nka_v3_apply',
              name: 'V3Transport',
              component: () => import('@/views/V3/V3Apply/V3Transport.vue'),
              meta: {
                title: 'Transport',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Apply',
              },
            },
          ],
        },
        {
          path: '/costManagement/V3/V3Approval',
          code: 'price_nka_v3_approve',
          name: 'V3Approval',
          component: () => import('@/views/V3/V3Approval.vue'),
          meta: { title: '审批', icon: 'approve' },
          children: [
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountAllApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountAllApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3discountAllApproval.vue'),
              meta: {
                title: '折扣项-汇总',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountDiscountApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountDiscountApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3discountDiscountApproval.vue'),
              meta: {
                title: '折扣项-价促',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountNUApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountNUApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3discountNUApproval.vue'),
              meta: {
                title: '折扣项-新客',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3HIHRebateApproval',
              code: 'price_nka_v3_approve',
              name: 'V3HIHRebateApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3HIHRebateApproval.vue'),
              meta: {
                title: '折扣项-HIH Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3KARebateApproval',
              code: 'price_nka_v3_approve',
              name: 'V3KARebateApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3KARebateApproval.vue'),
              meta: {
                title: '折扣项-KA Rebate',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3FMCApproval',
              code: 'price_nka_v3_approve',
              name: 'V3FMCApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3FMCApproval.vue'),
              meta: {
                title: 'FMC',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3RoadShowApproval',
              code: 'price_nka_v3_approve',
              name: 'V3RoadShowApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3RoadShowApproval.vue'),
              meta: {
                title: 'Roadshow',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3ListingFeeApproval',
              code: 'price_nka_v3_approve',
              name: 'V3ListingFeeApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3ListingFeeApproval.vue'),
              meta: {
                title: 'Listing Fee',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3POSMApproval',
              code: 'price_nka_v3_approve',
              name: 'V3POSMApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3POSMApproval.vue'),
              meta: {
                title: 'POSM-标准',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3POSMCustomizeApproval',
              code: 'price_nka_v3_approve',
              name: 'V3POSMCustomizeApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3POSMCustomizeApproval.vue'),
              meta: {
                title: 'POSM-定制',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3ECMApproval',
              code: 'price_nka_v3_approve',
              name: 'V3ECMApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3ECMApproval.vue'),
              meta: {
                title: 'ECM',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3ApplyrovalDisplay',
              code: 'price_nka_v3_approve',
              name: 'V3ApplyrovalDisplay',
              component: () =>
                import('@/views/V3/V3Approval/V3ApplyrovalDisplay.vue'),
              meta: {
                title: 'Display',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3PremiumApproval',
              code: 'price_nka_v3_approve',
              name: 'V3PremiumApproval',
              component: () =>
                import('@/views/V3/V3Approval/V3PremiumApproval.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3FreeGoodsTinApproval',
              code: 'price_nka_v3_approve',
              name: 'V3FreeGoodsTinApproval',
              component: () => import('@/views/V3/V3Apply/V3FreeGoodsTin.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3FreeGoodsWin2Approval',
              code: 'price_nka_v3_approve',
              name: 'V3FreeGoodsWin2Approval',
              component: () => import('@/views/V3/V3Apply/V3FreeGoodsWin2.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3DMApproval',
              code: 'price_nka_v3_approve',
              name: 'V3DMApproval',
              component: () => import('@/views/V3/V3Approval/V3DMApproval.vue'),
              meta: {
                title: 'Premium',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
              },
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3TransportApproval',
              code: 'price_nka_v3_approve',
              name: 'V3TransportApproval',
              component: () => import('@/views/V3/V3Approval/V3TransportApproval.vue'),
              meta: {
                title: 'Transport',
                icon: 'form',
                activeMenu: '/costManagement/V3/V3Approval',
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
    return V3
  }
}

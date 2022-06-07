/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-06-07 13:44:59
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
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
          component: () => import('@/views/V3/V3Apply.vue'),
          meta: { title: '申请', icon: 'apply' },
          children: [
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountAll',
              code: 'price_nka_v3_apply',
              name: 'V3discountAll',
              component: () => import('@/views/V3/V3Apply/V3discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountDiscount',
              code: 'price_nka_v3_apply',
              name: 'V3discountDiscount',
              component: () => import('@/views/V3/V3Apply/V3discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3discountNU',
              code: 'price_nka_v3_apply',
              name: 'V3discountNU',
              component: () => import('@/views/V3/V3Apply/V3discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3HIHRebate',
              code: 'price_nka_v3_apply',
              name: 'V3HIHRebate',
              component: () => import('@/views/V3/V3Apply/V3HIHRebate.vue'),
              meta: { title: '折扣项-HIH Rebate', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3KARebate',
              code: 'price_nka_v3_apply',
              name: 'V3KARebate',
              component: () => import('@/views/V3/V3Apply/V3KARebate.vue'),
              meta: { title: '折扣项-KA Rebate', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3FMC',
              code: 'price_nka_v3_apply',
              name: 'V3FMC',
              component: () => import('@/views/V3/V3Apply/V3FMC.vue'),
              meta: { title: 'FMC', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Apply/V3RoadShow',
              code: 'price_nka_v3_apply',
              name: 'V3RoadShow',
              component: () => import('@/views/V3/V3Apply/V3RoadShow.vue'),
              meta: { title: 'Road Show', icon: 'form' ,activeMenu: '/costManagement/V3/V3Apply'},
            },
          ]
        },
        {
          path: '/costManagement/V3/V3Approval',
          code: 'price_nka_v3_approve',
          name: 'V3Approval',
          component: () => import('@/views/V3/V3ApprovalModel.vue'),
          meta: { title: '审批', icon: 'approve' },
          children: [
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountAllApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountAllApproval',
              component: () => import('@/views/V3/V3Approval/V3discountAllApproval.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountDiscountApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountDiscountApproval',
              component: () => import('@/views/V3/V3Approval/V3discountDiscountApproval.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3discountNUApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountNUApproval',
              component: () => import('@/views/V3/V3Approval/V3discountNUApproval.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3HIHRebateApproval',
              code: 'price_nka_v3_approve',
              name: 'V3HIHRebateApproval',
              component: () => import('@/views/V3/V3Approval/V3HIHRebateApproval.vue'),
              meta: { title: '折扣项-HIH Rebate', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3KARebateApproval',
              code: 'price_nka_v3_approve',
              name: 'V3KARebateApproval',
              component: () => import('@/views/V3/V3Approval/V3KARebateApproval.vue'),
              meta: { title: '折扣项-KA Rebate', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3FMCApproval',
              code: 'price_nka_v3_approve',
              name: 'V3FMCApproval',
              component: () => import('@/views/V3/V3Approval/V3FMCApproval.vue'),
              meta: { title: 'FMC', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V3/V3Approval/V3RoadShowApproval',
              code: 'price_nka_v3_approve',
              name: 'V3RoadShowApproval',
              component: () => import('@/views/V3/V3Approval/V3FMCApproval.vue'),
              meta: { title: 'Road Show', icon: 'form' ,activeMenu: '/costManagement/V3/V3Approval'},
            },
          ]
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V3
  }
}

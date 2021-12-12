/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-12-12 11:53:14
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const V3 = [
    {
      path: '/V3',
      component: Layout,
      code: 'price_nka_v3',
      name: 'V3',
      alwaysShow: true,
      meta: { title: 'V3 - Actual 实际入账', icon: 'V3' },
      children: [
        {
          path: '/V3/V3Apply',
          code: 'price_nka_v3_apply',
          name: 'V3Apply',
          component: () => import('@/views/V3/V3Apply.vue'),
          meta: { title: '申请', icon: 'apply' },
          redirect: '/V3/V3Apply/V3discountAll',
          children: [
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountAll',
              code: 'price_nka_v3_apply',
              name: 'V3discountAll',
              component: () => import('@/views/V3/V3Apply/V3discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountDiscount',
              code: 'price_nka_v3_apply',
              name: 'V3discountDiscount',
              component: () => import('@/views/V3/V3Apply/V3discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountNU',
              code: 'price_nka_v3_apply',
              name: 'V3discountNU',
              component: () => import('@/views/V3/V3Apply/V3discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
          ]
        },
        {
          path: '/V3/V3Approval',
          code: 'price_nka_v3_approve',
          name: 'V3Approval',
          component: () => import('@/views/V3/V3ApprovalModel.vue'),
          meta: { title: '审批', icon: 'approve' },
          redirect: '/V3/V3Approval/V3discountAllApproval',
          children: [
            {
              hidden: true,
              path: '/V3/V3Approval/V3discountAllApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountAllApproval',
              component: () => import('@/views/V3/V3Approval/V3discountAllApproval.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/V3/V3Approval/V3discountDiscountApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountDiscountApproval',
              component: () => import('@/views/V3/V3Approval/V3discountDiscountApproval.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/V3/V3Approval'},
            },
            {
              hidden: true,
              path: '/V3/V3Approval/V3discountNUApproval',
              code: 'price_nka_v3_approve',
              name: 'V3discountNUApproval',
              component: () => import('@/views/V3/V3Approval/V3discountNUApproval.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/V3/V3Approval'},
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

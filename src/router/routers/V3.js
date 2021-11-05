/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-11-05 09:53:57
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const V3 = [
    {
      path: '/V3',
      component: Layout,
      code: 'V3',
      name: 'V3',
      meta: { title: 'V3 - Actual 实际入账', icon: 'form' },
      children: [
        {
          path: '/V3/V3Apply',
          code: 'V3Apply',
          name: 'V3Apply',
          component: () => import('@/views/V3/V3Apply.vue'),
          meta: { title: '申请', icon: 'form' },
          redirect: '/V3/V3Apply/V3discountAll',
          children: [
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountAll',
              code: 'V3discountAll',
              name: 'V3discountAll',
              component: () => import('@/views/V3/V3Apply/V3discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountDiscount',
              code: 'V3discountDiscount',
              name: 'V3discountDiscount',
              component: () => import('@/views/V3/V3Apply/V3discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
            {
              hidden: true,
              path: '/V3/V3Apply/V3discountNU',
              code: 'V3discountNU',
              name: 'V3discountNU',
              component: () => import('@/views/V3/V3Apply/V3discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/V3/V3Apply'},
            },
          ]
        },
        {
          path: '/V3/V3Approval',
          code: 'V3Approval',
          name: 'V3Approval',
          component: () => import('@/views/V3/V3Approval.vue'),
          meta: { title: '审批', icon: 'form' },
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

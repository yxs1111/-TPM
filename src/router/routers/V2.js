/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-11-05 09:14:38
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const V2 = [
    {
      path: '/V2',
      component: Layout,
      code: 'V2',
      name: 'V2',
      meta: { title: 'V2 - Accrual 预提调整', icon: 'form' },
      children: [
        {
          path: '/V2/V2Apply',
          code: 'V2Apply',
          name: 'V2Apply',
          component: () => import('@/views/V2/V2Apply.vue'),
          meta: { title: '申请', icon: 'form' },
          redirect: '/V2/V2Apply/V2discountAll',
          children: [
            {
              hidden: true,
              path: '/V2/V2Apply/V2discountAll',
              code: 'V2discountAll',
              name: 'V2discountAll',
              component: () => import('@/views/V2/V2Apply/V2discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/V2/V2Apply/V2discountDiscount',
              code: 'V2discountDiscount',
              name: 'V2discountDiscount',
              component: () => import('@/views/V2/V2Apply/V2discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/V2/V2Apply/V2discountNU',
              code: 'V2discountNU',
              name: 'V2discountNU',
              component: () => import('@/views/V2/V2Apply/V2discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/V2/V2Apply'},
            },
          ]
        },
        {
          path: '/V2/V2Approval',
          code: 'V2Approval',
          name: 'V2Approval',
          component: () => import('@/views/V2/V2Approval.vue'),
          meta: { title: '审批', icon: 'form' },
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V2
  }
}

/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-11-04 13:59:04
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const V1 = [
    {
      path: '/V1',
      component: Layout,
      code: 'V1',
      name: 'V1',
      meta: { title: 'V1 - City plan 详细拆分', icon: 'form' },
      children: [
        {
          path: '/V1/V1Apply',
          code: 'V1Apply',
          name: 'V1Apply',
          component: () => import('@/views/V1/V1Apply.vue'),
          meta: { title: '申请', icon: 'form' },
          redirect: '/V1/V1Apply/V1discountAll',
          children: [
            {
              hidden: true,
              path: '/V1/V1Apply/V1discountAll',
              code: 'V1discountAll',
              name: 'V1discountAll',
              component: () => import('@/views/V1/V1Apply/V1discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/V1/V1Apply'},
            },
            {
              hidden: true,
              path: '/V1/V1Apply/V1discountDiscount',
              code: 'V1discountDiscount',
              name: 'V1discountDiscount',
              component: () => import('@/views/V1/V1Apply/V1discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/V1/V1Apply'},
            },
            {
              hidden: true,
              path: '/V1/V1Apply/V1discountNU',
              code: 'V1discountNU',
              name: 'V1discountNU',
              component: () => import('@/views/V1/V1Apply/V1discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/V1/V1Apply'},
            },
          ]
        },
        {
          path: '/V1/V1Approval',
          code: 'V1Approval',
          name: 'V1Approval',
          component: () => import('@/views/V1/V1Approval.vue'),
          meta: { title: '审批', icon: 'form' },
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V1
  }
}

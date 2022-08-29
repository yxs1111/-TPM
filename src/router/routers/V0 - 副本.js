/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
<<<<<<< HEAD
 * @LastEditTime: 2022-07-19 10:52:06
=======
 * @LastEditTime: 2022-08-15 09:39:44
>>>>>>> 8b50447d1fb1610a176e646b44574a0e88be6d51
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function () {
  const cityPlan = [
    {
      path: '/costManagement/V0',
      code: 'price_nka_v0',
      name: 'V0',
      alwaysShow: true,
      component: () => import('@/views/V0/V0.vue'),
      meta: { title: 'V0 - Pre city plan 预拆分', icon: 'V0' },
      children: [
        {
          path: '/costManagement/V0/V0ApplyList',
          code: 'price_nka_v0_apply',
          name: 'V0ApplyList',
          component: () => import('@/views/V0/V0ApplyList.vue'),
          meta: { title: '申请', icon: 'apply' },
        },

        {
          path: '/costManagement/V0/V0ApplyList',
          code: 'price_nka_v0_apply',
          name: 'V0ApplyList',
          component: () => import('@/views/V0/V0ApplyList.vue'),
          meta: { title: '申请new', icon: 'apply' },
        },

        {
          path: '/costManagement/V0/V0ApprovalList',
          code: 'price_nka_v0_approve',
          name: 'V0ApprovalList',
          component: () => import('@/views/V0/V0ApprovalList.vue'),
          meta: { title: '审批', icon: 'approve' },
        },
      ],
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return cityPlan
  }
}

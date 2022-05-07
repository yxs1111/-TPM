/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-05-07 14:50:41
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
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
          path: '/costManagement/V0/V0Apply',
          code: 'price_nka_v0_apply',
          name: 'V0Apply',
          component: () => import('@/views/V0/V0Apply.vue'),
          meta: { title: '申请', icon: 'apply' },
        },
        {
          path: '/costManagement/V0/V0Approval',
          code: 'price_nka_v0_approve',
          name: 'V0Approval',
          component: () => import('@/views/V0/V0Approval.vue'),
          meta: { title: '审批', icon: 'approve' },
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return cityPlan
  }
}

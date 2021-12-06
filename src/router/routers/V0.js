/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-12-06 11:41:51
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const cityPlan = [
    {
      path: '/V0',
      component: Layout,
      code: 'V0',
      name: 'V0',
      meta: { title: 'V0 - Pre city plan 预拆分', icon: 'V0' },
      children: [
        {
          path: '/V0/V0Apply',
          code: 'V0Apply',
          name: 'V0Apply',
          component: () => import('@/views/V0/V0Apply.vue'),
          meta: { title: '申请', icon: 'apply' },
        },
        {
          path: '/V0/V0Approval',
          code: 'V0Approval',
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

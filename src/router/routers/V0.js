/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-11-17 17:34:05
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const V0 = [
    {
      path: '/V0',
      component: Layout,
      code: 'V0',
      name: 'V0',
      redirect: '/V0/V0Apply',
      meta: { title: 'V0 - Pre city plan 预拆分', icon: 'form' },
      children: [
        {
          path: '/V0/V0Apply',
          code: 'V0Apply',
          name: 'V0Apply',
          component: () => import('@/views/V0/V0Apply.vue'),
          meta: { title: 'V0 - Pre city plan 预拆分', icon: 'form' },
        },
        {
          path: '/V0/V0Approval',
          code: 'V0Approval',
          name: 'V0Approval',
          component: () => import('@/views/V0/V0Approval.vue'),
          meta: { title: '审批', icon: 'form' },
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V0
  }
}

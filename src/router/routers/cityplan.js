import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const cityPlan = [
    {
      path: '/cityPlan',
      component: Layout,
      redirect: '/cityPlan/V0',
      code: 'cityPlan',
      name: 'cityPlan',
      meta: { title: 'cityPlan', icon: 'form' },
      children: [
        {
          path: '/V0',
          code: 'V0',
          name: 'V0',
          component: () => import('@/views/activiti/model'),
          meta: { title: 'V0', icon: 'form' }
        },
        {
          path: '/process',
          code: 'process',
          name: 'Process',
          component: () => import('@/views/activiti/process'),
          meta: { title: '流程管理', icon: 'user' }
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

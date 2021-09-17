import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const cityPlan = [
    {
      path: '/CityPlan',
      component: Layout,
      code: 'CityPlan',
      name: 'CityPlan',
      meta: { title: 'CityPlan', icon: 'form' },
      children: [
        {
          path: '/CityPlan/CityPlanApply',
          code: 'CityPlanApply',
          name: 'CityPlanApply',
          component: () => import('@/views/CityPlan/CityPlanApply/index.vue'),
          redirect: '/CityPlan/CityPlanApply/V0',
          meta: { title: 'CityPlan申请', icon: 'form' },
          children: [
            {
              hidden: true,
              path: '/CityPlan/CityPlanApply/V0',
              code: 'V0',
              name: 'V0',
              component: () => import('@/views/CityPlan/CityPlanApply/V0/index.vue'),
              meta: { title: 'V0', icon: 'form' ,activeMenu: '/CityPlan/CityPlanApply'},
              
            },
            {
              hidden: true,
              path: '/CityPlan/CityPlanApply/V1',
              code: 'V1',
              name: 'V1',
              component: () => import('@/views/CityPlan/CityPlanApply/V1/index.vue'),
              meta: { title: 'V1', icon: 'form', activeMenu: '/CityPlan/CityPlanApply' },
             
            },
          ]
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

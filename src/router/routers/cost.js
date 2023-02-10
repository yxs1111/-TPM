/*
 * @Description:
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-05-07 16:55:53
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'
import V0 from '@/router/routers/V0'
import V1 from '@/router/routers/V1'
import V2 from '@/router/routers/V2'
import V3 from '@/router/routers/V3'
export default function() {
  const costManagement = [
    {
      path:'/costManagement',
      component: Layout,
      code: 'price_nka_v0',
      name: 'costManagement',
      alwaysShow: true,
      meta: { title: '费用管理', icon: 'costManagement' },
      children: [
        ...V0(),
        ...V1(),
        ...V2(),
        ...V3()
      ]
    },

  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return costManagement
  }
}

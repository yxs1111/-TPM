/*
 * @Description: 
 * @Date: 2021-12-06 08:33:29
 * @LastEditTime: 2021-12-24 17:04:03
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const activiti = [
    {
      path: '/flow',
      component: Layout,
      code: 'flow',
      name: 'Flow',
      meta: { title: '审批流管理', icon: 'approveStream' },
      children: [
        {
          path: '/model',
          code: 'model',
          name: 'model',
          component: () => import('@/views/activiti/model'),
          meta: { title: '模型管理', icon: 'apply' }
        },
        {
          path: '/process',
          code: 'process',
          name: 'Process',
          component: () => import('@/views/activiti/process'),
          meta: { title: '流程管理', icon: 'approve' }
        },
      ]
    },
    // {
    //   path: '/taskDetail',
    //   code: 'taskDetail',
    //   meta: { title: '任务详情', icon: 'user' },
    //   component: () => import('@/views/activiti/tasks/TaskDetail'),
    //   hidden: true
    // },
    {
      path: '/modeler',
      code: 'modeler',
      name: 'modeler',
      component: () => import('@/views/activiti/modeler'),
      meta: { title: '模型设计', icon: 'form' },
      hidden: true
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return activiti
  }
}

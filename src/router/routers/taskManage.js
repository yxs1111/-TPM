/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-11-16 14:05:27
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const taskManage = [
    {
      path: '/taskManage',
      component: Layout,
      code: 'taskManage',
      name: 'taskManage',
      meta: { title: '任务管理', icon: 'missionMana' },
      children: [
        {
          path: '/taskManage/TrackingFlow',
          code: 'TrackingFlow',
          name: 'TrackingFlow',
          component: () => import('@/views/taskManage/TrackingFlow.vue'),
          meta: { title: '流程跟踪', icon: 'approve' },
        },
        {
          path: '/taskManage/MyTodo',
          code: 'MyTodo',
          name: 'MyTodo',
          component: () => import('@/views/taskManage/MyTodo.vue'),
          meta: { title: '我的待办', icon: 'apply' },
        },
        {
          path: '/taskManage/TaskList',
          code: 'TaskList',
          name: 'TaskList',
          component: () => import('@/views/taskManage/TaskList.vue'),
          meta: { title: '任务列表', icon: 'approve' },
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return taskManage
  }
}

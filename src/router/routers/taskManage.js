/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2021-12-06 15:42:29
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
          redirect: '/taskManage/MyTodo/MyTodoAll',
          children: [
            {
              hidden: true,
              path: '/taskManage/MyTodo/MyTodoAll',
              code: 'MyTodoAll',
              name: 'MyTodoAll',
              component: () => import('@/views/taskManage/MyTodo/MyTodoAll.vue'),
              meta: { title: '汇总', icon: 'form' ,activeMenu: '/taskManage/MyTodo'},
            },
            {
              hidden: true,
              path: '/taskManage/MyTodo/MyTodoDiscount',
              code: 'MyTodoDiscount',
              name: 'MyTodoDiscount',
              component: () => import('@/views/taskManage/MyTodo/MyTodoDiscount.vue'),
              meta: { title: '折扣项', icon: 'form' ,activeMenu: '/taskManage/MyTodo'},
            },
          ]
        },
        {
          path: '/taskDetail',
          code: 'taskDetail',
          meta: { title: '任务详情', icon: 'user' },
          component: () => import('@/views/activiti/tasks/TaskDetail'),
          hidden: true
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

import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const activiti = [
    {
      path: '/flow',
      component: Layout,
      redirect: '/flow/model',
      code: 'flow',
      name: 'Flow',
      meta: { title: '流程引擎', icon: 'form' },
      children: [
        {
          path: '/model',
          code: 'model',
          name: 'model',
          component: () => import('@/views/activiti/model'),
          meta: { title: '模型管理', icon: 'form' }
        },
        {
          path: '/process',
          code: 'process',
          name: 'Process',
          component: () => import('@/views/activiti/process'),
          meta: { title: '流程管理', icon: 'user' }
        },
        {
          path: '/task',
          code: 'task',
          name: 'task',
          component: () => import('@/views/activiti/tasks'),
          meta: { title: '待办事项', icon: 'user' }
        },
        {
          path: '/form',
          code: 'form',
          name: 'Form',
          component: () => import('@/views/activiti/form'),
          meta: { title: '表单管理', icon: 'user' }
        },
        {
          path: '/businessTable',
          code: 'businessTable',
          name: 'BusinessTable',
          component: () => import('@/views/activiti/table'),
          meta: { title: '业务表管理', icon: 'user' }
        },
        {
          path: '/detainCar',
          code: 'detainCar',
          name: 'detainCar',
          component: () => import('@/views/business/DetainCar'),
          meta: { title: '扣车管理', icon: 'form' }
        }
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
      path: '/modeler',
      code: 'modeler',
      name: 'modeler',
      component: () => import('@/views/activiti/modeler'),
      meta: { title: '模型设计', icon: 'form' },
      hidden: true
    },
    {
      path: '/formDesign',
      code: 'formDesign',
      name: 'formDesign',
      component: () => import('@/components/FormDesigner'),
      meta: { title: '表单设计器', icon: 'form' },
      hidden: true
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return activiti
  }
}

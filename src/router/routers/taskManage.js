/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-03-31 10:48:10
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const taskManage = [
    {
      path: '/taskManage',
      component: Layout,
      code: 'resource-task',
      alwaysShow: true,
      name: 'taskManage',
      meta: { title: '任务管理', icon: 'missionMana' },
      children: [
        {
          path: '/taskManage/TrackingFlow',
          code: 'resource-task_lcgz',
          name: 'TrackingFlow',
          component: () => import('@/views/taskManage/TrackingFlow.vue'),
          meta: { title: '流程跟踪', icon: 'approve' },
        },
        {
          path: '/taskManage/MyTodo',
          code: 'resource-task_wddb',
          name: 'MyTodo',
          component: () => import('@/views/taskManage/MyTodo.vue'),
          meta: { title: '我的待办', icon: 'apply' },
          redirect: '/taskManage/MyTodo/MyTodoAll',
          children: [
            {
              hidden: true,
              path: '/taskManage/MyTodo/MyTodoAll',
              code: 'resource-task_wddb',
              name: 'MyTodoAll',
              component: () => import('@/views/taskManage/MyTodo/MyTodoAll.vue'),
              meta: { title: '汇总', icon: 'form' ,activeMenu: '/taskManage/MyTodo'},
            },
            {
              hidden: true,
              path: '/taskManage/MyTodo/MyTodoDiscount',
              code: 'resource-task_wddb',
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
          code: 'resource-task_rwlb',
          name: 'TaskList',
          component: () => import('@/views/taskManage/TaskList.vue'),
          meta: { title: '任务列表', icon: 'approve' },
        },
        // 合同录入
        {
          path: '/taskManage/ContractEntry',
          name: 'ContractEntry',
          alwaysShow: true,
          code: 'mdm_product_information',
          meta: { title: '合同录入', icon: 'apply' },
          component: () => import('@/views/taskManage/ContractEntry/ContractEntry.vue'),
          children: [
            {
              path: '/taskManage/ContractEntry/CustomerContractEntry',
              code: 'mdm_product_information',
              name: 'CustomerContractEntry',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry.vue'),
              meta: { title: '客户合同录入', icon: 'apply',activeMenu: '/taskManage/ContractEntry' },
              redirect: '/taskManage/ContractEntry/CustomerContractEntry/StraightGiving',
              children: [
                {
                  hidden: true,
                  path: '/taskManage/ContractEntry/CustomerContractEntry/StraightGiving',
                  code: 'mdm_product_information',
                  name: 'StraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/StraightGiving.vue'),
                  meta: { title: '直供', icon: 'form' ,activeMenu: '/taskManage/ContractEntry/CustomerContractEntry'},
                },
                {
                  hidden: true,
                  path: '/taskManage/ContractEntry/CustomerContractEntry/LikenessStraightGiving',
                  code: 'mdm_product_information',
                  name: 'LikenessStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/LikenessStraightGiving.vue'),
                  meta: { title: '准直供', icon: 'form' ,activeMenu: '/taskManage/ContractEntry/CustomerContractEntry'},
                },
                {
                  hidden: true,
                  path: '/taskManage/ContractEntry/CustomerContractEntry/UnStraightGiving',
                  code: 'mdm_product_information',
                  name: 'UnStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/UnStraightGiving.vue'),
                  meta: { title: '非直供', icon: 'form' ,activeMenu: '/taskManage/ContractEntry/CustomerContractEntry'},
                },
              ]
            },
            {
              path: '/ContractEntry/CustomerContractApproval',
              code: 'mdm_brand',
              name: 'Brand',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractApproval.vue'),
              meta: { title: '客户合同审批', icon: 'apply' }
            },
          ]
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

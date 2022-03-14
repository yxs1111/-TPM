/*
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2022-03-14 10:18:22
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const system = [
    {
      path: '/os',
      component: Layout,
      redirect: '/os/os',
      code: 'authPage',
      alwaysShow: true,
      name: 'OsPage',
      meta: { title: '系统管理', icon: 'sysManage' },
      children: [
        // {
        //   path: 'organization',
        //   code: 'organization',
        //   name: 'OrganizationInfo',
        //   component: () => import('@/views/system/organization/index.vue'),
        //   meta: { title: '组织信息', icon: 'form' }
        // },
        {
          path: 'user',
          code: 'authPage_user',
          name: 'UserInfo',
          component: () => import('@/views/system/user/index.vue'),
          meta: { title: '用户管理', icon: 'user' }
        },
        {
          path: 'role',
          code: 'role',
          name: 'RoleInfo',
          component: () => import('@/views/system/RoleManage.vue'),
          meta: { title: '角色管理', icon: 'user' }
        },
        {
          path: 'permission',
          code: 'permission',
          name: 'Permission',
          component: () => import('@/views/system/permission/index.vue'),
          meta: { title: '权限信息', icon: 'form' }
        },
        {
          path: 'menu',
          code: 'menu',
          name: 'MenuInfo',
          component: () => import('@/views/system/menu/index.vue'),
          meta: { title: '菜单管理', icon: 'tree' }
        },
        {
          path: 'CycleManagement',
          code: 'authPage_cycle',
          name: 'CycleManagement',
          component: () => import('@/views/system/CycleManagement.vue'),
          meta: { title: '周期管理', icon: 'form' }
        },
        {
          path: 'MonitoringManagement',
          code: 'MonitoringManagement',
          name: 'MonitoringManagement',
          component: () => import('@/views/system/MonitoringManagement.vue'),
          meta: { title: '监控管理', icon: 'form' }
        },
        // {
        //   path: 'CycleManagement',
        //   name: 'itemInfo',
        //   alwaysShow: true,
        //   code: 'authPage_cycle',
        //   component: () => import('@/views/system/CycleManagement.vue'),
        //   meta: { title: '周期管理', icon: 'form' },
        //   redirect: 'CycleManagement/saleComputeKeep',
        //   children: [
        //     {
        //       path: 'CycleManagement',
        //       code: 'authPage_cycle',
        //       name: 'CycleManagement',
        //       component: () => import('@/views/system/CycleManagement.vue'),
        //       meta: { title: '周期管理', icon: 'form' }
        //     },
            
        //   ]
        // },
        {
          path: 'InterfaceManage',
          code: 'authPage_interface',
          name: 'InterfaceManage',
          component: () => import('@/views/system/InterfaceManage.vue'),
          meta: { title: '接口管理', icon: 'tree' }
        },
        {
          path: 'MessageManage',
          code: 'authPage_message',
          name: 'MessageManage',
          component: () => import('@/views/system/MessageManage.vue'),
          meta: { title: '通知管理', icon: 'tree' }
        },
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return system
  }
}

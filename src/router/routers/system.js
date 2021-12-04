/*
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-12-03 17:29:55
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
      code: 'osPage',
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
          code: 'user',
          name: 'UserInfo',
          component: () => import('@/views/system/user/index.vue'),
          meta: { title: '用户管理', icon: 'user' }
        },
        {
          path: 'role',
          code: 'role',
          name: 'RoleInfo',
          component: () => import('@/views/system/role/index.vue'),
          meta: { title: '角色管理', icon: 'user' }
        },
        {
          path: 'menu',
          code: 'menu',
          name: 'MenuInfo',
          component: () => import('@/views/system/menu/index.vue'),
          meta: { title: '菜单管理', icon: 'tree' }
        },
        {
          path: 'InterfaceManage',
          code: 'InterfaceManage',
          name: 'InterfaceManage',
          component: () => import('@/views/system/InterfaceManage.vue'),
          meta: { title: '接口管理', icon: 'tree' }
        },
        {
          path: 'MessageManage',
          code: 'MessageManage',
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

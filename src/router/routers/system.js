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
        {
          path: 'os',
          code: 'osInfo',
          name: 'OsInfo',
          component: () => import('@/views/system/os/index.vue'),
          meta: { title: '系统信息', icon: 'form' }
        },
        {
          path: 'organization',
          code: 'organization',
          name: 'OrganizationInfo',
          component: () => import('@/views/system/organization/index.vue'),
          meta: { title: '组织信息', icon: 'form' }
        },
        {
          path: 'client',
          code: 'client',
          name: 'ClientInfo',
          component: () => import('@/views/system/client/index.vue'),
          meta: { title: 'oauth2客户端信息', icon: 'form' }
        },
        {
          path: 'gatewayRoute',
          code: 'gatewayRoute',
          name: 'GatewayRoute',
          component: () => import('@/views/system/gateway/route/index.vue'),
          meta: { title: '路由配置', icon: 'form' }
        },
        {
          path: 'authTenant',
          code: 'authTenant',
          name: 'AuthTenant',
          component: () => import('@/views/system/tenant/index.vue'),
          meta: { title: '租户管理', icon: 'form' }
        },
        {
          path: 'authTenantApply',
          code: 'authTenantApply',
          name: 'AuthTenantApply',
          component: () => import('@/views/system/tenant/apply/index.vue'),
          meta: { title: '租户申请', icon: 'form' }
        },
        {
          path: 'invitation',
          code: 'invitationRecord',
          name: 'InvitationRecord',
          component: () => import('@/views/system/invitation/index.vue'),
          meta: { title: '成员邀请', icon: 'form' }
        },
        {
          path: 'duty',
          code: 'duty',
          name: 'Duty',
          component: () => import('@/views/system/duty/index.vue'),
          meta: { title: '岗位信息', icon: 'form' }
        }
      ]
    },
    {
      path: '/user',
      component: Layout,
      redirect: '/user/user',
      code: 'userPage',
      name: 'UserPage',
      meta: { title: '用户管理', icon: 'user' },
      children: [
        {
          path: 'user',
          code: 'user',
          name: 'UserInfo',
          component: () => import('@/views/system/user/index.vue'),
          meta: { title: '用户信息', icon: 'user' }
        },
        {
          path: 'group',
          code: 'group',
          name: 'GroupInfo',
          component: () => import('@/views/system/group/index.vue'),
          meta: { title: '用户组信息', icon: 'user' }
        }
      ]
    },
    {
      path: '/auth',
      component: Layout,
      redirect: '/auth/role',
      code: 'authPage',
      name: 'AuthPage',
      meta: { title: '权限管理', icon: 'user' },
      children: [
        {
          path: 'role',
          code: 'role',
          name: 'RoleInfo',
          component: () => import('@/views/system/role/index.vue'),
          meta: { title: '角色信息', icon: 'user' }
        },
        {
          path: 'menu',
          code: 'menu',
          name: 'MenuInfo',
          component: () => import('@/views/system/menu/index.vue'),
          meta: { title: '菜单信息', icon: 'tree' }
        },
        {
          path: 'permission',
          code: 'permission',
          name: 'Permission',
          component: () => import('@/views/system/permission/index.vue'),
          meta: { title: '权限信息', icon: 'form' }
        }
      ]
    },
    {
      path: '/interface',
      component: Layout,
      redirect: '/interface/interface',
      code: 'interface',
      name: 'interface',
      meta: { title: '接口管理', icon: 'form' },
      children: [
        {
          path: 'openInterface',
          code: 'openInterface',
          name: 'OpenInterface',
          component: () => import('@/views/system/openInterface/index.vue'),
          meta: { title: '开放接口', icon: 'form' }
        },
        {
          path: 'clientInterface',
          code: 'clientInterface',
          name: 'ClientInterface',
          component: () => import('@/views/system/clientInterface/index.vue'),
          meta: { title: '第三方接口', icon: 'form' }
        }
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return system
  }
}

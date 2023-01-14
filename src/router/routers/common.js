/*
 * @Description:
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2023-01-14 12:34:19
 */
import Layout from '@/layout/index'

export default [
  {
    path: '/portal',
    component: () => import('@/views/common/portal/portal.vue'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/common/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/common/register/index.vue'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/common/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/portal', //portal
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      // component: () => import('@/views/common/dashboard/index'),
      component: () => import('@/views/common/dashboard/indexNew'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

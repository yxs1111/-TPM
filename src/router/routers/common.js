import Layout from '@/layout/index'

export default [
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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/common/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

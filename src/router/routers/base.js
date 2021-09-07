import Layout from '@/layout/index'

const base = [
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/demo',
    meta: { title: '示例信息', icon: 'form' },
    children: [{
      path: 'demo',
      code: 'demo',
      name: 'demo',
      component: () => import('@/views/demo/index.vue'),
      meta: { title: '名字这么长，是为了一眼就看到', icon: 'form' }
    },
    {
      path: '/mConCarModel',
      code: 'mConCarModel',
      name: 'mConCarModel',
      component: () => import('@/views/base/mConCarModel/index.vue'),
      meta: { title: '车型BOM', icon: 'form' }
    }
    ]
  }
]

export default base

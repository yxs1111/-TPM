import Layout from '@/layout/index'

const sample = [
  {
    path: '/sample',
    component: Layout,
    name: 'SamplePage',
    meta: { title: '示例', icon: 'form' },
    children: [
      {
        path: 'i18n',
        name: 'I18n',
        component: () => import('@/views/sample/i18n/index.vue'),
        meta: { title: 'i18n', icon: 'form' }
      },
      {
        path: 'ws',
        name: 'ws',
        component: () => import('@/views/sample/ws/index.vue'),
        meta: { title: 'ws', icon: 'form' }
      },
      {
        path: 'table',
        code: 'SampleTable',
        name: 'SampleTable',
        component: () => import('@/views/sample/table/index.vue'),
        meta: { title: 'table', icon: 'form' }
      },
      {
        path: 'demo',
        code: 'AprilTable',
        name: 'AprilTable',
        component: () => import('@/views/sample/demo/index.vue'),
        meta: { title: 'AprilTable', icon: 'form' }
      },
      {
        path: 'template',
        code: 'template',
        name: 'Template',
        component: () => import('@/views/sample/template/index.vue'),
        meta: { title: '模板管理', icon: 'table' }
      },
      {
        path: 'generate',
        code: 'datasource',
        name: 'Datasource',
        component: () => import('@/views/sample/generate/index.vue'),
        meta: { title: '生成代码', icon: 'form' }
      },
      {
        path: 'documents',
        name: 'documents',
        component: () => import('@/views/sample/documents/index.vue'),
        meta: { title: '文档转换示例', icon: 'form' }
      }
    ]
  }
]

export default sample

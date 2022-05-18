/*
 * @Description: 
 * @Date: 2021-11-17 19:38:49
 * @LastEditTime: 2022-05-18 11:16:10
 */
import Layout from '@/layout/index'

const meta = [
  {
    path: '/meta',
    component: Layout,
    code: 'metaPage',
    name: 'MetaPage',
    meta: { title: '基础信息', icon: 'form' },
    children: [
      {
        path: '/meta/dict/info',
        code: 'dictInfo',
        name: 'DictInfo',
        component: () => import('@/views/meta/dict/info/index.vue'),
        meta: { title: '字典信息', icon: 'form' }
      },
      {
        path: '/meta/dict/type',
        code: 'dictType',
        name: 'DictType',
        component: () => import('@/views/meta/dict/type/index.vue'),
        meta: { title: '字典类型', icon: 'form' }
      },
      {
        path: '/base/rfid',
        component: () => import('@/views/shell/index.vue'),
        code: 'rfidManagement',
        name: 'rfidManagement',
        meta: { title: 'FRID管理', icon: 'form' },
        children: [
          {
            path: '/base/mConRfidRule',
            code: 'mConRfidRule',
            name: 'mConRfidRule',
            component: () => import('@/views/base/m-con-rfid-rule/index.vue'),
            meta: { title: 'RFID规则管理', icon: 'form' }
          },
          {
            path: '/base/mConRfidLabel',
            code: 'mConRfidLabel',
            name: 'mConRfidLabel',
            component: () => import('@/views/base/m-con-rfid-label/index.vue'),
            meta: { title: 'RFID标签管理', icon: 'form' }
          }
        ]
      },
      {
        path: '/base/code',
        component: () => import('@/views/shell/index.vue'),
        code: 'codeManagement',
        name: 'codeManagement',
        meta: { title: '条码管理', icon: 'form' },
        children: [
          {
            path: '/base/mConCodeRule',
            code: 'mConCodeRule',
            name: 'mConCodeRule',
            component: () => import('@/views/base/m-con-code-rule/index.vue'),
            meta: { title: '条码规则管理', icon: 'form' }
          },
          {
            path: '/base/mConCodeTemplate',
            code: 'mConCodeTemplate',
            name: 'mConCodeTemplate',
            component: () => import('@/views/base/m-con-code-template/index.vue'),
            meta: { title: '条码模板管理', icon: 'form' }
          }
        ]
      },
      {
        path: '/base/baseTeam',
        code: 'baseTeam',
        name: 'baseTeam',
        component: () => import('@/views/base/base_team/index.vue'),
        meta: { title: '班组管理', icon: 'form' }
      }
    ]
  }
]

export default meta

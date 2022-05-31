/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-05-31 08:46:07
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'


export default function() {
  const V2 = [
    {
      path: '/costManagement/V2',
      component: () => import('@/views/master/modelIndex.vue'),
      code: 'price_nka_v2',
      name: 'V2',
      alwaysShow: true,
      meta: { title: 'V2 - Accrual 预提调整', icon: 'V2' },
      children: [
        {
          path: '/costManagement/V2/V2Apply',
          code: 'price_nka_v2_apply',
          name: 'V2Apply',
          component: () => import('@/views/V2/V2Apply.vue'),
          meta: { title: '申请', icon: 'apply' },
          redirect: '/costManagement/V2/V2Apply/V2discountAll',
          children: [
            //页面权限配置，需要再菜单管理新添新的PP、NU 页，而不是只有一个申请页（新增页面的时候是否得添加一个该页面的getList,login 的时候才返回数据）
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountAll',
              code: 'price_nka_v2_apply',
              name: 'V2discountAll',
              component: () => import('@/views/V2/V2Apply/V2discountAll.vue'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountDiscount',
              code: 'price_nka_v2_apply',
              name: 'V2discountDiscount',
              component: () => import('@/views/V2/V2Apply/V2discountDiscount.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2discountNU',
              code: 'price_nka_v2_apply',
              name: 'V2discountNU',
              component: () => import('@/views/V2/V2Apply/V2discountNU.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2HIHRebate',
              code: 'price_nka_v2_apply',
              name: 'V2HIHRebate',
              component: () => import('@/views/V2/V2Apply/V2HIHRebate.vue'),
              meta: { title: '折扣项-HIH Rebate', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2KARebate',
              code: 'price_nka_v2_apply',
              name: 'V2KARebate',
              component: () => import('@/views/V2/V2Apply/V2KARebate.vue'),
              meta: { title: '折扣项-KA Rebate', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Apply/V2FMC',
              code: 'price_nka_v2_apply',
              name: 'V2FMC',
              component: () => import('@/views/V2/V2Apply/V2FMC.vue'),
              meta: { title: 'FMC', icon: 'form' ,activeMenu: '/costManagement/V2/V2Apply'},
            },
          ]
        },
        {
          path: '/costManagement/V2/V2Approval',
          code: 'price_nka_v2_approve',
          name: 'V2Approval',
          component: () => import('@/views/V2/V2Approval.vue'),
          meta: { title: '审批', icon: 'approve' },
          redirect: '/costManagement/V2/V2Approval/V2AllApproval',
          children: [
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2AllApproval',
              code: 'price_nka_v2_approve',
              name: 'V2AllApproval',
              component: () => import('@/views/V2/V2Approval/V2AllApproval'),
              meta: { title: '折扣项-汇总', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2DiscountApproval',
              code: 'price_nka_v2_approve',
              name: 'V2DiscountApproval',
              component: () => import('@/views/V2/V2Approval/V2DiscountApproval.vue'),
              meta: { title: '折扣项-价促', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2NUApproval',
              code: 'price_nka_v2_approve',
              name: 'V2NUApproval',
              component: () => import('@/views/V2/V2Approval/V2NUApproval.vue'),
              meta: { title: '折扣项-新客', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2HIHRebateApproval',
              code: 'price_nka_v2_approve',
              name: 'V2HIHRebateApproval',
              component: () => import('@/views/V2/V2Approval/V2HIHRebateApproval.vue'),
              meta: { title: '折扣项-HIH Rebate', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2KARebate',
              code: 'price_nka_v2_approve',
              name: 'V2KARebateApprove',
              component: () => import('@/views/V2/V2Apply/V2KARebate.vue'),
              meta: { title: '折扣项-KA Rebate', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
            {
              hidden: true,
              path: '/costManagement/V2/V2Approval/V2FMCApproval',
              code: 'price_nka_v2_approve',
              name: 'V2FMCApproval',
              component: () => import('@/views/V2/V2Approval/V2FMCApproval.vue'),
              meta: { title: 'FMC', icon: 'form' ,activeMenu: '/costManagement/V2/V2Approval'},
            },
          ]
        },
      ]
    },
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return V2
  }
}

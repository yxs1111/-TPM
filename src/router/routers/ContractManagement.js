/*
 * @Description: 
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2022-05-07 15:44:26
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'
export default function() {
  const costManagement = [
    {
      path:'/contractManagement',
      component: Layout,
      code: 'price_nka_v0',
      name: 'costManagement',
      alwaysShow: true,
      meta: { title: '合同管理', icon: 'V0' },
      children: [
        {
          path: '/contractManagement/ContractEntry',
          name: 'customerContractEntry',
          code: 'mdm_product_information',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '客户合同', icon: 'apply',activeMenu: '/contractManagement' },
          children: [
            {
              path: '/contractManagement/ContractEntry/CustomerContractEntry',
              code: 'mdm_product_information',
              name: 'CustomerContractEntry',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry.vue'),
              meta: { title: '录入', icon: 'apply',activeMenu: '/contractManagement/ContractEntry' },
              redirect: '/contractManagement/ContractEntry/CustomerContractEntry/StraightGiving',
              children: [
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/StraightGiving',
                  code: 'mdm_product_information',
                  name: 'StraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/StraightGiving.vue'),
                  meta: { title: '直供', icon: 'form' ,activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry'},
                },
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/LikenessStraightGiving',
                  code: 'mdm_product_information',
                  name: 'LikenessStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/LikenessStraightGiving.vue'),
                  meta: { title: '准直供', icon: 'form' ,activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry'},
                },
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/UnStraightGiving',
                  code: 'mdm_product_information',
                  name: 'UnStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/UnStraightGiving.vue'),
                  meta: { title: '非直供', icon: 'form' ,activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry'},
                },
              ]
            },
            {
              path: '/contractManagement/ContractEntry/CustomerContractApproval',
              code: 'mdm_product_information',
              name: 'CustomerContractApproval',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractApproval.vue'),
              meta: { title: '审批', icon: 'apply',activeMenu: '/contractManagement/ContractEntry/CustomerContractApproval' },
            },
          ]
        },
        {
          path: '/contractManagement/dealer',
          name: 'dealerContract',
          code: 'mdm_product_information',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '分摊协议', icon: 'apply',activeMenu: '/contractManagement' },
          children: [
            {
              path: '/contractManagement/dealer/dealerContractEntry',
              code: 'mdm_product_information',
              name: 'dealerContractEntry',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractEntry.vue'),
              meta: { title: '录入', icon: 'apply' },
            },
            {
              hidden: true,
              path: '/contractManagement/dealer/dealerContractEntry/dealerTermDetail',
              code: 'mdm_product_information',
              name: 'dealerTermDetail',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractEntry/dealerTermDetail.vue'),
              meta: { title: '经销商分摊协议录入-条款明细', icon: 'form' ,activeMenu: '/contractManagement/dealer/dealerContractEntry'},
            },
            {
              path: '/contractManagement/dealer/dealerContractApproval',
              code: 'mdm_product_information',
              name: 'dealerContractApproval',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval.vue'),
              meta: { title: '审批', icon: 'apply' },
            },
            {
              hidden: true,
              path: '/contractManagement/dealer/dealerContractApproval/dealerTermView',
              code: 'mdm_product_information',
              name: 'dealerTermView',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval/dealerTermView.vue'),
              meta: { title: '经销商分摊协议录入-条款明细', icon: 'form' ,activeMenu: '/contractManagement/dealer/dealerContractApproval'},
            },
          ]
        },
        
        
      ]
    },
    
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return costManagement
  }
}

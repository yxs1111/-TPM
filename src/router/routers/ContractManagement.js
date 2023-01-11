/*
 * @Description:
 * @Date: 2021-09-16 09:36:50
 * @LastEditTime: 2023-01-11 09:58:15
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'
export default function() {
  const costManagement = [
    {
      path: '/contractManagement',
      component: Layout,
      code: 'ContractManagement',
      name: 'costManagement',
      alwaysShow: true,
      meta: { title: '合同管理', icon: 'contractManagement' },
      children: [
        {
          path: '/contractManagement/ContractEntry',
          name: 'customerContractEntry',
          code: 'customerContractEntry',
          alwaysShow: true,
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '客户合同', icon: 'apply', activeMenu: '/contractManagement' },
          children: [
            {
              path: '/contractManagement/ContractEntry/CustomerContractEntry',
              code: 'customerContractApply',
              name: 'CustomerContractEntry',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry.vue'),
              meta: { title: '录入', icon: 'apply', activeMenu: '/contractManagement/ContractEntry' },
              redirect: '/contractManagement/ContractEntry/CustomerContractEntry/UnStraightGiving',
              children: [
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/StraightGiving',
                  code: 'customerContractApply',
                  name: 'StraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/StraightGiving.vue'),
                  meta: { title: '直供', icon: 'form', activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry' }
                },
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/LikenessStraightGiving',
                  code: 'customerContractApply',
                  name: 'LikenessStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/LikenessStraightGiving.vue'),
                  meta: { title: '准直供', icon: 'form', activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry' }
                },
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractEntry/UnStraightGiving',
                  code: 'customerContractApply',
                  name: 'UnStraightGiving',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractEntry/UnStraightGiving.vue'),
                  meta: { title: '间供', icon: 'form', activeMenu: '/contractManagement/ContractEntry/CustomerContractEntry' }
                }
              ]
            },
            {
              path: '/contractManagement/ContractEntry/CustomerContractApproval',
              code: 'customerContractEntryApproval',
              name: 'CustomerContractApproval',
              component: () => import('@/views/taskManage/ContractEntry/CustomerContractApproval.vue'),
              redirect: '/contractManagement/ContractEntry/CustomerContractApproval/CustomerContractTermApproval',
              meta: { title: '审批', icon: 'approve', activeMenu: '/contractManagement/ContractEntry/CustomerContractApproval' },
              children: [
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractApproval/CustomerContractTermApproval',
                  code: 'customerContractEntryApproval',
                  name: 'CustomerContractTermApproval',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractApproval/CustomerContractTermApproval.vue'),
                  meta: { title: '明细审批', icon: 'form', activeMenu: '/contractManagement/ContractEntry/CustomerContractApproval' }
                },
                {
                  hidden: true,
                  path: '/contractManagement/ContractEntry/CustomerContractApproval/CustomerContractChangeApproval',
                  code: 'customerContractEntryApproval',
                  name: 'CustomerContractChangeApproval',
                  component: () => import('@/views/taskManage/ContractEntry/CustomerContractApproval/CustomerContractChangeApproval.vue'),
                  meta: { title: '变更审批', icon: 'form', activeMenu: '/contractManagement/ContractEntry/CustomerContractApproval' }
                }
              ]
            }
          ]
        },
        {
          path: '/contractManagement/dealer',
          name: 'dealerContract',
          code: 'dealerContract',
          alwaysShow: true,
          component: () => import('@/views/taskManage/ContractEntry.vue'),
          meta: { title: '经销商分摊协议', icon: 'apply', activeMenu: '/contractManagement' },
          children: [
            {
              path: '/contractManagement/dealer/dealerContractEntry',
              code: 'dealerContractApply',
              name: 'dealerContractEntry',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractEntry.vue'),
              meta: { title: '录入', icon: 'apply' }
            },
            {
              hidden: true,
              path: '/contractManagement/dealer/dealerContractEntry/dealerTermDetail',
              code: 'dealerContractApply',
              name: 'dealerTermDetail',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractEntry/dealerTermDetail.vue'),
              meta: { title: '经销商分摊协议录入-条款明细', icon: 'form', activeMenu: '/contractManagement/dealer/dealerContractEntry',keepAlive: false }
            },
            {
              path: '/contractManagement/dealer/dealerContractApproval',
              code: 'dealerContractApproval',
              name: 'dealerContractApproval',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval.vue'),
              meta: { title: '审批', icon: 'approve' },
              redirect: '/contractManagement/dealer/dealerContractApproval/dealerContractTermApproval',
              children: [
                {
                  hidden: true,
                  path: '/contractManagement/dealer/dealerContractApproval/dealerContractTermApproval',
                  code: 'dealerContractApproval',
                  name: 'dealerContractTermApproval',
                  component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval/dealerContractTermApproval.vue'),
                  meta: { title: '明细审批', icon: 'approve', activeMenu: '/contractManagement/dealer/dealerContractApproval' }
                },
                {
                  hidden: true,
                  path: '/contractManagement/dealer/dealerContractApproval/dealerContractChangeApproval',
                  code: 'dealerContractApproval',
                  name: 'dealerContractChangeApproval',
                  component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval/dealerContractChangeApproval.vue'),
                  meta: { title: '变更审批', icon: 'approve', activeMenu: '/contractManagement/dealer/dealerContractApproval' }
                }
              ]
            },
            {
              hidden: true,
              path: '/contractManagement/dealer/dealerContractApproval/dealerTermView',
              code: 'dealerContractApproval',
              name: 'dealerTermView',
              component: () => import('@/views/taskManage/ContractEntry/dealerContractApproval/dealerTermView.vue'),
              meta: { title: '经销商分摊协议录入-条款明细', icon: 'form', activeMenu: '/contractManagement/dealer/dealerContractApproval',noCache:true,keepAlive: false}
            }
          ]
        }
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return costManagement
  }
}

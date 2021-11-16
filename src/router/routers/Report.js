/*
 * @Description: 
 * @Date: 2021-11-15 19:40:28
 * @LastEditTime: 2021-11-16 13:03:28
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const Report = [
    {
      path: '/Report',
      component: Layout,
      code: 'Report',
      name: 'Report',
      meta: { title: '报表', icon: 'form' },
      children: [
        {
          path: '/AbnormalAnalysisMonth',
          code: 'AbnormalAnalysisMonth',
          name: 'AbnormalAnalysisMonth',
          component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonth.vue'),
          meta: { title: '异常分析报告-当月', icon: 'form' }
        },
        {
          path: '/AbnormalAnalysisHistory',
          code: 'AbnormalAnalysisHistory',
          name: 'AbnormalAnalysisHistory',
          component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistory.vue'),
          redirect: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
          meta: { title: '异常分析报告-历史', icon: 'form' },
          children: [
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel.vue'),
              meta: { title: 'by Channel', icon: 'form' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA.vue'),
              meta: { title: 'by kA', icon: 'form' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryAbnormalAnalysisHistoryTop10Dist',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist.vue'),
              meta: { title: 'Top 10 Dist', icon: 'form' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone.vue'),
              meta: { title: 'by Zone', icon: 'form' }
            },
          ]
        },
        {
          path: '/LossAnalysisMonth',
          code: 'LossAnalysisMonth',
          name: 'LossAnalysisMonth',
          component: () => import('@/views/Report/LossAnalysisMonth/LossAnalysisMonth.vue'),
          meta: { title: '损益分析报告-当月', icon: 'form' }
        },
        {
          path: '/LossAnalysisHistory',
          code: 'LossAnalysisHistory',
          name: 'LossAnalysisHistory',
          component: () => import('@/views/Report/LossAnalysisHistory/LossAnalysisHistory.vue'),
          meta: { title: '损益分析报告-历史', icon: 'form' }
        },
        {
          path: '/TotalAnalysisMonth',
          code: 'TotalAnalysisMonth',
          name: 'TotalAnalysisMonth',
          component: () => import('@/views/Report/TotalAnalysisMonth/TotalAnalysisMonth.vue'),
          meta: { title: '汇总分析报告-当月', icon: 'form' }
        },
        {
          path: '/TotalAnalysisHistory',
          code: 'TotalAnalysisHistory',
          name: 'TotalAnalysisHistory',
          component: () => import('@/views/Report/TotalAnalysisHistory/TotalAnalysisHistory.vue'),
          meta: { title: '汇总分析报告-历史', icon: 'form' }
        },
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return Report
  }
}

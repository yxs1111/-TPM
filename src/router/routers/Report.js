/*
 * @Description: 
 * @Date: 2021-11-15 19:40:28
 * @LastEditTime: 2021-11-17 14:49:30
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
      meta: { title: '报表', icon: 'report' },
      children: [
        {
          path: '/AbnormalAnalysisMonth',
          code: 'AbnormalAnalysisMonth',
          name: 'AbnormalAnalysisMonth',
          component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonth.vue'),
          meta: { title: '异常分析报告-当月', icon: 'apply' },
          redirect: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
          children: [
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
              code: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel.vue'),
              meta: { title: 'by Channel', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA',
              code: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA.vue'),
              meta: { title: 'by kA', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthTop10Dist',
              code: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthTop10Dist',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthAbnormalAnalysisMonthTop10Dist',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthTop10Dist.vue'),
              meta: { title: 'Top 10 Dist', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone',
              code: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone.vue'),
              meta: { title: 'by Zone', icon: 'approve' }
            },
          ]
        },
        {
          path: '/AbnormalAnalysisHistory',
          code: 'AbnormalAnalysisHistory',
          name: 'AbnormalAnalysisHistory',
          component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistory.vue'),
          redirect: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
          meta: { title: '异常分析报告-历史', icon: 'apply' },
          children: [
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByChannel.vue'),
              meta: { title: 'by Channel', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryBykA.vue'),
              meta: { title: 'by kA', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryAbnormalAnalysisHistoryTop10Dist',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryTop10Dist.vue'),
              meta: { title: 'Top 10 Dist', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              code: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              name: 'AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone',
              component: () => import('@/views/Report/AbnormalAnalysisHistory/AbnormalAnalysisHistoryByZone.vue'),
              meta: { title: 'by Zone', icon: 'approve' }
            },
          ]
        },
        {
          path: '/LossAnalysisMonth',
          code: 'LossAnalysisMonth',
          name: 'LossAnalysisMonth',
          component: () => import('@/views/Report/LossAnalysisMonth/LossAnalysisMonth.vue'),
          meta: { title: '损益分析报告-当月', icon: 'approve' }
        },
        {
          path: '/LossAnalysisHistory',
          code: 'LossAnalysisHistory',
          name: 'LossAnalysisHistory',
          component: () => import('@/views/Report/LossAnalysisHistory/LossAnalysisHistory.vue'),
          meta: { title: '损益分析报告-历史', icon: 'approve' }
        },
        {
          path: '/TotalAnalysisMonth',
          code: 'TotalAnalysisMonth',
          name: 'TotalAnalysisMonth',
          component: () => import('@/views/Report/TotalAnalysisMonth/TotalAnalysisMonth.vue'),
          meta: { title: '汇总分析报告-当月', icon: 'approve' }
        },
        {
          path: '/TotalAnalysisHistory',
          code: 'TotalAnalysisHistory',
          name: 'TotalAnalysisHistory',
          component: () => import('@/views/Report/TotalAnalysisHistory/TotalAnalysisHistory.vue'),
          meta: { title: '汇总分析报告-历史', icon: 'approve' }
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

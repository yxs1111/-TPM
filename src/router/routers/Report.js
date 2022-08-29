/*
 * @Description: 
 * @Date: 2021-11-15 19:40:28
 * @LastEditTime: 2022-07-06 10:08:14
 */
import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const Report = [
    {
      path: '/Report',
      component: Layout,
      code: 'resource-report',
      name: 'Report',
      alwaysShow: true,
      meta: { title: '报表', icon: 'report' },
      children: [
        {
          path: '/AbnormalAnalysisMonth',
          code: 'resource-report-ycfxbg-dy',
          name: 'AbnormalAnalysisMonth',
          alwaysShow: true,
          component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonth.vue'),
          meta: { title: '异常分析报告', icon: 'apply' },
          redirect: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
          children: [
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
              code: 'resource-report-ycfxbg-dy-channel',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthByChannel.vue'),
              meta: { title: 'by Channel', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA',
              code: 'resource-report-KA',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthBykA.vue'),
              meta: { title: 'by kA', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthTop10Dist',
              code: 'resource-report-ycfxbg-dy-disc',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthAbnormalAnalysisMonthTop10Dist',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthTop10Dist.vue'),
              meta: { title: 'Top 10 Dist', icon: 'approve' }
            },
            {
              path: '/AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone',
              code: 'resource-report-ycfxbg-dy-zone',
              name: 'AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone',
              component: () => import('@/views/Report/AbnormalAnalysisMonth/AbnormalAnalysisMonthByZone.vue'),
              meta: { title: 'by Zone', icon: 'approve' }
            },
          ]
        },
        {
          path: '/LossAnalysisMonth',
          code: 'resource-report-profit',
          name: 'LossAnalysisMonth',
          component: () => import('@/views/Report/LossAnalysisMonth/LossAnalysisMonth.vue'),
          meta: { title: '损益分析报告', icon: 'approve' }
        },
        {
          path: '/TotalAnalysisMonth',
          code: 'resource-report-sum',
          name: 'TotalAnalysisMonth',
          component: () => import('@/views/Report/TotalAnalysisMonth/TotalAnalysisMonth.vue'),
          meta: { title: '汇总分析报告', icon: 'approve' }
        },
        {
          path: '/ActingMatNotice',
          code: 'resource-report-notice',
          name: 'ActingMatNotice',
          component: () => import('@/views/Report/ActingMatNotice/ActingMatNotice.vue'),
          meta: { title: '代垫通知报表', icon: 'approve' }
        },
        {
          path: '/ActingConfirm',
          code: 'resource-report-confirm',
          name: 'ActingConfirm',
          component: () => import('@/views/Report/ActingConfirm/ActingConfirm.vue'),
          meta: { title: '代垫确认报表', icon: 'approve' }
        },
        {
          path: '/POSDifferenceAnalysis',
          code: 'resource-report-pos',
          name: 'POSDifferenceAnalysis',
          component: () => import('@/views/Report/POSDifferenceAnalysis/POSDifferenceAnalysis.vue'),
          meta: { title: '月结POS差异分析报表', icon: 'approve' }
        },
        {
          path: '/AccrualReport',
          code: 'resource-report-accrual',
          name: 'AccrualReport',
          component: () => import('@/views/Report/AccrualReport.vue'),
          meta: { title: '财务预提报表', icon: 'approve' }
        },
        //OverviewKA OverviewDist
        // {
        //   path: '/OverviewKA',
        //   code: 'resource-report-pos',
        //   name: 'OverviewKA',
        //   component: () => import('@/views/Report/Overview/OverviewKA.vue'),
        //   meta: { title: 'OverviewKA', icon: 'approve' }
        // },
        // {
        //   path: '/OverviewDist',
        //   code: 'resource-report-pos',
        //   name: 'OverviewDist',
        //   component: () => import('@/views/Report/Overview/OverviewDist.vue'),
        //   meta: { title: 'OverviewDist', icon: 'approve' }
        // },
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return Report
  }
}

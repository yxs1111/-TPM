import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const activiti = [
    {
      path: '/master',
      component: Layout,
      redirect: '/master/zone',
      code: 'master',
      name: 'master',
      meta: { title: '主数据管理', icon: 'form' },
      children: [
        {
          path: '/SKU',
          code: 'SKU',
          name: 'SKU',
          component: () => import('@/views/master/SKU.vue'),
          meta: { title: 'SKU', icon: 'form' }
        },
        {
          path: '/PriceStallMasterData',
          code: 'PriceStallMasterData',
          name: 'PriceStallMasterData',
          component: () => import('@/views/master/PriceStallMasterData.vue'),
          meta: { title: '价格档位', icon: 'form' }
        },
        {
          path: '/Customer',
          code: 'Customer',
          name: 'Customer',
          component: () => import('@/views/master/Customer.vue'),
          meta: { title: '客户信息', icon: 'form' }
        },
        {
          path: '/Channel',
          code: 'Channel',
          name: 'Channel',
          component: () => import('@/views/master/Channel.vue'),
          meta: { title: '渠道信息', icon: 'form' }
        },
        {
          path: '/Dealers',
          code: 'Dealers',
          name: 'Dealers',
          component: () => import('@/views/master/Dealers.vue'),
          meta: { title: '经销商信息', icon: 'form' }
        },
        {
          path: '/RoleCostSubjectControl',
          code: 'RoleCostSubjectControl',
          name: 'RoleCostSubjectControl',
          component: () => import('@/views/master/RoleCostSubjectControl.vue'),
          meta: { title: '费用科目信息', icon: 'form' }
        },
        {
          path: '/Brand',
          code: 'Brand',
          name: 'Brand',
          component: () => import('@/views/master/Brand.vue'),
          meta: { title: '品牌信息', icon: 'form' }
        },
        {
          path: '/Store',
          code: 'Store',
          name: 'Store',
          component: () => import('@/views/master/Store.vue'),
          meta: { title: '门店信息', icon: 'form' }
        },

        // {
        //   path: '/CoastType',
        //   code: 'CoastType',
        //   name: 'CoastType',
        //   component: () => import('@/views/master/CoastType.vue'),
        //   meta: { title: '费用类型', icon: 'form' }
        // },

        // {
        //   path: '/Supplier',
        //   code: 'Supplier',
        //   name: 'Supplier',
        //   component: () => import('@/views/master/Supplier.vue'),
        //   meta: { title: '供应商', icon: 'form' }
        // },

        // {
        //   path: '/zone',
        //   code: 'zone',
        //   name: 'zone',
        //   component: () => import('@/views/master/Zone.vue'),
        //   meta: { title: 'Zone', icon: 'form' }
        // },
        // {
        //   path: '/Region',
        //   code: 'Region',
        //   name: 'Region',
        //   component: () => import('@/views/master/Region.vue'),
        //   meta: { title: 'Region', icon: 'form' }
        // },
        // {
        //   path: '/CityGroup',
        //   code: 'CityGroup',
        //   name: 'CityGroup',
        //   component: () => import('@/views/master/CityGroup.vue'),
        //   meta: { title: 'CityGroup', icon: 'form' }
        // },
        // {
        //   path: '/City',
        //   code: 'City',
        //   name: 'City',
        //   component: () => import('@/views/master/City.vue'),
        //   meta: { title: 'City', icon: 'form' }
        // },
        // {
        //   path: '/Stores',
        //   code: 'Stores',
        //   name: 'Stores',
        //   component: () => import('@/views/master/Stores.vue'),
        //   meta: { title: '门店', icon: 'form' }
        // },

        // {
        //   path: '/Personnel',
        //   code: 'Personnel',
        //   name: 'Personnel',
        //   component: () => import('@/views/master/Personnel.vue'),
        //   meta: { title: '人员', icon: 'form' }
        // },
        // {
        //   path: '/Role',
        //   code: 'Role',
        //   name: 'Role',
        //   component: () => import('@/views/master/Role.vue'),
        //   meta: { title: '角色', icon: 'form' }
        // },
        // {
        //   path: '/Jobs',
        //   code: 'Jobs',
        //   name: 'Jobs',
        //   component: () => import('@/views/master/Jobs.vue'),
        //   meta: { title: '岗位', icon: 'form' }
        // },
        // {
        //   path: '/HistoricalSales',
        //   code: 'HistoricalSales',
        //   name: 'HistoricalSales',
        //   component: () => import('@/views/master/HistoricalSales.vue'),
        //   meta: { title: '历史销量', icon: 'form' }
        // },
        // {
        //   path: '/SalesTarget',
        //   code: 'SalesTarget',
        //   name: 'SalesTarget',
        //   component: () => import('@/views/master/SalesTarget.vue'),
        //   meta: { title: '目标销量', icon: 'form' }
        // },
        // {
        //   path: '/PriceMasterData',
        //   code: 'PriceMasterData',
        //   name: 'PriceMasterData',
        //   component: () => import('@/views/master/PriceMasterData.vue'),
        //   meta: { title: '价格主数据', icon: 'form' }
        // },
        // {
        //   path: '/CityplanSplitRule',
        //   code: 'CityplanSplitRule',
        //   name: 'CityplanSplitRule',
        //   component: () => import('@/views/master/CityplanSplitRule.vue'),
        //   meta: { title: 'Cityplan拆分规则', icon: 'form' }
        // },
        // {
        //   path: '/GuidePriceVerification',
        //   code: 'GuidePriceVerification',
        //   name: 'GuidePriceVerification',
        //   component: () => import('@/views/master/GuidePriceVerification.vue'),
        //   meta: { title: '指导价格验证配置', icon: 'form' }
        // },
        // {
        //   path: '/AuthenticationRuleConfig',
        //   code: 'AuthenticationRuleConfig',
        //   name: 'AuthenticationRuleConfig',
        //   component: () =>
        //     import('@/views/master/AuthenticationRuleConfig.vue'),
        //   meta: { title: '验证规则配置', icon: 'form' }
        // },

        // {
        //   path: '/MechanismPool',
        //   code: 'MechanismPool',
        //   name: 'MechanismPool',
        //   component: () => import('@/views/master/MechanismPool.vue'),
        //   meta: { title: '机制池', icon: 'form' }
        // }
      ]
    }
  ]
  if (showRouter([settings.stageKey])) {
    return []
  } else {
    return activiti
  }
}

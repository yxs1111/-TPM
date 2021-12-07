import Layout from '@/layout/index'
import settings from '@/settings'
import { showRouter } from '@/utils'

export default function() {
  const activiti = [
    {
      path: '/master',
      component: Layout,
      code: 'master',
      name: 'master',
      meta: { title: '主数据管理', icon: 'mainData' },
      children: [
        {
          path: '/NKAEC',
          name: 'NKAEC',
          component: () => import('@/views/master/nkaec/model.vue'),
          meta: { title: 'NKAEC', icon: 'form' },
          redirect: '/nkaec/pages/nka',
          children: [
            // 组织架构
            {
              hidden: true,
              path: '/nkaec/pages/nka',
              code: 'NKA',
              name: 'NKA',
              component: () => import('@/views/master/nkaec/pages/nka.vue'),
              meta: { title: 'NKA', icon: 'form', activeMenu: '/NKAEC' }
            },
            {
              hidden: true,
              path: '/nkaec/pages/EC',
              code: 'EC',
              name: 'EC',
              component: () => import('@/views/master/nkaec/pages/EC.vue'),
              meta: { title: 'EC', icon: 'form', activeMenu: '/NKAEC' }
            },
            {
              hidden: true,
              path: '/nkaec/pages/NKALine',
              code: 'NKALine',
              name: 'NKALine',
              component: () => import('@/views/master/nkaec/pages/NKALine.vue'),
              meta: { title: 'NKALine', icon: 'form', activeMenu: '/NKAEC' }
            },
            {
              hidden: true,
              path: '/nkaec/pages/ECLine',
              code: 'ECLine',
              name: 'ECLine',
              component: () => import('@/views/master/nkaec/pages/ECLine.vue'),
              meta: { title: 'ECLine', icon: 'form', activeMenu: '/NKAEC' }
            }
          ]
        },
        {
          path: '/organization',
          name: 'PriceModel',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '组织架构', icon: 'apply' },
          // redirect: '/priceSale/saleComputeKeep',
          children: [
            // 组织架构
            {
              path: '/organization/Channel',
              code: 'Channel',
              name: 'Channel',
              component: () => import('@/views/master/organization/Channel.vue'),
              meta: { title: '渠道', icon: 'form' }
            },
            {
              path: '/organization/Customer',
              code: 'Customer',
              name: 'Customer',
              component: () => import('@/views/master/organization/Customer.vue'),
              meta: { title: '客户', icon: 'form' }
            },
            {
              path: '/organization/CustomerTeam',
              code: 'CustomerTeam',
              name: 'CustomerTeam',
              component: () => import('@/views/master/organization/CustomerTeam.vue'),
              meta: { title: '客户组', icon: 'form' }
            },
            {
              path: '/organization/Store',
              code: 'Store',
              name: 'Store',
              component: () => import('@/views/master/organization/Store.vue'),
              meta: { title: '门店', icon: 'form' }
            },
            {
              path: '/organization/Dealers',
              code: 'Dealers',
              name: 'Dealers',
              component: () => import('@/views/master/organization/Dealers.vue'),
              meta: { title: '经销商', icon: 'form' }
            },
            {
              path: '/organization/Supplier',
              code: 'Supplier',
              name: 'Supplier',
              component: () => import('@/views/master/organization/Supplier.vue'),
              meta: { title: '供应商', icon: 'form' }
            },
            {
              path: '/organization/SaleKJ',
              code: 'SaleKJ',
              name: 'SaleKJ',
              component: () => import('@/views/master/organization/saleKJ.vue'),
              meta: { title: '销售架构', icon: 'form' }
            },
            {
              path: '/organization/CityVstore',
              code: 'CityVstore',
              name: 'CityVstore',
              component: () => import('@/views/master/organization/cityVStore.vue'),
              meta: { title: '城市&门店对应关系', icon: 'form' }
            }
          ]
        },
        // 产品信息
        {
          path: '/itemInfo',
          name: 'PriceModel',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '产品信息', icon: 'apply' },
          // redirect: '/priceSale/saleComputeKeep',
          children: [
            {
              path: '/itemInfo/Brand',
              code: 'Brand',
              name: 'Brand',
              component: () => import('@/views/master/itemInfo/Brand.vue'),
              meta: { title: '品牌', icon: 'form' }
            },
            {
              path: '/itemInfo/SKU',
              code: 'SKU',
              name: 'SKU',
              component: () => import('@/views/master/itemInfo/SKU.vue'),
              meta: { title: '产品', icon: 'form' }
            }
          ]
        },
        {
          path: '/priceSale',
          name: 'PriceModel',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '价格和促销', icon: 'approve' },
          // redirect: '/priceSale/saleComputeKeep',
          children: [
            // 价格主数据
            {
              path: '/priceSale/priceMasterData',
              name: 'PriceMasterData',
              component: () =>
                import(
                  '@/views/master/priceSale/priceMasterData.vue'
                ),
              meta: {
                title: '价格主数据',
                icon: 'apply'
              }
            },
            { // 价格档位维护
              path: '/priceSale/priceLevelKeep',
              name: 'PriceLevelKeep',
              component: () =>
                import(
                  '@/views/master/priceSale/priceLevelKeep.vue'
                ),
              meta: {
                title: '价格档位维护',
                icon: 'apply'
              }
            },
            // 促销计算维护
            {
              path: '/priceSale/saleComputeKeep',
              name: 'SaleComputeKeep',
              component: () =>
                import(
                  '@/views/master/priceSale/saleComputeKeep.vue'
                ),
              meta: {
                title: '价促计算维护',
                icon: 'apply'
              }
            },
            // {
            //   path: '/priceSale/PriceStallMasterData',
            //   code: 'PriceStallMasterData',
            //   name: 'PriceStallMasterData',
            //   component: () => import('@/views/master/priceSale/PriceStallMasterData.vue'),
            //   meta: { title: '价格档位', icon: 'form' }
            // },
            {
              path: '/priceSale/systemPool',
              code: 'SystemPool',
              name: 'SystemPool',
              component: () => import('@/views/master/priceSale/systemPool.vue'),
              meta: { title: '机制池', icon: 'apply' }
            }
          ]
        },
        // 财务信息
        {
          path: '/financeInfo/priceSale',
          name: 'PriceModel',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '财务信息', icon: 'approve' },
          alwaysShow: true,
          // redirect: '/priceSale/saleComputeKeep',
          children: [
            {
              path: '/RoleCostSubjectControl',
              code: 'RoleCostSubjectControl',
              name: 'RoleCostSubjectControl',
              component: () => import('@/views/master/financeInfo/RoleCostSubjectControl.vue'),
              meta: { title: '费用科目', icon: 'apply' }
            },
          ]
        },
        // 规则控制
        {
          path: '/ruleCtrl',
          name: 'PriceModel',
          component: () => import('@/views/master/modelIndex.vue'),
          meta: { title: '规则控制', icon: 'apply' },
          // redirect: '/priceSale/saleComputeKeep',
          children: [
            // 促销计算维护
            {
              path: '/ruleCtrl/splitRules',
              name: 'SplitRules',
              component: () =>
                import(
                  '@/views/master/ruleCtrl/model/splitRulesM.vue'
                ),
              meta: {
                title: '拆分规则',
                icon: 'approve'
              },
              redirect: '/master/ruleCtrl/model/splitRules',
              children: [
                {
                  hidden: true,
                  path: '/master/ruleCtrl/model/splitRules',
                  code: 'splitRules',
                  name: 'splitRules',
                  component: () => import('@/views/master/ruleCtrl/splitRules.vue'),
                  meta: { title: 'Price Promotion', icon: 'form', activeMenu: '/ruleCtrl/splitRules' }
                },
                {
                  hidden: true,
                  path: '/master/ruleCtrl/model/splitRulesNew',
                  code: 'splitRulesNew',
                  name: 'splitRulesNew',
                  component: () => import('@/views/master/ruleCtrl/splitRulesNew.vue'),
                  meta: { title: 'New User', icon: 'form', activeMenu: '/ruleCtrl/splitRules' }
                }
              ]
            },
            // 价格主数据
            {
              path: '/ruleCtrl/testRules',
              name: 'TestRules',
              component: () =>
                import(
                  '@/views/master/ruleCtrl/testRules.vue'
                ),
              meta: {
                title: '检验规则',
                icon: 'approve'
              }
            },
            {
              path: '/ruleCtrl/newUserC',
              name: 'NewUserC',
              component: () =>
                import(
                  '@/views/master/ruleCtrl/newUserC.vue'
                ),
              meta: {
                title: '新客达成率',
                icon: 'form'
              }
            }
          ]
        }

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

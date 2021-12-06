/*
 * @Description: 
 * @Date: 2021-12-04 08:20:46
 * @LastEditTime: 2021-12-06 10:35:11
 */
import requestApi from '@/api/request-api'
// import request from '@/utils/request'

export default {
  // 渠道下拉框
  queryChannelSelect(params) {
    return requestApi.request_get('/mdm/mdSplitRuleConfig/queryChannelSelect', params)
  },
  // SKU下拉框
  querySkuSelect(params) {
    return requestApi.request_get('/mdm/mdCdmConfig/querySkuSelect', params)
  },
  // MinePackage下拉框
  queryMinePackageSelect(params) {
    return requestApi.request_get('/mdm/mdSplitRuleConfig/queryMinePackageSelect', params)
  },
  // 客户
  queryCustomerList(params) {
    return requestApi.request_get('/mdm/mdCustomer/getCustomerList', params)
  },
  // 经销商
  queryDistributorList(params) {
    return requestApi.request_get('/mdm/mdDistributor/getDistributorList', params)
  },
  // 版本
  getDictInfoByType(params) {
    return requestApi.request_get('/dict/info/getDictInfoByType', params)
  },
  getMonth(params) {
    return requestApi.request_get('/cityplan/baseEffectiveDateConfig/getEffectiveDate', params)
  },
}

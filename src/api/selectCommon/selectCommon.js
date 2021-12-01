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
  }
}

/*
 * @Description: 
 * @Date: 2021-12-04 08:20:46
 * @LastEditTime: 2022-04-28 16:52:24
 */
import requestApi from '@/api/request-api'
// import request from '@/utils/request'

export default {
  // 渠道下拉框
  queryChannelSelect(params) {
    return requestApi.request_get('/mdm/common/queryChannelSelect', params)
  },
  // SKU下拉框
  querySkuSelect(params) {
    return requestApi.request_get('/mdm/common/querySkuSelect', params)
  },
  // MinePackage下拉框
  queryMinePackageSelect(params) {
    return requestApi.request_get('/mdm/common/queryMinePackageSelect', params)
  },
  // 客户
  queryCustomerList(params) {
    return requestApi.request_get('/mdm/common/getCustomerList', params)
  },
  // 经销商
  queryDistributorList(params) {
    return requestApi.request_get('/mdm/common/getDistributorList', params)
  },
  // 版本
  getDictInfoByType(params) {
    return requestApi.request_get('/auth/dict/info/getDictInfoByType', params)
  },
  getMonth(params) {
    return requestApi.request_get('/cityplan/baseEffectiveDateConfig/getEffectiveDate', params)
  },
  //品牌
  getBrand(params) {
    return requestApi.request_get('/mdm/mdBrand/getMdProductList', params)
  },
  //区域
  getRegionList(params) {
    return requestApi.request_get('auth/common2/regionList', params)
  },
  //大区
  getLargeAreaList(params) {
    return requestApi.request_get('/cityplan/mdOrganizationIo/getLargetArea', params)
  },
  //getCostTypeList
  getCostTypeList(params) {
    return requestApi.request_get('mdm/mdCostType/getCostTypeList', params)
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },
  timeout(params) {
    return requestApi.request_put('/job/job/pause', params)
  },
  // 报表 多渠道获取用户
  getCustomerListByChannels(data) {
    return requestApi.request_post('/mdm/common/getCustomerListByChannels', data)
  },
  // V0-V3获取活动月List
  getAllMonth(data) {
    return requestApi.request_get('/cityplan/mdCycleConfig/getAllMonth', data)
  },
  // 客户组
  getCustomerGroupList(data) {
    return requestApi.request_get('/mdm/mdCustomer/getCustomerGroupList', data)
  },
  // 合同录入-客户
  getCustomerListByType(data) {
    return requestApi.request_post('/mdm/common/getCustomerListByType', data)
  },
  // 合同录入-客户
  getCustomerContract(data) {
    return requestApi.request_post('/cityplan/customerContract/customerContract', data)
  },
  // 合同录入-经销商
  getDistributorService(data) {
    return requestApi.request_post('/mdm/common/getDistributorService', data)
  },
  //contract Item 
  getContractItemList(params) {
    return requestApi.request_get('/mdm/mdContractItem/getContractItemList', params)
  },

}

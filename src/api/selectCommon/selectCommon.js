/*
 * @Description: 
 * @Date: 2021-12-04 08:20:46
 * @LastEditTime: 2022-01-19 17:23:06
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
  }
}

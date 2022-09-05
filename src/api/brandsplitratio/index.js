import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/mdm/mdBrandSplitRule',
  // 列表
  getPageContractItem(params) {
    return requestApi.request_get(this.url + '/getBrandSplitRulePage', params)
  },
  // 导出
  exportContractItem(params) {
    return request({
      url: this.url + '/exportBrandSplitRule',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 新增
  insertContractItem(params) {
    return request({
      url: this.url + '/saveBrandSplitRule',
      method: 'post',
      data: params,
    })
  },
  // 删除
  deleteContractItem(params) {
    return request({
      url: this.url + '/deleteByIds',
      method: 'post',
      data: params,
    })
  },
  //  获取对应的CostItem
  getCostItemList(params) {
    return request({
      url: this.url + '/getCostItemByMinePackage',
      method: 'get',
      params: params,
    })
  },
}

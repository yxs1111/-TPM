/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-05-31 09:43:33
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investFmcVOne',
  // 获取SmartplanData
  getSmartplanData(params) {
    return requestApi.request_get(this.url+'/getSmartplanData', params)
  },
  //申请 分页查询
  getFMCApplyPage(params) {
    return requestApi.request_get('/cityplan/InvestFmcVOneApply/getPage', params)
  },
  exportV1(params) {
    return request({
      url: '/cityplan/InvestFmcVOneApply/exportV1',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
}

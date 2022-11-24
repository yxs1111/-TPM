/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-07-11 10:53:46
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
  getPage(params) {
    return requestApi.request_get('/cityplan/investFmcVOne/getVOnePage', params)
  },
  //申请 分页查询
  getPageEC(params) {
    return requestApi.request_get('/cityplan/investCpVOneEFmc/getVOnePage', params)
  },
  exportV1(params) {
    return request({
      url: '/cityplan/investFmcVOne/exportV1',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportVOne(params) {
    return request({
      url: '/cityplan/investCpVOneEFmc/exportVOne',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
}

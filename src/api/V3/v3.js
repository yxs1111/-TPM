import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // 分页查询接口
  getPageV3(params) {
    return requestApi.request_get('/investCpVThreeDetail/getPage', params)
  },
  exportV3(params) {
    return request({
      url: '/investCpVThreeDetail/export',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportTemplate(params) {
    return request({
      url: '/investCpVThreeDetail/exportTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportException(params) {
    return request({
      url: '/investCpVThreeDetail/exportException',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  }
}

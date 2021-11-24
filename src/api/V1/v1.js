import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // 分页查询接口
  getPageV1(params) {
    return requestApi.request_get('/cityplan/investCpVOneDetail/getPage', params)
  },
  approveV1(params) {
    return requestApi.request_post('/cityplan/investCpVOneDetail/approve', params)
  },
  submitV1(params) {
    return requestApi.request_post('/cityplan/investCpVOneDetail/submit', params)
  },
  downExcelTmpForV1(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/downExcelTmpForV1',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  importV1(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/import',
      method: 'get',
      params: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

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
  },
  importV3(formData) {
    return request({
      url: '/investCpVThreeDetail/import',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 文件检索后保存
  saveImportInfo(params) {
    return requestApi.request_post('/investCpVThreeDetail/save', params)
  },
  // 提交
  submitApply(params) {
    return requestApi.request_post('/investCpVThreeDetail/submit', params)
  },
  // 审批 通过 驳回
  approve(params) {
    return requestApi.request_post('/investCpVThreeDetail/approve', params)
  }
}

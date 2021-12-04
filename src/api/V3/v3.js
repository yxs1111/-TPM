/*
 * @Description: 
 * @Date: 2021-11-30 08:52:13
 * @LastEditTime: 2021-12-03 21:11:13
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // 分页查询接口
  getPageV3(params) {
    return requestApi.request_get('/cityplan/investCpVThreeDetail/getPage', params)
  },
  exportV3(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/export',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportTemplate(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/exportTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportException(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/exportException',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  importV3(formData) {
    return request({
      url: '/cityplan/investCpVThreeDetail/import',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 文件检索后保存
  saveImportInfo(params) {
    return requestApi.request_post('/cityplan/investCpVThreeDetail/save', params)
  },
  // 提交
  submitApply(params) {
    return requestApi.request_post('/cityplan/investCpVThreeDetail/submit', params)
  },
  // 审批 通过 驳回
  approve(params) {
    return requestApi.request_post('/cityplan/investCpVThreeDetail/approve', params)
  }
}

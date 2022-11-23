/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-07 20:01:57
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investFmcVTwo',
  //申请 分页查询NKA
  getPage(params) {
    return requestApi.request_get(this.url+'/getV2Page', params)
  },
  //申请 分页查询EC
  getECPage(params) {
    return requestApi.request_get('/cityplan/investCpVTwoEFmc/getVTwoPage', params)
  },
  //审批 分页查询EC
  getECPageApproval(params) {
    return requestApi.request_get('/cityplan/investCpVTwoEFmc/getVTwoApprovePage', params)
  },
  //导出V2
  exportV2(params) {
    return request({
      url: this.url+'/exportV2',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //导出V2
  exportVTwo(params) {
    return request({
      url: '/cityplan/investCpVTwoEFmc/exportVTwo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //保存
  saveV2Data(params) {
    return requestApi.request_put(this.url+'/saveV2Data', params)
  },
  //EC保存
  saveV2DataEC(params) {
    return requestApi.request_post('/cityplan/investCpVTwoEFmc/saveVTwo', params)
  },
  //下载模板
  downloadTemplate(params) {
    return request({
      url: this.url+'/downloadV2Template',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //EC渠道下载模板
  downloadTemplateEC(params) {
    return request({
      url: '/cityplan/investCpVTwoEFmc/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //导入
  import(params) {
    return requestApi.request_post(this.url+'/importV2', params)
  },
  //EC渠道导入
  importEC(params) {
    return requestApi.request_post('/cityplan/investCpVTwoEFmc/importVTwo', params)
  },
  //异常项校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheckV2', params)
  },
  //异常项校验
  exceptionCheckEC(params) {
    return requestApi.request_post('/cityplan/investCpVTwoEFmc/exceptionCheck', params)
  },
  //导出错误信息
  exportV2Error(params) {
    return request({
      url: this.url+'/exportV2Error',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //EC导出错误信息
  exportV2ErrorEC(params) {
    return request({
      url: '/cityplan/investCpVTwoEFmc/exportError',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //EC渠道提交
  approveEC(params) {
    return requestApi.request_post('/cityplan/investCpVTwoEFmc/approveVTwo', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url+'/getApproveList', params)
  },
}

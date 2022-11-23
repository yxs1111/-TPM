/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-07 20:06:25
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investFmcVThree',
  //申请 分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getV3Page', params)
  },
  //申请 EC分页查询
  getPageEC(params) {
    return requestApi.request_get('/cityplan/investCpVThreeEFmc/getVThreePage', params)
  },
  //导出V3
  exportV3(params) {
    return request({
      url: this.url+'/exportV3',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // EC导出V3
  exportECV3(params) {
    return request({
      url: '/cityplan/investCpVThreeEFmc/exportVThree',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //保存
  saveV3Data(params) {
    return requestApi.request_put(this.url+'/saveV3Data', params)
  },
  // EC保存
  saveV3DataEC(params) {
    return requestApi.request_post('/cityplan/investCpVThreeEFmc/saveVThree', params)
  },
  //下载模板
  downloadTemplate(params) {
    return request({
      url: this.url+'/downloadV3Template',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // EC下载模板
  downloadTemplateEC(params) {
    return request({
      url: '/cityplan/investCpVThreeEFmc/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //导入
  import(params) {
    return requestApi.request_post(this.url+'/importV3', params)
  },
  // EC导入
  importEC(params) {
    return requestApi.request_post('/cityplan/investCpVThreeEFmc/importVThree', params)
  },
  //异常项校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheckV3', params)
  },
  // EC异常项校验
  exceptionCheckEC(params) {
    return requestApi.request_post('/cityplan/investCpVThreeEFmc/exceptionCheck', params)
  },
  //导出错误信息
  exportV3Error(params) {
    return request({
      url: this.url+'/exportV3Error',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // EC导出错误信息
  exportV3ErrorEC(params) {
    return request({
      url: '/cityplan/investCpVThreeEFmc/exportError',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/v3Approve', params)
  },
  // EC提交
  approveEC(params) {
    return requestApi.request_post('/cityplan/investCpVThreeEFmc/approveVThree', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url+'/getV3ApproveList', params)
  },
  // EC获取审批
  getApproveListEC(params) {
    return requestApi.request_get('/cityplan/investCpVThreeEFmc/getVThreeApprovePage', params)
  },
}

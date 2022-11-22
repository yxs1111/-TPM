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
  //下载模板
  downloadTemplate(params) {
    return request({
      url: this.url+'/downloadV2Template',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //导入
  import(params) {
    return requestApi.request_post(this.url+'/importV2', params)
  },
  //异常项校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheckV2', params)
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
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url+'/getApproveList', params)
  },
}

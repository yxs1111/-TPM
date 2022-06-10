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
  //导出V2
  exportV3(params) {
    return request({
      url: this.url+'/exportV3',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //保存
  saveV3Data(params) {
    return requestApi.request_put(this.url+'/saveV3Data', params)
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
  //导入
  import(params) {
    return requestApi.request_post(this.url+'/importV3', params)
  },
  //异常项校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheckV3', params)
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
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/v3Approve', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url+'/getV3ApproveList', params)
  },
}

/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-18 17:16:13
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'
// investCpTransportPipVThree/getVThreePage

// url: '/cityplan/investFmcVThree',
export default {
  url: '/cityplan/investCpTransportPipVThree',
  //申请 分页查询 investCpTransportPipVThree/getVThreePage
  getPage(params) {
    return requestApi.request_get(this.url + '/getVThreePage', params)
  },
  //审批分页查询 investCpTransportPipVTwo/getVThreePageApprove
  getVThreePageApprove(params) {
    return requestApi.request_get(this.url + '/getVThreePageApprove', params)
  },
  //导出V3 exportVThree
  exportV3(params) {
    return request({
      url: this.url + '/exportVThree',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //保存 investCpTransportPipVThree/saveVThree
  saveV3Data(params) {
    return requestApi.request_post(this.url + '/saveVThree', params)
  },
  //下载模板  investCpTransportPipVThree/downloadVThreeTemplate
  downloadTemplate(params) {
    return request({
      url: this.url + '/downloadVThreeTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //导入  investCpTransportPipVThree/importVThree
  import(params) {
    return requestApi.request_post(this.url + '/importVThree', params)
  },
  //异常项校验  investCpTransportPipVThree/exceptionCheckVThree
  exceptionCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheckVThree', params)
  },
  //导出错误信息  investCpTransportPipVThree/exportErrorMsg
  exportV3Error(params) {
    return request({
      url: this.url + '/exportErrorMsg',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //提交
  approve(params) {
    return requestApi.request_post(this.url + '/approveVThree', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url + '/getV3ApproveList', params)
  },
}

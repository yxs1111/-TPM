/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-21 17:11:51
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'
// investCpTransportVThree/getVThreePage

// url: '/cityplan/investFmcVThree',
export default {
  url: '/cityplan/investCpTransportVThree',
  //申请 分页查询 investCpTransportVThree/getVThreePage
  getPage(params) {
    return requestApi.request_get(this.url + '/getVThreePage', params)
  },
  //审批分页查询 investCpTransportVTwo/getVThreePageApprove
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
  //保存 investCpTransportVThree/saveVThree
  saveV3Data(params) {
    return requestApi.request_post(this.url + '/saveVThree', params)
  },
  //下载模板  investCpTransportVThree/downloadVThreeTemplate
  downloadTemplate(params) {
    return request({
      url: this.url + '/downloadVThreeTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //导入  investCpTransportVThree/importVThree
  import(params) {
    return requestApi.request_post(this.url + '/importVThree', params)
  },
  //异常项校验  investCpTransportVThree/exceptionCheckVThree
  exceptionCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheckVThree', params)
  },
  //导出错误信息  investCpTransportVThree/exportErrorMsg
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

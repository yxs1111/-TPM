/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-07 20:06:25
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'
// investCpPosmPipVThree/getVThreePage

// url: '/cityplan/investFmcVThree',
export default {
  url: '/cityplan/investCpPosmPipVThree',
  //申请 分页查询 investCpPosmPipVThree/getVThreePage
  getPage(params) {
    return requestApi.request_get(this.url + '/getVThreePage', params)
  },
  //审批分页查询 investCpPosmPipVTwo/getVThreePageApprove
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
  //保存 investCpPosmPipVThree/saveVThree
  saveV3Data(params) {
    // return request({
    //   url: this.url + '/exportVThree',
    //   method: 'post',
    //   data: data,
    //   responseType: 'blob',
    // })
    return requestApi.request_post(this.url + '/saveVThree', params)
  },
  //下载模板  investCpPosmPipVThree/downloadVThreeTemplate
  downloadTemplate(params) {
    return request({
      url: this.url + '/downloadVThreeTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //导入  investCpPosmPipVThree/importVThree
  import(params) {
    return requestApi.request_post(this.url + '/importVThree', params)
  },
  //异常项校验  investCpPosmPipVThree/exceptionCheckVThree
  exceptionCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheckVThree', params)
  },
  //导出错误信息  investCpPosmPipVThree/exportErrorMsg
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
    return requestApi.request_post(this.url + '/v3Approve', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url + '/getV3ApproveList', params)
  },
}

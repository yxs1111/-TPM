/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-18 16:39:21
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpTransportPipVTwo/getTransportPipVTwoPage
  url: '/cityplan/investCpTransportPipVTwo',
  importUrl: '/cityplan/investCpListingVTwoDetailEb',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getTransportPipVTwoPage', params)
  },
  //审批分页查询 investCpTransportPipVTwo/getTransportPipVTwoPageApproval
  getTransportPipVTwoPageApproval(params) {
    return requestApi.request_get(
      this.url + '/getTransportPipVTwoPageApproval',
      params
    )
  },
  //导出
  exportPageExcel(params) {
    return request({
      url: this.url + '/exportVTwo',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //下载模板
  exportTemplateExcel(params) {
    return request({
      url: this.url + '/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //导入 investCpTransportPipVTwo/importVTwo
  fileImport(params) {
    return requestApi.request_post(this.url + '/importVTwo', params)
  },

  //formatCheck 校验数据 investCpTransportPipVTwo/exceptionCheckVTwo
  formatCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheckVTwo', params)
  },
  //异常信息导出 investCpTransportPipVTwo/exportErrorMsg
  exportCheckData(params) {
    return request({
      url: this.url + '/exportErrorMsg',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //保存  investCpTransportPipVTwo/saveVTwo
  importSave(params) {
    return requestApi.request_post(this.url + '/saveVTwo', params)
  },

  //提交
  approve(params) {
    return requestApi.request_post(this.url + '/approve', params)
  },
}

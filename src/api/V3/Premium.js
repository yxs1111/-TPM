/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-10 16:27:33
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpPosmPipVTwo/getPosmPipVTwoPage
  url: '/cityplan/investCpSalesVThreeDetail',
  importUrl: '/cityplan/investCpListingVTwoDetailEb',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getPage', params)
  },
  //审批分页查询 investCpPosmPipVTwo/getPosmPipVTwoPageApproval
  getPosmPipVTwoPageApproval(params) {
    return requestApi.request_get(
      this.url + '/getPosmPipVTwoPageApproval',
      params
    )
  },
  //导出
  exportPageExcel(params) {
    return request({
      url: this.url + '/exportPageExcel',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //下载模板
  exportTemplateExcel(params) {
    return request({
      url: this.url + '/exportTemplateExcel',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  //导入 investCpPosmPipVTwo/importVTwo
  fileImport(params) {
    return requestApi.request_post(this.url + '/fileImport', params)
  },

  //formatCheck 校验数据 investCpPosmPipVTwo/exceptionCheckVTwo
  formatCheck(params) {
    return requestApi.request_post(this.url + '/formatCheck', params)
  },
  // 异常信息导出 investCpPosmPipVTwo/exportErrorMsg
  exportCheckData(params) {
    return request({
      url: this.url + '/exportCheckData',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //保存  investCpPosmPipVTwo/saveVTwo
  importSave(params) {
    return requestApi.request_post(this.url + '/importSave', params)
  },

  //提交
  approve(params) {
    return requestApi.request_post(this.url + '/approve', params)
  },
}

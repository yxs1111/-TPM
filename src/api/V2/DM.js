/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-18 13:59:12
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpPosmPipVTwo/getPosmPipVTwoPage
  url: '/cityplan/investCpDmVTwoDetail',
  saveurl: '/cityplan/investCpDmVTwoDetailEb',

  //分页查询  investCpEcmVTwoDetail/getPage
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
  //导出  investCpEcmVTwoDetail/downExcel
  exportPageExcel(params) {
    return request({
      url: this.url + '/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //下载模板  investCpEcmVTwoDetail/downExcelTemplate
  exportTemplateExcel(params) {
    return request({
      url: this.url + '/downExcelTemplate',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //导入 investCpEcmVTwoDetail/importNormal
  fileImport(params) {
    return requestApi.request_post(this.url + '/importNormal', params)
  },

  //formatCheck 校验数据 investCpEcmVTwoDetail/exceptionCheck
  formatCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheck', params)
  },
  //异常信息导出  investCpEcmVTwoDetailEb/downExcel  investCpDisplayVTwoDetail/exceptionCheck
  exportCheckData(params) {
    return request({
      url: this.saveurl + '/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //保存  investCpEcmVTwoDetailEb/save
  importSave(params) {
    return requestApi.request_post(this.saveurl + '/save', params)
  },

  //提交 investCpEcmVTwoDetail/approve
  approve(params) {
    return requestApi.request_post(this.url + '/approve', params)
  },
}

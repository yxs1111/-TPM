/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-07 20:06:25
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpEcmVThreeDetail',
  saveurl: '/cityplan/investCpEcmVThreeDetailEb',
  //申请 分页查询 /investCpEcmVThreeDetail/getPage
  getPage(params) {
    return requestApi.request_get(this.url + '/getPage', params)
  },
  //审批分页查询 investCpPosmPipVTwo/getVThreePageApprove 暂无
  getVThreePageApprove(params) {
    return requestApi.request_get(this.url + '/getPage', params)
  },
  //导出V3 /investCpEcmVThreeDetail/downExcel
  exportV3(params) {
    return request({
      url: this.url + '/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //保存 investCpEcmVThreeDetailEb/save
  saveV3Data(params) {
    return requestApi.request_post(this.saveurl + '/save', params)
  },
  //下载模板  investCpEcmVThreeDetail/downExcelTemplate
  downloadTemplate(params) {
    return request({
      url: this.url + '/downExcelTemplate',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //导入  investCpEcmVThreeDetail/importNormal
  import(params) {
    return requestApi.request_post(this.url + '/importNormal', params)
  },
  //异常项校验  investCpEcmVThreeDetail/exceptionCheck
  exceptionCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheck', params)
  },
  //导出错误信息  investCpEcmVThreeDetailEb/downExcel
  exportV3Error(params) {
    return request({
      url: this.saveurl + '/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //提交  investCpEcmVThreeDetail/approve
  approve(params) {
    return requestApi.request_post(this.url + '/approve', params)
  },
  //获取审批  zanwu
  getApproveList(params) {
    return requestApi.request_get(this.url + '/getV3ApproveList', params)
  },
}

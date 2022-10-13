/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-08 16:28:59
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpPosmCustomizedVTwo',
  //V2申请分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getPosmVTwoPage', params)
  },
  //V2审批分页查询
  getPageApprove(params) {
    return requestApi.request_get(this.url + '/getPosmVTwoPageApprove', params)
  },
  //导出
  exportExcel(params) {
    return request({
      url: this.url + '/exportVTwo',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 下载模板
  downloadTemplate(params) {
    return request({
      url: this.url + '/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 导入
  import(params) {
    return request({
      url: this.url + '/importVTwo',
      method: 'post',
      data: params,
    })
  },
  // 导出错误信息
  exportV2Error(params) {
    return request({
      url: this.url + '/exportErrorMsg',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 异常校验
  exceptionCheck(params) {
    return request({
      url: this.url + '/exceptionCheck',
      method: 'post',
      data: params,
    })
  },
  // 保存
  saveV2Data(params) {
    return request({
      url: this.url + '/saveVTwo',
      method: 'post',
      data: params,
    })
  },
  // 提交 驳回
  approve(params) {
    return request({
      url: this.url + '/approve',
      method: 'post',
      data: params,
    })
  },
}

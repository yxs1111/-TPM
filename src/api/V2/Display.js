/*
 * @Description:
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2022-09-19 13:11:55
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  displayUrl: '/cityplan/investCpDisplayVTwoDetail',
  // display 查询列表
  displayList(params) {
    return request({
      url: '/cityplan/investCpDisplayVTwoDetail/getPage',
      method: 'get',
      params: params,
    })
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },
  // display导出
  excdisplayData(data) {
    return request({
      url: '/cityplan/investCpDisplayVTwoDetail/downExcel',
      method: 'post',
      data: data,
      responseType: 'blob',
    })
  },
  //display下载模板
  downExcelTemplate(params) {
    return request({
      url: this.displayUrl + '/downExcelTemplate',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //display导入
  importNormal(params) {
    return requestApi.request_post(this.displayUrl + '/importNormal', params)
  },
  //display校验
  displayexceptionCheck(params) {
    return requestApi.request_post(this.displayUrl + '/exceptionCheck', params)
  },
  //display异常项导出
  downExcelError(params) {
    return request({
      url: '/cityplan/investCpDisplayVTwoDetailEb/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //display保存
  save(params) {
    return requestApi.request_post(
      '/cityplan/investCpDisplayVTwoDetailEb/save',
      params
    )
  },
  //display提交、审批
  approve(params) {
    return requestApi.request_post(this.displayUrl + '/approve', params)
  },
}

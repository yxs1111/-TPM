/*
 * @Description:
 * @Date: 2021-11-30 08:52:13
 * @LastEditTime: 2022-09-19 13:08:35
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // display 查询列表
  displayList(params) {
    return request({
      url: '/cityplan/investCpDisplayVThreeDetail/getPage',
      method: 'get',
      params: params,
    })
  },
  // display导出
  excdisplayData(data) {
    return request({
      url: '/cityplan/investCpDisplayVThreeDetail/downExcel',
      method: 'post',
      data: data,
      responseType: 'blob',
    })
  },
  //display下载模板
  downExcelTemplate(params) {
    return request({
      url: '/cityplan/investCpDisplayVThreeDetail/downExcelTemplate',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //display导入
  importNormal(params) {
    return requestApi.request_post(
      '/cityplan/investCpDisplayVThreeDetail/importNormal',
      params
    )
  },
  //display校验
  exceptionCheck(params) {
    return requestApi.request_post(
      '/cityplan/investCpDisplayVThreeDetail/exceptionCheck',
      params
    )
  },
  //display异常项导出
  downExcelError(params) {
    return request({
      url: '/cityplan/investCpDisplayVThreeDetailEb/downExcel',
      method: 'post',
      data: params,
      responseType: 'blob',
    })
  },
  //display保存
  save(params) {
    return requestApi.request_post(
      '/cityplan/investCpDisplayVThreeDetailEb/save',
      params
    )
  },
  //display提交、审批
  approve(params) {
    return requestApi.request_post(
      '/cityplan/investCpDisplayVThreeDetail/approve',
      params
    )
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },
}

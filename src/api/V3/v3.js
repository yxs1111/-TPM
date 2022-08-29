/*
 * @Description:
 * @Date: 2021-11-30 08:52:13
 * @LastEditTime: 2022-05-16 17:08:02
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // 分页查询接口
  getPageV3(params) {
    return requestApi.request_get(
      '/cityplan/investCpVThreeDetail/getPage',
      params
    )
  },
  exportV3(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/export',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  exportTemplate(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/exportTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  exportException(params) {
    return request({
      url: '/cityplan/investCpVThreeDetail/exportException',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  importV3(formData) {
    return request({
      url: '/cityplan/investCpVThreeDetail/import',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  importV3MakeUp(formData) {
    return request({
      url: '/cityplan/investCpVThreeDetail/makeUp',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 文件检索后保存
  saveImportInfo(params) {
    return requestApi.request_post(
      '/cityplan/investCpVThreeDetail/save',
      params
    )
  },
  // 提交
  submitApply(params) {
    return requestApi.request_post(
      '/cityplan/investCpVThreeDetail/submit',
      params
    )
  },
  // 审批 通过 驳回
  approve(params) {
    return requestApi.request_post(
      '/cityplan/investCpVThreeDetail/approve',
      params
    )
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },

  // ********NU*********
  // 分页查询接口
  getPageV3NU(params) {
    return requestApi.request_get(
      '/cityplan/investCpNuVThreeDetail/getPage',
      params
    )
  },
  exportV3NU(params) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/export',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  exportTemplateNU(params) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/exportTemplate',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  exportExceptionNU(params) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/exportException',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  importV3NU(formData) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/import',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  importV3MakeUpNU(formData) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/makeUp',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 文件检索后保存
  saveImportInfoNU(params) {
    return requestApi.request_post(
      '/cityplan/investCpNuVThreeDetail/save',
      params
    )
  },
  // 提交
  submitApplyNU(params) {
    return requestApi.request_post(
      '/cityplan/investCpNuVThreeDetail/submit',
      params
    )
  },
  // 审批 通过 驳回
  approveNU(params) {
    return requestApi.request_post(
      '/cityplan/investCpNuVThreeDetail/approve',
      params
    )
  },
  // 通过与驳回按钮状态
  infoByMainIdNU(params) {
    return requestApi.request_get(
      '/cityplan/investCpNuVThreeDetail/infoByMainId',
      params
    )
  },
  // 第一次校验数据
  formatCheck(formData) {
    return request({
      url: '/cityplan/investCpVThreeDetail/formatCheck',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 第二次校验数据
  exceptionCheck(formData) {
    // return requestApi.request_post('/cityplan/investCpVThreeDetail/exceptionCheck', params)
    return request({
      url: '/cityplan/investCpVThreeDetail/exceptionCheck',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 第一次校验数据  NU
  formatCheckNU(formData) {
    return request({
      url: '/cityplan/investCpNuVThreeDetail/formatCheck',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 第二次校验数据  NU
  exceptionCheckNU(formData) {
    // return requestApi.request_post('/cityplan/investCpNuVThreeDetail/exceptionCheck', params)
    return request({
      url: '/cityplan/investCpNuVThreeDetail/exceptionCheck',
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  //计算
  calculation(params) {
    return requestApi.request_get(
      '/cityplan/investCpVThreeDetail/toCalculation',
      params
    )
  },

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

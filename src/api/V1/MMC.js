/*
 * @Description:
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-04-06 11:24:45
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // 分页查询接口
  getPageV1(params) {
    return requestApi.request_get('/cityplan/investCpVOneDetail/getPage', params)
  },
  // 审批分页查询
  getApprovePageV1(params) {
    return requestApi.request_get('/cityplan/investCpVOneDetail/getApprovePage', params)
  },
  approveV1(params) {
    return requestApi.request_post('/cityplan/investCpVOneDetail/approve', params)
  },
  calculation(params) {
    return requestApi.request_get('/cityplan/investCpVOneDetail/toCalculation', params)
  },
  submitV1(params) {
    return requestApi.request_post('/cityplan/investCpVOneDetail/submit', params)
  },
  downExcelTmpForV1(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/downExcelTmpForV1',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  importV1(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/importExcel',
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 第一次检测数据
  routineCheck(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/routineCheckV2',
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  // 导出excel模板
  exportExcel(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/exportExcel',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 导出错误信息
  exportErrorList(params) {
    return request({
      url: '/cityplan/investCpVOneDetail/exportErrorList',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 文件检索后保存
  saveImportInfo(params) {
    return requestApi.request_get('/cityplan/investCpVOneDetail/saveImportInfo', params)
  },
  getEffectiveDate(params) {
    return requestApi.request_get('/cityplan/baseEffectiveDateConfig/getEffectiveDate', params)
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },
  // 新客--查询
  getPageNU(params) {
    return requestApi.request_get('/cityplan/investCpNuVOneDetail/getPage', params)
  },
  // 新客--导出
  downExcelNU(params) {
    return request({
      url: '/cityplan/investCpNuVOneDetail/downExcel',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 申请列表
  displayList(params) {
    return request({
      url: '/cityplan/investCpMamaclassVOneDetail/getPage',
      method: 'get',
      params,
    })
  },
  // display获取smartplan数据
  getsmartplanData(data) {
    return request({
      url: '/cityplan/investCpDisplayVOneDetail/create',
      method: 'post',
      data: data,
      headers: { 'Content-Type': 'application/json' },
    })
  },
  // display清空数据
  delsmartplanData(data) {
    return request({
      url: '/cityplan/investCpDisplayVOneDetail/deleteAll',
      method: 'post',
      data: data,
      headers: { 'Content-Type': 'application/json' },
    })
  },
  // 清除数据
  clearDataMMC(params) {
    return request({
      url: '/cityplan/investCpMamaclassVOneDetail/deleteMMC',
      method: 'get',
      params,
    })
  },
  // 导出
  excdisplayData(params) {
    return request({
      url: '/cityplan/investCpMamaclassVOneDetail/exportExcel',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
}

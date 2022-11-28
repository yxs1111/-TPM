/*
 * @Description:
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2022-09-19 13:11:55
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  Url: '/cityplan/investCpMamaclassVTwoDetail',
  // 申请 查询列表
  displayList(params) {
    return request({
      url: this.Url + '/getPage',
      method: 'get',
      params,
    })
  },
  // 审批 查询列表
  displayListApprove(params) {
    return request({
      url: this.Url + '/getApprovePage',
      method: 'get',
      params,
    })
  },
  // 通过与驳回按钮状态
  infoByMainId(params) {
    return requestApi.request_get('/cityplan/investCpV/infoByMainId', params)
  },
  // 申请导出
  excdisplayData(params) {
    return request({
      url: this.Url + '/exportExcel',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
  // 审批导出
  excdisplayDataApprove(params) {
    return request({
      url: this.Url + '/exportApproveExcel',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
  //下载模板
  downExcelTemplate(params) {
    return request({
      url: this.Url + '/downTempExcel',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
  //导入常规校验
  importNormal(params) {
    return requestApi.request_post(this.Url + '/routineCheck', params)
  },
  //异常校验
  displayexceptionCheck(params) {
    return requestApi.request_post(this.Url + '/importExcel', params)
  },
  //异常项导出
  downExcelError(params) {
    return request({
      url: this.Url + '/ExportErrorList',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
  //保存
  save(params) {
    return requestApi.request_post(this.Url + '/saveInfo', params)
  },
  //申请提交
  approve(params) {
    return requestApi.request_post(this.Url + '/submit', params)
  },
  //审批的通过与驳回
  approveReject(params) {
    return requestApi.request_post(this.Url + '/approve', params)
  },
}

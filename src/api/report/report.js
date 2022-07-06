/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-07-06 10:00:27
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan',
  exceptionUrl:'/exceptionAnalysisReport',
  // 异常分析报告--当月
  getExceptionAnalysisReport(params) {
    return requestApi.request_post(this.url + '/exceptionAnalysisReport/getReport', params)
  },
  // 汇总分析报告--当月
  getTotalReportList(params) {
    return requestApi.request_post(this.url + '/priceExecutionRate/queryList', params)
  },
  // 代垫通知
  getAdvanceNoticeReport(params) {
    return requestApi.request_get(this.url + '/advanceNoticeReport/getPage', params)
  },
  //代垫通知报表--导出
  exportNoticeReport(params) {
    return request({
      url: this.url + '/advanceNoticeReport/exportList',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 代垫确认
  getSubstituteConfirmReport(params) {
    return requestApi.request_get(this.url + '/substituteConfirmReport/getPage', params)
  },
  //代垫确认--导出
  exportSubstituteConfirmReport(params) {
    return request({
      url: this.url + '/substituteConfirmReport/exportList',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 损益报表
  profitAndLossReport(params) {
    return requestApi.request_post(this.url + '/profitAndLossReport/get', params)
  },
  // 月结POS差异分析报表
  getMonthlyAnalysis(params) {
    return requestApi.request_post(this.url + '/monthlyAnalysis/get', params)
  },
  // 月结POS差异分析报表
  getMonthlyAnalysisExport(params) {
    return requestApi.request_post(this.url + '/monthlyAnalysis/export', params)
  },
  //查询当前节点
  getTaskNode(params) {
    return requestApi.request_get(this.url + '/investCpV/getTaskNode', params)
  },
  //Accrual 报表
  getAccrualReport(params) {
    return requestApi.request_get(this.url + '/investReportAccrual/getPage', params)
  },
  //Accrual 报表--导出
  exportAccrualReport(params) {
    return request({
      url: this.url + '/investReportAccrual/exportList',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
}


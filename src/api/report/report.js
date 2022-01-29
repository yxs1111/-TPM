/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-01-17 15:42:43
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
  // 损益报表
  profitAndLossReport(params) {
    return requestApi.request_post(this.url + '/profitAndLossReport/get', params)
  }
}


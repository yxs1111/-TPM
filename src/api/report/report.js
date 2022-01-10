/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-01-09 14:26:33
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan',
  // 汇总分析报告--当月
  getTotalReportList(params) {
    return requestApi.request_post(this.url + '/priceExecutionRate/queryList', params)
  }
}


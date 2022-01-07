/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-01-07 10:37:56
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan',
  //汇总分析报告--当月
  getList(params) {
    return requestApi.request_get(this.url+'/priceExecutionRate/queryList', params)
  },
}



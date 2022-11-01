/*
 * @Description: 首页接口
 * @Date: 2021-12-10 15:04:18
 * @LastEditTime: 2021-12-10 15:08:56
 */
import requestApi from '@/api/request-api'

export default {
  url: '/cityplan/homePage',
  //消息列表
  getHomePageMsg(params) {
    return requestApi.request_get(this.url + '/getHomePageMsg', params)
  },
  //流程+日历
  getHomePageData(params) {
    return requestApi.request_get(this.url + '/homePage', params)
  },
  getActivity(params) {
    return requestApi.request_get('/cityplan' + '/mdCycleConfig/getCycleListByThree', params)
  }
}

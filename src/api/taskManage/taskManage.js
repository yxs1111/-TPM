/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2021-12-12 13:49:48
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/myHandle',
  //获取列表
  getList(params) {
    return requestApi.request_get(this.url+'/pageList', params)
  },
  //获取流程跟踪
  getInvestCpVList(params) {
    return requestApi.request_get('/cityplan/investCpV/getPage', params)
  },
}



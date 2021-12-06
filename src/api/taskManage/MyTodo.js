/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2021-12-06 15:01:11
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/myHandle',
  //获取列表
  getList(params) {
    return requestApi.request_get(this.url+'/pageList', params)
  },
  
}



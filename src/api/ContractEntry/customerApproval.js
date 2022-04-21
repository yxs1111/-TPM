/*
 * @Description: 
 * @Date: 2022-04-21 09:55:35
 * @LastEditTime: 2022-04-21 09:58:48
 */
/*
 * @Description: 客户合同录入
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-04-15 09:32:27
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/customerContract',
  //客户合同查询列表
  pageApproveTaskList(params) {
    return requestApi.request_get(this.url+'/pageApproveTaskList', params)
  },
}


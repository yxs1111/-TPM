/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-05-31 09:46:37
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investFmcVTwo',
  //申请 分页查询
  getFMCApplyPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
}

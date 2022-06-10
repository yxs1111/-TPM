/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-06 09:16:54
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpRoadshowVOneDetail',
  // 获取SmartplanData
  getSmartplanData(params) {
    return requestApi.request_post(this.url+'/create', params)
  },
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //导出
  downExcel(params) {
    return request({
      url:this.url+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
}

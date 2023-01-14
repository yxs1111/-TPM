/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-12-01 17:21:56
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpTransportVOneDetail',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getTransportPage', params)
  },
  //分页查询
  clearData(params) {
    return requestApi.request_get(this.url + '/clearData', params)
  },
  //导出
  exportExcel(params) {
    return request({
      url: this.url + '/exportVOne',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
}

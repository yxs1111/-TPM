/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-04-28 15:11:45
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpContractVOneDetail',
  // HIH分页查询接口
  getPageHIH(params) {
    return requestApi.request_get(this.url+'/geHihPage', params)
  },
  // HIH导出
  exportHIH(params) {
    return request({
      url: this.url+'/exportHihExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // KA分页查询接口
  getPagekA(params) {
    return requestApi.request_get(this.url+'/getKaPage', params)
  },
  // KA导出
  exportKA(params) {
    return request({
      url: this.url+'/exportKaExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  }
}

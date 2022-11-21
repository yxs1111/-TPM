/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-21 17:11:33
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpTransportVOne/getTransportVOnePage
  url: '/cityplan/investCpTransportVOne',
  // 获取SmartplanData
  getSmartplanData(params) {
    return requestApi.request_get(this.url + '/getSmarPlanData', params)
  },
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getTransportVOnePage', params)
  },
  //导出
  exportExcel(params) {
    // investCpTransportVOne/pipVOneExport
    return request({
      url: this.url + '/pipVOneExport',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
}

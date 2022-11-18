/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-11-18 16:23:51
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpTransportPipVOne/getTransportPipVOnePage
  url: '/cityplan/investCpTransportPipVOne',
  // 获取SmartplanData
  getSmartplanData(params) {
    return requestApi.request_get(this.url + '/getSmarPlanData', params)
  },
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getTransportPipVOnePage', params)
  },
  //导出
  exportExcel(params) {
    // investCpTransportPipVOne/pipVOneExport
    return request({
      url: this.url + '/pipVOneExport',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
}

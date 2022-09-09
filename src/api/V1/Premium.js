/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-08 16:28:59
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpPosmPipVOne/getPosmPipVOnePage
  url: '/cityplan/investCpSalesVOneDetail',
  // 获取SmartplanData
  getSmartplanData(params) {
    return requestApi.request_get(this.url + '/getSmarPlanData', params)
  },
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getPage', params)
  },
  //导出
  exportExcel(params) {
    // investCpPosmPipVOne/pipVOneExport
    return request({
      url: this.url + '/exportExcel',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
}

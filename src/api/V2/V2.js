/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-12-03 08:40:30
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //url: '/cityplan/investCpVTwoDetail',
  url: '/cityplan/investCpVTwoDetail',
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //downExcel
  exportExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.url+'/downExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //导入excel
  /**
   * 导入excel
   * @param {params} params 
   * @returns request
   */
  importExcel(params) {
    return requestApi.request_post(this.url+'/import', params)
  },
  /**
   * 审批
   * @returns 
   */
  approve() {
    return requestApi.request_post(this.url+'/approve', params)
  }
  
}


/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-12-03 10:00:14
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //url: '/cityplan/investCpVTwoDetail',
  url: '/cityplan/investCpVTwoDetail',
  ImportUrl: '/cityplan/investCpVTwoEb',
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
  },
  //v1数据异常项校验
  exceptionCheck(params) {
    return requestApi.request_get(this.ImportUrl+'/exceptionCheck', params)
  },
  //v1数据异常项保存
  exceptionSave(params) {
    return requestApi.request_get(this.ImportUrl+'/save', params)
  },
  //v1数据异常项校验
  exceptionDownExcel(params) {
    return requestApi.request_get(this.ImportUrl+'/downExcel', params)
  },
  
}


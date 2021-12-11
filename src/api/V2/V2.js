/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-12-11 14:52:19
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //url: '/cityplan/investCpVTwoDetail',
  url: '/cityplan/investCpVTwoDetail',
  ImportUrl: '/cityplan/investCpVTwoEb',
  NUUrl: '/cityplan/investCpNuVTwoDetail',
  getPage(params) {
    return requestApi.request_post(this.url+'/getPage', params)
  },
  //downExcel
  exportExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.url+'/downExcel',
      method:'post',
      data:params,
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
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //v1数据异常项校验
  exceptionCheck(params) {
    return requestApi.request_post(this.ImportUrl+'/exceptionCheck', params)
  },
  //v1数据异常项保存
  exceptionSave(params) {
    return requestApi.request_post(this.ImportUrl+'/save', params)
  },
  //v1数据异常项校验
  exceptionDownExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.ImportUrl+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  //NU
  getPageNU(params) {
    return requestApi.request_get(this.NUUrl+'/getPage', params)
  },
  
}


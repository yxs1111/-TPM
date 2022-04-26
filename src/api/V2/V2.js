/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2022-04-25 14:34:48
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //url: '/cityplan/investCpVTwoDetail',
  url: '/cityplan/investCpVTwoDetail',
  ImportUrl: '/cityplan/investCpVTwoEb',
  NUUrl: '/cityplan/investCpNuVTwoDetail',
  ImportNuUrl: '/cityplan/investCpNuVTwoDetailEb',
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
  //二步校验
  exceptionCheckTwo(params) {
    return requestApi.request_post(this.url+'/importExceptionCheck', params)
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
    return requestApi.request_post(this.NUUrl+'/getPage', params)
  },
  //downExcel
  exportNUExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.NUUrl+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  /**
   * V2NU-导入excel
   * @param {params} params 
   * @returns request
   */
  importNUExcel(params) {
    return requestApi.request_post(this.NUUrl+'/import', params)
  },
  //二次校验
  exceptionNUCheckTwo(params) {
    return requestApi.request_post(this.NUUrl+'/importExcelCheck', params)
  },
  /**
   * v2-NU审批
   * @returns 
   */
  approveNU(params) {
    return requestApi.request_post(this.NUUrl+'/approve', params)
  },
  //获取NU 异常信息列表
  getExceptionNUList(params) {
    return requestApi.request_post(this.NUUrl+'/getApproveList', params)
  },
  //v2-NU 导出异常项
  exportNUExceptionExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.ImportNuUrl+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  //v1数据异常项保存
  exceptionNUSave(params) {
    return requestApi.request_post(this.ImportNuUrl+'/save', params)
  },
  
}


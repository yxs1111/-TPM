/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-12-07 10:02:14
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  
  /**
   * @description: 价格主数据--查询
   * @param {*} params
   * @return {*}
   */
  getPageMdprice(params) {
    return requestApi.request_get('/mdm/mdprice/getPageByRequest', params)
  },
  exportMdprice(params) {
    //二进制数据流转blob
    return request({
      url:'/mdm/mdprice/excport',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  importMdprice(params) {
    //return requestApi.request_get('mdprice/import', params)
    return request({
      url:'/mdm/mdprice/imports',
      method:'get',
      params:params,
      processData : false,
      contentType : false,
      headers: { "Content-Type": "multipart/form-data" }
    })
  },
  
}

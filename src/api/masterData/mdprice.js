/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2022-03-01 10:36:05
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
  deleteMdPrice(params) {
    return requestApi.request_post('/mdm/mdprice/deleteAll', params)
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
  downloadMdprice(params) {
    //二进制数据流转blob
    return request({
      url:'/mdm/mdprice/excports',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  importMdprice(params) {
    return requestApi.request_post('/mdm/mdprice/imports', params)
    
  },
  
}

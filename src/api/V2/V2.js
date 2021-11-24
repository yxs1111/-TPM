/*
 * @Description: 
 * @Date: 2021-11-24 10:01:14
 * @LastEditTime: 2021-11-24 15:17:30
 */
/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-11-19 16:34:06
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
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
  importExcel(params) {
    //return requestApi.request_get('mdprice/import', params)
    return request({
      url:this.url+'/import',
      method:'get',
      params:params,
      processData : false,
      contentType : false,
      headers: { "Content-Type": "multipart/form-data" }
    })
  },
  
}


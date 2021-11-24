/*
 * @Description: 
 * @Date: 2021-11-24 10:01:14
 * @LastEditTime: 2021-11-24 20:32:02
 */
/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-11-19 16:34:06
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpVZero',
  get(params) {
    return requestApi.request_get(this.url+'/get', params)
  },
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  getList(params) {
    return requestApi.request_get(this.url+'/getList', params)
  },
  //获取CPT 数据
  getCPTData(params) {
    return requestApi.request_get(this.url+'/createCPT', params)
  },
  //excel 导出
  exportExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.url+'/export',
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
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  
}


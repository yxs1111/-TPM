/*
 * @Description: 
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2021-11-25 17:06:03
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //url: '/cityplan/investCpVZero',
  url: '/investCpVZero',
  //获取V0数据
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
      url:this.url+'/downExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //导入excel
  importExcel(params) {
    return requestApi.request_post(this.url+'/import', params)
  },
  //审批提交,审批驳回
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  
}


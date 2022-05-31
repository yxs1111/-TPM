/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-05-31 10:10:06
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpRoadshowVTwoDetail',
  ImportUrl: '/cityplan/investCpRoadshowVTwoDetailEb',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //导出
  downExcel(params) {
    return request({
      url: this.url+'/downExcel',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //下载模板
  downExcelTemplate(params) {
    return request({
      url: this.url+'/downExcelTemplate',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //导入
  importNormal(params) {
    return requestApi.request_post(this.url+'/importNormal', params)
  },
  //校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheck', params)
  },
  //异常项导出
  downExcelError(params) {
    return request({
      url: this.ImportUrl+'/downExcel',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //保存
  save(params) {
    return requestApi.request_post(this.ImportUrl+'/save', params)
  },
  //提交、审批
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
}

/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-10 16:27:28
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpListingVThreeDetail',
  importUrl:'/cityplan/investCpListingVThreeDetailEb',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //导出
  exportPageExcel(params) {
    return request({
      url:this.url+'/exportPageExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //下载模板
  exportTemplateExcel(params) {
    return request({
      url:this.url+'/exportTemplateExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //导入
  fileImport(params) {
    return requestApi.request_post(this.importUrl+'/fileImport', params)
  },
  //formatCheck
  formatCheck(params) {
    return requestApi.request_post(this.importUrl+'/formatCheck', params)
  },
  //异常信息导出
  exportCheckData(params) {
    return request({
      url:this.importUrl+'/exportCheckData',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  //保存
  importSave(params) {
    return requestApi.request_post(this.url+'/importSave', params)
  },
  //提交
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
}

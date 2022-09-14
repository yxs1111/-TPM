/*
 * @Description: V2 FreeGoodsTin
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-09-14 10:14:48
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpFreegoodsVTwoDetail',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  uploadSAP(params) {
    return requestApi.request_post(this.url+'/uploadSAP', params)
  },
  //导出
  downExcel(params) {
    return request({
      url:this.url+'/exportExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //下载模板
  downExcelTemplate(params) {
    return request({
      url:this.url+'/downTempExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //导入
  importNormal(params) {
    return requestApi.request_post(this.url+'/routineCheck', params)
  },
  //校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/importExcel', params)
  },
  //保存
  save(params) {
    return requestApi.request_post(this.url+'/saveInfo', params)
  },
  //导出错误信息
  downExcelError(params) {
    return request({
      url:this.url+'/ExportErrorList',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
  //提交
  submit(params) {
    return requestApi.request_post(this.url+'/submit', params)
  },
  //审批
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //审批--导出
  exportApproveExcel(params) {
    return request({
      url:this.url+'/exportApproveExcel',
      method:'get',
      params:params,
      responseType:'blob'
    })
  },
}

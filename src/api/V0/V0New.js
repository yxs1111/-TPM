/*
 * @Description:
 * @Date: 2021-11-18 15:04:46
 * @LastEditTime: 2022-07-20 13:36:14
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpPriceVZeroDetail',
  // url: '/investCpVZero',
  ImportUrl: '/cityplan/investCpPriceVZeroDetailEb',
  //获取V0 申请数据
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //获取V0 审批数据
  getApproveList(params) {
    return requestApi.request_post(this.url+'/getApproveList', params)
  },
  //获取CPT 数据
  getCPTData(params) {
    return requestApi.request_post('/cityplan/investCpPriceVZeroDetail/createCPT', params)
  },
  //excel 导出
  exportExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.url+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  //下载模板导出
  exportTemplateExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.url+'/downExcelTemplate',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },
  //导入excel
  importExcel(params) {
    return requestApi.request_post(this.url+'/importNormal', params)
  },
  //审批提交,审批驳回
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //v0校验
  exceptionCheck(params) {
    return requestApi.request_post(this.url+'/exceptionCheck', params)
  },
  //v0数据异常项保存
  exceptionSave(params) {
    return requestApi.request_post(this.ImportUrl+'/save', params)
  },
  //v0数据异常项校验
  exceptionDownExcel(params) {
    //二进制数据流转blob
    return request({
      url:this.ImportUrl+'/downExcel',
      method:'post',
      data:params,
      responseType:'blob'
    })
  },

}


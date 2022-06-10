/*
 * @Description: V3合同
 * @Date: 2022-04-28 15:43:24
 * @LastEditTime: 2022-05-30 10:13:04
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpContractVThreeDetail',
  importUrl: '/cityplan/investCpContractVThreeDetailEb',
  // 申请-HIH/KA查询列表
  getApplyPage(params) {
    return requestApi.request_get(this.url+'/getApplyPage', params)
  },
  // 申请-HIH/KA 导出
  exportApplyExcel(params) {
    return request({
      url: this.url+'/exportApplyExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 申请-HIH/KA 下载模板
  downApplyExcelTemplate(params) {
    return request({
      url: this.url+'/downApplyExcelTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 导入文件
  fileImport(params) {
    return requestApi.request_post(this.importUrl+'/fileImport', params)
  },
  // 验证文件
  formatCheck(params) {
    return requestApi.request_post(this.importUrl+'/formatCheck', params)
  },
  // 保存
  importSave(params) {
    return requestApi.request_post(this.url+'/importSave', params)
  },
  // 提交//通过//驳回
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },

  // 审批-HIH/KA查询列表
  getApprovePage(params) {
    return requestApi.request_get(this.url+'/getApprovePage', params)
  },
  // 审批-HIH/KA 导出
  exportApproveExcel(params) {
    return request({
      url: this.url+'/exportApproveExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 审批-HIH/KA 模板下载
  downApproveExcelTemplate(params) {
    return request({
      url: this.url+'/downApproveExcelTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 导出校验数据
  downCheckData(params){
    return request({
      url: this.importUrl+'/downCheckData',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  }
}

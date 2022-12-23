/*
 * @Description: 
 * @Date: 2022-04-28 15:43:24
 * @LastEditTime: 2022-12-17 19:00:35
 */
/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-04-28 15:11:45
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpContractVTwoDetail',
  importUrl: '/cityplan/investCpContractVTwoEbDetail',
  // V2HIH-申请-分页查询接口
  getPageHIH(params) {
    return requestApi.request_get(this.url+'/getApplyHIHPage', params)
  },
  // V2HIH-申请-导出
  exportHIHApplyExcel(params) {
    return request({
      url: this.url+'/exportHIHApplyExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2HIH-申请-下载模板
  downApplyExcelTemplate(params) {
    return request({
      url: this.url+'/downApplyExcelTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //v2 KA 申请下载模板
  downKARebateExcelTemplate(params) {
    return request({
      url: this.url+'/downKARebateExcelTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2HIH-审批-分页查询接口
  getApproveHIH(params) {
    return requestApi.request_get(this.url+'/getApproveHIHPage', params)
  },
  // V2HIH-审批-导出
  exportHIHApproveExcel(params) {
    return request({
      url: this.url+'/exportApproveHIHExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2HIH-审批-下载模板
  downApproveExcelTemplate(params) {
    return request({
      url: this.url+'/downApproveExcelTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2KA-申请-分页查询接口
  getPagekA(params) {
    return requestApi.request_get(this.url+'/getApplyKAPage', params)
  },
  // V2KA-申请-导出
  exportKAApplyExcel(params) {
    return request({
      url: this.url+'/exportKAApplyExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2KA-审批-分页查询接口
  getKAPageApprove(params) {
    return requestApi.request_get(this.url+'/getApproveKAPage', params)
  },
  // V2KA-审批-导出
  exportKAApproveExcel(params) {
    return request({
      url: this.url+'/exportApproveKAExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // V2申请、审批导入 
  fileImport(params) {
    return requestApi.request_post(this.importUrl+'/fileImport', params)
  },
  //KA V2申请、审批导入
  fileKaRebateImport(params) {
    return requestApi.request_post(this.importUrl+'/fileKaRebateImport', params)
  },
  // V2申请、审批导入 
  formatCheck(params) {
    return requestApi.request_post(this.importUrl+'/formatCheck', params)
  },
  // V2申请、审批保存
  importSave(params) {
    return requestApi.request_post(this.url+'/importSave', params)
  },
  // V2申请、审批提交（通过||驳回）
  approve(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  // 导出校验数据
  downCheckData(params){
    return request({
      url: this.importUrl+'/downCheckData',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //KA 导出校验数据
  downKaRebateCheckData(params){
    return request({
      url: this.importUrl+'/downKaRebateCheckData',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
}

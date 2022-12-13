/*
 * @Description: 客户合同录入
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-12-13 11:23:26
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/customerContract',
  //客户合同查询列表
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //客户合同新增
  addCustomerContract(params) {
    return requestApi.request_post(this.url+'/add', params)
  },
  //客户合同 删除
  deleteCustomerContract(params) {
    return requestApi.request_post(this.url+'/delete', params)
  },
  //客户合同  提交
  submitCustomerContract(params) {
    return requestApi.request_post(this.url+'/submit', params)
  },
  //客户合同 编辑
  updateCustomerContract(params) {
    return requestApi.request_post(this.url+'/update', params)
  },
  //客户合同 复制
  copyCustomerContract(params) {
    return requestApi.request_post(this.url+'/addCopy', params)
  },
  //客户合同 导出
  export(params) {
    return request({
      url: this.url+'/exportCustomerContract',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //录入 客户合同导出
  exportCustomerContractInfo(params) {
    return request({
      url: this.url+'/exportCustomerContractInfo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportCustomerContractDetail(params) {
    return request({
      url: this.url+'/exportCustomerContractDetail',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  exportCustomerContract(params) {
    return request({
      url: this.url+'/exportCustomerContract',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同明细 --保存
  saveDetail(params) {
    return requestApi.request_post(this.url+'/saveDetail', params)
  },
  //客户合同明细 --查询
  findOneSaveDetail(params) {
    return requestApi.request_post(this.url+'/findOne', params)
  },
  //校验-判断客户合同在时间范围内是否存在合同
  checkDateValidity(params) {
    return requestApi.request_post(this.url+'/checkDateValidity', params)
  },
  /**
   * 合同终止
   * @param {*} params 
   * @returns 
   */
  termination(params) {
    return requestApi.request_post(this.url+'/termination', params)
  },
  //信息查询
  findOne(params) {
    return requestApi.request_post('/cityplan/distributorContract/findOne', params)
  },
  getContractItemList(params) {
    return requestApi.request_get('/mdm/mdContractItem/getContractItemList', params)
  },

  //合同系统有效期间调整记录查询
  getRecords(params) {
    return requestApi.request_get('/cityplan/customerContract/findContractPeriodChangeRecord', params)
  }
}


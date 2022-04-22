/*
 * @Description: 客户合同录入
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-04-22 10:06:19
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
  //客户合同 导出
  export(params) {
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
}


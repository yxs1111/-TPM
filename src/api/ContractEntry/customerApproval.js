/*
 * @Description: 
 * @Date: 2022-04-21 09:55:35
 * @LastEditTime: 2022-12-13 11:46:51
 */
/*
 * @Description: 客户合同录入
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-04-15 09:32:27
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/customerContract',
  distUrl: '/cityplan/distributorContract',
  //客户合同审批--查询列表
  getApproveList(params) {
    return requestApi.request_get(this.url+'/pageApproveTaskList', params)
  },
  getApprovePageCustomer(params) {
    return requestApi.request_get(this.url+'/getApprovePage', params)
  },
  //客户合同审批变更审批 获取 列表
  getChangeApproveList(params) {
    return requestApi.request_get('/cityplan/contractPeriodChange/getCustomerPageList', params)
  },
  //客户合同审批变更审批--导出
  exportCustomerContract(params) {
    return request({
      url: '/cityplan/contractPeriodChange/exportCustomerContract',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同审批变更审批--审批
  approveCustomerContractChange(params) {
    return requestApi.request_post('/cityplan/contractPeriodChange/approve', params)
  },
  getApprovePageDealer(params) {
    return requestApi.request_get(this.distUrl+'/getApprovePage', params)
  },
  saveApproveComments(params) {
    return requestApi.request_post(this.url+'/saveApproveComments', params)
  },
  saveDistApproveComments(params) {
    return requestApi.request_post(this.distUrl+'/saveApproveComments', params)
  },
  //客户合同明细 --查询
  findOneSaveDetail(params) {
    return requestApi.request_post(this.url+'/findOne', params)
  },
  //客户合同审批--导出
  exportApprove(params) {
    return request({
      url: this.url+'/exportApproveTask',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同审批--导出
  exportApprovePage(params) {
    return request({
      url: this.url+'/exportApprovePage',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同审批--导出客户详细信息
  exportApproveCustomerContractDetail(params) {
    return request({
      url: this.url+'/exportApproveCustomerContractDetail',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同审批--导出客户条款明细信息
  exportApproveCustomerContractInfo(params) {
    return request({
      url: this.url+'/exportApproveCustomerContractInfo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //经销商合同审批--导出
  exportDistApprovePage(params) {
    return request({
      url: this.distUrl+'/exportApprovePage',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //经销商合同导出-按照客户合同区分Sheet
  exportApproveDistributorContractDetail(params) {
    return request({
      url: this.distUrl+'/exportApproveDistributorContractDetail',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //经销商合同导出-列表显示合同明细
  exportApproveDistributorContractInfo(params) {
    return request({
      url: this.distUrl+'/exportApproveDistributorContractInfo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //客户合同审批--审批
  approveCustomerContract(params) {
    return requestApi.request_post(this.url+'/approve', params)
  },
  //经销商合同审批--审批
  approveDistContract(params) {
    return requestApi.request_post(this.distUrl+'/approve', params)
  },
  getContractItemList(params) {
    return requestApi.request_get('/mdm/mdContractItem/getContractItemList', params)
  },
  //经销商合同录入--客户下拉
  getDistributorApproveConsumer(params) {
    return requestApi.request_get('/cityplan/customerContract/getDistributorApproveConsumer', params)
  },
}


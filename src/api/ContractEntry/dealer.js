/*
 * @Description: 
 * @Date: 2022-04-15 13:29:35
 * @LastEditTime: 2022-04-28 10:48:47
 */
/*
 * @Description: 客户合同录入
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-04-15 09:32:27
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/distributorContract',
  // 合同录入-客户
  getCustomerContract(data) {
    return requestApi.request_post('/cityplan/customerContract/customerContract', data)
  },
  //经销商合同查询列表
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  //新增合同
  add(params) {
    return requestApi.request_post(this.url+'/add', params)
  },
  //编辑合同
  update(params) {
    return requestApi.request_post(this.url+'/update', params)
  },
  /**
   * 合同终止
   * @param {*} params 
   * @returns 
   */
  termination(params) {
    return requestApi.request_post(this.url+'/termination', params)
  },
  //经销商合同 导出
  export(params) {
    return request({
      url: this.url+'/exportDistributorContract',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //经销商合同提交
  submit(params) {
    return requestApi.request_post(this.url+'/submit', params)
  },
  //信息查询
  findOne(params) {
    return requestApi.request_post(this.url+'/findOne', params)
  },
  //删除合同
  delete(params) {
    return requestApi.request_post(this.url+'/delete', params)
  },
  //条款明细保存
  saveContractDetail(params) {
    //saveContractDetail
    return requestApi.request_post(this.url+'/saveDetail', params)
  },
  getContractItemList(params) {
    return requestApi.request_get('/mdm/mdContractItem/getContractItemList', params)
  },
}


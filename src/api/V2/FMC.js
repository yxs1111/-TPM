/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-01 09:02:00
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investFmcVTwo',
  //申请 分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getV2Page', params)
  },
  //导入
  importV2(params) {
    return requestApi.request_get(this.url+'/importV2', params)
  },
  //导出V2
  exportV2(params) {
    return request({
      url: this.url+'/exportV2',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //保存
  saveV2Data(params) {
    return requestApi.request_get(this.url+'/saveV2Data', params)
  },
  //获取审批
  getApproveList(params) {
    return requestApi.request_get(this.url+'/getApproveList', params)
  },
}

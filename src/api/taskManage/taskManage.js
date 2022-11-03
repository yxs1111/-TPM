/*
 * @Description: 我的待办
 * @Date: 2021-12-06 14:02:53
 * @LastEditTime: 2022-07-16 14:23:29
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/myHandle',
  //获取我的待办列表
  getList(params) {
    return requestApi.request_get(this.url+'/pageList', params)
  },
  //获取流程跟踪
  getInvestCpVList(params) {
    return requestApi.request_get('/cityplan/investCpV/getPage', params)
  },
  //获取任务列表
  getMyHandleList(params) {
    return requestApi.request_get(this.url+'/taskPageList', params)
  },
  //获取任务列表
  getContractList(params) {
    return requestApi.request_get('/cityplan/customerContract/pageTaskList', params)
  },
  //我的待办--合同管理
  getContractListTodo(params) {
    return requestApi.request_get('/cityplan/myHandle/getTaskPageContract', params)
  },
  //我的帮助
  getNeedHelp(params) {
    return requestApi.request_get('/mdm/mdUserDocument/getAllFile', params)
  },
  //合同待办导出
  contractExport(params) {
    return request({
      url: '/cityplan/customerContract/exportTask',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //合同流程跟踪--合同管理
  getContractTrackingFlow(params) {
    return requestApi.request_get('/cityplan/processTracking/getPage', params)
  },
}



/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-30 10:11:13
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investSrVTwo',
  // 分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  // 费用科目下拉
  getCostItemList(params) {
    return requestApi.request_get('/cityplan/investSrVThree/getCostItemList', params)
  },
  delete(params) {
    return requestApi.request_post(this.url+'/deleteByIds  ', params)
  },
  // 导出
  downExcel(params) {
    return request({
      url: this.url+'/exportSrVTwo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 下载模板
  downloadTemplate(params) {
    return request({
      url: this.url+'/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 导出错误
  exportErrorMessage(params) {
    return request({
      url: this.url+'/exportErrorMessage',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 导入
  importSrVTwo(params) {
    return requestApi.request_post(this.url+'/importSrVTwo', params)
  },
  // 保存
  saveVTwoData(params) {
    return requestApi.request_post(this.url+'/saveVTwoData', params)
  }
}

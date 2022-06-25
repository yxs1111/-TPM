/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-25 17:39:53
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investSrVThree',
  //分页查询
  getPage(params) {
    return requestApi.request_get(this.url+'/getPage', params)
  },
  delete(params) {
    return requestApi.request_post(this.url+'/deleteByIds  ', params)
  },
  //导出
  downExcel(params) {
    return request({
      url: this.url+'/exportSrVTwo',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //下载模板
  downloadTemplate(params) {
    return request({
      url: this.url+'/downloadTemplate',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //导入
  importSrVTwo(params) {
    return requestApi.request_post(this.url+'/importVThree', params)
  },
  //保存
  saveVTwoData(params) {
    return requestApi.request_post(this.url+'/saveVThreeData', params)
  },
}

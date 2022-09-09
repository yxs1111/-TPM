/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-08 16:28:59
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/cityplan/investCpPosmCustomizedVThree',
  //V3申请分页查询
  getPage(params) {
    return requestApi.request_get(this.url + '/getPosmVThreePage', params)
  },
  //V3审批分页查询
  getPageApprove(params) {
    return requestApi.request_get(
      this.url + '/getPosmVThreePageApprove',
      params
    )
  },
  //导出
  exportExcel(params) {
    return request({
      url: this.url + '/exportVThree',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 下载模板
  downloadTemplate(params) {
    return request({
      url: this.url + '/downloadTemplateVThree',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 导入
  import(params) {
    return request({
      url: this.url + '/importVThree',
      method: 'post',
      data: params,
    })
  },
  // 导出错误信息
  exportV3Error(params) {
    return request({
      url: this.url + '/exportErrorMsg',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
  },
  // 异常校验
  exceptionCheck(params) {
    return request({
      url: this.url + '/exceptionCheckVThree',
      method: 'post',
      data: params,
    })
  },
  // 保存
  saveV3Data(params) {
    return request({
      url: this.url + '/saveVThree',
      method: 'post',
      data: params,
    })
  },
  // 提交 驳回
  approve(params) {
    return request({
      url: this.url + '/approveVThree',
      method: 'post',
      data: params,
    })
  },
}

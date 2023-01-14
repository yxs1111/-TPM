/*
 * @Description: V1 合同
 * @Date: 2021-12-10 08:52:01
 * @LastEditTime: 2022-06-10 16:27:33
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  // investCpPosmPipVTwo/getPosmPipVTwoPage
  url: '/cityplan/investCpOthers',
  checkurl: '/cityplan/investCpDisplayVTwoDetail',
  saveurl: '/cityplan/investCpEcmVTwoDetailEb',

  // 分页查询  investCpEcmVTwoDetail/getPage
  getPage(params) {
    return requestApi.request_get(this.url + '/getOthersPage', params)
  },
  // 清除数据按钮
  getClear(params) {
    return requestApi.request_get(this.url + '/deleteData', params)
  },
  // 费用科目下拉
  getCostItemList(params) {
    return requestApi.request_get('/cityplan/investCpOthers/getCostItem', params)
  },
  // minepackage下拉
  getMinePackageList(params) {
    return requestApi.request_get('/cityplan/investCpOthers/getMinePackage', params)
  },
  // Cost type下拉
  getCostTypeList(params) {
    return requestApi.request_get('/cityplan/investCpOthers/getCostType', params)
  },
  //审批分页查询 investCpPosmPipVTwo/getPosmPipVTwoPageApproval
  getPosmPipVTwoPageApproval(params) {
    return requestApi.request_get(
      this.url + '/getPosmPipVTwoPageApproval',
      params
    )
  },
  // 导出  investCpEcmVTwoDetail/downExcel
  exportPageExcel(params) {
    return request({
      url: this.url+'/exportOthers',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // exportPageExcel(params) {
  //   return request({
  //     url: this.url + '/exportOthers',
  //     method: 'get',
  //     data: params,
  //     responseType: 'blob',
  //   })
  // },
  // 下载模板  investCpEcmVTwoDetail/downExcelTemplate
  exportTemplateExcel(params) {
    return request({
      url: this.url+'/exportOthers',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // exportTemplateExcel(params) {
  //   return request({
  //     url: this.url + '/downExcelTemplate',
  //     method: 'post',
  //     data: params,
  //     responseType: 'blob',
  //   })
  // },
  //导入 investCpEcmVTwoDetail/importNormal
  fileImport(params) {
    return requestApi.request_post(this.url + '/importOthers', params)
  },

  //formatCheck 校验数据 investCpEcmVTwoDetail/exceptionCheck
  formatCheck(params) {
    return requestApi.request_post(this.url + '/exceptionCheck', params)
  },
  //异常信息导出  investCpEcmVTwoDetailEb/downExcel  investCpDisplayVTwoDetail/exceptionCheck
  exportCheckData(params) {
    return request({
      url: this.url + '/exportError',
      method: 'get',
      params: params,
      responseType: 'blob',
    })
    // return requestApi.request_get(this.url + '/exportError', params)
  },
  // exportCheckData(params) {
  //   return request({
  //     url: this.saveurl + '/downExcel',
  //     method: 'post',
  //     data: params,
  //     responseType: 'blob',
  //   })
  // },
  //保存  investCpEcmVTwoDetailEb/save
  importSave(params) {
    return requestApi.request_post(this.url + '/saveOthers', params)
  },

  //提交 investCpEcmVTwoDetail/approve
  approve(params) {
    return requestApi.request_post(this.url + '/approveOthers', params)
  },
  // 审批提交 investCpEcmVTwoDetail/approve
  approveApprove(params) {
    return requestApi.request_post(this.url + '/approveOthersTwo', params)
  },
}

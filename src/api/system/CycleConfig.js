/*
 * @Description: 周期管理
 * @Date: 2022-03-01 16:46:15
 * @LastEditTime: 2022-05-17 13:57:42
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'
export default {
  
  /**
   * @description: 周期管理--查询
   * @param {*} params
   * @return {*}
   */
  getPageCycleConfig(params) {
    return requestApi.request_get('/cityplan/mdCycleConfig/getPage', params)
  },
  // 新增获取活动月信息
  getInfoByYearAndMonth(params) {
    return requestApi.request_get('/cityplan/mdCycleConfig/getInfoByYearAndMonth', params)
  },
  //确认新增
  confirmCycleConfig(params) {
    return requestApi.request_post('/cityplan/mdCycleConfig/insert', params)
  },
  //确认修改
  updateCycleConfig(params) {
    return requestApi.request_put('/cityplan/mdCycleConfig/update', params)
  },
  
  //关账
  closeTheAccount(params) {
    return requestApi.request_get('/cityplan/mdCycleConfig/closeTheAccount', params)
  },
  //周期管理检验
  checkComplete(params) {
    return requestApi.request_post('/cityplan/mdCycleConfig/checkComplete', params)
  },
  
}
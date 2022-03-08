/*
 * @Description: 周期管理
 * @Date: 2022-03-01 16:46:15
 * @LastEditTime: 2022-03-08 11:48:22
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
  
  //关账
  closeTheAccount(params) {
    return requestApi.request_get('/cityplan/mdCycleConfig/closeTheAccount', params)
  },
  
}
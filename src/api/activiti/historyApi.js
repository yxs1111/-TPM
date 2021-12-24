import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 根据流程实例ID获取活动历史
   * @param processInstanceId: 流程实例ID
   */
  getActivityByProcessInstanceId: processInstanceId => {
    return Http.request_get(`${baseUrl}/history/historic-activity-instances`, {
      processInstanceId: processInstanceId
    })
  },
  /**
   * 根据流程实例ID和活动ID获取活动历史
   * @param activityId: 活动ID
   * @param processInstanceId: 流程实例ID
   * @returns {AxiosPromise}
   */
  getHisOfActInsByProcInsIdAndActId: (activityId, processInstanceId) => {
    return Http.request_post(`${baseUrl}/activiti/extension/activity/history`, {
      activityId: activityId,
      processInstanceId: processInstanceId
    })
  },
  /**
   * 根据业务ID和活动ID获取活动历史
   * @param activityId: 活动ID
   * @param businessId: 业务ID
   * @returns {AxiosPromise}
   */
  getHisOfActInsByBusinessIdAndActId: (activityId, businessId) => {
    return Http.request_get(`${baseUrl}/activiti/extension/activity/history`, {
      activityId: activityId,
      businessId: businessId
    })
  },
  getAllHis: processInstanceId => {
    return Http.request_get(`${baseUrl}/activiti/extension/getAllHistory`, {
      processInstanceId: processInstanceId
    })
  }

}

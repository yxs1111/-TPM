import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 任务分页
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.request_post(`${baseUrl}/runtime/tasks/pageList`, param)
  },
  /**
   * 完成任务
   * @param param
   * @returns {AxiosPromise}
   */
  complete: param => {
    return Http.request_post(`${baseUrl}/runtime/tasks/${param.id}`, {
      action: 'complete',
      variables: param.variables
    })
  },
  /**
   * 获取任务信息
   * @param param
   * @returns {AxiosPromise}
   */
  getTask: param => {
    return Http.request_get(`${baseUrl}/runtime/tasks/${param.id}`)
  },
  /**
   * 驳回上一级
   * @param taskId
   * @returns {AxiosPromise}
   */
  rejectPreviousStep: (taskId, variables) => {
    return Http.request_post(`${baseUrl}/runtime/tasks/${taskId}`, {
      action: 'reject',
      variables: variables
    })
  }
}


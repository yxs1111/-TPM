import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 根据ExecutionId获取Variables
   * @param executionId: 执行ID
   */
  getVariablesOfExecution: executionId => {
    return Http.request_get(`${baseUrl}/runtime/executions/${executionId}/variables`)
  }

}

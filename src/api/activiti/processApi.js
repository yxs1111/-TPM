import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 流程分页
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.request_post(`${baseUrl}/repository/process-definitions/pageList`, param)
  },
  /**
   * 暂停流程
   * @param param
   * @returns {AxiosPromise}
   */
  suspendProcess: param => {
    return Http.request_post(`${baseUrl}/repository/process-definitions/${param.id}`, { action: 'suspend' })
  },
  /**
   * 激活流程
   * @param param
   * @returns {AxiosPromise}
   */
  activateProcess: param => {
    return Http.request_post(`${baseUrl}/repository/process-definitions/${param.id}`, {
      action: 'activate'
    })
  },
  /**
   * 启动流程
   * @param param
   * @returns {AxiosPromise}
   */
  startProcess: param => {
    return Http.request_post(`${baseUrl}/runtime/process-instances/start`, param)
  },
  /**
   * 获取流程定义Diagram
   * @param processDefinitionId
   * @returns {AxiosPromise}
   */
  getProcessDefinitionDiagram: processDefinitionId => {
    return Http.request_get(`${baseUrl}/repository/process-definitions/${processDefinitionId}/image`)
  },
  /**
   * 获取流程实例Diagram
   * @param processInstanceId: 流程示例ID
   * @returns {Promise<AxiosResponse<any>>}
   */
  getProcessInstanceDiagram: processInstanceId => {
    return Http.request_get(`${baseUrl}/runtime/process-instances/${processInstanceId}/diagram`)
  },
  /**
   * 根据业务ID获取流程实例Diagram
   * @param processInstanceId: 流程示例ID
   * @returns {Promise<AxiosResponse<any>>}
   */
  getProcessInstanceDiagramByBusinessId: businessId => {
    return Http.request_get(`${baseUrl}/runtime/process-instances/diagram/${businessId}`)
  },
  /**
   * 根据businessId获取Execution
   * @param businessId ：业务ID
   * @returns {Promise<AxiosResponse<any>>}
   */
  getExecutionInfoByBusinessId: businessId => {
    return Http.request_get(`${baseUrl}/runtime/executions`, {
      processInstanceBusinessKey: businessId
    })
  },
  /**
   * 获取指定流程实例里分配给某人的任务
   * @param processInstanceId： 流程实例ID
   * @param assignee ： 代理人
   * @returns {Promise<AxiosResponse<any>>}
   */
  getTaskByProcessInstanceIdAndAssignee: (processInstanceId, assignee) => {
    return Http.request_get(`${baseUrl}/runtime/tasks/${processInstanceId}/${assignee}`)
  },
  /**
   * 删除流程实例
   * @param processInstanceId: 流程实例ID
   * @param reason: 删除原因
   * @returns {AxiosPromise}
   */
  deleteProcessInstanceById: (processInstanceId, reason) => {
    return Http.request_delete(`${baseUrl}/runtime/process-instances/${processInstanceId}`, {
      deleteReason: reason
    })
  }

}

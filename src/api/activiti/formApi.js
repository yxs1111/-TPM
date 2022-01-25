import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 单据列表
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.request_post(`${baseUrl}/repository/form/pageList`, param)
  },
  /**
   * 保存表单设计
   * @param param
   * @returns {AxiosPromise}
   */
  saveDesign: param => {
    return Http.request_post(`${baseUrl}/repository/form/design/save`, param)
  },
  /**
   * 获取单据详情
   * @param formId
   * @returns {AxiosPromise}
   */
  getFormById: formId => {
    return Http.request_get(`${baseUrl}/repository/form/detail/${formId}`)
  },
  /**
   * 根据条件获取单据列表
   * @param param:请求参数
   * @returns {AxiosPromise}
   */
  getFormList: param => {
    return Http.request_post(`${baseUrl}/repository/form/list`, param)
  },
  /**
   * 根据FormID获取表单字段信息
   * @param param
   * @returns {AxiosPromise}
   */
  getComponentList: param => {
    return Http.request_get(`${baseUrl}/activiti/extension/table/field/list`, param)
  },
  /**
   * 获取租户下的所有帆软表单
   * @returns {Promise}
   */
  fineListAll: () => {
    return Http.request_get(`${baseUrl}/actReFineForm/list/all`)
  },
  /**
   * 根据ID获取帆软表单
   * @param id: 帆软表单ID
   * @returns {Promise}
   */
  fineFindOne: id => {
    return Http.request_get(`${baseUrl}/actReFineForm/findOne`, { id: id })
  }
}

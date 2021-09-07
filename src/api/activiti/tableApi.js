import Http from '@/api/request-api'
const baseUrl = '/bpm'
export default {
  /**
   * 业务表列表
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.request_post(`${baseUrl}/repository/table/pageList`, param)
  },
  /**
   * 创建Table
   * @param param
   * @returns {AxiosPromise}
   */
  saveTable: param => {
    return Http.request_post(`${baseUrl}/repository/table/create`, param)
  },
  /**
   * 创建Table,并添加表字段
   * @param param
   * @returns {AxiosPromise}
   */
  saveTableAndField: param => {
    return Http.request_post(`${baseUrl}/repository/table/ext/create`, param)
  },
  /**
   * 更新Table
   * @param param
   * @returns {AxiosPromise}
   */
  updateTable: param => {
    return Http.request_post(`${baseUrl}/repository/table/update`, param)
  },
  /**
   * 根据TableId获取字段列表
   * @param param
   * @returns {AxiosPromise}
   */
  getTableField: param => {
    return Http.request_get(`${baseUrl}/repository/table/tableField/list/${param.id}`)
  }
}

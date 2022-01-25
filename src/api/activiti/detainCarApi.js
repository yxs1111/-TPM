import Http from '@/api/request-api'
const prefix = '/auth'
const baseUrl = '/detain/car'
const detainCarUri = prefix + baseUrl
export default {
  /**
   * 扣车申请
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.getPage(`${detainCarUri}`, param)
  },
  /**
   * 创建扣车申请，并发起流程
   * @param param
   * @returns {AxiosPromise}
   */
  saveAndStartProcess: param => {
    return Http.request_post(`${detainCarUri}/saveAndStartProcess`, param)
  },
  deleteDetainCar: ids => {
    return Http.request_delete(`${detainCarUri}/delete`, ids)
  },
  update: detainCar => {
    return Http.update(`${detainCarUri}`, detainCar)
  }
}

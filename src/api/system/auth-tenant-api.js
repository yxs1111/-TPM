import requestApi from '@/api/request-api'

export default {
  url: '/tenant/authTenant',
  setDisable(params) {
    return requestApi.request_post(this.url + '/setDisable', params)
  },
  getAllTenant() {
    return requestApi.request_get(this.url + '/getAllTenant')
  }
}

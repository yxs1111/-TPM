import requestApi from '@/api/request-api'

export default {
  url: '/auth/menu',
  getAll(params) {
    return requestApi.request_get(this.url + '/getAll', params)
  },
  getPermissionPage(params) {
    return requestApi.request_get(this.url + '/getPermissionPage', params)
  },
  listAllOs() {
    return requestApi.request_get(this.url + '/listAllOs', {})
  }
}

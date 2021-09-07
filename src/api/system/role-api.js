import requestApi from '@/api/request-api'

export default {
  url: '/auth/role',
  listAllOs() {
    return requestApi.request_get(this.url + '/listAllOs', {})
  },
  getAllMenu(params) {
    return requestApi.request_get(this.url + '/getAllMenu', params)
  },
  getPermissionPage(params) {
    return requestApi.request_get(this.url + '/getPermissionPage', params)
  },
  bindPermissions(params) {
    return requestApi.request_put(this.url + '/bindPermissions', params)
  },
  getPermissionCodes(params) {
    return requestApi.request_get(this.url + '/getPermissionCodes', params)
  }
}

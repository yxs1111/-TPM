import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/auth/user',
  resetPwd(params) {
    return requestApi.request_put(this.url + '/resetPwd', params)
  },
  getAllOrg() {
    return request({
      url: this.url + '/getAllOrg',
      method: 'get'
    })
  },
  getAllRole() {
    return request({
      url: this.url + '/getAllRole',
      method: 'get'
    })
  },
  joinOrg(params) {
    return requestApi.request_post(this.url + '/joinOrg', params)
  },
  getUserOrg(params) {
    return requestApi.request_get(this.url + '/getUserOrg', params)
  },
  getRolePage(params) {
    return requestApi.request_get(this.url + '/getRolePage', params)
  },
  listBindRoles(params) {
    return requestApi.request_get(this.url + '/listBindRoles', params)
  },
  bindRole(params) {
    return requestApi.request_put(this.url + '/bindRole', params)
  },
  // 根据登录名查询API
  getByUsername(params) {
    return requestApi.request_get(this.url + '/getByUsername', params)
  }
}

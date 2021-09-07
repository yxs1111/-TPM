import requestApi from '@/api/request-api'

export default {
  url: '/auth/group',
  getUserPage(params) {
    return requestApi.request_get(this.url + '/getUserPage', params)
  },
  bindGroupMember(params) {
    return requestApi.request_put(this.url + '/bindGroupMember', params)
  },
  listBindGroupMembers(params) {
    return requestApi.request_get(this.url + '/listBindGroupMembers', params)
  },
  bindRole(params) {
    return requestApi.request_put(this.url + '/bindRole', params)
  },
  getRolePage(params) {
    return requestApi.request_get(this.url + '/getRolePage', params)
  },
  listBindRoles(params) {
    return requestApi.request_get(this.url + '/listBindRoles', params)
  }
}

import requestApi from '@/api/request-api'

export default {
  url: '/auth/openInterface',
  listResourceServer() {
    return requestApi.request_get(this.url + '/listResourceServer', {})
  },
  listAllClient() {
    return requestApi.request_get(this.url + '/listAllClient', {})
  },
  getClientPage(params) {
    return requestApi.request_get(this.url + '/getClientPage', params)
  },
  listBindClient(params) {
    return requestApi.request_get(this.url + '/listBindClient', params)
  },
  bindClientOpenInterface(params) {
    return requestApi.request_put(this.url + '/bindClientOpenInterface', params)
  },
  thirdPartyStatus(params) {
    return requestApi.request_get('/thirdparty/gatewayRoute/getAll', params)
  }
}

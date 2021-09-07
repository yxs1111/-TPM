import requestApi from '@/api/request-api'

export default {
  url: '/auth/permission',
  listAllOs() {
    return requestApi.request_get(this.url + '/listAllOs', {})
  },
  listMenuByOsCode(params) {
    return requestApi.request_get(this.url + '/listMenuByOsCode', params)
  }
}

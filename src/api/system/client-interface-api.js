import requestApi from '@/api/request-api'

export default {
  url: '/auth/clientInterface',
  listAllClient() {
    return requestApi.request_get('/auth/openInterface/listAllClient', {})
  }
}

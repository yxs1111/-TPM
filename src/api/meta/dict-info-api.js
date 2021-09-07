import requestApi from '@/api/request-api'

export default {
  url: '/auth/dict/info',
  listTypes() {
    return requestApi.request_get(this.url + '/listAllTypes', {})
  }
}

export const getDictInfoByType = (typeCodes) => {
  return requestApi.request_get('/auth/dict/info/getDictInfoByType', { typeCodes })
}

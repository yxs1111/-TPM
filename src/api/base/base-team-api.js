import requestApi from '@/api/request-api'

export default {
  url: '/base/baseTeam',
  listBindTeamUsers(params) {
    return requestApi.request_get(this.url + '/listBindTeamUsers', params)
  },
  bindTeamUsers(params) {
    return requestApi.request_put(this.url + '/bindTeamUsers', params)
  }
}

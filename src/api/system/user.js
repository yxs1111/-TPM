import request from '@/utils/request'
import requestApi from '@/api/request-api'
const osCode = process.env.VUE_APP_SOURCE_KEY

export default {
  login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      params: data
    })
  },
  logout() {
    return requestApi.request_get('/auth/logout', {})
  },
  refresh(refresh_token) {
    return requestApi.request_get('/auth/token/refresh', { 'refresh_token': refresh_token })
  },
  getCaptcha(randomId) {
    return request({
      method: 'GET',
      url: '/auth/common/captcha',
      params: { 'key': randomId },
      responseType: 'arraybuffer'
    })
  },
  getAuthMenu() {
    return requestApi.request_get('/auth/common/getAuthMenu', { osCode: osCode })
  }
}

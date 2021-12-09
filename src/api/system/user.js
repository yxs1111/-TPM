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
  },
  // 企业微信登录
  getWeChatData(params) {
    return requestApi.request_get('/auth/qrcode/getWeChatData', params)
  },
  qrcodeEmail(data) {
    return request({
      url: '/auth/login/qrcode',
      method: 'post',
      data: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }
}

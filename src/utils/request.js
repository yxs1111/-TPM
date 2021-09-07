import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import auth from '@/utils/auth'
import router from '@/router'
import { encrypt } from '@/utils/crypto/crypto-util'

// 401状态，默认true：可以弹出登出框
let unauthorized_state = true
// 请求头key
const sourceKey = process.env.VUE_APP_SOURCE_KEY
const loginKey = process.env.VUE_APP_LOGIN_KEY
// 提示框过期时间
const messageDuration = 5 * 1000
// 请求超时时间
const requestTimeout = 50 * 1000

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: requestTimeout // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 处理是否携带token请求
    if (config.url.indexOf('/login') < 0 && config.url.indexOf('/logout') < 0 && auth.getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['access_token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + auth.getToken()
    }
    // 设置请求Source的值
    if (config.url.includes('/login')) {
      config.headers['Source'] = loginKey
    } else if (!config.headers['Source']) {
      config.headers['Source'] = sourceKey
    }
    // 判断是否需要刷新token
    if (config.url.indexOf('/token/refresh') < 0 && auth.getRefreshToken()) {
      auth.refreshToken()
    }
    // 设置加密信息,过滤form表单类型
    if (!(config.data instanceof FormData)) {
      config.headers['Algorithm'] = 'sm4'
      if (config.params) {
        config.params = { '0': encrypt(JSON.stringify(config.params)) }
      }
      if (config.data) {
        const d = {}
        d.data = encrypt(JSON.stringify(config.data))
        config.data = d
      }
    }
    // 设置完毕
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
      return res
    }
    if (res.code !== 1000) {
      Message.error({
        message: res.message,
        duration: messageDuration
      })
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    const errorCode = error.request.status
    const errorMessage = error.response.data.message || '服务器开小差了，请稍后尝试!'
    if (errorCode === 400) {
      Message.error({
        message: error.response.data.message || error.response.data.data,
        duration: messageDuration
      })
    } else if (errorCode === 401) {
      if (unauthorized_state) {
        unauthorized_state = false
        MessageBox.confirm('你已经登出, 你可以点击取消以继续留在此页面, 或重新登陆', '已登出', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
          .catch((error) => {
            console.error(error)
            unauthorized_state = true
          })
      }
    } else if (errorCode === 403) {
      if (router.currentRoute.fullPath.indexOf('/login') < 0) {
        Message.error({
          message: '你没有权限进行此项操作',
          duration: messageDuration
        })
      }
    } else {
      Message.error({
        message: errorMessage,
        duration: messageDuration
      })
    }
  }
)

export default service

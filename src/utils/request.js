import axios from 'axios'
import { MessageBox, Message,Loading } from 'element-ui'
import store from '@/store'
import auth from '@/utils/auth'
import router from '@/router'
import { encrypt } from '@/utils/crypto/crypto-util'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 401状态，默认true：可以弹出登出框
let unauthorized_state = true
// 请求头key
const sourceKey = process.env.VUE_APP_SOURCE_KEY
// const token = 'Bearer dD1ek05QoYHH7litvLpvR3sOerXj21O2hJBfQnas/UFbPaBa9vNpjydNnxM84mqCZJxiQv7bm1c6My3B4XibGU4wOk99kjh5vHZIEf+asO+Rg8cGh4WPLnhA9RWTqb7OvCY/yMSDnOPQ3mBUTkmK9rCOsPILQh3zGDrsXTNR3+w2JOb/9n5tR4e01kxi36MlVxLvMx4I27yF40bbW2qNTAKiZShMdmxSwMr1I8zEfHhqFxWAvBfnAIz2ipSeCGofMf6nKKiKDyWGB1qb7DXE6mSOmvZdsvl1zu5Jk27FctcCJ76hKZKnNme7d6iMhVy+uDNco534eqvD7YcsiLgOLY5NIcR8NfpExfT41dUXthlIBE+eqmQMGlzFXmplAIGzn6EuxFamnTQdTRC518kTcPiCPK0dXVInmn/8EtNxvShfORKnvSdCv14+XUi/PbpjVCS6+s7Rdbwaox486aC3zYewPt4GeBRu/VD7II6Tu3OSB/zzpGy/XVr1Y6/IZ7qKf1twUpwYO8L96KKiFSSmJXVn8AMoIuOFWhP25ICZ7LKYEAUEuXZkOGBAKS3RrAaN7qHpvFI8iTFARqmfggR0xhFGk8cgcaV80tnDUQAHnS/ZMuOIu1P+6kcNWe877sPS+GUArVfVdMsSV8xS5C+jpyhtkzTs2XrVQl5eX5tKljGq21P+Ujm7nbRCQyYn5++8YVAntAewerqOabTsu6BSLYIaGVuYAR6osv1KmqzgLlZOvacK9YiMtQSYbSZGjObfKCZqFq5sBvuOM1rVLGo39mmW1Bkz8wMgl2gCWaUiy+HZpMbFW5ZS1xQ5okp+1e/GbAKpljHiFAbGnUW5NXsxQ/OOyr50cS4BMl6YBzfcOOan9aE4xn4QygiGaSxaNtql'
const loginKey = process.env.VUE_APP_LOGIN_KEY
// 提示框过期时间
const messageDuration = 10 * 1000
// 请求超时时间
const requestTimeout = 3600 * 1000
//全局 loading
let loading;
//内存中正在请求的数量
let loadingNum=0;
function startLoading() {    
	if(loadingNum==0){
		loading = Loading.service({
		  lock: true,
		  text: '请稍候',
		  background:'rgba(255,255,255,0.5)',
		})
	}
	//请求数量加1
	loadingNum++;
}
function endLoading() {
    //请求数量减1
	loadingNum--
	if(loadingNum<=0){
		loading.close()
	}
}


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: requestTimeout // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    startLoading()
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
    // if (!(config.data instanceof FormData)) {
    //   config.headers['Algorithm'] = 'sm4'
    //   if (config.params) {
    //     config.params = { '0': encrypt(JSON.stringify(config.params)) }
    //   }
    //   if (config.data) {
    //     const d = {}
    //     d.data = encrypt(JSON.stringify(config.data))
    //     config.data = d
    //   }
    // }
    // 设置完毕
    // config.headers['Authorization'] = token
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
    endLoading()
    const res = response.data
    if (response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
      return res
    }
    // if (res.code !== 1000) {
    //   Message.error({
    //     message: res.message,
    //     duration: messageDuration
    //   })
    // }
    return res
  },
  error => {
    endLoading()
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

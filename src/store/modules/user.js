import user from '@/api/system/user'
import auth from '@/utils/auth'
import { encrypt,decrypt } from '@/utils/crypto/crypto-util'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: auth.getToken(),
    refresh_token: auth.getRefreshToken(),
    expires_in: auth.getExpireAt(),
    name: '',
    login_name: '',
    avatar: '',
    roles: [],
    auth_menus: []
  }
}

const decryptStr = (encrypt_str) => {
  return JSON.parse(decrypt(encrypt_str))
}

const initUserInfo = (data) => {
  try {
    const usr = decryptStr(data.user)
    const authorities = decryptStr(data.authorities)
    const token = decryptStr(data.token)
    const info = {}
    auth.clear()
    if (authorities) {
      const roles = []
      authorities.forEach(item => {
        roles.push(item.authority)
      })
      auth.setRoles(roles)
      info.roles = roles
    }
    // console.log('*****user****', usr.userProfile.email)
    auth.setLoginNameEmail(usr.user.loginName)
    auth.setLoginName(usr.username)
    auth.setLoginNameCheck(usr.user.loginName)
    auth.setName(usr.user.name)
    auth.setPhone(usr.user.phone)
    auth.setAvatar('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    auth.setToken(token.access_token)
    auth.setRefreshToken(token.refresh_token)
    auth.setExpireAt(token.refresh_interval)
    info.userProfile = usr.userProfile
    auth.setUserInfo(info)
  } catch (e) {
    console.error(e)
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_EXPIRES_IN: (state, expires_in) => {
    state.expires_in = expires_in
  },
  SET_AUTH_MENUS: (state, auth_menus) => {
    state.auth_menus = auth_menus
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password, code, key } = userInfo
    sessionStorage.setItem("username",username)
    sessionStorage.setItem("password",password)
    return new Promise((resolve, reject) => {
      user.login({ username: username, password: password, captcha: code, randomId: key }).then(response => {
        const { data } = response
        initUserInfo(data)
        // console.log('****authuser*****', auth.getLoginNameCheck())
        localStorage.setItem('usernameLocal', auth.getLoginNameCheck())
        resetRouter()
        resolve()
        dispatch('app/hideBreadcrumb', {}, { root: true }) // 登录之后进首页,默认首页面包屑隐藏
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  },
  loginCPT({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user
        .login({ username, password, model:'noCaptcha' })
        .then((response) => {
          if (response.code == 1000) {
            // location.href = 'https://uat-iinvest.rfc-friso.com:8080/#/dashboard?loginInfo=' + JSON.stringify(userInfo)
            let encryptStr=encrypt(JSON.stringify(userInfo))
            //encodeURIComponent 对@等特殊字符转义处理 https://uat-cpt.rfc-friso.com/
            location.href = 'https://uat-cpt.rfc-friso.com/SalesCPT/#/dashboard?loginInfo=' + encodeURIComponent(encryptStr)
          }
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  loginMarketingCPT({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user
        .login({ username, password, model:'noCaptcha' })
        .then((response) => {
          if (response.code == 1000) {
            // location.href = 'https://uat-iinvest.rfc-friso.com:8080/#/dashboard?loginInfo=' + JSON.stringify(userInfo)
            let encryptStr=encrypt(JSON.stringify(userInfo))
            //encodeURIComponent 对@等特殊字符转义处理 https://uat-cpt.rfc-friso.com/
            location.href = 'https://uat-cpt.rfc-friso.com/MarketingCPT/#/dashboard?loginInfo=' + encodeURIComponent(encryptStr)
          }
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  loginOtherSystem({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user
        .login({ username, password, model:'noCaptcha' })
        .then((response) => {
          console.log(response)
          if (response.code == 1000) {
            const { data } = response
            initUserInfo(data)
            // console.log('****authuser*****', auth.getLoginNameCheck())
            localStorage.setItem('usernameLocal', auth.getLoginNameCheck())
            resetRouter()
            resolve()
            dispatch('app/hideBreadcrumb', {}, { root: true }) // 登录之后进首页,默认首页面包屑隐藏
          }
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
  },
  // wx login
  WXlogin({ dispatch }, formdata) {
    const localParams = formdata
    return new Promise((resolve, reject) => {
      user.qrcodeEmail(localParams).then(response => {
        const { data } = response
        initUserInfo(data)
        // console.log('name', auth.getLoginNameCheck())
        localStorage.setItem('usernameLocal', auth.getLoginNameCheck())
        localStorage.setItem('WXemail', 'WXemail')
        // window.location.href = 'https://uat-iinvest.rfc-friso.com:8080/#/dashboard'
        resetRouter()
        resolve()
        dispatch('app/hideBreadcrumb', {}, { root: true }) // 登录之后进首页,默认首页面包屑隐藏
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getAuthMenu
  getAuthMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.getAuthMenu().then(response => {
        const { data } = response
        commit('SET_AUTH_MENUS', data)
        auth.setAuthMenus(data)
        resolve(data)
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      auth.clear()
      // 微信登录时 重新打开网页
      if (localStorage.getItem('WXemail') === 'WXemail') {
        window.open('https://uat-iinvest.rfc-friso.com/#/login', '_self')
      }
      localStorage.setItem('WXemail', null)
      commit('RESET_STATE')
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      auth.removeToken() // must remove  token  first
      auth.removeRefreshToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


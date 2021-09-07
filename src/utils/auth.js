import user from '@/api/system/user'
import session_db from '@/utils/session-db'
import { encrypt, decrypt } from '@/utils/crypto/crypto-util'

// token
const tokenKey = encrypt('access_token')
// refresh token
const refreshTokenKey = encrypt('refresh_token')
// 是否正在刷新token
const refreshingKey = encrypt('refreshing')
// token过期时间
const expireAtKey = encrypt('expireAt')
// 角色
const rolesKey = encrypt('roles')
// 用户姓名
const nameKey = encrypt('name')
// 登录名
const loginNameKey = encrypt('loginName')
// 头像
const avatarKey = encrypt('avatar')
// 电话号码
const phoneKey = encrypt('phone')
// 用户信息
const userInfoKey = encrypt('userInfo')
// 用户可访问菜单
const menuKey = encrypt('auth_menus')

function get(key) {
  const val = session_db.get(key)
  return val ? decrypt(val) : null
}

function set(key, value) {
  const val = value ? encrypt(value) : null
  session_db.set(key, val)
}

function remove(key) {
  session_db.remove(key)
}

export default {
  clear() {
    session_db.clear()
  },
  getAuthMenus() {
    const menus = get(menuKey)
    return menus ? JSON.parse(menus) : menus
  },
  setAuthMenus(menus) {
    return set(menuKey, menus ? JSON.stringify(menus) : menus)
  },
  getToken() {
    return get(tokenKey)
  },
  getExpireAt() {
    return session_db.get(expireAtKey)
  },
  setExpireAt(refreshInterval) {
    return session_db.set(expireAtKey, Date.now() + refreshInterval)
  },
  getRefreshToken() {
    return get(refreshTokenKey)
  },
  setRefreshToken(refresh_token) {
    return set(refreshTokenKey, refresh_token)
  },
  setToken(token) {
    return set(tokenKey, token)
  },
  getRoles() {
    const roles = get(rolesKey)
    return roles ? JSON.parse(roles) : roles
  },
  setRoles(roles) {
    return set(rolesKey, roles ? JSON.stringify(roles) : roles)
  },
  setUserInfo(userInfo) {
    return set(userInfoKey, userInfo ? JSON.stringify(userInfo) : userInfo)
  },
  getUserInfo() {
    const userInfo = get(userInfoKey)
    return userInfo ? JSON.parse(userInfo) : userInfo
  },
  getName() {
    return get(nameKey)
  },
  setName(name) {
    return set(nameKey, name)
  },
  getLoginName() {
    return get(loginNameKey)
  },
  setLoginName(loginName) {
    return set(loginNameKey, loginName)
  },
  getAvatar() {
    return get(avatarKey)
  },
  setAvatar(avatar) {
    return set(avatarKey, avatar)
  },
  getPhone() {
    return get(phoneKey)
  },
  setPhone(phone) {
    return set(phoneKey, phone)
  },
  removeToken() {
    return remove(tokenKey)
  },
  removeRefreshToken() {
    return remove(refreshTokenKey)
  },
  // 刷新token方法
  refreshToken() {
    if (Date.now() > session_db.get(expireAtKey)) {
      const refreshing = get(refreshingKey)
      if (!refreshing) {
        set(refreshingKey, refreshingKey)
        const refresh_token = this.getRefreshToken()
        user.refresh(refresh_token).then((res) => {
          this.setToken(res.data.token.access_token)
          this.setRefreshToken(res.data.token.refresh_token)
          this.setExpireAt(res.data.token.refresh_interval)
          remove(refreshingKey)
        }).catch((error) => {
          console.error(error)
          remove(refreshingKey)
        })
      }
    }
  }
}

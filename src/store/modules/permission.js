import { asyncRoutes, constantRoutes } from '@/router'

const enable_super_admin = process.env.VUE_APP_ENABLE_SUPER_ADMIN
const super_admin_name = process.env.VUE_APP_SUPER_ADMIN_NAME

/**
 * Use meta.role to determine if the current user has permission
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.code) {
    return menus.some(menu => {
      if (route.code === menu.code) {
        route.meta.sorting = menu.sorting
        route.meta.bitResult = menu.bitResult
        return true
      }
    })
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menus
 */
export function filterAsyncRoutes(routes, menus) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, menus)
    }
    if ((tmp.children && tmp.children.length > 0) || hasPermission(menus, tmp)) {
      res.push(tmp)
    }
  })
  return res.sort(function(a, b) {
    const x = a.meta.sorting
    const y = b.meta.sorting
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, info) {
    return new Promise(resolve => {
      const { roles, menus } = info
      let accessedRoutes = []
      if (menus && menus.length > 0) {
        if (enable_super_admin && roles.includes(super_admin_name)) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
        }
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

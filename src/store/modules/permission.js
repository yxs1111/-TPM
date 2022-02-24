/*
 * @Description: 
 * @Date: 2021-09-02 13:27:44
 * @LastEditTime: 2022-02-24 12:41:43
 */
import { asyncRoutes, constantRoutes } from '@/router'
import  common  from "@/router/routers/common.js";
import Layout from '@/layout/index'
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
      //父级加sort,异常分析报告
      hasPermission(menus, tmp)
      tmp.children = filterAsyncRoutes(tmp.children, menus)
    }
    if ((tmp.children && tmp.children.length > 0) || hasPermission(menus, tmp)) {
      res.push(tmp)
    }
  })
  const list=res.sort(function(a, b) {
    const x = a.meta.sorting
    const y = b.meta.sorting
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
  return list
  
}

const state = {
  routes: [],
  addRoutes: [],
  common:common,
}

const mutations = {
  SET_ROUTES: (state, routes) => {
  
    
    state.addRoutes = routes
    // routes.unshift({
    //   path: '/',
    //   component: Layout,
    //   redirect: '/dashboard',
    //   children: [{
    //     path: 'dashboard',
    //     name: 'Dashboard',
    //     component: () => import('@/views/common/dashboard/index'),
    //     meta: { title: '首页', icon: 'dashboard' }
    //   }]
    // },)
    state.routes = constantRoutes.concat(routes)
    // state.routes = routes.concat(constantRoutes)
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

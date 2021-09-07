import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import meta from '@/router/routers/meta'
import base from '@/router/routers/base'
import common from '@/router/routers/common'
import system from '@/router/routers/system'
import sample from '@/router/routers/sample'
import activiti from '@/router/routers/activiti'
import store from "@/store";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  ...common,
  //...sample,
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  //...system(),
  ...activiti(),
  //...meta,
  //...base,
  // 404 page must be placed at the end !!!
  { path: '*', code: '404', redirect: '/dashboard', meta: { title: '首页', icon: 'dashboard' }, hidden: true }
  // { path: '*', code: '404', redirect: '/404', meta: {}, hidden: true }
]

const createRouter = () => new Router({
  base: process.env.VUE_APP_BASE_PATH,
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
router.beforeEach((to,from,next)=>{
  if(to.name=='Dashboard'||from.name=='Dashboard'){
    store.commit('app/CHANGE_HOMEPATH',to.name)
  }
  next();
})
export default router

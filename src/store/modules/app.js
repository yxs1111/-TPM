/*
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-11-16 15:48:42
 */
import { getLanguage } from '@/lang/index'
import local_db from '@/utils/local-db'

const state = {
  sidebar: {
    opened: local_db.get('sidebarStatus') ? !!+local_db.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  homePath:'',
  language: getLanguage(),
  device: 'desktop',
  isBreadcrumb:local_db.get('isBreadcrumb'), //面包屑的显示与隐藏
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      local_db.set('sidebarStatus', 1)
    } else {
      local_db.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    local_db.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  //隐藏面包屑
  HIDE_BREADCRUMB() {
    state.isBreadcrumb=false
    local_db.set('isBreadcrumb', 0)
  },
  OPEN_BREADCRUMB() {
    state.isBreadcrumb=true
    local_db.set('isBreadcrumb', 1)
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    local_db.set('language', language)
  },
  CHANGE_HOMEPATH(state,v){
    state.homePath = v
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  hideBreadcrumb({ commit }) {
    commit('HIDE_BREADCRUMB')
  },
  openBreadCrumb({commit}) {
    commit('OPEN_BREADCRUMB')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

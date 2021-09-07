import taskApi from '@/api/activiti/taskApi'
const task = {
  namespaced: true,
  state: {
    queryParams: {},
    tableData: [],
    taskSelected: {},
    searchLoading: false,
    loginUser: ''
  },
  mutations: {
    setTableData(state, data) {
      state.tableData = data
    },
    openLoading: function(state) {
      state.searchLoading = true
    },
    closeLoading: function(state) {
      state.searchLoading = false
    },
    resetQueryParam: function(state, queryParam) {
      state.queryParams = queryParam
    },
    unSelectTask: function(state) {
      state.taskSelected = {}
    },
    selectTask: function(state, task) {
      state.taskSelected = task
    },
    setLoginUser: function(state, loginUser) {
      state.loginUser = loginUser
      state.queryParams.assignee = loginUser
    }
  },
  actions: {
    // 重置
    reset: function({ commit, dispatch, state }) {
      commit('resetQueryParam', {
        start: 0,
        size: 10,
        total: null,
        description: '',
        key: '',
        name: '',
        assignee: state.loginUser
      })
      dispatch('pageList')
    },
    pageList({ state, commit }) {
      commit('openLoading')
      taskApi.pageList(state.queryParams).then(res => {
        commit('closeLoading')
        if (res.code === 1000) {
          commit('setTableData', res.data.records)
          state.queryParams.total = res.data.total
        }
      })
    },
    complete: ({ state, dispatch }) => {
      taskApi.complete(state.taskSelected).then(res => {
        if (res.code === 1000) {
          dispatch('pageList')
        }
      })
    }
  }
}
export default task

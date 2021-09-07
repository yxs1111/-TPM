import processApi from '@/api/activiti/processApi'
import { Message } from 'element-ui'
const process = {
  namespaced: true,
  state: {
    queryParams: {},
    tableData: [],
    processSelected: {},
    loading: false
  },
  mutations: {
    setTableData(state, data) {
      state.tableData = data
    },
    openLoading: function(state) {
      state.loading = true
    },
    closeLoading: function(state) {
      state.loading = false
    },
    resetQueryParam: function(state) {
      state.queryParams = {
        current: 1,
        size: 10,
        total: 0,
        description: '',
        key: '',
        name: ''
      }
    },
    // eslint-disable-next-line no-shadow
    selectProcess: function(state, process) {
      state.processSelected = process
    },
    unSelectProcess: function(state) {
      state.processSelected = {}
    }
  },
  actions: {
    suspendProcess: function({ dispatch, state, commit }, row) {
      commit('openLoading')
      processApi.suspendProcess(row).then(res => {
        commit('closeLoading')
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '暂停成功'
          })
        }
        dispatch('pageList')
      })
    },
    // 重置
    reset: function({ commit, dispatch }) {
      commit('resetQueryParam')
      dispatch('pageList')
    },
    pageList({ state, commit }) {
      commit('openLoading')
      processApi.pageList(state.queryParams).then(res => {
        commit('closeLoading')
        if (res.code === 1000) {
          commit('setTableData', res.data.records)
          state.queryParams.total = res.data.total
        }
      })
    },
    rowSelected({ commit }, currentRow) {
      commit('selectProcess', currentRow)
    },
    search: ({ dispatch }) => {
      dispatch('pageList')
    },
    activateProcess: function({ state, dispatch, commit }, row) {
      commit('openLoading')
      processApi.activateProcess(row).then(res => {
        commit('closeLoading')
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '启用成功'
          })
        }
        dispatch('pageList')
      })
    },
    startProcess: function({ state, dispatch }, row) {
      processApi.startProcess({
        processDefinitionId: row.id,
        businessKey: '模型业务Key'
      }).then(res => {
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '启用成功'
          })
        }
        dispatch('pageList')
      })
    }
  }
}
export default process

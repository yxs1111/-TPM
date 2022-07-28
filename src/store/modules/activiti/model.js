import { Message } from 'element-ui'
import modelApi from '@/api/activiti/modelApi'
const model = {
  namespaced: true,
  state: {
    loading: false,
    tableLoading: false,
    modelSelected: {},
    modelData: {},
    queryParams: {
      name: '',
      key: '',
      category: '',
      current: 0,
      size: 100,
      total: null
    },
    tableData: []
  },
  mutations: {
    // eslint-disable-next-line no-shadow
    selectModel: function(state, model) {
      state.modelSelected = model
    },
    unSelectModel: function(state) {
      state.modelSelected = {}
    },
    openLoading: function(state) {
      state.loading = true
    },
    closeLoading: function(state) {
      state.loading = false
    },
    openTableLoading: function(state) {
      state.tableLoading = true
    },
    closeTableLoading: function(state) {
      state.tableLoading = false
    },
    setTableData: function(state, obj) {
      state.tableData = obj
    }
  },
  actions: {
    reset: function({ state, dispatch }) {
      state.queryParams = {
        start: 1,
        size: 10,
        total: 0,
        description: '',
        key: '',
        name: ''
      }
      dispatch('pageList')
    },
    // eslint-disable-next-line no-unused-vars
    pageList({ state, commit }) {
      commit('openTableLoading')
      modelApi.pageList(state.queryParams).then((res) => {
        commit('closeTableLoading')
        if (res.code === 1000) {
          commit('setTableData', res.data.records)
          state.queryParams.total = res.data.total
        }
      })
    },
    rowSelected({ state }, currentRow) {
      state.modelSelected = currentRow
    },
    async saveModel({ dispatch, commit }, param) {
      commit('openLoading')
      const res = await modelApi.createModelAndSourceExtra(param)
      commit('closeLoading')
      if (res.code === 1000) {
        Message.success({
          message: '新增成功',
          duration: 1000
        })
        return res.data
      } else {
        return null
      }
    },
    deleteModel({ dispatch, state, commit }, row) {
      modelApi.deleteModel(row).then(res => {
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '删除成功'
          })
          dispatch('pageList')
        }
      })
    },
    publishModelApi({ state, commit, dispatch }, _this) {
      if (!state.modelSelected.id) {
        Message.error({
          type: 'error',
          message: '请点选需要发布的模型'
        })
      } else {
        modelApi.publishModel(state.modelSelected).then(res => {
          if (res.code === 1000) {
            _this.$message({
              type: 'success',
              message: '发布成功'
            })
            dispatch('pageList')
          }
        })
      }
    },
    updateModel({ dispatch, state, commit }, modelData) {
      commit('openLoading')
      modelApi.updateModel(modelData).then(res => {
        commit('closeLoading')
        if (res.code === 1000) {
          Message.success({
            message: '更新成功',
            duration: 1000
          })
          dispatch('pageList')
        }
      })
    }
  }
}
export default model

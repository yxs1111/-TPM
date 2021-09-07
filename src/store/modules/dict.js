import { getDictInfoByType } from '@/api/meta/dict-info-api'

const state = { }
const getters = {
  getNameByCode: state => (dictArr, code, notFindValue) => {
    if (dictArr instanceof Array) {
      const item = dictArr.find(o => o.code === code) || { name: notFindValue }
      return item.name
    }
    return ''
  }
}
const actions = {
  getDictInfoByType({ commit }, typeCode) {
    return new Promise((resolve, reject) => {
      getDictInfoByType(typeCode).then(({ data }) => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
const mutations = { }

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}

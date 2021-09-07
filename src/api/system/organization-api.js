import request from '@/utils/request'

export default {
  url: '/auth/organization',
  getAll() {
    return request({
      url: this.url + '/getAll',
      method: 'get'
    })
  },
  listAll() {
    return request({
      url: this.url + '/listAll',
      method: 'get'
    })
  },
  // 分页查询组织内用户
  pageBindOrgMembers(params) {
    return request({
      url: this.url + '/pageBindOrgMembers',
      method: 'get',
      params: params
    })
  }
}

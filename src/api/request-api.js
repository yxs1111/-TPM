// 公共权限的基本信息前后台统一配置
import request from '@/utils/request'

const commonRequest = {
  getPage: {
    url: '/getPage',
    method: 'get'
  },
  get: {
    url: '/get',
    method: 'get'
  },
  save: {
    url: '/insert',
    method: 'post'
  },
  update: {
    url: '/update',
    method: 'put'
  },
  remove: {
    url: '/delete',
    method: 'delete'
  },
  import: {
    url: '/import',
    method: 'post'
  },
  export: {
    url: '/export',
    method: 'get'
  }
}

export default {
  getPage(url, params) {
    return request({
      url: url + commonRequest.getPage.url,
      method: commonRequest.getPage.method,
      params: params
    })
  },
  get(url, params) {
    return request({
      url: url + commonRequest.get.url,
      method: commonRequest.get.method,
      params: params
    })
  },
  save(url, params) {
    return request({
      url: url + commonRequest.save.url,
      method: commonRequest.save.method,
      data: params
    })
  },
  update(url, params) {
    return request({
      url: url + commonRequest.update.url,
      method: commonRequest.update.method,
      data: params
    })
  },
  remove(url, params) {
    return request({
      url: url + commonRequest.remove.url,
      method: commonRequest.remove.method,
      data: params
    })
  },
  imp(url, params) {
    return request({
      url: url + commonRequest.import.url,
      method: commonRequest.import.method,
      data: params
    })
  },
  exp(url, params) {
    return request({
      url: url + commonRequest.export.url,
      method: commonRequest.export.method,
      data: params
    })
  },
  request_get(url, params) {
    return request({
      url: url,
      method: 'get',
      params: params
    })
  },
  request_post(url, params) {
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  request_put(url, params) {
    return request({
      url: url,
      method: 'put',
      data: params
    })
  },
  request_delete(url, params) {
    return request({
      url: url,
      method: 'delete',
      data: params
    })
  }
}

/*
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-11-23 14:21:20
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  url: '/auth/role',
  listAllOs() {
    return requestApi.request_get(this.url + '/listAllOs', {})
  },
  getAllMenu(params) {
    return requestApi.request_get(this.url + '/getAllMenu', params)
  },
  getPermissionPage(params) {
    return requestApi.request_get(this.url + '/getPermissionPage', params)
  },
  bindPermissions(params) {
    return requestApi.request_put(this.url + '/bindPermissions', params)
  },
  getPermissionCodes(params) {
    return requestApi.request_get(this.url + '/getPermissionCodes', params)
  },
  getAllRole() {
    return request({
      url: this.url + '/getAllRole',
      method: 'get'
    })
  },
  roleUrl:'auth/authRoleDataPermission',
  //角色数据权限--KA权限
  getKAList(params) {
    return requestApi.request_get(this.roleUrl + '/getKAList', params)
  },
  //角色数据权限--MinePackage权限
  getMinePackage(params) {
    return requestApi.request_get(this.roleUrl + '/getMinePackage', params)
  },
  //角色数据权限--FieldSales权限
  getFieldSales(params) {
    return requestApi.request_get('/auth/organization/organization', params)
  },
  //角色数据权限--已绑定权限
  getDefaultRolePermissions(params) {
    return requestApi.request_get(this.roleUrl + '/getDataPermissionList', params)
  },
  //角色数据权限--绑定权限
  bindDataPermissions(params) {
    return requestApi.request_put(this.roleUrl + '/bindDataPermissions', params)
  },
}

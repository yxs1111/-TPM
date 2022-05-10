/*
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2022-05-05 14:50:20
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
  listAllRole() {
    return request({
      url: this.url + '/all/list',
      method: 'get'
    })
  },
  roleUrl:'/auth/userRoleDataPermission',
  //角色数据权限--KA权限 
  getKAList(params) {
    return requestApi.request_get(this.roleUrl + '/getKALists', params)
  },
  //角色数据权限--MinePackage权限
  getMinePackage(params) {
    return requestApi.request_get(this.roleUrl + '/getCostItemList', params)
  },
  //角色数据权限--FieldSales权限
  getFieldSales(params) {
    return requestApi.request_get(this.roleUrl + '/getFieldSalesLists', params)
  },
  //角色数据权限--已绑定权限
  getDefaultRolePermissions(params) {
    return requestApi.request_get(this.roleUrl + '/getUserRoleDataPermission', params)
  },
  //角色数据权限--绑定权限
  bindDataPermissions(params) {
    return requestApi.request_post(this.roleUrl + '/bindUserDataPermissions', params)
  },

  
}

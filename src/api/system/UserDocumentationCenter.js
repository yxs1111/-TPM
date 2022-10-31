/*
 * @Author: your name
 * @Date: 2021-10-27 08:56:27
 * @LastEditTime: 2022-08-29 11:58:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \april-ui\src\api\masterData\masterData.js
 */
import requestApi from '@/api/request-api'
import request from '@/utils/request'

export default {
  //上传
  uploadFile(data) {
    return request({
      url: '/mdm/mdUserDocument/uploadFile',
      method: 'post',
      data,
    })
  },
  //删除
  delete(data) {
    return request({
      url: '/mdm/mdUserDocument/delete',
      method: 'delete',
      data,
    })
  },
  //列表
  getMdDataInterface(params) {
    return requestApi.request_get('/mdm/mdUserDocument/getPage', params)
  },
}

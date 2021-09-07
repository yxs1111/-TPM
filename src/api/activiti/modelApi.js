import Http from '@/api/request-api'
import request from '@/utils/request'
const baseUrl = '/bpm'
export default {
  /**
   * 获取租户下的所有分类
   * @param param
   * @returns {AxiosPromise}
   */
  getCategoryOfModel: param => {
    return Http.request_get(`${baseUrl}/repository/models/category/list`, param)
  },
  /**
   * 模型分页
   * @param param
   * @returns {AxiosPromise}
   */
  pageList: param => {
    return Http.request_post(`${baseUrl}/repository/models/pageList`, param)
  },
  /**
   * 获取分类下的通用工具
   * @param param
   * @returns {AxiosPromise}
   */
  getPaletteByCategoryId: param => {
    return Http.request_get(`${baseUrl}/activiti/extension/palette/list`, param)
  },
  /**
   * 保存模型设计
   * @param param
   * @returns {AxiosPromise}
   */
  saveModel: param => {
    return request.post(`${baseUrl}/repository/model/sourceExtra/add/${param.id}`, param, {
      headers: {
        'No-Trim': true
      }
    })
  },
  /**
   * 获取模型设计
   * @param param
   * @returns {AxiosPromise}
   */
  getModel: param => {
    return Http.request_get(`${baseUrl}/repository/model/get/${param.id}`)
  },
  /**
   * 创建模型和模型扩展信息
   * @param param
   * @returns {AxiosPromise}
   */
  createModelAndSourceExtra: param => {
    return request.post(`${baseUrl}/repository/model/createModelAndSourceExtra`, param, {
      headers: {
        'No-Trim': true
      }
    })
  },
  /**
   * 删除模型
   * @param param
   * @returns {AxiosPromise}
   */
  deleteModel: param => {
    return Http.request_delete(`${baseUrl}/repository/model/delete/${param.id}`)
  },
  /**
   * 发布模型
   * @param param
   * @returns {AxiosPromise}
   */
  publishModel: param => {
    return Http.request_post(`${baseUrl}/repository/model/publish/${param.id}`)
  },
  /**
   * 更新模型
   * @param param
   * @returns {AxiosPromise}
   */
  updateModel: param => {
    return Http.request_put(`${baseUrl}/repository/model/update/${param.id}`, param)
  },
  /**
   * 上传模型的Excel
   * @param param
   * @param config
   * @returns {Promise<AxiosResponse<any>>}
   */
  uploadExcelOfModel: (param) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return request.post(`${baseUrl}/repository/model/upload`, param, config)
  }
}

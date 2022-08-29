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

  /**
   * @description: 产品信息--查询
   * @param {*} params
   * @return {*}
   */
  getPageMdProduct(params) {
    return requestApi.request_get('/mdm/mdProduct/getPage', params)
  },
  // 产品导出
  exportProduct(params) {
    return request({
      url: '/mdm/mdProduct/exportProduct',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  /**
   * 产品信息--添加
   * @param {*} params
   * @returns
   */
  insertMdProduct(params) {
    return requestApi.request_post('/mdm/mdProduct/insert', params)
  },
  /**
   * 产品信息--更新
   * @param {*} params
   * @returns
   */
  updateMdProduct(params) {
    return requestApi.request_put('/mdm/mdProduct/update', params)
  },
  /**
   * @description: 产品信息--删除
   * @param {*} params
   * @return {*}
   */
  deleteMdProduct(params) {
    return requestApi.request_delete('/mdm/mdProduct/delete', params)
  },
  // 价格档位
  getPageMdPriceGear(params) {
    return requestApi.request_get('/mdm/mdPriceGear/getPage', params)
  },
  insertMdPriceGear(params) {
    return requestApi.request_post('/mdm/mdPriceGear/insert', params)
  },
  updateMdPriceGear(params) {
    return requestApi.request_put('/mdm/mdPriceGear/update', params)
  },
  deleteMdPriceGear(params) {
    return requestApi.request_delete('/mdm/mdPriceGear/delete', params)
  },
  importPriceGear(params) {
    return requestApi.request_post('/mdm/mdPriceGear/importPriceGear', params)
  },
  exportPriceGear(params) {
    return request({
      url: 'mdm/mdPriceGear/exportPriceGear',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  //下载模板
  exportTemplate(params) {
    return request({
      url: 'mdm/mdPriceGear/exportTemplate',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  //检测数据
  importCheck(params) {
    return requestApi.request_post('/mdm/mdPriceGear/importCheck', params)
  },
  //导出异常信息
  exportPriceGearError(params) {
    return request({
      url: 'mdm/mdPriceGear/exportPriceGearError',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },

  // 渠道列表
  /**
   * @description: 渠道列表
   * @param {*} params
   * @return {*}
   */
  getPageMdChannelList(params) {
    return requestApi.request_get('/mdm/mdChannel/getMdChannelList', params)
  },
  /**
   * @description: 产品列表List
   * @param {*} params
   * @return {*}
   */
  getPageMdProductList(params) {
    return requestApi.request_get('/mdm/mdProduct/getMdProductList', params)
  },
  // 客户信息
  getPageMdCustomer(params) {
    return requestApi.request_get('/mdm/mdCustomer/getPage', params)
  },
  insertMdCustomer(params) {
    return requestApi.request_post('/mdm/mdCustomer/insert', params)
  },
  updateMdCustomer(params) {
    return requestApi.request_put('/mdm/mdCustomer/update', params)
  },
  deleteMdCustomer(params) {
    return requestApi.request_delete('/mdm/mdCustomer/delete', params)
  },
  // 导出客户
  exportCustomer(params) {
    return request({
      url: '/mdm/mdCustomer/exportCustomer',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 渠道信息
  getPageMdChannel(params) {
    return requestApi.request_get('/mdm/mdChannel/getPage', params)
  },
  insertMdChannel(params) {
    return requestApi.request_post('/mdm/mdChannel/insert', params)
  },
  updateMdChannel(params) {
    return requestApi.request_put('/mdm/mdChannel/update', params)
  },
  deleteMdChannel(params) {
    return requestApi.request_delete('/mdm/mdChannel/delete', params)
  },
  //渠道导出
  exportChannel(params) {
    return request({
      url: '/mdm/mdChannel/exportChannel',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 经销商信息
  getPageMdDistributor(params) {
    return requestApi.request_get('/mdm/mdDistributor/getPage', params)
  },
  insertMdDistributor(params) {
    return requestApi.request_post('/mdm/mdDistributor/insert', params)
  },
  updateMdDistributor(params) {
    return requestApi.request_put('/mdm/mdDistributor/update', params)
  },
  deleteMdDistributor(params) {
    return requestApi.request_delete('/mdm/mdDistributor/delete', params)
  },
  //经销商导出
  exportDistributor(params) {
    return request({
      url: '/mdm/mdDistributor/exportDistributor',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 费用科目
  getPageMdCostType(params) {
    return requestApi.request_get('/mdm/mdCostType/getPage', params)
  },
  insertMdCostType(params) {
    return requestApi.request_post('/mdm/mdCostType/insert', params)
  },
  updateMdCostType(params) {
    return requestApi.request_put('/mdm/mdCostType/update', params)
  },
  deleteMdCostType(params) {
    return requestApi.request_delete('/mdm/mdCostType/delete', params)
  },
  getCostTypeList(params) {
    return requestApi.request_get('/mdm/mdCostType/getCostTypeList', params)
  },
  //导出费用类型
  exportCostType(params) {
    return request({
      url: '/mdm/mdCostType/exportCostType',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 品牌信息
  getPageMdBrand(params) {
    return requestApi.request_get('/mdm/mdBrand/getPage', params)
  },
  insertMdBrand(params) {
    return requestApi.request_post('/mdm/mdBrand/insert', params)
  },
  updateMdBrand(params) {
    return requestApi.request_put('/mdm/mdBrand/updatebrand', params)
  },
  deleteMdBrand(params) {
    return requestApi.request_put('/mdm/mdBrand/deleteDate', params)
  },
  //导出品牌
  exportBrand(params) {
    return request({
      url: '/mdm/mdBrand/exportBrand',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 门店信息
  getPageMdStore(params) {
    return requestApi.request_get('/mdm/mdStore/getPage', params)
  },
  insertMdStore(params) {
    return requestApi.request_post('/mdm/mdStore/insert', params)
  },
  updateMdStore(params) {
    return requestApi.request_put('/mdm/mdStore/update', params)
  },
  deleteMdStore(params) {
    return requestApi.request_delete('/mdm/mdStore/delete', params)
  },
  //门店导出
  exportStore(params) {
    return request({
      url: '/mdm/mdStore/exportStore',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // 规则控制---检验规则
  getPageByDto(params) {
    return requestApi.request_get('/mdm/mdExceptionRule/getPageByDto', params)
  },
  // getCostTypeList(params) {
  //   return requestApi.request_get('/mdm/mdCostType/getCostTypeList', params)
  // },
  getMdChannelList(params) {
    return requestApi.request_get('/mdm/mdChannel/getMdChannelList', params)
  },
  queryYearAndMonth(params) {
    return requestApi.request_get('/mdm/mdExceptionRule/queryYearAndMonth', params)
  },
  saveNewExeRule(params) {
    return requestApi.request_get('/mdm/mdExceptionRule/saveNewExeRule', params)
  },

  // 供应商信息
  getPageMdSupplier(params) {
    return requestApi.request_get('/mdm/mdSupplier/getPage', params)
  },
  insertMdSupplier(params) {
    return requestApi.request_post('/mdm/mdSupplier/insert', params)
  },
  updateMdSupplier(params) {
    return requestApi.request_put('/mdm/mdSupplier/update', params)
  },
  deleteMdSupplier(params) {
    return requestApi.request_post('/mdm/mdSupplier/deleteAll', params)
  },
  checkSupplier(params) {
    return requestApi.request_post('/mdm/mdSupplier/checkSupplier', params)
  },
  //导出错误信息
  exportSupplierEb(params) {
    return request({
      url: 'mdm/mdSupplier/exportSupplierEb',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  importSupplier(params) {
    return requestApi.request_post('/mdm/mdSupplier/importSupplier', params)
  },
  exportSupplier(params) {
    return request({
      url: 'mdm/mdSupplier/exportSupplier',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //下载模板
  exportSupplierTemplate(params) {
    return request({
      url: 'mdm/mdSupplier/exportSupplierTemplate',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //客户组信息
  getPageMdCustomerGroup(params) {
    return requestApi.request_get('/mdm/mdCustomerGroup/getPage', params)
  },
  insertMdCustomerGroup(params) {
    return requestApi.request_post('/mdm/mdCustomerGroup/insert', params)
  },
  updateMdCustomerGroup(params) {
    return requestApi.request_put('/mdm/mdCustomerGroup/update', params)
  },
  deleteMdCustomerGroup(params) {
    return requestApi.request_delete('/mdm/mdCustomerGroup/delete', params)
  },
  // 机制池
  getPageByRequestConfig(params) {
    return requestApi.request_get('/mdm/mdCdmConfig/getPageByRequest', params)
  },
  insertDataConfig(params) {
    return requestApi.request_post('/mdm/mdCdmConfig/insertData', params)
  },
  updateConfig(params) {
    return requestApi.request_put('/mdm/mdCdmConfig/update', params)
  },
  deleteConfig(params) {
    return requestApi.request_delete('/mdm/mdCdmConfig/deleteDate', params)
  },
  //价促计算维护
  getPageSaleComputeKeep(params) {
    return requestApi.request_get('/mdm/mdPricepromotionCalculationandmaintenance/getPageByDto', params)
  },
  DeleteSaleComputeKeep(params) {
    return requestApi.request_delete('/mdm/mdPricepromotionCalculationandmaintenance/hasAuthlogicDeleteBatch', params)
  },
  importSaleComputeKeep(params) {
    return requestApi.request_post('/mdm/mdPricepromotionCalculationandmaintenance/importData', params)
  },
  exportSaleComputeKeep(params) {
    return request({
      url: 'mdm/mdPricepromotionCalculationandmaintenance/exportToExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
    // return requestApi.request_post('/mdm/mdPricepromotionCalculationandmaintenance/exportToExcel', params)
  },
  SaleComputeKeepTemplateDownload(params) {
    return request({
      url: 'mdm/mdPricepromotionCalculationandmaintenance/templateDownload',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
    //return requestApi.request_get('/mdm/mdPricepromotionCalculationandmaintenance/templateDownload', params)
  },
  // NKAEC 导入测试
  importNkaRawData(params) {
    return requestApi.request_post('/cityplan/importData/importNkaRawData', params)
  },
  importEcRawData(params) {
    return requestApi.request_post('/cityplan/importData/importEcRawData', params)
  },
  importNkaRawDataGuideline(params) {
    return requestApi.request_post('/cityplan/importData/importNkaRawDataGuideline', params)
  },
  importEcRawDataGuideline(params) {
    return requestApi.request_post('/cityplan/importData/importEcRawDataGuideline', params)
  },
  // 机制池
  downloadExcelSyspool() {
    return request({
      url: '/mdm/mdCdmConfig/downloadExcel',
      method: 'get',
      responseType: 'blob'
    })
  },
  importExcelSyspool(params) {
    return request({
      url: '/mdm/mdCdmConfig/importExcel',
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  exportExcelSyspool(data) {
    return request({
      url: '/mdm/mdCdmConfig/exportExcel',
      method: 'get',
      params: data,
      responseType: 'blob'
    })
  },
  // 拆分规则
  getPageByRequestSplitRule(params) {
    return requestApi.request_get('/mdm/mdSplitRuleConfig/getPageByRequest', params)
  },
  queryParentMinePackage(params) {
    return requestApi.request_get('/mdm/mdSplitRuleConfig/queryParentMinePackage', params)
  },
  insertSplitRule(params) {
    return requestApi.request_post('/mdm/mdSplitRuleConfig/insertData', params)
  },
  updateSplitRule(params) {
    return requestApi.request_put('/mdm/mdSplitRuleConfig/updateData', params)
  },
  deleteSplitRule(params) {
    return requestApi.request_delete('/mdm/mdSplitRuleConfig/delete', params)
  },
  exportExcelSplitRule(params) {
    return request({
      url: '/mdm/mdSplitRuleConfig/exportExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // NKAEC
  getPageByDtoNKA(params) {
    return requestApi.request_get('/cityplan/importData/nkaRawData/getPageByDto', params)
  },
  getPageByDtoEC(params) {
    return requestApi.request_get('/cityplan/importData/ecRawData/getPageByDto', params)
  },
  getPageByDtoNKAL(params) {
    return requestApi.request_get('/cityplan/importData/nkaRawDataGuideline/getPageByDto', params)
  },
  getPageByDtoECL(params) {
    return requestApi.request_get('/cityplan/importData/ecRawDataGuideline/getPageByDto', params)
  },
  // 检验规则
  // 保存
  updateRuleSave(params) {
    return requestApi.request_post('/mdm/mdExceptionRule/updateRule', params)
  },
  // 导出
  excportRuleSave(params) {
    return request({
      url: '/mdm/mdExceptionRule/excport',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // 销售架构
  getOrgPage(params) {
    return requestApi.request_get('/auth/organization/getOrgPage', params)
  },
  //导出销售架构
  exportOrg(params) {
    return request({
      url: '/mdm/mdCustomerDistributor/exportOrg',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // WBS-customer
  getPageByWbs(params) {
    return requestApi.request_get('/cityplan/mdCustomerWbs/getPage', params)
  },
  insertWbs(params) {
    return requestApi.request_post('/cityplan/mdCustomerWbs/insert', params)
  },
  updateWbs(params) {
    return requestApi.request_put('/cityplan/mdCustomerWbs/update', params)
  },
  deleteWbs(params) {
    return requestApi.request_delete('/cityplan/mdCustomerWbs/delete', params)
  },
  //导出
  exportWbs(params) {
    return request({
      url: '/cityplan/mdCustomerWbs/exportToExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  // io
  getPageByIo(params) {
    return requestApi.request_get('/cityplan/mdOrganizationIo/getPage', params)
  },
  insertIo(params) {
    return requestApi.request_post('/cityplan/mdOrganizationIo/insert', params)
  },
  updateIo(params) {
    return requestApi.request_put('/cityplan/mdOrganizationIo/update', params)
  },
  deleteIo(params) {
    return requestApi.request_delete('/cityplan/mdOrganizationIo/delete', params)
  },
  //导出
  exportIo(params) {
    return request({
      url: '/cityplan/mdOrganizationIo/exportToExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  //监控管理
  getMdDataInterface(params) {
    return requestApi.request_get('/mdm/mdDataInterface/page', params)
  },
  //接口名称下拉筛选
  getInterfaceList(params) {
    return requestApi.request_get('/mdm/mdDataInterface/getInterfaceList', params)
  },
  //导出监控管理
  exportMdDataInterface(data) {
    return request({
      url: '/mdm/mdDataInterface/exportMdData',
      method: 'post',
      data: data,
      responseType: 'blob'
    })
  },
  // WBSCodeEntity
  getPageEntityWbs(params) {
    return requestApi.request_get('/cityplan/mdEntityWbs/getPage', params)
  },
  insertEntityWbs(params) {
    return requestApi.request_post('/cityplan/mdEntityWbs/insert', params)
  },
  updateEntityWbs(params) {
    return requestApi.request_put('/cityplan/mdEntityWbs/update', params)
  },
  deleteEntityWbs(params) {
    return requestApi.request_delete('/cityplan/mdEntityWbs/deleteByID', params)
  },
  //导出
  exportEntityWbs(params) {
    return request({
      url: '/cityplan/mdEntityWbs/exportExcel',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // WBSCodeYear
  getPageYearWbs(params) {
    return requestApi.request_get('/cityplan/mdYearWbs/getPage', params)
  },
  // WBSCodeBrand
  getPageBrandWbs(params) {
    return requestApi.request_get('/cityplan/mdBrandWbs/getPage', params)
  },
  insertBrandWbs(params) {
    return requestApi.request_post('/cityplan/mdBrandWbs/insert', params)
  },
  updateBrandWbs(params) {
    return requestApi.request_put('/cityplan/mdBrandWbs/update', params)
  },
  deleteBrandWbs(params) {
    return requestApi.request_delete('/cityplan/mdBrandWbs/deleteByID', params)
  },
  //导出
  exportBrandWbs(params) {
    return request({
      url: '/cityplan/mdBrandWbs/exportExcel',
      method: 'post',
      data: params,
      responseType: 'blob'
    })
  },
  // WBS Code - Department
  getPageDeptWbs(params) {
    return requestApi.request_get('/cityplan/mdDeptWbs/getPage', params)
  },
  insertDeptWbs(params) {
    return requestApi.request_post('/cityplan/mdDeptWbs/insert', params)
  },
  updateDeptWbs(params) {
    return requestApi.request_put('/cityplan/mdDeptWbs/update', params)
  },
  deleteDeptWbs(params) {
    return requestApi.request_delete('/cityplan/mdDeptWbs/deleteByID', params)
  },
  //导出
  exportDeptWbs(params) {
    return request({
      url: '/cityplan/mdDeptWbs/exportExcel',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },

  // contract Item
  getPageContractItem(params) {
    return requestApi.request_get('/mdm/mdContractItem/getPage', params)
  },
  insertContractItem(params) {
    return requestApi.request_post('/mdm/mdContractItem/insert', params)
  },
  updateContractItem(params) {
    return requestApi.request_put('/mdm/mdContractItem/update', params)
  },
  deleteContractItem(params) {
    return requestApi.request_post('/mdm/mdContractItem/deleteByIds', params)
  },
  //导出
  exportContractItem(params) {
    return request({
      url: '/mdm/mdContractItem/exportContractItem',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  importContractItem(params) {
    return requestApi.request_post('/mdm/mdContractItem/importContractItem', params)
  },
  downloadContractItemTemplate(params) {
    return request({
      url: '/mdm/mdContractItem/exportContractItemTemplate',
      method: 'post',
      params: params,
      responseType: 'blob'
    })
  },
  //匹配关系
  getMatchingRelationList(params) {
    return requestApi.request_get('/mdm/mdOrganizationSupplier/getPage', params)
  },
  getMatchingRelationMinePackage(params) {
    return requestApi.request_get('/mdm/mdOrganizationSupplier/getMinePackage', params)
  },
  getMatchingRelationZone(params) {
    return requestApi.request_get('/mdm/mdOrganizationSupplier/getZone', params)
  },
  getMatchingRelationRegion(params) {
    return requestApi.request_get('/mdm/mdOrganizationSupplier/getRegion', params)
  },
  getMatchingRelationSupplier(params) {
    return requestApi.request_get('/mdm/mdOrganizationSupplier/getSupplier', params)
  },
  MatchingRelationDownloadExcel(params) {
    return request({
      url: '/mdm/mdOrganizationSupplier/downloadExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
    
  },
  MatchingRelationImportExcel(params) {
    return requestApi.request_post('/mdm/mdOrganizationSupplier/importExcel', params)
  },
  MatchingRelationExportExcel(params) {
    return request({
      url: '/mdm/mdOrganizationSupplier/exportExcel',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  addMatchingRelation(params) {
    return requestApi.request_post('/mdm/mdOrganizationSupplier/insert', params)
  },
  deleteMatchingRelation(params) {
    return requestApi.request_delete('/mdm/mdOrganizationSupplier/delete', params)
  },
  //package & 部门匹配关系
  getPagePdMatchingRelationship(params) {
    return requestApi.request_get('/mdm/mdDeptPackageMatching/getPage', params)
  },
  //新增 package & 部门匹配关系
  addPdMatchingRelationship(params) {
    return requestApi.request_post('/mdm/mdDeptPackageMatching/addData', params)
  },
  updatePdMatchingRelationship(params) {
    return requestApi.request_put('/mdm/mdDeptPackageMatching/updateData', params)
  },
  exportPdMatchingRelationship(params) {
    return request({
      url: '/mdm/mdDeptPackageMatching/exportData',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  deletePdMatchingRelationship(params) {
    return requestApi.request_post('/mdm/mdDeptPackageMatching/deleteByIds', params)
  },
  //新增时 获取相同的costType
  getExistingData(params) {
    return requestApi.request_get('/mdm/mdDeptPackageMatching/getExistingData', params)
  },
  //新增时 获取部门id
  getDepartmentId(params) {
    return requestApi.request_get('/mdm/mdDeptPackageMatching/getDepartmentId', params)
  },
  //Display Item 
  getDisplayItem(params) {
    return requestApi.request_get("/mdm/mdDisplayItem/getDisplayItemPage",params)
  },
  addDisplayItem(params) {
    return requestApi.request_post("/mdm/mdDisplayItem/saveData",params)
  },
  updateDisplayItem(params) {
    return requestApi.request_post("/mdm/mdDisplayItem/updateData",params)
  },
  deleteDisplayItem(params) {
    return requestApi.request_post("/mdm/mdDisplayItem/deleteByIds",params)
  },
  getCostItemList(params) {
    return requestApi.request_get("/mdm/mdDisplayItem/getCostItemList",params)
  },
  exportDisplayItem(params) {
    return request({
      url: '/mdm/mdDisplayItem/exportData',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
    return requestApi.request_get("/mdm/mdDisplayItem/exportData",params)
  },
}

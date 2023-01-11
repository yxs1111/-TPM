// 价格主数据
<template>
  <div class="app-container" style="border-radius:0px;">
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">渠道：</span>
          <el-select v-model="filterObj.channelCode" placeholder="请选择" clearable>
            <el-option v-for="item in channelOptons" :key="item.channelCode" :label="item.channelEsName" :value="item.channelEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">SKU：</span>
          <el-select v-model="filterObj.sku" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in skuOptons" :key="item.productCode+index" :label="item.productEsName" :value="item.productEsName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">机制类型：</span>
          <el-select v-model="filterObj.cdmType" placeholder="请选择" clearable>
            <el-option v-for="item in cdmTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">机制名称：</span>
          <el-input v-model="filterObj.cdmName" placeholder="请输入" clearable />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">Mine package:</span>
          <el-select v-model="filterObj.minePackageCode" clearable placeholder="请选择" class="my-el-select">
            <el-option v-for="item,index in MinePackageList" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">有效至:</span>
          <el-date-picker v-model="filterObj.validDate" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyyMM">
          </el-date-picker>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG"  @click="search" >查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportExcelInfo" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div>
      <el-button type="danger" class="TpmButtonBG" icon="el-icon-delete" size="small" @click="showDeleteDialog" v-permission="permissions['delete']">删除</el-button>
      <!-- <div class="TpmButtonBG" @click="add">
        <img src="../../../assets/images/import.png" alt="">
        <span class="text">导入</span>
      </div> -->
      <!-- <el-button type="primary" icon="el-icon-download" class="TpmButtonBG" @click="mutidel">新增</el-button> -->
      <!-- <el-button type="primary" icon="el-icon-upload2" class="TpmButtonBG" @click="add">新增</el-button> -->
    </div>
    <el-table ref="Tdata" :data="tableData" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" stripe :max-height="maxheight" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column width="150" align="center" prop="channelCode" label="渠道" />
      <el-table-column width="200" align="center" prop="minePackageCode" label="Mine Package" />
      <el-table-column width="150" align="center" prop="sku" label="SKU" />
      <el-table-column width="180" align="center" prop="grepLevel" label="活动级别" />
      <!-- <el-table-column width="180" align="center" prop="sku" label="价格档位描述" /> -->
      <el-table-column width="220" align="center" prop="cdmTypeName" label="机制类型">
        <!-- <template slot-scope="scope">
          {{ typeVSinfo(scope.row.cdmType) }}
        </template> -->
      </el-table-column>
      <el-table-column width="200" align="center" prop="cdmName" label="机制名称" />
      <el-table-column width="280" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createDate==null ? '':scope.row.createDate.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column width="280" align="center" prop="updateBy" label="修改人"> </el-table-column>
      <el-table-column v-slot={row} width="180" align="center" prop="updateDate" label="修改时间">
        {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
      </el-table-column>
      <el-table-column width="150" align="center" prop="validDate" label="有效至">
      </el-table-column>
      <el-table-column width="150" align="center" prop="validStartMonth" label="有效起始月份">
      </el-table-column>
      <el-table-column width="150" align="center" prop="remark" label="备注" />
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <!-- <div style="color:#4192d3;text-align:center;cursor:pointer;" @click="downLoadElxModel">下 载 模 板</div> -->
      <div class="fileInfo ImportContent">
        <div class="fileTitle">模板</div>
        <div class="my-search selectFile" @click="downLoadElxModel">
          <svg-icon icon-class="download_white" />
          <span class="text">下载模板</span>
        </div>
      </div>
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <el-button size="mini" class="my-search selectFile" @click="parsingExcelBtn">选择文件</el-button>
        <input id="fileElem" ref="filElem" type="file" style="display: none" @change="parsingExcel($event)">
        <div v-if="uploadFileName!=''" class="fileName">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon">
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport()">确 认</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
      <div v-if="warningShow" style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert v-for="(item, index) in warningList" :key="index" :title="item.errMsg" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog width="25%" class="my-el-dialog" title="删除" :visible="deleteVisible" @close="closeDeleteDialog">
<!--      <div class="fileInfo ImportContent">-->
<!--        <div class="fileTitle">有效期</div>-->
<!--        <div class="my-search selectFile">-->
<!--          <el-date-picker v-model="deleteObj.yearAndMonth" type="month" placeholder="选择年月" value-format="yyyyMM" format="yyyyMM">-->
<!--          </el-date-picker>-->
<!--        </div>-->
<!--      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
        <el-button @click="closeDeleteDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, getHeightHaveTab } from '@/utils'
import selectAPI from '@/api/selectCommon/selectCommon.js'
import API from '@/api/masterData/masterData.js'
export default {
  name: 'SystemPool',
  directives: { elDragDialog, permission },

  data() {
    return {
      warningList: [],
      warningShow: false,
      event: '',
      uploadFileName: '',
      uploadFile: '',
      input: '',
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        channelCode: '',
        minePackageCode: '',
        sku: '',
        cdmType: '',
        cdmName: '',
        validDate: '',
        yearAndMonth: '',
      },
      dialogAdd: {
        channelCode: '',
        costTypeNumber: '',
        productCode: '',
        remark: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      MinePackageList: [],
      ruleForm: {
        channelCode: '',
        channelCsName: '',
        productCode: '',
        productEsName: '',
        productCsName: '',
        gear: '',
        volMin: '',
        yearAndMonth: '',
        remark: '',
      },
      rules: {
        channelCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      isEditor: '',
      editorId: '',
      checkArr: [], // 批量删除,存放选中
      channelOptons: [],
      skuOptons: [],
      mpOptons: [],
      systemList: [],
      checkedDetail: [],
      cdmTypeOptions: [
        {
          code: 'cdm1',
          name: '打折',
        },
        {
          code: 'cdm2',
          name: '特价',
        },
        {
          code: 'cdm3',
          name: '满减',
        },
      ],
      importVisible: false,
      maxheight: getHeightHaveTab(),
      deleteVisible: false,
      deleteObj: {
        yearAndMonth: '',
      },
    }
  },

  computed: {
    typeVSinfo() {
      return function (type) {
        switch (type) {
          case '1':
            return '打折'
            break
          case '2':
            return '特价'
            break
          case '3':
            return '满减'
            break
          default:
            break
        }
      }
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightHaveTab()
      })()
    }
    this.getTableData()
    this.getMinePackage()
    // 获取下拉框
    this.getQueryChannelSelect()
    this.getQuerySkuSelect()
    // this.getQueryMinePackageSelect()
  },
  methods: {
    getMinePackage() {
      selectAPI.queryMinePackageSelect().then((res) => {
        this.MinePackageList = res.data
      })
    },
    Reset() {
      this.filterObj = {
        channelCode: '',
        minePackageCode: '',
        sku: '',
        cdmType: '',
        cdmName: '',
      }
      this.getTableData()
    },
    // 多个删除
    mutidel() {
      // if (this.deleteObj.yearAndMonth == '') {
      //   this.$message.info('请选择年月')
      // } else {
        var that = this
        var ids = that.$refs.Tdata.selection
        var idList = []
        ids.forEach((item, index) => {
          let obj = {
            id: '',
            validDate: '',
          }
          obj.id = item.id
          obj.validDate = this.deleteObj.yearAndMonth
          idList.push(obj)
        })
        API.deleteConfig(idList).then((res) => {
          if (res.code === 1000) {
            that.getTableData(that.pageNum, that.pageSize)
            that.$message({
              type: 'success',
              message: '删除成功',
            })
            this.closeDeleteDialog()
          }
        })
      // }
    },
    showDeleteDialog() {
      if (this.checkArr.length == 0) {
        this.$message.info('请选择数据')
      } else {
        this.$confirm('此操作将进行提交操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.mutidel()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    confirmDelete() {
      this.mutidel()
    },
    closeDeleteDialog() {
      this.deleteObj.yearAndMonth = ''
      this.deleteVisible = false
      this.$refs.Tdata.clearSelection()
    },
    // 导出excel
    exportExcelInfo() {
      var data = {
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.minePackageCode,
        sku: this.filterObj.sku,
        cdmType: this.filterObj.cdmType,
        cdmName: this.filterObj.cdmName,
      }
      API.exportExcelSyspool(data).then((response) => {
        const fileName = '机制池导出Excel' + new Date().getTime() + '.xlsx'
        //   res.data:请求到的二进制数据
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        }) // 1.创建一个blob
        const link = document.createElement('a') // 2.创建一个a链接
        link.download = fileName // 3.设置名称
        link.style.display = 'none' // 4.默认不显示
        link.href = URL.createObjectURL(blob) // 5.设置a链接href
        document.body.appendChild(link) // 6.将a链接dom插入当前html中
        link.click() // 7.点击事件
        URL.revokeObjectURL(link.href) // 8.释放url对象
        document.body.removeChild(link) // 9.移除a链接dom
      })
    },
    // 下载excel模板
    downLoadElxModel() {
      API.downloadExcelSyspool().then((response) => {
        const fileName = '机制池模板' + new Date().getTime() + '.xlsx'
        //   res.data:请求到的二进制数据
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        }) // 1.创建一个blob
        const link = document.createElement('a') // 2.创建一个a链接
        link.download = fileName // 3.设置名称
        link.style.display = 'none' // 4.默认不显示
        link.href = URL.createObjectURL(blob) // 5.设置a链接href
        document.body.appendChild(link) // 6.将a链接dom插入当前html中
        link.click() // 7.点击事件
        URL.revokeObjectURL(link.href) // 8.释放url对象
        document.body.removeChild(link) // 9.移除a链接dom
      })
    },
    // 导入数据
    importData() {
      this.importVisible = true
    },
    // 确认导入
    confirmImport() {
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.importExcelSyspool(formData)
        .then((response) => {
          if (response.code === 1000) {
            this.$message.success(response.data)
            this.getTableData()
            this.closeImport()
          } else {
            if (typeof response.data === 'string') {
              this.$message.error(response.data)
            } else if (response.data.length > 0) {
              this.warningList = []
              this.warningShow = true
              this.warningList = response.data
            } else if (typeof response.data === 'object') {
              this.$message.error(response.data)
            }
          }
          this.event.srcElement.value = ''
        })
        .catch(() => {})
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.warningShow = false
      this.warningList = []
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    // 关闭导入
    closeImport() {
      this.importVisible = false
      if (this.event.srcElement) {
        this.event.srcElement.value = '' // 置空
      }
      this.uploadFileName = ''
      this.uploadFile = ''
      this.warningList = []
      this.warningShow = false
    },
    // 弹框 动态增加行
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1
    },
    // 单选框选中数据
    handleDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      } else {
        this.checkedDetail = selection
      }
    },
    handleAddDetails() {
      if (this.systemList === undefined) {
        // eslint-disable-next-line no-array-constructor
        this.systemList = new Array()
      }
      const obj = {}
      obj.cdmType = '1'
      obj.cdmRuleF = '0'
      obj.cdmRuleS = '0'
      obj.cdmName = ''
      this.systemList.push(obj)
    },
    handleDeleteDetails() {
      if (this.checkedDetail.length === 0) {
        this.$alert('请先选择要删除的数据', '提示', {
          confirmButtonText: '确定',
        })
      } else {
        this.systemList.splice(this.checkedDetail[0].xh - 1, 1)
      }
    },
    handleDeleteAllDetails() {
      this.systemList = undefined
    },

    // 获取下拉框 渠道
    getQueryChannelSelect() {
      selectAPI
        .queryChannelSelect()
        .then((res) => {
          this.channelOptons = res.data
        })
        .catch()
    },
    getQuerySkuSelect() {
      selectAPI
        .querySkuSelect()
        .then((res) => {
          this.skuOptons = res.data
        })
        .catch()
    },
    getQueryMinePackageSelect() {
      selectAPI
        .queryMinePackageSelect()
        .then((res) => {
          this.mpOptons = res.data
        })
        .catch()
    },
    // 查询
    search() {
      API.getPageByRequestConfig({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        channelCode: this.filterObj.channelCode,
        minePackageCode: this.filterObj.minePackageCode,
        sku: this.filterObj.sku,
        cdmType: this.filterObj.cdmType,
        cdmName: this.filterObj.cdmName,
        validDate: this.filterObj.validDate,
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    // 获取表格数据
    getTableData() {
      API.getPageByRequestConfig({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
      })
        .then((response) => {
          this.tableData = response.data.records
          this.pageNum = response.data.pageNum
          this.pageSize = response.data.pageSize
          this.total = response.data.total
        })
        .catch(() => {})
    },
    add() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.isEditor = false
      this.editorId = ''
      this.ruleForm = {
        channelCode: '',
        channelCsName: '',
        productCode: '',
        productEsName: '',
        productCsName: '',
        gear: '',
        volMin: '',
        yearAndMonth: '',
        remark: '',
      }
    },
    editor(obj) {
      this.isEditor = true
      this.dialogVisible = true
      this.ruleForm = {
        channelCode: obj.channelCode,
        channelCsName: obj.channelCsName,
        productCode: obj.productCode,
        productEsName: obj.productEsName,
        productCsName: obj.productCsName,
        gear: obj.gear,
        volMin: obj.volMin,
        yearAndMonth: obj.yearAndMonth,
        remark: obj.remark,
      }
      this.editorId = obj.id
    },
    // 提交form
    submitForm() {
      // 新增接口
      const cdmListLocal = []
      for (const item of this.systemList) {
        const cdnItem = {
          cdmTypeItem: '',
          cdmNameItem: '',
          beginNumItem: '',
          endNumItem: '',
        }
        cdnItem.cdmTypeItem = item.cdmType
        cdnItem.cdmNameItem =
          item.cdmType === '5'
            ? item.cdmName
            : '满' + item.cdmRuleF + '听' + item.cdmRuleS + '折'
        cdnItem.beginNumItem = item.cdmRuleF
        cdnItem.endNumItem = item.cdmRuleS
        cdmListLocal.push(cdnItem)
      }

      const params = {
        channelCode: this.dialogAdd.channelCode,
        minePackageCode: this.dialogAdd.costTypeNumber,
        sku: this.dialogAdd.productCode,
        remark: this.dialogAdd.remark,
        cdmList: cdmListLocal,
      }
      API.insertDataConfig(params)
        .then((res) => {
          if (res.code === 1000) {
            this.closeDialog()
          }
        })
        .catch()
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     const url = this.isEditor
      //       ? API.updateMdPriceGear
      //       : API.insertMdPriceGear
      //     url({
      //       id: this.editorId,
      //       channelCode: this.ruleForm.channelCode,
      //       channelCsName: this.ruleForm.channelCsName,
      //       productCode: this.ruleForm.productCode,
      //       productCsName: this.ruleForm.productCsName,
      //       gear: this.ruleForm.gear,
      //       volMin: this.ruleForm.volMin,
      //       yearAndMonth: this.ruleForm.yearAndMonth,
      //       remark: this.ruleForm.remark
      //     }).then((response) => {
      //       if (response.code === 1000) {
      //         this.$message.success(`${this.isEditor ? '修改' : '添加'}成功`)
      //         this.resetForm(formName)
      //         this.getTableData()
      //       }
      //     })
      //   } else {
      //     this.$message.error('提交失败')
      //     return false
      //   }
      // })
    },
    // 取消
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.closeDialog()
    },
    handleSelectionChange(val) {
      this.checkArr = val
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.pageSize = size
      this.getTableData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.pageNum = num
      this.getTableData()
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    HeadTable() {
      return ' background: #fff;color: #333;font-size: 16px;text-align: center;font-weight: 400;font-family: Source Han Sans CN;'
    },
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

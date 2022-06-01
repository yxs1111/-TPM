<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">Mine Package</span>
          <el-select v-model="filterObj.minePackage" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="item.costType" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">区域</span>
          <el-select v-model="filterObj.regionCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in regionList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">大区</span>
          <el-select v-model="filterObj.zoneName" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in zoneList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </div>

        <div class="Selectli">
          <span class="SelectliTitle">供应商</span>
          <el-select v-model="filterObj.supplierIndex" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in supplierList" :key="index" :label="item.supplierName" :value="index" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <div class="TpmButtonBGWrap">
      <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG" @click="add" v-permission="permissions['insert']">新增</el-button>
      <div class="TpmButtonBG" @click="importData" v-permission="permissions['import']">
        <img src="@/assets/images/import.png" alt="" />
        <span class="text">导入</span>
      </div>
      <el-button type="primary" class="TpmButtonBG" icon="el-icon-delete" @click="mutidel" v-permission="permissions['delete']">删除</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column fixed="left" align="center" prop="minePackage" label="Mine Package"> </el-table-column>
      <el-table-column fixed="left" align="center" prop="zoneName" label="大区"> </el-table-column>
      <el-table-column fixed="left" align="center" prop="regionName" label="区域"> </el-table-column>
      <el-table-column fixed="left" width="200" align="center" prop="supplierName" label="供应商"> </el-table-column>
      <el-table-column width="150" align="center" prop="createBy" label="创建人" />
      <el-table-column width="180" align="center" prop="createDate" label="创建时间">
        <template slot-scope="{row}">
          <div>
            {{ row.createDate ? row.createDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" prop="updateBy" label="修改人" />
      <el-table-column width="180" align="center" prop="updateDate" label="修改时间">
        <template slot-scope="{row}">
          <div>
            {{ row.updateDate ? row.updateDate.replace("T"," ") : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="my-el-dialog" title="新增匹配关系" :visible="dialogVisible" width="50%" v-el-drag-dialog @close="closeDialog">
      <div class="el-dialogContent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="el-form-row">
          <el-form-item label="Mine Package" prop="minePackage">
            <el-select v-model="ruleForm.minePackage" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in minePackageList" :key="index" :label="item.costType" :value="item.costType" />
            </el-select>
          </el-form-item>
          <el-form-item label="区域">
            <el-select v-model="ruleForm.regionCode" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in regionList" :key="index" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="大区" prop="zoneName">
            <el-select v-model="ruleForm.zoneName" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in zoneListDialog" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierIndex">
            <el-select v-model="ruleForm.supplierIndex" filterable clearable placeholder="请选择">
              <el-option v-for="item,index in supplierList" :key="index" :label="item.supplierName" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="ruleForm.state" clearable filterable placeholder="请选择">
              <el-option v-for="(item,index) in ['无效','有效']" :key="item" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="导入" :visible="importVisible" @close="closeImport">
      <div class="fileInfo ImportContent">
        <div class="fileTitle">模板</div>
        <div class="my-search selectFile" @click="TemplateDownload">
          <svg-icon icon-class="download_white" style="font-size: 16px;" />
          <span class="text">下载模板</span>
        </div>
      </div>
      <div class="fileInfo ImportContent">
        <div class="fileTitle">文件</div>
        <div class="my-search selectFile" @click="parsingExcelBtn">
          <img src="@/assets/images/selectFile.png" alt="" />
          <span class="text">选择文件</span>
        </div>
        <input ref="filElem" id="fileElem" type="file" style="display: none" @change="parsingExcel($event)" />
        <div class="fileName" v-if="uploadFileName != ''">
          <img src="@/assets/upview_fileicon.png" alt="" class="upview_fileicon" />
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport()">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
      <div v-if="warningShow" style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert v-for="(item, index) in warningList" :key="index" :title="item" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
    </el-dialog>
    <!-- 错误弹窗 -->
    <el-dialog width="50%" class="my-el-dialog" title="错误信息" :visible="errorVisible" @close="closeErrorDialog">
      <div style="height: 300px;overflow: scroll;overflow-x: hidden;margin-top:15px;">
        <el-alert v-for="(item, index) in errorList" :key="index" :title="item" style="margin-bottom:5px;" type="warning" effect="dark" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  getHeightHaveTab,
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'MatchingRelation',

  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        minePackage: '',
        regionName: '',
        regionCode: '',
        regionIndex: '',
        zoneName: '',
        supplierIndex: '',
        state: '',
      },
      permissions: getDefaultPermissions(),
      tableData: [],
      minePackageList: [],
      regionList: [],
      zoneList: [],
      zoneListDialog: [],
      supplierList: [],
      ruleForm: {
        minePackage: '',
        regionName: '',
        zoneName: '',
        supplierCode: '',
        supplierName: '',
        supplierIndex: '',
        state:1
      },
      rules: {
        minePackage: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        regionCode: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        zoneName: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
        supplierIndex: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      checkArr: [], //批量删除,存放选中
      //导入
      importVisible: false, //导入弹窗
      uploadFileName: '',
      uploadFile: '',
      event: '',
      warningList: [],
      warningShow: false,
      errorVisible: false, //错误信息弹窗
      errorList: [], //错误信息数据
      maxheight: getHeightHaveTab(),
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    this.getTableData()
    this.getMinePackageList()
    this.getRegionList()
    this.getSupplierList()
    this.getLargeAreaList()
    this.getLargeAreaListdialog()
  },
  computed: {},
  watch: {
    'filterObj.regionCode'(value) {
      if (value == '') {
        this.filterObj.regionName = ''
        this.filterObj.zoneName = ''
      }
      this.zoneList = []
      this.filterObj.zoneName = ''
      let obj = this.regionList.find(
        (item) => item.code == this.filterObj.regionCode
      )
      if (obj) {
        this.filterObj.regionName = obj.name
        this.getLargeAreaList(obj)
      }
    },
    'ruleForm.regionCode'(value) {
      if (value == '') {
        this.ruleForm.regionName = ''
        this.ruleForm.zoneName = ''
      }
      this.zoneListDialog = []
      this.ruleForm.zoneName = ''
      let obj = this.regionList.find(
        (item) => item.code == this.ruleForm.regionCode
      )
      if (obj) {
        this.ruleForm.regionName = obj.name
        this.getLargeAreaListdialog(obj)
      }
    },
  },
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getMatchingRelationList({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        minePackage: this.filterObj.minePackage,
        regionName: this.filterObj.regionName,
        zoneName: this.filterObj.zoneName,
        supplierCode:
          this.filterObj.supplierIndex != ''
            ? this.supplierList[this.filterObj.supplierIndex].supplierBiCode
            : '',
        supplierName:
          this.filterObj.supplierIndex != ''
            ? this.supplierList[this.filterObj.supplierIndex].supplierName
            : '',
        state: this.filterObj.state,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getMinePackageList() {
      API.getMatchingRelationMinePackage().then((res) => {
        if (res.code === 1000) {
          this.minePackageList = res.data
        }
      })
    },
    getRegionList() {
      API.getMatchingRelationRegion().then((res) => {
        if (res.code === 1000) {
          this.regionList = res.data
        }
      })
    },
    getSupplierList() {
      API.getMatchingRelationSupplier().then((res) => {
        if (res.code === 1000) {
          this.supplierList = res.data
        }
      })
    },
    getLargeAreaList(obj) {
      if (obj) {
        console.log(obj)
        API.getMatchingRelationZone({
          parentCode: obj.parentCode ? obj.parentCode : '',
        }).then((res) => {
          if (res.code === 1000) {
            this.zoneList = res.data
          }
        })
      } else {
        console.log(obj)
        API.getMatchingRelationZone({
          parentCode: '',
        }).then((res) => {
          if (res.code === 1000) {
            this.zoneList = res.data
          }
        })
      }
    },
    getLargeAreaListdialog(obj) {
      if (obj) {
        API.getMatchingRelationZone({
          parentCode: obj.parentCode ? obj.parentCode : '',
        }).then((res) => {
          if (res.code === 1000) {
            this.zoneListDialog = res.data
          }
        })
      } else {
        API.getMatchingRelationZone({
          parentCode: '',
        }).then((res) => {
          if (res.code === 1000) {
            this.zoneListDialog = res.data
          }
        })
      }
    },
    add() {
      this.dialogVisible = true
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        minePackage: '',
        regionName: '',
        regionCode: '',
        regionIndex: '',
        zoneName: '',
        supplierIndex: '',
        supplierCode: '',
        supplierName: '',
        state: '',
      }
      this.getTableData()
    },
    closeDialog() {
      this.dialogVisible = false
      this.ruleForm = {
        minePackage: '',
        regionName: '',
        zoneName: '',
        supplierCode: '',
        supplierName: '',
        supplierIndex: '',
      }
    },
    //提交form
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.addMatchingRelation({
            minePackage: this.ruleForm.minePackage,
            regionName: this.ruleForm.regionName,
            zoneName: this.ruleForm.zoneName,
            supplierCode:
              this.supplierList[this.ruleForm.supplierIndex].supplierBiCode,
            supplierName:
              this.supplierList[this.ruleForm.supplierIndex].supplierName,
            state:this.ruleForm.state
          }).then((response) => {
            if (response.code === 1000) {
              this.$message.success(`添加成功`)
              this.resetForm(formName)
              this.getTableData()
            }
          })
        } else {
          this.$message.error('提交失败')
          return false
        }
      })
    },
    //多个删除
    mutidel() {
      if (this.checkArr.length === 0) return this.$message.error('请选择数据')
      else {
        const IdList = []
        this.checkArr.forEach((item) => {
          IdList.push(item.id)
        })
        this.$confirm('确定要删除数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            API.deleteMatchingRelation(IdList).then((response) => {
              if (response.code === 1000) {
                this.getTableData()
                this.$message.success('删除成功!')
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      }
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.closeDialog()
    },
    //导入数据
    importData() {
      this.importVisible = true
    },
    TemplateDownload() {
      API.MatchingRelationDownloadExcel().then((res) => {
        downloadFile(res, '匹配关系模板' + '.xlsx') //自定义Excel文件名
        this.$message.success('下载成功!')
      })
    },
    //确认导入
    confirmImport() {
      this.warningShow = false
      this.warningList = []
      var formData = new FormData()
      formData.append('file', this.uploadFile)
      API.MatchingRelationImportExcel(formData).then((response) => {
        if (response.code === 1000) {
          this.$message.success('导入成功!')
          this.closeImport()
          this.getTableData()
          this.event.srcElement.value = '' // 置空
        } else {
          if (typeof response.data === 'string') {
            this.$message.warning(response.data)
          } else if (response.data.length > 0) {
            this.warningShow = true
            this.warningList = response.data
          } else if (typeof response.data === 'object') {
            this.$message.error(response.data)
          }
        }
        this.event.srcElement.value = '' // 置空
      })
    },
    //选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //导入
    parsingExcel(event) {
      console.log(event)
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    //关闭导入
    closeImport() {
      this.importVisible = false
      this.event.srcElement.value = '' //置空
      this.uploadFileName = ''
      this.uploadFile = ''
      this.warningList = []
      this.warningShow = false
    },
    //关闭导入
    closeErrorDialog() {
      this.errorVisible = false
      this.errorList = []
    },
    //导出数据
    exportData() {
      API.MatchingRelationExportExcel({
        minePackage: this.filterObj.minePackage,
        regionName: this.filterObj.regionName,
        zoneName: this.filterObj.zoneName,
        supplierCode:
          this.filterObj.supplierIndex != ''
            ? this.supplierList[this.filterObj.supplierIndex].supplierBiCode
            : '',
        supplierName:
          this.filterObj.supplierIndex != ''
            ? this.supplierList[this.filterObj.supplierIndex].supplierName
            : '',
        state: this.filterObj.state,
      }).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '匹配关系 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
    },
    handleSelectionChange(val) {
      this.checkArr = val
      console.log(val)
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

<style lang="scss" scoped></style>

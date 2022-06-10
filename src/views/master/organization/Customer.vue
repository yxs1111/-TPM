<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">客户CP编码</span>
          <el-input v-model="filterObj.customerCode" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户中文名称</span>
          <el-input v-model="filterObj.customerCsName" clearable placeholder="请输入" />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">渠道</span>
          <el-select v-model="filterObj.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ChannelList" :key="index" :label="item.channelCode" :value="item.channelCode" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">客户组名称</span>
          <el-select v-model="filterObj.groupName" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in CustomerGroupList" :key="index" :label="item.groupName" :value="item.groupName" />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.state" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <!-- <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button> -->
        <!-- <div class="TpmButtonBG" @click="importDataNKA">
          <img src="@/assets/images/import.png" alt="">
          <span class="text">NKA导入</span>
        </div>
        <div class="TpmButtonBG" @click="importDataEC">
          <img src="@/assets/images/import.png" alt="">
          <span class="text">EC导入</span>
        </div><div class="TpmButtonBG" @click="importDataNKALine">
          <img src="@/assets/images/import.png" alt="">
          <span class="text">NKALine导入</span>
        </div><div class="TpmButtonBG" @click="importDataECLine">
          <img src="@/assets/images/import.png" alt="">
          <span class="text">ECLine导入</span>
        </div> -->
      </div>
      <div class="OpertionBar">
        <el-button type="primary" class="TpmButtonBG"  @click="search" v-permission="permissions['get']">查询</el-button>
        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>
        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">
          <img src="@/assets/images/export.png" alt="" />
          <span class="text">导出</span>
        </div>
      </div>
    </div>
    <el-table :data="tableData" :max-height="maxheight" border :header-cell-style="HeadTable" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column align="center" prop="customerCode" label="客户CP编码" />
      <el-table-column align="center" prop="customerMdmCode" label="客户MDM编码" />
      <el-table-column align="center" prop="customerCsName" label="客户中文名称" />
      <el-table-column width="220" align="center" prop="customerEsName" label="客户英文名称" />
      <el-table-column align="center" prop="groupCode" label="客户组编码" />
      <el-table-column align="center" prop="groupName" label="客户组名称" />
      <el-table-column align="center" prop="customerType" label="客户类型" />
      <el-table-column align="center" prop="channelCode" label="渠道" />
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[100, 200, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- NKA导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="NKA导入" :visible="importVisibleNKA" @close="closeImport">
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
        <el-button type="primary" @click="confirmImport(1)">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
    </el-dialog>
    <!-- EC导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="EC导入" :visible="importVisibleEC" @close="closeImport">
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
        <el-button type="primary" @click="confirmImport(2)">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
    </el-dialog>
    <!-- NKALine导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="NKALine导入" :visible="importVisibleNKALine" @close="closeImport">
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
        <el-button type="primary" @click="confirmImport(3)">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
    </el-dialog>
    <!-- ECLine导入 -->
    <el-dialog width="50%" class="my-el-dialog" title="ECLine导入" :visible="importVisibleECLine" @close="closeImport">
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
        <el-button type="primary" @click="confirmImport(4)">确 定</el-button>
        <el-button @click="closeImport">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions,getHeight,downloadFile } from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon.js'
export default {
  name: 'Customer',
  directives: { elDragDialog, permission },

  data() {
    return {
      importVisibleNKA: false,
      importVisibleNKALine: false,
      importVisibleEC: false,
      importVisibleECLine: false,
      uploadFileName: '',

      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        customerCode: '',
        customerCsName: '',
        channelCode: '',
        groupName: '',
        state: '',
      },
      categoryArr: [{ label: 'test', value: '19' }],
      permissions: getDefaultPermissions(),
      tableData: [],
      CustomerGroupList: [],
      ChannelList: [],
      checkArr: [], // 批量删除,存放选中
      maxheight: getHeight(),
    }
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeight()
      })()
    }
    this.getCustomerGroupList()
    this.getTableData()
    this.getChannelList()
  },
  methods: {
    getChannelList() {
      selectAPI.queryChannelSelect().then((res) => {
        if (res.code == 1000) {
          this.ChannelList = res.data
        }
      })
    },
    getCustomerGroupList() {
      selectAPI.getCustomerGroupList().then((res) => {
        if (res.code == 1000) {
          this.CustomerGroupList=res.data
        }
      })
    },
    // 确认导入
    confirmImport(val) {
      if (val === 1) {
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        formData.append('type', 'NKA')
        API.importNkaRawData(formData)
          .then((response) => {
            this.closeImport()
          })
          .catch(() => {})
      } else if (val === 2) {
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        formData.append('type', 'EC')
        API.importNkaRawData(formData)
          .then((response) => {
            this.closeImport()
          })
          .catch(() => {})
      } else if (val === 3) {
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        formData.append('type', 'NKA')
        API.importNkaRawDataGuideline(formData)
          .then((response) => {
            this.closeImport()
          })
          .catch(() => {})
      } else if (val === 4) {
        var formData = new FormData()
        formData.append('file', this.uploadFile)
        formData.append('type', 'EC')
        API.importNkaRawDataGuideline(formData)
          .then((response) => {
            this.closeImport()
          })
          .catch(() => {})
      }
    },
    // 关闭导入
    closeImport() {
      this.importVisibleNKA = false
      this.importVisibleNKALine = false
      this.importVisibleEC = false
      this.importVisibleECLine = false
      this.event.srcElement.value = '' // 置空
      this.uploadFileName = ''
      this.uploadFile = ''
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 导入
    parsingExcel(event) {
      this.event = event
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
    },
    // 导入数据
    importDataNKA() {
      this.importVisibleNKA = true
    },
    importDataNKALine() {
      this.importVisibleNKALine = true
    },
    importDataEC() {
      this.importVisibleEC = true
    },
    importDataECLine() {
      this.importVisibleECLine = true
    },
    // 获取表格数据
    getTableData() {
      API.getPageMdCustomer({
        customerCode: this.filterObj.customerCode,
        customerCsName: this.filterObj.customerCsName,
        channelCode: this.filterObj.channelCode,
        groupName: this.filterObj.groupName,
        state: this.filterObj.state,
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    Reset() {
      this.filterObj = {
        customerCode: '',
        customerCsName: '',
        channelCode: '',
        state: '',
        groupName: '',
      }
      this.getTableData()
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    Reset() {
      this.filterObj = {
        customerCode: '',
        customerCsName: '',
      }
      this.getTableData()
    },
    //导出数据
    exportData() {
      let formData = new FormData()
      formData.append('customerCode', this.filterObj.customerCode)
      formData.append('customerCsName', this.filterObj.customerCsName)
      formData.append('channelCode', this.filterObj.channelCode)
      formData.append('state', this.filterObj.state)
      API.exportCustomer(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '客户 -' + timestamp + '.xlsx') //自定义Excel文件名
        this.$message.success('导出成功!')
      })
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

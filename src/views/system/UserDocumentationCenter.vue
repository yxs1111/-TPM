<template>
  <div class="app-container UserDocumentationCenter">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">文件名称</span>
          <el-input
            v-model="filterObj.fileName"
            clearable
            placeholder="文件名称"
          />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">上传人</span>
          <el-input
            v-model="filterObj.createBy"
            clearable
            placeholder="上传人"
          />
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">上传时间</span>
          <el-date-picker
            v-model="filterObj.startDate"
            type="date"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span style="margin: 0 15px"> - </span>
          <el-date-picker
            v-model="filterObj.endDate"
            type="date"
            placeholder="结束时间"
          >
          </el-date-picker>
        </div>
      </div>
      <el-button
        type="primary"
        class="TpmButtonBG"
        @click="search"
        v-permission="permissions['get']"
        >查询</el-button
      >
    </div>
    <div class="utils">
      <el-button
        type="primary"
        class="TpmButtonBG"
        @click="upload"
        icon="el-icon-upload2"
        >上传</el-button
      >
      <el-button
        type="primary"
        class="TpmButtonBG"
        @click="del"
        :disabled="checkArr.length === 0"
        :style="
          checkArr.length === 0
            ? { backgroundColor: '#ccc !important', borderColor: '#ccc' }
            : {}
        "
        icon="el-icon-delete"
        >删除</el-button
      >
    </div>
    <el-table
      :data="tableData"
      border
      :max-height="maxheight"
      :header-cell-style="HeadTable"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-link icon="el-icon-download" :href="scope.row.fileUrl">
            下载
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fileName" label="文件名称">
      </el-table-column>
      <el-table-column align="center" prop="createBy" label="上传人">
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" label="上传时间">
        {{ row.createDate ? row.createDate.replace('T', ' ') : '' }}
      </el-table-column>
      <el-table-column align="center" prop="fileSize" label="文件大小">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹框 -->
    <el-dialog
      title="上传"
      :visible.sync="dialogVisible"
      width="300px"
      :before-close="handleClose"
    >
      <div class="fileInfo">
        <el-button
          class="button"
          icon="el-icon-upload2"
          type="primary"
          @click="parsingExcelBtn"
          >上传附件</el-button
        >
        <input
          id="fileElem"
          ref="filElem"
          type="file"
          style="display: none"
          @change="parsingExcel($event)"
        />
        <div v-if="uploadFileName != ''" class="fileName">
          <img
            src="@/assets/upview_fileicon.png"
            alt=""
            class="upview_fileicon"
          />
          <span>{{ uploadFileName }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { getDefaultPermissions, getHeightSingle, downloadFile } from '@/utils'
import API from '@/api/system/UserDocumentationCenter.js'

export default {
  name: 'UserDocumentationCenter',
  data() {
    return {
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        fileName: '',
        createBy: '',
        startDate: '',
        endDate: '',
      },
      uploadFileName: '',
      permissions: getDefaultPermissions(),
      tableData: [],
      dialogVisible: false,
      maxheight: getHeightSingle(),
      checkArr: [],
      fileList: [],
      uploadFile: '',
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
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      const obj = JSON.parse(JSON.stringify(this.filterObj))
      const DateFun = (date) => {
        return {
          Year: new Date(date).getFullYear(),
          Month: new Date(date).getMonth() + 1,
          Day: new Date(date).getDate(),
        }
      }
      if (obj.startDate) {
        const { Year, Month, Day } = DateFun(obj.startDate)
        obj.startDate = Year + '-' + Month + '-' + Day + ' 00:00'
      }
      if (obj.endDate) {
        const { Year, Month, Day } = DateFun(obj.endDate)
        obj.endDate = Year + '-' + Month + '-' + Day + ' 23:59'
      }
      API.getMdDataInterface({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        ...obj,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    //上传
    upload() {
      this.dialogVisible = true
    },
    parsingExcel(event) {
      this.uploadFileName = event.target.files[0].name
      this.uploadFile = event.target.files[0]
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      API.uploadFile(formData).then((response) => {
        //清除input的value ,上传一样的
        event.srcElement.value = '' // 置空
        if (response.code === 1000) {
          this.$message.success(response.message)
          this.uploadFile = []
          this.getTableData()
        } else {
          this.$message.info(response.message)
        }
      })
    },
    save() {
      this.uploadFileName = ''
      this.dialogVisible = false
    },
    handleClose() {
      this.uploadFileName = ''
      this.dialogVisible = false
    },
    //删除
    del() {
      API.delete(this.checkArr).then((res) => {
        if (res.code === 1000) {
          this.$message.success(res.message)
          this.checkArr = []
          this.getTableData()
        } else {
          this.$message.info(res.message)
        }
      })
    },
    handleSelectionChange(val) {
      this.checkArr = val.map((item) => item.id)
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
.UserDocumentationCenter {
  .utils {
    display: flex;
  }
  ::v-deep .el-dialog__header {
    background-color: #4192d3 !important;
    .el-dialog__title {
      color: #fff !important;
    }
  }
  .fileInfo {
    display: flex;
    align-items: center;
    flex-direction: column;
    .button {
      width: 120px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>

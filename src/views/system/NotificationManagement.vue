<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">通知内容</span>
          <el-input v-model="filterObj.content" filterable clearable placeholder="请输入">
<!--            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />-->
          </el-input>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">接受角色</span>
          <el-input v-model="filterObj.sendUser" filterable clearable placeholder="请输入">
            <!--            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />-->
          </el-input>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select v-model="filterObj.State" filterable clearable placeholder="请选择">
            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />
          </el-select>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search" v-permission="permissions['get']">查询</el-button>
<!--        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>-->
<!--        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">-->
<!--          <img src="@/assets/images/export.png" alt="" />-->
<!--          <span class="text">导出</span>-->
<!--        </div>-->
      </div>
    </div>
    <div class='SelectBar'>
      <el-button type="primary" class="TpmButtonBG" @click="writeEmail">写邮件</el-button>
    </div>
    <el-table :data="tableData" border :max-height="maxheight" :header-cell-style="HeadTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column align="center" prop="interfaceName" label="操作"> </el-table-column>
      <el-table-column align="center" prop="id" label="编码"> </el-table-column>
      <el-table-column v-slot={row} align="center" prop="type" label="通知类型">
         {{ row.type == 1 ? '定时通知' : '即时通知' }}
      </el-table-column>
      <el-table-column align="center" prop="theme" label="主题"> </el-table-column>
      <el-table-column align="center" prop="sendUser" label="接受角色/接受邮箱"> </el-table-column>
      <el-table-column v-slot={row} align="center" prop="sendTime" label="发送时间">
        {{ row.sendTime ? row.sendTime.replace("T"," ") : '' }}
      </el-table-column>
      <!-- <el-table-column align="center" prop="inData" label="接口参数"> </el-table-column> -->
      <el-table-column width="150" align="center" prop="deleteFlag" label="状态">
        <template slot-scope="{row}">
          <div>
            {{row.deleteFlag?'无效':'有效'}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="TpmPaginationWrap">
      <el-pagination :current-page="pageNum" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog width="55%"  title="写邮件" :visible="addVisible" @close="closeDialog" class="my-el-dialog">
      <div class="app-container">
        <div class="SelectBarWrap">
          <div class="SelectBar" @keyup.enter="search">
            <div class="Selectli">
              <span class="SelectliTitle">接收人:</span>
              <el-cascader
                v-model="filterObj.toUserList"
                :options="sendUserList"
                :props="props"
                @change="handleChange"
                :show-all-levels="false"></el-cascader>
            </div>
            <div class="Selectli">
              <span class="SelectliTitle">抄送人:</span>
              <el-cascader
                v-model="filterObj.ccUserList"
                :options="sendUserList"
                :props="props"
                @change="handleChange2"
                :show-all-levels="false"></el-cascader>
            </div>
            <div class="Selectli">
              <span class="SelectliTitle">主题:</span>
              <el-input v-model="filterObj.theme" filterable clearable placeholder="请输入">
  <!--              <el-option v-for="item in sendUserList" :key="item.code" :label="item.name" :value="item.name" />-->
              </el-input>
            </div>
          </div>
        </div>
        <div class="Selectli">
          <div style="border: 1px solid #ccc;">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden;"
              v-model="html"
              :defaultConfig="filterObj.editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
          <div style='display: flex; align-items: center;  margin-top: 18px;'>
            <el-button type="primary" class="TpmButtonBG" @click="parsingExcelBtn">上传附件</el-button>
            <input
              id="fileElem"
              ref="filElem"
              type="file"
              multiple
              style="display: none"
              @change="parsingExcel($event)"
            />
            <div v-if="uploadFileName != ''" class="fileName">
              <div v-for="(item, index) in uploadFileName">
                <img
                  src="@/assets/upview_fileicon.png"
                  alt=""
                  class="upview_fileicon"
                />
                <span>{{ item }}</span>
                <span style='color: #4192D3; margin-left: 15px; cursor: pointer' @click='deleteLi(index)'>删除</span>
              </div>
            </div>
          </div>
          <div style='display: flex; align-items: center; justify-content: center; margin-top: 18px;'>
            <el-button type="primary" class="TpmButtonBG" @click="confirmImport">确定</el-button>
            <el-button type="primary" plain class="TpmButtonBG2" @click="cancleWriteEmail">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission'
import elDragDialog from '@/directive/el-drag-dialog'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  getDefaultPermissions,
  parseTime,
  getTextMap,
  getHeightSingle,
  downloadFile,
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon'
import item from '@/layout/components/Sidebar/Item'

export default {
  name: 'NotificationManagement',
  components: { Editor, Toolbar },

  data() {
    return {
      value: [],
      props: {
        multiple: true,
        expandTrigger: 'hover',
        value: 'email',
        label: 'email',
        children: 'userList',
        checkStrictly: true,
        emitPath: false
      },
      total: 0,
      pageSize: 100,
      pageNum: 1,
      filterObj: {
        interfaceName: '',
        invokeDateSting: '',
        content: '',
        sendUser: '',
        State: '',
        theme: '',
        editorConfig: '',
        toUserList: [],
        ccUserList: [],
      },
      addVisible: false, // 导入弹窗
      permissions: getDefaultPermissions(),
      InterfaceList: [],
      uploadFileName: [],
      uploadFile: [],
      sendUserList: [],
      tableData: [],
      dialogVisible: false,
      maxheight: getHeightSingle(),
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
      arr1: []
    }
  },
  directives: { elDragDialog, permission },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    }, 1500)
    this.getTableData()
    this.getInterfaceList()
    this.getChannel()
    // this.getCustomerList()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  computed: {},
  methods: {
    //获取表格数据
    getTableData() {
      this.tableData = []
      API.getNotification({
        pageNum: this.pageNum, //当前页
        pageSize: this.pageSize, //每页条数
        content: this.filterObj.content,
        sendUser: this.filterObj.sendUser,
        State: this.filterObj.State,
      }).then((response) => {
        this.tableData = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    getInterfaceList() {
      API.getInterfaceList({
      }).then((response) => {
        this.InterfaceList = response.data
      })
    },
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    // 选择导入文件
    parsingExcelBtn() {
      this.saveBtn = false
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    // 获取下拉框
    getChannel() {
      API.recipientSelect().then((res) => {
        if (res.code === 1000) {
          this.sendUserList = res.data
          this.ccUserList = res.data
          // console.log(this.sendUserList)
          this.sendUserList.forEach(item => {
            item.email = item.name
          })
          this.ccUserList.forEach(item => {
            item.email = item.name
          })
          // console.log(this.sendUserList)
        }
      })
    },
    // 导入
    parsingExcel(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadFileName.push(event.target.files[i].name)
      }
      this.uploadFile = event.target.files
      const formData = new FormData()
      formData.append('files', this.uploadFile)
      console.log(this.uploadFile)
    },
    // 删除已选择的文件
    deleteLi(index) {
      // console.log(this.uploadFile[index])
      // this.uploadFile.splice(index, 1)
      this.uploadFileName.splice(index, 1)
      // delete this.uploadFile[]
      // for (let i = 0; i < this.uploadFile.length; i++) {
      //   this.arr1.push(this.uploadFile[i])
      //   this.uploadFileName = this.arr1[i].name
      // }
      // // this.arr1.splice(index, 1)
      // this.uploadFile = this.arr1
      // console.log(this.uploadFile, this.uploadFileName)
    },
    // 确认导入
    confirmImport() {
      if (this.filterObj.theme !== '') {
        const formData = new FormData()
        for (let i = 0; i < this.uploadFile.length; i++) {
          formData.append('files', this.uploadFile[i])
        }
        formData.append('toUserList', this.filterObj.toUserList)
        formData.append('ccUserList', this.filterObj.ccUserList)
        formData.append('theme', this.filterObj.theme)
        formData.append('content', this.html)
        API.importNormal(formData).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
          } else {
            this.$message.info(this.messageMap.saveError)
          }
        })
      } else {
        alert('必须填写主题内容')
      }
    },
    handleChange(value) {
      this.filterObj.toUserList = value
      console.log(this.filterObj.toUserList)
    },
    handleChange2(value) {
      this.filterObj.ccUserList = value
      console.log(this.filterObj.ccUserList)
    },
    // 写邮件
    writeEmail() {
      this.addVisible = true
    },
    // 取消写邮件
    cancleWriteEmail() {
      this.addVisible = false
      this.filterObj.toUserList = ''
      this.filterObj.ccUserList = ''
      this.filterObj.theme = ''
      this.html = ''
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    closeDialog() {
      this.addVisible = false
    },
    // 导出数据
    exportData() {
      let formData = new FormData()
      formData.append('interfaceName', this.filterObj.interfaceName)
      formData.append('invokeDateSting', this.filterObj.invokeDateSting)
      API.exportMdDataInterface(formData).then((res) => {
        let timestamp = Date.parse(new Date())
        downloadFile(res, '监控管理 -' + timestamp + '.xlsx') //自定义Excel文件名
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

<style lang="scss" scoped>
.TpmButtonBG2{
  min-width: 84px;
  height: 38px;
  border-radius: 3px;
  padding: 0 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
<style src="@wangeditor/editor/dist/css/style.css"></style>

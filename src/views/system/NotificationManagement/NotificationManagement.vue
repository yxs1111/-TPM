<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">主题:</span>
          <el-input v-model="filterObj.content" filterable clearable placeholder="请输入">
            <!--            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />-->
          </el-input>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">接受角色/接收人:</span>
          <el-input v-model="filterObj.sendUser" style='margin-left: 18px' filterable clearable placeholder="请输入">
            <!--            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />-->
          </el-input>
        </div>
<!--        <div class="Selectli">-->
<!--          <span class="SelectliTitle">状态</span>-->
<!--          <el-select v-model="filterObj.State" filterable clearable placeholder="请选择">-->
<!--            <el-option v-for="item,index in ['无效','有效']" :key="index" :label="item" :value="index" />-->
<!--          </el-select>-->
<!--        </div>-->
        <el-button v-permission="permissions['get']" type="primary" class="TpmButtonBG" @click="search">查询</el-button>
        <!--        <el-button type="primary" class="TpmButtonBG" @click="Reset">重置</el-button>-->
        <!--        <div class="TpmButtonBG" @click="exportData" v-permission="permissions['export']">-->
        <!--          <img src="@/assets/images/export.png" alt="" />-->
        <!--          <span class="text">导出</span>-->
        <!--        </div>-->
      </div>
    </div>
    <div class="SelectBar">
      <el-button type="primary" class="TpmButtonBG" @click="writeEmail">即时通知</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      :max-height="580"
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column align="center" prop="interfaceName" label="操作"> </el-table-column>-->
      <el-table-column align="center" prop="id" label="序号" />
      <el-table-column align="center" prop="theme" show-overflow-tooltip label="主题" />
      <el-table-column align="center" prop="sendUser" label="接受角色/接受人" />
      <el-table-column v-slot="{row}" align="center" prop="type" label="通知类型">
        {{ row.type == 1 ? '定时通知' : '即时通知' }}
      </el-table-column>
      <el-table-column v-slot="{row}" align="center" prop="type" label="站内">
        {{ row.type == 1 ? '是' : '否' }}
      </el-table-column>
      <el-table-column v-slot="{row}" align="center" prop="type" label="邮件">
        {{ row.type == 1 ? '是' : '否' }}
      </el-table-column>
      <el-table-column align="center" prop="sendUser" label="发送人" />
      <el-table-column v-slot="{row}" align="center" prop="sendTime" label="发送时间">
        {{ row.sendTime ? row.sendTime.replace("T"," ") : '' }}
      </el-table-column>
      <!-- <el-table-column align="center" prop="inData" label="接口参数"> </el-table-column> -->
<!--      <el-table-column width="150" align="center" prop="deleteFlag" label="状态">-->
<!--        <template slot-scope="{row}">-->
<!--          <div>-->
<!--            {{ row.deleteFlag?'无效':'有效' }}-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
    <el-dialog width="55%" title="新增即时通知" :visible="addVisible" class="my-el-dialog" @close="closeDialog">
      <div>
        <div class="SelectBarWrap">
          <div class="SelectBar2" @keyup.enter="search">
            <div class="Selectli ejectInput">
              <span class="SelectliTitle">接收人:</span>
              <el-cascader
                v-model="filterObj.toUserList"
                :options="options"
                :props="props"
                clearable
                filterable
                @change="handleChange"
              />
            </div>
            <div class="Selectli ejectInput">
              <span class="SelectliTitle">抄送人:</span>
              <el-cascader
                v-model="filterObj.ccUserList"
                :options="options"
                :props="props"
                clearable
                filterable
                @change="handleChange2"
              />
            </div>
            <div class="Selectli ejectInput2">
              <span class="SelectliTitle">主题:</span>
              <el-input v-model="filterObj.theme" filterable clearable placeholder="请输入" />
              <span style='margin-left: 18px'>发送方式：</span>
              <el-checkbox v-model="filterObj.interior">站内</el-checkbox>
              <el-checkbox v-model="filterObj.email">邮件</el-checkbox>
            </div>
          </div>
        </div>
        <div class="Selectli">
          <div style="border: 1px solid #ccc;">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :default-config="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="html"
              style="height: 500px; overflow-y: hidden;"
              :default-config="filterObj.editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
          <div style="display: flex; align-items: center;  margin-top: 18px;">
            <el-button type="primary" class="TpmButtonBG" @click="parsingExcelBtn">上传附件</el-button>
            <input
              id="fileElem"
              ref="filElem"
              type="file"
              multiple='multiple'
              style="display: none"
              @change="parsingExcel($event)"
            >
            <div v-if="uploadFileName != ''" class="fileName">
              <div v-for="(item, index) in uploadFileName">
                <img
                  src="@/assets/upview_fileicon.png"
                  alt=""
                  class="upview_fileicon"
                >
                <span>{{ item }}</span>
                <span style="color: #4192D3; margin-left: 15px; cursor: pointer" @click="deleteLi(index)">删除</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 18px;">
            <el-button type="primary" class="TpmButtonBG" @click="confirm">发送</el-button>
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
  downloadFile
} from '@/utils'
import API from '@/api/masterData/masterData.js'
import selectAPI from '@/api/selectCommon/selectCommon'
import item from '@/layout/components/Sidebar/Item'
import { DomEditor } from '@wangeditor/editor'

export default {
  name: 'NotificationManagement',
  components: { Editor, Toolbar },
  directives: { elDragDialog, permission },

  data() {
    return {
      value: [],
      props: {
        multiple: true,
        expandTrigger: 'hover',
        emitPath: false,
        value: 'name',
        label: 'email',
        children: 'userList'
      },
      options: [{
        name: 1,
        email: '东南',
        userList: [
          { name: 2, email: '上海' },
          { name: 3, email: '上海' },
          { name: 4, email: '上海' }
        ]
      }, {
        name: 5,
        email: '东北',
        userList: [
          { name: 6, email: '北京' },
          { name: 7, email: '北京' },
          { name: 9, email: '北京' }
        ]
      }],
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
        interior: true,
        email: false,
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            // 配置上传图片
            uploadImage: {
              customUpload: this.uploadImg
            }
            // 继续其他菜单配置...
          }
        },
        toUserList: [],
        ccUserList: [],
        toUser: [],
        ccUser: []
      },
      changeFile: [],
      addVisible: false, // 导入弹窗
      permissions: getDefaultPermissions(),
      InterfaceList: [],
      uploadFileName: [],
      uploadFile: [],
      fileArr: [],
      sendUserList: [],
      ccUserList: [],
      tableData: [],
      dialogVisible: false,
      maxheight: getHeightSingle(),
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: {
        /* 工具栏配置 */
        toolbarKeys: [
          'headerSelect',
          'blockquote',
          '|',
          'bold',
          'underline',
          'italic',
          {
            key: 'group-more-style',
            title: '更多',
            menuKeys: ['through',
              'code',
              'sup',
              'sub',
              'clearStyle']
          },
          'color',
          'bgColor',
          '|',
          'fontSize',
          'fontFamily',
          'lineHeight',
          '|',
          'bulletedList',
          'numberedList',
          'todo',
          {
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
            key: 'group-justify',
            title: '对齐',
            menuKeys: ['justifyLeft',
              'justifyRight',
              'justifyCenter',
              'justifyJustify']
          },
          {
            iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
            key: 'group-indent',
            title: '缩进',
            menuKeys: ['indent',
              'delIndent']
          },
          // 菜单组，包含多个菜单
          // {
          //   key: 'group-image', // 必填，要以 group 开头
          //   title: '图片', // 必填
          //   iconSvg: '',
          //   menuKeys: ['uploadImage',
          //     'insertImage',
          //     'deleteImage',
          //     'editImage',
          //     'viewImageLink']
          // },
          // {
          //   key: 'group-video',
          //   title: '视频',
          //   iconSvg: '',
          //   menuKeys: ['insertVideo',
          //     'uploadVideo']
          // },
          // {
          //   key: 'group-link',
          //   title: '链接',
          //   menuKeys: ['insertLink', 'editLink', 'unLink', 'viewLink']
          // },
          '|',
          'emotion',
          // 'insertTable',
          {
            key: 'group-table',
            title: '表格',
            menuKeys: ['insertTable',
              'deleteTable',
              'insertTableRow',
              'deleteTableRow',
              'insertTableCol',
              'deleteTableCol',
              'tableHeader',
              'tableFullWidth']
          },
          'codeBlock',
          'divider',
          '|',
          'undo',
          'redo',
          'fullScreen'
        ]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            server: '/api/upload-image',
            fieldName: 'custom-field-name',
            // 继续写其他配置...
            // 【注意】不需要修改的不用写，wangEditor 会去 merge 当前其他配置
            // 上传之前触发
            onBeforeUpload(file) {
              console.log(file)
              // file 选中的文件，格式如 { key: file }
              return file
            },
            // 单个文件上传失败
            onFailed(file, res) {
              console.log(`${file.name} 上传失败`, res)
            },
            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
              console.log(`${file.name} 上传出错`, err, res)
            },
            customInsert(result, insertFn) {
              // result是返回的json格式
              // 从 result 中找到 url alt href ，然后插图图片
              // console.log(result.data)
              insertFn(result.data)
            }
          }
          // 继续其他菜单配置...
        }
      },
      mode: 'default', // or 'simple'
      arr1: []
    }
  },
  computed: {},
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      API.getNotification({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        content: this.filterObj.content,
        sendUser: this.filterObj.sendUser,
        State: this.filterObj.State
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
          this.options = res.data
          this.sendUserList.forEach(item => {
            item.email = item.name
            item.email1 = item.name
            item.userList.forEach(kk => {
              kk.email = kk.name + '(' + kk.email + ')'
              kk.name = item.email1 + kk.email
            })
          })
          this.ccUserList.forEach(item => {
            item.email = item.name
          })
          // console.log(this.options)
        }
      })
    },
    // 导入
    parsingExcel(event) {
      this.uploadFile = event.target.files
      let tempFileList=[]
      this.uploadFile.forEach(item => {
        tempFileList.push(item)
      })
      tempFileList.forEach(item => {
        // console.log(tempFileList, item.name)
        const kk = this.uploadFileName.includes(item.name)
        // console.log(kk)
        if (kk == false) {
          this.fileArr.push(item)
          this.uploadFileName.push(item.name)
        }
      })
      console.log(this.uploadFileName, 'tempFileList=>', tempFileList, 'fileArr=>', this.fileArr)
      // console.log('导入fileArr=》', this.fileArr, '导入uploadFile=》', this.uploadFile)
      event.srcElement.value = '' // 置空
      // event.target.files = ''
    },
    // 删除已选择的文件
    deleteLi(index) {
      this.uploadFileName.splice(index, 1)
      this.fileArr.splice(index, 1)
      console.log('删除=》', this.fileArr,)
    },
    // 导入弹出框
    confirm() {
      if (this.filterObj.theme !== '') {
        this.$confirm('请确认发送即时通知，谢谢！', '即时通知发送确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmImport()
          this.$message({
            type: 'success',
            message: '发送成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发送'
          })
        })
      } else {
        alert('必须填写主题内容')
      }
    },
    // 确认导入
    confirmImport() {
      const formData = new FormData()
      for (let i = 0; i < this.fileArr.length; i++) {
        formData.append('files', this.fileArr[i])
      }
      formData.append('toUserList', this.filterObj.toUser)
      formData.append('ccUserList', this.filterObj.ccUser)
      formData.append('theme', this.filterObj.theme)
      formData.append('content', this.html)
      formData.append('isZn', this.filterObj.interior ? 1 : 0)
      formData.append('isEmail', this.filterObj.email ? 1 : 0)
      API.importNormal(formData).then((res) => {
        if (res.code === 1000) {
          this.getTableData()
        } else {
          this.$message.info(this.messageMap.saveError)
        }
      })
      this.cancleWriteEmail()
    },
    // 接收人下拉框改变
    handleChange(value) {
      var toUser = []
      value.forEach(item => {
        var encode = item
        var re = /\([^\)]+\)/g
        encode = encode.match(re)[0]
        encode = encode.substring(1, encode.length - 1)
        toUser.push(encode)
      })
      this.filterObj.toUser = toUser
      value = this.filterObj.toUser
      this.filterObj.toUser = value
    },
    // 抄送人下拉框改变
    handleChange2(value) {
      var ccUser = []
      value.forEach(item => {
        var encode = item
        var re = /\([^\)]+\)/g
        encode = encode.match(re)[0]
        encode = encode.substring(1, encode.length - 1)
        ccUser.push(encode)
      })
      this.filterObj.ccUser = ccUser
      value = this.filterObj.ccUser
      this.filterObj.ccUser = value
    },
    // 写邮件弹窗展开
    writeEmail() {
      this.addVisible = true
    },
    // 取消写邮件
    cancleWriteEmail() {
      this.addVisible = false
      this.filterObj.toUserList = ''
      this.filterObj.ccUserList = ''
      this.filterObj.theme = ''
      this.html = '<p>Dear,User,</p>' + '</br></br></br></br></br></br></br></br></br></br>' + '<p>祝顺商祺！</p>' + '<p>iInvest运维团队</p>'
      this.fileArr = []
      this.uploadFileName = []
    },
    uploadImg(file, insertFn) {
      const imgData = new FormData()
      imgData.append('file', file)
      console.log(file, insertFn)
      // alert('上传图片，发送至后台')
      // 调用上传图片接口，上传图片  我这里testUpImg是测试接口
      API.importNormal(imgData).then(response => {
        if (response.data.code === 1000) {
          // 插入后端返回的url
          insertFn(response.data.data.url)
          alert('图片上传成功!')
        } else {
        }
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    closeDialog() {
      this.addVisible = false
    },
    // 导出数据
    exportData() {
      const formData = new FormData()
      formData.append('interfaceName', this.filterObj.interfaceName)
      formData.append('invokeDateSting', this.filterObj.invokeDateSting)
      API.exportMdDataInterface(formData).then((res) => {
        const timestamp = Date.parse(new Date())
        downloadFile(res, '监控管理 -' + timestamp + '.xlsx') // 自定义Excel文件名
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
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>Dear,User,</p>' + '</br></br></br></br></br></br></br></br></br></br>' + '<p>祝顺商祺！</p>' + '<p>iInvest运维团队</p>'
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
  }
}
</script>
<style>
.ejectInput .el-input--suffix{
  width: 850px !important;
}
.ejectInput2 .el-input--suffix{
  width: 630px !important;
}
.el-cascader .el-cascader__tags span{
  width: 120px;
}
.el-cascader__tags {
  display: inline-flex;
  /*flex-wrap: nowrap;*/
  /*margin-right: 60px;*/
}
</style>
<style lang="scss" scoped>

.SelectBar2 {
  align-items: center;
  flex-wrap: wrap;
  .Selectli {
    margin-right: 20px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    align-items: center;
    .SelectliTitle {
      // width: 70px;
      font-size: 14px;
      font-family: Source Han Sans CN Light;
      font-weight: 400;
      color: #4d4d4d;
      margin-right: 10px;
      white-space: nowrap;
      width: 85px;
      text-align: right;
    }
    .el-input__inner {
      background-color: #f0f2fa;
    }
    .el-range-input {
      background-color: #f0f2fa;
    }
    .el-select__tags {
      max-width: 220px !important;
    }
    .el-icon-arrow-up:before {
      content: '\e78f';
    }
    // .el-date-editor.el-input, .el-date-editor.el-input__inner {
    //   width: 230px !important;
    // }
    // .el-input--prefix .el-input__inner {
    //   padding-left: 10px;
    // }
    // .el-input__prefix {
    //   right: -150px;
    // }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      color: #888;
      font-size: 14px;
    }
  }
}
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

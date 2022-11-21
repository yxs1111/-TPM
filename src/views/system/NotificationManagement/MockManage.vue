<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="SelectBarWrap">
      <div class="SelectBar" @keyup.enter="search">
        <div class="Selectli">
          <span class="SelectliTitle">主题</span>
          <el-input
            v-model="filterObj.theme"
            filterable
            clearable
            placeholder="请输入"
          >
          </el-input>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">接受角色</span>
          <el-input
            v-model="filterObj.sendUser"
            filterable
            clearable
            placeholder="请输入"
          >
          </el-input>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">状态</span>
          <el-select
            v-model="filterObj.State"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in ['无效', '有效']"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </div>
        <el-button
          v-permission="permissions['get']"
          type="primary"
          class="TpmButtonBG"
          @click="search"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      border
      :max-height="580"
      :header-cell-style="HeadTable"
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="65"
        fixed
      >
      </el-table-column>
      <el-table-column align="center" label="操作" fixed width="180">
        <template v-slot="{ $index, row }">
          <div class="table_operation">
            <div class="haveText_editor" @click="writeEmail($index, row)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>编辑</span>
            </div>
            <div class="haveText_editor" @click="writeEmail($index, row, true)">
              <svg-icon icon-class="editor" class="svgIcon" />
              <span>查看</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="theme" label="主题" />
      <el-table-column
        align="center"
        prop="sendUser"
        label="接受角色/接受角色"
        width="180"
      />
      <el-table-column
        align="left"
        prop="triggerCondition"
        label="触发条件"
      />
      <el-table-column
        v-slot="{ row }"
        align="center"
        prop="type"
        label="通知类型"
      >
        {{ row.type ? '定时通知' : '即时通知' }}
      </el-table-column>
      <el-table-column v-slot="{ row }" align="center" prop="isZn" label="站内">
        {{ row.isZn ? '是' : '否' }}
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        align="center"
        prop="isEmail"
        label="邮件"
      >
        {{ row.isEmail ? '是' : '否' }}
      </el-table-column>
      <el-table-column width="150" align="center" prop="state" label="状态">
        <template slot-scope="{ row }">
          <div>
            {{ row.state ? '有效' : '无效' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="updateBy"
        label="修改人"
      >
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        align="center"
        prop="updateDate"
        label="修改时间"
        width="180"
      >
        {{ row.updateDate ? row.updateDate.replace('T', ' ') : null }}
      </el-table-column>
      <!-- <el-table-column align="center" prop="inData" label="接口参数"> </el-table-column> -->
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
    <!-- 编辑 -->
    <el-dialog
      width="55%"
      title="修改模板"
      :visible="addVisible"
      class="my-el-dialog"
      @close="cancleWriteEmail"
    >
      <div>
        <div class="SelectBarWrap">
          <div class="SelectBar2" @keyup.enter="search">
            <div class="Selectli ejectInput2">
              <span class="SelectliTitle2">主题</span>
              <span class='SelectliTitle3'>：</span>
              <el-input
                v-model="row.theme"
                filterable
                clearable
                placeholder="请输入"
                :disabled="true"
              />
            </div>
            <div class="Selectli ejectInput3">
              <span class="SelectliTitle">接收角色:</span>
              <el-select
                v-model="row.sendUser"
                multiple
                clearable
                :disabled="diaState"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class='Selectli2'>
            <div class='way'>
              <span>发送方式：</span>
              <el-checkbox v-model="row.isZn" :disabled="diaState">站内</el-checkbox>
              <el-checkbox v-model="row.isEmail" :disabled="diaState">邮件</el-checkbox>
            </div>
            <div class='state'>
              <span>状态</span>
              <span>：</span>
              <el-radio v-model="row.state" :disabled="diaState" :label="1">有效</el-radio>
              <el-radio v-model="row.state" :disabled="diaState" :label="0">无效</el-radio>
            </div>
          </div>
        </div>
        <div class="Selectli">
          <div style="border: 1px solid #ccc; position: relative">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :default-config="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="row.content"
              style="height: 500px; overflow-y: hidden"
              :default-config="filterObj.editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
            <div v-if="diaState" class="zhezhao"></div>
          </div>
          <div
            v-if="!diaState"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 18px;
            "
          >
            <el-button type="primary" class="TpmButtonBG" @click="confirm"
              >保存</el-button
            >
            <el-button
              type="primary"
              plain
              class="TpmButtonBG2"
              @click="cancleWriteEmail"
              >取消</el-button
            >
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
import { getDefaultPermissions, getHeightSingle } from '@/utils'
import API from '@/api/masterData/masterData.js'

export default {
  name: 'MockManage',
  components: { Editor, Toolbar },
  directives: { elDragDialog, permission },

  data() {
    return {
      options: [],
      total: 0,
      pageSize: 100,
      interior: false,
      email: false,
      radio: '1',
      pageNum: 1,
      diaState: false,
      filterObj: {
        interfaceName: '',
        invokeDateSting: '',
        content: '',
        sendUser: '',
        State: '',
        theme: '',
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            // 配置上传图片
            uploadImage: {
              customUpload: this.uploadImg,
            },
            // 继续其他菜单配置...
          },
        },
      },
      addVisible: false, // 导入弹窗
      permissions: getDefaultPermissions(),
      tableData: [],
      maxheight: getHeightSingle(),
      editor: null,
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
            menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle'],
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
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
            key: 'group-justify',
            title: '对齐',
            menuKeys: [
              'justifyLeft',
              'justifyRight',
              'justifyCenter',
              'justifyJustify',
            ],
          },
          {
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
            key: 'group-indent',
            title: '缩进',
            menuKeys: ['indent', 'delIndent'],
          },
          // 菜单组，包含多个菜单
          // {
          //   key: 'group-image', // 必填，要以 group 开头
          //   title: '图片', // 必填
          //   iconSvg: '<svg></svg>',
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
            menuKeys: [
              'insertTable',
              'deleteTable',
              'insertTableRow',
              'deleteTableRow',
              'insertTableCol',
              'deleteTableCol',
              'tableHeader',
              'tableFullWidth',
            ],
          },
          'codeBlock',
          'divider',
          '|',
          'undo',
          'redo',
          'fullScreen',
        ],
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
              insertFn(result.data)
            },
          },
          // 继续其他菜单配置...
        },
      },
      mode: 'default', // or 'simple'
      row: {
        theme: '',
        content: '',
        sendUser: [],
        isZn: '',
        isEmail: '',
        state: '',
        id: '',
      },
    }
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.tableData = []
      const { theme, sendUser, State } = this.filterObj
      API.getSimulation({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        theme,
        sendUser,
        State,
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
    // 获取下拉框
    getChannel() {
      API.recipientSelect().then((res) => {
        if (res.code === 1000) {
          this.options = res.data
        }
      })
    },
    // 导入弹出框
    confirm() {
      if (this.row.theme) {
        const { theme, content, sendUser, isZn, isEmail, state, id } = this.row
        API.editSimulation({
          theme,
          content,
          sendUser: sendUser.join(),
          isZn: isZn ? 1 : 0,
          isEmail: isEmail ? 1 : 0,
          state,
          id,
        }).then((res) => {
          if (res.code === 1000) {
            this.getTableData()
            this.cancleWriteEmail()
          } else {
            this.$message.info(this.messageMap.saveError)
          }
        })
      } else {
        alert('必须填写主题内容')
      }
    },
    // 编辑
    writeEmail(i, row, bool) {
      this.diaState = bool
      const { theme, content, sendUser, isZn, isEmail, state, id } = row
      this.row = {
        theme,
        content,
        sendUser: sendUser ? sendUser.split(',') : [],
        isZn: isZn ? true : false,
        isEmail: isEmail ? true : false,
        state,
        id,
      }
      this.addVisible = true
    },
    // 取消
    cancleWriteEmail() {
      this.addVisible = false
    },
    uploadImg(file, insertFn) {
      const imgData = new FormData()
      imgData.append('file', file)
      // alert('上传图片，发送至后台')
      // 调用上传图片接口，上传图片  我这里testUpImg是测试接口
      API.importNormal(imgData).then((response) => {
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
  mounted() {
    window.onresize = () => {
      return (() => {
        this.maxheight = getHeightSingle()
      })()
    }
    this.getTableData()
    this.getChannel()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
}
</script>
<style>
.el-select {
  width: 100%;
}
.ejectInput3 .el-input--suffix {
  width: 100% !important;
}
.ejectInput2 .el-input--suffix {
  width: 100% !important;
}
.el-cascader .el-cascader__tags span {
  width: 120px;
}
.el-cascader__tags {
  display: inline-flex;
  /*flex-wrap: nowrap;*/
  /*margin-right: 60px;*/
}
</style>
<style lang="scss" scoped>
.zhezhao {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  background-color: rgba($color: #f5f7fa, $alpha: 0.5);
  cursor: not-allowed;
}
.SelectBar2 {
  width: 77%;
  align-items: center;
  flex-wrap: wrap;
  .Selectli {
    display: inline-block;
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
      text-align: left;
    }
    .SelectliTitle2 {
      display: inline-block;
      width: 58px;
      text-align: justify;
      text-justify:distribute-all-lines; // 这行必加，兼容ie浏览器
      text-align-last: justify;
      // width: 70px;
      font-size: 14px;
      font-family: Source Han Sans CN Light;
      font-weight: 400;
      color: #4d4d4d;
      //width: 85px;
      //text-align: left;
    }
    .SelectliTitle3 {
       width: 15px;
      font-size: 14px;
      font-family: Source Han Sans CN Light;
      font-weight: 400;
      color: #4d4d4d;
      margin-right: 22px;
      white-space: nowrap;
      //width: 85px;
      //text-align: left;
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
.Selectli2 {
  width: 23%;
  display: inline-block;
  .way {
    text-align: right;
    line-height: 50px;
  }
  .state {
    text-align: right;
    line-height: 50px;
    span:first-child {
      display: inline-block;
      width: 56px;
      text-align: justify;
      text-justify:distribute-all-lines; // 这行必加，兼容ie浏览器
      text-align-last: justify;
    }
  }
}
.TpmButtonBG2 {
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

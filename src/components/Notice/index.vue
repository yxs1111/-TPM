<template>
  <div class="header-notice">
    <div class="notice-box" @click.stop="click">
<!--      <img src="@/assets/images/message.png" alt="" class="messageIcon" />-->
<!--      <i class="el-icon-bell notice-box-i"></i>-->
<!--      <div class="notice-box-txt">消息&nbsp;&nbsp;({{unreadNumberAll}})</div>-->
      <div class="notice-box-txt">更多</div>
    </div>
    <el-dialog :visible.sync="noticePage.dialogVisible" title="消息" width="70%" height="40%" class="my-el-dialog">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">主题:</span>
          <el-input v-model="filterObj.theme" class='themeInput' filterable clearable placeholder="请输入">
            <!--            <el-option v-for="item,index in InterfaceList" :key="index" :label="item.interfaceName" :value="item.interfaceName" />-->
          </el-input>
        </div>
        <el-button type="primary" class="TpmButtonBG" @click="search">查询</el-button>
      </div>
      <el-table ref="noticeListTable" v-loading="noticePage.searchLoading" :data="noticePage.noticePageProps.record" border fit stripe height="400"
        highlight-current-row @row-click="handleCurrentRowClick" @row-dblclick="handleCurrentRowDblClick" @selection-change="handleSelectionChange">
        <el-table-column align="center" width='70' prop="id" label="序号" />
        <el-table-column align="center" width='80' prop="createDate" label="操作">
          <template slot-scope="{ row }">
            <div class="flex">
<!--              <el-button type="primary" class="TpmButtonBG" @click="Read(row.id)">标记已读</el-button>-->
              <div class="haveText_editor" @click="detail(row)">
                <svg-icon icon-class="editor" class="svgIcon" />
                <span>查看</span>
              </div>
<!--              <el-button type="primary" class="TpmButtonBG" @click="detail(row)">查看</el-button>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width='420' prop="theme" label="主题" />
        <el-table-column v-slot="{row}" align="center" prop="type" label="通知类型">
          {{ row.type == 1 ? '定时通知' : '即时通知' }}
        </el-table-column>
        <el-table-column align="center" prop="createBy" label="发送人" />
        <el-table-column v-slot="{row}" align="center" prop="sendTime" label="发送时间">
          {{ row.sendTime ? row.sendTime.replace("T"," ") : '' }}
        </el-table-column>
      </el-table>
      <div class="TpmPaginationWrap">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="noticePage.noticePageProps.total" :page-size="noticePage.noticePageProps.pageSize"
          :current-page="noticePage.noticePageProps.pageNum" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-dialog>
    <!--信息框-->
    <el-dialog :title="noticePage.detailDialog.title" :visible.sync="noticePage.detailDialog.visible">
      <el-form :model="noticePage.detailDialog.data" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
        <el-form-item prop="id" label="序号">
          <span>{{ noticePage.detailDialog.data.id }}</span>
        </el-form-item>
        <el-form-item prop="theme" label="主题">
          <span>{{ noticePage.detailDialog.data.theme }}</span>
        </el-form-item>
        <el-form-item prop="type" label="通知类型">
          <span>{{ noticePage.detailDialog.data.type == 1 ? '定时通知' : '即时通知' }}</span>
        </el-form-item>
        <el-form-item prop="createBy" label="发送人">
          <span>{{ noticePage.detailDialog.data.createBy }}</span>
        </el-form-item>
        <el-form-item prop="sendTime" label="发送时间">
          <span>{{ noticePage.detailDialog.data.sendTime ? noticePage.detailDialog.data.sendTime.replace("T"," ") : ''  }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noticePage.detailDialog.visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import { Message } from 'element-ui'
import requestApi from '@/api/request-api'
import { getDefaultPermissions, parseTime } from '@/utils'
import permission from '@/directive/permission'
import auth from '@/utils/auth'
import API from '@/api/masterData/masterData'
export default {
  name: 'Notice',
  directives: { permission },
  filters: {
    // 状态样式
    statusStyleFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger',
      }
      return statusMap[status]
    },
    // 状态文字
    statusWordFilter(status) {
      const statusMap = {
        0: '未读',
        1: '已读',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      permissions: getDefaultPermissions(),
      noticePage: {
        searchLoading: false,
        noticePageProps: {
          record: null,
          total: 0,
          pageSize: 10,
          pageNum: 1,
        },
        title: [
          { label: '待办列表', name: '1', message: '111' },
          { label: '消息通知', name: '2', message: '222' },
          { label: '警告', name: '3', message: '333' },
        ],
        dialogVisible: false,
        category: '1',
        detailDialog: {
          title: '详情',
          visible: false,
          data: {
            title: null,
            senderName: null,
            createDate: null,
            markName: null,
            markDate: null,
            stateFlg: null,
            source: null,
          },
        },
      },
      unreadNumberAll: 0,
      unreadNumber: {},
      filterObj: {
        title: '',
        source: '',
        state: '',
      },
      checkarr:[], //选中的数组
    }
  },
  computed: {},
  watch: {
    'noticePage.category': {
      handler(newTitle) {
        this.initPageProps()
        this.fetchData(newTitle)
      },
      deep: true,
    },
  },
  mounted() {
    // WebSocket
    // if ('WebSocket' in window) {
    //   this.websocket = new WebSocket('ws://127.0.0.1:9004/websocket/admin')
    //   this.initWebSocket()
    // } else {
    //   Message.error({
    //     message: '当前浏览器 Not support websocket',
    //     duration: 10 * 1000,
    //   })
    // }
  },
  beforeDestroy() {
    // this.onbeforeunload()
  },
  methods: {
    search() {
      this.pageNum = 1
      this.getTableData()
    },
    getTableData() {
      this.tableData = []
      API.getNotification({
        pageNum: this.pageNum, // 当前页
        pageSize: this.pageSize, // 每页条数
        content: this.filterObj.content,
        theme: this.filterObj.theme,
        sendUser: this.filterObj.sendUser,
        State: this.filterObj.State
      }).then((response) => {
        this.noticePage.noticePageProps.record = response.data.records
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.total = response.data.total
      })
    },
    click() {
      this.noticePage.dialogVisible = true
      // this.getUnReadNum()
      this.initPageProps()
      this.fetchData(1)
    },
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage
      // 连接成功
      this.websocket.onopen = this.setOnopenMessage
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
      console.log(
        'WebSocket连接发生错误   状态码：' + this.websocket.readyState
      )
    },
    setOnopenMessage() {
      console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
      this.getUnReadNum()
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log('服务端返回：' + event.data)
      const res = JSON.parse(event.data)
      this.unreadNumberAll++
      this.instance = this.$notify.info({
        position: 'bottom-right', // 弹出位置
        showClose: false, // 是否显示关闭按钮
        title: res.title, // 标题
        message: res.content, // 内容
        duration: 0,
        onClick: () => {
          this.instance.close()
          this.getRowData(res)
        },
      })
    },
    setOncloseMessage() {
      console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      this.websocket.close()
    },
    // 查询方法
    fetchData(newTitle) {
      console.log(localStorage.usernameLocal, '本地账户，当前账户')
      this.noticePage.searchLoading = true
      requestApi
        .request_get('/mdm/mdEmailRecordRule/getPage', {
          title: this.filterObj.title,
          state: this.filterObj.state,
          category: this.noticePage.category,
          receiverCode: localStorage.usernameLocal,
          pageSize: this.noticePage.noticePageProps.pageSize,
          pageNum: this.noticePage.noticePageProps.pageNum,
        })
        .then((response) => {
          // this.formatTime(response.data.records)
          this.noticePage.noticePageProps.total = response.data.total
          this.noticePage.noticePageProps.record = response.data.records
        })
        .catch((error) => {
          console.log(error)
        })
      this.noticePage.searchLoading = false
    },
    // 获取未读消息数量
    getUnReadNum() {
      requestApi
        .request_get('/im/message/getUnReadNumByUsername', {
          username: auth.getLoginName(),
        })
        .then((response) => {
          const data = response.data
          this.unreadNumber = data
          this.unreadNumberAll = 0
          for (const i in data) {
            this.unreadNumberAll += data[i].count
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 消息已读
    receiveMessage(category, messageId) {
      requestApi
        .request_put('/im/message/receiveMessage', {
          id: messageId,
          readFlag: 1,
        })
        .then((response) => {
          this.unreadNumberAll--
          this.unreadNumber[category].count--
          this.fetchData(category)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    formatTime(records) {
      records.forEach((e) => {
        try {
          const createDate = new Date(e.createDate)
          e.createDate =
            createDate.getFullYear() +
            '/' +
            (createDate.getMonth() + 1) +
            '/' +
            createDate.getDate() +
            ' ' +
            createDate.getHours() +
            ':' +
            createDate.getMinutes() +
            ':' +
            createDate.getSeconds()
        } catch (exception) {
          console.log(exception)
          e.createDate = '-'
        }
      })
    },
    // 获取当前行详情
    getRowData(row) {
      this.resetDetailDialog()
      this.noticePage.detailDialog.visible = true
      this.noticePage.detailDialog.data = Object.assign({}, row)
      // 某类消息点击详情后可标记为已读，如消息通知
      if (row.readFlag === '0') {
        this.receiveMessage(row.category, row.id)
      }
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    },
    // 重置信息页面
    resetDetailDialog() {
      this.noticePage.detailDialog.data = {
        category: null,
        title: null,
        summary: null,
        content: null,
        senderName: null,
        deptName: null,
        createDate: null,
      }
    },
    initPageProps() {
      this.noticePage.noticePageProps = {
        record: null,
        total: 0,
        pageSize: 10,
        pageNum: 1,
      }
    },
    ReadAll() {
      requestApi
        .request_put('/cityplan/messageAudit/markReadAll', )
        .then((response) => {
          this.$message.success('全部已读成功')
          this.fetchData()
        })
    },
    Read(id) {
      console.log(this.checkarr);
      let arr=[]
      arr.push(id)
      requestApi
        .request_put('/cityplan/messageAudit/markRead', arr)
        .then((response) => {
          this.$message.success('已读成功')
          this.fetchData()
        })
    },
    //多个已读
    ReadMuti() {
      let list=[]
      this.checkarr.forEach(item=>{
        list.push(item.id)
      })
      console.log(list)
      requestApi
        .request_put('/cityplan/messageAudit/markRead', list)
        .then((response) => {

          this.$message.success('已读成功')
          this.fetchData()
        })
    },
    // 每页显示页面数变更
    handleSizeChange(size) {
      this.noticePage.noticePageProps.pageSize = size
      this.fetchData()
    },
    // 当前页变更
    handleCurrentChange(num) {
      this.noticePage.noticePageProps.pageNum = num
      this.fetchData()
    },
    handleCurrentRowClick() {},
    handleCurrentRowDblClick(res) {
      this.getRowData(res)
    },
    handleSelectionChange(val) {
      this.checkarr=val
      console.log(this.checkarr);
    },
    //查看详情
    detail(res) {
      this.getRowData(res)
    },
  },
}
</script>
<style>
.Selectli {
  margin-right: 20px;
  margin-bottom: 10px;
  display: inline-block;
  flex-wrap: nowrap;
  white-space: nowrap;
  align-items: center;
  .el-input {
    .el-input__inner {
      overflow:hidden !important;
      white-space:nowrap !important;
      text-overflow:ellipsis !important;
    }
  }
  .SelectliTitle {
    /*width: 70px;*/
    font-size: 14px;
    font-family: Source Han Sans CN Light;
    font-weight: 400;
    color: #4d4d4d;
    margin-right: 10px;
    white-space: nowrap;
    width: 85px;
    text-align: right;
  }
}
.TpmButtonBG {
  display: inline-block !important;
}
.flex .haveText_editor {
  cursor: pointer;
  display: flex;
  color: #3684fe;
  align-items: center;
}
.item .el-badge__content {
  position: absolute;
  top: 7px !important;
  right: 12px;
  -webkit-transform: translateY(-50%) translateX(100%);
  transform: translateY(-50%) translateX(100%);
}
.my-el-dialog .el-pager li {
  vertical-align: middle;
}
</style>
<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: center;
}
.flex_start {
  display: flex;
}
.notice-box {
  height: 40px;
  border-radius: 20px;
  // background: #f3f6fc;
  //margin-top: 25px;
  //margin-right: 20px;
}
.notice-box-txt {
  //height: 40px;
  //font-size: 12px;
  //color: #586aba;
  //float: left;
  line-height: 45px;
  font-size: 17px;
  color: #4192d3;
  cursor: pointer;
}
.notice-box-i {
  font-size: 20px;
  color: #586aba;
  float: left;
  vertical-align: middle;
  margin-top: 12px;
  margin-left: 15px;
  margin-right: 3px;
}
.header-notice {
  font-size: 0 !important;

  .notice-icon {
    cursor: pointer;
    font-size: 21px;
  }
}
.item {
  margin-top: 8px;
  margin-right: 10px;
}
.messageIcon {
  width: 22px;
  height: 19px;
}

.TpmButtonBG {
  height: 38 px;
  padding: 0 20 px;
  background: #4192d3;
  border: 1 px solid #e7e7e7;
  border-radius: 3 px;
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
  background-color: #4192d3 !important;
  color: #fff;
}
</style>

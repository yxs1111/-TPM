import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import Notice from '@/components/Notice'
import requestApi from '@/api/request-api'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission'
import { parseTime } from '@/utils'
import auth from '@/utils/auth'
import { Message } from 'element-ui'
import userApi from '@/api/system/user-api'

export default {
  directives: { elDragDialog, permission },
  data() {
    return {
      data: {},
      avatar: auth.getAvatar(),
      loginName: auth.getLoginName(),
      name: auth.getName(),
      visible: false,
      passState: false,
      updateData: {},
      updatePwVisible: false,
      updateLoading: false,
      updateRules: {
        oldPassword: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '数字，小写字母，大写字母，特殊符号至少包含三种，长度为 8 - 30位' }
        ],
        confirmPassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
      },
      path:'',
    }
  },
  created() {
    this.getUser()
  },
  filters: {
    // 锁定状态文字
    lockedWordFilter(locked) {
      const lockedMap = {
        '0': '未锁定',
        '1': '已锁定'
      }
      return lockedMap[locked]
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    Screenfull,
    LangSelect,
    Notice
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ]),
    getHomePath(){
      return this.$store.state.app.homePath
    }
  },
  watch:{
    getHomePath:{
      handler(da){
        this.path = this.$store.state.app.homePath
      },
      immediate:true,
      deep:true,
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
      //退出到CPT登录页
      // sessionStorage.removeItem('isFirstEntrySystem')
      // location.href = 'https://uat-cpt.rfc-friso.com/#/login'
    },
    async userinfo() {
      this.$router.push(`/user/personal`)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      if (this.$refs.select) {
        this.$refs.select.blur()
      }
    },
    // 查询方法
    getUser() {
      //username 大写字符串转小写
      let username = this.loginName.toLowerCase()
      requestApi.request_get('/auth/user/getByUsername', { username }).then(response => {
        const data = response.data
        this.data = data
        if (data.passState === '1') {
          this.passState = true
          this.updatePwVisible = false
        } else {
          this.passState = false
          this.updatePwVisible = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    },
    // 修改密码
    updatePw() {
      const id = this.data.id
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.updateData)
          if (params.oldPassword === params.newPassword) {
            Message.error({
              message: '新密码不能与原密码相同',
              duration: 10 * 1000
            })
            return
          }
          if (params.confirmPassword !== params.newPassword) {
            Message.error({
              message: '确认密码与新密码必须相同',
              duration: 10 * 1000
            })
            return
          }
          this.saveLoading = true
          params.id = id
          requestApi.request_post(userApi.url + '/updatePassword', params).then((res) => {
            this.saveLoading = false
            if (res && res.code === 1000) {
              this.updatePwVisible = false
              Message.success({
                message: '修改成功',
                duration: 5 * 1000
              })
              this.logout()
            }
          })
        }
      })
    }
  }
}

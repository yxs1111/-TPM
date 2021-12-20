<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <div class="title">欢迎登录</div>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <div class="VerificationWrap">
        <el-form-item class="code-input" prop="code">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入验证码"
            autocomplete="off"
            name="code"
            type="text"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <img
          v-show="imageCode && imageCode.length > 100"
          :src="imageCode"
          alt="codeImage"
          class="code-image"
          @click="getCodeImage"
        >
      </div>

      <div class="rememberPwd">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </div>
      <el-button
        :loading="loading"
        class="loginBtn"
        type="primary"
        @click.native.prevent="handleLogin"
      >Login
      </el-button>
      <div class="WechatWrap">
        <el-divider>企业微信登录</el-divider>
        <img
          src="@/assets/images/login/wechatIcon.png"
          alt=""
          class="wechatImg"
          @click="loginByWechat"
        >
      </div>
    </el-form>
    <div class="niu" />
    <div v-show="isLoginByWechat" class="WechatLogin">
      <div class="WechatBar">
        <!-- <div class="login-box">
          <div class="wx-box">
            <div id="wx_box" />
          </div>
        </div> -->
        <!-- <iframe class="wechat" name="wechat"
          src="https://corpwechat-test.rfc-friso.com/Api/Oauth/Qrcode?configid=9&redirect_uri=https://corpwechat-test.rfc-friso.com/Api/Oauth/sendwx" frameborder="0"></iframe> -->
        <!-- <div class="loginByWechatText">企业微信登录</div> -->
        <!-- <iframe id="content" sandbox="allow-presentation allow-popups-to-escape-sandbox allow-modals allow-forms allow-same-origin allow-scripts allow-top-navigation" referrerpolicy="unsafe-url" :src="srcUrl" frameborder="0" /> -->
        <!-- <div class="Ercode"></div> -->
        <!-- <div class="loginByWechat">请使用企业微信扫码登录</div> -->
        <div class="closeIcon" @click="closeWechat">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { randomNum } from '@/utils'
import user from '@/api/system/user'
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      srcUrl: 'https://corpwechat-test.rfc-friso.com/Api/Oauth/Qrcode?configid=9&redirect_uri=https://corpwechat-test.rfc-friso.com/Api/Oauth/sendwx',
      loginForm: {
        username: 'admin',
        password: '',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      randomId: randomNum(24, 16),
      imageCode: '',
      checked: false, // 记住密码
      isLoginByWechat: false,
      closeGetWX: false,
      secure: '',
      finalEmail: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCodeImage()
    this.getCookie()
    // 获取地址
    this.getUrl()
  },
  methods: {
    getUrl() {
      const url = window.location.href
      if (url.indexOf('email') === -1) {
        return
      } else {
        const emailInfo = url.split('?')[1]
        const reg = new RegExp('email=')
        const nextEmail = emailInfo.replace(reg, '')
        const regNew = new RegExp('#/login')
        this.finalEmail = nextEmail.replace(regNew, '')
        this.getWX()
      }
    },
    getWXiNFO() {
      const stop = setInterval(() => {
        this.getWX()
        if (this.closeGetWX) {
          clearInterval(stop)
        }
      }, 10000)
    },
    // 调用微信登录接口
    getWX() {
      // 调用getWeChatData进行email解密
      user.getWeChatData({
        email: this.finalEmail
      }).then(res => {
        if (res.code === 1000) {
          // 解密成功 根据返回email明文 登录
          const formdata = new FormData()
          formdata.append('email', res.data.email)
          this.$store
            .dispatch('user/WXlogin', formdata)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.$refs['code'].clear()
              this.getCodeImage()
            })
        }
      }).catch()

      // axios
      //   .get('/Api/Oauth/sendwx')
      //   .then(response => {
      //     // this.secure = response.data.split('<br>')[2].replace('密文：', '')
      //     user.getWeChatData({
      //       email: this.finalEmail
      //     }).then(res => {
      //       if (res.code === 1000) {
      //         const formdata = new FormData()
      //         formdata.append('email', res.data.email)
      //         // this.closeGetWX = true
      //         // this.loading = false
      //         // this.isLoginByWechat = false
      //         this.$store
      //           .dispatch('user/WXlogin', formdata)
      //           .then(() => {
      //             this.$router.push({ path: this.redirect || '/' })
      //           })
      //           .catch(() => {
      //             this.$refs['code'].clear()
      //             this.getCodeImage()
      //           })
      //       }
      //     }).catch()
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.closeGetWX = true
          this.loading = true
          this.loginForm['key'] = this.randomId
          if (this.checked == true) {
            this.$store
              .dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/' })
              })
              .catch(() => {
                this.$refs['code'].clear()
                this.getCodeImage()
              })
          } else {
            this.clearCookie()
          }
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.$refs['code'].clear()
              this.getCodeImage()
            })
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 获取验证码
    getCodeImage() {
      user
        .getCaptcha(this.randomId)
        .then((res) => {
          if (res.byteLength <= 100) {
            this.$message({
              message: '系统维护中，请稍微再试',
              type: 'error'
            })
          }
          return (
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(res).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          )
        })
        .then((res) => {
          this.imageCode = res
        })
        .catch((e) => {
          console.log(e)
        })
    },
    redirectToRegister() {
      this.$router.push('/register')
    },
    // 记住密码功能
    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires='
      window.document.cookie = 'userPassword' + '=' + c_pwd + ';path=/;expires='
    },
    // 读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.loginForm.username = arr2[1]
          } else if (arr2[0] == 'userPassword') {
            this.loginForm.password = arr2[1]
          }
          if (this.loginForm.username != '' && this.loginForm.password != '') {
            this.checked = true
          }
        }
      }
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    // 企业微信登录
    loginByWechat() {
      // 1
      // this.isLoginByWechat = true
      // this.getWXiNFO()
      // 2
      window.open('https://corpwechat-test.rfc-friso.com/Api/Oauth/Qrcode?configid=9&redirect_uri=http://localhost:8080/#/login', '_self')
      // // 1. 先选择iframe
      // var iframe = document.querySelector('.wechat').contentWindow
      // // 2. 选择iframe内的元素
      // var qrcode = iframe.document.querySelector('.qrcode')
      // console.log(qrcode);
    },
    closeWechat() {
      this.isLoginByWechat = false
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #f3f7f8;
$light_gray: #888;
$cursor: #888;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background: url('../../../assets/images/loginBg.jpg') repeat;
  background-size: 100% 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form {
    background-color: #fff;
  }
  .el-form-item {
    border-radius: 30px;
    color: #454545;
    background-color: #f3f7f8;
  }
  .el-divider__text {
    font-size: 14px;
    color: #888;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  max-height: 100%;
  width: 100%;
  height: 100vh;
  position: relative;
  .login-form {
    position: absolute;
    z-index: 3;
    width: 500px;
    max-width: 100%;
    padding: 20px 60px;
    box-sizing: border-box;
    margin: 0 auto;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    border-radius: 30px;
    box-shadow: -2px 0px 24px 0px rgba(127, 127, 127, 0.24);

    .code-input {
      width: 70%;
      border-radius: 30px;
      display: inline-block;
      background-color: #f3f7f8;
      vertical-align: middle;
    }

    .code-image {
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      margin-bottom: 22px;
    }
    .VerificationWrap {
      display: flex;
      align-items: center;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-family: SourceHanSansCN-Medium;
      font-size: 30px;
      color: #000;
      text-align: left;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
  }
  .rememberPwd {
    font-family: SourceHanSansCN-Regular;
    font-size: 14px;
    color: #888888;
    margin-bottom: 10px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .loginBtn {
    width: 100%;
    height: 50px;
    border-radius: 30px;
    background-color: #4192d3;
    margin-bottom: 15px;
  }
  .WechatWrap {
    text-align: center;
    font-size: 14px;
    color: #888888;
    .wechatImg {
      width: 66px;
      height: 66px;
      margin: 10px 0;
      cursor: pointer;
    }
  }
  .loginBar {
    position: relative;
  }
  .niu {
    position: absolute;
    top: calc(20% - 170px);
    left: calc(50% - 253px);
    width: 253px;
    height: 230px;
    z-index: 2;
    background: url('../../../assets/images/login/niuImg.png');
    transform: scale(0.5);
  }
  .WechatLogin {
    height: 100vh;
    position: relative;
    background: rgba(0, 0, 0, 0.8);
    z-index: 6;
    .WechatBar {
      width: 500px;
      height: 560px;
      position: relative;
      z-index: 7;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 60px 60px 40px 60px;
      box-sizing: border-box;
      .loginByWechat {
        width: 280px;
        height: 60px;
        font-size: 16px;
        line-height: 60px;
        text-align: center;
        color: #fff;
        background: #1e1e1e;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.35);
        border-radius: 30px;
      }
      .loginByWechatText {
        font-size: 22px;
        font-family: Source Han Sans CN;
        font-weight: 500;
      }
      .Ercode {
        width: 230px;
        height: 226px;
        background-color: #ccc;
      }
      .closeIcon {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  }
}
#content {
  height: 100%;
  width: 100%;
}
</style>

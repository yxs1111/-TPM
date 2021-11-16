<template>
  <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <div class="title-container">
          <div class="title">欢迎登录</div>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1" autocomplete="on" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" autocomplete="on"
            @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div class="VerificationWrap">
          <el-form-item class="code-input" prop="code">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input ref="code" v-model="loginForm.code" placeholder="请输入验证码" autocomplete="off" name="code" type="text" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <img v-show="imageCode && imageCode.length > 100" :src="imageCode" alt="codeImage" class="code-image" @click="getCodeImage">
        </div>
        
        <div class="rememberPwd">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <el-button :loading="loading" class="loginBtn" type="primary" @click.native.prevent="handleLogin">Login
        </el-button>
        <div class="registerWrap">
          还没账户？<span class="register">去注册</span>
        </div>
      </el-form>
      <div class="niu"></div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { randomNum } from '@/utils'
import user from '@/api/system/user'

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
      loginForm: {
        username: 'admin',
        password: '',
        code: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      randomId: randomNum(24, 16),
      imageCode: '',
      checked: false, //记住密码
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  mounted() {
    this.getCodeImage()
    this.getCookie()
  },
  methods: {
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
          this.loading = true
          this.loginForm['key'] = this.randomId
          if (this.checked == true) {
            this.setCookie(this.loginForm.username, this.loginForm.password, 7)
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
              type: 'error',
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
    //记住密码功能
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
      //字符串拼接cookie
      window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires='
      window.document.cookie = 'userPassword' + '=' + c_pwd + ';path=/;expires='
    },
    //读取cookie
    getCookie: function () {
      console.log(document.cookie)
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') //再次切割
          //判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.loginForm.username = arr2[1]
          } else if (arr2[0] == 'userPassword') {
            this.loginForm.password = arr2[1]
          }
        }
      }
    },
    //清除cookie
    clearCookie: function () {
      this.setCookie('', '', '', -1) //修改2值都为空，天数为负1天就好了
    },
  },
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
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
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
  .registerWrap {
    text-align: center;
    font-size: 16px;
    color: #000000;
    .register {
      color: #4192d3;
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
}
</style>

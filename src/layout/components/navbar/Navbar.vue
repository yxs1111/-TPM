<template>
  <div :class="path=='Dashboard'?'navbar navbar-first':'navbar navbar-second'">
    <div class="breadcrumb-container">
      <img src="../../../../src/assets/images/logo.png" alt="菲仕兰">
    </div>
    <div v-if="path=='Dashboard'" class="layOutBtn">
      <div>操作</div>
    </div>
    <div v-else class="right-menu">
      <!--          <template v-if="device!=='mobile'">-->
      <!--            <search id="header-search" class="right-menu-item" />-->
      <!--            <screenfull id="screenfull" class="right-menu-item hover-effect" />-->
      <!--            <lang-select class="right-menu-item hover-effect" />-->
      <!--            <notice class="right-menu-item" />-->
      <!--          </template>-->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="user-name">您好，{{loginName}} <i class="el-icon-arrow-right"></i></div>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="">
          <!--              <em class="el-icon-caret-bottom" />-->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="visible=true">
            <span style="display:block;">用户信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="updatePwVisible=true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="notice-box" >
        <notice class="right-menu-item" />
      </div>
      <div style="clear: both"></div>
    </div>
    <!-- 信息 -->
    <el-dialog v-el-drag-dialog title="用户信息" :visible.sync="visible" @dragDialog="handleDrag">
      <el-form
        ref="infoForm"
        :model="data"
        label-position="left"
        label-width="90px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="用户名">
          <span>{{ data.name }}</span>
        </el-form-item>
        <el-form-item label="登录名">
          <span>{{ data.loginName }}</span>
        </el-form-item>
        <el-form-item label="电话号码">
          <span>{{ data.phone }}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ data.email }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span v-show="data.gender === 0">男</span>
          <span v-show="data.gender === 1">女</span>
          <span v-show="data.gender === 2">其他</span>
        </el-form-item>
        <el-form-item label="过期时间">
          <span>{{ parseJson(data.expireAt, '{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      v-el-drag-dialog
      :title="passState ? '修改密码' : '请修改原始密码'"
      :visible.sync="updatePwVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @dragDialog="handleDrag"
    >
      <el-form
        ref="updateForm"
        :model="updateData"
        :rules="updateRules"
        label-position="left"
        label-width="90px"
        style="width: 600px; margin-left:50px;"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="updateData.oldPassword"
            maxlength="50"
            :clearable="true"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="updateData.newPassword"
            maxlength="50"
            :clearable="true"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="updateData.confirmPassword"
            maxlength="50"
            :clearable="true"
            show-password
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="passState" @click="updatePwVisible = false">
          关闭
        </el-button>
        <el-button type="primary" :loading="updateLoading" @click="updatePw">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./Navbar.js"></script>

<style lang="scss" scoped>
  .notice-box{
    float: left;font-size: 12px;color: #586ABA;
  }
  .navbar-first {
    background-color: #4192d3;
    background-size: 100% 100%;
  }
  .navbar-second {
    background-color: #4192d3;
    background-size: 100% 100%;
  }
  .navbar {
    height: 80px;
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }
  .layOutBtn {
    width: calc(100% - 320px);
    height: 80px;
    line-height: 80px;
    float: left;
  }

  .layOutBtn div {
    width: 60px;
    height: 26px;
    line-height: 26px;
    background: #348DF2;
    border-radius: 18px;
    color: #ffffff;
    text-align: center;
    font-size: 12px;
    float: right;
    margin-top: 27px;
    margin-right: 20px;
  }

  .breadcrumb-container {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    font-size: 20px;
    font-weight: bold;
    color: #105AAE;
    height: 80px;
    line-height: 80px;
    padding-left: 36px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

  &
  :focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

  &
  .hover-effect {
    cursor: pointer;
    transition: background .3s;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }
  }

  .avatar-container {
    float: left;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

  .user-avatar {
    cursor: pointer;
    margin-top: 15px;
    float: left;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-name {
    height: 60px;
    float: left;
    line-height: 75px;
    margin-right: 10px;
    color: #fff;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }

  }
  }
  }
  }
</style>

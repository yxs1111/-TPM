<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      class="register-form"
      autocomplete="on"
      label-position="left"
      label-width="90px"
      style="width: 600px; margin-left:50px;"
    >
      <div style="margin-bottom: 50px;">
        <el-steps
          :space="space"
          :active="active"
          process-status="process"
          finish-status="success"
          align-center
        >
          <el-step title="步骤 1" description="这是一段很长很长很长的描述性文字" />
          <el-step title="步骤 2" description="这是一段很长很长很长的描述性文字" />
          <el-step title="步骤 3" description="这段就没那么长了" />
        </el-steps>
      </div>
      <el-form-item v-show="active === 0" label="手机号" prop="phone">
        <el-input v-model="registerForm.phone" maxlength="11" :clearable="true" placeholder="请输入手机号码" show-word-limit>
          <el-select slot="prepend" v-model="value" placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item v-show="active === 0" class="code-input" label="短信验证码" prop="code">
        <el-input
          ref="code"
          v-model="registerForm.code"
          placeholder="请输入验证码"
          autocomplete="off"
          name="code"
          type="text"
          @keyup.enter.native="next"
        />
      </el-form-item>
      <el-button
        v-show="active === 0"
        type="primary"
        class="code-send"
      >发送验证码
      </el-button>
      <el-button
        v-show="active > 0"
        type="primary"
        class="step-button"
        @click="pre"
      >上一步
      </el-button>
      <el-button
        v-show="active < 3"
        type="primary"
        class="step-button"
        @click="next"
      >下一步
      </el-button>
    </el-form>
  </div>
</template>

<script src="./index.js">

</script>

<style lang="scss" scoped>
.code-input {
  width: 70%;
  display: inline-block;
  vertical-align: middle;
}

.code-send {
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  margin-left: 15px;
}
.step-button {
  width:45%;
  margin-bottom:30px;
  display: inline-block;
}
</style>

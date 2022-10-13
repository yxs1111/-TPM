<!--
 * @Description: 门户--选择TPM||CPT||MDM
 * @Date: 2022-09-01 11:35:31
 * @LastEditTime: 2022-09-29 14:10:31
-->
<template>
  <div class="portalWrap">
    <div class="systemWrap">
      <div class="systemLi" v-wave="{color: '#54af45',initialOpacity: 0.5,easing: 'ease-in'}" @click="goCpt">
        <img src="@/assets/images/portal/cpt.png" alt="" class="systemImg cpt" />
        <div class="systemName">CPT</div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
      </div>
      <div class="systemLi" @click="goTPM" v-wave="{color: '#4192d3',initialOpacity: 0.5,easing: 'ease-in'}">
        <img src="@/assets/images/portal/tpm.png" alt="" class="systemImg" />
        <div class="systemName">TPM</div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
      </div>
      <div class="systemLi" @click="goMDM" v-wave="{color: '#f7931f',initialOpacity: 0.5,easing: 'ease-in'}">
        <img src="@/assets/images/portal/mdmDark.png" alt="" class="systemImg" />
        <div class="systemName">接口数据</div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
      </div>
      <div class="systemLi" v-wave="{color: '#999',initialOpacity: 0.5,easing: 'ease-in'}">
        <img src="@/assets/images/portal/soon.png" alt="" class="systemImg" />
        <div class="systemName">
          <div>Coming soon....</div>
          <div class="subTitle">
            <span>更多精彩内容</span>
            <br />
            <span>敬请期待</span>
          </div>
        </div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
      </div>
    </div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { encrypt, decrypt } from '@/utils/crypto/crypto-util'
export default {
  name: 'Portal',

  data() {
    return {}
  },

  mounted() {},
  methods: {
    goTPM() {
      this.$router.push('/dashboard')
    },
    async goCpt() {
      let username = sessionStorage.getItem('username')
      let password = sessionStorage.getItem('password')
      let loginObj = {
        username,
        password
      }
      //验证TPM账号
      await this.$store.dispatch('user/loginCPT', { ...loginObj })
    },
    async goMDM() {
      // let username = sessionStorage.getItem('username')
      // let password = sessionStorage.getItem('password')
      // let loginObj = {
      //   username,
      //   password
      // }
      // //验证TPM账号
      // await this.$store.dispatch('user/loginOtherSystem', { ...loginObj })
    },
  }
}
</script>

<style lang="scss" scoped>
.portalWrap {
  width: 100%;
  height: 100%;
  background-image: url('./../../../assets/images/portal/portalBG.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  position: relative;
  .systemWrap {
    width: 80%;
    height: 500px;
    background-image: url('./../../../assets/images/portal/systemWrapBG.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background-color: #F5F5F5;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-around;
    .systemLi {
      width: 330px;
      height: 380px;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 40px 25px;
      cursor: pointer;
      position: relative;
      .systemImg {
        width: 90%;
        height: 250px;
      }
      .systemName {
        margin-top: 20px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #181818;
        .subTitle {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #979797;
        }
      }
      .cycle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: absolute;
        bottom: -25px;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateX(-50%);
        background-color: #54af45;
      }
      &:nth-child(2) .cycle {
        background-color: #4192d3;
      }
      &:nth-child(3) .cycle {
        // background-color: #f7931f;
        background-color: #999999;
      }
      &:nth-child(4) .cycle {
        background-color: #999999;
      }
    }
    .systemLi:hover {
      transform: scale(1.1);
      .cycle {
        box-shadow: 0 0 6px #cbcbcc;
      }
    }
    .systemLi:hover,
    .cycle:hover {
      box-shadow: 0 0 6px #cbcbcc;
    }
    .cpt {
      margin-left: 0px;
    }
  }
  .logo {
    width: 200px;
    height: 210px;
    background-image: url('./../../../assets/images/portal/portalLogo.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    position: absolute;
    top: 57px;
    left: 60px;
  }
}
</style>

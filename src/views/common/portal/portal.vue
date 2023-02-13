<!--
 * @Description: 门户--选择TPM||CPT||MDM
 * @Date: 2022-09-01 11:35:31
 * @LastEditTime: 2023-02-10 17:12:22
-->
<template>
  <div class="portalWrap">
    <div class="systemWrap">
      <div class="systemLi" v-wave="{color: '#54af45',initialOpacity: 0.5,easing: 'ease-in'}" @mouseenter="showCPTSelect" @mouseleave="hiddenCPTSelect">
        <img src="@/assets/images/portal/cpt.png" alt="" class="systemImg cpt" />
        <div class="systemName">CPT</div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
        <div class="selectHover"></div>
        <div class="CPTSelect" v-if="isCptVisible">
          <div class="CPTSelectContent">
            <div class="CPTSelectContentItem" @click="goSalesCpt">
              <img src="@/assets/images/portal/Sales CPT.png" class="CPTSelectContentItemSystemImg" />
              <div class="CPTSelectContentItemTitleWrap">
                <span class="CPTSelectContentItemTitle">Sales CPT</span>
                <svg-icon icon-class="nextStepCPT" style="font-size: 20px;" />
              </div>
            </div>
            <div class="CPTSelectContentItem" @click="goMarketingCpt">
              <img src="@/assets/images/portal/Marketing CPT.png" class="CPTSelectContentItemSystemImg" />
              <div class="CPTSelectContentItemTitleWrap">
                <span class="CPTSelectContentItemTitle">Marketing CPT</span>
                <svg-icon icon-class="nextStepCPT" style="font-size: 20px;" />
              </div>
            </div>
          </div>
          <!-- 三角 -->
          <div class="triangle"></div>
        </div>
      </div>
      <div class="systemLi" @click="goTPM" v-wave="{color: '#4192d3',initialOpacity: 0.5,easing: 'ease-in'}">
        <img src="@/assets/images/portal/tpm.png" alt="" class="systemImg" />
        <div class="systemName">TPM</div>
        <div class="cycle">
          <svg-icon icon-class="nextStep" style="font-size: 20px;" />
        </div>
      </div>
      <div class="systemLi" @click="goTPMContract" v-wave="{color: '#999',initialOpacity: 0.5,easing: 'ease-in'}">
        <img src="@/assets/images/portal/contract.png" alt="" class="systemImg" />
        <div class="systemName">合同管理</div>
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
    </div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { encrypt, decrypt } from '@/utils/crypto/crypto-util'
export default {
  name: 'Portal',

  data() {
    return {
      isCptVisible: false,
    }
  },

  mounted() {},
  methods: {
    goTPM() {
      // 页面地址跳转，不会刷新页面
      // window.location.href = 'https://uat-iinvest.rfc-friso.com:8080/#/login'
      // window.location.href = 'http://localhost:8080/#/login'
      this.$router.push('/dashboard')
    },
    goTPMContract() {
      this.$router.push('/login?redirect=/contractManagement/ContractEntry/CustomerContractEntry')
      // this.$router.push('/contractManagement/ContractEntry/CustomerContractEntry')
      // window.location.href = 'https://iinvest.rfc-friso.com/login?redirect=/contractManagement/ContractEntry/CustomerContractEntry'
      // window.location.href = 'http://localhost:8080/#/login?redirect=/contractManagement/ContractEntry/CustomerContractEntry'
    },
    async goSalesCpt() {
      // window.location.href = 'http://localhost:8081/#/login'
      // window.location.href = 'https://cpt.rfc-friso.com/SalesCPT/login'
      window.location.href = 'https://cpt.rfc-friso.com/#/login'
      return
      let username = sessionStorage.getItem('username')
      let password = sessionStorage.getItem('password')
      let loginObj = {
        username,
        password,
      }
      //验证TPM账号
      await this.$store.dispatch('user/loginCPT', { ...loginObj })
    },
    async goMarketingCpt() {
      window.location.href = 'https://cpt.rfc-friso.com/MarketingCPT/login'
      return
      let username = sessionStorage.getItem('username')
      let password = sessionStorage.getItem('password')
      let loginObj = {
        username,
        password,
      }
      //验证TPM账号
      await this.$store.dispatch('user/loginMarketingCPT', { ...loginObj })
    },
    showCPTSelect() {
      this.isCptVisible = true
    },
    hiddenCPTSelect() {
      this.isCptVisible = false
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
  },
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
    height: 50%;
    background-image: url('./../../../assets/images/portal/systemWrapBG.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background-color: #F5F5F5;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    display: flex;
    justify-content: space-around;
    .systemLi {
      width: 330px;
      height: 78%;
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
        height: 60%;
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
      &:nth-child(4) .cycle {
        // background-color: #f7931f;
        background-color: #999999;
      }
      &:nth-child(3) .cycle {
        background-color: #4192d3;
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
  .CPTSelect {
    position: absolute;
    bottom: -10px;
    left: 0;
    transform: translateY(105%);
    width: 450px;
    background: #ffffff;
    box-shadow: 0px 3px 32px 0px rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    .CPTSelectContent {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      .CPTSelectContentItem {
        width: 40%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .CPTSelectContentItemSystemImg {
          width: 167px;
          height: 100px;
        }
        .CPTSelectContentItemTitleWrap {
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #181818;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          .CPTSelectContentItemTitle {
            margin-right: 10px;
          }
        }
      }
    }
    .triangle {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #fff;
      position: absolute;
      top: -9px;
      left: 37%;
      transform: translateX(-50%);
    }
  }
  .selectHover {
    background: transparent;
    position: absolute;
    bottom: -32px;
    width: 100%;
    height: 30px;
  }
}
</style>

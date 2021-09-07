<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
<!--    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ roles }} <br> </span></div>-->
    <div class="emptyDiv"></div>
    <div class="swiperDivBox">
      <div class="swiperDiv" >

      </div>
      <div class="userMes" >
          <div class="userMesImg">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="">
          </div>
          <div class="userMesBtn" >
            <div class="userMesName" >您好，{{name}}</div>
            <div class="userMesBtnList">
              <img class="firstIcon" src="../../../assets/images/background/design.png" height="15" width="15"/>
              <img class="secondIcon" @click="logout" src="../../../assets/images/background/tuichu.png" height="15" width="17"/>
            </div>
          </div>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="contentDiv"></div>
    <div class="bottomDiv"></div>
  </div>
</template>

<script>
import auth from '@/utils/auth'

export default {
  name: 'Dashboard',
  created() {

  },
  data() {
    return {
      avatar: auth.getAvatar(),
      name: auth.getName(),
      // roles: auth.getRoles()
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
  }
}
</script>

<style lang="scss" scoped>
  .userMes{
    margin-left: 1.25%;
    height: 145%;
    width: 16.25%;
    background: #ffffff;
    float: left;
    border-radius: 6px;
    margin-top: -3.5%;
    position: relative;
    z-index: 9999;
  }
  .userMesBtn{
    width: 90%;
    margin-left: 5%;
    background: #F7F7F7;
    border-radius: 6px;
    height: calc(100% - 40px);
    margin-top: -10px;
  }
  .userMesName{
    font-size: 14px;
    color: #777777;
    width: 100%;
    text-align: center;
    padding-top: 15%;
  }
  .userMesImg{
    position: relative;
    z-index: 999;
    margin-top: -35px;
    width: 70px;
    height: 70px;
    margin-left: calc((100% - 70px)/2);
    border-radius: 50%;
    overflow: hidden;
    background: #ffffff;
  }
  .userMesBtnList{
    margin-top: 10%;
  }
  .firstIcon{
    margin-left: 40%;
    margin-right: 5%;
  }
  .userMesImg img{
    margin-left: 10px;
    margin-top: 10px;
    width:50px;
    height:50px;
    border-radius: 50%;
  }
  .emptyDiv{
    width: 100%;height: 1.75%;
  }
  .swiperDivBox{
    width: 100%;
    height: 17.35%;
  }
  .swiperDiv{
    height: 100%;
    background: #FFFFFF;
    border-radius: 6px;
    width: 80%;
    margin-left: 1.25%;
    float: left;
  }
  .contentDiv{
    width: 94%;
    margin-left: 3%;
    height: 45.45%;
    margin-top: 1.75%;
    background: #FFFFFF;
    border-radius: 6px;
  }
  .bottomDiv{
    width: 94%;
    margin-left: 3%;
    height: 26.65%;
    margin-top: 1.75%;
    background: #FFFFFF;
    border-radius: 6px;
  }
  .dashboard-container{
    height:calc(100vh - 150px);
    width: 100%;
    background: #E0E6F1;
    margin: 0!important;
  }
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

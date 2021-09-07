<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <div v-if="!leftMenuToggle" class="inOutTex">
      <img src="../../assets/images/background/in.png"  height="22" width="22"/>
      收起菜单
    </div>

    <div v-else class="inOutTexDis">
      <img src="../../assets/images/background/out.png" height="22" width="22"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      leftMenuToggle:false,
    }},
  methods: {
    toggleClick() {
      this.leftMenuToggle = !this.leftMenuToggle
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
  .inOutTex{
    color: #E1E6F2;
    background-color: #062656;    font-size: 14px;
    padding:8px 0 0 0;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;height: 56px;line-height: 56px;
  }
  .inOutTexDis{
    color: #E1E6F2;
    padding-top: 12px;
    background-color: #062656;    font-size: 14px;
    cursor: pointer;
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
    transition: border-color .3s,background-color .3s,color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;height: 56px;line-height: 56px;
  }
  .inOutTex img{
    vertical-align:middle;margin-top: -6px;margin-right: 8px;
  }
</style>

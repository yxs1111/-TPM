<!--
 * @Description: 
 * @Date: 2022-05-10 13:11:40
 * @LastEditTime: 2022-07-19 09:09:38
-->
<template>
  <div class="V0">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AprilUiV0',

  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.V0 {
  height: calc(100% - 80px);
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
}
</style>
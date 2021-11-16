<!--
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2021-11-16 14:53:25
-->
<template>
  <div class="dashboard-container">
    首页
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
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>

<!--
 * @Description: 合同管理
 * @Date: 2023-01-11 08:56:13
 * @LastEditTime: 2023-01-11 10:01:05
-->
<template>
  <div>
    <keep-alive :include="cachedViews" :exclude="['dealerTermView']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'ContractEntry',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },
  computed: {
    cachedViews() {
      return [...this.$store.state.tagsView.cachedViews,'dealerContractEntry']
    },
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>

</style>
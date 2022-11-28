<!--
 * @Description: 
 * @Date: 2021-09-15 16:17:33
 * @LastEditTime: 2021-12-06 20:18:55
-->
<template>
  <div :class="{ 'has-logo': showLogo }" class="siderList">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <search v-if="leftMenuToggle" id="header-search" class="right-menu-item" /> -->
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
    <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="true" :active-text-color="variables.menuActiveText" :collapse-transition="false" @select="handleSelect" mode="vertical">
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
    <!-- </el-scrollbar> -->
    <!-- <div class="leftMenu"></div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
export default {
  components: { SidebarItem, Logo, Hamburger, Search },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  data() {
    return {
      leftMenuToggle: true,
    }
  },
  mounted() {
    this.$on('changeSideBar', (data) => {
      console.log('hh')
      //this.toggleSideBar();
    })
  },
  methods: {
    toggleSideBar() {
      this.leftMenuToggle = !this.leftMenuToggle
      this.$store.dispatch('app/toggleSideBar')
    },
    handleSelect() {
      sessionStorage.removeItem('currentIndex')
      this.$store.dispatch('app/openBreadCrumb')
    },
  },
}
</script>
<style scoped>
.leftMenu {
  width: 80%;
  margin-left: 10%;
  position: absolute;
  bottom: 0;
  height: 200px;
  /* background-image: url('../../../assets/images/background/car.png'); */
  background-size: 90% 90%;
  background-repeat: no-repeat;
  pointer-events: none;
}
</style>

<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item, item.children) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta&&onlyOneChild.path != 'dashboard'" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="generateTitle(onlyOneChild.meta.title)"
          />
        </el-menu-item>

      </app-link>
      <!-- 首页自定义 -->
      <div v-if="onlyOneChild.meta&&onlyOneChild.path === 'dashboard'" class="dashboardBar">
        <div v-if="sidebar.opened" class="dashBoard" @click="goDashBoard">
          <img src="../../../assets/images/clickIndex.png" alt="" class="clickIndex">
          <span class="IndexText">首页</span>
        </div>
        <img src="../../../assets/images/toggle.png" alt="" class="toggleIcon" @click.stop="toggleSideBar">
      </div>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="generateTitle(item.meta.title)"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      ><div style="background:red;width:10px;height:10px;"></div>
      </sidebar-item>
      
    </el-submenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import Hamburger from '@/components/Hamburger'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink, Hamburger },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {

    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    hasOneShowingChild(parent, children = []) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    toggleSideBar() {
      this.$emit('changeSideBar', this.sidebar)
      console.log(this.sidebar)
      this.$store.dispatch('app/toggleSideBar')
    },
    goDashBoard() {
      this.$router.push('/dashboard')
      this.$store.dispatch('app/hideBreadcrumb') // 进入首页隐藏面包屑
    },
    generateTitle
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";
.el-menu-item.is-active {
  color: #4192d3 !important;
  font-weight: bold;
  background: #EBF0FF !important;
}
.dashboardBar {
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding-right: 20px;
  justify-content: space-between;
  .toggleIcon {
    width: 16px;
    height: 18px;
    cursor: pointer;
    margin-left: 17px;
  }
  .dashBoard {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66%;
    height: 30px;
    line-height: 30px;
    text-align:center;
    background: #4192d3;
    border-radius: 15px;
    color: #fff;
    margin: 0 20px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #f4f8ff;
    cursor: pointer;
    .clickIndex {
      margin-right: 10px;
    }
    .IndexText {
      letter-spacing: 6px;
      font-size: 16px;

      font-family: Source Han Sans CN;
    }
  }
}
</style>

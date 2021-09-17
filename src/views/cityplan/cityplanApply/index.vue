<template>
  <div class="app-container" @keyup.enter="search">
    <!-- 顶部 -->
    <div class="TopBar">
      <div class="menIconWrap" @mouseenter="showMask" @mouseleave="hiddenMask">
        <img src="../../../assets/images/menIcon.png" alt="" />
        <span class="viewTitle">{{TabTitle}}</span>
        <div class="mask" v-show="isMask">
          <router-link
            :to="item.path"
            tag="div"
            @click.native="changeTab(index)"
            :class="index == currentIndex ? 'maskli currentMaskli' : 'maskli'"
            v-for="(item, index) in TabViewList"
            :key="index"
            >{{ item.title }}</router-link
          >
        </div>
      </div>
    </div>
    <!-- 水平分割线 -->
    <div class="line"></div>
    <router-view></router-view>
  </div>
</template>

<script src="./index.js" />

<style lang="scss" scoped>
.app-container {
  .TopBar {
    display: flex;
    align-items: center;
    position: relative;
    .menIcon {
      width: 16px;
      height: 13px;
      cursor: pointer;
    }
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
    .mask {
      position: absolute;
      background-color: #fff;
      box-shadow: 0 0 6px #cbcbcc;
      display: flex;
      top: 0;
      left: 30px;
      border-radius: 10px;
      z-index: 2;
      .maskli {
        padding: 5px 20px;
        font-size: 16px;
        border-radius: 10px;
        color: #4192d3;
        font-weight: 600;
      }
      .currentMaskli {
        background-color: #4192d3;
        color: #fff;
      }
    }
    .menIconWrap {
      cursor: pointer;
    }
    // .menIconWrap:hover .mask {
    //   display: block;
    // }
  }
}
</style>

<!--
 * @Description:
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2023-01-12 08:58:10
-->
<template>
  <section class="app-main" :class="isDashBoard?'appMainDashBoard':'app-main'">
    <!--      左下角问号-->
    <el-popover class="el-popoverTwo" placement="left" width="100%" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }" trigger="click">
      <div class="documentation">用户文档中心</div>
      <el-table :data="gridData" max-height="380">
        <el-table-column width="70" property="" label="">
          <template slot-scope="scope">
            <img src="../../assets/images/EXCEL.png" v-if="scope.row.format == 'excel'" />
            <img src="../../assets/images/word.png" v-if="scope.row.format == 'word'" />
            <img src="../../assets/images/yasuowenjian.png" v-if="scope.row.format == 'zip'" />
            <img src="../../assets/images/yasuowenjian.png" v-if="scope.row.format == 'rar'" />
            <img src="../../assets/images/PPT.png" v-if="scope.row.format == 'ppt'" />
            <img src="../../assets/images/tupian.png" v-if="scope.row.format == 'pdf'" />
            <img src="../../assets/images/shipin.png" v-if="scope.row.format == 'video'" />
          </template>
        </el-table-column>
        <el-table-column width="250" show-overflow-tooltip property="name" label="文件名称" />
        <el-table-column width="100" property="size" label="文件大小" />
        <el-table-column width="60" label="">
          <template slot-scope="scope">
            <el-link :href="scope.row.fileUrl">
              <img src="../../assets/images/dwonload.png" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" class='needHlep' :class="changeScreen">
        <div class="needHlepTxt">?</div>
      </el-button>
    </el-popover>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews" :exclude="['dealerTermView']">
        <router-view :key="key" class="routerContent"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import TaskAPI from '@/api/taskManage/taskManage'
import { getFileType } from '@/utils'
export default {
  name: 'AppMain',
  data() {
    return {
      changeScreen: 'needHlep2',
      gao: document.body.clientHeight,
      gridData: [
        {
          format: '2016-05-02',
          name: '王小虎',
          size: '45kb',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
    }
  },
  watch: {
    gao() {
      this.changeScreen2()
    }
  },
  computed: {
    cachedViews() {
      // return [...this.$store.state.tagsView.cachedViews,'dealerContractEntry','ContractEntry']
      return [...this.$store.state.tagsView.cachedViews,]
    },
    key() {
      return this.$route.path
    },
    isDashBoard() {
      //获取当前路径 是否包含 dashboard
      return this.$route.path.includes('dashboard')
    },
  },
  mounted() {
    this.changeScreen2()
    window.addEventListener('resize', this.changeScreen2)
    this.needHlep()
  },
  methods: {
    changeScreen2() {
      const height = document.body.clientHeight
      if (height <= 929) {
        this.changeScreen = 'needHlep2'
      } else if (height <= 1032) {
        this.changeScreen = 'needHlep3'
      } else if (height == 1080) {
        this.changeScreen = 'needHlep2'
      } else if (height <= 1162) {
        this.changeScreen = 'needHlep4'
      } else if (height <= 1239) {
        this.changeScreen = 'needHlep5'
      } else if (height <= 1394) {
        this.changeScreen = 'needHlep6'
      } else if (height <= 1859) {
        this.changeScreen = 'needHlep7'
      } else if (height <= 2788) {
        this.changeScreen = 'needHlep8'
      } else if (height <= 3717) {
        this.changeScreen = 'needHlep9'
      }
    },
    needHlep() {
      this.gridData = []
      TaskAPI.getNeedHelp().then((res) => {
        res.data.forEach((item, index) => {
          item.name = item.fileName
          item.size = item.fileSize
          this.gridData.push(item)
          item.format = getFileType(item.fileName)
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.routerContent {
  height: 100%;
}
.app-main {
  /* 50= navbar  50  */
  height: calc(100% - 0px);
  width: 100%;
  position: relative;
  // overflow-y: auto;
  padding: 21px 20px;
  box-sizing: border-box;
  // padding-bottom: 50px;
  background-color: #ebeff5;
}
.appMainDashBoard {
  height: calc(100% - 0px);
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  // .app-main {
  /* 84 = navbar + tags-view = 50 + 34 */
  // min-height: calc(100vh - 134px);
  // }

  .fixed-header + .app-main {
    padding-top: 104px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.needHlep2 {
  width: 70px !important;
  height: 70px !important;
  .needHlepTxt {
    width: 30px !important;
    height: 30px !important;
    font-size: 20px !important;
  }
}
.needHlep3 {
  width: 82px !important;
  height: 82px !important;
  .needHlepTxt {
    width: 37px !important;
    height: 36px !important;
    font-size: 22px !important;
    margin-left: 2px !important;
    padding-top: 6px !important;
  }
}
.needHlep4 {
  width: 97px !important;
  height: 97px !important;
  .needHlepTxt {
    width: 45px !important;
    height: 44px !important;
    font-size: 26px !important;
    margin-left: 5px !important;
    padding-top: 8px !important;
  }
}
.needHlep5 {
  width: 105px !important;
  height: 105px !important;
  .needHlepTxt {
    width: 50px !important;
    height: 49px !important;
    font-size: 28px !important;
    margin-left: 7px !important;
    padding-top: 10px !important;
  }
}
.needHlep6 {
  width: 123.5px !important;
  height: 123.5px !important;
  .needHlepTxt {
    width: 58px !important;
    height: 56px !important;
    font-size: 36px !important;
    margin-left: 13px !important;
    padding-top: 7px !important;
  }
}
.needHlep7 {
  width: 176px !important;
  height: 176px !important;
  .needHlepTxt {
    width: 72px !important;
    height: 68px !important;
    font-size: 40px !important;
    margin-left: 29px !important;
    padding-top: 9px !important;
  }
}
.needHlep8 {
  width: 256px !important;
  height: 256px !important;
  .needHlepTxt {
    width: 112px !important;
    height: 111px !important;
    font-size: 62px !important;
    margin-left: 48px !important;
    padding-top: 19px !important;
  }
}
.needHlep9 {
  width: 345px !important;
  height: 345px !important;
  .needHlepTxt {
    width: 157px !important;
    height: 159px !important;
    font-size: 87px !important;
    margin-left: 72px !important;
    padding-top: 29px !important;
  }
}
.needHlep {
  z-index: 45;
  box-shadow: 0px 0px 13px 0px rgba(127, 127, 127, 0.1);
  position: absolute;
  //background-color: rgba(65, 146, 211, 1);
  border-radius: 50%;
  display: inline-block;
  color: rgba(65, 146, 211, 1);
  font-size: 20px;
  //margin: 0px 0px 0px -90px;
  top: 80%;
  right: 1.5%;
  span {
    text-align: center;
  }
  .needHlepTxt {
    font-weight: 600;
    border-radius: 50%;
    border: 2px solid rgba(65, 146, 211, 1);
    font-size: 20px;
    width: 30px;
    height: 30px;
    padding-top: 3px;
  }
}
.needHlep:active {
  background: #126c9e !important;
  font-weight: bold;
}
/*按钮悬浮*/
.needHlep:hover {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHlepTxt {
    border: 2px solid #fff;
  }
}
/*按钮点击*/
.needHlep:focus {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHlepTxt {
    border: 2px solid #fff;
  }
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

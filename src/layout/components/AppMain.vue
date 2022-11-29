<!--
 * @Description:
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2022-11-28 15:03:30
-->
<template>
  <section class="app-main">
    <!--      左下角问号-->
    <el-popover class="el-popoverTwo" placement="left" width="500" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }" trigger="click">
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

            <!--            <img v-if=‘scope.row.format == "excel"’ src="../../../assets/images/EXCEL.png">-->
            <!--            <img v-if="scope.row.format == &quot;word&quot;" src="../../../assets/images/word.png">-->
            <!--            <img v-if="scope.row.format == &quot;zip&quot;" src="../../../assets/images/yasuowenjian.png">-->
            <!--            <img v-if="scope.row.format == &quot;ppt&quot;" src="../../../assets/images/PPT.png">-->
            <!--            <img v-if="scope.row.format == &quot;pdf&quot;" src="../../../assets/images/tupian.png">-->
            <!--            <img v-if="scope.row.format == &quot;video&quot;" src="../../../assets/images/shipin.png">-->
          </template>
        </el-table-column>
        <el-table-column width="250" property="name" label="文件名称" />
        <el-table-column width="100" property="size" label="文件大小" />
        <el-table-column width="60" label="">
          <template slot-scope="scope">
            <el-link :href="scope.row.fileUrl">
              <img src="../../assets/images/dwonload.png" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" class="needHelp">
        <div class="needHelpTxt" :width='maxHeight'>?</div>
      </el-button>
    </el-popover>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
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
      maxHeight: '',
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
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
  },

  mounted() {
    //浏览器放大缩小 监听
    window.addEventListener('resize',this.changeScreen)
    const width = document.body.clientWidth
    window.onresize = () => {
      return (() => {
        this.screenWidth = width
      })()
    }
    this.needHelp()
  },
  methods: {
    changeScreen() {
      const width = document.body.clientWidth
      //是否放大
      let isAmplification=this.tempScreen<width
      console.log(isAmplification)
      if (this.$store.state.app.sidebar.opened) {
        //获取常见屏幕分辨率，根据宽度动态匹配甘特图的宽度
        if (width <= 1366) {
          this.maxHeight = 70
        } else if (width <= 1400) {
          this.maxHeight = 90
        } else if (width <= 1440) {
          this.maxHeight = 120
        } else if (width <= 1540) {
          this.maxHeight = 145
        } else if (width <= 1700) {
          this.maxHeight = 178
        } else if (width <= 1920) {
          this.maxHeight = 200
        }else {
          if(!isAmplification) {
            this.options.times.timeZoom+=0.8
          } else {
            this.options.times.timeZoom-=0.8
          }
        }
      } else {
        if (width <= 1366) {
          this.options.times.timeZoom = 22.6
        } else if (width <= 1440) {
          this.options.times.timeZoom = 22.5
        } else if (width <= 1920) {
          this.options.times.timeZoom = 21.9
        } else {
          if(!isAmplification) {
            this.options.times.timeZoom+=0.8
          } else {
            this.options.times.timeZoom-=0.8
          }
        }
      }
      this.tempScreen = width
    },
    needHelp() {
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
.app-main {
  /* 50= navbar  50  */
  height: 100%;
  width: 100%;
  position: relative;
  // overflow-y: auto;
  padding: 21px 20px;
  box-sizing: border-box;
  // padding-bottom: 50px;
  background-color: #ebeff5;
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
.needHelp {
  z-index: 45;
  box-shadow: 0px 0px 13px 0px rgba(127, 127, 127, 0.1);
  position: absolute;
  //background-color: rgba(65, 146, 211, 1);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: inline-block;
  color: rgba(65, 146, 211, 1);
  font-size: 20px;
  //margin: 0px 0px 0px -90px;
  top: 80%;
  right: 1.5%;
  .needHelpTxt {
    font-weight: 600;
    border-radius: 50%;
    border: 2px solid rgba(65, 146, 211, 1);
    font-size: 20px;
    width: 30px;
    height: 30px;
    padding-top: 3px;
  }
}
.needHelp:active {
  background: #126c9e !important;
  font-weight: bold;
}
/*按钮悬浮*/
.needHelp:hover {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHelpTxt {
    border: 2px solid #fff;
  }
}
/*按钮点击*/
.needHelp:focus {
  background: rgba(65, 146, 211, 1) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(65, 146, 211, 1) !important;
  .needHelpTxt {
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

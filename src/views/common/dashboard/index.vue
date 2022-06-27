<!--
 * @Description: 
 * @Date: 2021-08-30 10:38:43
 * @LastEditTime: 2022-06-27 20:13:04
-->
<template>
  <div class="dashboard-container">
    <div class="dashWrap">
      <div class="chartWrap">
        <div class="CityPlan">
          <div class="CityPlanTop">
            <span class="V0">V0</span>
            <span class="V1">V1</span>
            <span class="V2">V2</span>
            <span class="V3">V3</span>
          </div>
          <div class="PointTipWrap">
            <div class="PointTip">
              <img src="@/assets/images/index/point_right.png" alt="" class="pointTipImg">
              <span>已完成</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_circle.png" alt="" class="pointTipImg">
              <span>当前节点</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point_amaze.png" alt="" class="pointTipImg">
              <span>延误节点</span>
            </div>
            <div class="PointTip">
              <img src="@/assets/images/index/point.png" alt="" class="pointTipImg">
              <span>未开始</span>
            </div>
          </div>
          <!-- 活动月 -->
          <div class="monthBarWrap">
            <!-- 流程 -->
            <div class="monthBar" v-for="(MonthItem,MonthIndex) in ActivityList" :key="MonthIndex">
              <div class="monthBg">
                <!-- <div class="monthName">{{(getCPTMonth(MonthItem.month))}}</div> -->
                <div class="monthName">{{MonthItem.month}}</div>
               
              </div>
              <div class="monthPoint">
                <!-- 渠道 -->
                <div v-for="(value,ckey) in MonthItem.channelList" :key="ckey">
                  <div v-for="item,index in value" :key="index">
                    <!-- PP -->
                    <div class="PPBar" v-if="item.minePackageName=='Price Promotion'">
                      <div class="PointTitle">PP-{{item.channelName}}</div>
                      <div class="V0">
                        <div class="passIcon" v-if="item.version=='V1'||item.version=='V2'||item.version=='V3'||(item.version=='V0'&&item.processStatus==2)"></div>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V0'&&item.workDateFlag==='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="currentPoint" v-if="item.version=='V0'&&item.workDateFlag==='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V0'&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="delayPoint" v-if="item.version=='V0'&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <div class="line" v-if="item.version=='V1'||item.version=='V2'||item.version=='V3'"></div>
                        <div class="lineDark" v-if="(item.version!='V1'&&item.version!='V2'&&item.version!='V3')||item.version=='V0'"></div>
                      </div>
                      <div class="V1">
                        <div class="passIcon" v-if="item.version=='V2'||item.version=='V3'||(item.version=='V1'&&item.processStatus==2)"></div>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="currentPoint" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="delayPoint" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <div class="pointCircle" v-if="item.version!='V1'&&item.version!='V2'&&item.version!='V3'"></div>
                        <div class="line" v-if="item.version=='V2'||item.version=='V3'"></div>
                        <div class="lineDark" v-if="(item.version=='V0'&&item.version!='V2'&&item.version!='V3')||item.version=='V1'"></div>
                      </div>
                      <div class="V2">
                        <div class="passIcon" v-if="item.version=='V3'||(item.version=='V2'&&item.processStatus==2)"></div>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="currentPoint" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="delayPoint" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <div class="pointCircle" v-if="item.version!='V2'&&item.version!='V3'"></div>
                        <div class="line" v-if="item.version=='V3'"></div>
                        <div class="lineDark" v-if="(item.version=='V0'||item.version=='V1')||item.version=='V2'"></div>
                      </div>
                      <div class="V3">
                        <div class="passIcon" v-if="item.version=='V3'&&item.processStatus==2"></div>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom" popper-class="tooltip" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.processStatus==1)">
                          <div slot="content" v-html="getTip(item)"></div>
                          <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.processStatus==1)"></div>
                        </el-tooltip>
                        <!-- <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                  <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)"></div> -->
                        <div class="pointCircle" v-if="item.version!='V3'"></div>
                      </div>
                    </div>
                    <div class="NU" v-if="item.minePackageName=='New User'">
                      <div class="PointTitle">NU-{{item.channelName}}</div>
                      <div class="NuPoint">
                        <div class="V1">
                          <div class="passIcon" v-if="item.version=='NUV2'||item.version=='NUV3'||(item.version=='NUV1'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV1'&&item.workDateFlag==='0'&&(item.version=='NUV1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='NUV1'&&item.workDateFlag==='0'&&(item.version=='NUV1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV1'&&item.workDateFlag!=='0'&&(item.version=='NUV1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='NUV1'&&item.workDateFlag!=='0'&&(item.version=='NUV1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='NUV1'&&item.version!='NUV2'&&item.version!='NUV3'"></div>
                          <div class="line" v-if="item.version=='NUV2'||item.version=='NUV3'"></div>
                          <div class="lineDark" v-if="(item.version!='NUV2'&&item.version!='NUV3')||item.version=='NUV1'"></div>
                        </div>
                        <div class="V2">
                          <div class="passIcon" v-if="item.version=='NUV3'||(item.version=='NUV2'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV2'&&item.workDateFlag=='0'&&(item.version=='NUV2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='NUV2'&&item.workDateFlag=='0'&&(item.version=='NUV2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV2'&&item.workDateFlag!=='0'&&(item.version=='NUV2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='NUV2'&&item.workDateFlag!=='0'&&(item.version=='NUV2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='NUV2'&&item.version!='NUV3'"></div>
                          <div class="line" v-if="item.version=='NUV3'"></div>
                          <div class="lineDark" v-if="(item.version=='NUV1')||item.version=='NUV2'"></div>
                        </div>
                        <div class="V3">
                          <div class="passIcon" v-if="item.version=='NUV3'&&item.processStatus==2"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV3'&&item.workDateFlag=='0'&&(item.version=='NUV3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='NUV3'&&item.workDateFlag=='0'&&(item.version=='NUV3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='NUV3'&&item.workDateFlag!=='0'&&(item.version=='NUV3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='NUV3'&&item.workDateFlag!=='0'&&(item.version=='NUV3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='NUV3'"></div>
                        </div>
                      </div>

                    </div>
                    <div class="NU" v-if="item.minePackageName=='合同流程-hih rebate'">
                      <div class="PointTitle">HIH Rebate-{{item.channelCode}}</div>
                      <div class="NuPoint">
                        <div class="V1">
                          <div class="passIcon" v-if="item.version=='V2'||item.version=='V3'||(item.version=='V1'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V1'&&item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V2'||item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version!='V2'&&item.version!='V3')||item.version=='V1'"></div>
                        </div>
                        <div class="V2">
                          <div class="passIcon" v-if="item.version=='V3'||(item.version=='V2'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version=='V1')||item.version=='V2'"></div>
                        </div>
                        <div class="V3">
                          <div class="passIcon" v-if="item.version=='V3'&&item.processStatus==2"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V3'"></div>
                        </div>
                      </div>

                    </div>
                    <div class="NU" v-if="item.minePackageName=='合同流程-ka rebate'">
                      <div class="PointTitle">KA Rebate-{{item.channelCode}}</div>
                      <div class="NuPoint">
                        <div class="V1">
                          <div class="passIcon" v-if="item.version=='V2'||item.version=='V3'||(item.version=='V1'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V1'&&item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V2'||item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version!='V2'&&item.version!='V3')||item.version=='V1'"></div>
                        </div>
                        <div class="V2">
                          <div class="passIcon" v-if="item.version=='V3'||(item.version=='V2'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version=='V1')||item.version=='V2'"></div>
                        </div>
                        <div class="V3">
                          <div class="passIcon" v-if="item.version=='V3'&&item.processStatus==2"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V3'"></div>
                        </div>
                      </div>

                    </div>
                    <div class="NU" v-if="item.minePackageName=='Listing审批流程'">
                      <div class="PointTitle">Listing-{{item.channelCode}}</div>
                      <div class="NuPoint">
                        <div class="V1">
                          <div class="passIcon" v-if="item.version=='V2'||item.version=='V3'||(item.version=='V1'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V1'&&item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V2'||item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version!='V2'&&item.version!='V3')||item.version=='V1'"></div>
                        </div>
                        <div class="V2">
                          <div class="passIcon" v-if="item.version=='V3'||(item.version=='V2'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version=='V1')||item.version=='V2'"></div>
                        </div>
                        <div class="V3">
                          <div class="passIcon" v-if="item.version=='V3'&&item.processStatus==2"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V3'"></div>
                        </div>
                      </div>

                    </div>
                    <div class="NU" v-if="item.minePackageName=='Roadshow'">
                      <div class="PointTitle">Road Show-{{item.channelCode}}</div>
                      <div class="NuPoint">
                        <div class="V1">
                          <div class="passIcon" v-if="item.version=='V2'||item.version=='V3'||(item.version=='V1'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V1'&&item.workDateFlag==='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V1'&&item.workDateFlag!=='0'&&(item.version=='V1'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V1'&&item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V2'||item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version!='V2'&&item.version!='V3')||item.version=='V1'"></div>
                        </div>
                        <div class="V2">
                          <div class="passIcon" v-if="item.version=='V3'||(item.version=='V2'&&item.processStatus==2)"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V2'&&item.workDateFlag=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V2'&&item.workDateFlag!=='0'&&(item.version=='V2'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V2'&&item.version!='V3'"></div>
                          <div class="line" v-if="item.version=='V3'"></div>
                          <div class="lineDark" v-if="(item.version=='V1')||item.version=='V2'"></div>
                        </div>
                        <div class="V3">
                          <div class="passIcon" v-if="item.version=='V3'&&item.processStatus==2"></div>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="currentPoint" v-if="item.version=='V3'&&item.workDateFlag=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <el-tooltip effect="dark" placement="bottom" popper-class="tooltip"
                            v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)">
                            <div slot="content" v-html="getTip(item)"></div>
                            <div class="delayPoint" v-if="item.version=='V3'&&item.workDateFlag!=='0'&&(item.version=='V3'&&item.processStatus==1)"></div>
                          </el-tooltip>
                          <div class="pointCircle" v-if="item.version!='V3'"></div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="calendarBar">
          <div class="calendarBarTitle">日历</div>
          <vc-calendar :attributes='attrs' class="calendar"></vc-calendar>
        </div>
      </div>
      <div class="BottomBar">
        <div class="MyToDo">
          <div class="BarTitleWrap">
            <span>我的待办</span>
            <div class="TabBar">
              <div class="Tabli " :class="currentIndex == index ? 'currentTabli' : ''" v-for="(item, index) in TabList" :key="item.id" @click="changeCurrent(index)">
                {{ item.title }}
              </div>
              <!-- <div class="Tabli ">已完成</div> -->
            </div>
          </div>
          <div class="TimeLineWrap" v-show="currentIndex == 0">
            <div class="TimeLineTop">
              <div class="TimeLineTitleli">年月</div>
              <div class="TimeLineTitleli">版本号</div>
              <div class="TimeLineTitleli">当前节点</div>
              <div class="TimeLineTitleli">办理人</div>
              <div class="TimeLineTitleli">操作</div>
            </div>
            <div class="TimeLineBar">
              <el-timeline>
                <el-timeline-item color="#4192d3" v-for="item,index in TodoList" :key="index">
                  <div class="TimeLineli">
                    <div class="TimeLineTitleli">{{item.yearAndMonth}}</div>
                    <div class="TimeLineTitleli">{{item.version}}</div>
                    <div class="TimeLineTitleli">{{item.activityName}}</div>
                    <div class="TimeLineTitleli" v-html="getAssigneeName(item.assignee)"></div>
                    <div class="TimeLineTitleli">
                      <div class="TimeLineOpertion" @click="goAssignee(item.version,item.activityName,item.channelCode)">办理</div>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
          <div class="TimeLineWrap" v-show="currentIndex == 1">
            <div class="TimeLineTop">
              <div class="TimeLineTitleli">年月</div>
              <div class="TimeLineTitleli">版本号</div>
              <div class="TimeLineTitleli">当前节点</div>
              <div class="TimeLineTitleli">提交人</div>
            </div>
            <div class="TimeLineBar">
              <el-timeline>
                <el-timeline-item color="#4192d3" v-for="item,index in completeData" :key="index">
                  <div class="TimeLineli">
                    <div class="TimeLineTitleli">{{item.yearAndMonth}}</div>
                    <div class="TimeLineTitleli">{{item.version}}</div>
                    <div class="TimeLineTitleli">{{item.name}}</div>
                    <div class="TimeLineTitleli" v-html="getAssigneeName(item.assignee)"></div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
        <div class="Message MyToDo">
          <div class="BarTitleWrap">
            <span>消息</span>
            <span class="more" @click="MoreMsg">更多</span>
          </div>
          <div class="MessgaeWrap">
            <div class="Messgaeli" v-for="item,index in MessageList" :key="index">
              <span class="MessageDate">[{{item.time}}]</span>
              <span class="MessageContent">{{item.msg}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import auth from '@/utils/auth'
import TaskAPI from '@/api/taskManage/taskManage.js'
import API from '@/api/index/index.js'
import completeAPI from '@/api/taskManage/taskManage.js'
export default {
  name: 'Dashboard',
  created() {},
  data() {
    return {
      avatar: auth.getAvatar(),
      name: auth.getName(),
      SalesAmountChart: '',
      ActualSalesChart: '',
      TabList: [
        { id: 0, title: '待完成' },
        { id: 1, title: '已完成' },
      ],
      TodoList: [],
      completeData: [],
      currentIndex: 0,
      // 当前日期
      attrs: [
        {
          key: 'today',
          // 括号内传递日期可点亮指定日期，如new Date(2019, 6, 1)，也可传递多个日期：如dates: [ new Date(2018, 0, 1), new Date(2018, 0, 15) ]
          dates: new Date(),
          highlight: true,
          // popover 点亮的日期上出现提示内容
          popover: {
            label: '美好的一天！要开心呦！',
          },
        },
      ],
      MessageList: [], //消息列表
      ActivityList: [],
      BackGroundColorList: ['#FB5A56', '#2C85FF', '#FFAA30'],
    }
  },
  mounted() {
    this.getMesList()
    this.getHomePageData()
    this.getToDoData()
    this.getCompleteData()
  },
  watch: {
    '$store.state.app.sidebar.opened'() {
      // setTimeout(() => {
      //   console.log('change')
      //   this.SalesAmountChart.resize()
      //   this.ActualSalesChart.resize()
      // }, 200)
    },
  },
  methods: {
    changeCurrent(index) {
      this.currentIndex = index
    },
    getTip(value) {
      return `<div class="Tip">
                <span class="TipTitle">节点名称: </span>
                <span>${value.activityName}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">渠道: </span>
                <span>${value.channelName}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">办理人: </span>
                <span>${value.assignee}</span>
              </div>
              <div class="Tip">
                <span class="TipTitle">办理状态: </span>
                <span>${
                  value.processStatus == 2
                    ? '已办理'
                    : value.workDateFlag == '1'
                    ? '未办理(延误)'
                    : '未办理'
                }</span>
              </div>
      `
    },
    // 获取信息列表
    getMesList() {
      API.getHomePageMsg().then((res) => {
        let obj = {
          time: '',
          msg: '',
        }
        res.data.forEach((item) => {
          obj.time = item.substring(1, 10)
          obj.msg = item.substring(12)
          if (this.MessageList.length < 5) this.MessageList.push(
            {
              ...obj
            }
          )
        })
      })
    },
    // 查看更多信息
    MoreMsg() {
      this.$router.push('/os/MessageManage')
    },
    // 日历和流程
    getHomePageData() {
      API.getHomePageData().then((res) => {
        let array = res.data.investList
        //流程处理 日期分组
        let data = {}
        for (let m = 0; m < array.length; m++) {
          //对date 进行分组
          array[m].activityMonth = this.getCPTMonth(array[m].yearAndMonth)
          //设置排序
          if (array[m].minePackageName == 'Price Promotion') {
            array[m].sortCode = 1
          } else {
            array[m].sortCode = 0
          }
          //根据yearAndMonth 进行分组
          if (!data[array[m].yearAndMonth]) {
            var arr = []
            arr.push(array[m])
            data[array[m].yearAndMonth] = arr
          } else {
            data[array[m].yearAndMonth].push(array[m])
            //PP、NU 排序
            data[array[m].yearAndMonth].sort(function (a, b) {
              return b.sortCode - a.sortCode
            })
          }
        }
        //流程--渠道分组处理
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const array = data[key]
            let cdata = {} //活动月下进行渠道分组
            for (let index = 0; index < array.length; index++) {
              //设置排序
              if (array[index].minePackageName == 'Price Promotion') {
                array[index].sortCode = 1
              } else {
                array[index].sortCode = 0
              }
              //根据渠道进行分组
              if (!cdata[array[index].channelName]) {
                var arr = []
                arr.push(array[index])
                cdata[array[index].channelName] = arr
              } else {
                cdata[array[index].channelName].push(array[index])
                //PP、NU 排序
                cdata[array[index].channelName].sort(function (a, b) {
                  return b.sortCode - a.sortCode
                })
              }
            }
            data[key] = cdata
          }
        }
        // for (const key in data) {
        //   if (Object.hasOwnProperty.call(data, key)) {
        //     //渠道
        //     const channelObj = data[key]
        //     for (const ckey in channelObj) {
        //       if (Object.hasOwnProperty.call(channelObj, ckey)) {
        //         //MinePackage
        //         const MinePackageList = channelObj[ckey]
        //         let MinePackageObj={}
        //         for (let m = 0; m < MinePackageList.length; m++) {
        //           //根据MinePackage进行分组
        //           if (!MinePackageObj[MinePackageList[m].minePackageName]) {
        //             var arr = []
        //             arr.push(MinePackageList[m])
        //             MinePackageObj[MinePackageList[m].minePackageName] = arr
        //           } else {
        //             MinePackageObj[MinePackageList[m].minePackageName].push(MinePackageList[m])
        //           }
        //         }
        //         channelObj[ckey]=MinePackageObj
        //       }
        //     }
        //   }
        // }
        let list=[]
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            let obj={
              month:'',
              channelList:[]
            }
            obj.month=key
            obj.channelList=element
            list.push(obj)
          }
        }
        let reverseList=[]
        reverseList=list.reverse()
        this.ActivityList = [...reverseList]
        //日期处理
        let DateArray = res.data.calendar
        let DateData = {}
        for (let m = 0; m < DateArray.length; m++) {
          DateArray[m].dateObj = this.createDate(DateArray[m].date)
          //对date 进行分组
          if (!DateData[DateArray[m].yearMonth]) {
            var arr = []
            arr.push(DateArray[m])
            DateData[DateArray[m].yearMonth] = arr
          } else {
            DateData[DateArray[m].yearMonth].push(DateArray[m])
          }
        }
        let ColorIndex = 0 //颜色初始值
        //日历格式化
        for (const key in DateData) {
          let pointList = DateData[key]
          for (let index = 0; index < pointList.length; index++) {
            let obj = {
              key: pointList[index].yearMonth + '-' + pointList[index].version,
              dot: {
                style: {
                  //dot 样式设置
                  backgroundColor: this.BackGroundColorList[ColorIndex % 3],
                },
              },
              dates: pointList[index].dateObj,
              popover: {
                label:
                  pointList[index].yearMonth + '-' + pointList[index].version,
              },
            }
            this.attrs.push(obj)
          }
          ColorIndex++
        }
      })
    },
    //获取date 日期对象
    createDate(value) {
      return new Date(Date.parse(value.replace(/-/g, '/'))) //转换成Data();
    },
    //获取活动月
    getCPTMonth(value) {
      let dateStr = value.substring(0, 4) + '-' + value.substring(4, 6)
      let date = new Date(dateStr)
      //月份
      let month = date.getMonth() + 1
      //活动月计算 9  -> 6+6
      let firstMonth = ''
      if (month <= 3) {
        firstMonth = month + 9
        //0+12
        if (month == 3) firstMonth = 0
      } else {
        firstMonth = month - 3
      }
      let secondMonth = 12 - firstMonth
      let activityMonth = firstMonth + '+' + secondMonth
      return activityMonth
    },
    //获取待办数据
    getToDoData() {
      TaskAPI.getList({
        pageNum: 1, //当前页
        pageSize: 999, //每页条数
      }).then((response) => {
        this.TodoList = response.data.records
      })
    },
    //获取表格数据
    getCompleteData() {
      completeAPI.getMyHandleList({
        pageNum: 1, //当前页
        pageSize: 999, //每页条数
      })
        .then((response) => {
          this.completeData = response.data.records
        })
    },
    //办理
    goAssignee(version, name, channelCode) {
      if (version.indexOf('V0')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V0/V0Apply', params: { channelCode } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V0/V0Approval', params: { channelCode } })
        }
      }
      if (version.indexOf('V1')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Apply', params: { channelCode } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V1/V1Approval', params: { channelCode } })
        }
      }
      if (version.indexOf('V2')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Apply', params: { channelCode } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V2/V2Approval', params: { channelCode } })
        }
      }
      if (version.indexOf('V3')!=-1) {
        if (name.indexOf('调整') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Apply', params: { channelCode } })
        } else if (name.indexOf('审批') != -1) {
          this.$router.push({ path: '/costManagement/V3/V3Approval', params: { channelCode } })
        }
      }
      //this.$router.push({ path: '/process', query: currentRow })
    },
    //获取办理人姓名
    getAssigneeName(assigneeStr) {
      if (assigneeStr != '') {
        let list=assigneeStr.split(',')
        let allName=''
        list.forEach(item=>{
          let index = item.indexOf('@')
          allName+='<br>'+item.slice(0, index)
        })
        return allName.slice(4)
        // let index = assigneeStr.indexOf('@')
        // return assigneeStr.slice(0, index)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  font-size: 16px;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  // padding-bottom: 30px;
  .chartWrap {
    width: 100%;
    height: 580px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
    margin-top: 0;
    .CityPlan {
      width: 65%;
      height: 580px;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
      .CityPlanTop {
        width: 100%;
        height: 52px;
        padding-left: 320px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        display: flex;
        align-items: center;
        padding-right: 60px;
        border-bottom: 1px solid #dce1e6;
        margin-bottom: 10px;
        .V0 {
          width: 33%;
        }
        .V1 {
          width: 33%;
        }
        .V2 {
          width: 33%;
        }
      }
      .PointTipWrap {
        width: 100%;
        margin: 10px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .PointTip {
          margin-right: 40px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #333333;
          display: flex;
          align-items: center;
          .pointTipImg {
            width: 17px;
            height: 17px;
            margin-right: 6px;
          }
        }
      }
      .monthBarWrap {
        width: 100%;
        padding: 0 20px;
        height: calc(100% - 120px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        .monthBar {
          width: 100%;
          // height: 110px;
          background: #ffffff;
          box-shadow: 0px 0px 18px 0px rgba(114, 114, 114, 0.07);
          border-radius: 20px;
          box-sizing: border-box;
          display: flex;
          margin-bottom: 20px;

          .monthBg {
            width: 150px;
            // height: 110px;
            display: flex;
            font-weight: 600;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            background: url('../../../assets/images/index/month (1).png')
              no-repeat;
            background-size: 100% 100%;
            padding-left: 30px;
            box-sizing: border-box;
            .monthName {
              width: 100%;
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: 500;
              text-align: left;
            }
          }
          .monthPoint {
            width: calc(100% - 170px);
            // height: 110px;
            overflow-y: scroll;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .PPBar {
              width: 100%;
              display: flex;
              height: 28px;
              align-items: center;
              margin: 5px 0;
              // background-color: pink;
            }
            .NU {
              width: 100%;
              display: flex;
              height: 28px;
              justify-content: space-between;
              align-items: center;
              margin: 15px 0;
              .NuPoint {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-left: 18px;
              }
              // background-color: pink;
            }
            .PointTitle {
              width: 145px;
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 500;
              color: #999999;
              margin-right: 10px;
            }
            .V0 {
              width: 33%;
              display: flex;
              align-items: center;
              img {
                width: 28px;
                height: 28px;
              }
            }
            .V1 {
              width: 33%;
              display: flex;
              align-items: center;
              img {
                width: 28px;
                height: 28px;
              }
            }
            .V2 {
              width: 33%;
              display: flex;
              align-items: center;
              img {
                width: 28px;
                height: 28px;
              }
            }
            .line {
              width: calc(100% - 28px);
              height: 10px;
              background: linear-gradient(90deg, #8de6cd 0%, #55ba9e 100%);
              box-shadow: 0px 2px 6px 0px rgba(85, 186, 158, 0.31);
            }
            .lineDark {
              width: calc(100% - 28px);
              height: 10px;
              background-color: #e5e5e5;
              // box-shadow: 0px 2px 6px 0px rgba(251, 113, 119, 0.31);
            }
            .pointCircle {
              width: 27px;
              height: 27px;
              background-color: #e5e5e5;
              border: 1px solid #fff;
              border-radius: 50%;
            }
            .passIcon {
              width: 28px;
              height: 28px;
              background: url('../../../assets/images/index/point_right.png');
              background-size: 100% 100%;
              box-shadow: 0px 6px 13px 0px rgba(85, 186, 158, 0.38);
              border-radius: 50%;
              overflow: hidden;
            }
            .currentPoint {
              width: 28px;
              height: 28px;
              background: url('../../../assets/images/index/point_circle.png');
              background-size: 100% 100%;
              box-shadow: 0px 6px 13px 0px rgba(44, 133, 255, 0.38);
              border-radius: 50%;
              overflow: hidden;
            }
            .delayPoint {
              width: 28px;
              height: 28px;
              background: url('../../../assets/images/index/point_amaze.png');
              background-size: 100% 100%;
              box-shadow: 0px 6px 13px 0px rgba(251, 90, 86, 0.38);
              border-radius: 50%;
              overflow: hidden;
            }
            .noStart {
              width: 27px;
              height: 27px;
              background-color: #fee4e4;
              border: 1px solid #fff;
              border-radius: 50%;
            }
          }
        }
        .monthBar:nth-child(3n + 1) .monthBg {
          .monthName {
            font-family: PingFang SC;
            font-weight: bold;
            color: #fb5a56;
          }
          background: url('../../../assets/images/index/monthNew (1).png')
            no-repeat;
          background-size: 100% 100%;
        }
        .monthBar:nth-child(3n + 2) .monthBg {
          .monthName {
            font-family: PingFang SC;
            font-weight: bold;
            color: #2c85ff;
          }
          background: url('../../../assets/images/index/monthNew (2).png')
            no-repeat;
          background-size: 100% 100%;
        }
        .monthBar:nth-child(3n + 3) .monthBg {
          .monthName {
            font-family: PingFang SC;
            font-weight: bold;
            color: #ffaa30;
          }
          background: url('../../../assets/images/index/monthNew (3).png')
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .calendarBar {
      width: 33%;
      height: 580px;
      background-color: #fff;
      border-radius: 20px;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
      overflow: hidden;
      .calendarBarTitle {
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #333333;
      }
      .calendar {
        border: none;
        width: 100%;
        margin-top: 10px;
        height: 90%;
      }
    }
  }
  .BottomBar {
    width: 100%;
    height: 325px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
    .MyToDo {
      width: 65%;
      height: 366px;
      background-color: #fff;
      border-radius: 20px;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 0px 0px 20px 0px rgba(65, 146, 211, 0.04);
      .TimeLineWrap {
        width: 100%;
        margin-top: 20px;
        height: calc(100% - 80px);
        background-color: #f5f5f5;
        border-radius: 4px;
        .TimeLineTop {
          width: 100%;
          display: flex;
          height: 50px;
          align-items: center;
          justify-content: space-between;
          padding-left: 80px;
          padding-right: 48px;
          box-sizing: border-box;
          border-bottom: 1px solid #dce1e6;
          .TimeLineTitleli {
            width: 20%;
            height: 50px;
            line-height: 50px;
            color: #333333;
            font-size: 18px;
          }
        }
        .TimeLineBar {
          width: 100%;
          padding-top: 20px;
          padding-right: 48px;
          box-sizing: border-box;
          height: 190px;
          overflow-y: scroll;

          .TimeLineli {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            box-sizing: border-box;
            box-shadow: 0px 0px 38px 0px rgba(12, 12, 12, 0.04);
            border-radius: 10px;
            background-color: #fff;
            .TimeLineTitleli {
              width: 20%;
              line-height: 30px;
              padding: 5px 0;
              color: #333333;
              font-size: 16px;
              .TimeLineOpertion {
                width: 80px;
                height: 40px;
                line-height: 40px;
                color: #fff;
                background-color: #4192d3;
                border-radius: 4px;
                text-align: center;
                cursor: pointer;
              }
            }
          }

          .el-timeline-item {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .Message {
      width: 33%;
      .MessgaeWrap {
        width: 100%;
        margin-top: 30px;
        .Messgaeli {
          width: 100%;
          display: flex;
          font-size: 16px;
          color: #999999;
          margin-bottom: 24px;
          .MessageDate {
            white-space: nowrap;
            color: #333333;
            margin-right: 10px;
          }
          .MessageContent {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .BarTitleWrap {
      font-family: SourceHanSansCN-Medium;
      font-size: 18px;
      color: #333333;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .TabBar {
        width: 180px;
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px;
        box-sizing: border-box;
        border-radius: 4px;

        color: #999;
        background-color: #f3f7f8;
        .Tabli {
          width: 90px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 15px;
          cursor: pointer;
          font-family: SourceHanSansCN-Medium;
        }
        .currentTabli {
          background-color: #ffffff;
          border-radius: 4px;
          color: #4192d3;
        }
      }
      .more {
        font-size: 16px;
        color: #4192d3;
        cursor: pointer;
      }
    }
  }
  .dashWrap {
    height: calc(100% - 33px);
    overflow-y: auto;
  }
  /*滚动条的宽度*/
::-webkit-scrollbar {
  width: 0px;
  height: 2px;
}
/* //滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 3px;
}
}
</style>
<style>
/* timeLine 样式设置 */
.el-timeline-item__wrapper {
  width: 100%;
}
.el-timeline-item__timestamp.is-bottom {
  margin-bottom: 0;
}
.el-timeline-item__tail {
  height: 190%;
  width: 3px;
  background-color: #4192d3;
  border: none;
}
.el-timeline-item__node {
  background-color: #fff !important;
  border: 2px solid #4192d3 !important;
}

.vc-day {
  width: 40px;
  height: 40px;
  border-radius: 1px;
  position: relative;
  min-height: 32px;
  z-index: 1;
  margin: 10px auto;
  color: #333;
}
.vc-arrows-container {
  margin-bottom: 10px;
}
.vc-weeks {
  margin-top: 20px;
}
.vc-dot {
  width: 8px !important;
  height: 8px !important;
  border: 1px solid #fff !important;
}
.vc-dots {
  margin-bottom: -4px !important;
}
.vc-day-content {
  width: 40px !important;
  height: 40px !important;
  border-radius: 8px !important;
}
.ToDayBg {
  background-color: #4192d3;
  color: #fff;
}
.vc-highlight[data-v-4420d078] {
  width: 40px;
  height: 40px;
  background-color: #4192d3 !important;
  border-radius: 10px !important;
  color: #fff !important;
}
.tooltip {
  border-radius: 10px;
  cursor: pointer;
}
.Tip {
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  margin: 3px 0;
  display: flex;
  align-items: center;
}
.TipTitle {
  width: 70px;
  text-align: right;
  white-space: nowrap;
  margin-right: 5px;
  font-family: SourceHanSansCN-Regular;
}
</style>

<template>
  <div class="Maincontent" @keyup.enter="search">
    <!-- 顶部 -->
    <!-- <div class="TopBar">
      <img src="../../../../assets/images/menIcon.png" alt="" />
      <span class="viewTitle">V0</span>
    </div> -->
    <!-- 水平分割线 -->
    <!-- <div class="line"></div> -->
    <!-- 查询操作 -->
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">SKU</span>
          <el-select v-model="SKU" placeholder="请选择">
            <el-option
              v-for="(item,index) in categoryArr"
              :key="index"
              :label="item.label"
              :value="index"
            />
          </el-select>
        </div>
        <div class="Selectli">
          <span class="SelectliTitle">月份</span>
          <el-date-picker v-model="month" type="month" placeholder="选择月">
          </el-date-picker>
        </div>
        <el-button type="primary" icon="el-icon-plus" class="TpmButtonBG"
          >查询</el-button
        >
      </div>
      <div class="OpertionBar">
        <div class="TpmButtonBG">
          <svg-icon icon-class="import" />
          <span class="text">导入</span>
        </div>
        <div class="TpmButtonBG">
          <svg-icon icon-class="save" />
          <span class="text">保存</span>
        </div>
        <div class="TpmButtonBG">
          <svg-icon icon-class="submit" />
          <span class="text">提交</span>
        </div>
      </div>
    </div>
    <!-- 商品 -->
    <div class="ContentWrap">
      <div class="contentli">
        <div class="contentTop">
          <div class="SKUTitle">
            皇家美素力1段婴儿配方奶粉12*350g（2021-09）
          </div>
          <div class="GuidePriceBar">
            <img src="../../../../assets/images/guide.png" alt="" class="guide" />

            <div class="GuidePriceWrap">
              <span class="guideText">指导价格:</span>
              <span class="GuidePrice">175</span>
            </div>
          </div>
        </div>
        <div class="contentInfoWrap">
          <div class="contentInfo">
            <div class="leftBar">
              <div class="leftli unit">档位\KA</div>
              <div class="leftli">¥200</div>
              <div class="leftli">¥180</div>
              <div class="leftli">¥160</div>
              <div class="AllWrap">
                <div class="All">VOL(箱)</div>
                <div class="All">Price(均价)</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">橙心优选</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">网易严选</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东七鲜</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP皇家</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
          </div>
          <div class="NKABar">
            <div class="NkATitle">NKA</div>
            <div class="NKAInfo">
              <div class="NKAli">0</div>
              <div class="NKAli">0</div>
              <div class="NKAli">0</div>
            </div>
            <div class="NKAAll">VOL合计：0</div>
          </div>
        </div>
      </div>
      <div class="contentli">
        <div class="contentTop">
          <div class="SKUTitle">
            皇家美素力1段婴儿配方奶粉12*350g（2021-09）
          </div>
          <div class="GuidePriceBar">
            <img src="../../../../assets/images/guide.png" alt="" class="guide" />

            <div class="GuidePriceWrap">
              <span class="guideText">指导价格:</span>
              <span class="GuidePrice">175</span>
            </div>
          </div>
        </div>
        <div class="contentInfoWrap">
          <div class="contentInfo">
            <div class="leftBar">
              <div class="leftli unit">档位\KA</div>
              <div class="leftli">¥200</div>
              <div class="leftli">¥180</div>
              <div class="leftli">¥160</div>
              <div class="AllWrap">
                <div class="All">VOL(箱)</div>
                <div class="All">Price(均价)</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">橙心优选</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">网易严选</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东七鲜</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP皇家</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
            <div class="leftBar inputBarCol">
              <div class="leftli unit">京东网-POP</div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="leftli inputBarWrap">
                <input type="text" class="inputBar" placeholder="请输入" />
              </div>
              <div class="AllWrap">
                <div class="All">¥100</div>
                <div class="All">0</div>
              </div>
            </div>
          </div>
          <div class="NKABar">
            <div class="NkATitle">NKA</div>
            <div class="NKAInfo">
              <div class="NKAli">0</div>
              <div class="NKAli">0</div>
              <div class="NKAli">0</div>
            </div>
            <div class="NKAAll">VOL合计：0</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js" />

<style lang="scss" scoped>
.Maincontent {
  .TopBar {
    display: flex;
    align-items: center;
    .viewTitle {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #4192d3;
      margin-left: 14px;
    }
  }
  .ContentWrap {
    width: 100%;
    .contentli {
      height: 480px;
      padding: 20px;
      box-sizing: border-box;
      background: #ffffff;
      border: 1px solid #f2f3f5;
      box-shadow: 3px 3px 14px 0px rgba(228, 228, 228, 0.6);
      border-radius: 20px;
      margin-bottom: 20px;
      .contentTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .SKUTitle {
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 600;
          color: #111111;
        }
        .GuidePriceBar {
          display: flex;
          align-items: center;
          color: #4192d3;
          font-weight: 500;
          font-size: 16px;
          .guide {
            width: 20px;
            height: 20px;
          }
          .GuidePriceWrap {
            .guideText {
              margin: 0 5px;
            }
            .GuidePrice {
              font-size: 20px;
              margin-left: 5px;
            }
          }
        }
      }
      .contentInfoWrap {
        display: flex;
        margin-top: 10px;
        .contentInfo {
          //width: 1200px;
          // height: 269px;
          display: flex;
          flex-wrap: nowrap;
          border: 1px solid #e7e7e7;
          border-radius: 10px 10px 0 0;
          overflow: hidden;
          max-width: calc(100% - 175px);
          overflow-x: auto;
          width: 1300px;
          .leftBar {
            width: 106px;
            height: 100%;
            .leftli {
              width: 100%;
              height: 67px;
              line-height: 67px;
              background-color: #4192d3;
              color: #ffffff;
              font-size: 16px;
              text-align: center;
              border-bottom: 1px solid #fff;
            }
            .unit {
              height: 38px;
              line-height: 38px;
            }
            .AllWrap {
              .All {
                height: 48px;
                line-height: 48px;
                font-weight: 400;
                color: #001111;
                font-size: 16px;
                text-align: center;
                background-color: #f3f3f3;
                margin-top: 1px;
              }
              &:nth-last-child(1) {
                margin-top: 15px;
              }
            }
            .inputBarWrap {
              width: 100%;
              padding: 16px 6px;
              box-sizing: border-box;
              background-color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              border-bottom: 1px solid #e7e7e7;
              border-right: 1px solid #e7e7e7;
              // margin-top: -1px;
              // margin-right: 1px;
              .inputBar {
                // width: 226px;
                width: 96%;
                height: 37px;
                padding-left: 10px;
                box-sizing: border-box;
                font-size: 14px;
                background: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 2px;
                outline: none;
                input::-webkit-input-placeholder,
                textarea::-webkit-input-placeholder {
                  color: #999;
                  font-size: 14px;
                }
              }
            }
          }
          .inputBarCol {
            width: 240px;
            overflow: hidden;
            .unit {
              margin-left: 1px;
            }
            .AllWrap {
              .All {
                height: 48px;
                line-height: 48px;
                font-weight: 400;
                color: #001111;
                font-size: 16px;
                // text-align: center;
                padding-left: 8px;
                box-sizing: border-box;
                background-color: #f3f3f3;
                text-align: left;
                margin-top: 1px;
              }
              &:nth-last-child(1) {
                margin-top: 15px;
              }
            }
          }
          .inputBarCol:nth-last-child(1) .inputBarWrap {
            border-right: 0;
          }
          table {
            border-radius: 10px 10px 0 0;
            .th {
              width: 200px;
              height: 48px;
              text-align: center;
              background-color: #4192d3;
              line-height: 48px;
              color: #ffffff;
            }
          }
        }
        .NKABar {
          width: 175px;

          overflow: hidden;
          margin-left: 25px;
          border-radius: 10px 10px 0 0;
          .NkATitle {
            width: 100%;
            height: 38px;
            line-height: 38px;
            text-align: center;
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            background-color: #4192d3;
          }
          .NKAInfo {
            .NKAli {
              height: 68px;
              line-height: 68px;
              text-align: center;
              border-bottom: 1px solid #e7e7e7;
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #001111;
              background-color: #fafafa;
            }
            & .NKAli:nth-last-child(1) {
              border: none;
            }
          }
          .NKAAll {
            width: 100%;
            height: 38px;
            border-radius: 10px;
            background-color: #4192d3;
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 38px;
            margin-top: 16px;
          }
        }
      }
    }
  }
}
</style>

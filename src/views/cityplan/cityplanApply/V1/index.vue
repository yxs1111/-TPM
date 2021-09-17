<template>
  <div class="Maincontent" @keyup.enter="search">
    <div class="SelectBarWrap">
      <div class="SelectBar">
        <div class="Selectli">
          <span class="SelectliTitle">SKU</span>
          <el-select v-model="SKU" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
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
      V1
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
    
  }
}
</style>

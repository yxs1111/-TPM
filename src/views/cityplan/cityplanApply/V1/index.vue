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
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      stripe
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="amount1"
        label="¥200">

        <template slot-scope="{row}">
          <div>
            <input type="text" v-model="row.amount3">
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
					<div style="">¥180</div>
				</template>
        <template slot-scope="{row}">
          <div>
            <input type="text" v-model="row.amount1">
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
					<div style="">均价</div>
				</template>
        <template slot-scope="{row}">
          <div>
            {{Number(row.amount1)+Number(row.amount3)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="NKA"
        label="NKA">
      </el-table-column>
    </el-table>
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
    height: 300px;
    border: 1px solid #e7e7e7;
    background-color: #fff;
    color: #666;
    font-size: 14px;
    .contentTop {
      width: 100%;
      height: 60px;
      display: flex;
      line-height: 60px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      text-align: center;
      .contentCol {
        width: 130px;
        border-bottom: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
      }
      .skuInfo {
        border-right: none;
      }
    }
  }
}
</style>

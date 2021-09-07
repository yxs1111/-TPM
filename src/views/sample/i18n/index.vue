<template>
  <div class="app-container">
    这个页面，用来进行国际化切换演示<br><br>

    <el-button type="primary">{{ $t('table.search') }}</el-button>
    <el-button type="success">{{ $t('table.add') }}</el-button>
    <el-button type="primary">{{ $t('table.edit') }}</el-button>
    <el-button type="danger">{{ $t('table.delete') }}</el-button>
    <br>
    <el-switch
      v-model="locale"
      active-text="中文"
      inactive-text="英文"
      active-value="zh"
      inactive-value="en"
      active-color="#ff4949"
      inactive-color="#13ce66"
      @change="handleChange"
    />
  </div>
</template>

<script src="./index.js">

</script>

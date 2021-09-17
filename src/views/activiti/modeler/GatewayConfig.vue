<template>
  <div>
    <el-dialog v-loading="dialogLoading" v-bind="$attrs" title="网关条件配置" v-on="$listeners" @opened="onOpen">
      <el-form ref="form" :model="gatewayInfo" label-width="80px">
        <el-form-item label="审批角色">
          <el-input v-model="gatewayInfo.nextGroups" type="text" disabled="true" />
        </el-form-item>
        <el-form-item label="配置内容">
          <el-input v-model="gatewayInfo.conditions" type="text" @input="onInput" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$emit('submit')">确认</el-button>
          <el-button @click="$emit('update:visible', false)">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    gatewayInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogLoading: false
    }
  },
  methods: {
    onInput() {
      this.$forceUpdate()
    },
    onOpen() {

    }
  }
}
</script>

<style scoped/>

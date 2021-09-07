<template>
  <div>
    <el-dialog v-loading="dialogLoading" v-bind="$attrs" title="分配任务" v-on="$listeners" @opened="onOpen">
      <el-form ref="form" :model="assignInfo" label-width="80px">
        <el-tabs v-model="assignInfo.way">
          <!--   指定人员     -->
          <el-tab-pane label="指定人员" name="assign">
            <el-form-item label="指定人员">
              <el-input v-model="assignInfo.assignee" type="text" @input="onInput" />
            </el-form-item>
            <el-form-item label="选择多人">
              <el-select v-model="assignInfo.names" placeholder="请选择活动区域">
                <el-cascader
                  placeholder="试试搜索：指南"
                  :props="{ multiple: true }"
                  filterable
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <!--   指定角色     -->
          <el-tab-pane label="指定角色" name="role">指定角色</el-tab-pane>
          <!--   指定部门     -->
          <el-tab-pane label="指定部门" name="dept">
            <el-form-item label="审批部门" prop="departments">
              <el-cascader
                v-model="assignInfo.departmentArr"
                placeholder="输入部门名称检索"
                :options="departmentOptions"
                :props="{ value: 'id', label: 'name'}"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="$emit('submit')">保存</el-button>
          <el-button @click="$emit('update:visible', false)">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import organizationApi from '@/api/system/organization-api'
export default {
  name: 'Index',
  props: {
    assignInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogLoading: false,
      departmentOptions: []
    }
  },
  methods: {
    onInput() {
      this.$forceUpdate()
    },
    onOpen() {
      // 1、重新加载组织树。
      this.departmentOptions = []
      organizationApi.getAll().then(res => {
        if (res.data) {
          this.departmentOptions.push(res.data)
        }
      })
      // 2、重新加载角色。
      // 3、重新获取人员列表。
    }
  }
}
</script>

<style scoped/>

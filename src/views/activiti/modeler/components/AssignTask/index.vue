<template>
  <div>
    <el-dialog v-loading="dialogLoading" v-bind="$attrs" title="分配任务" v-on="$listeners" @opened="onOpen">
      <el-form ref="form" :model="assignInfo" label-width="80px">
        <el-tabs v-model="assignInfo.way">
          <!--   指定人员     -->
          <el-tab-pane label="指定人员" name="assign">
            <el-form-item label="指定人员">
              <!-- <el-input v-model="assignInfo.assignee" type="text" @input="onInput" /> -->
              <el-select v-model="assignInfo.assignee" placeholder="请选择">
                <el-option
                  v-for="item in userOptions"
                  :key="item.loginName"
                  :label="item.name"
                  :value="item.loginName"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="选择多人">
              <el-select v-model="assignInfo.names" placeholder="请选择活动区域">
                <el-cascader
                  placeholder="试试搜索：指南"
                  :props="{ multiple: true }"
                  filterable
                />
              </el-select>
            </el-form-item> -->
          </el-tab-pane>
          <!--   指定角色     -->
          <el-tab-pane label="指定角色" name="role">
            <!-- <el-form-item label="角色">
              <el-input v-model="assignInfo.roleCode" type="text" @input="onInput" />
            </el-form-item> -->
            <el-form-item label="角色">
              <el-select v-model="assignInfo.roleCode" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <!--   指定部门     -->
          <!-- <el-tab-pane label="指定部门" name="dept">
            <el-form-item label="审批部门" prop="departments">
              <el-cascader
                v-model="assignInfo.departmentArr"
                placeholder="输入部门名称检索"
                :options="departmentOptions"
                :props="{ value: 'id', label: 'name'}"
              />
            </el-form-item>
          </el-tab-pane> -->
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
import roleApi from '@/api/system/role-api'
import userApi from '@/api/system/user-api'
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
      departmentOptions: [],
      roleOptions: [],
      userOptions: []
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
      this.roleOptions = []
      roleApi.getAllRole().then(res => {
        if (res.data) {
          this.roleOptions = res.data
        }
      })
      // 3、重新获取人员列表。
      this.userOptions = []
      userApi.getAllUser().then(res => {
        if (res.data) {
          this.userOptions = res.data
        }
      })
    }
  }
}
</script>

<style scoped/>

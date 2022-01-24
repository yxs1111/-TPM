<template>
  <div>
    <el-dialog v-loading="dialogLoading" v-bind="$attrs" title="分配任务" v-on="$listeners" @opened="onOpen">
      <el-form ref="form" :model="assignInfo" label-width="100px" label-suffix=":">
        <el-tabs v-model="assignInfo.way" @tab-click="handleClickTab">
          <!--   指定人员     -->
          <el-tab-pane label="指定人员" name="assign">
            <el-form-item label="登录账号">
              <el-input v-model="assignInfo.userId" type="text" @input="$forceUpdate()" />
            </el-form-item>
          </el-tab-pane>
          <!--   指定角色     -->
          <el-tab-pane label="指定角色" name="role">
            <el-form-item label="选择角色">
              <el-select v-model="assignInfo.roleId" filterable clearable>
                <el-option
                  v-for="role in roleOptions"
                  :key="role.code"
                  :label="role.name"
                  :value="role.code"
                />
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <!--   指定部门     -->
          <el-tab-pane label="指定部门" name="dept">
            <el-form-item label="审批部门" prop="departments">
              <el-cascader
                v-model="assignInfo.deptId"
                placeholder="输入部门名称检索"
                :options="departmentOptions"
                :props="{ value: 'id', label: 'name'}"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="handleAssignTask">保存</el-button>
          <el-button @click="$emit('update:visible', false)">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

const is = require('bpmn-js/lib/util/ModelUtil').is

import organizationApi from '@/api/system/organization-api'
import roleApi from '@/api/system/role-api'
export default {
  name: 'AssignTask',
  props: {
    modeler: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogLoading: false,
      departmentOptions: [],
      roleOptions: [],
      assignWayEnum: {
        USER: 'assign',
        ROLE: 'role',
        DEPT: 'dept'
      },
      element: null, // 当前选中的元素
      assignInfo: {
        way: null, // 分配方式：assign->指定人员、role->指定角色、dept->指定部门。
        userId: null, // 指定单个人员
        roleId: null, // 选中的角色
        deptId: null // 单个部门
      }
    }
  },
  mounted() {
    this.fetchOptionDatas()
  },
  methods: {
    handleClickTab(tab) {
      this.assignInfo.way = tab.name
    },
    onOpen() {
      const elementRegistry = this.modeler.get('elementRegistry')
      this.element = elementRegistry.activatedEle

      // 任务分配人
      if (is(this.element, 'bpmn:UserTask') && this.element.businessObject && this.element.businessObject.$attrs) {
        if (this.element.businessObject.extensionElements) {
          this.assignInfo.way = this.assignWayEnum.ROLE
          this.assignInfo.userId = null
          this.assignInfo.deptId = null
          this.assignInfo.roleId = this.element.businessObject.$attrs['activiti:assignee'] || this.element.businessObject.assignee
        } else {
          this.assignInfo.way = this.assignWayEnum.USER
          this.assignInfo.roleId = null
          this.assignInfo.deptId = null
          this.assignInfo.userId = this.element.businessObject.$attrs['activiti:assignee'] || this.element.businessObject.assignee
        }
      }
    },
    fetchOptionDatas() {
      // 1、重新加载组织树。
      this.departmentOptions = []
      organizationApi.getAll().then(res => {
        if (res.data) {
          this.departmentOptions.push(res.data)
        }
      })
      // 2、重新加载角色。 roleOptions
      roleApi.listAllRole().then(roleRes => {
        if (roleRes && roleRes.code === 1000) {
          this.roleOptions = roleRes.data.filter(role => role.isPrivate === 0)
        }
      })
      // 3、重新获取人员列表。
    },
    /**
     * 分配任务：
     * activiti:assignee
     * activiti:candidateUsers
     * activiti:candidateGroups
     * <humanPerformer>
     */
    handleAssignTask() {
      switch (this.assignInfo.way) {
        case this.assignWayEnum.USER:
          // assignee user
          if (this.assignInfo.userId) {
            this.updateProperties({
              'activiti:assignee': this.assignInfo.userId,
              extensionElements: null
            })
          } else {
            this.updateProperties({
              'activiti:assignee': null,
              extensionElements: null
            })
          }
          break
        case this.assignWayEnum.ROLE:
          // assignee role
          if (this.assignInfo.roleId) {
            this.updateProperties({
              'activiti:assignee': this.assignInfo.roleId
            })
            const moddle = this.modeler.get('moddle')
            const extensions = moddle.create('bpmn:ExtensionElements', { values: [] })
            const roleTaskListener = moddle.create('activiti:TaskListener', { event: 'create', delegateExpression: '${roleUserTaskListener}' })
            extensions.values.push(roleTaskListener)
            this.updateProperties({
              extensionElements: extensions
            })
          } else {
            // 删除
            this.updateProperties({
              'activiti:assignee': null,
              extensionElements: null
            })
          }
          break
        case this.assignWayEnum.DEPT:
          break
        default:
          return
      }
      this.$emit('update:visible', false)
    },
    /**
     * 更新元素属性
     * @param properties: 要更新的属性, 例如 { name: '' }
     */
    updateProperties(properties) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateProperties(element, properties)
    }
  }
}
</script>

<style scoped/>

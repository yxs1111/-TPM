<template>
  <el-dialog v-loading="dialogLoading" v-el-drag-dialog v-bind="$attrs" v-on="$listeners" @open="init">
    <!--  任务描述  -->
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="一、任务信息" name="businessItem">
        <span>任务名称：{{ task.name }}</span>
      </el-collapse-item>
      <el-collapse-item title="二、申请信息" name="applyItem">
        <!--        <el-form
          :size="formConf.size"
          :label-position="formConf.labelPosition"
          :disabled="formConf.disabled"
          :label-width="formConf.labelWidth + 'px'"
        >
          <dynamic-form-item
            v-for="(item,index) in applyFormList"
            :key="index"
            :drawing-list="applyFormList"
            :current-item="item"
            :form-conf="formConf"
            @activeItem="activeFormItem"
          />
        </el-form>-->
        <slot />
      </el-collapse-item>
      <el-collapse-item title="三、审批单" name="approveItem">
        <el-form
          :size="formConf.size"
          :label-position="formConf.labelPosition"
          :disabled="formConf.disabled"
          :label-width="formConf.labelWidth + 'px'"
        >
          <dynamic-form-item
            v-for="(item,index) in approveFormList"
            :key="index"
            :drawing-list="approveFormList"
            :current-item="item"
            :form-conf="formConf"
            @activeItem="activeFormItem"
          />
        </el-form>
        <el-form :inline="true" style="padding-left: 50px">
          <el-form-item label="审核人姓名">
            <el-input v-model="loginUserName" style="width: 180px" />
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input v-model="loginUserAccount" style="width: 180px" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!--  按钮组  -->
    <el-row :gutter="20" style="text-align: center">
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
      <el-button type="warning" @click="rejectPreviousStep">驳回上一级</el-button>
      <el-button type="danger" @click="deleteProcessInstance">驳回全部</el-button>
      <el-button type="primary" icon="el-icon-success" @click="completeTask">通过</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import taskApi from '@/api/activiti/taskApi'
import formApi from '@/api/activiti/formApi'
// eslint-disable-next-line no-unused-vars
import variableApi from '@/api/activiti/variableApi'
import processApi from '@/api/activiti/processApi'
import {
  formConf
} from '@/components/activiti/form/generator/config'
import DynamicFormItem from '@/components/DynamicFormItem'
import { Message } from 'element-ui'
import auth from '@/utils/auth'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'ApproveFlow',
  components: {
    DynamicFormItem
  },
  directives: { elDragDialog },
  props: {
    businessId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      execution: {
        variables: [],
        processInstanceId: null
      },
      activeNames: ['businessItem', 'applyItem', 'approveItem'],
      task: {},
      tasks: null,
      formConf,
      sizeForm: {},
      formHtml: '',
      approveFormList: null, // 审批表单List
      applyFormList: null, // 申请表单List
      formJs: '',
      formCss: '',
      loginUserName: auth.getName(),
      loginUserAccount: auth.getLoginName(),
      dialogLoading: false
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    ...mapActions('task', ['complete']),
    handleChange(val) {
      console.log(val)
    },
    initErrorHandler: function(errorMessage) {
      this.$emit('update:visible', false)
      if (this.dialogLoading) {
        this.dialogLoading = false
      }
      this.$message.error(errorMessage)
    },
    /**
     * 初始化审批单页面
     */
    init: async function() {
      this.dialogLoading = true
      if (!this.businessId) {
        this.initErrorHandler('未获取到业务ID,请返回业务模块')
        return
      }
      // 1、根据businessId获取Execution。(runtime/executions?processInstanceBusinessKey=1425380061769084930)
      const executionRes = await processApi.getExecutionInfoByBusinessId(this.businessId)
      if (!executionRes || executionRes.code !== 1000) {
        this.initErrorHandler(`业务ID${this.businessId}没有有效的执行`)
        return
      }
      if (!executionRes.data || !executionRes.data.records || executionRes.data.records.length === 0) {
        this.initErrorHandler(`根据${this.businessId}获取不到有效流程的Execution`)
        return
      }
      Object.assign(this.execution, executionRes.data.records[0])
      // 注释第二步是因为申请页面暂时不通过表单设计器生成，后期改为通过表单设计器生成申请页面的时候可以再打开直接使用
      // 2、通过Execution获取FormKey，和Variables渲染业务表单。(runtime/executions/25013/variables)
      /* await variableApi.getVariablesOfExecution(this.execution.id).then(res => {
        if (res && res.code === 1000) {
          this.execution.variables = res.data
        }
      })*/
      // 2.1、获取并渲染"申请单据"
      /* await this.getAndRenderApplyForm()*/
      // 3、通过ProcessInstanceId和Assignee获取属于当前登录用户的任务 (runtime/tasks/25013/admin)
      if (!this.execution.processInstanceId) {
        this.initErrorHandler('当前执行没有有效的实例ID')
        return
      }
      const taskRes = await processApi.getTaskByProcessInstanceIdAndAssignee(this.execution.processInstanceId, auth.getLoginName())
      if (taskRes && taskRes.code === 1000) {
        const tasks = taskRes.data
        if (Array.isArray(tasks) && tasks.length > 0) {
          this.tasks = tasks
          // TODO 暂不实现一个流程实例同时存在两个需要当前用户处理的任务
          this.task = tasks[0]
        } else {
          this.initErrorHandler(`暂无需要${auth.getLoginName()}处理的任务`)
          return
        }
      }
      // 4、渲染"审批单"
      await this.getTaskDetail()
      this.dialogLoading = false
    },
    /**
     * 获取申请单并渲染
     */
    getAndRenderApplyForm: function() {
      if (this.execution.variables.length > 0) {
        const formId = this.execution.variables.filter(variable => variable.name === 'formId').map(value => value.value)
        formApi.getFormById(formId).then(res => {
          if (res.code === 1000 && res.data.metaInfo) {
            const fieldList = JSON.parse(res.data.metaInfo).fields
            fieldList.forEach(applyFormItem => {
              const modelName = applyFormItem.__vModel__
              applyFormItem.readonly = true
              const modelValue = this.execution.variables.filter(variable => variable.name === modelName).map(value => value.value)[0]
              Object.assign(applyFormItem.__config__, { defaultValue: modelValue })
            })
            this.applyFormList = fieldList
          }
        })
      }
    },
    async getTaskDetail() {
      const taskRes = await taskApi.getTask(this.task)
      if (taskRes.code === 1000) { this.task = taskRes.data }
      // 获取审批单据
      if (this.task.formKey) {
        formApi.getFormById(this.task.formKey).then(res => {
          if (res.code === 1000 && res.data.metaInfo) {
            this.approveFormList = JSON.parse(res.data.metaInfo).fields
          }
        })
      }
    },
    activeFormItem(currentItem) {
      console.log('currentItem' + currentItem)
    },
    /**
     * 生成当前流程变量数组
     */
    generateCurrentProcessVariables(append) {
      const variables = [{
        name: 'approver',
        type: 'string',
        value: auth.getName()
      }]
      if (append) {
        variables.push(append)
      }
      this.approveFormList.forEach(formItem => {
        variables.push({
          name: formItem.__vModel__,
          type: 'string',
          value: formItem.__config__.defaultValue
        })
      })
      return variables
    },
    completeTask: function() {
      this.dialogLoading = true
      // 获取任务变量
      const variables = this.generateCurrentProcessVariables({
        name: 'result',
        type: 'string',
        value: '通过'
      })
      Object.assign(this.task, { variables: variables })
      taskApi.complete(this.task).then(res => {
        this.dialogLoading = false
        if (res.code === 1000) {
          // 判断流程是否完结
          if (res.data.executionId === 'end') {
            this.$emit('flowEnd')
          }
          if (res.data) {
            this.$emit('pass', res.data)
          }
          Message.success({
            type: 'success',
            message: '完成任务'
          })
        }
        this.$emit('update:visible', false)
      })
    },
    /**
     * 驳回上一步
     */
    rejectPreviousStep: function() {
      this.dialogLoading = true
      // 获取任务变量
      const variables = this.generateCurrentProcessVariables({
        name: 'result',
        type: 'string',
        value: '驳回'
      })
      taskApi.rejectPreviousStep(this.task.id, variables).then(res => {
        this.dialogLoading = false
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '驳回成功'
          })
        }
        this.$emit('update:visible', false)
      })
    },
    deleteProcessInstance: function() {
      this.dialogLoading = true
      processApi.deleteProcessInstanceById(this.execution.processInstanceId, '驳回全部').then(res => {
        this.dialogLoading = false
        if (res && res.code === 1000) {
          Message.success({
            type: 'success',
            message: '驳回成功'
          })
          this.$emit('update:visible', false)
          this.$emit('delete')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>

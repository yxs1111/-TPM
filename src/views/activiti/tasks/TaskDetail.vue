<template>
  <div>
    <!--  任务描述  -->
    <el-card shadow="hover">
      <span>任务：{{ task.name }}</span>
    </el-card>
    <!--  按钮组  -->
    <el-row :gutter="20" style="padding-left: 20px">
      <el-button type="success" round icon="el-icon-back" @click="$router.go(-1)">返回列表</el-button>
      <el-button type="primary" round icon="el-icon-success" @click="completeTask">完成任务</el-button>
      <el-button type="warning" round icon="el-icon-view" @click="flowDiagram.visible = true">流程图</el-button>
      <el-button type="danger" round icon="el-icon-thumb">转办</el-button>
    </el-row>
    <el-card>
      <el-collapse v-model="activeNames" @change="handleChange">
        <!--  任务单据  -->
        <el-collapse-item title="《流程单据》:" name="1">
          <el-row class="center-board-row" :gutter="formConf.gutter">
            <el-form
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
            >
              <dynamic-form-item
                v-for="(item,index) in drawingList"
                :key="index"
                :drawing-list="drawingList"
                :current-item="item"
                :form-conf="formConf"
                @activeItem="activeFormItem"
              />
            </el-form>
          </el-row>
        </el-collapse-item>
        <!--  历史任务  -->
        <el-collapse-item title="《操作历史》:" name="2">
          <el-steps :active="2" align-center>
            <el-step title="步骤1" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤2" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤3" description="这是一段很长很长很长的描述性文字" />
            <el-step title="步骤4" description="这是一段很长很长很长的描述性文字" />
          </el-steps>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!--  流程图  -->
    <flow-diagram
      svg-type="instance"
      :process-definition-id="task.processDefinitionId"
      :visible.sync="flowDiagram.visible"
      title="流程图"
      width="90%"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import taskApi from '@/api/activiti/taskApi'
import formApi from '@/api/activiti/formApi'
import {
  formConf
} from '@/components/activiti/form/generator/config'
// import DynamicFormItem from '@/components/DynamicFormItem'
import FlowDiagram from '@/components/FlowDiagram'
import { Message } from 'element-ui'

export default {
  name: 'TaskDetail',
  components: {
     FlowDiagram
  },
  data: function() {
    return {
      task: {},
      formConf,
      activeNames: ['1'],
      sizeForm: {},
      formHtml: '',
      drawingList: null,
      formJs: '',
      formCss: '',
      flowDiagram: {
        visible: false
      }
    }
  },
  created() {
    this.task = this.$route.query
  },
  mounted() {
    this.getTaskDetail()
  },
  methods: {
    ...mapActions('task', ['complete', 'pageList']),
    ...mapMutations('task', []),
    handleChange(val) {
      console.log(val)
    },
    async getTaskDetail() {
      const taskRes = await taskApi.getTask(this.task)
      if (taskRes.code === 1000) { this.task = taskRes.data }
      // 获取任务单据
      if (this.task.formKey) {
        formApi.getFormById(this.task.formKey).then(res => {
          if (res.code === 1000 && res.data.metaInfo) {
            this.drawingList = JSON.parse(res.data.metaInfo).fields
          }
        })
      }
    },
    activeFormItem(currentItem) {
      console.log('currentItem' + currentItem)
    },
    completeTask: function() {
      taskApi.complete(this.task).then(res => {
        if (res.code === 1000) {
          Message.success({
            type: 'success',
            message: '完成任务'
          })
        }
        this.$router.go(-1)
        this.pageList()
      })
    }
  }
}
</script>


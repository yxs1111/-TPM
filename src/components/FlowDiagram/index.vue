<template>
  <el-dialog v-bind="$attrs" @open="getFlowSVG" v-on="$listeners">
    <div v-if="svgType === 'instance'" @click="event => showTaskHistory(event)" v-html="svg" />
    <div v-else v-html="svg" />
    <!--  活动历史  -->
    <el-table v-show="svgType === 'instance'" ref="activityHistoryTable" :data="activityHistory.data" border fit stripe highlight-current-row>
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column v-slot="scopeProps" align="center" label="序号" width="95">
        {{ activityHistory.data.length-scopeProps.$index}}
      </el-table-column>
      <el-table-column v-slot="{row}" label="办理节点" align="left">
        {{ row.activityName }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="办理人" align="center">
        {{ row.assignee }}
      </el-table-column>
      <el-table-column v-slot="{row}" label="办理时间" align="center">
        <em class="el-icon-time" />
        <span>{{ parseJson(row.endTime, '{y}-{m}-{d} {h}:{i}') }}</span>
      </el-table-column>
      <el-table-column v-slot="{row}" label="办理结果" align="center">
        {{ row.result }}
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import processApi from '@/api/activiti/processApi'
import historyApi from '@/api/activiti/historyApi'
import { parseTime } from '@/utils'
export default {
  name: 'Index',
  directives: { elDragDialog },
  props: {
    // 流程定义OR流程实例ID
    processDefinitionId: {
      type: String,
      default: '',
      required: false,
    },
    // 业务ID
    businessId: {
      type: String,
      default: '',
      required: false,
    },
    // 流程ID
    processId: {
      type: String,
      default: '',
      required: false
    },
    // 查看SVG的类型
    svgType: {
      required: true,
      type: String,
      validator: function (value) {
        return ['definition', 'instance'].includes(value)
      },
    },
  },
  data() {
    return {
      svg: null,
      activityHistory: {
        data: [],
      },
    }
  },
  mounted() {
    this.getFlowSVG()
    this.getHistory()
  },
  methods: {
    /**
     * 获取点击Activity的历史审批信息
     *  先根据业务ID获取流程实例ID，再使用流程实例ID和当前选择的ActivityId获取活动历史
     **/
    showTaskHistory(event) {
      const activityId = event.path[1].getAttribute('id')
      if (activityId) {
        if (this.businessId && this.svgType === 'instance') {
          historyApi
            .getHisOfActInsByBusinessIdAndActId(activityId, this.businessId)
            .then((res) => {
              if (res && res.code === 1000) {
                this.handleActivityHistory(res.data.records)
              } else {
                if (res) {
                  this.$message.error(
                    `获取活动历史出错，错误信息:${res.message}`
                  )
                }
              }
            })
        }
      }
    },
    /**
     * 从变量数组中获取当前任务需要展示的变量信息
     */
    handleActivityHistory(activityHisArr) {
      this.activityHistory.data = []
      activityHisArr.forEach((his) => {
        const record = {}
        Object.assign(record, his)
        if (!record.endTime) {
          return true
        }
        if (Array.isArray(his.restVariables) && his.restVariables.length > 0) {
          his.restVariables.forEach((variable) => {
            if (variable.name === 'result') {
              Object.assign(record, { result: variable.value })
            } else if (variable.name === 'idea') {
              Object.assign(record, { idea: variable.value })
            } else if (variable.name === 'approver') {
              Object.assign(record, { approver: variable.value })
            } else if (variable.name === 'approvalUser') {
              Object.assign(record, { assignee: variable.value })
            }
          })
        }
        this.activityHistory.data.push(record)
      })
    },
    /**
     * 获取流程图
     **/
    getFlowSVG() {
      if (this.processDefinitionId && this.processDefinitionId !== '') {
        // 通过"流程实例"或者"流程定义"获取流程图
        this.svg = null
        if (this.svgType === 'definition') {
          processApi
            .getProcessDefinitionDiagram(this.processDefinitionId)
            .then((res) => {
              this.setSVG(res)
            })
        } else if (this.svgType === 'instance') {
          processApi
            .getProcessInstanceDiagram(this.processDefinitionId)
            .then((res) => {
              this.setSVG(res)
            })
        } else {
          throw new Error('请配置正确的SVG类型')
        }
      } else if (this.businessId && this.businessId !== '') {
        // 通过业务ID获取流程图
        processApi
          .getProcessInstanceDiagramByBusinessId(this.businessId)
          .then((res) => {
            this.setSVG(res)
          })
      }
    },
    /**
     * 从接口返回中获取SVG
     *  以"<svg"开始截取，之前的XML文档信息去掉
     * @param res
     */
    setSVG(res) {
      if (res && res.code === 1000 && res.data) {
        this.svg = res.data.substring(res.data.indexOf('<svg'))
      }
    },
    // 格式化时间
    parseJson(time, cFormat) {
      if (time == null) {
        return ''
      }
      return parseTime(time, cFormat)
    },
    getHistory() {
      historyApi.getAllHis(this.processId).then(res => {
        this.activityHistory.loading = false
        if (res && res.code === 1000) {
          this.handleActivityHistory(res.data)
        } else {
          if (res) {
            this.$message.error(`获取活动历史出错，错误信息:${res.message}`)
          }
        }
      })
    },
  },
}
</script>

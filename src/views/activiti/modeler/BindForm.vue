<template>
  <div>
    <el-dialog v-bind="$attrs" title="选择流程单据" v-on="$listeners">
      <el-row>
        <el-form>
          <el-form-item>
            <el-input />
          </el-form-item>
          <el-form-item>
            <el-select v-model="value" placeholder="请选择" :style="{width: '100%'}">
              <el-option
                v-for="item in businessObjects"
                :key="item.id"
                :label="item.businessName"
                :value="item.id"
              >
                <span style="float: left">{{ item.businessName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.businessTable }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="$emit('submit',value)">绑定</el-button>
            <el-button @click="$emit('update:visible', false)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import formApi from '@/api/activiti/formApi'
export default {
  name: 'BindForm',
  props: {
    modeler: {
      type: BpmnModeler,
      require: true,
      default: null
    }
  },
  data() {
    return {
      businessObjects: [],
      value: ''
    }
  },
  mounted() {
    this.businessList()
  },
  methods: {
    businessList() {
      formApi.pageList({ start: 0, size: 100 }).then(res => {
        if (res.code === 1000) {
          this.businessObjects = res.data.records
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

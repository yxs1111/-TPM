<template>
  <div>
    <el-dialog v-bind="$attrs" title="选择流程单据" v-on="$listeners" @opened="handleOpenForm">
      <el-row>
        <el-form>
          <el-form-item>
            <el-select v-model="formId" placeholder="请选择表单" :style="{width: '100%'}">
              <el-option
                v-for="item in formOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBindingForm">绑定</el-button>
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
      formOptions: [],
      formId: '',
      element: null
    }
  },
  methods: {
    handleOpenForm() {
      const elementRegistry = this.modeler.get('elementRegistry')
      this.element = elementRegistry.activatedEle
      this.fetchOptionDatas()
    },
    fetchOptionDatas() {
      this.formOptions = []
      formApi.fineListAll().then(formRes => {
        if (formRes && formRes.code === 1000 && formRes.data && Array.isArray(formRes.data)) {
          formRes.data.forEach(form => {
            this.formOptions.push({
              value: form.id,
              label: form.name
            })
          })
        }
      })
    },
    /**
     * 更新元素属性
     * @param properties: 要更新的属性, 例如 { name: '' }
     */
    updateProperties(properties) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateProperties(element, properties)
    },
    /**
     * 为任务绑定Form
     */
    handleBindingForm() {
      if (this.formId) {
        this.updateProperties({
          'activiti:formKey': this.formId
        })
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style scoped>

</style>

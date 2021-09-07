<script>
import render from '@/components/activiti/form/render/render'
import draggable from 'vuedraggable'
import formApi from '@/api/activiti/formApi'
import { Message } from 'element-ui'
import {
  formConf
} from '@/components/activiti/form/generator/config'

const layouts = {
  colFormItem(h, currentItem) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    const className = 'drawing-item'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span} class={className}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required} prop={currentItem.__vModel__}>
          <render key={config.renderKey} conf={currentItem} onInput={ val => {
            // 为了统一，表单元素的value绑定到了__config__.defaultValue,所以此处仍将val设置到__config__.defaultValue
            this.$set(config, 'defaultValue', val)
            this.$set(this.formData, currentItem.__vModel__, val)
          }}>
            {child}
          </render>
        </el-form-item>
      </el-col>
    )
  },
  rowFormItem(h, currentItem) {
    const config = currentItem.__config__
    const className = 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}>
          <span class='component-name'>{config.componentName}</span>
          {child}
        </el-row>
      </el-col>
    )
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    return <render key={config.renderKey} conf={currentItem} onInput={ event => {
      this.$set(config, 'defaultValue', event)
    }}>
      {child}
    </render>
  }
}

// eslint-disable-next-line no-unused-vars
const containers = {
  dialog(createElement) {
    const attrs = this.$attrs
    const _that = this
    return createElement('el-dialog',
      { props: {
        visible: attrs.visible,
        title: attrs.title,
        width: attrs.width
      },
      on: {
        open: this.handleDialogOpen,
        close: this.handleDialogClose
      }
      }, [createElement('el-form', { props: {
        size: this.formConf.size,
        gutter: this.formConf.gutter,
        span: this.formConf.span,
        model: this.formData
      },
      ref: this.formConf.formRef }, this.drawingList.map(function(currentItem) {
        const layout = layouts[currentItem.__config__.layout]
        if (layout) {
          return layout.call(_that, createElement, currentItem)
        }
        return layoutIsNotFound.call(_that)
      })),
      (
        <div slot='footer'>
          <el-button onClick={event => this.closeDialog(event)}>取消</el-button>
          <el-button type='primary' onClick={event => this.saveFormData(event)}>确定</el-button>
          <el-button type='success' onClick={event => this.designDynamicForm(event)}>设计表单</el-button>
        </div>
      )])
  }

}
function renderChildren(h, currentItem) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}
function containerNoSupport() {
  throw new Error(`暂不支持${this.showStyle}类型的容器`)
}
export default {
  name: 'DynamicForm',
  components: {
    render,
    draggable
  },
  props: {
    showStyle: {
      type: String,
      default: 'dialog',
      require: false
    },
    // eslint-disable-next-line vue/require-default-prop
    module: { // 所属业务模块
      type: String,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    operation: { // 操作类型(新增、编辑、其他)
      type: String,
      require: true
    }
  },
  data() {
    return {
      drawingList: [],
      formConf,
      formData: {},
      formRules: {}, // TODO 待实现自定义校验规则
      formId: null,
      data: null
    }
  },
  created() {
    // 1、根据租户ID、模块名、操作类型获取唯一表单
    formApi.getFormList({
      tenantId: 0,
      module: this.module,
      operation: this.operation
    }).then(res => {
      if (res && res.code === 1000) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          if (res.data.length > 1) {
            Message.error({
              type: 'error',
              message: '字典类型模块,新增功能对应两份表单'
            })
          } else {
            const data = res.data[0]
            this.drawingList = JSON.parse(data.metaInfo).fields
            this.formId = data.id
            this.data = data
          }
        }
      }
    })
  },
  methods: {
    handleDialogClose() {
      this.formData = {}
    },
    handleDialogOpen() {
      /* this.$refs[this.formConf.formRef].clearValidate()*/
    },
    saveFormData() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return
        Object.assign(this.formData, { formId: this.formId })
        this.$emit('submitForm', this.formData)
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    /**
     * 重新设计表单
     */
    designDynamicForm() {
      this.$router.push({ path: '/formDesign', query: {
        id: this.data.id
      }})
    }
  },
  render(createElement) {
    // 1、渲染容器(el-dialog/其他)，备注:其他暂不实现
    const container = containers[this.showStyle]
    if (!container) {
      return containerNoSupport()
    }
    return container.call(this, createElement)
  }
}
</script>
<style lang='scss'>
@import "src/styles/formDesigner";
</style>

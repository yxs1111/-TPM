const is = require('bpmn-js/lib/util/ModelUtil').is
import BindForm from '@/views/activiti/modeler/components/BindForm'
import AssignTask from '@/views/activiti/modeler/components/AssignTask'

export default {
  name: 'JBInfoPropertyPanel',
  components: {
    BindForm, AssignTask
  },
  props: {
    modeler: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedElements: [],
      element: {
        sequenceExpression: null
      }, // 当前选中的元素
      activeNames: ['task'], // 激活的面板
      eventTypeOptions: [
        { label: '开始事件', value: 'bpmn:StartEvent' },
        { label: '结束事件', value: 'bpmn:EndEvent' },
        { label: '消息事件', value: 'bpmn:MessageEventDefinition' },
        { label: '时间事件', value: 'bpmn:TimerEventDefinition' },
        { label: '条件事件', value: 'bpmn:ConditionalEventDefinition' }
      ],
      taskTypeOptions: [
        { label: '普通任务', value: 'bpmn:Task' },
        { label: '服务任务', value: 'bpmn:ServiceTask' },
        { label: '发送任务', value: 'bpmn:SendTask' },
        { label: '用户任务', value: 'bpmn:UserTask' }
      ],
      gateWayTypeOptions: [
        { label: '条件网关', value: 'bpmn:InclusiveGateway' },
        { label: 'XOR网关', value: 'bpmn:ExclusiveGateway' },
        { label: 'AND网关', value: 'bpmn:ParallelGateway' },
        { label: '事件网关', value: 'bpmn:EventBasedGateway' }
      ],
      bindFormDialog: {
        visible: false
      },
      assignTaskDialog: {
        visible: false
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { modeler } = this
      const elementRegistry = modeler.get('elementRegistry')
      modeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection
        this.element = e.newSelection[0]
        if (this.element) {
          // 放到"element.click"事件回调里会出现获取不到parent的情况
          elementRegistry.activatedEle = e.newSelection[0]
          // 根据选择的元素类型，激活属性选项卡
          this.openCollapseByElementType()
        }
      })
      modeler.on('element.changed', e => {
        const { element } = e
        const { element: currentElement } = this
        if (!currentElement) {
          return
        }
        // update panel, if currently selected element changed
        if (element.id === currentElement.id) {
          this.element = element
        }
      })
    },
    /**
     * 改变控件触发的事件
     * @param event: input的Event
     * @param type: 要修改的属性的名称
     */
    changeField(event, type) {
      const value = event.target.value
      const properties = {}
      properties[type] = value
      if (type === 'color') { // 若是color属性
        this.onChangeColor(value)
        return
      }
      this.element[type] = value
      this.updateProperties(properties)
    },
    changeActivitiField(event, activitiExtProperty) {
      const value = event.target.value
      const activitiProp = {}
      activitiProp['activiti:' + activitiExtProperty] = value
      this.updateProperties(activitiProp)
    },
    onChangeColor(color) {
      const { element } = this
      const modeling = this.modeler.get('modeling')
      modeling.setColor(element, {
        fill: null,
        stroke: color
      })
    },
    /**
     * 更新Label名称
     * @param name
     */
    updateName(name) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateProperties(element, {
        name
      })
    },
    /**
     * 根据选择的元素类型，激活属性选项卡
     */
    openCollapseByElementType() {
      if (this.selectedElements.length <= 0) {
        this.activeNames = ['process']
        return
      }
      const element = this.selectedElements[0]
      if (is(element, 'bpmn:Task')) {
        this.activeNames = ['task']
      } else if (is(element, 'bpmn:Event')) {
        this.activeNames = ['event']
      } else if (is(element, 'bpmn:Gateway')) {
        this.activeNames = ['gateway']
      } else if (is(element, 'bpmn:SequenceFlow')) {
        this.activeNames = ['line']
        if (this.element.businessObject && this.element.businessObject.conditionExpression) {
          this.element.sequenceExpression = this.element.businessObject.conditionExpression.body
        }
      }
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
     * 选中折叠面板
     * @param val
     */
    handleChange(val) {
      console.log(val)
    },
    /**
     * 改变事件类型
     * @param event
     */
    changeEventType(event) {
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: value
      })
    },
    /**
     * 改变任务类型
     * @param event
     */
    changeElementType(event) {
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      bpmnReplace.replaceElement(element, {
        type: value
      })
    },
    changeSequenceFlowType(event) {
      this.$set(this.element, 'customType', event.target.value)
      this.addConditionExpression('${ defaultExp == 1 }')
    },
    /**
     * 为SequenceFlow添加条件表达式
     * @param expression: 条件表达式
     */
    addConditionExpression(expression) {
      const moddle = this.modeler._moddle
      this.updateProperties({
        conditionExpression: moddle.create('bpmn:FormalExpression', {
          body: expression })
      })
      this.element.sequenceExpression = expression
    }
  }
}

const is = require('bpmn-js/lib/util/ModelUtil').is
import BindForm from '@/views/activiti/modeler/BindForm'
import AssignTask from '@/views/activiti/modeler/components/AssignTask'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import gatewayConfig from '@/views/activiti/modeler/GatewayConfig'
import { Message } from 'element-ui'

export default {
  name: 'JBInfoPropertyPanel',
  components: {
    BindForm, AssignTask, gatewayConfig
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
      assignInfo: {
        way: 'assign', // 分配方式：assign->指定人员、role->指定角色、dept->指定部门。
        assignee: null, // 指定单个人员
        assigneeArr: [], // 指定多个人员
        departmentArr: [], // 选中的部门
        roleCode: [] // 选中的角色
      },
      element: null,
      activeNames: ['task'], // 激活的面板
      eventTypes: [
        { label: '开始事件', value: 'bpmn:StartEvent' },
        { label: '结束事件', value: 'bpmn:EndEvent' },
        { label: '消息事件', value: 'bpmn:MessageEventDefinition' },
        { label: '时间事件', value: 'bpmn:TimerEventDefinition' },
        { label: '条件事件', value: 'bpmn:ConditionalEventDefinition' }
      ],
      eventType: '',
      taskTypes: [
        { label: 'Task', value: 'bpmn:Task' },
        { label: '服务任务', value: 'bpmn:ServiceTask' },
        { label: '发送任务', value: 'bpmn:SendTask' },
        { label: '用户任务', value: 'bpmn:UserTask' }
      ],
      taskType: '',
      gateWayTypes: [
        { label: '条件网关', value: 'bpmn:InclusiveGateway' },
        { label: 'XOR网关', value: 'bpmn:ExclusiveGateway' },
        { label: 'AND网关', value: 'bpmn:ParallelGateway' },
        { label: '事件网关', value: 'bpmn:EventBasedGateway' }
      ],
      gateWayType: '',
      personnelConfigDialog: false,
      bindFormDialog: {
        visible: false
      },
      assignTaskDialog: {
        visible: false
      },
      gatewayConfigDialog: {
        visible: false
      },
      gatewayInfo:{
        conditions: null,
        nextGroups: null
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
          elementRegistry.activatedEle = this.element
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
      // modeling.updateLabel(element, name)
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
        this.taskType = element.type

        // 任务分配人
        if (is(element, 'bpmn:UserTask') && element.businessObject && element.businessObject.$attrs) {
          this.assignInfo.assignee = element.businessObject.$attrs['activiti:assignee'] || element.businessObject.assignee
          this.assignInfo.roleCode = element.businessObject.$attrs['activiti:candidateGroups'] || element.businessObject.candidateGroups
        }
      } else if (is(element, 'bpmn:Event')) {
        this.activeNames = ['event']
        this.eventType = element.type
      } else if (isAny(element, [
        'bpmn:InclusiveGateway',
        'bpmn:ExclusiveGateway',
        'bpmn:ParallelGateway',
        'bpmn:EventBasedGateway'
      ])) {
        this.activeNames = ['gateway']
        this.gateWayType = element.type
      } else if(is(element, 'bpmn:SequenceFlow')){
        // 网关条件配置
        if (element.businessObject && element.businessObject.targetRef) {
          this.gatewayInfo.nextGroups = element.businessObject.targetRef.name || element.businessObject.targetRef.id
        }
        if (element.businessObject && element.businessObject.conditionExpression) {
          this.gatewayInfo.conditions = element.businessObject.conditionExpression.body || ''
        }
      }
    },
    /**
     * 更新元素属性
     * @param { Object } 要更新的属性, 例如 { name: '' }
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
      this.eventType = value
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: value
      })
    },
    /**
     * 改变任务类型
     * @param event
     */
    changeTaskType(event) {
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      this.taskType = value
      bpmnReplace.replaceElement(element, {
        type: value // 直接修改type就可以了
      })
    },
    changeGateWayType(event) {
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      this.gateWayType = value
      bpmnReplace.replaceElement(element, {
        type: value // 直接修改type就可以了
      })
    },
    /**
     * 为任务绑定Form
     */
    handleBindingForm(formId) {
      if (formId) {
        this.updateProperties({
          'activiti:formKey': formId
        })
        this.bindFormVisible = false
      }
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
        case 'assign':
          // activiti:assignee
          if (this.assignInfo.assignee) {
            this.updateProperties({
              'activiti:assignee': this.assignInfo.assignee
            })
          }
          break
        case 'role':
          if (this.assignInfo.roleCode) {
            this.updateProperties({
              'activiti:candidateGroups': this.assignInfo.roleCode
            })
          }
          break
        case 'dept':
          break
        default:
          return
      }
      this.assignTaskDialog.visible = false
    },
    handleGatewayConfig(){
      if(this.gatewayInfo.conditions){
        this.updateGatewayConfig();
        this.gatewayConfigDialog.visible = false
      }else{
        Message.error({
          type: 'error',
          message: '请填写配置内容'
        })
      }
    },
    updateGatewayConfig(){
      const { modeler, element } = this
      const moddle = modeler._moddle;
      var conditionExpression = moddle.create('bpmn:FormalExpression', { body: this.gatewayInfo.conditions });

      const modeling = modeler.get('modeling')
      modeling.updateProperties(element, { conditionExpression: conditionExpression });
    }
  }
}

/**
 * Palette配置
 */
export default {
  /**
   * 公共工具配置
   *  group: tools-> 工具租，event->事件组，activity->任务组，gateway->网关组
   *  title: 工具的提示文本(如有有type属性,title可以为空)
   *  type: 工具对应的bpmn类型
   *  className: 工具样式
   */
  commonPalettes: [
    { group: 'tools', title: 'Activate the hand tool', className: 'bpmn-icon-hand-tool' },
    { group: 'tools', title: 'Activate the lasso tool', className: 'bpmn-icon-lasso-tool' },
    { group: 'event', type: 'bpmn:StartEvent', className: 'entry bpmn-icon-start-event-none' },
    { group: 'event', type: 'bpmn:EndEvent', className: 'entry bpmn-icon-end-event-none' },
    { group: 'activity', type: 'bpmn:Task', className: 'entry bpmn-icon-task' },
    { group: 'activity', type: 'bpmn:Expanded SubProcess', className: 'bpmn-icon-subprocess-expanded' },
    { group: 'gateway', type: 'bpmn:ExclusiveGateway', className: 'entry bpmn-icon-gateway-none' }
  ],
  /**
   * 预设的工具(所述的group为common-palette)
   */
  customPalettes: []
}

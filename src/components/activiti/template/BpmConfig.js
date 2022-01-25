/**
 * 存储流程设计相关参数
 * @author sunshengteng
 */
export default class BpmConfig {
  static WIDTH_INTERVAL = 250; // 元素的宽度间隔
  static HEIGHT_INTERVAL = 200; // 元素的高度间隔
  /**
   * 支持自定义渲染的元素类型
   * @type {string[]}
   */
  static customElements = [
    'bpmn:Task',
    'bpmn:UserTask',
    'bpmn:ServiceTask',
    'bpmn:SendTask'
  ]
  /**
   * 自定义元素的渲染配置
   * url暂不支持
   * @type {{"bpmn:StartEvent": {attr: {x: number, width: number, y: number, height: number}, url: string}}}
   */
  static customConfig = {
    'bpmn:Task': {
      'attr': { x: 0, y: 0, width: 130, height: 60 }
    },
    'bpmn:UserTask': {
      'attr': { x: 0, y: 0, width: 130, height: 60 }
    },
    'bpmn:ServiceTask': {
      'attr': { x: 0, y: 0, width: 130, height: 60 }
    },
    'bpmn:SendTask': {
      'attr': { x: 0, y: 0, width: 130, height: 60 }
    }
  }
  /**
   * 一开始就有label标签的元素类型
   * @type {string[]}
   */
  static hasLabelElements = ['bpmn:StartEvent', 'bpmn:EndEvent']
  /**
   * 流程初始化
   * @constructor
   * @param processId 流程ID等同于流程Key
   * @param processName   流程名称
   * @param processDescription   流程描述
   */
  constructor(processId, processName, processDescription) {
    // 流程源模板
    this.sourceUrlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
                            <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                                               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                               xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                                               xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                                               xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                                               xmlns:activiti="http://activiti.org/bpmn"
                                               id="jbinfo-diagram"
                                               targetNamespace="http://www.jbinfo.cn/schema/bpmn"
                                               xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
                              <bpmn2:process id="` + processId + '" name="' + processName + `">
                                <bpmn2:documentation>` + (processDescription || '') + `</bpmn2:documentation>
                              </bpmn2:process>
                              <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                                <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="` + processId + `">
                                </bpmndi:BPMNPlane>
                              </bpmndi:BPMNDiagram>
                            </bpmn2:definitions>`
  }
}

import { assign, isArray, forEach } from 'min-dash'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isExpanded, isEventSubProcess } from 'bpmn-js/lib/util/DiUtil'
import { Shape, Connection } from 'diagram-js/lib/model/index.js'
export default function ContextPadProvider(config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate, elementRegistry,
  moddle) {
  config = config || {}

  contextPad.registerProvider(this)

  this.contextPad = contextPad

  this.modeling = modeling

  this.elementFactory = elementFactory
  this.connect = connect
  this.create = create
  this.popupMenu = popupMenu
  this.canvas = canvas
  this.rules = rules
  this.translate = translate
  this.elementRegistry = elementRegistry
  this.moddle = moddle
  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false)
  }

  // 绑定创建完成
  eventBus.on('create.end', function(event) {
    const context = event.context
    const connectionStart = {
      x: context.x + context.width / 2,
      y: context.y + context.height / 2
    }
    const connectionEnd = {
      x: event.x,
      y: event.y
    }

    const source = elementRegistry.activatedEle
    const target = context.elements[0]

    if (!source || target.type !== 'bpmn:SubProcess') { return }
    const attrs = {
      type: 'bpmn:SequenceFlow'
    }
    const hints = {
      connectionStart: connectionStart,
      connectionEnd: isReverse(context) ? connectionStart : connectionEnd
    }

    const sequenceFlow = modeling.connect(source, target, attrs, hints)

    // 为指向InternalProcess的SequenceFlow添加说明信息
    const extensions = moddle.create('bpmn:ExtensionElements', { values: [] })
    const InternalProcess = moddle.create('activiti:Field', { name: 'InternalProcess' })
    extensions.values.push(InternalProcess)
    modeling.updateProperties(sequenceFlow, {
      extensionElements: extensions
    })
  })
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
  'elementRegistry',
  'moddle'
]
/**
 * 获取元素的ContextPad
 * @param currentEle: 当前点选的元素
 * @returns {{}}
 */
ContextPadProvider.prototype.getContextPadEntries = function(currentEle) {
  const {
    autoPlace,
    create,
    elementFactory,
    translate,
    modeling,
    rules, // 动态角色权限
    connect,
    elementRegistry,
    canvas,
    contextPad,
    popupMenu
  } = this

  const businessObject = currentEle.businessObject
  const actions = {}

  // 删除功能
  function removeElement() {
    modeling.removeElements([currentEle])
  }
  function getReplaceMenuPosition(element) {
    const Y_OFFSET = 5

    const diagramContainer = canvas.getContainer()
    const pad = contextPad.getPad(element).html

    const diagramRect = diagramContainer.getBoundingClientRect()
    const padRect = pad.getBoundingClientRect()

    const top = padRect.top - diagramRect.top
    const left = padRect.left - diagramRect.left

    return {
      x: left,
      y: top + padRect.height + Y_OFFSET
    }
  }
  /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    if (typeof title !== 'string') {
      options = title
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
    }

    function appendStart(event, element) {
      const shape = elementFactory.createShape(assign({ type: type }, options))
      create.start(event, shape, {
        source: element
      })
    }

    const append = autoPlace ? function(event, element) {
      const shape = elementFactory.createShape(assign({ type: type }, options))

      autoPlace.append(element, shape)
    } : appendStart

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    }
  }
  // bpmn:Lane
  if (isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) && isExpanded(businessObject)) {
    console.log('bpmn:Lane')
  }

  function expandOrCollapse() {
    const currentElement = elementRegistry.activatedEle
    if (currentElement.outgoing.length === 0) return
    const status = currentElement.outgoing[0].hidden

    const color = status ? '#000000' : '#ff0000'
    modeling.setColor(currentEle, {
      fill: null,
      stroke: color
    })
    expandOrCollapseChild(elementRegistry.activatedEle, status)
  }

  /**
   * 追加内部流程
   * @param event: 事件
   * @param ele：当前选中的元素
   */
  function appendInternalProcess(event, ele) {
    const shape = elementFactory.createShape({ type: 'bpmn:SubProcess' })
    modeling.updateProperties(shape, { 'triggeredByEvent': true })
    create.start(event, shape, ele)
  }

  /**
   * 展开OR折叠流程
   * @param parentElement: 当前选择的元素
   * @param status: hidden值
   */
  function expandOrCollapseChild(parentElement, status) {
    const childrenArr = []
    if (parentElement instanceof Shape) {
      assign(childrenArr, parentElement.outgoing)
    } else if (parentElement instanceof Connection) {
      childrenArr.push(parentElement.target)
    }
    forEach(childrenArr, ele => {
      updateHiddenForElement(ele, !status)

      if (Array.isArray(ele.children) && ele.children.length > 0) {
        forEach(ele.children, childrenEle => {
          updateHiddenForElement(childrenEle, !status)
        })
      }

      expandOrCollapseChild(ele, status)
    })
  }

  /**
   * 更新元素hidden,并且如果是展开则更新所有的孩子颜色为"黑色"
   * @param childrenEle: 孩子元素
   * @param status: hidden的值
   */
  function updateHiddenForElement(childrenEle, status) {
    childrenEle.hidden = status
    modeling.updateProperties(childrenEle, { 'activiti:hidden': status })

    if (status) {
      modeling.setColor(childrenEle, {
        fill: null,
        stroke: '#000000'
      })
    }
  }
  // bpmn:FlowNode
  if (is(businessObject, 'bpmn:FlowNode')) {
    if (is(businessObject, 'bpmn:EventBasedGateway')) {
      console.log('bpmn:EventBasedGateway')
    } else if (isEventType(businessObject, 'bpmn:BoundaryEvent', 'bpmn:CompensateEventDefinition')) {
      console.log('bpmn:BoundaryEvent,bpmn:CompensateEventDefinition')
    } else if (!is(businessObject, 'bpmn:EndEvent') &&
      !businessObject.isForCompensation &&
      !isEventType(businessObject, 'bpmn:IntermediateThrowEvent', 'bpmn:LinkEventDefinition') &&
      !isEventSubProcess(businessObject)) {
      assign(actions, {
        'append.end-event': appendAction(
          'bpmn:EndEvent',
          'bpmn-icon-end-event-none',
          translate('Append EndEvent')
        ),
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'bpmn-icon-gateway-none',
          translate('Append Gateway')
        ),
        'append.append-task': appendAction(
          'bpmn:Task',
          'bpmn-icon-task',
          translate('Append Task')
        ),
        'append.intermediate-event': {
          group: 'model',
          className: 'bpmn-icon-subprocess-expanded',
          title: translate('Expand Or Collapse'),
          action: {
            click: expandOrCollapse
          }
        },
        /**
         * 添加内部流程(InternalProcess)
         */
        'append.internal-process': {
          group: 'model',
          className: 'bpmn-icon-event-subprocess-expanded',
          title: translate('Create Internal Process'),
          action: {
            click: appendInternalProcess
          }
        }
      })
    }
  }

  if (!popupMenu.isEmpty(currentEle, 'bpmn-replace')) {
    // Replace menu entry
    assign(actions, {
      'replace': {
        group: 'edit',
        className: 'bpmn-icon-screw-wrench',
        title: translate('Change type'),
        action: {
          click: function(event, element) {
            const position = assign(getReplaceMenuPosition(element), {
              cursor: { x: event.x, y: event.y }
            })

            popupMenu.open(element, 'bpmn-replace', position)
          }
        }
      }
    })
  }

  /** 注释 start **/
  if (
    isAny(businessObject, [
      'bpmn:FlowNode',
      'bpmn:InteractionNode',
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference'
    ])
  ) {
    assign(actions, {
      'append.text-annotation': appendAction(
        'bpmn:TextAnnotation',
        'bpmn-icon-text-annotation',
        translate('add Annotation')
      ),
      // 连线
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate(
          'Connect using ' +
          (businessObject.isForCompensation
            ? ''
            : 'Sequence/MessageFlow or ') +
          'Association'
        ),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    })
  }
  /** 注释 end ***/

  /** 连线 start ***/
  function startConnect(event, element) {
    connect.start(event, element)
  }
  if (isAny(businessObject, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) {
    assign(actions, {
      'connect': {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using DataInputAssociation'),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    })
  }
  /** 连线 end ***/

  /** 删除 start ***/
  // delete element entry, only show if allowed by rules TODO 操作按钮授权
  let deleteAllowed = !rules || !rules.allowed ? true : rules.allowed('elements.delete', { elements: [currentEle] })

  if (isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === currentEle
  }

  if (deleteAllowed) {
    assign(actions, {
      'delete': {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    })
  }
  /** 删除 end ***/
  return actions
}
function isEventType(eventBo, type, definition) {
  const isType = eventBo.$instanceOf(type)
  let isDefinition = false

  const definitions = eventBo.eventDefinitions || []
  forEach(definitions, function(def) {
    if (def.$type === definition) {
      isDefinition = true
    }
  })

  return isType && isDefinition
}

// helpers //////////

export function isReverse(context) {
  const hover = context.hover
  const source = context.source
  const target = context.target

  return hover && source && hover === source && source !== target
}

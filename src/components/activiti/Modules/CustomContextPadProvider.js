import { assign, isArray, forEach } from 'min-dash'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isEventSubProcess } from 'bpmn-js/lib/util/DiUtil'
import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse'
export default function ContextPadProvider(config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate,
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
  this.moddle = moddle
  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false)
  }

  eventBus.on('create.end', 250, function(event) {
    const context = event.context
    const shape = context.shape

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return
    }

    const entries = contextPad.getEntries(shape)

    if (entries.replace) {
      entries.replace.action.click(event, shape)
    }
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
        )
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

export function isReverse(context) {
  const hover = context.hover
  const source = context.source
  const target = context.target

  return hover && source && hover === source && source !== target
}

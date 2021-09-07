/**
 * 工具栏按钮Provider
 * @author sunshengteng
 */
import {
  assign,
  forEach
} from 'min-dash'
import BpmConfig from '@/components/activiti/template/BpmConfig'
/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
  paletteEntries,
  customPalette,
  create, elementFactory,
  spaceTool, lassoTool, handTool,
  globalConnect, translate,
  elementRegistry, modeling
) {
  this._entries = paletteEntries
  this._customPalette = customPalette
  this._create = create
  this._elementFactory = elementFactory
  this._spaceTool = spaceTool
  this._lassoTool = lassoTool
  this._handTool = handTool
  this._globalConnect = globalConnect
  this._translate = translate
  this._elementRegistry = elementRegistry
  this._modeling = modeling

  this._customPalette.registerProvider(this)
}

PaletteProvider.prototype.getPaletteEntries = function(element) {
  const actions = {}
  const create = this._create
  const elementFactory = this._elementFactory
  const lassoTool = this._lassoTool
  const handTool = this._handTool
  const translate = this._translate
  const elementRegistry = this._elementRegistry
  const modeling = this._modeling

  forEach(this._entries.commonPalette, (palette) => {
    const paletteKey = 'create.' + palette.title
    const action = {}
    action[paletteKey] = createAction(palette.type, palette.group, palette.className, palette.title)
    assign(actions, action)
  })

  /**
   * 当前选中的Element之后追加任务
   * @param event
   */
  function appendTaskLater(event) {
    if (!elementRegistry.activatedEle) return
    const currentEle = elementRegistry.activatedEle
    let parentEle = currentEle.parent
    if (!currentEle.parent) {
      parentEle = elementRegistry.get('bpmn:Process')
    }
    const newTask = elementFactory.createShape({ type: event.target.title })
    modeling.updateProperties(newTask, { name: event.target.innerHTML })

    if (modeling._direction === 'horizontal') {
      modeling.createShape(newTask, {
        x: currentEle.x + BpmConfig.WIDTH_INTERVAL,
        y: currentEle.y + currentEle.height / 2
      }, parentEle)
    } else {
      modeling.createShape(newTask, {
        x: currentEle.x + currentEle.width / 2,
        y: currentEle.y + BpmConfig.HEIGHT_INTERVAL
      }, parentEle)
    }
    elementRegistry.activatedEle = newTask
    modeling.connect(currentEle, newTask)

    modeling._eventBus.fire('element.click', { element: newTask })
  }

  function createAction(type, group, className, title, image, options) {
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type: type }, options))

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }

      create.start(event, shape)
    }

    const shortType = type.replace(/^bpmn:/, '')

    return {
      type: type,
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: group === 'common-palette' ? appendTaskLater : createListener
      },
      imageUrl: image
    }
  }

  function createSubprocess(event) {
    const subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    })

    const startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    })

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [startEvent]
      }
    })
  }

  assign(actions, {
    // 工具租
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event)
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event)
        }
      }
    },
    /* 'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event)
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function(event) {
          globalConnect.toggle(event)
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },*/
    /* 'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
      translate('Create Intermediate/Boundary Event')
    ),*/
    /* 'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
      translate('Create DataObjectReference')
    ),
    'create.data-store': createAction(
      'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
      translate('Create DataStoreReference')
    ),*/
    // 任务租
    'create.task': createAction(
      'bpmn:Task',
      'activity',
      'inShape custom-icon-task',
      translate('Create Task')
    ),
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'bpmn-icon-subprocess-expanded',
      title: translate('Create expanded SubProcess'),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess
      }
    },
    /* 'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate('Create Pool/Participant'),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    },*/
    /* 'create.group': createAction(
      'bpmn:Group', 'artifact', 'bpmn-icon-group',
      translate('Create Group')
    ),*/
    // 事件租
    'create.start-StartEvent': createAction(
      'bpmn:StartEvent',
      'event',
      'custom-icon-start-event-none',
      translate('Create StartEvent'),
      'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/start.png'
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent',
      'event',
      'custom-icon-end-event-none',
      translate('Create EndEvent'),
      'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/end.png'
    ),
    // 网关租
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway',
      'gateway',
      'inShape custom-icon-gateway-none',
      translate('Create Gateway'),
      require('../../../assets/images/activiti/gateway.jpeg')
    )
  })
  return actions
}
PaletteProvider.$inject = [
  'config.paletteEntries',
  'customPalette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate',
  'elementRegistry',
  'modeling'
]

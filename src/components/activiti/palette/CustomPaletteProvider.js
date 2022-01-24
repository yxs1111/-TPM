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

PaletteProvider.prototype.getPaletteEntries = function() {
  const entities = {}
  const create = this._create
  const elementFactory = this._elementFactory
  const lassoTool = this._lassoTool
  const handTool = this._handTool
  const translate = this._translate
  const elementRegistry = this._elementRegistry
  const modeling = this._modeling

  forEach(this._entries.commonPalettes, (palette) => {
    assign(entities, createEntity(palette))
  })

  forEach(this._entries.customPalettes, (palette) => {
    assign(entities, createEntity(palette))
  })

  function createEntity(palette) {
    const paletteKey = 'create.' + (palette.title || palette.type.replace(/^bpmn:/, ''))
    const entity = {}
    entity[paletteKey] = {
      type: palette.type,
      group: palette.group,
      className: palette.className,
      title: palette.title || translate('{type}', { type: palette.type.replace(/^bpmn:/, '') }),
      action: createAction(palette.type, palette.group, palette.title, palette.options),
      imageUrl: palette.image
    }
    return entity
  }
  function createAction(type, group, title, options) {
    if (!group) {
      throw new Error('title = ' + title + '的Palette未配置group')
    }
    const action = {}
    // toolPaletteAction
    if (group === 'tools') {
      if (title && title === 'Activate the hand tool') {
        assign(action, { click: function(event) {
          handTool.activateHand(event)
        } })
        return action
      } else if (title && title === 'Activate the lasso tool') {
        assign(action, { click: function(event) {
          lassoTool.activateSelection(event)
        } })
        return action
      } else {
        throw new Error('不支持的工具' + title)
      }
    }
    // customPaletteAction
    if (group === 'common-palette') {
      assign(action, {
        click: appendTaskListener,
        dragstart: createListener
      })
      return action
    }
    // commonPaletteAction
    if ((type || title).indexOf('SubProcess') !== -1) {
      assign(action, {
        click: createSubprocessListener,
        dragstart: createSubprocessListener
      })
      return action
    } else {
      assign(action, {
        click: createListener,
        dragstart: createListener
      })
      return action
    }
    /**
     * 创建Activity监听
     * @param event
     */
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type: type }, options))
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }
      create.start(event, shape)
    }

    /**
     * 追加Activity监听(当前选中的Element之后追加任务)
     * @param event
     */
    function appendTaskListener(event) {
      if (!elementRegistry.activatedEle) return
      const currentEle = elementRegistry.activatedEle
      let parentEle = currentEle.parent
      if (!parentEle) {
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

    /**
     * 创建子流程监听
     * @param event
     */
    function createSubprocessListener(event) {
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
  }
  return entities
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

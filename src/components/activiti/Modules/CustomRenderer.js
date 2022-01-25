import inherits from 'inherits'

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer'
import { some } from 'min-dash'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

import BpmConfig from '@/components/activiti/template/BpmConfig'
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 20

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(
  config, eventBus, styles, pathMap,
  canvas, textRenderer, paletteEntries) {
  BpmnRenderer.call(this, config, eventBus, styles, pathMap,
    canvas, textRenderer, HIGH_PRIORITY)

  this._paletteEntries = paletteEntries
  this._textRenderer = textRenderer

  const computeStyle = styles.computeStyle
  const defaultFillColor = config && config.defaultFillColor
  const defaultStrokeColor = config && config.defaultStrokeColor

  const customDrawHandle = this.customDrawHandle = {
    'bpmn:Task': function(parentNode, element) {
      const { url, attr } = BpmConfig.customConfig[element.type]
      // 绘制图形
      const shape = url ? drawImage(parentNode, attr, url) : drawRect(parentNode, element, attr.width, attr.height, TASK_BORDER_RADIUS)
      // 绘制名称
      const text = textRenderer.createText(element.businessObject.name || '', {
        box: element,
        align: 'center-middle',
        padding: 5,
        size: {
          width: 100
        }
      })
      svgAppend(parentNode, text)

      return shape
    },
    'bpmn:UserTask': function(parentNode, element) {
      const taskShape = renderer('bpmn:Task')(parentNode, element)

      const x = 20
      const y = 15

      const pathData = pathMap.getScaledPath('TASK_TYPE_USER_1', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* user path */ drawPath(parentNode, pathData, {
        strokeWidth: 0.5,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      })

      const pathData2 = pathMap.getScaledPath('TASK_TYPE_USER_2', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* user2 path */ drawPath(parentNode, pathData2, {
        strokeWidth: 0.5,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      })

      const pathData3 = pathMap.getScaledPath('TASK_TYPE_USER_3', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* user3 path */ drawPath(parentNode, pathData3, {
        strokeWidth: 0.5,
        fill: getStrokeColor(element, defaultStrokeColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      })
      return taskShape
    },
    'bpmn:ServiceTask': function(parentGfx, element) {
      const task = renderer('bpmn:Task')(parentGfx, element)
      const x = 20
      const y = 23
      const pathDataBG = pathMap.getScaledPath('TASK_TYPE_SERVICE', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* service bg */ drawPath(parentGfx, pathDataBG, {
        strokeWidth: 1,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      })

      const fillPathData = pathMap.getScaledPath('TASK_TYPE_SERVICE_FILL', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* service fill */ drawPath(parentGfx, fillPathData, {
        strokeWidth: 0,
        fill: getFillColor(element, defaultFillColor)
      })

      const pathData = pathMap.getScaledPath('TASK_TYPE_SERVICE', {
        abspos: {
          x: x,
          y: y
        }
      })

      /* service */ drawPath(parentGfx, pathData, {
        strokeWidth: 1,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor)
      })

      return task
    },
    'bpmn:SendTask': function(parentGfx, element) {
      const task = renderer('bpmn:Task')(parentGfx, element)

      const pathData = pathMap.getScaledPath('TASK_TYPE_SEND', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: 21,
        containerHeight: 14,
        position: {
          mx: 0.531,
          my: 0.524
        }
      })

      /* send path */ drawPath(parentGfx, pathData, {
        strokeWidth: 1,
        fill: getStrokeColor(element, defaultStrokeColor),
        stroke: getFillColor(element, defaultFillColor)
      })

      return task
    }

  }

  function drawPath(parentGfx, d, attrs) {
    attrs = computeStyle(attrs, ['no-fill'], {
      strokeWidth: 2,
      stroke: 'black'
    })

    const path = svgCreate('path')
    svgAttr(path, { d: d })
    svgAttr(path, attrs)

    svgAppend(parentGfx, path)

    return path
  }
  function drawImage(parentNode, attr, url) {
    const imageShape = svgCreate('image', {
      ...attr,
      href: url
    })
    svgAppend(parentNode, imageShape)
    return imageShape
  }
  // copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
  function drawRect(parentNode, element, width, height, borderRadius, strokeColor, fillColor) {
    element.width = width
    element.height = height

    const rect = svgCreate('rect')

    svgAttr(rect, {
      width: width,
      height: height,
      rx: borderRadius,
      ry: borderRadius,
      stroke: strokeColor || '#000000',
      strokeWidth: 2,
      fill: fillColor || '#ffffff'
    })

    svgAppend(parentNode, rect)

    return rect
  }
  function renderer(type) {
    return customDrawHandle[type]
  }
}

inherits(CustomRenderer, BpmnRenderer)

CustomRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer',
  'config.paletteEntries'
]

CustomRenderer.prototype.canRender = function(element) {
  const paletteEntries = this._paletteEntries

  // only render tasks and events (ignore labels)
  return (some(paletteEntries.commonPalettes, (entry) => {
    return is(element, entry.type)
  }) || some(paletteEntries.customPalettes, (entry) => {
    return is(element, entry.type)
  })) && !element.labelTarget
}

CustomRenderer.prototype.drawShape = function(parentNode, element) {
  const hiddenStr = element.businessObject.$attrs['activiti:hidden']
  if (hiddenStr && JSON.parse(hiddenStr)) {
    element.hidden = true
  }
  if (BpmConfig.customElements.includes(element.type)) {
    const drawFunc = this.customDrawHandle[element.type]
    if (drawFunc && drawFunc instanceof Function) {
      return drawFunc(parentNode, element)
    }
  }
  return BpmnRenderer.prototype.drawShape.call(this, parentNode, element)
}
CustomRenderer.prototype.drawConnection = function(p, connect) {
  const hiddenStr = connect.businessObject.$attrs['activiti:hidden']
  if (hiddenStr && JSON.parse(hiddenStr)) {
    connect.hidden = true
  }
}

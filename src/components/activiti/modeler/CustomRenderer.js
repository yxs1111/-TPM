/* eslint-disable no-unused-vars */
import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import {
  assign
} from 'min-dash'
import {
  append as svgAppend,
  create as svgCreate,
  classes as svgClasses
} from 'tiny-svg'

import BpmConfig from '@/components/activiti/template/BpmConfig'
/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles, textRenderer) {
  BaseRenderer.call(this, eventBus, 1001)

  function renderLabel(parentGfx, label, options) {
    options = assign({
      size: {
        width: 100
      }
    }, options)

    const text = textRenderer.createText(label || '', options)

    svgClasses(text).add('djs-label')

    svgAppend(parentGfx, text)

    return text
  }

  this.drawCustomElements = function(parentNode, element) {
    // 获取到类型
    const type = element.type
    // 排除Label
    if (type === 'label') {
      return element
    }
    const { url, attr } = BpmConfig.customConfig[type]
    const customIcon = svgCreate('image', {
      ...attr,
      href: url
    })

    svgAppend(parentNode, customIcon)

    return customIcon
  }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles', 'textRenderer']

CustomRenderer.prototype.canRender = function(element) {
  // ignore labels
  return true
}

CustomRenderer.prototype.drawShape = function(p, element) {
  const hiddenStr = element.businessObject.$attrs['activiti:hidden']
  if (hiddenStr && JSON.parse(hiddenStr)) {
    element.hidden = true
  }
  if (BpmConfig.customElements.includes(element.type)) {
    return this.drawCustomElements(p, element)
  }
}

CustomRenderer.prototype.getShapePath = function(shape) {
  console.log(shape)
}
BaseRenderer.prototype.drawConnection = function(p, connect) {
  const hiddenStr = connect.businessObject.$attrs['activiti:hidden']
  if (hiddenStr && JSON.parse(hiddenStr)) {
    connect.hidden = true
  }
}

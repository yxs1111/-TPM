/**
 * 工具栏面板
 * @author sunshengteng
 */
import {
  isArray,
  isFunction,
  forEach
} from 'min-dash'

import {
  domify,
  query as domQuery,
  attr as domAttr,
  clear as domClear,
  classes as domClasses,
  matches as domMatches,
  delegate as domDelegate,
  event as domEvent
} from 'min-dom'

const TOGGLE_SELECTOR = '.custom-palette-toggle'
const ENTRY_SELECTOR = '.entry'
const ELEMENT_SELECTOR = TOGGLE_SELECTOR + ', ' + ENTRY_SELECTOR

const PALETTE_OPEN_CLS = 'open'
const PALETTE_TWO_COLUMN_CLS = 'two-column'

const DEFAULT_PRIORITY = 1000

/**
 * A palette containing modeling elements.
 */
function Palette(eventBus, canvas,
  elementFactory,
  create,
  paletteContainer,
  paletteEntries, translate) {
  this._eventBus = eventBus
  this._canvas = canvas
  this._entries = paletteEntries
  this._paletteContainer = paletteContainer
  this._elementFactory = elementFactory
  this._create = create
  this._translate = translate

  const self = this

  eventBus.on('tool-manager.update', function(event) {
    const tool = event.tool

    self.updateToolHighlight(tool)
  })

  eventBus.on('i18n.changed', function() {
    self._update()
  })

  eventBus.on('diagram.init', function() {
    self._diagramInitialized = true

    self._rebuild()
  })
}

Palette.$inject = ['eventBus', 'canvas',
  'elementFactory',
  'create',
  'config.paletteContainer',
  'config.paletteEntries', 'translate']

/**
 * Register a provider with the palette
 *
 * @param  {number} [priority=1000]
 * @param  {PaletteProvider} provider
 *
 * @example
 * const paletteProvider = {
 *   getPaletteEntries: function() {
 *     return function(entries) {
 *       return {
 *         ...entries,
 *         'entry-1': {
 *           label: 'My Entry',
 *           action: function() { alert("I have been clicked!"); }
 *         }
 *       };
 *     }
 *   }
 * };
 *
 * palette.registerProvider(800, paletteProvider);
 */
Palette.prototype.registerProvider = function(priority, provider) {
  if (!provider) {
    provider = priority
    priority = DEFAULT_PRIORITY
  }

  this._eventBus.on('palette.getProviders', priority, function(event) {
    event.providers.push(provider)
  })

  this._rebuild()
}

/**
 * Returns the palette entries
 *
 * @return {Object<string, PaletteEntryDescriptor>} map of entries
 */
Palette.prototype.getEntries = function() {
  const providers = this._getProviders()

  return providers.reduce(addPaletteEntries, {})
}

Palette.prototype._rebuild = function() {
  if (!this._diagramInitialized) {
    return
  }

  var providers = this._getProviders()

  if (!providers.length) {
    return
  }

  if (!this._container) {
    this._init()
  }

  this._update()
}

/**
 * Initialize
 */
Palette.prototype._init = function() {
  const self = this

  const eventBus = this._eventBus

  // 获取传入的工具栏容器
  let container = this._container = this._paletteContainer
  // 未找到 使用默认
  if (!container) {
    container = this._container = domify(Palette.HTML_MARKUP)
  } else {
    // 为 传入的工具栏容器 创建子元素
    addClasses(container, 'custom-palette')
    const entries = domQuery('.custom-palette-entries', container)
    const toggle = domQuery('.custom-palette-toggle', container)

    if (!entries) {
      container.appendChild(domify('<div class="custom-palette-entries"></div>'))
    }
    if (!toggle) {
      container.appendChild(domify('<div class="custom-palette-toggle"></div>'))
    }
  }
  // parentContainer.appendChild(container)

  // 下面是绑定 click 、 dragstart

  domDelegate.bind(container, ELEMENT_SELECTOR, 'click', function(event) {
    const target = event.delegateTarget

    if (domMatches(target, TOGGLE_SELECTOR)) {
      return self.toggle()
    }

    self.trigger('click', event)
  })

  // prevent drag propagation
  domEvent.bind(container, 'mousedown', function(event) {
    event.stopPropagation()
  })

  // prevent drag propagation
  domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', function(event) {
    self.trigger('dragstart', event)
  })

  eventBus.on('canvas.resized', this._layoutChanged, this)

  eventBus.fire('palette.create', {
    container: container
  })
}

Palette.prototype._getProviders = function(id) {
  const event = this._eventBus.createEvent({
    type: 'palette.getProviders',
    providers: []
  })

  this._eventBus.fire(event)

  return event.providers
}

/**
 * Update palette state.
 *
 * @param  {Object} [state] { open, twoColumn }
 */
Palette.prototype._toggleState = function(state) {
  state = state || {}

  const parent = this._getParentContainer()
  const container = this._container

  const eventBus = this._eventBus

  let twoColumn

  const cls = domClasses(container)

  if ('twoColumn' in state) {
    twoColumn = state.twoColumn
  } else {
    twoColumn = this._needsCollapse(parent.clientHeight, this._entries || {})
  }

  // always update two column
  cls.toggle(PALETTE_TWO_COLUMN_CLS, twoColumn)

  if ('open' in state) {
    cls.toggle(PALETTE_OPEN_CLS, state.open)
  }

  eventBus.fire('palette.changed', {
    twoColumn: twoColumn,
    open: this.isOpen()
  })
}

Palette.prototype._update = function() {
  const entriesContainer = domQuery('.custom-palette-entries', this._container)
  const entries = this._entries = this.getEntries()
  const translate = this._translate
  domClear(entriesContainer)

  // 遍历工具栏元素
  forEach(entries, function(entry, id) {
    const grouping = entry.group || 'default'
    // eslint-disable-next-line no-unused-vars
    const groupName = translate(grouping)
    // 设置分组
    let container = domQuery('[data-group=' + grouping + ']', entriesContainer)
    if (!container) {
      container = domify(
        '<div class="group" data-group="' + grouping + '"></div>'
      )
      const arrowDown = 'el-icon-arrow-down'
      const groupLabel = domify(
        `<div class="groupLabel"><span title="${grouping}">${groupName}</span></i></i><i id="custom-palette-group-arrow" class="${arrowDown}"></i></div></div>`
      )

      groupLabel.addEventListener('click', function() {
        const iconArrowDown = this.querySelector('.el-icon-arrow-down')
        const iconArrowLeft = this.querySelector('.el-icon-arrow-left')
        if (iconArrowDown) {
          iconArrowDown.classList = ['el-icon-arrow-left']
          const groupEntry = this.parentNode.querySelectorAll('.entry')
          forEach(groupEntry, function(it) {
            it.style.display = 'none'
          })
        }
        if (iconArrowLeft) {
          iconArrowLeft.classList = ['el-icon-arrow-down']
          const groupEntry = this.parentNode.querySelectorAll('.entry')
          forEach(groupEntry, function(it) {
            it.style.display = 'block'
          })
        }
      })

      container.appendChild(groupLabel)
      entriesContainer.appendChild(container)
    }
    const html = entry.html || (
      entry.separator
        ? '<hr class="separator" />'
        : '<div class="entry" draggable="true"></div>')

    const control = domify(html)
    container.appendChild(control)

    if (!entry.separator) {
      domAttr(control, 'data-action', id)

      if (entry.type) {
        domAttr(control, 'title', entry.type)
      }
      if (entry.className) {
        addClasses(control, entry.className)
      }

      if (entry.imageUrl) {
        control.appendChild(domify('<img src="' + entry.imageUrl + '" style="vertical-align: middle;width: 30px;">'))
      }
    }
    control.appendChild(domify('<span style="vertical-align: middle;">' + entry.title ? translate(entry.title) : '' + '</span>'))
  })

  // open after update
  this.open()
}

/**
 * Trigger an action available on the palette
 *
 * @param  {string} action
 * @param  {Event} event
 */
Palette.prototype.trigger = function(action, event, autoActivate) {
  const entries = this._entries
  const elementFactory = this._elementFactory
  const create = this._create
  const button = event.delegateTarget || event.target

  if (!button) {
    return event.preventDefault()
  }

  const entry = entries[domAttr(button, 'data-action')]

  // when user clicks on the palette and not on an action
  if (!entry) {
    return
  }

  const handler = entry.action

  const originalEvent = event.originalEvent || event

  // simple action (via callback function)
  //  传入 action 的 dragstart方法 click 方法
  if (isFunction(handler)) {
    if (action === 'click') {
      handler(originalEvent, autoActivate, elementFactory, create)
    }
  } else {
    if (handler[action]) {
      handler[action](originalEvent, autoActivate, elementFactory, create)
    }
  }

  // silence other actions
  event.preventDefault()
}

Palette.prototype._layoutChanged = function() {
  this._toggleState({})
}

/**
   * Do we need to collapse to two columns?
   *
   * @param {number} availableHeight
   * @param {Object} entries
   *
   * @return {boolean}
   */
Palette.prototype._needsCollapse = function(availableHeight, entries) {
  // top margin + bottom toggle + bottom margin
  // implementors must override this method if they
  // change the palette styles
  const margin = 20 + 10 + 20

  const entriesHeight = Object.keys(entries).length * 46

  return availableHeight < entriesHeight + margin
}

/**
   * Close the palette
   */
Palette.prototype.close = function() {
  this._toggleState({
    open: false,
    twoColumn: false
  })
}

/**
   * Open the palette
   */
Palette.prototype.open = function() {
  this._toggleState({ open: true })
}

Palette.prototype.toggle = function(open) {
  if (this.isOpen()) {
    this.close()
  } else {
    this.open()
  }
}

Palette.prototype.isActiveTool = function(tool) {
  return tool && this._activeTool === tool
}

Palette.prototype.updateToolHighlight = function(name) {
  let entriesContainer,
    toolsContainer

  if (!this._toolsContainer) {
    entriesContainer = domQuery('.custom-palette-entries', this._container)

    this._toolsContainer = domQuery('[data-group=tools]', entriesContainer)
  }

  // eslint-disable-next-line prefer-const
  toolsContainer = this._toolsContainer

  forEach(toolsContainer.children, function(tool) {
    let actionName = tool.getAttribute('data-action')

    if (!actionName) {
      return
    }

    const toolClasses = domClasses(tool)

    actionName = actionName.replace('-tool', '')

    if (toolClasses.contains('entry') && actionName === name) {
      toolClasses.add('highlighted-entry')
    } else {
      toolClasses.remove('highlighted-entry')
    }
  })
}

/**
   * Return true if the palette is opened.
   *
   * @example
   *
   * palette.open();
   *
   * if (palette.isOpen()) {
   *   // yes, we are open
   * }
   *
   * @return {boolean} true if palette is opened
   */
Palette.prototype.isOpen = function() {
  return domClasses(this._container).has(PALETTE_OPEN_CLS)
}

/**
   * Get container the palette lives in.
   *
   * @return {Element}
   */
Palette.prototype._getParentContainer = function() {
  return this._canvas.getContainer()
}

/* markup definition */

Palette.HTML_MARKUP =
  '<div class="custom-palette">' +
  '<div class="custom-palette-entries"></div>' +
  '<div class="custom-palette-toggle"></div>' +
  '</div>'

// helpers //////////////////////

function addClasses(element, classNames) {
  var classes = domClasses(element)

  var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g)
  actualClassNames.forEach(function(cls) {
    classes.add(cls)
  })
}

function addPaletteEntries(entries, provider) {
  const entriesOrUpdater = provider.getPaletteEntries()

  if (isFunction(entriesOrUpdater)) {
    return entriesOrUpdater(entries)
  }

  forEach(entriesOrUpdater, function(entry, id) {
    entries[id] = entry
  })

  return entries
}

export default {
  __init__: ['customPalette'],
  customPalette: ['type', Palette]
}

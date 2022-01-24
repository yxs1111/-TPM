import CustomRenderer from './CustomRenderer'
import CustomContextPadProvider from './CustomContextPadProvider'
import DirectEditingModule from 'diagram-js-direct-editing'
import ContextPadModule from 'diagram-js/lib/features/context-pad'
import SelectionModule from 'diagram-js/lib/features/selection'
import ConnectModule from 'diagram-js/lib/features/connect'
import CreateModule from 'diagram-js/lib/features/create'

import PopupMenuModule from 'bpmn-js/lib/features/popup-menu'

export default {
  __depends__: [
    DirectEditingModule,
    ContextPadModule,
    SelectionModule,
    ConnectModule,
    CreateModule,
    PopupMenuModule
  ],
  __init__: ['customRenderer', 'contextPadProvider'],
  customRenderer: ['type', CustomRenderer],
  contextPadProvider: ['type', CustomContextPadProvider]
}

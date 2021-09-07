import inherits from 'inherits'
const is = require('bpmn-js/lib/util/ModelUtil').is

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator'

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
/**
 * bpmn
 * @type {function(*, *=, *=, *=): void}
 */
const processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps')
// eslint-disable-next-line no-unused-vars
const eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps')
// eslint-disable-next-line no-unused-vars
const linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps')
const documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps')
const idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps')
const nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps')
// eslint-disable-next-line no-unused-vars
const executableProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps')

/**
 * camunda
 * @type {function(*, *=, *=): void}
 */
const versionTag = require('bpmn-js-properties-panel/lib/provider/camunda/parts/VersionTagProps')
const tasklist = require('bpmn-js-properties-panel/lib/provider/camunda/parts/TasklistProps')
// eslint-disable-next-line no-unused-vars
const errorProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ErrorEventProps')
// eslint-disable-next-line no-unused-vars
const serviceTaskDelegateProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ServiceTaskDelegateProps')
// eslint-disable-next-line no-unused-vars
const scriptProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ScriptTaskProps')
// eslint-disable-next-line no-unused-vars
const callActivityProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/CallActivityProps')

/**
 * JBInfo
 */
// eslint-disable-next-line no-unused-vars
const JBInfoUserTaskProps = require('@/components/activiti/parts/JBInfoUserTask')

// Require your custom property entries.
import spellProps from '../parts/SpellProps'

const PROCESS_KEY_HINT = 'This maps to the process definition key.'
const TASK_KEY_HINT = 'This maps to the task definition key.'

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {
  const generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  }

  let idOptions
  let processOptions

  if (is(element, 'bpmn:Process')) {
    idOptions = { description: translate(PROCESS_KEY_HINT) }
  }

  if (is(element, 'bpmn:UserTask')) {
    idOptions = { description: translate(TASK_KEY_HINT) }
  }

  if (is(element, 'bpmn:Participant')) {
    processOptions = { processIdDescription: translate(PROCESS_KEY_HINT) }
  }

  idProps(generalGroup, element, translate, idOptions)
  nameProps(generalGroup, element, bpmnFactory, canvas, translate)
  processProps(generalGroup, element, translate, processOptions)
  versionTag(generalGroup, element, translate)

  const detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  }
  JBInfoUserTaskProps(detailsGroup, element, translate)
  tasklist(detailsGroup, element, bpmnFactory, translate)

  const documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  }

  documentationProps(documentationGroup, element, bpmnFactory, translate)

  return [
    generalGroup,
    detailsGroup,
    documentationGroup
  ]
}

// Create the custom magic tab
// eslint-disable-next-line no-unused-vars
function createMagicTabGroups(element) {
  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'Black Magic',
    entries: []
  }

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element)

  return [
    blackMagicGroup
  ]
}

export default function JBInfoPropertiesProvider(
  eventBus, bpmnFactory, canvas,
  elementRegistry, translate) {
  PropertiesActivator.call(this, eventBus)

  this.getTabs = function(element) {
    const generalTab = {
      id: 'general',
      label: '基础属性',
      groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate)
    }

    // Show general + "magic" tab
    return [
      generalTab
    ]
  }
}

inherits(JBInfoPropertiesProvider, PropertiesActivator)

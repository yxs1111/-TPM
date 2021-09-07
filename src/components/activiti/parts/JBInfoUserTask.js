'use strict'

const is = require('bpmn-js/lib/util/ModelUtil').is
const entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory')

module.exports = function(group, element, translate) {
  if (is(element, 'bpmn:UserTask')) {
    // Assignee
    group.entries.push(entryFactory.textField(translate, {
      id: 'assignee',
      label: translate('Assignee'),
      modelProperty: 'activiti:assignee'
    }))

    // Candidate Users
    /* group.entries.push(entryFactory.textField(translate, {
      id: 'candidateUsers',
      label: translate('Candidate Users'),
      modelProperty: 'candidateUsers'
    }))*/

    // Candidate Groups
    /* group.entries.push(entryFactory.textField(translate, {
      id: 'candidateGroups',
      label: translate('Candidate Groups'),
      modelProperty: 'candidateGroups'
    }))*/

    // Due Date
    group.entries.push(entryFactory.textField(translate, {
      id: 'dueDate',
      description: translate('The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)'),
      label: translate('Due Date'),
      modelProperty: 'dueDate'
    }))

    // FollowUp Date
    /* group.entries.push(entryFactory.textField(translate, {
      id: 'followUpDate',
      description: translate('The follow up date as an EL expression (e.g. ${someDate} or an ' +
                'ISO date (e.g. 2015-06-26T09:54:00)'),
      label: translate('Follow Up Date'),
      modelProperty: 'followUpDate'
    }))*/

    // priority
    /* group.entries.push(entryFactory.textField(translate, {
      id: 'priority',
      label: translate('Priority'),
      modelProperty: 'priority'
    }))*/
  }
}

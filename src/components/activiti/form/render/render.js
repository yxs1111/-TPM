import { deepClone } from '@/utils'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

/**
 * 设置组件value的默认值，并发送组件的Input
 * @param dataObject
 * @param defaultValue
 */
function vModel(dataObject, confClone) {
  dataObject.props.value = confClone.__config__.defaultValue

  dataObject.on.input = val => {
    this.$emit('input', val)
  }
}

/**
 * 根据组件名从ComponentChild中获取组件的默认插槽内容
 *  如果slots文件夹存在与当前tag同名的文件，并且当前组件有插槽(即:__slot__有内容)则在插槽内追加组件默认的插槽内容
 * @param h
 * @param confClone
 * @param children
 */
function mountSlotFiles(h, confClone, children) {
  const childObjs = componentChild[confClone.__config__.tag]
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key]
      if (confClone.__slot__ && confClone.__slot__[key]) {
        children.push(childFunc(h, confClone, key))
      }
    })
  }
}

/**
 * 将字符串类型的事件名，发送为消息
 * @param confClone
 */
function emitEvents(confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event)
      }
    })
  })
}

/**
 * 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
 * @param confClone: 表单模型(即：field)
 * @param dataObject: 数据对象
 */
function buildDataObject(confClone, dataObject) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key]
    if (key === '__vModel__') {
      vModel.call(this, dataObject, confClone)
    } else if (dataObject[key] !== undefined) {
      if (dataObject[key] === null ||
        dataObject[key] instanceof RegExp ||
        ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
        dataObject[key] = val
      } else if (Array.isArray(dataObject[key])) {
        dataObject[key] = [...dataObject[key], ...val]
      } else {
        dataObject[key] = { ...dataObject[key], ...val }
      }
    } else {
      dataObject.attrs[key] = val
    }
  })

  // 清理属性
  clearAttrs(dataObject)
}

/**
 * 从数据对象中删除自定义配置信息
 * @param dataObject
 */
function clearAttrs(dataObject) {
  delete dataObject.attrs.__config__
  delete dataObject.attrs.__slot__
  delete dataObject.attrs.__methods__
}

function makeDataObject() {
  // 数据对象
  return {
    class: {},
    attrs: {},
    props: {},
    domProps: {},
    nativeOn: {},
    on: {},
    style: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: true
  }
}

export default {
  props: {
    conf: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const dataObject = makeDataObject()
    const confClone = deepClone(this.conf)
    const children = this.$slots.default || []

    mountSlotFiles.call(this, h, confClone, children)

    emitEvents.call(this, confClone)

    buildDataObject.call(this, confClone, dataObject)

    return h(this.conf.__config__.tag, dataObject, children)
  }
}

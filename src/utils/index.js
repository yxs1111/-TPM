/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 获取日期控件范围
 * @returns {options}
 */
export function getPickerOptions() {
  return {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
  }
}

/**
 * 获取日期控件范围
 * @returns {options}
 */
export function getFormatPickerOptions() {
  return {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        setStartAndEnd(start, end)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        setStartAndEnd(start, end)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        setStartAndEnd(start, end)
        picker.$emit('pick', [start, end])
      }
    }]
  }
}

/**
 * 设置开始结束时间的时分秒
 * @param start 00:00:00
 * @param end 23:59:59
 */
export function setStartAndEnd(start, end) {
  start.setHours(0)
  start.setMinutes(0)
  start.setSeconds(0)
  end.setHours(23)
  end.setMinutes(59)
  end.setSeconds(59)
}

/**
 * 获取dialog对话框信息文字
 */
export function getTextMap() {
  return {
    update: '编辑',
    create: '新增',
    info: '查看'
  }
}

export function getDefaultPermissions() {
  return {
    'get': 0,
    'insert': 1,
    'update': 2,
    'delete': 3,
    'import': 4,
    'export': 5
  }
}

/**
 * 获取授权类型
 */
export function getGrantTypeOptions() {
  return (
    [
      {
        key: 'password',
        label: 'password'
      },
      {
        key: 'refresh',
        label: 'refresh'
      }
    ]
  )
}

export function randomNum(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix ]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('') + new Date().getTime()
}

/**
 * 是否显示router
 * @param keys
 * @returns {boolean}
 */
export function showRouter(keys) {
  return keys.indexOf(process.env.NODE_ENV) > -1
}
//  Form-Generator
/**
 * beautifierConf
 * @type {{js: {break_chained_methods: boolean, keep_array_indentation: boolean, jslint_happy: boolean, brace_style: string, e4x: boolean, indent_size: string, preserve_newlines: boolean, indent_inner_html: boolean, indent_scripts: string, unescape_strings: boolean, space_before_conditional: boolean, comma_first: boolean, indent_empty_lines: boolean, max_preserve_newlines: string, end_with_newline: boolean, indent_char: string, wrap_line_length: string}, html: {break_chained_methods: boolean, keep_array_indentation: boolean, jslint_happy: boolean, brace_style: string, e4x: boolean, indent_size: string, preserve_newlines: boolean, indent_inner_html: boolean, indent_scripts: string, unescape_strings: boolean, space_before_conditional: boolean, comma_first: boolean, indent_empty_lines: boolean, max_preserve_newlines: string, end_with_newline: boolean, indent_char: string, wrap_line_length: string}}}
 */
export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}
/**
 * 下划转驼峰
 * @param str
 * @returns {boolean}
 */
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

/**
 * 首字母大小
 * @param str
 * @returns {*}
 */
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * 深拷贝对象
 * @param obj
 * @returns {*[]|*|RegExp|Date}
 */
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}
const toStr = Function.prototype.call.bind(Object.prototype.toString)
export function isObjectObject(t) {
  return toStr(t) === '[object Object]'
}

/**
 * 下滑线转驼峰
 * @param val: 需要转换的字符串
 * @param char: 分隔符
 * @returns {*}
 */
export function replaceUnderLine(val, char = '_') {
  const arr = val.split('')
  const index = arr.indexOf(char)
  if (index === -1) {
    return val
  }
  arr.splice(index, 2, arr[index + 1].toUpperCase())
  val = arr.join('')
  return val
}
/**
 * 获取CPT版本月
 * @returns yyyy-mm
 */
 export function getCPTMonth() {
  const date=new Date()
  let year=date.getFullYear()
  let month=date.getMonth()-1
  month = month < 10 ? "0" + month : month;
  return year+''+month
}
export const exportDefault = 'export default '

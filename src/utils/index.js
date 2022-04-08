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
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
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
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
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
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }
}

/**
 * 获取日期控件范围
 * @returns {options}
 */
export function getFormatPickerOptions() {
  return {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          setStartAndEnd(start, end)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          setStartAndEnd(start, end)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          setStartAndEnd(start, end)
          picker.$emit('pick', [start, end])
        }
      }
    ]
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
    get: 0,
    insert: 1,
    update: 2,
    delete: 3,
    import: 4,
    export: 5,
    getCPT: 6
  }
}

/**
 * 获取授权类型
 */
export function getGrantTypeOptions() {
  return [
    {
      key: 'password',
      label: 'password'
    },
    {
      key: 'refresh',
      label: 'refresh'
    }
  ]
}

export function randomNum(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  )
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
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
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
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
    if (obj.global) {
      flags.push('g')
    }
    if (obj.multiline) {
      flags.push('m')
    }
    if (obj.ignoreCase) {
      flags.push('i')
    }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj)
    ? []
    : obj.constructor
    ? new obj.constructor()
    : {}

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
  const date = new Date()
  const cdate = new Date()
  cdate.setDate(date.getDate() + 60)
  let year = cdate.getFullYear()
  let month = cdate.getMonth() + 1
  month = month < 10 ? '0' + month : month
  return year + '' + month
}
/**
 * 获取当前月
 * @returns yyyy-mm
 */
export function getCurrentMonth() {
  const date = new Date()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  month = month < 10 ? '0' + month : month
  let currentMonth = year + '' + month
  let list = []
  list.push(currentMonth)
  return [...list, ...list]
}
export function getCurrentMonth1() {
  const date = new Date()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  month = month < 10 ? '0' + month : month
  let currentMonth = year + '-' + month
  let list = []
  list.push(currentMonth)
  return [...list, ...list]
}

// 获取Scenario
export function yearAndMonthList() {
  const date = new Date()
  let year = date.getFullYear() - 1
  let yearAndMonthList = []
  for (let i = 0; i < 12; i++) {
    let str = year + ' ' + i + '+' + (12 - i)
    yearAndMonthList.push(str)
  }

  return yearAndMonthList
}
//Version
export function VersionList() {
  // return ['V1', 'V2', 'Final']
  return ['Final']
}
//报表背景色
export function ReportBgColorMap() {
  return {
    v1: 'background:#fdf0f1!important',
    v2: 'background:#ebfbf8!important',
    v3: 'background:#fff6e5!important'
  }
}
//message map
export function messageMap() {
  return {
    importSuccess: '常规项校验导入成功',
    importError: '常规项校验导入失败',
    checkSuccess: '异常项校验导入成功',
    checkError: '异常项校验导入失败',
    downloadSuccess: '下载模板成功',
    downloadError: '下载模板失败',
    exportSuccess: '导出成功',
    exportError: '导出失败',
    exportErrorSuccess: '导出错误信息成功',
    exportErrorError: '导出错误信息失败',
    saveSuccess: '保存成功',
    saveError: '保存失败',
    requireChannel:'渠道不能为空，请选择渠道'
  }
}
export const messageObj={
  requireChannel:'渠道不能为空，请选择渠道',
  requireMonth:'活动月不能为空，请选择活动月'
}
//报表动态列
export function ReportCheckList() {
  return [
    'passNum',
    'exceptionOneNum',
    'exceptionTwoNum',
    'exceptionThreeNum',
    'passRange',
    'exceptionOneRange',
    'exceptionTwoRange',
    'exceptionThreeRange'
  ]
}
export function ReportCheckListCost() {
  return [
    'passNum',
    'exceptionOneNum',
    'exceptionTwoNum',
    'exceptionThreeNum',
    'passRange',
    'exceptionOneRange',
    'exceptionTwoRange',
    'exceptionThreeRange'
  ]
}
//报表动态列
export function dynamicColumn() {
  return [
    { title: 'Pass数量', value: 'passNum' },
    { title: 'Exception1数量', value: 'exceptionOneNum' },
    { title: 'Exception2数量', value: 'exceptionTwoNum' },
    { title: 'Exception3数量', value: 'exceptionThreeNum' },
    { title: 'Pass占比', value: 'passRange' },
    { title: 'Exception1占比', value: 'exceptionOneRange' },
    { title: 'Exception2占比', value: 'exceptionTwoRange' },
    { title: 'Exception3占比', value: 'exceptionThreeRange' }
  ]
}
export const dynamicColumnCost= [
    { title: 'Pass费用', value: 'passNum' },
    { title: 'Exception1费用', value: 'exceptionOneNum' },
    { title: 'Exception2费用', value: 'exceptionTwoNum' },
    { title: 'Exception3费用', value: 'exceptionThreeNum' },
    { title: 'Pass占比', value: 'passRange' },
    { title: 'Exception1占比', value: 'exceptionOneRange' },
    { title: 'Exception2占比', value: 'exceptionTwoRange' },
    { title: 'Exception3占比', value: 'exceptionThreeRange' }
  ]

export function FormateThousandNum(num) {
  //千分位分隔符+两位小数
  const money = num * 1
  return money.toLocaleString('zh', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const exportDefault = 'export default '
export function getYearAndMonthRange(start, end) {
  var result = []
  var starts = start.split('-')
  var ends = end.split('-')
  var staYear = parseInt(starts[0])
  var staMon = parseInt(starts[1])
  var endYear = parseInt(ends[0])
  var endMon = parseInt(ends[1])
  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon <= endMon) {
        var str = staYear + '' + (staMon >= 10 ? staMon : '0' + staMon)
        result.push(str)
        staMon++
      }
      staYear++
    } else {
      if (staMon > 12) {
        staMon = 1
        staYear++
      }
      var str = staYear + '' + (staMon >= 10 ? staMon : '0' + staMon)
      result.push(str)
      staMon++
    }
  }
  return result
}
//多行筛选
export function getHeight() {
  return window.innerHeight - 450
}
// tab
export function getHeightHaveTab() {
  return window.innerHeight - 500
}
// 单行筛选（1366 下筛选一行展示）
export function getHeightSingle() {
  return window.innerHeight - 340
}
/**
 * 合同录入表格最大高度
 * @returns el-table max-height
 */
export function getContractEntry() {
  return window.innerHeight - 350
}
/**
 * 
 * @param {*数据流} res 
 * @param {*文件名称} fileName 
 */
//下载文件
export function downloadFile(res, fileName) {
  let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  if (!fileName) {
    fileName = res.headers['content-disposition'].split('filename=').pop()
  }
  if ('msSaveOrOpenBlob' in navigator) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  }
}

/**
 * 
 * @param {数字} n 
 * @returns 列名
 * 数字向列名转换
 */
export function createCellPos(n) {
  var ordA = 'A'.charCodeAt(0) //字母转unicode
  var ordZ = 'Z'.charCodeAt(0)
  var len = ordZ - ordA + 1 // 计算字母长度
  var s = ''
  while (n >= 0) {
    //将输入数字转换成字母
    s = String.fromCharCode((n % len) + ordA) + s
    //每次进行完需要重新floor向下取整，-1是因为 A的unicode是0
    n = Math.floor(n / len) - 1
  }
  return s
} 
//字符串转ArrayBuffer
export function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
//-[获取两个日期中所有的月份中]
export function getMonthBetween(start,end){  
 var result = [];  
 var s = start.split("-");  
 var e = end.split("-");  
 var min = new Date();  
 var max = new Date();  
 min.setFullYear(s[0],s[1]);  
 max.setFullYear(e[0],e[1]);  
 var curr = min;  
 while(curr <= max){  
     var month = curr.getMonth();  
     //month=month==0?12:month;
     var str=curr.getFullYear()+"-"+(month);
     var s=curr.getFullYear()+"-0";
     if(str==s){
       str=curr.getFullYear()+"-12";
     }
     result.push(str);  
     curr.setMonth(month+1);
 }  
 return result;  
} 
/**
 * 字符串根据逗号分割换行显示
 * @param {字符串} value 
 * @returns 换行
 */
export function setSplitAssignee(value) {
  let list=value.split(',')
  let formatString=''
  for (let index = 0; index <list.length; index++) {
    formatString+=`${list[index]}<br>`
    
  }
  return formatString
}




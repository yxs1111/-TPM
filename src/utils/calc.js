// 加法
export const add = (a, b, precision = 2) => {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null
  }
  const m = Math.pow(10, precision)
  const r = (a * m + b * m) / m

  return fixed(r, precision)
}

// 减法
export const sub = (a, b, precision = 2) => {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null
  }
  const m = Math.pow(10, precision)
  const r = (a * m - b * m) / m
  return fixed(r, precision)
}

// 乘法
export const mul = (a, b, precision = 2) => {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null
  }
  let m = 0
  const c = a.toString()
  const d = b.toString()
  try {
    m += c.split('.')[1].length
  } catch (e) { console.error('运算过程出问题了') }
  try {
    m += d.split('.')[1].length
  } catch (e) { console.error('运算过程出问题了') }
  const r = Number(c.replace('.', '')) * Number(d.replace('.', '')) / Math.pow(10, m)
  return fixed(r, precision)
}

// 除法
export const div = (a, b, precision = 2) => {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) {
    return null
  }
  let c, d
  try {
    c = a.toString().split('.')[1].length
  } catch (e) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (e) {
    d = 0
  }
  const f = Number(a.toString().replace('.', ''))
  const g = Number(b.toString().replace('.', ''))
  const r = (f / g) * Math.pow(10, d - c)
  return fixed(r, precision)
}

export const fixed = (num, precision = 2) => {
  const m = Math.pow(10, precision)
  if (num < 0) {
    // 先把负数转为正数，然后四舍五入之后再转为负数
    num = Math.abs(num)
    const des = parseInt(num * m + 0.5) / m
    return -des
  } else {
    return parseInt(num * m + 0.5) / m
  }
}

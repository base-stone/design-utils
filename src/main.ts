interface CallbackFn {
  <T>(data: T): void
}

const ua = navigator.userAgent
const isIOS = ua && /iPhone|iPad|iPod/gi.test(ua)
const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
const isWeixin = ua.indexOf('MicroMessenger') > -1
function prefixZero(val: number): string {
  if (val < 10) {
    return '0' + val
  } else {
    return '' + val
  }
}

/**
 * @param fn {Function}   实际要执行的函数
 * @param wait {Number}  执行间隔，单位是毫秒（ms）
 * @return {Function}     返回一个“节流”函数
 */
function throttle(func: CallbackFn, wait: number): CallbackFn {
  let lastTime: any = null
  let timeout: any = null
  return (...args) => {
    // @ts-ignore
    const context = this
    const now = new Date().getTime()
    // 如果上次执行的时间和这次触发的时间大于一个执行周期，则执行
    if (now - lastTime - wait > 0) {
      // 如果之前有了定时任务则清除
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      func.apply(context, args)
      lastTime = now
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
/**
 * @param {Function} fn   实际要执行的函数
 * @param { Number } wait  执行间隔，单位是毫秒（ms）
 * @return {Function}     返回一个“防抖”函数
 */
function debounce(func: CallbackFn, wait: number): CallbackFn {
  let lastTime: any = null
  let timeout: any = null
  return (...args) => {
    // @ts-ignore
    const context = this
    const now = new Date().getTime()
    // 判定不是一次抖动
    if (now - lastTime - wait > 0) {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    } else {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
    // 注意这里lastTime是上次的触发时间
    lastTime = now
  }
}
/**
 * @param {Object} obj
 * @returns {string} result
 */
function queryStringify(formData: any): string {
  if (!formData) {
    return ''
  }
  return new URLSearchParams(formData).toString()
}

/**
 * @param {String || null } val
 * @return {String} result
 */
function getQueryParams(key: string): string | null {
  if (key === void 0 || key === null) {
    return ''
  }
  return new URLSearchParams(location.search).get(key)
}

/**
 * @param {String || null } val
 * @return {Object} result
 */
function getQueryAllParams(): any {
  const searchParams = new URLSearchParams(location.search)
  const result = Object.create(null)
  searchParams.forEach((value, key) => {
    result[key] = value
  })
  return result
}

function getPassiveValue(): any {
  let supportsPassiveOption = false
  try {
    // @ts-ignore
    addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassiveOption = true
        }
      })
    )
  } catch (e) {
    /* empty */
  }
  //{passive: true} 就不会调用 preventDefault 来阻止默认滑动行为
  return supportsPassiveOption ? { passive: true, capture: true } : true
}

function getUniqueId(randomLength = 10): string {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}
function getFontSize() {
  return ~~window.getComputedStyle(document.documentElement).fontSize.replace('px', '')
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function parseTime(time: number | string | Date, cFormat: string) {
  if (time === void 0 || time === null) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date = null
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    if (isIOS && typeof time === 'string') {
      date = new Date(time.replace(/\\-/g, '/'))
    } else {
      date = new Date(time)
    }
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
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key: string) => {
    // @ts-ignore
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export {
  isWeixin,
  isIOS,
  isAndroid,
  prefixZero,
  parseTime,
  getFontSize,
  getPassiveValue,
  getQueryParams,
  getQueryAllParams,
  getUniqueId,
  queryStringify,
  throttle,
  debounce
}

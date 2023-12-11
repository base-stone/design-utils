import { isLocalStorageSupported } from './fun'
function getStorageType(type: string) {
  return type == 'local' ? window.localStorage : window.sessionStorage
}

/**
 * @param  {Object}  value
 * @return {String}  value
 */
function serialize(value: any): string {
  if (typeof value == 'object') {
    return JSON.stringify(value)
  } else {
    return value
  }
}
/**
 * @param  {String} value
 * @return {String} value
 */
function deserialize(value: string): any {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

const isSupported = isLocalStorageSupported()
let windowStorage = Object.create(null)

function setItem(key: string, val: any, type: string): void {
  const storage = getStorageType(type)
  if (typeof val == 'object') {
    storage.setItem(key, serialize(val))
  } else {
    storage.setItem(key, val)
  }
}

function getItem(key: string, type: string): string {
  const storage: Storage = getStorageType(type)
  const result: string | null = storage.getItem(key)
  return deserialize(<string>result)
}

function removeItem(key: string, type: string): void {
  const storage = getStorageType(type)
  storage.removeItem(key)
}

function clearAll(type: string): void {
  const storage = getStorageType(type)
  storage.clear()
}

function windowSet(key: string, val: any): void {
  if (window.name) {
    windowStorage = deserialize(window.name)
  }
  windowStorage[key] = val
  window.name = serialize(windowStorage)
}
function windowGet(key: any): string | null {
  if (window.name) {
    return deserialize(window.name)[key]
  } else {
    return ''
  }
}
function windowRemove(key: string): void {
  windowStorage = deserialize(window.name)
  delete windowStorage[key]
  window.name = serialize(windowStorage)
}
function windowClear(): void {
  window.name = ''
}

function set(key: string, val: any, type: string): void {
  if (isSupported) {
    setItem(key, val, type)
  } else {
    windowSet(key, val)
  }
}

function get(key: string, type: string): any {
  if (isSupported) {
    return getItem(key, type)
  } else {
    return windowGet(key)
  }
}

function remove(key: string, type: string): void {
  if (isSupported) {
    removeItem(key, type)
  } else {
    windowRemove(key)
  }
}

function clear(type: string): void {
  if (isSupported) {
    clearAll(type)
  } else {
    windowClear()
  }
}

function localSet(key: string, val: any): void {
  set(key, val, 'local')
}
function sessionSet(key: string, val: any): void {
  set(key, val, 'session')
}

function localGet(key: string): any {
  return get(key, 'local')
}
function sessionGet(key: string): any {
  return get(key, 'session')
}

function localRemove(key: string): any {
  remove(key, 'local')
}
function sessionRemove(key: string): any {
  remove(key, 'session')
}

function localClear(): any {
  clear('local')
}
function sessionClear(): any {
  clear('session')
}

const localStore = {
  set: localSet,
  get: localGet,
  remove: localRemove,
  clear: localClear
}
const sessionStore = {
  set: sessionSet,
  get: sessionGet,
  remove: sessionRemove,
  clear: sessionClear
}
export { localStore, sessionStore }

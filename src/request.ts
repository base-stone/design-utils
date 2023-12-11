import { queryStringify } from './utils'
import { localStore } from './store'
import { isLocalStorageSupported } from './fun'
export interface RequestFn {
  url: string
  method: string
  hostPath?: string
  timeout?: number
  data?: any
  cache?: boolean
  expires?: number
  cancelable?: boolean
  cancelToken?: string
  showLoading?: boolean
  showMessage?: boolean
  fullResponse?: boolean
  headers?: {
    [key: string]: string
  }
}

interface Callback {
  (data: unknown, xhrStatus?: number): void
}

const cancelTokenMaps = Object.create(null)

function removeStorageData(times: number): void {
  const storage = isLocalStorageSupported() ? localStorage : window.name
  if (!storage) {
    return
  }
  Object.keys(storage).forEach((item) => {
    const data = localStore.get(item)
    if (data && data.times && times > data.times) {
      localStore.remove(item)
    }
  })
}

function dispatchXhrRequest({
  hostPath = location.origin,
  url,
  timeout = 60000,
  method,
  headers = {},
  cancelable,
  data,
  cancelToken
}: RequestFn): Promise<{ result: any; xhrStatus?: number }> {
  return new Promise((resolve, reject) => {
    const formData = Object.create(null)
    if (data) {
      Object.keys(data).forEach((key) => {
        const itemValue = data[key]
        if (itemValue !== void 0 && itemValue !== null && itemValue !== '') {
          formData[key] = itemValue
        }
      })
    }
    const xhr = new XMLHttpRequest()
    const bodyData =
      headers['Content-Type'] == 'application/json'
        ? JSON.stringify(formData)
        : queryStringify(formData)
    const httpUrl = method == 'GET' && data ? url + '?' + bodyData : url
    xhr.open(method, hostPath + httpUrl, true)
    xhr.timeout = timeout
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
    xhr.responseType = 'text'
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        const xhrStatus = xhr.status
        const responseData = JSON.parse(xhr.response.replace(/:\s*([0-9]{16,})/g, ':"$1"'))
        if ((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304) {
          resolve({ result: responseData })
        } else {
          reject({ result: responseData, xhrStatus })
        }
      }
    }
    method == 'GET' ? xhr.send(null) : xhr.send(bodyData)
    if (cancelable && cancelToken) {
      cancelTokenMaps[cancelToken] = xhr
    }
  })
}

export function cancelRequest(cancelToken: string) {
  if (cancelToken) {
    const xhr = cancelTokenMaps[cancelToken]
    if (xhr) {
      xhr.abort()
      delete cancelTokenMaps[cancelToken]
    }
  } else {
    const cancelTokenList: string[] = Object.keys(cancelTokenMaps)
    cancelTokenList.forEach((item) => {
      const xhr = cancelTokenMaps[item]
      if (xhr) {
        xhr.abort()
        delete cancelTokenMaps[cancelToken]
      }
    })
  }
}

export default function httpRequest(
  {
    url,
    method,
    timeout,
    data = null,
    cache = false,
    expires = 5 * 60 * 1000,
    headers,
    hostPath,
    cancelable,
    cancelToken
  }: RequestFn,
  successCallback: Callback,
  failCallback: Callback
): Promise<any> | any {
  const cacheUrl = data ? url + '?' + queryStringify(data) : url
  const options = {
    method: method.toUpperCase(),
    data,
    url,
    timeout,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...headers
    },
    hostPath,
    cancelable,
    cancelToken
  }
  const times = new Date().getTime()
  const storeData = localStore.get(hostPath + cacheUrl)

  function setResponseData(results: any) {
    const data = {
      times: times + expires,
      results
    }
    if (results && cache) {
      localStore.set(hostPath + cacheUrl, data)
    }
    return Promise.resolve(results)
  }

  if (cache && storeData) {
    const cacheTime = data.times
    if (times < cacheTime) {
      return Promise.resolve(data.results)
    }
  } else {
    if (successCallback && failCallback) {
      return dispatchXhrRequest(options)
        .then(successCallback, failCallback)
        .then((result) => {
          return setResponseData(result)
        })
    } else {
      return dispatchXhrRequest(options).then(({ result }) => {
        return setResponseData(result)
      })
    }
  }

  removeStorageData(times)
}

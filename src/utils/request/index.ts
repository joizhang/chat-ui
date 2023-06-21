import type { HttpOption, Result } from '#/axios'
import request from './axios'

function http({
  url,
  method,
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<Result> {
  method = method || 'GET'
  data = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  if (method === 'POST') {
    return request.post(url, data, { headers, params, signal, onDownloadProgress })
  } else if (method == 'DELETE') {
    return request.delete(url, { headers, params, signal, onDownloadProgress })
  } else if (method == 'PUT') {
    return request.put(url, data, { headers, params, signal, onDownloadProgress })
  } else {
    return request.get(url, { headers, params, signal, onDownloadProgress })
  }
}

export function get({
  url,
  method = 'GET',
  headers,
  params,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<Result> {
  return http({
    url,
    method,
    headers,
    params,
    onDownloadProgress,
    signal,
  })
}

export function post({
  url,
  method = 'POST',
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<Result> {
  return http({
    url,
    method,
    headers,
    params,
    data,
    onDownloadProgress,
    signal,
  })
}

export function del({
  url,
  method = 'DELETE',
  headers,
  params,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<Result> {
  return http({
    url,
    method,
    headers,
    params,
    onDownloadProgress,
    signal,
  })
}

export function put({
  url,
  method = 'PUT',
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<Result> {
  return http({
    url,
    method,
    headers,
    params,
    data,
    onDownloadProgress,
    signal,
  })
}

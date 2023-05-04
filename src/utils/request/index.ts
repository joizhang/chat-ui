import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'
// import { useAuthStore } from '@/store/auth'

export interface HttpOption {
  url: string
  method?: string
  headers?: any
  params?: any
  data?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
}

export interface Response<T = any> {
  data: T
  message: string | null
  status: string
}

function http<T = any>({
  url,
  method,
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<AxiosResponse<T, T>> {
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

export function get<T = any>({
  url,
  method = 'GET',
  headers,
  params,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<AxiosResponse<T, T>> {
  return http<T>({
    url,
    method,
    headers,
    params,
    onDownloadProgress,
    signal,
  })
}

export function post<T = any>({
  url,
  method = 'POST',
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<AxiosResponse<T, T>> {
  return http<T>({
    url,
    method,
    headers,
    params,
    data,
    onDownloadProgress,
    signal,
  })
}

export function del<T = any>({
  url,
  method = 'DELETE',
  headers,
  params,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<AxiosResponse<T, T>> {
  return http<T>({
    url,
    method,
    headers,
    params,
    onDownloadProgress,
    signal,
  })
}

export function put<T = any>({
  url,
  method = 'PUT',
  headers,
  params,
  data,
  onDownloadProgress,
  signal,
}: HttpOption): Promise<AxiosResponse<T, T>> {
  return http<T>({
    url,
    method,
    headers,
    params,
    data,
    onDownloadProgress,
    signal,
  })
}

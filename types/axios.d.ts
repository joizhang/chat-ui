import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'

export interface HttpOption {
    url: string
    method?: string
    headers?: any
    params?: any
    data?: any
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
    signal?: GenericAbortSignal
  }

export interface Result {
  code: number
  data: any
  msg: string | null
  success: boolean
}

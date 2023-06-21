import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 查找用户
export function searchCustomer(params: any, signal?: GenericAbortSignal) {
  return get({
    url: '/chat/svc/customer/query',
    params: params,
    signal: signal,
  })
}

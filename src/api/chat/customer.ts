import type { GenericAbortSignal } from 'axios'
import { get, post, put, del } from '@/utils/request'

/**
 * Searches for a customer using the provided parameters.
 *
 * @param {any} params - The parameters for the customer search.
 * @param {GenericAbortSignal} [signal] - An optional abort signal for the search.
 * @return {Promise<any>} - A promise that resolves with the search results.
 */
export function searchCustomer(params: any, signal?: GenericAbortSignal) {
  return get({
    url: '/chat/svc/customer/query',
    params: params,
    signal: signal,
  })
}

export function updateCustomer(data: any, signal?: GenericAbortSignal) {
  return put({
    url: '/chat/svc/customer/info',
    data: data,
    signal: signal,
  })
}
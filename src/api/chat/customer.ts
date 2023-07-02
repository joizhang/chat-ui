import type { GenericAbortSignal } from 'axios'
import { get, post, put, del } from '@/utils/request'

/**
 * Retrieves user information from the server.
 *
 * @param {GenericAbortSignal} [signal] - An optional signal object that allows the user to abort the request.
 * @return {Promise<any>} - A promise that resolves with the user information.
 */
export function retrieveCustomerInfo(signal?: GenericAbortSignal) {
  return get({
    url: '/chat/svc/customer',
    signal: signal,
  })
}

export function updateCustomer(data: any, signal?: GenericAbortSignal) {
  return put({
    url: '/chat/svc/customer',
    data: data,
    signal: signal,
  })
}

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
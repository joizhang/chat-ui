import type { GenericAbortSignal } from 'axios'
import { get, post, put, del } from '@/utils/request'

export function addCommunity(community: any, signal?: GenericAbortSignal) {
  return post({
    url: '/chat/svc/community',
    data: community,
    signal: signal,
  })
}

import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 获取最新聊天记录
export function getMessageHistory(serverStubId: string, signal?: GenericAbortSignal) {
  return get({
    url: '/chat/svc/message/history',
    params: { serverStubId },
    signal: signal,
  })
}

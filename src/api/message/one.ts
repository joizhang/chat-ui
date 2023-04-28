import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 获取最新聊天记录
export function getMessageHistory<T = any>(serverStubId: number, signal?: GenericAbortSignal) {
  return get<T>({
    url: '/chat/svc/message/history',
    params: { serverStubId },
    signal: signal,
  })
}

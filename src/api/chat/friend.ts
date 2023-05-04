import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 查找好友
export function searchFriends<T = any>(params: any, signal?: GenericAbortSignal) {
  return get<T>({
    url: '/chat/svc/customer/page',
    params: params,
    signal: signal,
  })
}

// 好友是否存在
export function checkFriend<T = any>(userId: string, friendId: string, signal?: GenericAbortSignal) {
  return get<T>({
    url: '/chat/svc/friend/exist',
    params: { userId, friendId },
    signal: signal,
  })
}

// 添加好友
export function addFriendRequest<T = any>(data: any, signal?: GenericAbortSignal) {
  return post<T>({
    url: '/chat/svc/friend/request',
    // params: { friendId },
    data: data,
    signal: signal,
  })
}

// 删除好友
export function deleteFriend<T = any>(friendId: string, signal?: GenericAbortSignal) {
  return del<T>({
    url: '/chat/svc/friend/delete',
    params: { friendId },
    signal: signal,
  })
}

// 获取发信人列表
export function getSenders<T = any>(senderIds: Array<string>, signal?: GenericAbortSignal) {
  return get<T>({
    url: '/chat/svc/customer/senders',
    params: { senderIds: senderIds.reduce((a, b) => `${a},${b}`) },
    signal: signal,
  })
}

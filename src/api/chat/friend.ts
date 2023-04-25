import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 查找好友
export function searchFriends<T = any>(params: any, signal?: GenericAbortSignal) {
    return get<T>({
        url: '/chat/svc/customer/page',
        params: params,
        signal: signal
    })
}

// 添加好友
function addFriend<T = any>(friendId: number, signal?: GenericAbortSignal) {
  return post<T>({
    url: '/chat/friend/add',
    params: { friendId },
    signal: signal,
  })
}

// 删除好友
function deleteFriend<T = any>(friendId: number, signal?: GenericAbortSignal) {
  return del<T>({
    url: '/chat/friend/delete',
    params: { friendId },
    signal: signal,
  })
}

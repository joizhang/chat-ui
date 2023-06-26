import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'

// 好友是否存在
export function checkFriend(userId: string, friendId: string, signal?: GenericAbortSignal) {
  return get({
    url: '/chat/svc/friend',
    params: { userId, friendId },
    signal: signal,
  })
}

// 添加好友
export function addFriendRequest(data: any, signal?: GenericAbortSignal) {
  return post({
    url: '/chat/svc/friend',
    // params: { friendId },
    data: data,
    signal: signal,
  })
}

// 删除好友
export function deleteFriend(friendId: string, signal?: GenericAbortSignal) {
  return del({
    url: '/chat/svc/friend',
    params: { friendId },
    signal: signal,
  })
}

export function getCustomersByFriends(
  userId: string,
  createTime: any,
  requestStatus: string,
  signal?: GenericAbortSignal,
) {
  return get({
    url: '/chat/svc/friend/customers',
    params: { userId, createTime, requestStatus },
    signal: signal,
  })
}

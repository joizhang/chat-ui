export interface ChatSession {
  id: string // senderId + receiverId or friendId + userId
  userId: string
  friendId: string
  username: string
  phone: string
  avatar: string
  title: string
  lastChatTime: string
  active: boolean
}

export interface ChatMessage {
  id: string // messageId
  senderId: string
  receiverId: string
  seqNum: string
  content: string
  contentType: number
  createTime: string
  inversion: boolean
  error: string
  loading: boolean
  ack: boolean
}

export interface ChatConfig {
  id: string // userId
  serverStubId: string
}

export interface ChatFriend {
  id: string // userId + friendId
  userId: string
  friendId: string
  username: string
  phone: string
  avatar: string
  createTime: string
}

export interface FriendRequest {
  userId: string
  friendId: string
  remark: string
  requestStatus: string
  seqNum: string
}

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
  contentSubtype: number
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
  updateTime: string
}

export interface PendingChatFriend {
  id: string // userId + friendId
  userId: string // senderId
  friendId: string // receiverId
  username: string // sender username
  phone: string // sender phone
  avatar: string // sender avatar
  createTime: string // Request create time
  updateTime: string // Request update time
}

export interface ChatCommunity {
  id: string // communityId
  communityName: string
  avatar: string
  description: string
  adminId: string
  memberId: string // userId
  createTime: string
  updateTime: string
}

export interface FriendRequest {
  userId: string
  friendId: string
  remark: string
  requestStatus: number
  seqNum: string
}

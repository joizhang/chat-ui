import website from '@/config/website'
import Dexie, { Table } from 'dexie'

export interface ChatList {
  id: string
  userId: number
  friendId: number
  username: string
  phone: string
  avatar: string
  title: string
  lastChatTime: number
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  contentType: number
  createTime: string
  inversion: boolean
  error: string
  loading: boolean
}

export interface ChatConfig {
  id: string
  serverStubId: string
}

export class MySubClassedDexie extends Dexie {
  // 'ChatList' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  chatList!: Table<ChatList>
  chatMessage!: Table<ChatMessage>
  chatConfig!: Table<ChatConfig>

  constructor() {
    super(website.db.name)
    this.version(website.db.version).stores({
      chatList: 'id, userId, friendId, lastChatTime', // Primary key and indexed props
      chatMessage: 'id, [senderId+receiverId]',
      chatConfig: 'id',
    })
  }
}

export const db = new MySubClassedDexie()
// db.version(website.db.version).stores(website.db.stores)

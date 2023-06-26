import website from '@/config/website'
import Dexie, { Table } from 'dexie'
import type { ChatSession, ChatMessage, ChatConfig, ChatFriend, PendingChatFriend } from '#/db'

export class MySubClassedDexie extends Dexie {
  // 'ChatList' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  chatSession!: Table<ChatSession>
  chatMessage!: Table<ChatMessage>
  chatConfig!: Table<ChatConfig>
  chatFriend!: Table<ChatFriend>
  pendingChatFriend!: Table<PendingChatFriend>

  constructor() {
    super(website.db.name)
    this.version(website.db.version).stores({
      chatSession: 'id, userId, friendId, lastChatTime', // Primary key and indexed props
      chatMessage: 'id, [senderId+receiverId]',
      chatConfig: 'id',
      chatFriend: 'id, userId',
      pendingChatFriend: 'id, userId, friendId',
    })
  }
}

export const db = new MySubClassedDexie()
// db.version(website.db.version).stores(website.db.stores)

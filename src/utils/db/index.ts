import website from '@/config/website'
import Dexie, { Table } from 'dexie'
import {ChatSession, ChatMessage, ChatConfig} from '#/types/db'

export class MySubClassedDexie extends Dexie {
  // 'ChatList' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  chatSession!: Table<ChatSession>
  chatMessage!: Table<ChatMessage>
  chatConfig!: Table<ChatConfig>

  constructor() {
    super(website.db.name)
    this.version(website.db.version).stores({
      chatSession: 'id, userId, friendId, lastChatTime', // Primary key and indexed props
      chatMessage: 'id, [senderId+receiverId]',
      chatConfig: 'id',
    })
  }
}

export const db = new MySubClassedDexie()
// db.version(website.db.version).stores(website.db.stores)

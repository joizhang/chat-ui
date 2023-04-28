import { defineStore } from 'pinia'
import { getLocalChatState, setLocalChatState } from './helper'
// import router from '@/router'

/**
 * @deprecated
 */
export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalChatState(),

  getters: {},

  actions: {
    //// ServerStubId API

    setServerStubId(messageId: string) {
      this.serverStubId = messageId
      this.recordState()
    },

    //// ChatList API

    getChatSession(key: string): Chat.ChatSession | null {
      // const chatList = this.$state.chatList
      const value = this.chatList.get(key)
      if (!value) return null
      // Small hack to re-order keys: we remove the requested key and place it at the end
      this.chatList.delete(key)
      this.chatList.set(key, value)
      return value
    },

    putChatSession(key: string, value: Chat.ChatSession) {
      // remove last element to avoid overflow, only if it does not have the inserted key is a new key
      if (this.chatList.size >= this.chatListCapacity && !this.chatList.has(key)) {
        const firstKey = this.chatList.keys().next().value
        this.chatList.delete(firstKey)
      }
      // Small hack to re-order keys: we remove the requested key and place it at the end
      this.chatList.delete(key)
      this.chatList.set(key, value)
      this.recordState()
    },

    hasChatSession(key: string): boolean {
      // const chatList = this.$state.chatList
      return this.chatList.has(key)
    },

    recordState() {
      setLocalChatState(this.$state)
    },
  },
})

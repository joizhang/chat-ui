import { useChatStore } from '@/store/chat'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: number, chat: Chat.Message) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Message) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatSome = (uuid: number, index: number, chat: Partial<Chat.Message>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatSome,
    getChatByUuidAndIndex,
  }
}

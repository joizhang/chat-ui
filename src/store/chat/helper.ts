import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'

export function defaultChatState(): Chat.ChatState {
  // const uuid = 1002
  return {
    active: -1,
    // usingContext: true,
    chatListCapacity: 100,
    chatList: null,
    // chatHistory: [],
    serverStubId: '0',
  }
}

export function getLocalChatState(): Chat.ChatState {
  let localChatState: Chat.ChatState | undefined = ss.get(LOCAL_NAME, false)
  if (!localChatState) {
    localChatState = defaultChatState()
  }
  if (localChatState.chatList) {
    localChatState.chatList = new Map(JSON.parse(localChatState.chatList))
  } else {
    localChatState.chatList = new Map()
  }
  return { ...localChatState }
}

export function setLocalChatState(state: Chat.ChatState): void {
  const chatList = state.chatList
  state.chatList = JSON.stringify(Array.from(chatList.entries()))
  ss.set(LOCAL_NAME, state, null, false)
  state.chatList = chatList
}

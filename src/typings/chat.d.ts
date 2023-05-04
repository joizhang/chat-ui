declare namespace Chat {
  interface Message {
    dateTime: string
    text: string
    inversion?: boolean
    error?: boolean
    loading?: boolean
    // conversationOptions?: ConversationRequest | null
    // requestOptions: { prompt: string; options?: ConversationRequest | null }
  }

  /** 会话 */
  interface ChatSession {
    friendId: string
    username: string
    phone: string
    avatar: string
    title: string
  }

  interface ChatState {
    // 当前活跃的聊天
    active: number
    // 会话列表最大限度
    // chatListCapacity: number
    // 会话列表
    // chatList: any
    // 聊天记录
    // chatHistory: { uuid: number; data: Message[] }[]
    // 服务器存根ID
    serverStubId: string
  }
}

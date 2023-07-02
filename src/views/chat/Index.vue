<template>
  <v-sheet v-if="dataLoading" class="w-100 h-100 d-flex flex-column" style="background-color: #f0f2f5">
    <div class="ma-auto text-center w-25">
      <v-icon icon="mdi-vector-bezier" size="60" class="mb-6 text-grey" />
      <v-progress-linear indeterminate color="#d4a27f"></v-progress-linear>
      <p class="mt-3">VectorLinger</p>
    </div>
  </v-sheet>

  <v-container v-else class="h-100" style="min-height: 512px">
    <v-row class="h-100 ma-0">
      <v-col cols="8" sm="12" class="h-100 pa-0">
        <v-card class="h-100">
          <v-container class="h-100 pa-0">
            <v-row no-gutters class="h-100">
              <v-col cols="4" class="h-100">
                <chat-nav
                  :chat-map="chatMap"
                  :chat-friends="chatFriends"
                  @popup-message="handlePopupMessage"
                  @add-friend="handleAddFriend"
                  @select-friend="handleSelectFriend"
                ></chat-nav>
              </v-col>
              <v-col cols="8" class="h-100 overflow-hidden">
                <chat-room
                  :connected="connected"
                  :current-user="currentUser"
                  :chat-messages="chatMessages"
                  @popup-message="handlePopupMessage"
                  @add-friend="handleAddFriend"
                  @send-message="handleSendMessage"
                  @close-chat="handleCloseChat"
                ></chat-room>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="chatSnackbar" location="top">
    {{ errorMsg }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="chatSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { DateTime } from 'luxon'
  import { checkToken, refreshToken } from '@/api/auth/account'
  import { retrieveCustomerInfo } from '@/api/chat/customer'
  import { addFriendRequest, getCustomersByFriends } from '@/api/chat/friend'
  import { getMessageHistory } from '@/api/chat/message'
  import { getCommunities } from '@/api/chat/community'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'
  import { db } from '@/utils/db'
  import website from '@/config/website'
  import ChatNav from '@/components/ChatNav/index.vue'
  import ChatRoom from '@/components/ChatRoom/index.vue'
  import { ChatMessage, ChatSession, ChatFriend, PendingChatFriend, ChatCommunity, FriendRequest } from '#/db'

  const halfAnHour = 30 * 60 * 1000

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  const dataLoading = ref(true)
  const connected = ref(true)
  // 联系人列表
  const chatFriends = ref<Array<ChatFriend>>([])
  // 群聊列表
  const chatCommunities = ref<Array<ChatCommunity>>([])
  // 使用Map实现LRU缓存
  const chatMap = ref(new Map<string, ChatSession>())
  // 当前聊天对象
  const currentUser = ref<ChatSession>()
  // 聊天记录
  const chatMessages = ref<Array<ChatMessage>>([])
  // 在途消息
  const inflightMessages = ref(new Map<string, ChatMessage>())
  // 错误信息弹出框
  const chatSnackbar = ref(false)
  const errorMsg = ref('')
  // socket连接
  var socket: any = null

  /**
   * Asynchronously checks if the token has expired and renews it if necessary.
   *
   * @return {Promise<void>} Returns nothing.
   */
  async function checkTokenExpire() {
    try {
      const checkRes: any = await checkToken(authStore.access_token ?? '')
      // console.log(res)
      const expire = checkRes && checkRes.exp
      if (expire) {
        const expiredPeriod = expire * 1000 - new Date().getTime()
        console.log('当前token过期时间', expiredPeriod, '毫秒')
        // 小于半小时自动续约
        if (expiredPeriod < halfAnHour) {
          const refreshRes: any = await refreshToken(authStore.refresh_token)
          authStore.updateAuthInfo(refreshRes)
        }
      }
    } catch (err) {
      // console.log(err)
      authStore.removeAuthInfo()
      // userStore.removeUserInfo()
      router.push('/login')
    }
  }

  /**
   * Retrieves customer information and updates user store with it.
   *
   * @return {Promise<void>} A promise that resolves when the user info is stored.
   */
  async function getAndStoreUserInfo() {
    if (!authStore.access_token) return
    try {
      const res = await retrieveCustomerInfo()
      // console.log(res)
      userStore.updateUserInfo(res.data.chatCustomer)
    } catch (err: any) {
      errorMsg.value = err.message
      chatSnackbar.value = true
    }
  }

  /**
   * Initializes a WebSocket connection with the server.
   *
   * @return {void}
   */
  async function initWebsocket() {
    if (!authStore.access_token) return
    if (socket) return
    socket = new WebSocket(website.wsBaseUrl + '?access_token=' + authStore.access_token)
    // Connection opened
    socket.onopen = () => {
      connected.value = true
    }
    // Listen for messages
    socket.onmessage = async (event: any) => {
      // console.log('Message ', event)
      try {
        const message = JSON.parse(event.data)
        if (message.contentType === website.contentType.ERROR) {
          // 处理异常消息提醒
          errorMsg.value = message.content
          chatSnackbar.value = true
        } else if (message.contentType === website.contentType.FRIEND_REQ) {
          // console.log(message)
          // debugger
          // 处理好友请求
          if (message.contentSubtype === website.requestStatus.PENDING) {
            // 展示好友请求
            // message.content = 'Pending friend request.'
            // 同步待处理的好友
            await syncPendingFriends()
          } else if (message.contentSubtype === website.requestStatus.ACCEPTED) {
            // 同意之后，好友请求转为普通文本消息
            // message.content = "We are friends now, let's start chatting."
            // message.contentType = website.contentType.TOOLTIP
            // 同步最新的好友
            await syncFriends()
            // 设置联系人列表
            await setFriends()
          }

          const chatMapKey = `${message.senderId}_${message.receiverId}`
          if (!chatMap.value.has(chatMapKey)) {
            await storeChatSessions([message])
            const chatSessionFromDB = await db.chatSession.get({ id: chatMapKey })
            if (chatSessionFromDB) {
              chatMap.value.set(chatMapKey, chatSessionFromDB)
            }
          } else {
            const curChatSession = chatMap.value.get(chatMapKey)!
            curChatSession.lastChatTime = message.createTime
            curChatSession.title = message.content
          }
          // setChatMap()
          storeMessages([message])
          updateUserServerStubId([message])
        } else if (message.contentType === website.contentType.ACK) {
          // 处理ACK
          const messageKey = message.content
          // console.log(message.content)
          if (inflightMessages.value.has(messageKey)) {
            const msg: ChatMessage = inflightMessages.value.get(messageKey)!
            inflightMessages.value.delete(messageKey)
            msg.id = message.id
            msg.loading = false
            msg.ack = true
            storeMessages([msg])
            updateUserServerStubId([msg])
          }
        } else {
          // 处理普通消息
          // 更新chatMap
          const chatMapKey = `${message.senderId}_${message.receiverId}`
          if (!chatMap.value.has(chatMapKey)) {
            await storeChatSessions([message])
            const chatSessionFromDB = await db.chatSession.get({ id: chatMapKey })
            if (chatSessionFromDB) {
              chatMap.value.set(chatMapKey, chatSessionFromDB)
            }
          } else {
            const curChatSession = chatMap.value.get(chatMapKey)!
            chatMap.value.delete(chatMapKey)
            curChatSession.lastChatTime = message.createTime
            curChatSession.title = message.content
            chatMap.value.set(chatMapKey, curChatSession)
            // 更新DB
            const chatSessionFromDB = await db.chatSession.get(curChatSession.id)
            if (chatSessionFromDB) {
              chatSessionFromDB.lastChatTime = message.createTime
              chatSessionFromDB.title = message.content
              db.chatSession.put(chatSessionFromDB)
            }
          }
          // 更新chatMessages
          // console.log(currentUser.value?.friendId, message.receiverId)
          if (currentUser.value && currentUser.value.friendId != message.receiverId) {
            chatMessages.value.push(message)
          }
          // setChatMap()
          storeMessages([message])
          updateUserServerStubId([message])
        }
      } catch (error: any) {
        errorMsg.value = error.message
        chatSnackbar.value = true
      }
    }
    socket.onclose = (event: any) => {
      console.log('Close', event)
      connected.value = false
    }
    socket.onerror = (event: any) => {
      console.log('Error', event)
      connected.value = false
      errorMsg.value = 'Connection to server failed'
      chatSnackbar.value = true
    }
  }

  async function syncPendingFriends() {
    if (!socket) return
    try {
      const userId = userStore.id
      const pendingChatFriendsFromDB = await db.pendingChatFriend.where({ friendId: userId }).toArray()
      pendingChatFriendsFromDB.sort((a, b) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      })
      let createTime = null
      if (pendingChatFriendsFromDB.length > 0) {
        createTime = pendingChatFriendsFromDB[pendingChatFriendsFromDB.length - 1].createTime
      }
      const res = await getCustomersByFriends(userId, createTime, website.requestStatus.PENDING)
      const pendingFriends = (res.data as any[]) ?? []
      if (pendingFriends.length === 0) {
        return
      }
      const pendingChatFriendsToStore = []
      for (let pendingFriend of pendingFriends) {
        const pendingChatFriend: PendingChatFriend = {
          id: `${pendingFriend.id}_${userId}`,
          userId: pendingFriend.id,
          friendId: userId,
          username: pendingFriend.username,
          phone: pendingFriend.phone,
          avatar: pendingFriend.avatar,
          createTime: pendingFriend.createTime,
          updateTime: pendingFriend.updateTime,
        }
        pendingChatFriendsToStore.push(pendingChatFriend)
      }
      await db.pendingChatFriend.bulkAdd(pendingChatFriendsToStore)
    } catch (error: any) {
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  async function syncFriends() {
    if (!socket) return
    try {
      const userId = userStore.id
      const chatFriendsFromDB = await db.chatFriend.where({ userId: userId }).toArray()
      chatFriendsFromDB.sort((a, b) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      })
      // console.log(chatFriendsFromDB)
      let createTime = null
      if (chatFriendsFromDB.length > 0) {
        createTime = chatFriendsFromDB[chatFriendsFromDB.length - 1].createTime
      }
      const res = await getCustomersByFriends(userId, createTime, website.requestStatus.ACCEPTED)
      const friends = (res.data as any[]) ?? []
      if (friends.length === 0) {
        return
      }
      const chatFriendsToStore = []
      for (let friend of friends) {
        const chatFriend: ChatFriend = {
          id: `${userId}_${friend.id}`,
          userId: userId,
          friendId: friend.id,
          username: friend.username,
          phone: friend.phone,
          avatar: friend.avatar,
          createTime: friend.createTime,
          updateTime: friend.updateTime,
        }
        chatFriendsToStore.push(chatFriend)
      }
      await db.chatFriend.bulkAdd(chatFriendsToStore)
      // console.log(res2)
    } catch (error: any) {
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  /**
   * Sets the chat friends for the user by querying the database.
   *
   * @return {Promise} A promise that resolves with the chat friends array.
   */
  async function setFriends() {
    const userId = userStore.id
    const chatFriendsFromDB = await db.chatFriend.where({ userId }).toArray()
    // console.log(chatFriendsFromDB)
    chatFriends.value = chatFriendsFromDB
  }

  /**
   * Synchronizes the communities data with the server.
   *
   * @return {Promise<void>} Resolves when the synchronization is complete.
   */
  async function syncCommunities() {
    if (!socket) return
    try {
      const userId = userStore.id
      const chatCommunitiesFromDB = await db.chatCommunity.where({ memberId: userId }).toArray()
      chatCommunitiesFromDB.sort((a, b) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      })
      // console.log(chatFriendsFromDB)
      let createTime = null
      if (chatCommunitiesFromDB.length > 0) {
        createTime = chatCommunitiesFromDB[chatCommunitiesFromDB.length - 1].createTime
      }
      const res = await getCommunities(userId, createTime)
      const communities = (res.data as any[]) ?? []
      if (communities.length === 0) {
        return
      }
      const chatCommunitiesToStore = []
      for (let community of communities) {
        const chatCommunity: ChatCommunity = {
          id: community.id,
          communityName: community.communityName,
          avatar: community.avatar,
          description: community.description,
          adminId: community.adminId,
          memberId: userId,
          createTime: community.createTime,
          updateTime: community.updateTime,
        }
        chatCommunitiesToStore.push(chatCommunity)
      }
      await db.chatCommunity.bulkAdd(chatCommunitiesToStore)
    } catch (error: any) {
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  /**
   * Sets the chat communities for the user.
   *
   * @return {Promise<void>} - A Promise that resolves once the chat communities are set.
   */
  async function setCommunities() {
    const userId = userStore.id
    const chatCommunitiesFromDB = await db.chatCommunity.where({ memberId: userId }).toArray()
    chatCommunities.value = chatCommunitiesFromDB
  }

  /**
   * Asynchronously retrieves the message history for the current user from the server.
   *
   * @return {Promise<Array<any>>} Returns a promise that resolves with an array of message history entries.
   */
  async function syncMessages(): Promise<Array<any>> {
    if (!socket) return []
    try {
      const userId = userStore.id
      const chatConfig = await db.chatConfig.get({ id: userId })
      const serverStubId = chatConfig ? chatConfig.serverStubId : '0'
      const res: any = await getMessageHistory(serverStubId)
      return res.data ?? []
    } catch (error: any) {
      chatSnackbar.value = true
      errorMsg.value = error.message
      return []
    }
  }

  /**
   * Asynchronously stores chat sessions.
   *
   * @param {Array<any>} messageHistory - An array of message history.
   * @return {Promise<void>} A promise that resolves when the chat sessions have been stored.
   */
  async function storeChatSessions(messageHistory: Array<any>) {
    if (messageHistory.length === 0) return
    // debugger
    const userId = userStore.id
    const messageMap = new Map<string, string>()
    for (let i = 0; i < messageHistory.length; i++) {
      const message = messageHistory[i]
      messageMap.set(message.senderId, message)
    }
    // const senderIds = messageMap.keys()
    // console.log(new Set(senderIds))
    try {
      // 从本地联系人中获取信息
      // const res = await getCustomersByIds(Array.from(senderIds))
      // const senders = res.data
      const chatSessions = []
      for (let entry of messageMap.entries()) {
        const senderId = entry[0]
        const message: any = entry[1]
        let sender = null
        if (
          message.contentType === website.contentType.FRIEND_REQ &&
          message.contentSubtype === website.requestStatus.PENDING
        ) {
          sender = await db.pendingChatFriend.get({ id: `${senderId}_${userId}` })
        } else {
          sender = await db.chatFriend.get({ id: `${userId}_${senderId}` })
        }
        // console.log(sender)
        if (!sender) {
          continue
        }
        // console.log(sender.id)
        let id = ''
        let friendId = ''

        if (
          message.contentType === website.contentType.FRIEND_REQ &&
          message.contentSubtype === website.requestStatus.PENDING
        ) {
          // 待处理的好友请求的Sender来自PendingChatFriend
          id = `${sender.userId}_${userId}`
          friendId = sender.userId
        } else {
          // 其他消息的Sender来自ChatFriend
          id = `${sender.friendId}_${userId}`
          friendId = sender.friendId
        }
        const chatSession = {
          id: id,
          userId: userId,
          friendId: friendId,
          username: sender.username,
          phone: sender.phone,
          avatar: sender.avatar,
          title: message.content,
          lastChatTime: message.createTime,
          active: false,
        }
        chatSessions.push(chatSession)
      }
      await db.chatSession.bulkPut(chatSessions)
    } catch (error: any) {
      // console.log(error)
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  async function setChatMap() {
    const userId = userStore.id
    const chatSessionsFromDB = await db.chatSession.where({ userId: userId }).toArray()
    // 按照上次聊天时间升序排序
    chatSessionsFromDB.sort((a, b) => {
      return new Date(a.lastChatTime).getTime() - new Date(b.lastChatTime).getTime()
    })
    for (let curChat of chatSessionsFromDB) {
      chatMap.value.set(curChat.id, curChat)
    }
  }

  /**
   * Asynchronously stores chat messages in the database.
   *
   * @param {Array} messageHistory - An array of messages to be stored
   */
  async function storeMessages(messageHistory: Array<any>) {
    if (messageHistory.length === 0) return
    const userId = userStore.id
    for (let message of messageHistory) {
      if (message.contentType === website.contentType.ERROR || message.contentType === website.contentType.ACK) {
        continue
      }
      db.chatMessage.put({
        ...message,
        inversion: message.senderId === userId,
        error: '',
        loading: false,
        ack: true,
      })
    }
  }

  /**
   * Updates the server stub ID of the logged-in user in the database based on
   * the last message sent by the user.
   *
   * @param {Array<any>} messageHistory - An array of messages sent by the user
   */
  async function updateUserServerStubId(messageHistory: Array<any>) {
    if (messageHistory.length === 0 || !userStore.id) return
    const lastMessage = messageHistory[messageHistory.length - 1]
    db.chatConfig.put({
      id: userStore.id,
      serverStubId: lastMessage.id,
    })
  }

  async function handleAddFriend(friendRequestData: FriendRequest) {
    if (
      friendRequestData.requestStatus !== website.requestStatus.ACCEPTED &&
      friendRequestData.requestStatus !== website.requestStatus.PENDING
    ) {
      return
    }

    try {
      const res = await addFriendRequest(friendRequestData)
      if (res.code === 1) {
        errorMsg.value = res.msg ?? ''
        chatSnackbar.value = true
      } else {
        let content: string
        if (friendRequestData.requestStatus === website.requestStatus.PENDING) {
          content = 'Pending Friend Request'
        } else {
          content = "We are friends now, let's start chatting."
        }
        const message: ChatMessage = {
          id: '',
          senderId: friendRequestData.userId,
          receiverId: friendRequestData.friendId,
          seqNum: friendRequestData.seqNum,
          content: content,
          contentType: website.contentType.FRIEND_REQ,
          contentSubtype: friendRequestData.requestStatus,
          createTime: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
          inversion: true,
          error: '',
          loading: true,
          ack: false,
        }
        handleSendMessage(message)

        if (friendRequestData.requestStatus === website.requestStatus.ACCEPTED) {
          await syncFriends()
          await setFriends()
        }
      }
    } catch (error: any) {
      errorMsg.value = error.message
      chatSnackbar.value = true
    }
  }

  /**
   * Updates the value of errorMsg and sets chatSnackbar to true to display the message as a snackbar.
   *
   * @param {string} message - The message to be displayed in the snackbar.
   */
  function handlePopupMessage(message: string) {
    errorMsg.value = message
    chatSnackbar.value = true
  }

  async function handleSelectFriend(chatSession: ChatSession, prepend: boolean) {
    // console.log(chatSession)
    const userId = userStore.id
    currentUser.value = chatSession
    try {
      // console.log(chatSession, prepend)
      if (!chatMap.value.has(chatSession.id)) {
        chatMap.value.set(chatSession.id, chatSession)
        const chatSessionToStore = { ...chatSession, active: false }
        db.chatSession.add(chatSessionToStore)
      } else {
        if (prepend) {
          chatMap.value.delete(chatSession.id)
          chatMap.value.set(chatSession.id, chatSession)
        } else {
          chatMap.value.set(chatSession.id, chatSession)
        }
      }

      // 更新消息列表
      let chatMessagesFromDb = []
      if (chatSession.friendId === userId) {
        chatMessagesFromDb = await db.chatMessage
          .where({ senderId: userId, receiverId: chatSession.friendId })
          .toArray()
      } else {
        const chatMessages1 = await db.chatMessage
          .where({ senderId: userId, receiverId: chatSession.friendId })
          .toArray()
        const chatMessages2 = await db.chatMessage
          .where({ senderId: chatSession.friendId, receiverId: userId })
          .toArray()
        chatMessagesFromDb = [...chatMessages1, ...chatMessages2]
      }
      chatMessagesFromDb.sort((a: any, b: any) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      })
      // console.log('选择好友', chatMessagesFromDb)
      chatMessages.value = chatMessagesFromDb
    } catch (error) {
      console.log(error)
    }
  }

  async function handleSendMessage(messageToSend: ChatMessage) {
    // 更新chatMap
    const chatMapKey = `${messageToSend.receiverId}_${messageToSend.senderId}`
    if (chatMap.value.has(chatMapKey)) {
      const curChatSession = chatMap.value.get(chatMapKey)!
      chatMap.value.delete(chatMapKey)
      curChatSession.lastChatTime = messageToSend.createTime
      curChatSession.title = messageToSend.content
      chatMap.value.set(chatMapKey, curChatSession)
      // 更新 chatSession DB
      const chatSessionFromDB = await db.chatSession.get(curChatSession.id)
      if (chatSessionFromDB) {
        chatSessionFromDB.lastChatTime = messageToSend.createTime
        chatSessionFromDB.title = messageToSend.content
        db.chatSession.put(chatSessionFromDB)
      }
    }
    // 发送消息
    const message = {
      senderId: messageToSend.senderId,
      receiverId: messageToSend.receiverId,
      seqNum: messageToSend.seqNum,
      content: messageToSend.content,
      contentType: messageToSend.contentType,
      contentSubtype: messageToSend.contentSubtype,
    }
    const messageKey = `${messageToSend.senderId}_${messageToSend.receiverId}_${messageToSend.seqNum}`
    inflightMessages.value.set(messageKey, messageToSend)
    if (currentUser.value && currentUser.value.friendId === message.receiverId) {
      chatMessages.value.push(messageToSend)
    }
    socket.send(JSON.stringify(message))
  }

  /**
   * Close the current chat
   *
   * @return {void}
   */
  function handleCloseChat() {
    chatMessages.value = []
    currentUser.value = undefined
  }

  onMounted(async () => {
    dataLoading.value = true

    // 检查token是否过期
    await checkTokenExpire()
    // 查询登陆用户信息
    await getAndStoreUserInfo()

    // 初始化Websocket
    await initWebsocket()

    // 同步待处理的好友
    await syncPendingFriends()
    // 同步最新的好友
    await syncFriends()
    // 设置联系人列表
    await setFriends()

    // 同步最新的群聊
    await syncCommunities()
    // 设置群聊列表
    await setCommunities()

    // 同步最新的消息
    const messageHistory: Array<any> = await syncMessages()

    // 持久化并更新会话列表
    await storeChatSessions(messageHistory)
    // 设置会话列表
    await setChatMap()

    // 持久化消息
    await storeMessages(messageHistory)
    // 更新用户存根ID
    await updateUserServerStubId(messageHistory)

    setTimeout(() => {
      dataLoading.value = false
    }, 1000)
  })

  onUnmounted(() => {
    if (socket) {
      socket.close()
    }
    if (currentUser.value) {
      currentUser.value = undefined
    }
  })
</script>

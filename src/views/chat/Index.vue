<template>
  <v-container class="h-100">
    <v-row class="h-100" justify="center">
      <v-col cols="8" sm="12" class="h-100">
        <v-card class="h-100">
          <v-container class="h-100" style="padding: 0">
            <v-row no-gutters class="h-100">
              <v-col cols="4" class="h-100">
                <chat-navigation
                  :chat-map="chatMap"
                  @popup-message="handlePopupMessage"
                  @add-friend="handleAddFriend"
                  @select-friend="handleSelectFriend"
                ></chat-navigation>
              </v-col>
              <v-col cols="8" class="h-100 overflow-hidden">
                <chat-room
                  :connected="connected"
                  :current-user="currentUser"
                  :chat-messages="chatMessages"
                  @send-message="handleSendMessage"
                  @popup-message="handlePopupMessage"
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
  // import type { ChatSession } from  '@/typings'
  import { checkToken, refreshToken } from '@/api/auth/account'
  import { addFriendRequest, getSenders } from '@/api/chat/friend'
  import { getMessageHistory } from '@/api/message/one'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'
  import { db } from '@/utils/db'
  import website from '@/config/website'
  import ChatNavigation from '@/components/ChatNavigation/index.vue'
  import ChatRoom from '@/components/ChatRoom/index.vue'
  import { DateTime } from 'luxon'

  const halfAnHour = 30 * 60 * 1000

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  const dataLoading = ref(true)
  const connected = ref(true)
  // 使用Map实现LRU缓存
  const chatMap = ref(new Map<string, Object>())
  // 当前聊天对象
  const currentUser = ref({})
  // 聊天记录
  const chatMessages = ref([])
  // 在途消息
  const inflightMessage = ref(new Map<string, any>())
  // 错误信息弹出框
  const chatSnackbar = ref(false)
  const errorMsg = ref('')

  var socket: any = null

  async function checkTokenExpire() {
    try {
      const checkRes: any = await checkToken(authStore.accessToken ?? '')
      // console.log(res)
      const expire = checkRes && checkRes.exp
      if (expire) {
        const expiredPeriod = expire * 1000 - new Date().getTime()
        console.log('当前token过期时间', expiredPeriod, '毫秒')
        // 小于半小时自动续约
        if (expiredPeriod < halfAnHour) {
          const refreshRes: any = await refreshToken(userStore.refresh_token)
          authStore.setAccessToken(refreshRes.access_token)
          userStore.updateUserInfo(refreshRes)
        }
      }
    } catch (err) {
      // console.log(err)
      authStore.removeAccessToken()
      userStore.removeUserInfo()
      router.push('/login')
    }
  }

  async function initWebsocket() {
    if (!authStore.accessToken) return
    if (socket) return
    socket = new WebSocket(website.wsBaseUrl + '?access_token=' + authStore.accessToken)
    // Connection opened
    socket.onopen = () => {
      connected.value = true
    }
    // Listen for messages
    socket.onmessage = async (event: any) => {
      console.log('Message ', event)
      try {
        const message = JSON.parse(event.data)
        if (message.contentType === website.contentType.ERROR) {
          // 处理异常消息提醒
          errorMsg.value = message.content
          chatSnackbar.value = true
        } else if (message.contentType === website.contentType.FRIEND_REQ) {
          // 处理好友请求
          if (message.content === '1') {
            // 展示好友请求
            message.content = 'Pending friend request.'
          } else if (message.content === '2') {
            // 同意之后，好友请求转为普通文本消息
            message.contentType = 2
            message.content = "We are friends now, let's start chatting."
          }
          const key = `${message.senderId}_${message.receiverId}`
          if (!chatMap.value.has(key)) {
            await storeChatList([message])
            const chatFromDB = db.chatList.get({id: key})
            chatMap.value.set(key, chatFromDB)
          } else {
            const curChat = chatMap.value.get(key)
            curChat.lastChatTime = message.createTime
            curChat.title = message.content
          }
          // setChatMap()
          storeMessageHistory([message])
          updateUserServerStubId([message])
        } else if (message.contentType === website.contentType.ACK) {
          // TODO 处理消息ACK
        } else {
          if (!chatMap.value.has(message.senderId)) {
            storeChatList([message])
          }
          // setChatMap()
          storeMessageHistory([message])
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

  async function syncMessage(): Promise<Array<any>> {
    if (!socket) return []
    try {
      const userId = userStore.user_info.id
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

  async function storeChatList(messageHistory: Array<any>) {
    if (messageHistory.length === 0) return
    const messageMap = new Map<string, string>()
    for (let i = 0; i < messageHistory.length; i++) {
      const message = messageHistory[i]
      messageMap.set(message.senderId, message)
    }
    const senderIds = messageMap.keys()
    // console.log(new Set(senderIds))
    try {
      // TODO 修改为从本地联系人中获取信息
      const res = await getSenders(Array.from(senderIds))
      const senders = res.data
      const chatListTemp = []
      for (let entry of messageMap.entries()) {
        const senderId = entry[0]
        const message: any = entry[1]
        for (let sender of senders) {
          if (sender.id === senderId) {
            // console.log(sender.id)
            let title = message.content
            if (message.contentType === 5) {
              title = 'Friend Request'
            }
            const chatSession = {
              id: `${sender.id}_${userStore.user_info.id}`,
              userId: userStore.user_info.id,
              friendId: sender.id,
              username: sender.username,
              phone: sender.phone,
              avatar: sender.avatar,
              title: title,
              lastChatTime: message.createTime,
            }
            chatListTemp.push(chatSession)
            continue
          }
        }
      }
      await db.chatList.bulkPut(chatListTemp)
    } catch (error: any) {
      console.log(error)
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  async function setChatMap() {
    const userId = userStore.user_info.id
    const chatListFromDB = await db.chatSession.where({ userId: userId }).toArray()
    // 按照上次聊天时间升序排序
    chatListFromDB.sort((a, b) => {
      return new Date(a.lastChatTime).getTime() - new Date(b.lastChatTime).getTime()
    })
    for (let curChat of chatListFromDB) {
      chatMap.value.set(curChat.id, curChat)
    }
  }

  async function storeMessageHistory(messageHistory: Array<any>) {
    if (messageHistory.length === 0) return
    const userId = userStore.user_info.id
    for (let message of messageHistory) {
      if (message.contentType === website.contentType.ERROR || message.contentType === website.contentType.ACK) {
        continue
      } else if (message.contentType === website.contentType.FRIEND_REQ) {
        if (message.content === website.requestStatus.PENDING) {
          // 展示好友请求
          message.content = 'Pending friend request.'
        } else if (message.content === website.requestStatus.ACCEPTED) {
          // 同意之后，好友请求转为普通文本消息
          message.content = 'We are friends, so we can start chatting.'
          message.contentType = website.contentType.TEXT
        }
      }
      db.chatMessage.put({
        ...message,
        inversion: message.senderId === userId,
        error: '',
        loading: false,
        ack: true
      })
    }
  }

  async function updateUserServerStubId(messageHistory: Array<any>) {
    if (messageHistory.length === 0) return
    const lastMessage = messageHistory[messageHistory.length - 1]
    db.chatConfig.put({
      id: userStore.user_info.id,
      serverStubId: lastMessage.id,
    })
  }

  function handleAddFriend(friendRequestData: any) {
    const messageKey = `${friendRequestData.userId}_${friendRequestData.friendId}_${friendRequestData.seqNum}`
    const message = {
      senderId: friendRequestData.userId,
      receiverId: friendRequestData.friendId,
      content: website.requestStatus.PENDING,
      contentType: website.contentType.FRIEND_REQ,
      createTime: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      inversion: false,
      error: '',
      loading: true,
      ack: false,
    }
    inflightMessage.value.set(messageKey, message)
    addFriendRequest(friendRequestData.value)
      .then((res: any) => {
        if (res.code === 1) {
          errorMsg.value = res.msg
          chatSnackbar.value = true
        }
      })
      .catch((err) => {
        // console.log(err)
        errorMsg.value = err.message
        chatSnackbar.value = true
      })
  }

  function handlePopupMessage(message: string) {
    errorMsg.value = message
    chatSnackbar.value = true
  }

  async function handleSelectFriend(chatSession: any, prepend: boolean = false) {
    const userId = userStore.user_info.id
    currentUser.value = chatSession
    try {
      if (prepend) {
        // chatMap.value.unshift(chatSession)
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

  function handleSendMessage(messageToSend: any) {
    const message = {
      senderId: messageToSend.senderId,
      receiverId: messageToSend.receiverId,
      content: messageToSend.content,
      contentType: messageToSend.contentType,
    }
    socket.send(JSON.stringify(message))
    chatMessages.value.push(messageToSend)
    // console.log('发送消息', message)
  }

  onMounted(async () => {
    dataLoading.value = true
    // 检查token是否过期
    await checkTokenExpire()
    // 初始化Websocket
    await initWebsocket()
    // 同步最新的消息
    const messageHistory = await syncMessage()
    // 持久化并更新会话列表
    await storeChatList(messageHistory)
    // 设置会话列表
    await setChatMap()
    // 持久化消息
    await storeMessageHistory(messageHistory)
    // 更新用户存根ID
    await updateUserServerStubId(messageHistory)
    dataLoading.value = false
  })

  onUnmounted(() => {
    if (socket) {
      socket.close()
    }
    if (currentUser.value) {
      currentUser.value = {}
    }
  })
</script>

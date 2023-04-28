<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col cols="8" offset="2" class="h-100">
        <v-card class="h-100">
          <v-container class="h-100" style="padding: 0">
            <v-row no-gutters class="h-100">
              <v-col cols="4" class="h-100">
                <chat-navigation
                  @popup-message="handlePopupMessage"
                  @add-friend="handleAddFriend"
                  @select-friend="handleSelectFriend"
                ></chat-navigation>
              </v-col>
              <v-col cols="8" class="h-100 overflow-hidden">
                <chat-room
                  :connected="connected"
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
  // import { Chat } from '@/types/chat'
  import { checkToken, refreshToken } from '@/api/auth/account'
  import { addFriendRequest, getSenders } from '@/api/chat/friend'
  import { getMessageHistory } from '@/api/message/one'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'
  import { useChatStore } from '@/store/chat'
  import ChatNavigation from '@/components/ChatNavigation/index.vue'
  import ChatRoom from '@/components/ChatRoom/index.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const chatStore = useChatStore()

  const dataLoading = ref(false)
  const connected = ref(true)
  const chatSnackbar = ref(false)
  const errorMsg = ref('')

  const socketUrl = `${import.meta.env.VITE_APP_WS_BASE_URL}chat/ws/info`
  var socket: any = null

  async function checkTokenExpire() {
    try {
      const resCheck: any = await checkToken(authStore.accessToken ?? '')
      // console.log(res)
      const expire = resCheck && resCheck.exp
      if (expire) {
        const expiredPeriod = expire * 1000 - new Date().getTime()
        console.log('当前token过期时间', expiredPeriod, '毫秒')
        // 小于半小时自动续约
        if (expiredPeriod < 30 * 60 * 1000) {
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
    socket = new WebSocket(socketUrl + '?access_token=' + authStore.accessToken)
    // Connection opened
    socket.onopen = () => {
      connected.value = true
    }
    // Listen for messages
    socket.onmessage = (event: any) => {
      console.log('Message ', event)
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
      const res: any = await getMessageHistory(0)
      return res.data ?? []
    } catch (error: any) {
      chatSnackbar.value = true
      errorMsg.value = error.message
      return []
    }
  }

  async function updateChatList(messageHistory: Array<any>) {
    if (!messageHistory) return
    const messageMap = new Map<string, string>()
    for (let i = 0; i < messageHistory.length; i++) {
      const message = messageHistory[i]
      if (message.contentType === 5) {
        messageMap.set(message.senderId, 'Friend reqeuest')
      } else {
        messageMap.set(message.senderId, message.content)
      }
    }
    const senderIds = messageMap.keys()
    // console.log(new Set(senderIds))
    try {
      const res = await getSenders(Array.from(senderIds))
      const senders = res.data
      // console.log(senders)
      // const chatSessions = []
      for (let entry of messageMap.entries()) {
        for (let sender of senders) {
          if (sender.id === entry[0]) {
            // console.log(sender.id)
            const chatSession = {
              friendId: sender.id,
              username: sender.username,
              phone: sender.phone,
              avatar: sender.avatar,
              title: entry[1],
            }
            chatStore.putChatSession(entry[0], chatSession)
          }
        }
      }
    } catch (error: any) {
      console.log(error)
      chatSnackbar.value = true
      errorMsg.value = error.message
    }
  }

  async function storeMessageHistory(messageHistory: Array<any>) {
    if (!messageHistory) return
  }

  function handleAddFriend(friendRequestData: any) {
    // console.log('添加好友', friendRequestData)
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

  function handleSelectFriend(friend: any) {
    console.log('选择好友', friend)
  }

  function handleSendMessage(message: any) {
    console.log('发送消息', message)
  }

  onMounted(async () => {
    dataLoading.value = true
    await checkTokenExpire()
    await initWebsocket()
    const messageHistory = await syncMessage()
    updateChatList(messageHistory)
    storeMessageHistory(messageHistory)
    dataLoading.value = false
  })

  onUnmounted(() => {
    if (socket) {
      socket.close()
    }
  })
</script>

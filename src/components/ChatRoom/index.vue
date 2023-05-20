<template>
  <v-layout v-if="active" full-height>
    <v-app-bar flat style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="auto" class="me-auto">
            <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
            {{ currentUser!.username }}
          </v-col>
          <v-col cols="auto" class="text-center">
            <v-btn icon="mdi-magnify" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center" color="#54656f">
            <v-btn icon="mdi-dots-vertical" id="chat-room-menu-activator"></v-btn>
            <v-menu activator="#chat-room-menu-activator">
              <v-list width="200">
                <v-list-item link>
                  <v-list-item-title>Contact info</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Select messages</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="onCloseChat">Close chat</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Disappearing message</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Clear message</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Delete chat</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-app-bar flat location="bottom" style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="auto" class="text-center">
            <v-btn icon="mdi-emoticon-happy-outline" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center me-auto">
            <v-btn icon="mdi-attachment" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="8">
            <v-text-field
              ref="inputRef"
              v-model="inputMessage"
              density="comfortable"
              variant="outlined"
              label="Input Message"
              append-inner-icon="mdi-send"
              single-line
              hide-details
              @click:append-inner="handleSubmit"
              @keypress="handleEnter"
            ></v-text-field>
          </v-col>
          <v-col cols="auto" class="text-center">
            <v-btn icon="mdi-microphone" color="#54656f"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-alert
        v-if="!connected"
        type="error"
        position="absolute"
        width="100%"
        variant="tonal"
        text="Network connection failed."
        style="z-index: 1"
      ></v-alert>
      <div id="scrollRef" ref="scrollRef" class="h-100 overflow-hidden overflow-y-auto" style="position: relative">
        <v-container v-if="!chatMessages!.length" class="d-flex justify-center align-center text-h5 h-100">
          Content
        </v-container>
        <v-container v-else style="position: absolute">
          <chat-room-message v-for="(item, index) of chatMessages" :key="index" :message="item" />
        </v-container>
      </div>
    </v-main>
  </v-layout>

  <!-- 未选中用户展示 -->
  <v-layout v-else class="h-100" style="background-color: #f0f2f5"> </v-layout>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue'
  import { computed, onMounted, ref, watch } from 'vue'
  import { DateTime } from 'luxon'
  import { useScroll } from './hooks/useScroll'
  import { useUserStore } from '@/store/user'
  import ChatRoomMessage from '@/components/ChatRoomMessage/index.vue'
  import { ChatMessage } from '#/db'

  const props = defineProps({
    connected: Boolean,
    currentUser: Object,
    chatMessages: Array<ChatMessage>,
  })

  const emit = defineEmits(['popupMessage', 'sendMessage', 'closeChat'])

  const active = computed(() => !!props.currentUser)
  // const route = useRoute()
  const userStore = useUserStore()
  // const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
  const { scrollRef, scrollToBottom } = useScroll()

  const chatMessageLength = computed(() => props.chatMessages!.length)
  const inputMessage = ref<string>('')
  // const loading = ref<boolean>(false)
  const inputRef = ref<Ref | null>(null)

  watch(chatMessageLength, () => {
    scrollToBottom()
  })

  function onCloseChat() {
    emit('closeChat')
  }

  function handleSubmit() {
    onConversation()
  }

  async function onConversation() {
    let message = inputMessage.value
    if (!message || message.trim() === '') {
      return
    }
    // console.log(props.currentUser)
    if (!props.currentUser) {
      emit('popupMessage', 'Invalid chat object')
      return
    }

    const now = DateTime.now()
    const messageToSend: ChatMessage = {
      id: '',
      senderId: userStore.user_info.id,
      receiverId: props.currentUser.friendId,
      seqNum: String(Date.now()),
      content: message,
      contentType: 2,
      createTime: now.toFormat('yyyy-MM-dd HH:mm:ss'),
      inversion: true,
      error: '',
      loading: true,
      ack: false,
    }
    emit('sendMessage', messageToSend)
    // scrollToBottom()
    inputMessage.value = ''
  }

  function handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  onMounted(() => {
    // console.log(Object.keys(props.currentUser).length === 0)
    // scrollToBottom()
    if (inputRef.value) inputRef.value?.focus()
  })
</script>

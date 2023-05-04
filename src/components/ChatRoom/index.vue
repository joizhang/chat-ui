<template>
  <v-layout v-if="active" class="h-100">
    <v-app-bar flat style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
            {{ currentUser.username }}
          </v-col>
          <v-col cols="1" offset="8" class="text-center">
            <v-btn icon="mdi-magnify" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="1" class="text-center" color="#54656f">
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
                  <v-list-item-title>Close chat</v-list-item-title>
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
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-emoticon-happy-outline" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-attachment" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="9">
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
          <v-col cols="1" class="text-center">
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
        <v-container v-if="!chatMessages.length" class="d-flex justify-center align-center text-h5 h-100">
          Content
        </v-container>
        <v-container v-else style="position: absolute">
          <chat-message v-for="(item, index) of chatMessages" :key="index" :message="item" />
        </v-container>
      </div>
    </v-main>
  </v-layout>
  <v-layout v-else class="h-100" style="background-color: #f0f2f5"> </v-layout>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue'
  import { computed, onMounted, ref } from 'vue'
  import { DateTime } from 'luxon'
  // import { useRoute } from 'vue-router'
  // import { storeToRefs } from 'pinia'
  import ChatMessage from '../ChatMessage/index.vue'
  import { useScroll } from './hooks/useScroll'
  import { useChat } from './hooks/useChat'
  import { useUserStore } from '@/store/user'

  const props = defineProps({
    connected: Boolean,
    currentUser: Object,
    chatMessages: Array,
  })

  const emit = defineEmits(['popupMessage', 'sendMessage'])

  const active = computed(() => Object.keys(props.currentUser).length !== 0)
  // const route = useRoute()
  const userStore = useUserStore()
  // const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
  const { scrollRef, scrollToBottom } = useScroll()

  const inputMessage = ref<string>('')
  // const loading = ref<boolean>(false)
  const inputRef = ref<Ref | null>(null)

  function handleSubmit() {
    onConversation()
  }

  function parseDateTime(time: string) {
    const date = new Date(time)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const second = date.getSeconds()
    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`
  }

  async function onConversation() {
    let message = inputMessage.value
    if (!message || message.trim() === '') {
      return
    }
    console.log(props.currentUser)
    if (!props.currentUser) {
      emit('popupMessage', 'Invalid chat object')
      return
    }

    const now = DateTime.now()
    const messageToSend = {
      senderId: userStore.user_info.id,
      receiverId: props.currentUser.friendId,
      content: message,
      contentType: 2,
      createTime: now.toFormat('yyyy-MM-dd HH:mm:ss'),
      error: '',
      inversion: true,
      loading: false,
    }
    emit('sendMessage', messageToSend)
    scrollToBottom()
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
    scrollToBottom()
    if (inputRef.value) inputRef.value?.focus()
  })
</script>

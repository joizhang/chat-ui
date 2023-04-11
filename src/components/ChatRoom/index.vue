<template>
  <v-layout class="h-100">
    <v-app-bar flat style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
          </v-col>
          <v-col cols="1" offset="8" class="text-center">
            <v-btn icon="mdi-magnify" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="1" class="text-center" color="#54656f">
            <v-btn icon="mdi-dots-vertical"></v-btn>
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
            <v-text-field ref="inputRef" v-model="inputMessage" density="comfortable" variant="outlined"
              label="Input Message" append-inner-icon="mdi-send" single-line hide-details
              @click:append-inner="handleSubmit" @keypress="handleEnter"></v-text-field>
          </v-col>
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-microphone" color="#54656f"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <div id="scrollRef" ref="scrollRef" class="h-100 overflow-hidden overflow-y-auto" style="position: relative">
        <!-- <v-container style="position: absolute">
          <v-row v-for="(num, index) of Array.from(Array(50).keys())" :key="index">
            <v-col :justify="index % 2 ===0 ? 'start' : 'end'" :class="index % 2 ===0 ? 'text-left' : 'text-right'">asdasdasdasd {{ index }}</v-col>
          </v-row>
        </v-container> -->
        <v-container v-if="!dataSources.length" class="d-flex justify-center align-center text-h5 h-100">
          Content
        </v-container>
        <v-container v-else style="position: absolute">
          <chat-message  
            v-for="(item, index) of dataSources" 
            :key="index" 
            :date-time="item.dateTime" 
            :text="item.text"
            :inversion="item.inversion" 
            :error="item.error" 
            :loading="item.loading" 
          />
        </v-container>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import ChatMessage from '../ChatMessage/index.vue'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useChatStore } from '@/store/chat'

const route = useRoute()

const chatStore = useChatStore()

const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()

const uuid = 1
const dataSources = computed(() => chatStore.getChatByUuid(+uuid))

const inputMessage = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)

function handleSubmit() {
  onConversation()
}

async function onConversation() {
  let message = inputMessage.value
  if (!message || message.trim() === '') {
    return
  }

  addChat(+uuid, {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  })
  scrollToBottom()
  inputMessage.value = ''
  console.log(dataSources.value)
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.ctrlKey) {
    event.preventDefault()
    handleSubmit()
  }
}

onMounted(() => {
  scrollToBottom()
  if (inputRef.value) inputRef.value?.focus()
})
</script>

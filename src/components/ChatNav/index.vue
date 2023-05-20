<template>
  <v-layout full-height>
    <chat-nav-new-chat
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-new-chat>

    <chat-nav-settings
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-settings>

    <chat-nav-main
      :chat-map="chatMap"
      :nav-model-value="navModelValue"
      @popup-message="handlePopupMessage"
      @add-friend="handleAddFriend"
      @select-friend="handleSelectFriend"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-main>
  </v-layout>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { ChatSession, FriendRequest } from '#/db'
  import ChatNavMain from '@/components/ChatNavMain/index.vue'
  import ChatNavNewChat from '@/components/ChatNavNewChat/index.vue'
  import ChatNavSettings from '@/components/ChatNavSettings/index.vue'

  defineProps({
    chatMap: Map<String, ChatSession>,
  })

  const emit = defineEmits(['popupMessage', 'addFriend', 'selectFriend'])

  const navModelValue = ref(0)

  function handlePopupMessage(message: string) {
    emit('popupMessage', message)
  }

  function handleAddFriend(friendRequestData: FriendRequest) {
    emit('addFriend', friendRequestData)
  }

  function handleSelectFriend(chatSession: ChatSession, prepend: boolean) {
    emit('selectFriend', chatSession, prepend)
  }

  function handleChangeModelValue(modelValue: number) {
    navModelValue.value = modelValue
  }
</script>

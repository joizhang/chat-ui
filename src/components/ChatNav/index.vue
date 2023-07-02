<template>
  <v-layout full-height>
    <!-- 个人资料Drawer -->
    <chat-nav-profile
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
      @popup-message="handlePopupMessage"
    ></chat-nav-profile>

    <!-- 群聊详细信息 -->
    <chat-nav-community
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-community>

    <!-- 群聊列表Drawer -->
    <chat-nav-communities
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-communities>

    <!-- 新建群聊Drawer -->
    <chat-nav-new-community
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
      @popup-message="handlePopupMessage"
    ></chat-nav-new-community>

    <!-- 新建会话和联系人列表Drawer -->
    <chat-nav-new-chat
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      :chat-friends="chatFriends"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-new-chat>

    <!-- 设置Drawer -->
    <chat-nav-settings
      color="#f0f2f5"
      :nav-model-value="navModelValue"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-settings>

    <!-- 搜索和会话列表Drawer -->
    <chat-nav-main
      :nav-model-value="navModelValue"
      :chat-map="chatMap"
      @popup-message="handlePopupMessage"
      @add-friend="handleAddFriend"
      @select-friend="handleSelectFriend"
      @change-model-value="handleChangeModelValue"
    ></chat-nav-main>
  </v-layout>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { ChatFriend, ChatSession, FriendRequest } from '#/db'
  import ChatNavProfile from '@/components/ChatNavProfile/index.vue'
  import ChatNavCommunity from '@/components/ChatNavCommunity/index.vue'
  import ChatNavCommunities from '@/components/ChatNavCommunities/index.vue'
  import ChatNavNewCommunity from '@/components/ChatNavNewCommunity/index.vue'
  import ChatNavNewChat from '@/components/ChatNavNewChat/index.vue'
  import ChatNavSettings from '@/components/ChatNavSettings/index.vue'
  import ChatNavMain from '@/components/ChatNavMain/index.vue'

  defineProps({
    chatMap: Map<String, ChatSession>,
    chatFriends: Array<ChatFriend>,
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

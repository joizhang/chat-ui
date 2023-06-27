<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_NEW_CHAT">
    <v-sheet style="background-color: #cc785c">
      <v-container class="pt-10">
        <v-row>
          <v-col cols="auto">
            <v-btn icon="mdi-keyboard-backspace" color="white" variant="text" @click.stop="handleBack"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center text-white text-h6" style="line-height: 3rem"> New chat </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-text-field
      v-model="searchContactsText"
      density="compact"
      variant="outlined"
      label="Search contacts"
      single-line
      hide-details
      clearable
      class="pd-10-15"
      @click:append-inner="onSearchContacts"
      @click:clear="onClearSearchContactsMessage"
      @keypress="handleSearchContactsEnter"
    >
      <template v-slot:append-inner>
        <v-fade-transition leave-absolute>
          <v-progress-circular v-if="searchLoading" indeterminate :size="22"></v-progress-circular>
          <v-icon v-else icon="mdi-magnify"></v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>

    <v-list>
      <v-list-item link active-color="primary" class="pa-3" @click="onNewCommunity">
        <template v-slot:prepend>
          <v-avatar color="#d4a27f">
            <v-icon icon="mdi-account-group" :size="30" color="white"></v-icon>
          </v-avatar>
        </template>
        <v-list-item-title>New community</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-for="(item, index) of chatFriends"
        :key="index"
        link
        active-color="primary"
        class="pa-3"
        @click="onSelectFriend(item)"
      >
        <template v-slot:prepend>
          <v-avatar color="#d4a27f">
            <v-icon icon="mdi-account" :size="30" color="white"></v-icon>
          </v-avatar>
        </template>
        <v-list-item-title>{{ item.username }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.phone }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import website from '@/config/website'
  import { ChatFriend } from '#/db'

  const props = defineProps({
    navModelValue: Number,
    chatFriends: Array<ChatFriend>,
  })

  const emit = defineEmits(['changeModelValue'])

  const searchContactsText = ref('')
  const searchLoading = ref(false)

  function handleBack() {
    emit('changeModelValue', website.navType.CHAT_NAV)
  }

  function onSearchContacts() {}

  function onClearSearchContactsMessage() {}

  function handleSearchContactsEnter() {}

  function onNewCommunity() {
    // console.log(123)
    console.log(props.chatFriends)
  }

  function onSelectFriend(item: ChatFriend) {
    console.log(item)
  }
</script>

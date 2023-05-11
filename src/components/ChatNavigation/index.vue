<template>
  <v-layout class="h-100">
    <v-app-bar :flat="true" style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
          </v-col>
          <v-col cols="2" offset="6" class="text-center">
            <v-btn icon="mdi-message-text" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="2" class="text-center" color="#54656f">
            <v-menu close-on-content-click>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
              </template>
              <v-list width="200">
                <v-list-item link>
                  <v-list-item-title>New group</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Select chats</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="logOutDialog = true">
                  <v-list-item-title>Log out</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer class="w-100">
      <v-text-field
        v-model="searchText"
        density="compact"
        variant="outlined"
        label="Search or start a new chat"
        single-line
        hide-details
        clearable
        class="pd-10-15"
        @click:append-inner="onSearchCustomer"
        @click:clear="onClearMessage"
        @keypress="handleSearchEnter"
      >
        <template v-slot:append-inner>
          <v-fade-transition leave-absolute>
            <v-progress-circular v-if="searchLoading" indeterminate :size="22"></v-progress-circular>
            <v-icon v-else icon="mdi-magnify"></v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>
      <v-divider></v-divider>
      <!-- 搜索列表 -->
      <v-list v-if="showSearch">
        <v-sheet v-if="!searchedFriends.length">
          <v-list-item active-color="primary" class="text-center mt-6 mb-6">
            {{ searchPromptText }}
          </v-list-item>
          <v-divider></v-divider>
        </v-sheet>
        <v-list-item
          v-for="(item, index) of searchedFriends"
          :key="index"
          link
          active-color="primary"
          class="pa-3"
          @click="onSelectSearchedFriend(item)"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="60" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.phone }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <!-- 会话列表 -->
      <v-list v-else @click:select="onSelectChat">
        <v-list-item v-for="(item, index) of chatList" :key="index" :value="item" link class="pa-3">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="60" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="logOutDialog" width="450">
      <v-card>
        <v-card-title> Log out? </v-card-title>
        <v-card-text> Are you sure you want to log out? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" rounded variant="outlined" @click="logOutDialog = false"> Cancel </v-btn>
          <v-btn color="green-darken-1" rounded variant="flat" @click="handleLogOut"> Log out </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addFriendDialog" width="450">
      <v-card>
        <v-card-title> Add to contacts? </v-card-title>
        <v-card-text>Add to contacts?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" rounded variant="outlined" @click="addFriendDialog = false"> Cancel </v-btn>
          <v-btn color="green-darken-1" rounded variant="flat" @click="handleAddFriend"> Select </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { DateTime } from 'luxon'
  import website from '@/config/website'
  import { logout } from '@/api/auth/account'
  import { searchFriends, checkFriend } from '@/api/chat/friend'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'
  import { ChatSession, FriendRequest } from '#/db'

  const props = defineProps({
    chatMap: Map<String, ChatSession>,
  })

  const emit = defineEmits(['popupMessage', 'addFriend', 'selectFriend'])

  const chatList = computed(() => {
    return Array.from(props.chatMap!.values()).reverse()
  })

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  const searchPromptText = ref('No chats, contacts or messages found')
  const searchedFriends = ref([])
  const page = ref({
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: 20, // 每页显示多少条,
    isAsc: false, //是否倒序
  })
  const searchLoading = ref(false)
  const searchText = ref('')
  // const innerIcon = ref('mdi-magnify')
  const showSearch = ref(false)
  const logOutDialog = ref(false)
  const addFriendDialog = ref(false)
  const friendRequestData = ref<FriendRequest>()

  function handleLogOut() {
    logout()
      .then(() => {
        authStore.removeAccessToken()
        userStore.removeUserInfo()
        logOutDialog.value = false
        router.push('/login')
      })
      .catch(() => {
        authStore.removeAccessToken()
        userStore.removeUserInfo()
        logOutDialog.value = false
        router.push('/login')
      })
  }

  function onSearchCustomer(event: Event) {
    event.preventDefault()
    handleSearch()
  }

  function onClearMessage() {
    searchText.value = ''
    showSearch.value = false
    searchedFriends.value = []
    searchPromptText.value = 'No chats, contacts or messages found'
    friendRequestData.value = undefined
  }

  function handleSearchEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault()
      handleSearch()
    }
  }

  function handleSearch() {
    searchPromptText.value = 'Searching chats, contacts and messages...'
    searchLoading.value = true
    showSearch.value = true

    const params = {
      current: page.value.currentPage,
      size: page.value.pageSize,
      username: searchText.value,
    }
    searchFriends(params)
      .then((res: any) => {
        if (res.data.records.length === 0) {
          searchPromptText.value = 'No chats, contacts or messages found'
        } else {
          searchedFriends.value = res.data.records
        }
        searchLoading.value = false
      })
      .catch((err) => {
        searchedFriends.value = []
        searchPromptText.value = 'No chats, contacts or messages found'
        searchLoading.value = false
      })
  }

  function onSelectSearchedFriend(friend: any) {
    const userId = userStore.user_info.id
    if (friend.id === userId) {
      // 如果选中的是自己
      // console.log(friend)
      const now = DateTime.now()
      const chatSession = {
        id: `${friend.id}_${userId}`,
        userId: userId,
        friendId: friend.id,
        username: friend.username,
        phone: friend.phone,
        avatar: friend.avatar,
        title: '',
        lastChatTime: now.toFormat('yyyy-MM-dd HH:mm:ss'),
      }
      emit('selectFriend', chatSession)
      onClearMessage()
    } else {
      // 如果选中的不是自己
      // 是否是朋友
      checkFriend(userId, friend.id).then((res: any) => {
        // console.log(res.data)
        if (res.data) {
          // 是朋友直接打开对话
          const now = DateTime.now()
          const chatSession = {
            id: `${friend.id}_${userId}`,
            userId: userId,
            friendId: friend.id,
            username: friend.username,
            phone: friend.phone,
            avatar: friend.avatar,
            title: '',
            lastChatTime: now.toFormat('yyyy-MM-dd HH:mm:ss'),
          }
          emit('selectFriend', chatSession)
          onClearMessage()
        } else {
          // 不是朋友弹出添加朋友的提示
          friendRequestData.value = {
            userId: userStore.user_info.id,
            friendId: friend.id,
            remark: '',
            requestStatus: website.requestStatus.PENDING,
            seqNum: String(Date.now()),
          }
          addFriendDialog.value = true
        }
      })
    }
  }

  function handleAddFriend() {
    emit('addFriend', friendRequestData.value)
    addFriendDialog.value = false
  }

  function onSelectChat(e: any) {
    // console.log(e)
    const chatSession = e.id
    emit('selectFriend', chatSession)
  }
</script>

<style lang="scss">
  .pd-10-15 {
    padding: 10px 15px;
  }
</style>

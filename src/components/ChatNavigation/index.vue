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
      <v-list v-if="showSearch">
        <v-sheet v-if="!searchedFriends.length">
          <v-list-item active-color="primary" class="text-center mt-6 mb-6">
            {{ searchPromptText }}
          </v-list-item>
          <v-divider></v-divider>
        </v-sheet>
        <v-list-item v-for="(item, index) of searchedFriends" :key="index" link active-color="primary" class="pa-3">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="60" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.phone }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item link active-color="primary" class="pa-3">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="60" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>121231231</v-list-item-title>
          <v-list-item-subtitle>121231231</v-list-item-subtitle>
        </v-list-item>
        <v-list-item link active-color="primary" class="pa-3">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="60" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>121231231</v-list-item-title>
          <v-list-item-subtitle>121231231</v-list-item-subtitle>
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
  </v-layout>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { logout } from '@/api/auth/account'
  import { searchFriends } from '@/api/chat/friend'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'

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

  function handleLogOut() {
    logout()
      .then(() => {
        authStore.removeAccessToken()
        userStore.removeUserInfo()
        logOutDialog.value = false
        router.push('/login')
      })
      .catch((err) => {
        console.log(err)
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
</script>

<style lang="scss">
  .pd-10-15 {
    padding: 10px 15px;
  }
</style>

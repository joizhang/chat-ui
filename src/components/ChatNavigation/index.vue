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
        :loading="loading"
        density="compact"
        variant="outlined"
        label="Search templates"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        @click:append-inner="onSearchCustomer"
        class="pd-10-15"
      ></v-text-field>
      <v-divider></v-divider>
      <v-list>
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
          <v-btn color="green-darken-1" variant="text" @click="logOutDialog = false"> Cancel </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="handleLogOut"> Log out </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { logout } from '@/api/auth/account'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const loading = ref(false)
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

  function onSearchCustomer() {}
</script>

<style lang="scss">
  .pd-10-15 {
    padding: 10px 15px;
  }
</style>

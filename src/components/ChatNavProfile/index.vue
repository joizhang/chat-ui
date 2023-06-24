<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_PROFILE">
    <v-sheet style="background-color: #cc785c">
      <v-container class="pt-10">
        <v-row>
          <v-col cols="auto">
            <v-btn icon="mdi-keyboard-backspace" color="white" variant="text" @click.stop="handleBack"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center text-white text-h6" style="line-height: 3rem"> Profile </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="pl-7 pr-7">
      <v-row>
        <v-col cols="auto" class="w-100 text-center">
          <v-avatar size="200"><v-icon icon="mdi-account-circle" size="200"></v-icon></v-avatar>
        </v-col>
      </v-row>
    </v-container>

    <v-sheet>
      <v-container class="pl-7 pr-7">
        <v-row>
          <v-col cols="auto" class="w-100">
            <div class="text-brown">Your name</div>
            <v-text-field
              v-model="username"
              density="compact"
              placeholder="Username"
              variant="plain"
              :readonly="!usernameEditable"
              :append-inner-icon="usernameEditable ? 'mdi-check' : 'mdi-pencil'"
              @click:append-inner="updateUsername"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="pl-7 pr-7">
      <v-row>
        <v-col cols="auto" class="text-medium-emphasis" style="font-size: 0.875rem"
          >This is not your username or pin. This name will be visible to your VectorLink contacts.
        </v-col>
      </v-row>
    </v-container>

    <v-sheet>
      <v-container class="pl-7 pr-7">
        <v-row>
          <v-col cols="auto" class="w-100">
            <div class="text-brown">About</div>
            <v-text-field
              v-model="about"
              density="compact"
              placeholder="About"
              variant="plain"
              :readonly="!aboutEditable"
              :append-inner-icon="aboutEditable ? 'mdi-check' : 'mdi-pencil'"
              @click:append-inner="updateAbout"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { updateCustomer } from '@/api/chat/customer'
  import website from '@/config/website'

  defineProps({
    navModelValue: Number,
  })

  const emit = defineEmits(['popupMessage', 'changeModelValue'])

  const userStore = useUserStore()

  const username = ref(userStore.username)
  const about = ref(userStore.about)
  const usernameEditable = ref(false)
  const aboutEditable = ref(false)

  function handleBack() {
    emit('changeModelValue', website.navType.CHAT_NAV)
  }

  function updateUsername() {
    if (usernameEditable.value) {
      usernameEditable.value = false
      const param = {
        id: userStore.id,
        username: username.value,
      }
      updateCustomer(param)
        .then((res) => {
          if (res.code === 1) {
            emit('popupMessage', res.msg)
          } else {
            userStore.updateUserInfo(param)
          }
        })
        .catch((err) => {
          emit('popupMessage', err.message)
        })
    } else {
      usernameEditable.value = true
    }
  }

  function updateAbout() {
    if (aboutEditable.value) {
      aboutEditable.value = false
      const param = {
        id: userStore.id,
        about: about.value,
      }
      updateCustomer(param)
        .then((res) => {
          if (res.code === 1) {
            emit('popupMessage', res.msg)
          } else {
            userStore.updateUserInfo(param)
          }
        })
        .catch((err) => {
          emit('popupMessage', err.message)
        })
    } else {
      aboutEditable.value = true
    }
  }
</script>

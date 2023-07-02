<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_COMMUNITIES">
    <v-sheet style="background-color: #cc785c">
      <v-container class="pt-10">
        <v-row>
          <v-col cols="auto">
            <v-btn icon="mdi-keyboard-backspace" color="white" variant="text" @click.stop="handleBack"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center text-white text-h6" style="line-height: 3rem"> Communities </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-list bg-color="white">
      <v-list-item link active-color="primary" class="pa-3">
        <template v-slot:prepend>
          <v-avatar color="#d4a27f">
            <v-icon icon="mdi-account-group" :size="30" color="white"></v-icon>
          </v-avatar>
        </template>
        <v-list-item-title @click="emitChangeModelValue(website.navType.CHAT_NAV_NEW_COMMUNITY)">
          New community
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import website from '@/config/website'

  defineProps({
    navModelValue: Number,
  })

  const emit = defineEmits(['changeModelValue'])

  function handleBack() {
    emit('changeModelValue', website.navType.CHAT_NAV)
  }

  function emitChangeModelValue(navModelValue: Number) {
    emit('changeModelValue', navModelValue)
  }
</script>

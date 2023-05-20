<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_SETTINGS">
    <v-sheet style="background-color: #cc785c">
      <v-container class="pt-10">
        <v-row>
          <v-col cols="auto">
            <v-btn icon="mdi-keyboard-backspace" color="white" variant="text" @click.stop="handleBack"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center text-white text-h6" style="line-height: 3rem"> Settings </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-text-field
      v-model="searchSettingsText"
      density="compact"
      variant="outlined"
      label="Search settings"
      single-line
      hide-details
      clearable
      class="pd-10-15"
      @click:append-inner="onSearchSettings"
      @click:clear="onClearSearchSettingsMessage"
      @keypress="handleSearchSettingsEnter"
    >
      <template v-slot:append-inner>
        <v-fade-transition leave-absolute>
          <v-progress-circular v-if="searchLoading" indeterminate :size="22"></v-progress-circular>
          <v-icon v-else icon="mdi-magnify"></v-icon>
        </v-fade-transition>
      </template>
    </v-text-field>

    <v-list>
      <v-list-item link active-color="primary" class="pa-3" @click="onNewGroup">
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon icon="mdi-account-group" :size="60" color="#dfe5e7"></v-icon>
          </v-avatar>
        </template>
        <v-list-item-title>New group</v-list-item-title>
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

  const searchSettingsText = ref('')
  const searchLoading = ref(false)

  function handleBack() {
    emit('changeModelValue', website.navType.CHAT_NAV)
  }

  function onSearchSettings() {}

  function onClearSearchSettingsMessage() {}

  function handleSearchSettingsEnter() {}

  function onNewGroup() {
    console.log(123)
  }
</script>

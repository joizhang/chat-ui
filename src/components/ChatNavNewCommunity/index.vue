<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_NEW_COMMUNITY">
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

</script>

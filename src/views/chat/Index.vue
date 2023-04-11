<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col cols="8" offset="2" class="h-100">
        <v-card class="h-100">
          <v-container class="h-100" style="padding: 0;">
            <v-row no-gutters class="h-100">
              <v-col cols="4" class="h-100">
                <chat-navigation></chat-navigation>
              </v-col>
              <v-col cols="8" class="h-100">
                <chat-room></chat-room>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import ChatNavigation from '@/components/chat/ChatNavigation.vue'
  import ChatRoom from '@/components/chat/ChatRoom.vue'
</script>

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
            <v-btn icon="mdi-dots-vertical"></v-btn>
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
        @click:append-inner="onClick"
        class="pd-10-15"
      ></v-text-field>
      <v-divider></v-divider>
      <v-list>
        <v-list-item active-color="primary">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon icon="mdi-account-circle" :size="54" color="#dfe5e7"></v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>121231231</v-list-item-title>
          <v-list-item-subtitle>121231231</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  const loading = ref(false)
  function onClick() {}
</script>

<style lang="scss">
  .pd-10-15 {
    padding: 10px 15px;
  }
</style>

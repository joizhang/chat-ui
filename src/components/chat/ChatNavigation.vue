<template>
  <v-layout class="h-100">
    <v-app-bar :flat="true" class="app-bar-color" style="background-color: #f0f2f5">
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
        density="comfortable"
        variant="solo"
        label="Search templates"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        @click:append-inner="onClick"
      ></v-text-field>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  const loading = ref(false);
  function onClick() {}
</script>

<style lang="scss">
  .app-bar-color {
    background-color: #f0f2f5;
  }
</style>

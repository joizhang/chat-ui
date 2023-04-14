<template>
  <v-container class="h-100 d-flex">
    <v-row class="mt-auto mb-auto">
      <v-col cols="4" offset="4" class="h-100 text-center">
        <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">500</h2>
        <p class="text-base text-center text-slate-500 dark:text-slate-500">Server error</p>
        <div class="flex items-center justify-center text-center">
          <Icon500 style="width: 500px; margin: 0 auto;"/>
        </div>
        <v-btn type="primary" @click="goHome"> Go to Home </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import Icon500 from '@/icons/500.vue'

  const router = useRouter()

  function goHome() {
    router.push('/')
  }
</script>

<template>
  <div class="d-flex flex-column mb-6 h-100">
    <div class="ma-auto text-center">
      <h1>500</h1>
      <p>Server error</p>
      <div>
        <Icon500 style="width: 500px;" />
      </div>
      <div>
        <v-btn type="primary" @click="goHome"> Go to Home </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import Icon500 from '@/icons/500.vue'

  const router = useRouter()

  function goHome() {
    router.push('/')
  }
</script>

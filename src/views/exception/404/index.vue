<template>
  <v-container class="h-100 d-flex">
    <v-row class="mt-auto mb-auto">
      <v-col cols="4" offset="4" class="h-100 text-center">
        <h1 class="text-center">Sorry, page not found!</h1>
        <p>
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your
          spelling.
        </p>
        <div class="text-center">
            <img src="../../../icons/404.svg" alt="404" style="width: 500px;" />
        </div>
        <v-btn type="primary" @click="goHome"> Go to Home </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function goHome() {
    router.push('/')
  }
</script>

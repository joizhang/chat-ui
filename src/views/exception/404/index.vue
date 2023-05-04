<template>
  <div class="d-flex flex-column mb-6 h-100">
    <div class="ma-auto text-center">
      <h1>Sorry, page not found!</h1>
      <p>
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your
        spelling.
      </p>
      <img src="../../../icons/404.svg" alt="404" style="width: 500px" />
      <div>
        <v-btn type="primary" @click="goHome"> Go to Home </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function goHome() {
    router.push('/')
  }
</script>

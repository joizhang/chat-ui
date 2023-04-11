<template>
  <div class="wrap-before"></div>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style lang="scss">
  .wrap-before {
    width: 100%;
    height: 222px;
    background-color: #d4a27f;
    position: absolute;
    top: 0;
    z-index: 0;
  }
</style>

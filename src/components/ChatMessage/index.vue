<template>
  <v-row>
    <v-col class="d-flex" :class="inversion ? 'flex-row-reverse' : 'flex-row'">
      <v-sheet>
        <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
      </v-sheet>
      <v-sheet color="#d9fdd3" class="rounded-lg pa-2 text-max-width">
        <div>{{ text }}</div>
        <p class="float-right datetime-font-size">{{ dateTime }}</p>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps({
  dateTime: String,
  text: String,
  inversion: Boolean,
  error: Boolean,
  loading: Boolean,
})
</script>

<style lang="scss">
.text-max-width {
  max-width: 65%;
}
.datetime-font-size {
  font-size: 12px;
}
</style>

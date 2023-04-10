<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="6">QRCODE</v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <v-tab v-model="tab" align-tabs="left" size="x-large">
          <v-tab value="one">Password Login</v-tab>
          <v-tab value="two">SMS Login</v-tab>
        </v-tab>
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-container>
              <v-row>
                <v-col>
                  <v-sheet class="mx-auto">
                    <v-form fast-fail @submit.prevent>
                      <v-text-field v-model="username" label="USERNAME" :rules="usernameRules"></v-text-field>
                      <v-text-field v-model="password" label="PASSWORD" :rules="passwordRules"></v-text-field>
                      <v-btn type="submit" class="me-4">Submit</v-btn>
                      <v-btn @click="handleReset">clear</v-btn>
                    </v-form>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row>
                <v-col><v-divider></v-divider></v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item value="two">
            <v-container>
              <v-row>Two</v-row>
            </v-container>
          </v-window-item>
        </v-window>
        <v-row>
          <v-col>
            <p class="text-center">其他登录方式</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" class="text-center" offset="5">
            <v-icon icon="mdi-wechat" size="x-large" color="green-darken-2"></v-icon>
          </v-col>
          <v-col cols="1" class="text-center">
            <v-icon icon="mdi-sina-weibo" size="x-large" color="red-darken-2"></v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'

  const tab = ref(null)

  const username = ref('')
  const password = ref('')

  function handleReset() {}
</script>

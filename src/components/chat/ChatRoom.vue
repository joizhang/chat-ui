<template>
  <v-layout class="h-100">
    <v-app-bar flat style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
          </v-col>
          <v-col cols="1" offset="8" class="text-center">
            <v-btn icon="mdi-magnify" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="1" class="text-center" color="#54656f">
            <v-btn icon="mdi-dots-vertical"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-app-bar flat location="bottom" style="background-color: #f0f2f5">
      <v-container>
        <v-row>
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-emoticon-happy-outline" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-attachment" color="#54656f"></v-btn>
          </v-col>
          <v-col cols="9">
            <v-text-field 
            density="comfortable"
            variant="outlined"
            label="Input Message"
            append-inner-icon="mdi-send"
            single-line
            hide-details
            @click:append-inner="send"
            ></v-text-field>
          </v-col>
          <v-col cols="1" class="text-center">
            <v-btn icon="mdi-microphone" color="#54656f"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
        <v-container class="d-flex justify-center align-center text-h5" style="min-height: 300px;">
          Content
        </v-container>
      </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
  

  function send() {

  }
</script>

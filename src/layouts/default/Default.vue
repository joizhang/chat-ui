<template>
  <div class="wrap-before"></div>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="6" offset="3">
          <v-app-bar-title class="mg-tittle"> 
            <v-icon icon="mdi-vector-bezier" size="x-large" /> 
            <span>VectorLink</span>
          </v-app-bar-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="3">
          <v-card>
            <app-view />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
  // import AppWrapperBefore from './AppWrapperBefore.vue'
  // import AppBar from './AppBar.vue'
  import AppView from './View.vue'
</script>

<style lang="scss">
  .wrap-before{
    width: 100%;
    height: 222px;
    background-color: #d4a27f;
    position: absolute;
    top: 0;
    z-index: 0;
  }
  .mg-tittle {
    margin-top: 20px;
    margin-bottom: 50px;
  }
</style>

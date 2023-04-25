<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col cols="8" offset="2" class="h-100">
        <v-card class="h-100">
          <v-container class="h-100" style="padding: 0">
            <v-row no-gutters class="h-100">
              <v-col cols="4" class="h-100">
                <chat-navigation></chat-navigation>
              </v-col>
              <v-col cols="8" class="h-100 overflow-hidden">
                <chat-room></chat-room>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { checkToken, refreshToken } from '@/api/auth/account'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'
  import ChatNavigation from '@/components/ChatNavigation/index.vue'
  import ChatRoom from '@/components/ChatRoom/index.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  onMounted(() => {
    checkToken(authStore.accessToken ?? '')
      .then((res: any) => {
        // console.log(res)
        const expire = res && res.exp
        if (expire) {
          const expiredPeriod = expire * 1000 - new Date().getTime()
          console.log('当前token过期时间', expiredPeriod, '毫秒')
          // 小于半小时自动续约
          if (expiredPeriod < 30 * 60 * 1000) {
            refreshToken(userStore.refresh_token).then((res: any) => {
              console.log(res)
            })
          }
        }
      })
      .catch((err: any) => {
        console.log(err)
        authStore.removeAccessToken()
        userStore.removeUserInfo()
        router.push('/login')
      })
  })
</script>

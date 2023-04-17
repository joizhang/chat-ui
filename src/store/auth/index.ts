import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import store from '@/store'
// import { fetchSession } from '@/api'

export interface AuthState {
  accessToken: string | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    accessToken: getToken(),
  }),

  getters: {},

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
      setToken(token)
    },

    removeAccessToken() {
      this.accessToken = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}

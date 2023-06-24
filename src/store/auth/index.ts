import { defineStore } from 'pinia'
import type { AuthState } from './helper'
import { defaultSetting, getLocalState, setLocalState, removeLocalState } from './helper'
import store from '@/store'

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => getLocalState(),
  getters: {},
  actions: {
    updateAuthInfo(authState: Partial<AuthState>) {
      this.$state = { ...this.$state, ...authState }
      this.recordState()
    },

    resetAuthInfo() {
      this.$state = defaultSetting()
      this.recordState()
    },

    removeAuthInfo() {
      this.$state = defaultSetting()
      removeLocalState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}

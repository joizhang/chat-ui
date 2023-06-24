import { defineStore } from 'pinia'
import type { UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState, removeLocalState } from './helper'
import store from '@/store'
// import { fetchSession } from '@/api'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  getters: {},
  actions: {
    updateUserInfo(userState: Partial<UserState>) {
      this.$state = { ...this.$state, ...userState }
      this.recordState()
    },

    resetUserInfo() {
      this.$state = defaultSetting()
      this.recordState()
    },

    removeUserInfo() {
      this.$state = defaultSetting()
      removeLocalState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

export function useUserStoreWithout() {
  return useUserStore(store)
}

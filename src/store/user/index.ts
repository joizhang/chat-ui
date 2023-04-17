import { defineStore } from 'pinia'
import type { UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState, removeLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
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
      removeLocalState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

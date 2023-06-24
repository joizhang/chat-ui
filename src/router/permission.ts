import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/auth'

const authStore = useAuthStoreWithout()

const whiteList = ['Login', '400', '500', '404']

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (authStore.access_token) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      if (whiteList.includes(to.name as string)) {
        next()
      } else {
        next('/login')
      }
    }
  })
}

import { ss } from '@/utils/storage'

const LOCAL_NAME = 'ACCESS_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME, false)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token, null, false)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

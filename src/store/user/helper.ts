import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserState {
  about: string
  avatar: string
  createTime: string
  id: string
  phone: string
  username: string
}

export function defaultSetting(): UserState {
  return {
    about: '',
    avatar: '',
    createTime: '',
    id: '',
    phone: '',
    username: '',
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME, false)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting, null, false)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}

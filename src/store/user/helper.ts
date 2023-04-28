import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  accountNonExpired: Boolean
  accountNonLocked: Boolean
  attributes: Object
  authorities: Array<any>
  credentialsNonExpired: Boolean
  deptId: string
  enabled: Boolean
  id: string
  name: string
  password: string
  phone: string
  username: string
}

export interface UserState {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string | []
  token_type: string
  user_info: UserInfo
}

export function defaultSetting(): UserState {
  return {
    access_token: '',
    expires_in: 0,
    refresh_token: '',
    token_type: '',
    scope: '',
    user_info: {
      accountNonExpired: true,
      accountNonLocked: true,
      attributes: {},
      authorities: [],
      credentialsNonExpired: true,
      deptId: '',
      enabled: true,
      id: '',
      name: '',
      password: '',
      phone: '',
      username: '',
    },
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
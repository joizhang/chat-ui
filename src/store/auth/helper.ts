import { ss } from '@/utils/storage'

const LOCAL_NAME = 'authStorage'

export interface AuthInfo {
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

export interface AuthState {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string | []
  token_type: string
  user_info: AuthInfo
}

export function defaultSetting(): AuthState {
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

export function getLocalState(): AuthState {
  const localSetting: AuthState | undefined = ss.get(LOCAL_NAME, false)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: AuthState): void {
  ss.set(LOCAL_NAME, setting, null, false)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
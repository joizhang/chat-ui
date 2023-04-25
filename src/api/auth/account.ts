import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'
// import { useAuthStore } from '@/store/auth'
import { useSettingStore } from '@/store/settings'

const scope = 'server'
const formLoginClient = 'chat:chat'
const smsLoginClient = 'app:app'

/**
 * 密码登陆
 */
export function loginByPassword<T = any>(
  username: string,
  password: string,
  code: string,
  randomStr: string,
  signal?: GenericAbortSignal,
) {
  const grant_type = 'password'
  const data = { username: username, password: password }
  const basicAuth = 'Basic ' + window.btoa(formLoginClient)
  const settingStore = useSettingStore()
  settingStore.updateSetting({basicAuth})
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      isToken: false,
      Authorization: basicAuth,
      'content-type': 'application/x-www-form-urlencoded',
    },
    params: { randomStr, code, grant_type, scope },
    data: data,
    signal: signal,
  })
}

/**
 * 验证码登陆
 */
export function loginByMobile<T = any>(phone: string, code: string, signal?: GenericAbortSignal) {
  const grant_type = 'app'
  const basicAuth = 'Basic ' + window.btoa(smsLoginClient)
  const settingStore = useSettingStore()
  settingStore.updateSetting({basicAuth})
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      isToken: false,
      Authorization: basicAuth,
    },
    params: { phone, code, grant_type, scope },
    signal: signal,
  })
}

/**
 * 
 * 刷新token
 */
export function refreshToken<T = any>(refresh_token: string) {
  const grant_type = 'refresh_token'
  // 获取当前选中的 basic 认证信息
  const settingStore = useSettingStore()
  const basicAuth = settingStore.basicAuth
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      isToken: false,
      Authorization: basicAuth,
    },
    params: { refresh_token, grant_type, scope },
  })
}

export function checkToken<T = any>(token: string) {
  const settingStore = useSettingStore()
  const basicAuth = settingStore.basicAuth
  return get<T>({
    url: '/auth/token/check_token',
    headers: {
      isToken: false,
      Authorization: basicAuth
    },
    params: { token },
  })
}

/**
 * 注册用户
 */
export function registerUser<T = any>(registeredUser: any) {
  return post<T>({
    url: '/chat/svc/register/customer',
    data: registeredUser
  })
}

/**
 * 用户信息
 */
export function getUserInfo<T = any>() {
  return get<T>({
    url: '/chat/svc/user/info',
    method: 'get'
  })
}

/**
 * 注销
 */
export function logout<T = any>() {
  return del<T>({
    url: '/auth/token/logout',
  })
}

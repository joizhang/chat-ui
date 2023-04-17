import type { GenericAbortSignal } from 'axios'
import { get, post, del } from '@/utils/request'
// import { useAuthStore } from '@/store/auth'
import { useSettingStore } from '@/store/settings'

const settingStore = useSettingStore()
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
  settingStore.updateSetting({basicAuth})
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      // isToken: false,
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: basicAuth,
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
  settingStore.updateSetting({basicAuth})
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      // isToken: false,
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
  const basicAuth = settingStore.basicAuth
  return post<T>({
    url: '/auth/oauth2/token',
    headers: {
      // isToken: false,
      Authorization: basicAuth,
    },
    params: { refresh_token, grant_type, scope },
  })
}

/**
 * 注册用户
 */
export function registerUser<T = any>(registeredUser: any) {
  return post<T>({
    url: '/chat/register/customer',
    data: registeredUser
  })
}

export function getUserInfo<T = any>() {
  return get<T>({
    url: '/chat/user/info',
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

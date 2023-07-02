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
export function loginByPassword(
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
  return post({
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
export function loginByMobile(phone: string, code: string, signal?: GenericAbortSignal) {
  const grant_type = 'app'
  const basicAuth = 'Basic ' + window.btoa(smsLoginClient)
  const settingStore = useSettingStore()
  settingStore.updateSetting({basicAuth})
  return post({
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
export function refreshToken(refresh_token: string) {
  const grant_type = 'refresh_token'
  // 获取当前选中的 basic 认证信息
  const settingStore = useSettingStore()
  const basicAuth = settingStore.basicAuth
  return post({
    url: '/auth/oauth2/token',
    headers: {
      isToken: false,
      Authorization: basicAuth,
    },
    params: { refresh_token, grant_type, scope },
  })
}

export function checkToken(token: string) {
  const settingStore = useSettingStore()
  const basicAuth = settingStore.basicAuth
  return get({
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
export function registerUser(registeredUser: any) {
  return post({
    url: '/chat/svc/register/customer',
    data: registeredUser
  })
}

/**
 * 注销
 */
export function logout() {
  return del({
    url: '/auth/token/logout',
  })
}

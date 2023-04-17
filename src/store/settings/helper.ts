import { ss } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  basicAuth: string
}

export function defaultSetting(): SettingsState {
  return {
    basicAuth: 'chat:chat',
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = ss.get(LOCAL_NAME, false)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  ss.set(LOCAL_NAME, setting, null, false)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}

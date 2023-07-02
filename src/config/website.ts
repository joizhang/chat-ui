export default {
  title: 'spring cloud chat',
  description: 'spring cloud chat',
  db: {
    name: 'model-storage',
    version: 13,
  },
  wsBaseUrl: `${import.meta.env.VITE_APP_WS_BASE_URL}chat/ws/info`,
  contentType: {
    ERROR: 0,
    TEXT: 1,
    IMAGE: 2,
    VIDEO: 3,
    AUDIO: 4,
    FRIEND_REQ: 5,
    ACK: 6,
    TOOLTIP: 7,
  },
  contentSubtype: {
    DEFAULT: 0,
  },
  requestStatus: {
    PENDING: 1,
    ACCEPTED: 2,
  },
  navType: {
    CHAT_NAV: 0,
    CHAT_NAV_PROFILE: 1,
    CHAT_NAV_STATUS: 2,
    CHAT_NAV_COMMUNITIES: 3,
    CHAT_NAV_NEW_COMMUNITY: 30,
    CHAT_NAV_COMMUNITY: 31,
    CHAT_NAV_NEW_CHAT: 4,
    CHAT_NAV_SETTINGS: 5,
  }
}

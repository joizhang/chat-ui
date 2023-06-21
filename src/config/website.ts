export default {
  title: 'spring cloud chat',
  description: 'spring cloud chat',
  db: {
    name: 'model-storage',
    version: 9,
  },
  wsBaseUrl: `${import.meta.env.VITE_APP_WS_BASE_URL}chat/ws/info`,
  contentType: {
    ERROR: 1,
    TEXT: 2,
    IMAGE: 3,
    VIDEO: 4,
    AUDIO: 5,
    FRIEND_REQ: 5,
    ACK: 6,
    TOOLTIP: 7,
  },
  requestStatus: {
    PENDING: '1',
    ACCEPTED: '2',
  },
  navType: {
    CHAT_NAV: 0,
    CHAT_NAV_NEW_CHAT: 1,
    CHAT_NAV_NEW_CHAT_NEW_GROUP: 11,
    CHAT_NAV_SETTINGS: 2,
    CHAT_NAV_PROFILE: 21,
  }
}

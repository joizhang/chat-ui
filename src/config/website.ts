export default {
  title: 'spring cloud chat',
  description: 'spring cloud chat',
  db: {
    name: 'model-storage',
    version: 6,
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
  },
  requestStatus: {
    PENDING: '1',
    ACCEPTED: '2',
  },
}

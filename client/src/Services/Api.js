import axios from 'axios'
import Promise from 'bluebird'

const isProd = Boolean(process.env.NODE_ENV !== 'production')
const devUri = 'http://localhost:1337'
const prodUri = `${window.location.origin}`
const BASE_URL = isProd ? devUri : prodUri

export const setDefaults = idToken => {
  axios.defaults.baseURL = BASE_URL
  axios.defaults.headers.common['Authorization'] = idToken
}

export default {

  auth: {

    get: {
      test: () => axios.get('/api/auth/test'),
    },

    post: {
      loginInit: () => axios.post('/api/auth/login/init'),
    },

    del: {
      logout: () => axios.delete('/api/auth/logout'),
    },
  },
}

// ------------------ SERVER SENT EVENTS UTILITY ------------------ //

export const connectToServerEvents = simpleId => {
  return new Promise((resolve, reject) => {
    try {
      const se = new EventSource(`${BASE_URL}/friends/cron/updater/${simpleId}`)
      resolve(se)
    } catch (error) {
      reject(error)
    }
  })
}


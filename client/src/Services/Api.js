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

const build = rts => rts.reduce((acc, route) => Object.create(acc, { [route]: {} }), {})

const routes = ['auth', 'demon', 'friends', 'messages']

const get = build(routes)
const post = build(routes)
const del = build(routes)


// ---------- GET ------------ //
get.auth.test = () => axios.get('/api/auth/test')

// ---------- POST ------------ //
post.auth.loginInit = () => axios.post('/api/auth/login/init')

// ---------- DEL ------------ //
del.auth.logout = () => axios.delete('/api/auth/logout')



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


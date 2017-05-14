import axios from 'axios'
import Promise from 'bluebird'

const BASE_URL = 'http://localhost:2020'

export const setDefaults = idToken => {
  axios.defaults.baseURL = BASE_URL
  axios.defaults.headers.common['Authorization'] = idToken
}

const init = data => {
  console.log(data)
}

const test = () => {
  return axios.get('/auth/test')
}

const friendsCronHaters = () => {
  return axios.get('/friends/cron/haters')
}

const logout = () => {
  return axios.delete('/auth/logout')
}

export const get = {
  test,
  friendsCronHaters,
}

export const post = {
  init,
}

export const del = {
  logout,
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


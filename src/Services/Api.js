import axios from 'axios'

export const setDefaults = idToken => {
  axios.defaults.baseURL = 'http://localhost:2020'
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

export const get = {
  test,
  friendsCronHaters,
}

export const post = {
  init,
}


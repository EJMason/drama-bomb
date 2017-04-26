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

export const get = {
  test,
}

export const post = {
  init,
}


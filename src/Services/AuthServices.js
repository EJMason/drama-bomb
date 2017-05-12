import Auth0Lock from 'auth0-lock'
import Promise from 'bluebird'

import { AUTH_CLIENT_ID, AUTH_DOMAIN } from '../../clientKeys'


export const lock = new Auth0Lock(AUTH_CLIENT_ID, AUTH_DOMAIN, {
  auth: {
    redirectUrl: 'http://localhost:3000/login',
    responseType: 'token',
    params: { scope: 'openid email user_id screen_name' },
  },
})

export const getProfile = (lockInstance, accessToken) => {
  return new Promise((resolve, reject) => {
    lockInstance.getUserInfo(accessToken, (err, profile) => {
      if (err) {
        reject(err)
      } else {
        resolve(profile)
      }
    })
  })
}

export const showLock = lockInstance => {
  lockInstance.show()
}

export const setTokens = ({ idToken, profile, accessToken }) => {
  localStorage.setItem('id_token', idToken)
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getIdToken = () => localStorage.getItem('id_token')

export const getProfileInfo = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(localStorage.profile) : {}
}


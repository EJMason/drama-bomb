import Auth0Lock from 'auth0-lock'
import Promise from 'bluebird'

console.log(process.env)

const clientId = process.env.AUTH0_CLIENT_ID
const domain = process.env.AUTH0_DOMAIN

// if (process.env.NODE_ENV !== 'production') {
//   clientId = process.env.AUTH0_CLIENT_ID
//   domain = process.env.AUTH0_DOMAIN
// } else {
//   clientId = globalConfig.AUTH_CLIENT_ID
//   domain = globalConfig.AUTH_DOMAIN
// }

console.log('ENV: ', process.env.NODE_ENV)

export const lock = new Auth0Lock(clientId, domain, {
  auth: {
    redirectUrl: `${window.location.origin}/login`,
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
  try {
    localStorage.setItem('id_token', idToken)
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('profile', JSON.stringify(profile))
  } catch (error) {
    throw error
  }
}

export const removeTokens = () => {
  try {
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
    localStorage.removeItem('access_token')
  } catch (error) {
    throw error
  }
}

export const getProfileInfo = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(localStorage.profile) : {}
}

export const getAllTokens = () => {
  const idToken = localStorage.getItem('id_token')
  const profile = getProfileInfo()
  const accessToken = localStorage.getItem('access_token')
  if (idToken && profile && accessToken) {
    return { idToken, profile, accessToken }
  }
  return null
}

export const getIdToken = () => {
  localStorage.getItem('id_token')
}

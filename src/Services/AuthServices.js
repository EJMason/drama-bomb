import Auth0Lock from 'auth0-lock'
import { EventEmitter } from 'events'
import Promise from 'bluebird'

import { AUTH_CLIENT_ID, AUTH_DOMAIN } from '../../clientKeys'

export default class AuthService extends EventEmitter {
  constructor() {
    super()
    this.lock = new Auth0Lock(AUTH_CLIENT_ID, AUTH_DOMAIN, {
      auth: {
        redirectUrl: 'http://localhost:3000/login',
        responseType: 'token',
      },
    })
    this.lock.getProfile = Promise.promisify(this.lock.getProfile)

    this.login = this.login.bind(this)
    this.setProfile = this.setProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    this.lock.on('authorization_error', this._authorizationError.bind(this))
  }

  _authorizationError(err) {
    console.error(err)
  }

  async _doAuthentication(authResult) {
    this.setToken(authResult.idToken)

    try {
      console.log('THIS IS THE ID TOKEN: ', authResult.idToken)
      const profile = await this.lock.getProfile(authResult.idToken)
      console.log('THIS IS THE PROFILE: ', profile)
    } catch (err) {
      console.log(err)
    }
  }

  login() {
    this.lock.show()
  }

  loggedIn() {
    return !!this.getToken()
  }

  getProfile() {
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
    this.emit('profile_updated', profile)
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    return localStorage.getItem('id_token')
  }

  logout() {
    localStorage.removeItem('id_token')
  }
}

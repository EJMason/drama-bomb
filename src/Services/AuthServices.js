import Auth0Lock from 'auth0-lock'
import { AUTH_CLIENT_ID, AUTH_DOMAIN } from '../../clientKeys'

export default class AuthService {
  constructor() {
    this.lock = new Auth0Lock(AUTH_CLIENT_ID, AUTH_DOMAIN, {
      auth: {
        redirectUrl: 'http://localhost:3000/login',
        responseType: 'token',
      },
    })
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult) {
    console.log('YOYOYOYOYO')
    this.setToken(authResult.idToken)
  }

  login() {
    this.lock.show()
  }

  loggedIn() {
    return !!this.getToken()
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

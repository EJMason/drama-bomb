import Immutable from 'seamless-immutable'
import AuthService from '../Services/AuthServices'
// ------------------ Action Names ----------------- //
export const types = {
  SET_LOGGED_IN: 'SET_LOGGED_IN',
  SET_LOGIN_INFO: 'AUTH/SET_LOGIN_INFO',
  LOGOUT: 'LOGOUT',
  BEGIN_INIT_SEQUENCE: 'AUTH/BEGIN_INIT_SEQUENCE',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  auth: new AuthService(),
  loggedIn: false,
  profile: null,
  idToken: null,
})

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_LOGGED_IN: {
      return Immutable.merge(state, { loggedIn: true })
    }
    case types.SET_LOGIN_INFO: {
      return Immutable.merge(state, { profile: action.payload.profile, idToken: action.payload.idToken, loggedIn: true })
    }
    case types.LOGOUT: {
      return Immutable.merge(state, { loggedIn: false, profile: null, idToken: null })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  setLoggedIn: () => ({ type: types.SET_LOGGED_IN }),
  setLoginInfo: (profile, idToken) => ({ type: types.SET_LOGIN_INFO, payload: { profile, idToken } }),
  logout: () => ({ type: types.LOGOUT }),
  beginInitSeq: idToken => ({ type: types.BEGIN_INIT_SEQUENCE, payload: idToken }),
}

// -------------- Selectors ------------ //

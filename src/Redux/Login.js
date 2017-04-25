import Immutable from 'seamless-immutable'
// ------------------ Action Names ----------------- //
export const types = {
  SET_LOGGED_IN: 'SET_LOGGED_IN',
  SET_LOGIN_INFO: 'SET_LOGIN_INFO',
  LOGOUT: 'LOGOUT',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
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
      return Immutable.merge({ state, proflie: action.payload.profile, idToken: action.payload.idToken, loggedIn: true })
    }
    case types.LOGOUT: {
      return INITIAL_STATE
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
}

// -------------- Selectors ------------ //

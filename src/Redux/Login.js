import Immutable from 'seamless-immutable'

// ------------------ Action Names ----------------- //
export const types = {
  LOCK_BEGIN_LOGIN: 'AUTH/LOCK_BEGIN_LOGIN',

  SET_LOGGED_IN: 'SET_LOGGED_IN',
  SET_LOGIN_INFO: 'AUTH/SET_LOGIN_INFO',
  LOGOUT: 'LOGOUT',
  BEGIN_INIT_SEQUENCE: 'AUTH/BEGIN_INIT_SEQUENCE',
  INIT_SEQUENCE_COMPLETED: 'AUTH/INIT_SEQUENCE_COMPLETED',
  INIT_SEQUENCE_ERR: 'AUTH/INIT_SEQUENCE_ERROR',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  loggedIn: false,
  mounted: false,
  profile: null,
  idToken: null,
  fetching: false,
  error: null,
})

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'MOUNT': {
      return Immutable.merge(state, { mounted: true })
    }
    case types.BEGIN_INIT_SEQUENCE: {
      return Immutable.merge(state, { profile: action.payload.profile, idToken: action.payload.idToken })
    }


    case types.SET_LOGGED_IN: {
      return Immutable.merge(state, { loggedIn: true })
    }
    case types.SET_LOGIN_INFO: {
      return Immutable.merge(state, { profile: action.payload.profile, idToken: action.payload.idToken, loggedIn: true })
    }
    case types.LOGOUT: {
      return Immutable.merge(state, { loggedIn: false, profile: null, idToken: null })
    }
    case types.INIT_SEQUENCE_COMPLETED: {
      return Immutable.merge(state, { loggedIn: true })
    }
    case types.INIT_SEQUENCE_ERR: {
      return Immutable.merge(state, { error: action.payload })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  lockBeginLogin: () => ({ type: types.LOCK_BEGIN_LOGIN }),


  setLoggedIn: () => ({ type: types.SET_LOGGED_IN }),
  setLoginInfo: (profile, idToken) => ({ type: types.SET_LOGIN_INFO, payload: { profile, idToken } }),
  logout: () => ({ type: types.LOGOUT }),
  beginInitSeq: ({ idToken, profile }) => ({ type: types.BEGIN_INIT_SEQUENCE, payload: { idToken, profile } }),
  finishedInitSeq: () => ({ type: types.INIT_SEQUENCE_COMPLETED }),
  initSeqErr: err => ({ type: types.INIT_SEQUENCE_ERR, payload: err }),
}

// -------------- Selectors ------------ //

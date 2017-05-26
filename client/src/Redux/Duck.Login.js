import Immutable from 'seamless-immutable'

// ------------------ Action Names ----------------- //
export const types = {
  LOCK_AUTHENTICATED: 'lock/AUTHENTICATED',
  LOCK_CLOSE: 'lock/CLOSE',
  LOCK_CLOSE_EVENT: 'lock/CLOSE_EVENT',
  LOCK_OPEN: 'lock/OPEN',
  LOCK_OPEN_EVENT: 'lock/OPEN_EVENT',
  AUTH_POST_LOCK: 'auth/POST_LOCK',
  AUTH_SUCCESS: 'auth/SUCCESS',
  AUTH_ERROR: 'auth/ERROR',
  AUTH_LOGOUT: 'auth/LOGOUT',
  AUTH_RETRY: 'auth/RETRY',
  EVENTSOURCE_CONNECT: 'event_source/CONNECT',
  EVENTSOURCE_DISCONNECT: 'event_source/DISCONNECT',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  mounted: false,
  lockOpen: false,
  lockAuthenticated: false,
  authStatus: 'logged out',
  sourceConnected: false,
  error: null,
})

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'MOUNT': {
      return Immutable.merge(state, { mounted: true })
    }
    case types.LOCK_OPEN: {
      return Immutable.merge(state, { lockOpen: true })
    }
    case types.LOCK_CLOSE: {
      return Immutable.merge(state, { lockOpen: false })
    }
    case types.AUTH_SUCCESS: {
      return Immutable.merge(state, { authStatus: 'complete' })
    }
    case types.EVENTSOURCE_CONNECT: {
      return Immutable.merge(state, { sourceConnected: true })
    }
    case types.EVENTSOURCE_DISCONNECT: {
      return Immutable.merge(state, { sourceConnected: false })
    }
    case types.AUTH_LOGOUT: {
      return INITIAL_STATE
    }
    case types.AUTH_ERROR: {
      return Immutable.merge(state, { error: action.payload.error })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  lockOpen: () => ({ type: types.LOCK_OPEN }),
  lockClose: () => ({ type: types.LOCK_CLOSE }),
  lockAuthenticated: payload => ({ type: types.LOCK_AUTHENTICATED, payload }),
  authSuccess: () => ({ type: types.AUTH_SUCCESS }),
  authError: ({ err }) => ({ type: types.AUTH_ERROR, payload: err }),
  authLogout: () => ({ type: types.AUTH_LOGOUT }),
  eventSourceConnect: simpleId => ({ type: types.EVENTSOURCE_CONNECT, payload: { simpleId } }),
  eventSourceDisconnect: () => ({ type: types.EVENTSOURCE_DISCONNECT }),
  authRetry: ({ idToken, profile, accessToken }) =>
    ({ type: types.AUTH_RETRY, payload: { idToken, profile, accessToken } }),
    // Not really any use for these below here yet....
  lockOpenEvent: () => ({ type: types.LOCK_OPEN_EVENT }),
  lockCloseEvent: () => ({ type: types.LOCK_CLOSE_EVENT }),
}

// -------------- Selectors ------------ //

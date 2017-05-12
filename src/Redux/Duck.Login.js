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
  EVENTSOURCE_CONNECT: 'event_source/CONNECT',
  EVENTSOURCE_DISCONNECT: 'event_source/DISCONNECT',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  mounted: false,
  lockOpen: false,
  lockAuthenticated: false,
  authStatus: 'logged out',
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

  lockOpenEvent: () => ({ type: types.LOCK_OPEN_EVENT }),
  lockCloseEvent: () => ({ type: types.LOCK_CLOSE_EVENT }),

}

// -------------- Selectors ------------ //

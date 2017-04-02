import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()
// ------------------ Action Names ----------------- //
export const types = {
  SET_LOGGED_IN: 'SET_LOGGED_IN',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = {
  loggedIn: false,
  history,
}

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_LOGGED_IN: {
      return { ...state, loggedIn: true }
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  setLoggedIn: () => ({ type: types.SET_LOGGED_IN }),
}

// -------------- Selectors ------------ //

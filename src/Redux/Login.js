
// ------------------ Action Names ----------------- //
export const types = {
  SET_LOGGED_IN: 'SET_LOGGED_IN',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = {
  loggedIn: false,
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

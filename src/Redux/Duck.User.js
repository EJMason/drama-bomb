import Immutable from 'seamless-immutable'
// ------------------ Action Names ----------------- //
export const types = {
  USER_SET_DATA: 'user/SET_DATA',
  INITIAL_USERS: 'user/INITIAL_USERS',
  USER_ERROR: 'user/ERROR',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  friends_ids: [],
  haters: [],
  profile: null,
  idToken: null,
  userId: null,
  simple_id: null,
})

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.USER_SET_DATA: {
      const { profile, accessToken, idToken } = payload
      return Immutable.merge(state, {
        idToken,
        accessToken,
        profile,
      })
    }
    case types.INITIAL_USERS: {
      return Immutable.merge(state, {
        friends_ids: payload.friends_ids,
        haters: payload.haters,
        simple_id: payload.simple_id,
      })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  userSetData: payload =>
    ({ type: types.USER_SET_DATA, payload }),

  initialUsers: ({ friends_ids, haters, simple_id }) =>
    ({ type: types.INITIAL_USERS, payload: { friends_ids, haters, simple_id } }),

  userError: ({ err }) =>
    ({ type: types.USER_ERROR, payload: { error: err } }),

}

// -------------- Selectors ------------ //

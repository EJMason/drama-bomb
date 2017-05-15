import Immutable from 'seamless-immutable'
// ------------------ Action Names ----------------- //
export const types = {
  USER_SET_DATA: 'user/SET_DATA',
  INITIAL_USERS: 'user/INITIAL_USERS',
  USER_ERROR: 'user/ERROR',
  USER_REMOVE: 'user/REMOVE',
  USER_UPDATE: 'user/UPDATE',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  friends_ids: [],
  haters: [],
  followers_count: 0,
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
    case types.USER_REMOVE: {
      return INITIAL_STATE
    }
    case types.INITIAL_USERS: {
      return Immutable.merge(state, {
        friends_ids: payload.friends_ids,
        followers_count: payload.friends_ids.length,
        haters: payload.haters,
        simple_id: payload.simple_id,
      })
    }
    case types.USER_UPDATE: {
      return Immutable.merge(state, {
        friends_ids: payload.friends_ids,
        haters: payload.haters,
        followers_count: payload.followers_count,
      })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  userSetData: payload => ({ type: types.USER_SET_DATA, payload }),
  initialUsers: ({ friends_ids, haters, simple_id }) =>
    ({ type: types.INITIAL_USERS, payload: { friends_ids, haters, simple_id } }),
  userError: ({ err }) => ({ type: types.USER_ERROR, payload: { error: err } }),
  userRemove: () => ({ type: types.USER_REMOVE }),
  userUpdate: ({ friends_ids, followers_count, haters }) =>
    ({ type: types.USER_UPDATE, payload: { friends_ids, followers_count, haters } }),

}

// -------------- Selectors ------------ //

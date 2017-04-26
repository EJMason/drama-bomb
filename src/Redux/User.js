import Immutable from 'seamless-immutable'
// ------------------ Action Names ----------------- //
export const types = {
  INITIAL_USERS: 'USER/INITIAL_USERS',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = Immutable({
  friends_ids: [],
  haters: [],
})

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.INITIAL_USERS: {
      return Immutable.merge(state, { friends_ids: payload.friends_ids, haters: payload.haters })
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  initialUsers: (friendsIds, haters) => ({ type: types.INITIAL_USERS, payload: { friends_ids: friendsIds, haters } }),
}

// -------------- Selectors ------------ //

// ------------------ Action Names ----------------- //
export const types = {
  MOUNT_APP: 'MOUNT_APP',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = {
  mounted: false,
}

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.MOUNT_APP:
      return { ...state, mounted: true }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  dispatchMountAction: () => ({ type: types.MOUNT_APP }),
}

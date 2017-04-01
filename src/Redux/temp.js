// ------------------ Action Names ----------------- //
export const types = {
  MOUNT_APP: 'MOUNT_APP',
  SAGA_WAIT: 'SAGA_WAIT',
  DONE_WAIT: 'DONE_WAIT',
}

// ----------- Initialize Default State --------- //
const INITIAL_STATE = {
  mounted: false,
  waited: null,
}

// ------------------- Reducers ------------------- //
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.MOUNT_APP: {
      return { ...state, mounted: true }
    }
    case types.SAGA_WAIT: {
      return { ...state, waited: true }
    }
    case types.DONE_WAIT: {
      return { ...state, waited: false }
    }

    default:
      return state
  }
}

// -------------- Action Creators ------------ //
export const actions = {
  dispatchMountAction: () => ({ type: types.MOUNT_APP }),
  doneWait: () => ({ type: types.DONE_WAIT }),
  sagaWait: () => ({ type: types.SAGA_WAIT }),
}

// -------------- Selectors ------------ //

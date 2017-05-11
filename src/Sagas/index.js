import { fork, take, call, put } from 'redux-saga/effects'
import { showLock, authLock } from '../Services/AuthServices'

/* ------------- Types ------------- */
// import { types as tempTypes } from '../Redux/temp'

/* ------------- Actions ------------- */
// import { actions as loginActions } from '../Redux/Login'

/* ------------- Sagas ------------- */
import { authAuthenticated } from './authSaga'
import { createLockChannel } from './eventsSaga'

// const thrower = msg => ({
//   error: msg,
// })

/* --------------- Watchers ----------------------- */

function* watchLockEvents() {
  const lockChannel = yield call(createLockChannel, authLock)
  while (true) {
    const { type, payload } = yield take(lockChannel)
    yield put({ type, payload })
  }
}

function* watchLockOpen() {
  while (true) {
    yield take('AUTH/INIT_OPEN_LOCK')
    yield call(showLock, authLock)
  }
}

function* watchLockAuthSuccess() {
  while (true) {
    const { payload } = yield take('AUTH/AUTHENTICATED')
    yield call(authAuthenticated, payload, authLock)
  }
}

/* ------------- Connect Types To Sagas ------------- */

function* all() {
  yield fork(watchLockOpen)
  yield fork(watchLockEvents)
  yield fork(watchLockAuthSuccess)
}

export default function* root() {
  try {
    yield call(all)
  } catch (error) {
    console.error('Error in Sagas')
    console.error(error)
    yield put({ type: 'SAGAS/ERROR', payload: error })
  }
}

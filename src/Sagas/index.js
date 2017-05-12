import { fork, take, call, put, cancel } from 'redux-saga/effects'

import { showLock, lock } from '../Services/AuthServices'

/* ------------- Types ------------- */
import { types } from '../Redux/Duck.Login'

/* ------------- Actions ------------- */
// import { actions as loginActions } from '../Redux/Duck.Login'

/* ------------- Sagas ------------- */
import { lockLoginSuccessSaga, serverSentEventsSaga } from './authSaga'
import { createLockChannel } from './eventsSaga'

/* --------------- Watchers ----------------------- */

function* watchLockEvents() {
  const lockChannel = yield call(createLockChannel, lock)
  while (true) {
    const { type, payload } = yield take(lockChannel)
    yield put({ type, payload })
  }
}

function* watchLockOpen() {
  while (true) {
    yield take(types.LOCK_OPEN)
    yield call(showLock, lock)
  }
}

function* watchLockAuthSuccess() {
  while (true) {
    const { payload } = yield take(types.LOCK_AUTHENTICATED)
    yield call(lockLoginSuccessSaga, payload)
  }
}

function* watchServerSentEvents() {
  while (true) {
    // dispatch from dashboard
    const { simple_id } = yield take(types.EVENTSOURCE_CONNECT)
    const serverEventsTask = yield fork(serverSentEventsSaga, simple_id)

    yield take(types.EVENTSOURCE_DISCONNECT)
    yield cancel(serverEventsTask)
  }
}

/* ------------- Connect Types To Sagas ------------- */

function* all() {
  yield fork(watchLockOpen)
  yield fork(watchLockEvents)
  yield fork(watchLockAuthSuccess)
  yield fork(watchServerSentEvents)
}

export default function* root() {
  try {
    yield call(all)
  } catch (error) {
    console.error(error)
    yield put({ type: 'SAGAS/ERROR', payload: error })
  }
}

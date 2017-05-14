// import { fork, take, call, put, cancel } from 'redux-saga/effects'
import { fork, take, call, put } from 'redux-saga/effects'

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
    const { payload } = yield take(types.EVENTSOURCE_CONNECT)
    // const serverEventsTask = yield fork(serverSentEventsSaga, payload.simpleId)
    yield fork(serverSentEventsSaga, payload.simpleId)

    const load = yield take('CHANNEL_CREATED')
    console.log('THIS IS THE PAYLOAD: ', load)
    yield take(types.AUTH_LOGOUT)
    yield call(load.payload.close)
    // yield cancel(serverEventsTask)
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

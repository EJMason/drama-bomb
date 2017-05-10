import { fork, take, call, put } from 'redux-saga/effects'
import { createLockChannel, showLock, authLock } from '../Services/AuthServices'

/* ------------- Types ------------- */
// import { types as tempTypes } from '../Redux/temp'

/* ------------- Actions ------------- */
// import { actions as loginActions } from '../Redux/Login'

/* ------------- Sagas ------------- */
import { lockLogin } from './authSaga'

/* --------------- Watchers ----------------------- */

function* watchInitiateLogin() {
  const lockChannel = yield call(createLockChannel, authLock)
  while (true) {
    yield take('AUTH/LOCK_BEGIN_LOGIN')
    yield fork(lockLogin, lock, lockChannel)
  // I there is an id token and profile in localstorage,
  // then they are logged in, show correct button on homepage
  }
}

function* watchLockOpen() {
  console.log('WATCH LOCK OPEN! ', authLock)
  // const here = this
  while (true) {
    yield take('AUTH/OPEN_LOCK')
    console.log('DID I GET HERE?')
    yield call(showLock, authLock)
    yield put({ type: 'COMPLETED!' })
  }
}

// function* watchBeginInit() {
//   while (true) {
//     const { profile, idToken } = yield take(loginActions.beginInitSeq)
//     // I there is an id token and profile in localstorage,
//     // then they are logged in, show correct button on homepage
//   }
// }

/* ------------- Connect Types To Sagas ------------- */
// export default function* root() {
//   yield [
//     takeEvery(tempTypes.SAGA_WAIT, sagaTest),
//     takeEvery(loginTypes.BEGIN_INIT_SEQUENCE, sagaInitSeq),
//   ]
// }

function* all() {
  yield fork(watchLockOpen)
  yield fork(watchInitiateLogin)
}

export default function* root() {
  try {
    yield call(all)
  } catch (error) {
    console.log('THERE WAS A SAGA ERROR!!!!')
    console.log(error)
    yield put({ type: 'SAGAS/ERROR' })
  }
}

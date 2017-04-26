import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import axios from 'axios'

import { actions } from '../Redux/Login'

export function* sagaInitSeq({ payload }) {
  console.log('This is in the saga: ', payload)
  try {
    // add profile info to redux
    yield put(actions.setLoginInfo(payload.profile, payload.idToken))
    // endpoint auth/login/init
    const val = yield call(axios.post, '/auth/login/init')
    console.log(val)
  } catch (err) {
    console.error(err)
  }
}

export function* sagaTest2() {
  try {
    yield call(delay, 300)
    yield put(tempActions.doneWait())
  } catch (err) {
    console.error('sagaTest Error')
  }
}

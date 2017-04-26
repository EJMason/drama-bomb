import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import axios from 'axios'

import { actions } from '../Redux/Login'
import { actions as userActions } from '../Redux/User'

export function* sagaInitSeq({ payload }) {
  try {
    // add profile info to redux
    yield put(actions.setLoginInfo(payload.profile, payload.idToken))
    // endpoint auth/login/init
    const { data } = yield call(axios.post, '/auth/login/init')
    yield put(actions.finishedInitSeq(data))

    yield put(userActions.initialUsers(data.friends_ids, data.haters))
  } catch (err) {
    yield put(actions.initSeqErr(err))
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

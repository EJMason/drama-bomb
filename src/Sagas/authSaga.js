import { call, put } from 'redux-saga/effects'
import axios from 'axios'

import { actions } from '../Redux/Login'
import { actions as userActions } from '../Redux/User'

import { setIdToken } from '../Services/AuthServices'

export function* authAuthenticated({ idToken }) {
  try {
    yield call(setIdToken, idToken)
    yield put({ type: 'AUTH/LOCK_LOGIN_COMPLETE', payload: { idToken } })
  } catch (error) {
    console.error(error)
    yield put({ type: 'AUTH/ERROR', payload: error })
  }
}


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

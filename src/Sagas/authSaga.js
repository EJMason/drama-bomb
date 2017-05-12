import { call, put, fork } from 'redux-saga/effects'
import axios from 'axios'

import { actions } from '../Redux/Duck.Login'
import { actions as userActions } from '../Redux/User'
import { setDefaults } from '../Services/Api'

import { setTokens } from '../Services/AuthServices'

export function* lockLoginSuccessSaga({ idToken, profile, accessToken }) {
  try {
    yield fork(setTokens, { idToken, profile, accessToken })
    yield put(actions.authSetData({ idToken, profile, accessToken }))

    yield call(setDefaults, idToken)
    const { data } = yield call(axios.post, '/auth/login/init')
    yield put(userActions.initialUsers(data.friends_ids, data.haters))

    yield put(actions.authSuccess())
  } catch (err) {
    console.error(err)
    yield put(actions.authError(err))
  }
}

export const holder = 'placeholder'

import { call, put, fork } from 'redux-saga/effects'
import axios from 'axios'

import { actions } from '../Redux/Duck.Login'
import { actions as userActions } from '../Redux/Duck.User'
import { setDefaults } from '../Services/Api'

import { setTokens } from '../Services/AuthServices'

export function* lockLoginSuccessSaga({ idToken, profile, accessToken }) {
  try {
    yield fork(setTokens, { idToken, profile, accessToken })
    yield put(userActions.userSetData({ idToken, profile, accessToken }))

    yield call(setDefaults, idToken)
    // this call will add or create in db, then put in redis cache
    const { data } = yield call(axios.post, '/auth/login/init')
    console.log('this is data: ', data)
    yield put(userActions.initialUsers({
      friends_ids: data.friends_ids,
      haters: data.haters,
      simple_id: data.simple_id,
    }))

    yield put(actions.authSuccess())
  } catch (err) {
    console.error(err)
    yield put(actions.authError(err))
  }
}

export const holder = 'placeholder'

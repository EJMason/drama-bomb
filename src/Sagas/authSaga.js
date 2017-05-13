// import { call, put, fork, take } from 'redux-saga/effects'
import { call, put, fork, take, cancelled } from 'redux-saga/effects'
import axios from 'axios'

import { createServerEventChannel } from './eventsSaga'
import { actions } from '../Redux/Duck.Login'
import { actions as userActions } from '../Redux/Duck.User'

import { setDefaults, connectToServerEvents } from '../Services/Api'
import { setTokens } from '../Services/AuthServices'

export function* lockLoginSuccessSaga({ idToken, profile, accessToken }) {
  try {
    yield fork(setTokens, { idToken, profile, accessToken })
    yield put(userActions.userSetData({ idToken, profile, accessToken }))

    yield call(setDefaults, idToken)
    // this call will add or create in db, then put in redis cache
    const { data } = yield call(axios.post, '/auth/login/init')
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

/**
 * This is the listener for Server Sent Events
 *
 * @export
 * @param {string} { simple_id } twitter id of user for connection string
 */
export function* serverSentEventsSaga(simpleId) {
  try {
    const serverEventsListener = yield call(connectToServerEvents, simpleId)
    const serverEventsChannel = yield call(createServerEventChannel, serverEventsListener, simpleId)

    while (true) {
      const payload = yield take(serverEventsChannel)
      console.log('THERE IS AN EVENT: ', payload)
    }
  } catch (err) {
    console.error(err)
    if (err) {
      yield put(userActions.userError(err))
    }
  } finally {
    if (yield cancelled()) {
      yield call(serverEventsChannel.close)
    }
  }
}


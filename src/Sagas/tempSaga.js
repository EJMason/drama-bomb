import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { actions as tempActions } from '../Redux/temp'

export function* sagaTest() {
  try {
    yield call(delay, 300)
    yield put(tempActions.doneWait())
  } catch (err) {
    console.error('sagaTest Error')
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

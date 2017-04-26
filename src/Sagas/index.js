import { takeEvery } from 'redux-saga/effects'

/* ------------- Types ------------- */
import { types as tempTypes } from '../Redux/temp'
import { types as loginTypes } from '../Redux/Login'

/* ------------- Sagas ------------- */
import { sagaTest } from './tempSaga'
import { sagaInitSeq } from './authSaga'

/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
  yield [
    takeEvery(tempTypes.SAGA_WAIT, sagaTest),
    takeEvery(loginTypes.BEGIN_INIT_SEQUENCE, sagaInitSeq),
  ]
}

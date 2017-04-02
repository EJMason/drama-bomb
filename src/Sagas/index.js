import { takeEvery } from 'redux-saga/effects'

/* ------------- Types ------------- */
import { types as tempTypes } from '../Redux/temp'

/* ------------- Sagas ------------- */
import { sagaTest } from './tempSaga'

/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
  yield [
    takeEvery(tempTypes.SAGA_WAIT, sagaTest),
  ]
}

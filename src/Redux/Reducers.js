import { combineReducers } from 'redux'

import rootSaga from '../Sagas'
import configureStore from './CreateStore'

import temp from './temp'

export default () => {
  const rootReducer = combineReducers({
    temp,
  })
  return configureStore(rootReducer, rootSaga)
}

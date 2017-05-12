import { combineReducers } from 'redux'

import rootSaga from '../Sagas'
import configureStore from './CreateStore'

import temp from './temp'
import login from './Duck.Login'

export default history => {
  const rootReducer = combineReducers({
    temp,
    login,
  })
  return configureStore(rootReducer, rootSaga, history)
}
